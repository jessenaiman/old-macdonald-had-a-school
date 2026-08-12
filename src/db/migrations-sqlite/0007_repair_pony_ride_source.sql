-- Repair one reviewed source record: Pony Ride from Good Days with Kids.
-- Source: Circle Time Songs (Toddlers), PDF p. 1, "Lap Songs".
--
-- The prior extraction merged the separate "Elevator" item into "Pony Ride"
-- and assigned unsupported counting/French tags. This migration repairs only
-- Pony Ride. Elevator remains a separate review candidate.

PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

INSERT INTO source_documents (
    source_path,
    source_kind,
    review_state,
    checksum,
    imported_at
)
SELECT
    'docs/early-years-music-resources/02-educators-publishers/pdf/good-days-with-kids-circle-time-songs-toddlers.pdf',
    'pdf',
    'reviewed_source',
    '185d4995fbf9b10c5e393f813172f301aef5f6533edcff9cd5ea0a260669cace',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM source_documents
    WHERE source_path = 'docs/early-years-music-resources/02-educators-publishers/pdf/good-days-with-kids-circle-time-songs-toddlers.pdf'
);

UPDATE source_documents
SET review_state = 'reviewed_promoted',
    checksum = 'd509e6d70b1adc65c39abd820f41c9544e0bd35d903eeff42a2e0877bef2c0bd'
WHERE id = 906
  AND source_path = 'docs/early-years-music-resources/song_versions/pony-ride-good-days-with-kids-circle-time-songs-toddlers.md';

UPDATE songs
SET lyrics = 'Riding on a pony downtown,
Better watch out or you might fall DOWN!',
    actions = 'bounce child up and down your legs
child falls between your legs',
    instructions = 'Caregiver-guided lap bounce. Source locator: Circle Time Songs (Toddlers), PDF p. 1, Lap Songs, Pony Ride.',
    url = 'https://gooddayswithkids.com/wp-content/uploads/2018/12/Circle-Time-Songs-Toddlers.pdf',
    age_range = 'Toddlers (per source title)',
    source_id = NULL,
    verified = 1,
    type = 'Lap song',
    educational_domain = 'Physical Development',
    materials_needed = 'Caregiver lap or other safe supported seated position',
    tags = NULL,
    source_title = 'Circle Time Songs (Toddlers)',
    markdown_path = 'docs/early-years-music-resources/song_versions/pony-ride-good-days-with-kids-circle-time-songs-toddlers.md'
WHERE id = 1341
  AND lower(title) = 'pony ride';

UPDATE search_chunks
SET title = 'Pony Ride - Good Days with Kids',
    chunk_text = '# Pony Ride

Riding on a pony downtown,
Better watch out or you might fall DOWN!

Printed actions:
bounce child up and down your legs
child falls between your legs',
    lyrics = 'Riding on a pony downtown,
Better watch out or you might fall DOWN!',
    instructions = 'bounce child up and down your legs
child falls between your legs',
    url = 'https://gooddayswithkids.com/wp-content/uploads/2018/12/Circle-Time-Songs-Toddlers.pdf',
    meta = '{"domain":"Physical Development","source":"Circle Time Songs (Toddlers), PDF p. 1, Lap Songs, Pony Ride","ageRange":"Toddlers (per source title)","reviewState":"reviewed"}',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'f285c188-e2be-47f8-b3cb-5d6b918b6d1e';

INSERT OR IGNORE INTO search_chunk_sources (search_chunk_id, source_document_id)
SELECT 'f285c188-e2be-47f8-b3cb-5d6b918b6d1e', id
FROM source_documents
WHERE source_path = 'docs/early-years-music-resources/02-educators-publishers/pdf/good-days-with-kids-circle-time-songs-toddlers.pdf';

INSERT INTO tags (name, definition)
SELECT 'Pony', 'A horse or pony explicitly present in the sourced material.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE lower(name) = 'pony');

INSERT INTO tags (name, definition)
SELECT 'Lap song', 'A song or rhyme performed with a child supported on a caregiver lap.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE lower(name) IN ('lap song', 'lap-song'));

INSERT INTO tags (name, definition)
SELECT 'Caregiver-child', 'An activity requiring direct caregiver and child participation.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE lower(name) = 'caregiver-child');

INSERT INTO tags (name, definition)
SELECT 'Bounce', 'A documented bouncing action.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE lower(name) = 'bounce');

INSERT INTO tags (name, definition)
SELECT 'Gross motor', 'Large-body movement or supported whole-body movement.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE lower(name) IN ('gross motor', 'gross-motor'));

INSERT INTO tags (name, definition)
SELECT 'Circle time', 'Material documented for an early-years circle-time setting.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE lower(name) IN ('circle time', 'circle-time'));

DELETE FROM material_tags
WHERE material_kind = 'song'
  AND material_id = 1341;

INSERT INTO material_tags (material_kind, material_id, tag_id)
SELECT 'song', 1341, MIN(id)
FROM tags
WHERE lower(name) IN (
    'animals', 'pony', 'lap song', 'lap-song', 'caregiver-child',
    'bounce', 'gross motor', 'gross-motor', 'rhythm', 'circle time',
    'circle-time'
)
GROUP BY lower(name);

DELETE FROM topic_materials
WHERE material_kind = 'song'
  AND material_id = 1341;

INSERT INTO topic_materials (
    topic_id, material_kind, material_id, role,
    use_in_phase, routine_slot, teacher_rationale
)
VALUES
    (360, 'song', 1341, 'focus', 'opening', 'circle-time-core',
     'Reviewed source evidence: the printed directions specify caregiver-guided bouncing followed by a supported fall cue.'),
    (346, 'song', 1341, 'supporting', 'guided-practice', 'circle-time-core',
     'Reviewed editorial alignment: use the documented bounce/fall contrast to move with a short song; the source provides the movement, while the curriculum connection is teacher-selected.'),
    (332, 'song', 1341, 'supporting', 'guided-practice', 'circle-time-core',
     'Reviewed editorial alignment: pony supplies one concrete animal word for a category-vocabulary lesson; do not infer additional animal actions or facts from the source.');

COMMIT;

-- Verify after applying:
--   PRAGMA foreign_key_check;
--   SELECT id, title, verified, type, educational_domain, url FROM songs WHERE id = 1341;
--   SELECT topic_id, role, teacher_rationale FROM topic_materials WHERE material_kind = 'song' AND material_id = 1341;
--   SELECT t.name FROM material_tags mt JOIN tags t ON t.id = mt.tag_id WHERE mt.material_kind = 'song' AND mt.material_id = 1341;
