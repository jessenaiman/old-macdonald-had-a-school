PRAGMA foreign_keys = ON;
BEGIN;

-- Source documents are provenance records, not lesson materials. These rows
-- were inserted as songs but their IDs do not exist in songs.
DELETE FROM topic_materials
WHERE material_kind = 'song'
  AND NOT EXISTS (SELECT 1 FROM songs WHERE songs.id = topic_materials.material_id)
  AND EXISTS (SELECT 1 FROM source_documents WHERE source_documents.id = topic_materials.material_id);

-- Keep the earliest instance of each exact semantic curriculum link.
DELETE FROM song_curriculum_links
WHERE id NOT IN (
  SELECT MIN(id)
  FROM song_curriculum_links
  GROUP BY song_id, subject, description, ifnull(relevance, ''), link_type
);

CREATE UNIQUE INDEX IF NOT EXISTS song_curriculum_links_identity_unique
  ON song_curriculum_links(song_id, subject, description, ifnull(relevance, ''), link_type);

CREATE TRIGGER IF NOT EXISTS topic_materials_song_reference_insert
BEFORE INSERT ON topic_materials
WHEN NEW.material_kind = 'song'
 AND NOT EXISTS (SELECT 1 FROM songs WHERE id = NEW.material_id)
BEGIN
  SELECT RAISE(ABORT, 'topic_materials song must reference songs.id');
END;

CREATE TRIGGER IF NOT EXISTS topic_materials_song_reference_update
BEFORE UPDATE OF material_kind, material_id ON topic_materials
WHEN NEW.material_kind = 'song'
 AND NOT EXISTS (SELECT 1 FROM songs WHERE id = NEW.material_id)
BEGIN
  SELECT RAISE(ABORT, 'topic_materials song must reference songs.id');
END;

CREATE TRIGGER IF NOT EXISTS topic_materials_resource_reference_insert
BEFORE INSERT ON topic_materials
WHEN NEW.material_kind = 'resource'
 AND NOT EXISTS (SELECT 1 FROM resources WHERE id = NEW.material_id)
BEGIN
  SELECT RAISE(ABORT, 'topic_materials resource must reference resources.id');
END;

CREATE TRIGGER IF NOT EXISTS topic_materials_resource_reference_update
BEFORE UPDATE OF material_kind, material_id ON topic_materials
WHEN NEW.material_kind = 'resource'
 AND NOT EXISTS (SELECT 1 FROM resources WHERE id = NEW.material_id)
BEGIN
  SELECT RAISE(ABORT, 'topic_materials resource must reference resources.id');
END;

COMMIT;
