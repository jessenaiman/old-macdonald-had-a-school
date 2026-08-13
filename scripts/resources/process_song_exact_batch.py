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
from pathlib import Path
from typing import Any

from scripts.songbook.plan_song_import import (
    collect_source_paths,
    load_songs,
    plan_candidate,
    project_relative,
    sha256,
    source_pdf_candidates,
)


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


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-directory", required=True, type=Path)
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--batch-id", required=True)
    parser.add_argument("--offset", type=int, default=0, help="Index offset into sorted source listing.")
    parser.add_argument("--batch-size", type=int, default=25)
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
                if processed >= args.batch_size:
                    break

                candidate = plan_candidate(source_path, project_root, songs)
                processed += 1

                if candidate.classification != "exact-duplicate" or candidate.canonical_song_id is None:
                    skipped += 1
                    continue

                exact += 1
                relative_source = project_relative(source_path, project_root)
                source_id = ensure_source(connection, relative_source, "markdown")

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

                pdfs = source_pdf_candidates(candidate.source_file, project_root)
                if len(pdfs) == 1:
                    pdf_rel = project_relative(pdfs[0], project_root)
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
    raise SystemExit(main())
