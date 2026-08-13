#!/usr/bin/env python3
"""Attach mechanically exact, unreviewed transcription evidence in one transaction.

Input is JSONL produced by prepare_song_evidence.py. This script never edits a
canonical song, lyric, action, chord, or source review state. It only links an
existing research_wip source document to an exact canonical song as a
transcription, then records a database import batch for auditability.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from pathlib import Path
from typing import Any
from scripts.safety_guard import check_runtime, install_runtime_guard, maybe_add_runtime_argument


def manifest_digest(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def load_records(path: Path) -> list[dict[str, Any]]:
    records = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    invalid = [record for record in records if not (
        record.get("schema_version") == 1
        and record.get("classification") == "exact-duplicate"
        and record.get("exact_unreviewed_attachment") is True
        and isinstance(record.get("canonical_song_id"), int)
        and isinstance(record.get("source_path"), str)
    )]
    if invalid:
        raise ValueError(f"Manifest contains {len(invalid)} non-exact or malformed records")
    return records


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--batch-id", required=True)
    parser.add_argument("--apply", action="store_true")
    maybe_add_runtime_argument(parser, default_seconds=180)
    args = parser.parse_args()

    records = load_records(args.manifest)
    guard = install_runtime_guard("apply_exact_transcription_links", args.max_runtime_seconds)
    database = sqlite3.connect(args.db)
    try:
        database.execute("PRAGMA foreign_keys = ON")
        if database.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)).fetchone():
            raise ValueError(f"Batch {args.batch_id} was already recorded")
        existing_song_ids = {row[0] for row in database.execute("SELECT id FROM songs")}
        missing_songs = sorted({record["canonical_song_id"] for record in records} - existing_song_ids)
        if missing_songs:
            raise ValueError(f"Manifest references missing songs: {missing_songs[:10]}")
        states = {
            row[0]: row[1]
            for row in database.execute(
                "SELECT source_path, review_state FROM source_documents WHERE source_path IN (%s)" % ",".join("?" * len(records)),
                [record["source_path"] for record in records],
            )
        }
        missing_sources = [record["source_path"] for record in records if record["source_path"] not in states]
        if missing_sources:
            raise ValueError(f"Manifest sources are not registered: {missing_sources[:5]}")
        if not args.apply:
            print(json.dumps({"dry_run": True, "records": len(records), "batch_id": args.batch_id, "states": sorted(set(states.values()))}, indent=2))
            return 0
        attached = 0
        with database:
            database.execute(
                "INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256) VALUES (?, CURRENT_TIMESTAMP, 'DATA_IMPORT', 'NOT_APPLICABLE', 'NOT_APPLICABLE')",
                (args.batch_id,),
            )
            for record in records:
                if check_runtime(guard):
                    break
                source_id = database.execute("SELECT id FROM source_documents WHERE source_path = ?", (record["source_path"],)).fetchone()[0]
                cursor = database.execute(
                    """INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
                    VALUES (?, ?, 'transcription', ?, ?)
                    ON CONFLICT(song_id, source_document_id, relationship) DO NOTHING""",
                    (
                        record["canonical_song_id"],
                        source_id,
                        "Unreviewed local transcription",
                        "Mechanical normalized title-and-lyrics match. Source remains research_wip; no canonical content was changed.",
                    ),
                )
                attached += cursor.rowcount
            database.execute(
                "INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (args.batch_id, "mechanical exact unreviewed transcription links", str(args.manifest), manifest_digest(args.manifest)),
            )
            violations = database.execute("PRAGMA foreign_key_check").fetchall()
            if violations:
                raise RuntimeError(f"Foreign-key check failed: {violations}")
        print(json.dumps({"dry_run": False, "records": len(records), "attached": attached, "already_linked": len(records) - attached, "batch_id": args.batch_id}, indent=2))
    finally:
        database.close()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, sqlite3.Error) as error:
        print(f"exact transcription importer: {error}", file=sys.stderr)
        raise SystemExit(2)
