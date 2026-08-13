PRAGMA foreign_keys = ON;
BEGIN;

UPDATE tags SET parent_tag_id = NULL WHERE id = 14 AND name = 'Animals';

INSERT INTO tags (parent_tag_id, name, definition)
SELECT 14, 'Mammals', 'Warm-blooded vertebrate animals used as a broad inherited teaching theme.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Mammals' COLLATE NOCASE);

INSERT INTO tags (parent_tag_id, name, definition)
SELECT id, 'Horses', 'Horse-family themes, including ponies.' FROM tags
WHERE name = 'Mammals' COLLATE NOCASE
  AND NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Horses' COLLATE NOCASE);

INSERT INTO tags (parent_tag_id, name, definition)
SELECT id, 'Rabbits', 'Rabbit themes, including bunnies.' FROM tags
WHERE name = 'Mammals' COLLATE NOCASE
  AND NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Rabbits' COLLATE NOCASE);

UPDATE tags SET parent_tag_id = (SELECT id FROM tags WHERE name='Horses' COLLATE NOCASE LIMIT 1)
WHERE name IN ('Pony', 'ponies');

UPDATE tags SET parent_tag_id = (SELECT id FROM tags WHERE name='Rabbits' COLLATE NOCASE LIMIT 1)
WHERE name = 'bunnies';

INSERT OR IGNORE INTO tag_aliases (tag_id, alias, provenance)
SELECT id, 'pony', 'editorial' FROM tags WHERE name='Pony';
INSERT OR IGNORE INTO tag_aliases (tag_id, alias, provenance)
SELECT id, 'ponies', 'editorial' FROM tags WHERE name='Pony';
INSERT OR IGNORE INTO tag_aliases (tag_id, alias, provenance)
SELECT id, 'bunny', 'editorial' FROM tags WHERE name='bunnies';
INSERT OR IGNORE INTO tag_aliases (tag_id, alias, provenance)
SELECT id, 'bunnies', 'editorial' FROM tags WHERE name='bunnies';

COMMIT;
