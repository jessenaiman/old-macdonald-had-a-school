#!/usr/bin/env python3
"""Conservative topic enrichment for songs.

This script maps songs -> topics using deterministic keyword overlap and
adds conservative song enrichment fields only when currently empty.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

TOKEN_SPLIT = re.compile(r"[^a-z0-9]+", re.IGNORECASE)

STOPWORDS = {
    "the", "and", "for", "with", "this", "that", "from", "into", "about", "their",
    "there", "they", "them", "these", "then", "than", "what", "when", "where", "while",
    "your", "you", "she", "her", "his", "our", "ours", "have", "has", "had", "been",
    "were", "was", "are", "is", "be", "been", "will", "would", "could", "should",
    "into", "into", "song", "songs", "sing", "singing", "teacher", "children", "child",
    "school", "kindergarten", "preschool", "pre", "early", "years", "earlyyears", "age"
}


MUSIC_HINTS = {
    "music": {"music", "song", "songs", "sing", "singing", "melody", "verse", "chorus", "rhyme", "clap", "tap"},
    "animals": {"animal", "animals", "pony", "ponies", "horse", "horse", "cow", "pig", "duck", "rabbit", "cat", "bunny", "bunnies", "horse", "farm"},
    "fingerplay": {"finger", "fingers", "fingerplays", "shake", "wiggle", "clap", "hands", "wave", "point"},
    "movement": {"move", "moving", "movement", "march", "jump", "skip", "hop", "dance", "spin", "wiggle", "bounce"},
    "routine": {"circle", "morning", "greeting", "goodbye", "clean", "ready", "routine", "transition"},
    "calm": {"calm", "quiet", "breathing", "listen", "slow", "soothing", "rest", "gentle"},
}


def norm(value: str | None) -> str:
    if not value:
        return ""
    return TOKEN_SPLIT.sub(" ", value.lower()).strip()


def token_set(value: str | None) -> set[str]:
    return {tok for tok in norm(value).split() if len(tok) > 2 and tok not in STOPWORDS}


def load_topics(connection: sqlite3.Connection):
    rows = connection.execute(
        """
        SELECT t.id, t.topic, t.skill, t.circle_time, COALESCE(t.category, ''), s.label
        FROM topics t
        JOIN subjects s ON s.id = t.subject_id
        WHERE t.merged_into IS NULL
        """
    ).fetchall()

    topic_tags = {}
    for topic_id, tag_name in connection.execute(
        """
        SELECT tt.topic_id, ta.name
        FROM topic_tags tt
        JOIN tags ta ON ta.id = tt.tag_id
        """
    ).fetchall():
        topic_tags.setdefault(int(topic_id), set()).add(norm(tag_name))

    cache = []
    for topic_id, topic, skill, circle_time, category, subject_label in rows:
        topic_id = int(topic_id)
        base = norm(" ".join(filter(None, [topic, skill, circle_time, category, subject_label])))
        words = set(token_set(base))
        words |= set().union(*(set(t.split()) for t in topic_tags.get(topic_id, set())))
        cache.append(
            {
                "topic_id": topic_id,
                "topic": str(topic),
                "score_words": words,
                "subject": norm(subject_label),
                "circle_time": norm(circle_time),
                "skill": norm(skill),
            }
        )
    return cache


def score_match(topic_words: set[str], song_tokens: set[str]) -> int:
    score = len(topic_words & song_tokens)
    # light deterministic subject-based bonuses
    if "music & arts" in topic_words:
        if "music" in song_tokens or "song" in song_tokens:
            score += 1
    if "language" in topic_words and {"word", "book", "story", "read"} & song_tokens:
        score += 1
    return score


def best_topics(song_tokens: set[str], topics) -> list[tuple[int, str, int, str]]:
    scored = []
    for topic in topics:
        score = score_match(topic["score_words"], song_tokens)
        if score <= 0:
            continue
        bonus = 0
        circle_terms = set(topic["circle_time"].split())
        if song_tokens & circle_terms:
            bonus += 1
        if topic["subject"] == "music & arts" and "music" in song_tokens:
            bonus += 1
        scored.append((topic["topic_id"], topic["topic"], score + bonus, topic["subject"]))
    scored.sort(key=lambda item: item[2], reverse=True)
    return scored[:5]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=Path("data/omhas.db"))
    parser.add_argument("--batch-id", default=f"song-curric-enrich-{datetime.now().strftime('%Y%m%d-%H%M%S')}")
    parser.add_argument("--limit", type=int, default=250)
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    connection = sqlite3.connect(args.db)
    connection.row_factory = sqlite3.Row

    try:
        connection.execute("PRAGMA foreign_keys = ON")

        topics = load_topics(connection)
        existing_links = set(
            (int(topic_id), int(material_id))
            for topic_id, material_id in connection.execute(
                "SELECT topic_id, material_id FROM topic_materials WHERE material_kind = 'song'"
            ).fetchall()
        )

        songs = connection.execute(
            """
            SELECT id, title, lyrics, instructions, tags, materials_needed,
                   curriculum_links, early_years_links, source_title
            FROM songs
            ORDER BY id
            LIMIT ? OFFSET ?
            """,
            (args.limit, args.offset),
        ).fetchall()

        links_to_add: list[tuple[int, int, str, str, str]] = []
        updates_to_fill: Dict[int, List[str]] = {}

        for song in songs:
            song_id = int(song["id"])
            text = token_set(" ".join(filter(None, [song["title"], song["lyrics"], song["instructions"], song["tags"], song["source_title"]])))
            if not text:
                continue

            matches = best_topics(text, topics)
            if not matches:
                continue

            for topic_id, topic_label, score, subject in matches[:3]:
                if score >= 3 and (topic_id, song_id) not in existing_links:
                    links_to_add.append((topic_id, song_id, "related", "supporting", f"Deterministic lexical match (score={score})"))
                    existing_links.add((topic_id, song_id))

            top_labels = [label for _, label, _, _ in matches[:3]]
            if (song["curriculum_links"] is None or not str(song["curriculum_links"]).strip()) and top_labels:
                updates_to_fill.setdefault(song_id, []).append(
                    "Connected to: " + ", ".join(top_labels[:2])
                )

            if (song["materials_needed"] is None or not str(song["materials_needed"]).strip()) and {
                "clap", "tap", "dance", "march", "jump", "bounce", "instrument", "shaker"
            } & text:
                updates_to_fill.setdefault(song_id, []).append(
                    "Open space and simple movement props (e.g., cards, scarves, shakers) as needed."
                )

            if (song["early_years_links"] is None or not str(song["early_years_links"]).strip()) and {"circle", "routine", "morning", "goodbye", "greeting"} & text:
                updates_to_fill.setdefault(song_id, []).append(
                    "Useful for circle-time and transition routines."
                )

        if args.verbose:
            print(
                json.dumps(
                    {
                        "batch_id": args.batch_id,
                        "songs_seen": len(songs),
                        "links_to_add": len(links_to_add),
                        "updates": len(updates_to_fill),
                    },
                    indent=2,
                )
            )

        if args.dry_run:
            print(
                json.dumps(
                    {
                        "status": "dry-run",
                        "batch_id": args.batch_id,
                        "offset": args.offset,
                        "limit": args.limit,
                        "songs_seen": len(songs),
                        "links_to_add": len(links_to_add),
                        "updates_to_fill": len(updates_to_add := list(updates_to_fill.items())),
                    },
                    indent=2,
                )
            )
            return 0

        if not links_to_add and not updates_to_fill:
            print(json.dumps({"status": "no-op", "batch_id": args.batch_id, "songs_seen": len(songs)}))
            return 0

        unique_updates: dict[int, str] = {}
        for song_id, reasons in updates_to_fill.items():
            unique_updates[song_id] = reasons[0]

        with connection:
            if not connection.execute("SELECT 1 FROM schema_migrations WHERE migration_id = ?", (args.batch_id,)).fetchone():
                connection.execute(
                    """
                    INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
                    VALUES (?, CURRENT_TIMESTAMP, 'HEURISTIC', 'N/A', 'N/A')
                    """,
                    (args.batch_id,),
                )

            if connection.execute("SELECT 1 FROM import_batches WHERE migration_id = ?", (args.batch_id,)).fetchone():
                raise ValueError(f"Batch '{args.batch_id}' already recorded")

            for topic_id, song_id, role, phase, rationale in links_to_add:
                connection.execute(
                    """
                    INSERT OR IGNORE INTO topic_materials
                        (topic_id, material_kind, material_id, role, use_in_phase, teacher_rationale)
                    VALUES (?, 'song', ?, ?, ?, ?)
                    """,
                    (topic_id, song_id, role, phase, rationale),
                )

            for song_id, rationale in unique_updates.items():
                row = connection.execute(
                    "SELECT curriculum_links, materials_needed, early_years_links FROM songs WHERE id = ?",
                    (song_id,),
                ).fetchone()
                if not row:
                    continue
                current_curriculum, current_materials, current_early = row
                assignments = []
                params = []
                if not str(current_curriculum or "").strip():
                    assignments.append("curriculum_links = COALESCE(curriculum_links, ?)")
                    params.append(rationale)
                if not str(current_materials or "").strip():
                    assignments.append("materials_needed = COALESCE(materials_needed, ?)")
                    params.append("Open space and simple movement props as needed.")
                if not str(current_early or "").strip():
                    assignments.append("early_years_links = COALESCE(early_years_links, ?)")
                    params.append("Circle-time and transition-ready context.")
                if assignments:
                    set_clause = ", ".join(assignments)
                    connection.execute(f"UPDATE songs SET {set_clause} WHERE id = ?", (*params, song_id))

            file_hash = hashlib.sha256(Path("scripts/songbook/enrich_song_curriculum_links.py").read_bytes()).hexdigest().upper()
            connection.execute(
                "INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (args.batch_id, "song-curriculum-enrichment", "scripts/songbook/enrich_song_curriculum_links.py", file_hash),
            )

            fk_violations = connection.execute("PRAGMA foreign_key_check").fetchall()
            if fk_violations:
                raise RuntimeError(f"Foreign-key violations: {fk_violations}")

        print(
            json.dumps(
                {
                    "status": "applied",
                    "batch_id": args.batch_id,
                    "offset": args.offset,
                    "limit": args.limit,
                    "songs_seen": len(songs),
                    "added_links": len(links_to_add),
                    "filled_updates": len(unique_updates),
                },
                indent=2,
            )
        )
        return 0
    finally:
        connection.close()


if __name__ == "__main__":
    raise SystemExit(main())
