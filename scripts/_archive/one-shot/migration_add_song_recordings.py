"""Migration: Add song_recordings table and migrate existing artist data."""
import sqlite3, hashlib, os, sys
from datetime import datetime

DB = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data/omhas.db')
MIGRATION_ID = f'add-song-recordings-{datetime.now().strftime("%Y%m%d_%H%M%S")}'

conn = sqlite3.connect(DB)
c = conn.cursor()

# Drop old table if exists from failed attempt
c.execute("DROP TABLE IF EXISTS song_recordings")

# Create fresh
c.execute("""
    CREATE TABLE song_recordings (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id     INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
        artist      TEXT NOT NULL,
        album       TEXT,
        year        INTEGER,
        key         TEXT,
        url         TEXT,
        notes       TEXT
    )
""")
c.execute("CREATE INDEX IF NOT EXISTS idx_song_recordings_song_id ON song_recordings(song_id)")
print("Created song_recordings table")

# Migrate artist data
count = 0
rows = c.execute("SELECT id, artist, source_title, url FROM songs WHERE artist IS NOT NULL AND artist != ''").fetchall()
print(f"Found {len(rows)} songs with artist data")

for sid, artist, album, url in rows:
    c.execute("INSERT INTO song_recordings (song_id, artist, album, url) VALUES (?, ?, ?, ?)",
              (sid, artist, album or None, url or None))
    count += 1
    if count % 500 == 0:
        print(f"  Migrated {count}...")

# Also migrate creator_artist where it differs
alt_count = 0
alt_rows = c.execute("""
    SELECT id, creator_artist FROM songs 
    WHERE creator_artist IS NOT NULL AND creator_artist != '' 
    AND (artist IS NULL OR creator_artist != artist)
""").fetchall()
for sid, creator in alt_rows:
    c.execute("INSERT INTO song_recordings (song_id, artist, notes) VALUES (?, ?, ?)",
              (sid, creator, "Alternate credit (creator_artist field)"))
    alt_count += 1

conn.commit()
print(f"Migrated {count} primary + {alt_count} alternate recordings")

# Verify
c.execute("PRAGMA foreign_key_check")
fkc = c.fetchall()
print(f"FK violations: {len(fkc)}")
if fkc:
    for v in fkc:
        print(f"  {v}")

c.execute("PRAGMA integrity_check")
print(f"Integrity: {c.fetchone()[0]}")

rec_count = c.execute("SELECT COUNT(*) FROM song_recordings").fetchone()[0]
song_count = c.execute("SELECT COUNT(DISTINCT song_id) FROM song_recordings").fetchone()[0]
print(f"song_recordings: {rec_count} rows for {song_count} songs")

# Record migration
file_hash = hashlib.sha256(open(__file__, 'rb').read()).hexdigest().upper()
c.execute("""
    INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
    VALUES (?, CURRENT_TIMESTAMP, ?, 'N/A', 'N/A')
""", (MIGRATION_ID, file_hash))
c.execute("""
    INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at)
    VALUES (?, 'schema-migration', ?, ?, CURRENT_TIMESTAMP)
""", (MIGRATION_ID, __file__.replace('\\', '/'), file_hash))

conn.commit()
conn.close()
print(f"\nMigration {MIGRATION_ID} complete")