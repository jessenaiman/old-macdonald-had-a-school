-- Remove age_range from grades.
--
-- Curriculum placement is represented by grades + topic_grades. The
-- age_range values on songs, song_actions, and other research tables remain
-- descriptive metadata and are intentionally not changed by this migration.
--
-- Rollback strategy:
--   1. Revert the Git commit containing this migration before applying it.
--   2. Restore the pre-migration SQLite backup if the migration has run.
--
-- This migration intentionally does not preserve grades.age_range in a new
-- table: those values must not remain an implicit curriculum classification.

PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE grades__without_age_range (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    key         TEXT NOT NULL UNIQUE
                    CHECK (key IN ('daycare', 'preschool', 'kindergarten',
                                   'grade-1', 'grade-2', 'grade-3')),
    label       TEXT NOT NULL,
    sort_order  INTEGER
);

INSERT INTO grades__without_age_range (id, key, label, sort_order)
SELECT id, key, label, sort_order
FROM grades;

DROP TABLE grades;

ALTER TABLE grades__without_age_range RENAME TO grades;

COMMIT;

PRAGMA foreign_keys = ON;

-- Verify after applying:
--   PRAGMA foreign_key_check;
--   SELECT name FROM pragma_table_info('grades') WHERE name = 'age_range';
--   SELECT COUNT(*) FROM grades;
--   SELECT COUNT(*) FROM topic_grades;
