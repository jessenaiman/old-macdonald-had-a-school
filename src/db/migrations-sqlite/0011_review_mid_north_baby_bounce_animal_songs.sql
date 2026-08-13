-- Source-reviewed repair for five separate entries in Mid North Coast Library's
-- Baby Bounce Nursery Rhymes booklet.  This is a data migration: no schema
-- change and no routine database copy are needed.  Each source is retained;
-- the Mid North Coast Giddy-up version is deliberately a separate song from
-- the pre-existing Montana version with a similar title.
PRAGMA foreign_keys = ON;
BEGIN;

-- Primary source and the five reviewed local transcriptions.
INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at)
VALUES (
  'docs/early-years-music-resources/01-libraries-agencies/pdf/mid-north-coast-library-baby-bounce-booklet.pdf',
  'pdf', 'reviewed',
  '25030BEB515FDDA06708FC5A04B86C0C5C6472AE9029C2F138E6E407A1A2D907',
  CURRENT_TIMESTAMP
)
ON CONFLICT(source_path) DO UPDATE SET
  source_kind = excluded.source_kind,
  review_state = excluded.review_state,
  checksum = excluded.checksum,
  imported_at = excluded.imported_at;

UPDATE source_documents
SET review_state = 'reviewed', imported_at = CURRENT_TIMESTAMP,
    checksum = CASE source_path
      WHEN 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md' THEN 'C7A100861981974D920B3BCB75FDA94BE9FDBD3C81665A98BB42B9916DF28B24'
      WHEN 'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md' THEN '899743E6BB73E24F3FC6B55D62146253E0696B304D2E9C2CBBAFBEE1F5AFBBDB'
      WHEN 'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md' THEN 'E660806970BD678228FF292E2CB4F7EFAF2DE1DDE26B6A12AFDEEC00D362D80F'
      WHEN 'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md' THEN 'E883F71A66D7F4DD7B8A0B1456FB6583DE2F9106076F339BB68E20D29BCD5B89'
      WHEN 'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md' THEN 'D14305F32121C6FFFA37B98F4A38100D0392E12A5CA4CC5FED611C994CCEDC59'
    END
WHERE source_path IN (
  'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md',
  'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md'
);

-- The existing Giddy Up Horsey row is a distinct Montana source and remains
-- untouched.  Insert this reviewed Mid North Coast version only once.
INSERT INTO songs (
  title, lyrics, actions, instructions, age_range, verified, type,
  educational_domain, materials_needed, tags, source_title, markdown_path
)
SELECT
  'Giddy-up, Horsey',
  'Giddy-up, giddy-up, giddy-up horsey
Giddy-up, giddy-up, go, go, go
Giddy-up, giddy-up, giddy-up horsey
Giddy-up, giddy-up,
Whoa!',
  NULL,
  'The source documents two actions attached to exact lyric lines. No tune, chords, key, meter, or tempo is printed.',
  NULL, 1, 'Movement song',
  'Music & Movement; Language & Vocabulary', 'None',
  'horse, pony, animals, movement, Baby Bounce, source-reviewed',
  'Baby Bounce Nursery Rhymes (booklet)',
  'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md'
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md'
    AND source_title = 'Baby Bounce Nursery Rhymes (booklet)'
);

-- Repair the four pre-existing records from the same booklet.  Grade comes
-- from their curriculum links; the source did not give item-specific ages.
UPDATE songs
SET lyrics = 'Horsey horsey don''t you stop
Just let your feet go clippety clop
The tail goes swish and wheels go round
Giddy up, we''re homeward bound.',
    actions = NULL,
    instructions = 'No item-specific action, tune, chord, or delivery instruction is printed. Any movement adaptation is a teacher suggestion.',
    age_range = NULL,
    verified = 1,
    type = 'Rhyme / song text (tune not stated)',
    educational_domain = 'Language & Vocabulary; Literacy & Phonics',
    materials_needed = 'None',
    tags = 'horse, pony, animals, rhyme, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md'
WHERE id = 1048 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

UPDATE songs
SET lyrics = 'Cows and horses,
cows and horses

Quacking ducks,
quacking ducks

Woolly, woolly sheep,
Woolly, woolly sheep,

Chickens too, chickens too.',
    actions = NULL,
    instructions = 'Source-documented tune: Frere Jacques. No action, chord, key, meter, or tempo is printed.',
    age_range = NULL,
    verified = 1,
    type = 'Song (tune documented)',
    educational_domain = 'Music & Rhythm; Language & Vocabulary',
    materials_needed = 'None',
    tags = 'animals, farm animals, Frere Jacques, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md'
WHERE id = 835 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

