-- Five independently source-reviewed entries from Mid North Coast Library's
-- Baby Bounce Nursery Rhymes. This follows the calibrated import: retain
-- distinct sources, store only printed actions, and delete one verified corrupt
-- “All Day Long” derivative that was actually the first verse of The Waves In
-- The Sea. Run as one transaction; no routine database copy is required.
PRAGMA foreign_keys = ON;
BEGIN;

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
      WHEN 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md' THEN 'AE447227433A50149BC706EC1AC56B6346F63AB65C5B19876A7E464687E37B8A'
      WHEN 'docs/early-years-music-resources/song_versions/the-waves-in-the-sea-mid-north-coast-library-baby-bounce.md' THEN '08785EB54504FBB3849C80EE29FF77511F378C890F02B80F18ED8CE9ED9559A7'
      WHEN 'docs/early-years-music-resources/song_versions/all-the-fish-mid-north-coast-library-baby-bounce-booklet.md' THEN 'D9778B85C442A17A89FF84AF52AD626A131F95EE0A92B0D59388A85ED3AD7581'
      WHEN 'docs/early-years-music-resources/song_versions/babys-gone-mid-north-coast-library-baby-bounce-booklet.md' THEN '0C6053B2606EAB374CB979FFB91AD3A7ACF4CA5814C362DE10B396D252559353'
      WHEN 'docs/early-years-music-resources/song_versions/babys-nap-mid-north-coast-library-baby-bounce-booklet.md' THEN '08DAFC35A97D88A6FF972EF5E11DA7948648523334561CD8E12001D43FE70A8C'
    END
WHERE source_path IN (
  'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/the-waves-in-the-sea-mid-north-coast-library-baby-bounce.md',
  'docs/early-years-music-resources/song_versions/all-the-fish-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/babys-gone-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/babys-nap-mid-north-coast-library-baby-bounce-booklet.md'
);

-- A Smooth Road from More Tickles and Tunes is a separate source version, so
-- add this Mid North Coast version rather than merging title matches.
INSERT INTO songs (
  title, lyrics, actions, instructions, age_range, verified, type,
  educational_domain, materials_needed, tags, source_title, markdown_path
)
SELECT
  'A Smooth Road',
  'A smooth road, a smooth road
A smooth road, a smooth road
A bumpy road, a bumpy road
A bumpy road, a bumpy road
A rough road, a rough road!
A rough road, a rough road!
A hole!',
  NULL,
  'The source documents four actions attached to exact lyric lines. No tune, chord, repeat, or verse suggestion is printed.',
  NULL, 1, 'Fingerplay / lap rhyme',
  'Music & Movement', 'None',
  'lap rhyme, movement, Baby Bounce, source-reviewed',
  'Baby Bounce Nursery Rhymes (booklet)',
  'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md'
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md'
);

-- Repair four existing Mid North Coast records from their original pages.
UPDATE songs
SET lyrics = 'The waves in the sea go up and down,
Up and down, up and down.
The waves in the sea go up and down,
All Day Long....

The fish in the sea go swish, swish, swish,
Swish, swish, swish, swish, swish, swish,
The fish in the sea, go swish, swish, swish,
All Day Long...

The boats on the sea go toot, toot, toot,
Toot, toot, toot, toot, toot, toot,
The boats on the sea go toot, toot, toot,
All Day Long...',
    actions = NULL,
    instructions = 'Source-documented tune: Wheels On The Bus. The source prints three complete stanzas and no actions, chords, repeats, or additional verse prompts.',
    age_range = NULL,
    verified = 1,
    type = 'Song (tune documented)',
    educational_domain = 'Music & Rhythm; Language & Vocabulary',
    materials_needed = 'None',
    tags = 'sea, waves, fish, boats, Wheels On The Bus, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/the-waves-in-the-sea-mid-north-coast-library-baby-bounce.md'
WHERE id = 1605 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

UPDATE songs
SET lyrics = 'All the fish are swimming in the water
Swimming in the water
Swimming in the water
All the fish are swimming in the water
All day long.',
    actions = NULL,
    instructions = 'The source prints two abbreviated song-level voice prompts: a great big fish uses a low/loud voice and a tiny little fish uses a high/quiet voice. No tune, chord, physical action, or complete additional verse is printed.',
    age_range = NULL,
    verified = 1,
    type = 'Song (voice-variation prompts documented)',
    educational_domain = 'Music & Rhythm; Language & Vocabulary',
    materials_needed = 'None',
    tags = 'fish, animals, voice contrast, loud, quiet, high, low, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/all-the-fish-mid-north-coast-library-baby-bounce-booklet.md'
