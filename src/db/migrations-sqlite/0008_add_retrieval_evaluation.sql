PRAGMA foreign_keys = ON;

CREATE TABLE retrieval_evaluation_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  query_text TEXT NOT NULL UNIQUE,
  teacher_intent TEXT NOT NULL,
  expected_title_contains TEXT,
  expected_result_kind TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  source_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE retrieval_evaluation_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_id INTEGER NOT NULL REFERENCES retrieval_evaluation_queries(id) ON DELETE CASCADE,
  engine_kind TEXT NOT NULL,
  engine_version TEXT,
  duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
  result_count INTEGER NOT NULL CHECK (result_count >= 0),
  expectation_met INTEGER CHECK (expectation_met IN (0, 1)),
  evaluator_note TEXT,
  executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE retrieval_evaluation_results (
  run_id INTEGER NOT NULL REFERENCES retrieval_evaluation_runs(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank > 0),
  result_kind TEXT NOT NULL,
  result_id TEXT NOT NULL,
  title TEXT NOT NULL,
  match_scope TEXT,
  score REAL,
  PRIMARY KEY (run_id, rank)
);

CREATE INDEX retrieval_evaluation_runs_query_idx
  ON retrieval_evaluation_runs(query_id, executed_at);

INSERT INTO retrieval_evaluation_queries
  (category, query_text, teacher_intent, expected_title_contains, expected_result_kind, source_note)
VALUES
  ('Animals', 'animals with ponies', 'Locate curriculum and usable teaching material connecting ponies with animal learning.', 'Animal', 'topic', 'User acceptance query; 2026-08-12'),
  ('Animals', 'Animals: horses', 'Find lessons featuring horses.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Animals', 'farm animals cow pig chicken', 'Find farm-animal lessons.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Animals', 'ocean animals fish whale dolphin', 'Find ocean-animal lessons.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Animals', 'birds flying nest eggs', 'Find bird-themed lessons.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Music and movement', 'Fingerplays with ponies', 'Find a pony or horse fingerplay with documented actions.', 'Animal', 'topic', 'Legacy curriculum query suite'),
  ('Music and movement', 'fingerplays counting numbers', 'Find counting fingerplays.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Music and movement', 'fingerplays body parts hands feet', 'Find body-awareness fingerplays.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Science', 'Science: electricity', 'Find lessons about electricity.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Science', 'weather seasons rain snow', 'Find lessons about weather and seasons.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Science', 'plants growing seeds garden', 'Find lessons about plant life cycles.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Social-emotional', 'feelings emotions happy sad angry', 'Find emotional-literacy content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Social-emotional', 'sharing taking turns cooperation', 'Find social-skills content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Social-emotional', 'self-regulation calm breathing', 'Find regulation strategies.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Literacy', 'alphabet letters ABC', 'Find alphabet and letter content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Literacy', 'rhyming words phonological awareness', 'Find rhyming and phonological-awareness content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Literacy', 'storytelling narrative sequence', 'Find storytelling content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Math', 'counting numbers 1-10', 'Find counting content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Math', 'shapes circle square triangle', 'Find shape content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Math', 'patterns sorting categorizing', 'Find pattern and sorting content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Routines', 'hello welcome greeting songs', 'Find greeting and opening material.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Routines', 'goodbye farewell closing songs', 'Find closing material.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Routines', 'cleanup transition songs', 'Find cleanup transition material.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Culture', 'multicultural diverse traditions', 'Find culturally responsive content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Seasonal', 'autumn fall leaves harvest', 'Find autumn content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Seasonal', 'winter snow cold holidays', 'Find winter content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Seasonal', 'spring flowers butterflies', 'Find spring content.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Grade context', 'infant baby lullaby soothing', 'Find soothing material suitable for babies.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Grade context', 'toddler movement active energetic', 'Find active movement suitable for toddlers.', NULL, 'topic', 'Legacy curriculum query suite'),
  ('Grade context', 'preschool complex narrative', 'Find narrative material suitable for preschool.', NULL, 'topic', 'Legacy curriculum query suite');