UPDATE songs
SET lyrics = 'Old MacDonald had a farm, E-I-E-I-O
And on his farm he had a cow, E-I-E-I-O
With a moo-moo here and a moo-moo there,
Here a moo,
There a moo,
Everywhere moo-moo,
Old MacDonald had a farm, E-I-E-I-O',
    actions = NULL,
    instructions = 'The source gives one complete cow verse. Its abbreviated pig, duck, and horse continuation prompts are stored as source-documented song actions, not reconstructed lyrics. No tune, chord, or delivery instruction is printed.',
    age_range = NULL,
    verified = 1,
    type = 'Song (source excerpt)',
    educational_domain = 'Music & Rhythm; Language & Vocabulary',
    materials_needed = 'None',
    tags = 'Old MacDonald, farm animals, animal sounds, vocabulary, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md'
WHERE id = 1276 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

UPDATE songs
SET lyrics = 'The little white duck says
"Quack Quack Quack!"

The donkey says
"Eeyore!"

The little pink pig says
"Oink Oink Oink!"

And the lion he says
"ROAR!"',
    actions = NULL,
    instructions = 'No tune, action, chord, key, tempo, or delivery instruction is printed. Treat any vocal turn-taking, props, or gestures as teacher suggestions.',
    age_range = NULL,
    verified = 1,
    type = 'Animal-sound text (tune not stated)',
    educational_domain = 'Language & Vocabulary',
    materials_needed = 'None',
    tags = 'animals, animal sounds, oral language, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md'
WHERE id = 693 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

-- SQLite string literals inherit this Windows checkout's CRLF line endings.
-- Normalize reviewed lyric storage to LF, and repair a prior literal backslash-n
-- insert of Giddy-up so both stanza and line rendering are deterministic.
UPDATE songs
SET lyrics = replace(replace(lyrics, char(92) || 'n', char(10)), char(13) || char(10), char(10))
WHERE id IN (693, 835, 1048, 1276)
   OR markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md';

-- Ordered sections preserve every displayed stanza break.  Direct song_actions
-- below handle the two precise Giddy-up annotations without duplicating text.
DELETE FROM song_sections
WHERE song_id IN (
  693, 835, 1048, 1276,
  (SELECT id FROM songs WHERE markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md')
);

INSERT INTO song_sections (song_id, label, section_type, sort_order, lyrics)
SELECT id, 'Lyrics', 'verse', 1, lyrics
FROM songs
WHERE id IN (693, 835, 1048, 1276)
   OR markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md';

DELETE FROM song_chord_guides
WHERE song_id IN (
  693, 835, 1048, 1276,
  (SELECT id FROM songs WHERE markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md')
);

DELETE FROM song_actions
WHERE id IN (
  'mid-north-giddy-up-horsey-bounce-up-and-down',
  'mid-north-giddy-up-horsey-lean-backwards',
  'mid-north-old-macdonald-pig-verse-suggestion',
  'mid-north-old-macdonald-duck-verse-suggestion',
  'mid-north-old-macdonald-horse-verse-suggestion'
);

INSERT INTO song_actions (
  id, song_title, action_wording, normalized_action, action_sequence, song_cue,
  action_classification, core_or_optional, educator_org, source_title,
  source_type, page_timestamp, evidence_note, research_status,
  song_id, section_id, line_number, provenance
)
SELECT
  'mid-north-giddy-up-horsey-bounce-up-and-down',
  'giddy up horsey mid north coast library baby bounce booklet',
  'Bounce up and down.', 'bounce', '1',
  'Giddy-up, giddy-up, giddy-up horsey',
  'gross-motor', 'core', 'Mid North Coast Library',
  'Baby Bounce Nursery Rhymes (booklet)', 'library booklet',
  'PDF page 51; printed page 51',
  'Printed parenthetical attached to line 1 in the original PDF.', 'reviewed',
  s.id, ss.id, 1, 'source-documented'
FROM songs s JOIN song_sections ss ON ss.song_id = s.id AND ss.sort_order = 1
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md';

-- The page's abbreviated animal substitutions tell an educator how to keep
-- the song going. They are source-documented song-level actions, not lyric
-- lines and not reconstructed verses.
INSERT INTO song_actions (
  id, song_title, action_wording, normalized_action, action_sequence,
  action_classification, core_or_optional, educator_org, source_title,
  source_type, page_timestamp, evidence_note, research_status,
  song_id, provenance
) VALUES
  ('mid-north-old-macdonald-pig-verse-suggestion', 'old macdonald had a farm mid north coast library baby bounce booklet',
   'Continue with pig: “And on his farm he had a pig... With an oink-oink here...”', 'suggest-another-verse', '1',
   'verse-suggestion', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)',
   'library booklet', 'PDF page 49; printed page 49', 'Printed abbreviated continuation prompt; not a complete reconstructed verse.', 'reviewed',
   1276, 'source-documented'),
  ('mid-north-old-macdonald-duck-verse-suggestion', 'old macdonald had a farm mid north coast library baby bounce booklet',
   'Continue with duck: “And on his farm he had a duck... With a quack-quack here...”', 'suggest-another-verse', '2',
   'verse-suggestion', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)',
   'library booklet', 'PDF page 49; printed page 49', 'Printed abbreviated continuation prompt; not a complete reconstructed verse.', 'reviewed',
   1276, 'source-documented'),
  ('mid-north-old-macdonald-horse-verse-suggestion', 'old macdonald had a farm mid north coast library baby bounce booklet',
   'Continue with horse: “And on his farm he had a horse... With a neigh-neigh here...”', 'suggest-another-verse', '3',
   'verse-suggestion', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)',
   'library booklet', 'PDF page 49; printed page 49', 'Printed abbreviated continuation prompt; not a complete reconstructed verse.', 'reviewed',
   1276, 'source-documented');

