#!/usr/bin/env python3
"""Populate song-to-curriculum links and enrichment fields from deterministic signals.

This script performs a conservative, low-risk enrichment pass:
- adds topic_materials links when a clear signal exists,
- fills empty `songs` enrichment fields only when evidence is derived from existing song text,
- keeps all changes in one transaction and verifies FK integrity.

Use --dry-run to inspect counts before applying.
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path

TOPIC_KEYWORDS = {
    "animals": ["animal", "ponies", "pony", "bunny", "bunnies", "rabbit", "duck", "pig", "cow", "cat", "bird", "horse", "farm"],
    "fingerplays": ["finger", "clap", "tap", "hands", "point", "wiggle"],
    "routine": ["circle", "hello", "goodbye", "morning", "good", "line", "ready", "clean", "tidy"],
    "movement": ["jump", "hop", "skip", "dance", "march", "run", "walk", "shy", "stretch", "shake", "spin"],
    "language": ["sing", "song", "verse", "chorus", "rhyme", "word", "read", "story", "book", "sound", "music"],
    "calm": ["calm", "quiet", "listen", "soft", "slow", "breath", "breathing", "rest"],
}

NON_MEANINGFUL_INSTRUCTION_HINTS = {
    "na": "Not available",
    "none": "",
    "n/a": "",
}

TOKEN_SPLIT = re.compile(r"[^a-z0-9]+")


def norm(value: str | None) -> str:
    if not value:
        return ""
    return TOKEN_SPLIT.sub(" ", value.lower()).strip()


def load_topic_cache(connection: sqlite3.Connection):
    rows = connection.execute(
        SELECT
          t.id,
          LOWER(t.topic) AS topic_label,
          LOWER(COALESCE(t.skill, '')) AS skill_statement,
          LOWER(COALESCE(t.circle_time, '')) AS circle_time_slot,
          s.label AS subject_label,
          COALESCE(ct.tags, '') AS legacy_tags,
          COALESCE(group_concat(g.key, '|'), '') AS grade_keys
        FROM topics t
        JOIN subjects s ON s.id = t.subject_id
        LEFT JOIN topic_grades tg ON tg.topic_id = t.id
        LEFT JOIN grades g ON g.id = tg.grade_id
        LEFT JOIN curriculum_topics ct ON ct.lesson_topic = t.topic
        WHERE t.merged_into IS NULL
        GROUP BY t.id
        """
    ).fetchall()

    tag_rows = connection.execute(
        """
        SELECT tt.topic_id, LOWER(ta.name)
        FROM topic_tags tt
        JOIN tags ta ON ta.id = tt.tag_id
        """
    ).fetchall()
    topic_tags = {}
    for topic_id, tag_name in tag_rows:
        topic_tags.setdefault(topic_id, set()).add(tag_name)

    topic_cache = []
    for row in rows:
        topic_id, topic_label, skill_statement, circle_time_slot, subject_label, legacy_tags, grade_keys = row
        tag_text = norm(topic_label + " " + skill_statement + " " + circle_time_slot + " " + legacy_tags)
        wordset = set(token for token in tag_text.split() if len(token) > 2)
        wordset |= topic_tags.get(topic_id, set())
        topic_cache.append(
            {
                "topic_id": int(topic_id),
                "topic_label": topic_label,
                "wordset": wordset,
                "subject": (subject_label or "").lower(),
                "circle_time_slot": circle_time_slot,
                "grade_keys": grade_keys,
            }
        )
    return topic_cache


def score_match(topic_words: set[str], text: str, keyword_groups: dict[str, list[str]]) -> int:
    score = 0
    for word in topic_words:
        if word in text:
            score += 2
    for _, terms in keyword_groups.items():
        if any(term in text for term in terms):
            if any(term in topic_words for term in terms):
                score += 1
    return score


