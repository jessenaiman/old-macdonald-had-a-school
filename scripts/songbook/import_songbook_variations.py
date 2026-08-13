#!/usr/bin/env python3
"""Attach likely title-matching song variations without creating duplicate canonicals.

This importer is intentionally conservative. It:
- scans markdown transcription files
- classifies each file with existing deterministic matching rules
- links only single-title matches where lyrics differ (material variation)
- records the transcription as an `arrangement` source

It does not create new rows in `songs`; duplicates are avoided unless we can
confidently place a source under exactly one title-matched canonical song.
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
    mechanical_fingerprint,
    plan_candidate,
    project_relative,
    source_family_key,
    resolved_library_pdf_candidates,
)
from scripts.safety_guard import check_runtime, install_runtime_guard, maybe_add_runtime_argument


def ensure_source(connection: sqlite3.Connection, source_path: str, source_kind: str) -> int:
    checksum = hashlib.sha256(Path(source_path).read_bytes()).hexdigest().upper()
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
    return connection.execute("SELECT id FROM source_documents WHERE source_path = ?", (source_path,)).fetchone()[0]


def matching_song_for_variation(title: str, songs: list[Any]) -> int | None:
    title_key = mechanical_fingerprint(title)
    matches = [song.id for song in songs if mechanical_fingerprint(song.title) == title_key]
    if len(matches) != 1:
        return None
    return matches[0]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", nargs="*", type=Path, help="Song markdown files to evaluate.")
    parser.add_argument(
        "--source-directory",
        action="append",
        type=Path,
        default=[Path("docs/early-years-music-resources/song_versions")],
    )
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--batch-id", required=True)
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--batch-size", type=int, default=250)
    parser.add_argument("--min-lyric-lines", type=int, default=2, help="Ignore very short or malformed transcriptions.")
    maybe_add_runtime_argument(parser, default_seconds=180)
    args = parser.parse_args()

    if args.batch_size <= 0:
        raise ValueError("batch-size must be positive")
    if args.min_lyric_lines < 1:
        raise ValueError("min-lyric-lines must be at least 1")

    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        guard = install_runtime_guard("import_songbook_variations", args.max_runtime_seconds)
        project_root = args.project_root.resolve()
        connection_source = connection.execute("SELECT 1 FROM schema_migrations WHERE migration_id = ?", (args.batch_id,)).fetchone()
        if connection_source:
            raise ValueError(f"Batch '{args.batch_id}' was already used.")

        source_paths = collect_source_paths(args.source, args.source_directory)
        if args.offset:
            source_paths = source_paths[args.offset:]
        source_paths = source_paths[: args.batch_size]
        if not source_paths:
            raise ValueError("No source files discovered")

        songs = load_songs(connection)
        processed = 0
        examined = 0
        attached = 0
        skipped = {"not_candidate": 0, "too_short": 0, "ambiguous_title": 0, "no_pdf": 0, "already_linked": 0}

        with connection:
            connection.execute("INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256) VALUES (?, CURRENT_TIMESTAMP, 'VARIANTS', 'NOT_APPLICABLE', 'NOT_APPLICABLE')", (args.batch_id,))

            for path in source_paths:
                if check_runtime(guard):
                    break
                examined += 1
                candidate = plan_candidate(path, project_root, songs)
                if candidate.classification != "material-variation-review":
                    skipped["not_candidate"] += 1
                    continue
                if candidate.lyric_line_count < args.min_lyric_lines:
                    skipped["too_short"] += 1
                    continue
                if not candidate.source_file:
                    skipped["no_pdf"] += 1
                    continue

                canonical_song_id = matching_song_for_variation(candidate.title, songs)
                if canonical_song_id is None:
                    skipped["ambiguous_title"] += 1
                    continue

                source_family = candidate.source_family or source_family_key({"source_file": candidate.source_file}, str(project_relative(path, project_root)))
                if has_redundant_family_attachment(
                    connection,
                    canonical_song_id,
                    "arrangement",
                    source_family,
                    candidate.source_author,
                    candidate.source_version,
                    candidate.source_action_signature,
                    project_root,
                ):
                    skipped["already_linked"] += 1
                    processed += 1
                    continue

                markdown_rel = project_relative(path, project_root)
                markdown_id = ensure_source(connection, markdown_rel, "markdown")
                arrangement_note = (
                    "Mechanical title-match with lyric-difference; treated as variant arrangement "
                    "under existing canonical to avoid duplicate canonical records."
                )

                cursor = connection.execute(
                    """
                    INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
                    VALUES (?, ?, 'arrangement', ?, ?)
                    ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
                      locator = excluded.locator,
                      evidence_note = excluded.evidence_note
                    """,
                    (
                        canonical_song_id,
                        markdown_id,
                        f"Source locator: {candidate.page_section or 'unknown'}",
                        arrangement_note,
                    ),
                )
                if cursor.rowcount:
                    attached += 1
                else:
                    skipped["already_linked"] += 1

                # Keep source-document coverage parity with searchable PDF assets.
                pdfs = resolved_library_pdf_candidates(candidate.source_file, project_root)
                if len(pdfs) == 1:
                    pdf_rel = project_relative(pdfs[0], project_root)
                    pdf_id = ensure_source(connection, pdf_rel, "pdf")
                    pdf_row = connection.execute(
                        """
                        INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
                        VALUES (?, ?, 'arrangement', ?, ?)
                        ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
                          locator = excluded.locator,
                          evidence_note = excluded.evidence_note
                        """,
                        (
                            canonical_song_id,
                            pdf_id,
                            f"Source locator: {candidate.page_section or 'unknown'}",
                            arrangement_note,
                        ),
                    )
                    attached += 1 if pdf_row.rowcount else 0
                elif len(pdfs) > 1:
                    skipped["no_pdf"] += 1
                processed += 1

            connection.execute(
                "INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (args.batch_id, "song_variation_arrangements", "docs/early-years-music-resources/song_versions", hashlib.sha256((str(args.source)).encode("utf-8")).hexdigest().upper()),
            )
            violations = connection.execute("PRAGMA foreign_key_check").fetchall()
            if violations:
                raise RuntimeError(f"Foreign-key check failed: {violations}")

        print(json.dumps({
            "batch_id": args.batch_id,
            "offset": args.offset,
            "batch_size": args.batch_size,
            "examined": examined,
            "processed": processed,
            "attached_rows": attached,
            "skipped": skipped,
        }, indent=2))
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, TimeoutError, ValueError, sqlite3.Error) as error:
        print(f"song variation importer: {error}", file=sys.stderr)
        raise SystemExit(2)
