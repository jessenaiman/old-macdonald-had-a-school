#!/usr/bin/env python3
"""Attach mechanical exact-duplicate song transcriptions in deterministic batches.

This script is intentionally narrow:
- Reads markdown sources from a directory.
- Detects exact-duplicate candidates using existing fingerprint logic.
- Inserts research-wip transcription/source links for exact matches.
- Records one import batch for auditability.

It does not edit canonical lyrics, chords, or actions.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from pathlib import Path
from typing import Any

from scripts.songbook.plan_song_import import (
    collect_source_paths,
    load_songs,
    has_redundant_family_attachment,
    parse_frontmatter,
    plan_candidate,
    source_family_key,
    resolved_library_pdf_candidates,
    project_relative,
    read_text,
    sha256,
)
from scripts.resources.library_pdf_tracker import mark_library_pdf_processed
from scripts.safety_guard import check_runtime, install_runtime_guard, maybe_add_runtime_argument


def ensure_source(connection: sqlite3.Connection, source_path: str, source_kind: str) -> int:
    absolute_path = Path(source_path)
    checksum = sha256(absolute_path)
    connection.execute(
        """
        INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at)
        VALUES (?, ?, COALESCE((SELECT review_state FROM source_documents WHERE source_path = ?), 'research_wip'), ?, CURRENT_TIMESTAMP)
        ON CONFLICT(source_path) DO UPDATE SET
          source_kind = excluded.source_kind,
          checksum = excluded.checksum,
          imported_at = excluded.imported_at
        """,
        (source_path, source_kind, source_path, checksum),
    )
    return connection.execute(
        "SELECT id FROM source_documents WHERE source_path = ?", (source_path,)
    ).fetchone()[0]


def mark_scanned_library_pdf(source_path: Path, project_root: Path) -> None:
    # Keep scan progress moving: raw/invalid transcriptions can still be
    # treated as scanned for source-file hygiene.
    mark_library_pdf_processed(source_path, project_root)

    try:
        frontmatter, _ = parse_frontmatter(read_text(source_path))
    except Exception:
        frontmatter = {}

    source_file = frontmatter.get("source_file", "")
    if not source_file:
        return

    for source_pdf in resolved_library_pdf_candidates(source_file, project_root):
        mark_library_pdf_processed(source_pdf, project_root)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-directory", required=True, type=Path)
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--batch-id", required=True)
    parser.add_argument("--offset", type=int, default=0, help="Index offset into sorted source listing.")
    parser.add_argument("--batch-size", type=int, default=25)
    maybe_add_runtime_argument(parser, default_seconds=60)
    args = parser.parse_args()

    project_root = args.project_root.resolve()
    source_root = args.source_directory.resolve()
    source_paths = sorted(collect_source_paths([], [source_root]))
    source_paths = source_paths[args.offset : args.offset + args.batch_size]

    if not source_paths:
        raise ValueError("No source files discovered")

    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    connection.execute("PRAGMA busy_timeout = 5000")

    try:
        guard = install_runtime_guard("process_song_exact_batch", args.max_runtime_seconds)
        songs = load_songs(connection)
        processed = 0
        exact = 0
        skipped = 0
        linked = 0
        missing_pdf = 0

        if connection.execute(
            "SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)
        ).fetchone():
            raise ValueError(f"Batch '{args.batch_id}' already used.")

        with connection:
            if connection.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)).fetchone():
                raise ValueError(f"Batch '{args.batch_id}' already used.")

            if not connection.execute(
                "SELECT 1 FROM schema_migrations WHERE migration_id = ?", (args.batch_id,)
            ).fetchone():
                connection.execute(
                    """
                    INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
                    VALUES (?, CURRENT_TIMESTAMP, 'DATA_IMPORT', 'NOT_APPLICABLE', 'NOT_APPLICABLE')
                    """,
                    (args.batch_id,),
                )

            for source_path in source_paths:
                if check_runtime(guard):
                    break
                if processed >= args.batch_size:
                    break

                mark_scanned_library_pdf(source_path, project_root)
                candidate = plan_candidate(source_path, project_root, songs)
                pdfs = resolved_library_pdf_candidates(candidate.source_file, project_root)
                processed += 1

                if candidate.classification != "exact-duplicate" or candidate.canonical_song_id is None:
                    skipped += 1
                    continue

                exact += 1
                relative_source = project_relative(source_path, project_root)
                source_id = ensure_source(connection, relative_source, "markdown")
                source_family = candidate.source_family or source_family_key({"source_file": candidate.source_file}, relative_source)
                has_transcription = has_redundant_family_attachment(
                    connection,
                    candidate.canonical_song_id,
                    "transcription",
                    source_family,
                    candidate.source_author,
                    candidate.source_version,
                    candidate.source_action_signature,
                    project_root,
                )
                has_primary = has_redundant_family_attachment(
                    connection,
                    candidate.canonical_song_id,
                    "primary",
                    source_family,
                    candidate.source_author,
                    candidate.source_version,
                    candidate.source_action_signature,
                    project_root,
                )
                if has_transcription and has_primary:
                    skipped += 1
                    continue

                if not has_transcription:
                    connection.execute(
                    """
                    INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
                    VALUES (?, ?, 'transcription', ?, ?)
                    ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
                      locator = excluded.locator,
                      evidence_note = excluded.evidence_note
                    """,
                        (
                            candidate.canonical_song_id,
                            source_id,
                            "Unreviewed transcription",
                            "Exact normalized title-and-lyrics match. Source remains research_wip.",
                        ),
                    )
                    linked += 1

                if len(pdfs) == 1 and not has_primary:
                    pdf_path = pdfs[0]
                    pdf_rel = project_relative(pdf_path, project_root)
                    pdf_id = ensure_source(connection, pdf_rel, "pdf")
                    connection.execute(
                        """
                        INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
                        VALUES (?, ?, 'primary', ?, ?)
                        ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
                          locator = excluded.locator,
                          evidence_note = excluded.evidence_note
                        """,
                        (
                            candidate.canonical_song_id,
                            pdf_id,
                            candidate.page_section or "unreviewed source locator",
                            "Exact normalized title-and-lyrics match. Original source PDF attached for traceability.",
                        ),
                    )
                    linked += 1
                else:
                    missing_pdf += 1

                connection.execute(
                    "INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at) VALUES (?, ?, 'research_wip', ?, CURRENT_TIMESTAMP) ON CONFLICT(source_path) DO NOTHING",
                    (relative_source, "markdown", sha256(source_path)),
                )
                linked += 1

            connection.execute(
                """
                INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (
                    args.batch_id,
                    f"song-exact-batch-{args.batch_id}",
                    str(args.source_directory),
                    hashlib.sha256((str(args.source_directory)).encode("utf-8")).hexdigest().upper(),
                ),
            )

            foreign_key_issues = connection.execute("PRAGMA foreign_key_check").fetchall()
            if foreign_key_issues:
                raise RuntimeError(f"foreign key violations: {foreign_key_issues}")

        print(json.dumps({
            "batch_id": args.batch_id,
            "processed": processed,
            "exact": exact,
            "skipped": skipped,
            "linked": linked,
            "missing_pdf": missing_pdf,
        }, indent=2))
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (KeyboardInterrupt, TimeoutError, OSError, sqlite3.Error) as error:
        print(f"process_song_exact_batch stopped: {error}", file=sys.stderr)
        raise SystemExit(130)