WHERE id = 670 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

UPDATE songs
SET lyrics = 'Baby''s gone, where is she?
Peek-a-boo! Now I see.
Gone again, where''d she go?
Peek-a-boo! I found her toe!',
    actions = NULL,
    instructions = 'The source documents four exact line actions for a peek-a-boo fingerplay. No tune, chord, repeat, or verse suggestion is printed.',
    age_range = NULL,
    verified = 1,
    type = 'Fingerplay / lap rhyme',
    educational_domain = 'Music & Movement; Social-Emotional Learning',
    materials_needed = 'None',
    tags = 'peek-a-boo, object permanence, caregiver, fingers, toes, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/babys-gone-mid-north-coast-library-baby-bounce-booklet.md'
WHERE id = 715 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

UPDATE songs
SET lyrics = 'This is Baby ready for a nap
Lay her down in her mother''s lap
Cover her up so she won''t peep
Rock her ''til she''s fast asleep',
    actions = NULL,
    instructions = 'The source documents four exact hand/finger actions, one for each lyric line. No tune, chord, repeat, or verse suggestion is printed.',
    age_range = NULL,
    verified = 1,
    type = 'Fingerplay / lap rhyme',
    educational_domain = 'Music & Movement; Language & Vocabulary',
    materials_needed = 'None',
    tags = 'baby, nap, fingerplay, hands, caregiver, Baby Bounce, source-reviewed',
    source_title = 'Baby Bounce Nursery Rhymes (booklet)',
    markdown_path = 'docs/early-years-music-resources/song_versions/babys-nap-mid-north-coast-library-baby-bounce-booklet.md'
WHERE id = 716 AND source_title = 'Baby Bounce Nursery Rhymes (booklet)';

-- All Day Long was a truncated, wrongly titled duplicate of The Waves In The
-- Sea. It has no sections, links, sources, or dependent references; remove it
-- along with its stale source document/chunk rather than storing two records.
DELETE FROM song_actions WHERE lower(song_title) = 'all day long mid north coast library baby bounce booklet';
DELETE FROM song_sections WHERE song_id = 665;
DELETE FROM song_chord_guides WHERE song_id = 665;
DELETE FROM song_sources WHERE song_id = 665;
DELETE FROM songs WHERE id = 665;
DELETE FROM search_chunks
WHERE source_path = 'docs/early-years-music-resources/song_versions/all-day-long-mid-north-coast-library-baby-bounce-booklet.md';
DELETE FROM source_documents
WHERE source_path = 'docs/early-years-music-resources/song_versions/all-day-long-mid-north-coast-library-baby-bounce-booklet.md';

