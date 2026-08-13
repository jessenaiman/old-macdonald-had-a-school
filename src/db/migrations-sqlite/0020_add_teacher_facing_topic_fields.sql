PRAGMA foreign_keys = ON;
BEGIN;

-- Keep the official curriculum wording in topics.topic. These fields are the
-- separate, teacher-facing navigation and planning layer.
ALTER TABLE topics ADD COLUMN teacher_title TEXT;
ALTER TABLE topics ADD COLUMN teacher_summary TEXT;
ALTER TABLE topics ADD COLUMN teacher_title_state TEXT NOT NULL DEFAULT 'pending'
  CHECK (teacher_title_state IN ('pending', 'editorial', 'education-reviewed'));

CREATE INDEX IF NOT EXISTS topics_teacher_title_idx
  ON topics(teacher_title);

-- First reviewed example for the current Grade 1 Week 1 result. The official
-- wording remains unchanged in topics.topic and remains available as reference.
UPDATE topics
SET
  teacher_title = 'Talk Together: Listening, Taking Turns, and Adding On',
  teacher_summary = 'Establish a short partner-talk routine so children practise listening, taking turns, and responding to a classmate before whole-group sharing.',
  teacher_title_state = 'editorial'
WHERE id = 223
  AND (teacher_title IS NULL OR teacher_title = '');

COMMIT;
