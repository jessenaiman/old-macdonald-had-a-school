PRAGMA foreign_keys = ON;
BEGIN;

-- A placement is advice from a named planning source, not an authoritative
-- curriculum requirement. Tags remain independent, reusable discovery facets.
CREATE TABLE IF NOT EXISTS suggested_curriculum_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL COLLATE NOCASE UNIQUE,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  provenance_status TEXT NOT NULL
    CHECK (provenance_status IN ('source_backed', 'editorial', 'legacy_unverified')),
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL,
  source_locator TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS suggested_curriculum_plan_placements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL REFERENCES suggested_curriculum_plans(id) ON DELETE CASCADE,
  topic_grade_id INTEGER NOT NULL REFERENCES topic_grades(id) ON DELETE CASCADE,
  week_number INTEGER,
  month TEXT,
  source_locator TEXT,
  relationship_note TEXT,
  UNIQUE (plan_id, topic_grade_id, week_number, month)
);

CREATE INDEX IF NOT EXISTS suggested_curriculum_plan_placements_topic_grade_idx
  ON suggested_curriculum_plan_placements(topic_grade_id);
CREATE INDEX IF NOT EXISTS suggested_curriculum_plan_placements_month_idx
  ON suggested_curriculum_plan_placements(month);

INSERT OR IGNORE INTO suggested_curriculum_plans
  (key, label, description, provenance_status, source_document_id, source_locator)
SELECT
  'curriculum-map-suggested-plan',
  'Curriculum Map — Suggested Plan',
  'A teacher-provided suggested curriculum map that organizes possible lesson and resource connections. It is not an Ontario Ministry of Education curriculum document, official scope and sequence, or complete statement of expectations.',
  'source_backed',
  id,
  'data/Curriculum_Map.xlsx'
FROM source_documents
WHERE source_path = 'data/Curriculum_Map.xlsx';

INSERT OR IGNORE INTO suggested_curriculum_plans
  (key, label, description, provenance_status, source_locator)
VALUES
  ('legacy-kindergarten-september-suggested-plan',
   'Legacy Kindergarten September Suggested Plan',
   'Existing September placements retained for teacher planning. Their original plan source was not recorded, so they are not a required sequence or official curriculum claim.',
   'legacy_unverified',
   'Legacy weekly_pacing rows; provenance not recorded');

-- Copy only the approved release scope. Legacy weekly_pacing remains intact for
-- compatibility and for schedules outside this release.
INSERT OR IGNORE INTO suggested_curriculum_plan_placements
  (plan_id, topic_grade_id, week_number, month, source_locator, relationship_note)
SELECT plan.id, wp.topic_grade_id, wp.week_number, wp.month,
       'data/Curriculum_Map.xlsx',
       'Teacher-provided suggested placement; official curriculum correspondence is recorded separately.'
FROM weekly_pacing wp
JOIN topic_grades tg ON tg.id = wp.topic_grade_id
JOIN grades g ON g.id = tg.grade_id
JOIN suggested_curriculum_plans plan ON plan.key = 'curriculum-map-suggested-plan'
WHERE g.label IN ('Grade 1', 'Grade 2') AND wp.month = 'Sep';

INSERT OR IGNORE INTO suggested_curriculum_plan_placements
  (plan_id, topic_grade_id, week_number, month, source_locator, relationship_note)
SELECT plan.id, wp.topic_grade_id, wp.week_number, wp.month,
       'Legacy weekly_pacing rows; provenance not recorded',
       'Legacy editorial placement retained as an optional planning suggestion.'
FROM weekly_pacing wp
JOIN topic_grades tg ON tg.id = wp.topic_grade_id
JOIN grades g ON g.id = tg.grade_id
JOIN suggested_curriculum_plans plan ON plan.key = 'legacy-kindergarten-september-suggested-plan'
WHERE g.label = 'Kindergarten' AND wp.month = 'Sep';

COMMIT;