-- Replace extraction-era sections/actions only for the five reviewed entries.
DELETE FROM song_chord_guides
WHERE song_id IN (670, 715, 716, 1605)
   OR song_id = (SELECT id FROM songs WHERE markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md');
DELETE FROM song_sections
WHERE song_id IN (670, 715, 716, 1605)
   OR song_id = (SELECT id FROM songs WHERE markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md');
DELETE FROM song_actions
WHERE song_id IN (670, 715, 716, 1605)
   OR lower(song_title) IN (
     'a smooth road mid north coast library baby bounce booklet',
     'the waves in the sea mid north coast library baby bounce',
     'all the fish mid north coast library baby bounce booklet',
     'babys gone mid north coast library baby bounce booklet',
     'babys nap mid north coast library baby bounce booklet'
   );

INSERT INTO song_sections (song_id, label, section_type, sort_order, lyrics)
SELECT id, 'Lyrics', 'verse', 1, lyrics
FROM songs
WHERE id IN (670, 715, 716, 1605)
   OR markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';

-- A Smooth Road: four printed, line-connected lap actions.
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-smooth-road-smooth-legs', 'a smooth road mid north coast library baby bounce booklet', 'Smooth hands down baby''s legs.', 'smooth', '1', 'A smooth road, a smooth road', 'caregiver-guided', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 54; printed page 54', 'Printed parenthetical attached after the second smooth-road line.', 'reviewed', s.id, ss.id, 2, 'source-documented'
FROM songs s JOIN song_sections ss ON ss.song_id = s.id AND ss.sort_order = 1
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-smooth-road-bounce-knees', 'a smooth road mid north coast library baby bounce booklet', 'Bounce baby lightly on knees.', 'bounce', '2', 'A bumpy road, a bumpy road', 'caregiver-guided', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 54; printed page 54', 'Printed parenthetical attached after the second bumpy-road line.', 'reviewed', s.id, ss.id, 4, 'source-documented'
FROM songs s JOIN song_sections ss ON ss.song_id = s.id AND ss.sort_order = 1
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-smooth-road-lift-rough', 'a smooth road mid north coast library baby bounce booklet', 'Lift baby up in the air on each ''rough''.', 'lift', '3', 'A rough road, a rough road!', 'caregiver-guided', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 54; printed page 54', 'Printed parenthetical attached after the second rough-road line.', 'reviewed', s.id, ss.id, 6, 'source-documented'
FROM songs s JOIN song_sections ss ON ss.song_id = s.id AND ss.sort_order = 1
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-smooth-road-hole', 'a smooth road mid north coast library baby bounce booklet', 'Baby falls through gap between legs.', 'lower', '4', 'A hole!', 'caregiver-guided', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 54; printed page 54', 'Printed parenthetical attached to the hole line.', 'reviewed', s.id, ss.id, 7, 'source-documented'
FROM songs s JOIN song_sections ss ON ss.song_id = s.id AND ss.sort_order = 1
WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';

-- All The Fish: abbreviated source prompts tell the teacher how to continue;
-- they belong in the song-level action panel, not reconstructed verse lyrics.
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, provenance)
VALUES
  ('mid-north-all-fish-great-big-voice', 'all the fish mid north coast library baby bounce booklet', 'Continue with “Great big fish are swimming in the water...” and sing with a low/loud voice.', 'voice-variation', '1', 'Great big fish are swimming in the water...', 'voice-variation', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 64; printed page 64', 'Printed abbreviated continuation prompt; not a complete additional verse.', 'reviewed', 670, 'source-documented'),
  ('mid-north-all-fish-tiny-voice', 'all the fish mid north coast library baby bounce booklet', 'Continue with “Tiny little fish are swimming in the water...” and sing with a high/quiet voice.', 'voice-variation', '2', 'Tiny little fish are swimming in the water...', 'voice-variation', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 64; printed page 64', 'Printed abbreviated continuation prompt; not a complete additional verse.', 'reviewed', 670, 'source-documented');

-- Baby's Gone: four printed actions connected to their lyric lines.
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-gone-cover-eyes', 'babys gone mid north coast library baby bounce booklet', 'Cover eyes with hands.', 'cover-eyes', '1', 'Baby''s gone, where is she?', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 16; printed page 16', 'Printed parenthetical attached to line 1.', 'reviewed', 715, ss.id, 1, 'source-documented' FROM song_sections ss WHERE ss.song_id = 715 AND ss.sort_order = 1;
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-gone-find-baby', 'babys gone mid north coast library baby bounce booklet', 'Take hands away and ''find'' baby.', 'reveal', '2', 'Peek-a-boo! Now I see.', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 16; printed page 16', 'Printed parenthetical attached to line 2.', 'reviewed', 715, ss.id, 2, 'source-documented' FROM song_sections ss WHERE ss.song_id = 715 AND ss.sort_order = 1;
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-gone-cover-again', 'babys gone mid north coast library baby bounce booklet', 'Cover eyes again.', 'cover-eyes', '3', 'Gone again, where''d she go?', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 16; printed page 16', 'Printed parenthetical attached to line 3.', 'reviewed', 715, ss.id, 3, 'source-documented' FROM song_sections ss WHERE ss.song_id = 715 AND ss.sort_order = 1;
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-gone-tickle-toes', 'babys gone mid north coast library baby bounce booklet', 'Tickle toes.', 'tickle', '4', 'Peek-a-boo! I found her toe!', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 16; printed page 16', 'Printed parenthetical attached to line 4.', 'reviewed', 715, ss.id, 4, 'source-documented' FROM song_sections ss WHERE ss.song_id = 715 AND ss.sort_order = 1;

-- Baby's Nap: four printed hand/finger actions connected to exact lyric lines.
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-nap-index-finger', 'babys nap mid north coast library baby bounce booklet', 'Hold up index finger.', 'hold', '1', 'This is Baby ready for a nap', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 47; printed page 47', 'Printed parenthetical attached to line 1.', 'reviewed', 716, ss.id, 1, 'source-documented' FROM song_sections ss WHERE ss.song_id = 716 AND ss.sort_order = 1;
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-nap-index-on-palm', 'babys nap mid north coast library baby bounce booklet', 'Place index finger on open palm of other hand.', 'place', '2', 'Lay her down in her mother''s lap', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 47; printed page 47', 'Printed parenthetical attached to line 2.', 'reviewed', 716, ss.id, 2, 'source-documented' FROM song_sections ss WHERE ss.song_id = 716 AND ss.sort_order = 1;
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-nap-wrap-fingers', 'babys nap mid north coast library baby bounce booklet', 'Wrap fingers around index finger.', 'wrap', '3', 'Cover her up so she won''t peep', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 47; printed page 47', 'Printed parenthetical attached to line 3.', 'reviewed', 716, ss.id, 3, 'source-documented' FROM song_sections ss WHERE ss.song_id = 716 AND ss.sort_order = 1;
INSERT INTO song_actions (id, song_title, action_wording, normalized_action, action_sequence, song_cue, action_classification, core_or_optional, educator_org, source_title, source_type, page_timestamp, evidence_note, research_status, song_id, section_id, line_number, provenance)
SELECT 'mid-north-babys-nap-rock-hands', 'babys nap mid north coast library baby bounce booklet', 'Rock hands back and forth.', 'rock', '4', 'Rock her ''til she''s fast asleep', 'fingerplay', 'core', 'Mid North Coast Library', 'Baby Bounce Nursery Rhymes (booklet)', 'library booklet', 'PDF page 47; printed page 47', 'Printed parenthetical attached to line 4.', 'reviewed', 716, ss.id, 4, 'source-documented' FROM song_sections ss WHERE ss.song_id = 716 AND ss.sort_order = 1;

-- Attach every repaired record to both the visually reviewed original PDF and
-- its corrected local transcription. No title-only source matching is used.
INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
SELECT s.id, sd.id, 'primary',
  CASE s.id
    WHEN 1605 THEN 'PDF page 59; printed page 59'
    WHEN 670 THEN 'PDF page 64; printed page 64'
    WHEN 715 THEN 'PDF page 16; printed page 16'
    WHEN 716 THEN 'PDF page 47; printed page 47'
    ELSE 'PDF page 54; printed page 54'
  END,
  'Original Mid North Coast Library page visually reviewed before import.'
FROM songs s CROSS JOIN source_documents sd
WHERE sd.source_path = 'docs/early-years-music-resources/01-libraries-agencies/pdf/mid-north-coast-library-baby-bounce-booklet.pdf'
  AND (s.id IN (670, 715, 716, 1605)
       OR s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md')
ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
  locator = excluded.locator, evidence_note = excluded.evidence_note;

INSERT INTO song_sources (song_id, source_document_id, relationship, locator, evidence_note)
SELECT s.id, sd.id, 'transcription', 'Reviewed local transcription',
  'Local transcription was repaired from the original PDF and retained as searchable source evidence.'
FROM songs s JOIN source_documents sd ON sd.source_path = s.markdown_path
WHERE s.id IN (670, 715, 716, 1605)
   OR s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md'
ON CONFLICT(song_id, source_document_id, relationship) DO UPDATE SET
  locator = excluded.locator, evidence_note = excluded.evidence_note;

-- Clean FTS records carry source facts, exact lyric boundaries, and teacher
-- retrieval language without turning editorial ideas into source claims.
UPDATE search_chunks
SET title = 'A Smooth Road - Mid North Coast Library',
    chunk_text = 'A Smooth Road

A smooth road, a smooth road
A smooth road, a smooth road
A bumpy road, a bumpy road
A bumpy road, a bumpy road
A rough road, a rough road!
A rough road, a rough road!
A hole!

Printed line actions: smooth hands down baby''s legs; bounce baby lightly on knees; lift baby up on each rough; baby falls through the gap between legs.
Search concepts: lap rhyme, caregiver movement, smooth bumpy rough, Baby Bounce.',
    lyrics = 'A smooth road, a smooth road
A smooth road, a smooth road
A bumpy road, a bumpy road
A bumpy road, a bumpy road
A rough road, a rough road!
A rough road, a rough road!
A hole!',
    instructions = 'Four source-documented actions are attached to lines 2, 4, 6, and 7. No tune, chord, repeat, or verse suggestion is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', (SELECT id FROM songs WHERE markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md'), 'sourceLocator', 'PDF page 54; printed page 54'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET title = 'The Waves In The Sea - Mid North Coast Library',
    chunk_text = 'The Waves In The Sea

Tune: Wheels On The Bus.

The waves in the sea go up and down,
Up and down, up and down.
The waves in the sea go up and down,
All Day Long....

The fish in the sea go swish, swish, swish,
Swish, swish, swish, swish, swish, swish,
The fish in the sea, go swish, swish, swish,
All Day Long...

The boats on the sea go toot, toot, toot,
Toot, toot, toot, toot, toot, toot,
The boats on the sea go toot, toot, toot,
All Day Long...

Source facts: three complete stanzas; no actions, chords, repeat, or verse prompts. Search concepts: waves, sea, fish, boats, Wheels On The Bus.',
    lyrics = 'The waves in the sea go up and down,
Up and down, up and down.
The waves in the sea go up and down,
All Day Long....

The fish in the sea go swish, swish, swish,
Swish, swish, swish, swish, swish, swish,
The fish in the sea, go swish, swish, swish,
All Day Long...

The boats on the sea go toot, toot, toot,
Toot, toot, toot, toot, toot, toot,
The boats on the sea go toot, toot, toot,
All Day Long...',
    instructions = 'Source-documented tune: Wheels On The Bus. No action, chord, repeat, or verse suggestion is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 1605, 'sourceLocator', 'PDF page 59; printed page 59'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/the-waves-in-the-sea-mid-north-coast-library-baby-bounce.md';

UPDATE search_chunks
SET title = 'All The Fish - Mid North Coast Library',
    chunk_text = 'All The Fish

All the fish are swimming in the water
Swimming in the water
Swimming in the water
All the fish are swimming in the water
All day long.

Source-documented things to do with the music: continue with great big fish using a low/loud voice; continue with tiny little fish using a high/quiet voice. The prompts are abbreviated, not complete additional verses.
Search concepts: fish, animals, high and low voice, loud and quiet voice, Baby Bounce.',
    lyrics = 'All the fish are swimming in the water
Swimming in the water
Swimming in the water
All the fish are swimming in the water
All day long.',
    instructions = 'Two source-documented song-level voice prompts; no tune, chord, physical action, or complete additional verse is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 670, 'sourceLocator', 'PDF page 64; printed page 64'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/all-the-fish-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET title = 'Baby''s Gone! - Mid North Coast Library',
    chunk_text = 'Baby''s Gone!

Baby''s gone, where is she?
Peek-a-boo! Now I see.
Gone again, where''d she go?
Peek-a-boo! I found her toe!

Printed line actions: cover eyes with hands; take hands away and find baby; cover eyes again; tickle toes.
Search concepts: peek-a-boo, object permanence, caregiver, fingers, toes, Baby Bounce.',
    lyrics = 'Baby''s gone, where is she?
Peek-a-boo! Now I see.
Gone again, where''d she go?
Peek-a-boo! I found her toe!',
    instructions = 'Four source-documented actions are attached to exact lyric lines. No tune, chord, repeat, or verse suggestion is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 715, 'sourceLocator', 'PDF page 16; printed page 16'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/babys-gone-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE search_chunks
SET title = 'Baby''s Nap - Mid North Coast Library',
    chunk_text = 'Baby''s Nap

This is Baby ready for a nap
Lay her down in her mother''s lap
Cover her up so she won''t peep
Rock her ''til she''s fast asleep

Printed line actions: hold up index finger; place index finger on open palm; wrap fingers around index finger; rock hands back and forth.
Search concepts: baby, nap, fingerplay, hands, caregiver, Baby Bounce.',
    lyrics = 'This is Baby ready for a nap
Lay her down in her mother''s lap
Cover her up so she won''t peep
Rock her ''til she''s fast asleep',
    instructions = 'Four source-documented fingerplay actions are attached to exact lyric lines. No tune, chord, repeat, or verse suggestion is printed.',
    meta = json_object('reviewState', 'reviewed', 'songId', 716, 'sourceLocator', 'PDF page 47; printed page 47'),
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/babys-nap-mid-north-coast-library-baby-bounce-booklet.md';

UPDATE songs
SET lyrics = replace(replace(lyrics, char(92) || 'n', char(10)), char(13) || char(10), char(10))
WHERE id IN (670, 715, 716, 1605)
   OR markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';
UPDATE search_chunks
SET chunk_text = replace(replace(chunk_text, char(92) || 'n', char(10)), char(13) || char(10), char(10)),
    lyrics = replace(replace(lyrics, char(92) || 'n', char(10)), char(13) || char(10), char(10)),
    instructions = replace(replace(instructions, char(92) || 'n', char(10)), char(13) || char(10), char(10))
WHERE source_path IN (
  'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/the-waves-in-the-sea-mid-north-coast-library-baby-bounce.md',
  'docs/early-years-music-resources/song_versions/all-the-fish-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/babys-gone-mid-north-coast-library-baby-bounce-booklet.md',
  'docs/early-years-music-resources/song_versions/babys-nap-mid-north-coast-library-baby-bounce-booklet.md'
);

-- Each row has multiple teacher-planning connections. Editorial rationales are
-- explicitly separate from the printed source actions and arrangements.
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 346, 'song', s.id, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded movement sequence: the PDF attaches four caregiver-guided actions to the smooth, bumpy, rough, and hole lines.'
FROM songs s WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md'
AND NOT EXISTS (SELECT 1 FROM topic_materials tm WHERE tm.topic_id = 346 AND tm.material_kind = 'song' AND tm.material_id = s.id);
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 360, 'song', s.id, 'supporting', 'guided-practice', 'circle-time-core', 'Teacher-use connection: the printed caregiver-guided lap actions can be adapted for safe, consent-aware participation; the source does not state an age designation.'
FROM songs s WHERE s.markdown_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md'
AND NOT EXISTS (SELECT 1 FROM topic_materials tm WHERE tm.topic_id = 360 AND tm.material_kind = 'song' AND tm.material_id = s.id);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 320, 'song', 1605, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded recurring-song connection: three complete parallel sea, fish, and boat stanzas are printed to the documented Wheels On The Bus tune.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 320 AND material_kind = 'song' AND material_id = 1605);
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', 1605, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded vocabulary connection: the lyrics name waves, fish, and boats with repeated action words; no movement is prescribed.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 332 AND material_kind = 'song' AND material_id = 1605);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 332, 'song', 670, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded animal vocabulary: the repeated lyric names fish; the source also supplies two voice-variation prompts.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 332 AND material_kind = 'song' AND material_id = 670);
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 345, 'song', 670, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded vocal exploration: the printed great-big and tiny-little prompts pair low/loud and high/quiet voice choices.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 345 AND material_kind = 'song' AND material_id = 670);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 406, 'song', 715, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded peek-a-boo routine: cover/reveal actions are printed beside four predictable lyric lines.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 406 AND material_kind = 'song' AND material_id = 715);
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 291, 'song', 715, 'supporting', 'guided-practice', 'circle-time-core', 'Teacher-use connection: a familiar adult-led peek-a-boo routine can support shared attention and caregiver interaction; this rationale is not presented as a source claim.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 291 AND material_kind = 'song' AND material_id = 715);

INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 326, 'song', 716, 'supporting', 'guided-practice', 'circle-time-core', 'Source-grounded one-step sequence: each of the four short lyric lines has one printed hand or finger action.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 326 AND material_kind = 'song' AND material_id = 716);
INSERT INTO topic_materials (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
SELECT 360, 'song', 716, 'supporting', 'guided-practice', 'circle-time-core', 'Teacher-use connection: the printed fingerplay sequence includes a final rock-hands cue and may be paced for shared caregiver participation.'
WHERE NOT EXISTS (SELECT 1 FROM topic_materials WHERE topic_id = 360 AND material_kind = 'song' AND material_id = 716);

DELETE FROM curriculum_topic_songs
WHERE id IN (
  'mid-north-followup-smooth-movement-daycare',
  'mid-north-followup-waves-nursery-daycare',
  'mid-north-followup-fish-animal-daycare',
  'mid-north-followup-gone-peekaboo-daycare',
  'mid-north-followup-nap-directions-daycare'
);
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-followup-smooth-movement-daycare', 'a0bec636-e5b0-4d05-9ebf-74974c88190a', id, 'reviewed-source', 346
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/a-smooth-road-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-followup-waves-nursery-daycare', 'b856cdea-ea45-4270-b323-7db5f7e36005', id, 'reviewed-source', 320
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/the-waves-in-the-sea-mid-north-coast-library-baby-bounce.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-followup-fish-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-source', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/all-the-fish-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-followup-gone-peekaboo-daycare', 'b29a064e-e3fd-4d26-853e-15732fd4b111', id, 'reviewed-source', 406
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/babys-gone-mid-north-coast-library-baby-bounce-booklet.md';
INSERT INTO curriculum_topic_songs (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'mid-north-followup-nap-directions-daycare', 'a0bec636-e5b0-4d05-9ebf-74974c88190a', id, 'reviewed-source', 326
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/babys-nap-mid-north-coast-library-baby-bounce-booklet.md';

COMMIT;