INSERT INTO song_actions (
  id, song_title, action_wording, normalized_action, action_sequence, song_cue,
  action_classification, core_or_optional, educator_org, source_title,
  source_type, page_timestamp, evidence_note, research_status,
  song_id, section_id, line_number, provenance
)
SELECT
  'mid-north-giddy-up-horsey-lean-backwards',
  'giddy up horsey mid north coast library baby bounce booklet',
  'Lean backwards.', 'lean', '2', 'Whoa!',
  'gross-motor', 'core', 'Mid North Coast Library',
  'Baby Bounce Nursery Rhymes (booklet)', 'library booklet',
  'PDF page 51; printed page 51',
  'Printed parenthetical attached to line 5 in the original PDF.', 'reviewed',
  s.id, ss.id, 5, 'source-documented'
FROM songs s JOIN song_sections ss ON ss.song_id = s.id AND ss.sort_order = 1
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md';

-- Attach both the original PDF and the reviewed local transcription to every
-- distinct version.  This preserves provenance without merging title matches.
INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
SELECT s.id, sd.id, 'primary',
  CASE s.id
    WHEN 1048 THEN 'PDF page 29; printed page 29'
    WHEN 835 THEN 'PDF page 60; printed page 60'
    WHEN 1276 THEN 'PDF page 49; printed page 49'
    WHEN 693 THEN 'PDF page 67; printed page 67'
    ELSE 'PDF page 51; printed page 51'
  END,
  'Original Mid North Coast Library page visually reviewed before import.'
