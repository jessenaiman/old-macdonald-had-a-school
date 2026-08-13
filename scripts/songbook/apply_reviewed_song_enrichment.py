#!/usr/bin/env python3
"""Apply one reviewed, source-backed retrieval enrichment to a canonical song."""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from pathlib import Path


if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.songbook.plan_song_import import source_pdf_visual_evidence_ready


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def project_relative(path: Path, root: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def add_keyword(existing: str | None, keyword: str) -> str:
    values = [value.strip() for value in (existing or "").split(",") if value.strip()]
    if keyword.casefold() not in {value.casefold() for value in values}:
        values.append(keyword)
    return ", ".join(values)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--song-id", type=int, required=True)
    parser.add_argument("--source-pdf", type=Path, required=True)
    parser.add_argument("--page", type=int, required=True)
    parser.add_argument("--evidence-note", required=True)
    parser.add_argument("--keyword", required=True)
    parser.add_argument("--topic-id", type=int, required=True)
    parser.add_argument("--teacher-rationale", required=True)
    parser.add_argument("--batch-id", required=True)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    if args.page < 1:
        raise ValueError("page must be positive")
    source_pdf = args.source_pdf.resolve()
    if not source_pdf.is_file():
        raise ValueError(f"missing source PDF: {source_pdf}")
    root = args.project_root.resolve()
    source_path = project_relative(source_pdf, root)
    payload = {
        "batch_id": args.batch_id,
        "song_id": args.song_id,
        "source_path": source_path,
        "locator": f"p. {args.page}",
        "keyword": args.keyword,
        "topic_id": args.topic_id,
    }
    if not args.apply:
        print(json.dumps({"status": "dry-run", **payload}, indent=2))
        return 0

    connection = sqlite3.connect(args.db)
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        if connection.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)).fetchone():
            raise ValueError(f"batch already used: {args.batch_id}")
        song = connection.execute("SELECT title, tags FROM songs WHERE id = ?", (args.song_id,)).fetchone()
        if song is None:
            raise ValueError(f"unknown song id: {args.song_id}")
        if connection.execute("SELECT 1 FROM topics WHERE id = ?", (args.topic_id,)).fetchone() is None:
            raise ValueError(f"unknown topic id: {args.topic_id}")
        if not source_pdf_visual_evidence_ready(connection, source_pdf, f"p. {args.page}", root):
            raise ValueError("source page lacks required reviewed visual evidence")

        source_rows = connection.execute(
            """
            SELECT id, source_path FROM source_documents
            WHERE source_kind = 'pdf'
              AND lower(replace(source_path, '\\', '/')) LIKE ?
            """,
            (f"%/{source_pdf.name.casefold()}",),
        ).fetchall()
        if len(source_rows) != 1:
            raise ValueError(f"expected one source document for {source_pdf.name}, found {len(source_rows)}")
        source_document_id = source_rows[0][0]

        with connection:
            connection.execute(
                """
                INSERT INTO schema_migrations
                  (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
                VALUES (?, CURRENT_TIMESTAMP, 'DATA_IMPORT', 'NOT_APPLICABLE', 'NOT_APPLICABLE')
                """,
                (args.batch_id,),
            )
            relation = connection.execute(
                """
                SELECT 1 FROM song_sources
                WHERE song_id = ? AND source_document_id = ? AND relationship = 'primary'
                """,
                (args.song_id, source_document_id),
            ).fetchone()
            if relation is None:
                connection.execute(
                    """
                    INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
                    VALUES (?, ?, 'primary', ?, ?)
                    """,
                    (args.song_id, source_document_id, f"p. {args.page}", args.evidence_note),
                )
            else:
                connection.execute(
                    """
                    UPDATE song_sources SET locator = ?, evidence_note = ?
                    WHERE song_id = ? AND source_document_id = ? AND relationship = 'primary'
                    """,
                    (f"p. {args.page}", args.evidence_note, args.song_id, source_document_id),
                )

            connection.execute(
                "UPDATE songs SET tags = ? WHERE id = ?",
                (add_keyword(song[1], args.keyword), args.song_id),
            )
            connection.execute(
                """
                INSERT INTO topic_materials
                  (topic_id, material_kind, material_id, role, teacher_rationale)
                VALUES (?, 'song', ?, 'supporting', ?)
                ON CONFLICT(topic_id, material_kind, material_id) DO UPDATE SET
                  teacher_rationale = excluded.teacher_rationale
                """,
                (args.topic_id, args.song_id, args.teacher_rationale),
            )
            connection.execute(
                """
                INSERT INTO import_batches
                  (migration_id, source_name, source_path, source_sha256, imported_at)
                VALUES (?, 'reviewed_song_enrichment', ?, ?, CURRENT_TIMESTAMP)
                """,
                (args.batch_id, source_path, sha256(source_pdf)),
            )
            violations = connection.execute("PRAGMA foreign_key_check").fetchall()
            if violations:
                raise RuntimeError(f"foreign key violations: {violations}")

        print(json.dumps({"status": "applied", "title": song[0], **payload}, indent=2))
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, sqlite3.Error) as error:
        print(f"apply_reviewed_song_enrichment: {error}", file=sys.stderr)
        raise SystemExit(2)
