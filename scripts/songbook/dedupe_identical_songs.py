#!/usr/bin/env python3
"""Merge canonical songs that are exact duplicates by normalized title/lyrics/artist/actions."""

from __future__ import annotations

import argparse
import hashlib
import re
import sqlite3
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path


def mechanical_fingerprint(value: str | None) -> str:
    if not value:
        return ""
    normalized = unicodedata.normalize("NFKD", value).casefold()
    normalized = "".join(character for character in normalized if not unicodedata.combining(character))
    return re.sub(r"\s+", " ", re.sub(r"[^\w]+", " ", normalized)).strip()


def merge_quality(row: sqlite3.Row) -> tuple[int, int, int, int]:
    return (
        1 if int(row.verified or 0) else 0,
        1 if (row.source_title or "").strip() else 0,
        1 if (row.markdown_path or "").strip() else 0,
        -row.id,
    )


@dataclass(frozen=True)
class Candidate:
    id: int
    title: str
    lyrics: str | None
    artist: str | None
    actions: str | None
    source_title: str | None
    markdown_path: str | None
    verified: int | bool | None


def collect_candidates(connection: sqlite3.Connection) -> list[list[Candidate]]:
    rows = connection.execute(
        """
        SELECT id, title, lyrics, artist, actions, source_title, markdown_path, verified
        FROM songs
        ORDER BY id
        """
    ).fetchall()
    groups: dict[tuple[str, str, str, str], list[Candidate]] = {}
    for row in map(lambda item: Candidate(*item), rows):
        key = (
            mechanical_fingerprint(row.title),
            mechanical_fingerprint(row.lyrics or ""),
            mechanical_fingerprint(row.artist or ""),
            mechanical_fingerprint(row.actions or ""),
        )
        groups.setdefault(key, []).append(row)
    return [group for group in groups.values() if len(group) > 1 and key_is_valid(group)]


def key_is_valid(group: list[Candidate]) -> bool:
    if not group:
        return False
    return bool(group[0].title.strip())


def keep_one(group: list[Candidate]) -> tuple[Candidate, list[Candidate]]:
    sorted_group = sorted(
        group,
        key=lambda row: merge_quality(row),
        reverse=True,
    )
    return sorted_group[0], sorted_group[1:]


def reattach_without_conflicts(connection: sqlite3.Connection, loser_id: int, keeper_id: int) -> None:
    if loser_id == keeper_id:
        return
    # song_sections has a uniqueness constraint on (song_id, sort_order).
    connection.execute(
        """
        DELETE FROM song_sections
        WHERE song_id = ?
          AND EXISTS (
            SELECT 1 FROM song_sections AS keeper
            WHERE keeper.song_id = ? AND keeper.sort_order = song_sections.sort_order
          )
        """,
        (loser_id, keeper_id),
    )
    # song_sources has uniqueness on (song_id, source_document_id, relationship).
    connection.execute(
        """
        DELETE FROM song_sources
        WHERE song_id = ?
          AND EXISTS (
            SELECT 1 FROM song_sources AS keeper
            WHERE keeper.song_id = ?
              AND keeper.source_document_id = song_sources.source_document_id
              AND keeper.relationship = song_sources.relationship
          )
        """,
        (loser_id, keeper_id),
    )
    for table in ("song_actions", "song_curriculum_links", "song_recordings", "song_sections", "song_sources"):
        connection.execute(f"UPDATE {table} SET song_id = ? WHERE song_id = ?", (keeper_id, loser_id))


def dedupe_songs(connection: sqlite3.Connection, dry_run: bool) -> tuple[int, int, list[dict[str, object]]]:
    groups = collect_candidates(connection)
    merged = 0
    songs_deleted = 0
    details: list[dict[str, object]] = []
    if not groups:
        return merged, songs_deleted, details

    for group in groups:
        keeper, losers = keep_one(group)
        merged += len(losers)
        loser_ids = [row.id for row in losers]
        details.append({"keeper": keeper.id, "merged_from": loser_ids})
        if dry_run:
            continue
        for loser_id in loser_ids:
            reattach_without_conflicts(connection, loser_id, keeper.id)
            connection.execute("DELETE FROM songs WHERE id = ?", (loser_id,))
            songs_deleted += 1

    return merged, songs_deleted, details


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--apply", action="store_true", help="Persist dedupe merges; default is dry-run preview.")
    args = parser.parse_args()

    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        merged, songs_deleted, details = dedupe_songs(connection, dry_run=not args.apply)
        if args.apply:
            violations = connection.execute("PRAGMA foreign_key_check").fetchall()
            if violations:
                raise RuntimeError(f"foreign-key check failed: {violations}")
            connection.commit()
            connection.execute(
                """
                INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
                VALUES (?, CURRENT_TIMESTAMP, 'SONG_DEDUP', 'NOT_APPLICABLE', 'NOT_APPLICABLE')
                ON CONFLICT(migration_id) DO NOTHING
                """,
                ("dedupe-identical-songs",),
            )
        print(
            json_payload({
                "dry_run": not args.apply,
                "duplicate_groups": merged,
                "deleted_songs": songs_deleted,
                "details": details[:25],
            })
        )
    finally:
        if args.apply:
            connection.commit()
        connection.close()
    return 0


def json_payload(payload: dict[str, object]) -> str:
    import json
    return json.dumps(payload, indent=2)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, sqlite3.Error, ValueError) as error:
        print(f"dedupe identical songs: {error}", file=sys.stderr)
        raise SystemExit(2)