FROM songs s CROSS JOIN source_documents sd
WHERE sd.source_path = 'docs/early-years-music-resources/01-libraries-agencies/pdf/mid-north-coast-library-baby-bounce-booklet.pdf'
  AND (s.id IN (693, 835, 1048, 1276)
       OR s.markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md')
ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
  locator = excluded.locator, evidence_note = excluded.evidence_note;

INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
SELECT s.id, sd.id, 'transcription', 'Reviewed local transcription',
  'Local transcription was repaired from the original PDF and is retained as searchable source evidence.'
FROM songs s JOIN source_documents sd ON sd.source_path = s.markdown_path
WHERE s.id IN (693, 835, 1048, 1276)
   OR s.markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md'
ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
  locator = excluded.locator, evidence_note = excluded.evidence_note;

-- Search chunks are repaired from the verified records so FTS returns teacher-
-- usable source facts rather than neighboring text or extraction artefacts.
UPDATE search_chunks
SET title = 'Giddy-up, Horsey - Mid North Coast Library',
    chunk_text = 'Giddy-up, Horsey

Giddy-up, giddy-up, giddy-up horsey
Giddy-up, giddy-up, go, go, go
Giddy-up, giddy-up, giddy-up horsey
Giddy-up, giddy-up,
Whoa!

Printed action, line 1: Bounce up and down.
Printed action, line 5: Lean backwards.

Source facts: no tune, chords, key, meter, or tempo are stated.
Search concepts: pony, horse, animals, movement song, Baby Bounce.
Teacher use: a source-documented movement song with line-connected actions.',
    lyrics = 'Giddy-up, giddy-up, giddy-up horsey
Giddy-up, giddy-up, go, go, go
Giddy-up, giddy-up, giddy-up horsey
Giddy-up, giddy-up,
Whoa!',
    instructions = 'Source-documented action at line 1: Bounce up and down. Source-documented action at line 5: Lean backwards.',
    meta = json_object('reviewState', 'reviewed', 'songId', (SELECT id FROM songs WHERE markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md'), 'sourceLocator', 'PDF page 51; printed page 51'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET title = 'Horsey Horsey - Mid North Coast Library',
    chunk_text = 'Horsey Horsey

Horsey horsey don''t you stop
Just let your feet go clippety clop
The tail goes swish and wheels go round
Giddy up, we''re homeward bound.

Source facts: no action, tune, chord, or delivery instruction is printed.
Search concepts: horse, pony, animals, rhyme, Baby Bounce.
Teacher use: hear the printed stop/clop and round/bound rhyme pairs; any movement is a teacher suggestion.',
    lyrics = 'Horsey horsey don''t you stop
Just let your feet go clippety clop
The tail goes swish and wheels go round
Giddy up, we''re homeward bound.',
    instructions = 'No item-specific action, tune, chord, or delivery instruction is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 1048, 'sourceLocator', 'PDF page 29; printed page 29'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET title = 'Cows And Horses - Mid North Coast Library',
    chunk_text = 'Cows And Horses

Cows and horses,
cows and horses

Quacking ducks,
quacking ducks

Woolly, woolly sheep,
Woolly, woolly sheep,

Chickens too, chickens too.

Source-documented tune: Frere Jacques. No actions or chord arrangement are printed.
Search concepts: farm animals, animal vocabulary, familiar tune, Baby Bounce.
Teacher use: a short source-documented animal-vocabulary song; any beat or gesture is a teacher suggestion.',
    lyrics = 'Cows and horses,
cows and horses

Quacking ducks,
quacking ducks

Woolly, woolly sheep,
Woolly, woolly sheep,

Chickens too, chickens too.',
    instructions = 'Source-documented tune: Frere Jacques. No actions, chords, key, meter, or tempo are printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 835, 'sourceLocator', 'PDF page 60; printed page 60'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET title = 'Old MacDonald Had A Farm - Mid North Coast Library',
    chunk_text = 'Old MacDonald Had A Farm

Lyrics - complete cow verse
Old MacDonald had a farm, E-I-E-I-O
And on his farm he had a cow, E-I-E-I-O
With a moo-moo here and a moo-moo there,
Here a moo,
There a moo,
Everywhere moo-moo,
Old MacDonald had a farm, E-I-E-I-O

Source-documented things to do with the music: continue with pig (“And on his farm he had a pig... With an oink-oink here...”); duck (“And on his farm he had a duck... With a quack-quack here...”); or horse (“And on his farm he had a horse... With a neigh-neigh here...”). These are abbreviated prompts, not reconstructed lyrics.

No tune or chords are stated. Search concepts: Old MacDonald, farm animals, animal sounds, vocabulary, Baby Bounce.',
    lyrics = 'Old MacDonald had a farm, E-I-E-I-O
And on his farm he had a cow, E-I-E-I-O
With a moo-moo here and a moo-moo there,
Here a moo,
There a moo,
Everywhere moo-moo,
Old MacDonald had a farm, E-I-E-I-O',
    instructions = 'One complete cow verse. Source-documented abbreviated continuation prompts for pig, duck, and horse are stored as things to do with the music. No tune, chord, or delivery instruction is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 1276, 'sourceLocator', 'PDF page 49; printed page 49'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md';

UPDATE search_chunks
SET title = 'Animal Noises - Mid North Coast Library',
    chunk_text = 'Animal Noises

The little white duck says
"Quack Quack Quack!"

The donkey says
"Eeyore!"

The little pink pig says
"Oink Oink Oink!"

And the lion he says
"ROAR!"

Source facts: no tune, action, chord, key, tempo, or delivery instruction is printed.
Search concepts: animals, animal sounds, listening, oral language, Baby Bounce.
Teacher use: the source pairs four animal labels with vocal sounds; any turn-taking, prop, or gesture is a teacher suggestion.',
    lyrics = 'The little white duck says
"Quack Quack Quack!"

The donkey says
"Eeyore!"

The little pink pig says
"Oink Oink Oink!"

And the lion he says
"ROAR!"',
    instructions = 'No tune, action, chord, key, tempo, or delivery instruction is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 693, 'sourceLocator', 'PDF page 67; printed page 67'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET chunk_text = replace(replace(chunk_text, char(92) || 'n', char(10)), char(13) || char(10), char(10)),
    lyrics = replace(replace(lyrics, char(92) || 'n', char(10)), char(13) || char(10), char(10)),
    instructions = replace(replace(instructions, char(92) || 'n', char(10)), char(13) || char(10), char(10))
WHERE source_path IN (
  'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md',
  'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md'
);

-- Multiple normalized topic links make each reviewed item usable in planning.
-- A teacher rationale is kept separate from source facts and never invents an
-- action, arrangement, or age designation.
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', s.id, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded animal vocabulary: the title and printed horsey wording give a concrete animal label. The two printed movement cues are documented separately on the song page.'
FROM songs s
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md'
  AND NOT EXISTS (SELECT 1 FROM topic_materials tm WHERE tm.topic_id = 332 AND tm.material_kind = 'song' AND tm.material_id = s.id);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 346, 'song', s.id, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded movement connection: the PDF prints “Bounce up and down” on line 1 and “Lean backwards” on the Whoa line. Teachers choose safe participation adaptations.'
FROM songs s
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md'
  AND NOT EXISTS (SELECT 1 FROM topic_materials tm WHERE tm.topic_id = 346 AND tm.material_kind = 'song' AND tm.material_id = s.id);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', 1048, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded animal vocabulary: Horsey Horsey presents horse imagery in a short four-line text.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 332 AND material_kind = 'song' AND material_id = 1048);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 321, 'song', 1048, 'supporting', 'guided-practice', 'circle-time-core',
  'Teacher teaching connection: listen for the printed stop/clop and round/bound rhyme pairs. The source does not prescribe an action or tune.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 321 AND material_kind = 'song' AND material_id = 1048);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', 835, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded animal vocabulary: the documented song names horses, ducks, sheep, and chickens.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 332 AND material_kind = 'song' AND material_id = 835);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 320, 'song', 835, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded familiar-tune connection: the PDF documents Frere Jacques. Any pulse or gesture is a teacher suggestion.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 320 AND material_kind = 'song' AND material_id = 835);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', 1276, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded animal vocabulary: the printed cow verse and continuation prompts name cow, pig, duck, and horse with animal sounds.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 332 AND material_kind = 'song' AND material_id = 1276);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 320, 'song', 1276, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded recurring repertoire: this reviewed version retains the exact complete cow verse and labels the other animal lines as abbreviated prompts.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 320 AND material_kind = 'song' AND material_id = 1276);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 427, 'song', 1276, 'supporting', 'guided-practice', 'circle-time-core',
  'Reviewed source version for the Old MacDonald topic. This booklet does not document signing; teachers select any signing practice separately.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 427 AND material_kind = 'song' AND material_id = 1276);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', 693, 'supporting', 'guided-practice', 'circle-time-core',
  'Source-grounded vocabulary and sound association: duck, donkey, pig, and lion are each paired with a printed vocal sound.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 332 AND material_kind = 'song' AND material_id = 693);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 320, 'song', 693, 'supporting', 'guided-practice', 'circle-time-core',
  'Collection-grounded shared-repertoire connection: the source is a Baby Bounce nursery-rhyme booklet. This does not assert that the item itself rhymes or has a tune.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 320 AND material_kind = 'song' AND material_id = 693);

DELETE FROM curriculum_topic_songs
WHERE id IN (
  'mid-north-baby-bounce-giddy-animal-daycare',
  'mid-north-baby-bounce-horsey-animal-daycare',
  'mid-north-baby-bounce-horsey-rhyme-daycare',
  'mid-north-baby-bounce-cows-animal-daycare',
  'mid-north-baby-bounce-cows-nursery-daycare',
  'mid-north-baby-bounce-macdonald-animal-daycare',
  'mid-north-baby-bounce-macdonald-song-daycare',
  'mid-north-baby-bounce-animal-noises-animal-daycare',
  'mid-north-baby-bounce-animal-noises-nursery-daycare'
);

INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-giddy-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-source', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/giddy-up-horsey-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-horsey-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-source', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-horsey-rhyme-daycare', '24e863f2-d41b-42e6-bbe9-4281f1d4cf08', id, 'reviewed-editorial', 321
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/horsey-horsey-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-cows-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-source', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-cows-nursery-daycare', 'b856cdea-ea45-4270-b323-7db5f7e36005', id, 'reviewed-source', 320
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/cows-and-horses-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-macdonald-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-source', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-macdonald-song-daycare', 'bad631a0-fafb-4ea7-a1a1-39a75a8ca077', id, 'reviewed-editorial', 427
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/old-macdonald-had-a-farm-mid-north-coast-library-baby.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-animal-noises-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-source', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-baby-bounce-animal-noises-nursery-daycare', 'b856cdea-ea45-4270-b323-7db5f7e36005', id, 'reviewed-editorial', 320
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/animal-noises-mid-north-coast-library-baby-bounce-booklet.md';

COMMIT;
