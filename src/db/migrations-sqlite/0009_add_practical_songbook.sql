PRAGMA foreign_keys = ON;

CREATE TABLE song_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  label TEXT,
  section_type TEXT NOT NULL DEFAULT 'verse'
    CHECK (section_type IN ('verse', 'chorus', 'refrain', 'bridge', 'intro', 'outro', 'other')),
  sort_order INTEGER NOT NULL,
  lyrics TEXT NOT NULL,
  actions TEXT,
  action_scope TEXT CHECK (action_scope IN ('line', 'section', 'song')),
  action_line_number INTEGER,
  action_provenance TEXT CHECK (action_provenance IN ('source-documented', 'expert-suggested', 'community-legacy')),
  UNIQUE (song_id, sort_order)
);

CREATE TABLE song_chord_guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  section_id INTEGER REFERENCES song_sections(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('song', 'section', 'line')),
  line_number INTEGER,
  progression TEXT NOT NULL,
  musical_key TEXT,
  capo TEXT,
  tuning TEXT,
  meter TEXT,
  starting_pitch TEXT,
  provenance TEXT NOT NULL CHECK (provenance IN ('source-documented', 'expert-suggested', 'community-legacy')),
  source_note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE song_sources (
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  source_document_id INTEGER NOT NULL REFERENCES source_documents(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('primary', 'transcription', 'arrangement', 'teaching-guidance')),
  locator TEXT,
  evidence_note TEXT,
  PRIMARY KEY (song_id, source_document_id, relationship)
);

CREATE INDEX song_sections_song_idx ON song_sections(song_id, sort_order);
CREATE INDEX song_chord_guides_song_idx ON song_chord_guides(song_id, scope, sort_order);
CREATE INDEX song_sources_song_idx ON song_sources(song_id);

ALTER TABLE song_actions ADD COLUMN song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE;
ALTER TABLE song_actions ADD COLUMN section_id INTEGER REFERENCES song_sections(id) ON DELETE SET NULL;
ALTER TABLE song_actions ADD COLUMN line_number INTEGER;
ALTER TABLE song_actions ADD COLUMN provenance TEXT
  CHECK (provenance IN ('source-documented', 'expert-suggested', 'community-legacy'));

INSERT INTO source_documents (source_path, source_kind, review_state, checksum, imported_at)
VALUES (
  'docs/early-years-music-resources/01-libraries-agencies/pdf/pierce-county-library-wiggles-tickles-rhymes.pdf',
  'pdf', 'reviewed',
  'E4370761B64022909410CD31B8703B25ACBA2F4C228345EE72BF8175E9E23EA8',
  CURRENT_TIMESTAMP
)
ON CONFLICT(source_path) DO UPDATE SET
  review_state = 'reviewed', checksum = excluded.checksum, imported_at = excluded.imported_at;

UPDATE source_documents
SET review_state = 'reviewed',
    checksum = 'E8C6FE665F77D607AEFCDB53A5040BD3C9FF9C99D4AB64216A8593DAB2ADE6C5',
    imported_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md';

UPDATE songs
SET lyrics = 'Pony boy, pony boy
Won’t you be my pony boy?
Here we go,
Don’t go slow,
Giddy-up, giddy-up, giddy-up
Whoa!',
    actions = 'Choose one safe pony movement—rocking, marching, or small in-place gallops—and keep it on an even pulse.',
    instructions = 'Use as a short participatory rhyme. The source explicitly suggests repeating it with “pony girl.”',
    age_range = 'Daycare–Preschool',
    verified = 1,
    type = 'Fingerplay / lap rhyme',
    educational_domain = 'Music & Movement; Language & Vocabulary',
    materials_needed = 'None',
    tags = 'pony, horse, animals, movement, rhyme, participation',
    markdown_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md'
WHERE id = 1339;

DELETE FROM song_sections WHERE song_id = 1339;
INSERT INTO song_sections
  (song_id, label, section_type, sort_order, lyrics, actions, action_scope, action_provenance)
