#!/usr/bin/env python3
"""Export compact, read-only song packets for factual and educational review."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


def rows(cursor: sqlite3.Cursor) -> list[dict[str, object]]:
    return [dict(row) for row in cursor.fetchall()]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--song-id", type=int, action="append", required=True)
    parser.add_argument("--mode", choices=("factual", "educational"), required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    ids = sorted(set(args.song_id))
    placeholders = ",".join("?" for _ in ids)
    database = sqlite3.connect(f"file:{args.db.as_posix()}?mode=ro", uri=True)
    database.row_factory = sqlite3.Row
    try:
        songs = rows(database.execute(
            f"""SELECT id, title, artist, lyrics, instructions, actions, verified,
                       type, educational_domain, materials_needed, tags,
                       curriculum_links, early_years_links
                FROM songs WHERE id IN ({placeholders}) ORDER BY id""",
            ids,
        ))
        found = {int(song["id"]) for song in songs}
        missing = sorted(set(ids) - found)
        if missing:
            raise ValueError(f"Unknown song IDs: {missing}")

        packet: dict[str, object] = {
            "schema_version": 1,
            "mode": args.mode,
            "rules": (
                [
                    "Preserve source wording and LF line breaks.",
                    "Move continuation prompts, substitutions, and repeat suggestions out of lyrics and into actions.",
                    "Flag neighboring-song contamination, OCR uncertainty, and unsupported precision.",
                    "Do not invent lyrics, actions, chords, source facts, or corrections.",
                ]
                if args.mode == "factual"
                else [
                    "Use existing tag and topic IDs whenever suitable.",
                    "Return new_tag_candidates separately; never silently expand the vocabulary.",
                    "Grade organizes curriculum; age range is supplementary context.",
                    "Every topic link needs a concise teacher-facing rationale grounded in the song.",
                    "Prefer useful standalone-song retrieval when no lesson connection is justified.",
                ]
            ),
            "songs": songs,
        }
        packet["sections"] = rows(database.execute(
            f"SELECT * FROM song_sections WHERE song_id IN ({placeholders}) ORDER BY song_id, sort_order",
            ids,
        ))
        packet["actions"] = rows(database.execute(
            f"""SELECT id, song_id, section_id, line_number, action_wording,
                       normalized_action, action_sequence, song_cue,
                       action_classification, evidence_note, research_status, provenance
                FROM song_actions WHERE song_id IN ({placeholders}) ORDER BY song_id, id""",
            ids,
        ))
        packet["sources"] = rows(database.execute(
            f"""SELECT ss.song_id, sd.source_path, sd.source_kind, sd.review_state,
                       sd.checksum, ss.relationship, ss.locator, ss.evidence_note
                FROM song_sources ss JOIN source_documents sd ON sd.id = ss.source_document_id
                WHERE ss.song_id IN ({placeholders}) ORDER BY ss.song_id, sd.source_path""",
            ids,
        ))

        if args.mode == "educational":
            packet["controlled_vocabulary"] = {
                "grades": rows(database.execute("SELECT id, key, label FROM grades ORDER BY sort_order")),
                "tags": rows(database.execute("SELECT id, parent_tag_id, name, definition FROM tags ORDER BY name")),
                "topics": rows(database.execute(
                    """SELECT t.id, t.category, t.topic, t.skill, t.circle_time,
                              group_concat(DISTINCT g.label) AS grades
                       FROM topics t
                       LEFT JOIN topic_grades tg ON tg.topic_id = t.id
                       LEFT JOIN grades g ON g.id = tg.grade_id
                       WHERE t.merged_into IS NULL
                       GROUP BY t.id ORDER BY t.id"""
                )),
            }

        output = json.dumps(packet, ensure_ascii=False, indent=2) + "\n"
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(output, encoding="utf-8", newline="\n")
        else:
            print(output, end="")
    finally:
        database.close()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, sqlite3.Error) as error:
        print(f"review packet export failed: {error}")
        raise SystemExit(2)
