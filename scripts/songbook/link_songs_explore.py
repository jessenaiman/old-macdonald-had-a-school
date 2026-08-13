#!/usr/bin/env python3
"""Explore DB state before linking songs to curriculum."""
import sqlite3
import sys
from pathlib import Path

DB = Path("data/omhas.db")

def main():
    conn = sqlite3.connect(str(DB))
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # 1. Song counts
    total = c.execute("SELECT COUNT(*) FROM songs").fetchone()[0]
    with_links = c.execute("SELECT COUNT(DISTINCT song_id) FROM song_curriculum_links").fetchone()[0]
    unlinked = total - with_links
    
    has_lyrics = c.execute("SELECT COUNT(*) FROM songs WHERE lyrics IS NOT NULL AND lyrics != ''").fetchone()[0]
    no_lyrics = c.execute("SELECT COUNT(*) FROM songs WHERE lyrics IS NULL OR lyrics = ''").fetchone()[0]
    unlinked_with_lyrics = c.execute(
        "SELECT COUNT(*) FROM songs WHERE id NOT IN (SELECT song_id FROM song_curriculum_links) AND lyrics IS NOT NULL AND lyrics != ''"
    ).fetchone()[0]
    unlinked_no_lyrics = c.execute(
        "SELECT COUNT(*) FROM songs WHERE id NOT IN (SELECT song_id FROM song_curriculum_links) AND (lyrics IS NULL OR lyrics = '')"
    ).fetchone()[0]

    print(f"Total songs: {total}")
    print(f"Has lyrics: {has_lyrics}")
    print(f"No lyrics: {no_lyrics}")
    print(f"Already linked: {with_links}")
    print(f"Unlinked: {unlinked}")
    print(f"  Unlinked with lyrics: {unlinked_with_lyrics}")
    print(f"  Unlinked no lyrics: {unlinked_no_lyrics}")
    print()

    # 2. Null fields in songs
    null_fields = {}
    for col in ["actions", "age_range", "educational_domain", "type", "materials_needed", "tags"]:
        n = c.execute(f"SELECT COUNT(*) FROM songs WHERE ({col} IS NULL OR {col} = '') AND id NOT IN (SELECT song_id FROM song_curriculum_links)").fetchone()[0]
        null_fields[col] = n
    print("Empty fields among unlinked songs:")
    for k, v in null_fields.items():
        print(f"  {k}: {v}")
    print()

    # 3. Subjects
    subjects = c.execute("SELECT id, key, label FROM subjects ORDER BY id").fetchall()
    print("Subjects:")
    for s in subjects:
        topic_count = c.execute("SELECT COUNT(*) FROM topics WHERE subject_id=? AND merged_into IS NULL", (s["id"],)).fetchone()[0]
        print(f"  {s['id']}: {s['key']} ({s['label']}) - {topic_count} topics")
    print()

    # 4. Topics
    topics = c.execute("SELECT id, subject_id, topic, skill FROM topics WHERE merged_into IS NULL ORDER BY subject_id, id").fetchall()
    print(f"Total active topics: {len(topics)}")
    for t in topics[:30]:
        print(f"  [{t['subject_id']}] id={t['id']}: {t['topic']} - {t['skill'][:60] if t['skill'] else ''}")
    print()

    # 5. Sample songs with lyrics that need links
    samples = c.execute("""
        SELECT id, title, type, educational_domain, age_range, 
               substr(lyrics, 1, 200) as lyrics_preview,
               substr(actions, 1, 100) as actions_preview
        FROM songs 
        WHERE id NOT IN (SELECT song_id FROM song_curriculum_links)
          AND lyrics IS NOT NULL AND lyrics != ''
        ORDER BY 
            CASE WHEN actions IS NOT NULL AND actions != '' THEN 0 ELSE 1 END,
            id
        LIMIT 10
    """).fetchall()
    print("Sample unlinked songs (with lyrics):")
    for s in samples:
        print(f"  id={s['id']}: {s['title']}")
        print(f"    type={s['type']}, domain={s['educational_domain']}, age={s['age_range']}")
        print(f"    lyrics: {s['lyrics_preview'][:100]}...")
        print(f"    actions: {s['actions_preview'][:100]}")
        print()

    # 6. Check import_batches table schema
    ib_schema = c.execute("PRAGMA table_info(import_batches)").fetchall()
    print("import_batches columns:")
    for col in ib_schema:
        print(f"  {col['name']}: {col['type']}")
    
    conn.close()

if __name__ == "__main__":
    main()