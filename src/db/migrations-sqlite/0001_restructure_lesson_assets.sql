-- Restructure lesson_assets to link to curriculum topics
-- Drop boilerplate lesson tables that duplicate curriculum data

-- Drop empty lesson tables (no data loss)
DROP TABLE IF EXISTS lesson_blueprints;
DROP TABLE IF EXISTS lesson_steps;
DROP TABLE IF EXISTS lesson_materials;
DROP TABLE IF EXISTS lesson_song_guidance;
DROP TABLE IF EXISTS lesson_resource_guidance;
DROP TABLE IF EXISTS lesson_search_prompts;
DROP TABLE IF EXISTS lesson_review;
DROP TABLE IF EXISTS worksheet_briefs;

-- Restructure lesson_assets: replace lesson_id with topic_id
-- SQLite doesn't support DROP COLUMN easily, so we recreate the table
CREATE TABLE lesson_assets_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  topic_id INTEGER NOT NULL REFERENCES TOPICS(id),
  asset_type TEXT DEFAULT 'worksheet' NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  format TEXT,
  generation_prompt TEXT,
  visual_notes TEXT,
  status TEXT DEFAULT 'draft' NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Copy data (lesson_assets is empty, so this is a no-op)
INSERT INTO lesson_assets_new (id, topic_id, asset_type, title, description, file_path, format, generation_prompt, visual_notes, status, created_at, updated_at)
SELECT id, NULL, asset_type, title, description, file_path, format, generation_prompt, visual_notes, status, created_at, updated_at
FROM lesson_assets;

DROP TABLE lesson_assets;
ALTER TABLE lesson_assets_new RENAME TO lesson_assets;