VALUES
  (1339, 'Pony Boy', 'verse', 1,
   'Pony boy, pony boy
Won’t you be my pony boy?
Here we go,
Don’t go slow,
Giddy-up, giddy-up, giddy-up
Whoa!',
   'Choose one safe pony movement—rocking, marching, or small in-place gallops—and keep it on an even pulse.', 'section', 'expert-suggested');

INSERT OR IGNORE INTO song_sources
  (song_id, source_document_id, relationship, locator, evidence_note)
SELECT 1339, id, 'primary', 'PDF page 15; printed page 14',
       'Original Pierce County Library booklet; lyrics and repeat instruction verified visually and by text extraction.'
FROM source_documents
WHERE source_path = 'docs/early-years-music-resources/01-libraries-agencies/pdf/pierce-county-library-wiggles-tickles-rhymes.pdf';

INSERT OR IGNORE INTO song_sources
  (song_id, source_document_id, relationship, locator, evidence_note)
SELECT 1339, id, 'transcription', 'Pony Boy entry',
       'Reviewed local transcription retained as searchable provenance evidence.'
FROM source_documents
WHERE source_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md';

UPDATE search_chunks
SET title = 'Pony Boy — Pierce County Library',
    chunk_text = 'Pony Boy

Pony boy, pony boy
Won’t you be my pony boy?
Here we go,
Don’t go slow,
Giddy-up, giddy-up, giddy-up
Whoa!

Printed action: Repeat with pony girl.

Material type: fingerplay and lap rhyme. Search concepts: fingerplays with ponies, pony rhyme, horse rhyme.

Teacher use: a brief pony-themed participation rhyme supporting animal vocabulary, rhyme, and movement to a steady pulse.',
    lyrics = 'Pony boy, pony boy
Won’t you be my pony boy?
Here we go,
Don’t go slow,
Giddy-up, giddy-up, giddy-up
Whoa!',
    instructions = 'Printed variant instruction: Repeat with pony girl. Expert movement suggestion: choose one safe pony movement and keep it on an even pulse.',
    meta = '{"reviewState":"reviewed","songId":1339,"sourceLocator":"PDF page 15; printed page 14"}',
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md';

INSERT OR IGNORE INTO topic_materials
  (topic_id, material_kind, material_id, role, use_in_phase, routine_slot, teacher_rationale)
VALUES
  (332, 'song', 1339, 'supporting', 'guided-practice', 'circle-time-core',
   'Source-grounded animal word practice: pony provides a concrete category-vocabulary example; repeating with pony girl invites participation without adding unsupported animal facts.'),
  (346, 'song', 1339, 'supporting', 'guided-practice', 'circle-time-core',
   'Expert teaching connection: speak or sing the compact rhyme over a steady pulse and let children mark giddy-up with safe seated or standing movement.'),
  (321, 'song', 1339, 'supporting', 'guided-practice', 'circle-time-core',
   'Expert teaching connection: listen for and repeat the printed go / slow rhyme; singing or chanting slows the words enough to make the matching sound audible.'),
  (350, 'song', 1339, 'supporting', 'guided-practice', 'circle-time-core',
   'Expert teaching connection: place the repeated giddy-up phrase over a simple even pulse. The source does not prescribe an action or beat pattern.');

INSERT OR IGNORE INTO curriculum_topic_songs
  (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'pony-boy-animal-daycare', '5d6a88c9-5f6c-42a5-909e-d2c7a8d4da21', id, 'reviewed-editorial', 332
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md';

INSERT OR IGNORE INTO curriculum_topic_songs
  (id, curriculum_topic_id, search_chunk_id, link_type, topic_id)
SELECT 'pony-boy-rhyme-daycare', '12c5e74d-ee5f-4609-9800-c40d39ce4b6e', id, 'reviewed-editorial', 321
FROM search_chunks WHERE source_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md';

UPDATE retrieval_evaluation_queries
SET expected_title_contains = 'Rhyme Time'
WHERE query_text = 'Fingerplays with ponies';