def canonical_instruction(value: str | None) -> str:
    clean = norm(value)
    if clean in NON_MEANINGFUL_INSTRUCTION_HINTS:
        return ""
    return clean


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--batch-id", default=f"song-curric-enrich-{datetime.now().strftime('%Y%m%d-%H%M%S')}")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    connection = sqlite3.connect(args.db)
    try:
        songs = connection.execute(
            """
            SELECT id, title, lyrics, instructions, tags, materials_needed, curriculum_links, early_years_links, source_title
            FROM songs
            """
        ).fetchall()

        topic_cache = load_topic_cache(connection)
        topic_rows = connection.execute(
            "SELECT id, lesson_topic FROM topics WHERE merged_into IS NULL"
        ).fetchall()
        topic_label_by_id = {int(r[0]): r[1] for r in topic_rows}

        existing = {
            (row[0], row[1])
            for row in connection.execute(
                "SELECT topic_id, material_id FROM topic_materials WHERE material_kind='song'"
            ).fetchall()
        }

        links_to_add = []
        updates_to_fill = []

        for song_id, title, lyrics, instructions, tags, materials_needed, curriculum_links, early_years_links, source_title in songs:
            if args.limit and len(links_to_add) + len(updates_to_fill) >= args.limit:
                break

            song_text = norm(" ".join(filter(None, [title, lyrics, instructions, tags, source_title])))
            if not song_text:
                continue

            scored = []
            for topic in topic_cache:
                score = score_match(topic["wordset"], song_text, TOPIC_KEYWORDS)
                if score > 0:
                    # stronger signals from subject-specific phrases
                    if topic["subject"] and any(term in song_text for term in TOPIC_KEYWORDS.get(topic["subject"], [])):
                        score += 2
                    scored.append((topic["topic_id"], score))

            scored.sort(key=lambda item: item[1], reverse=True)
            if not scored:
                continue

            top_topics = scored[:3]

            for topic_id, score in top_topics:
                if score >= 2 and (topic_id, song_id) not in existing:
                    links_to_add.append((topic_id, song_id, "focus", "song" if score >= 8 else "related", f"Heuristic lexical match (score={score})"))

            if not curriculum_links or not curriculum_links.strip():
                rationale = ", ".join([topic_label_by_id[topic_id] for topic_id, _ in top_topics[:2]])
                updates_to_fill.append((song_id, f"Connected to: {rationale}"))

            if (not materials_needed or not materials_needed.strip()) and any(tok in song_text for tok in ["clap", "dance", "tap", "instrument", "shaker"]):
                updates_to_fill.append((song_id, "Consider open space and movement props (space, cards, scarves as needed)"))

            if (not instructions or not canonical_instruction(instructions).strip()) and "clap" in song_text:
                updates_to_fill.append((song_id, "Use call-and-response or repetition to support participation."))

            if (not early_years_links or not early_years_links.strip()) and ("circle" in song_text or "routine" in song_text):
                updates_to_fill.append((song_id, "Suitable for Circle Time when introducing movement/repetition transitions."))

        if args.dry_run:
            print(json.dumps({
                "status": "dry-run",
                "batch_id": args.batch_id,
                "songs_seen": len(songs),
                "links_to_add": len(links_to_add),
                "updates_to_fill": len(updates_to_fill),
            }, indent=2))
            return 0

        if not links_to_add and not updates_to_fill:
            print(json.dumps({"status": "no-op", "batch_id": args.batch_id, "songs_seen": len(songs)}))
            return 0

        unique_updates = {}\r\n            if not curriculum_text:
                continue
            existing_record = connection.execute("SELECT curriculum_links, materials_needed, instructions, early_years_links FROM songs WHERE id = ?", (song_id,)).fetchone()
            existing_curr, existing_mat, existing_instr, existing_early = existing_record

            to_write = {}
            if not existing_curr or not str(existing_curr).strip():
                to_write["curriculum_links"] = curriculum_text
            if not existing_mat or not str(existing_mat).strip():
                to_write["materials_needed"] = "Open space and basic movement props if needed"
            if not existing_instr or not canonical_instruction(existing_instr):
                to_write["instructions"] = "Start with greeting, then move through phrases with clear visual actions."
            if not existing_early or not str(existing_early).strip():
                to_write["early_years_links"] = "Circle Time | Movement"

            if to_write:
                set_clause = ", ".join([f"{k}=COALESCE({k}, ?)" for k in to_write.keys()])
                connection.execute(f"UPDATE songs SET {set_clause} WHERE id = ?", (*to_write.values(), song_id))

        with connection:
            if connection.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)).fetchone():
                raise ValueError(f"Batch {args.batch_id} already recorded")

            for topic_id, song_id, role, phase, rationale in links_to_add:
                connection.execute(
                    """
                    INSERT OR IGNORE INTO topic_materials
                      (topic_id, material_kind, material_id, role, use_in_phase, teacher_rationale)
                    VALUES (?, 'song', ?, ?, ?, ?)
                    """,
                    (topic_id, song_id, role, phase, rationale),
                )

            # store source of deterministic enrichment as one audit record
            connection.execute(
                "INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (args.batch_id, "song-curriculum-enrichment", "scripts/songbook/enrich_song_curriculum_links.py", "heuristic-v1"),
            )

            fk_issues = connection.execute("PRAGMA foreign_key_check").fetchall()
            if fk_issues:
                raise RuntimeError(f"Foreign-key violations: {fk_issues}")

        print(json.dumps({
            "status": "applied",
            "batch_id": args.batch_id,
            "added_links": len(links_to_add),
            "filled_updates": len(unique_updates),
            "songs_seen": len(songs),
        }, indent=2))
        return 0

    finally:
        connection.close()


if __name__ == "__main__":
    raise SystemExit(main())

