PRAGMA foreign_keys = ON;
BEGIN;

-- Teacher calendar language belongs in a reusable vocabulary, not repeated in
-- every curriculum topic. Actual lesson placement remains weekly_pacing.
CREATE TABLE IF NOT EXISTS planning_windows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL COLLATE NOCASE UNIQUE,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS planning_window_aliases (
  planning_window_id INTEGER NOT NULL,
  alias TEXT NOT NULL COLLATE NOCASE UNIQUE,
  PRIMARY KEY (planning_window_id, alias),
  FOREIGN KEY (planning_window_id) REFERENCES planning_windows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS planning_window_months (
  planning_window_id INTEGER NOT NULL,
  month TEXT NOT NULL CHECK (month IN ('Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun')),
  PRIMARY KEY (planning_window_id, month),
  FOREIGN KEY (planning_window_id) REFERENCES planning_windows(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS planning_window_months_month_idx
  ON planning_window_months(month);

INSERT OR IGNORE INTO planning_windows (key, label, description, sort_order) VALUES
  ('september', 'September', 'Lessons paced in September.', 10),
  ('october', 'October', 'Lessons paced in October.', 20),
  ('november', 'November', 'Lessons paced in November.', 30),
  ('december', 'December', 'Lessons paced in December.', 40),
  ('january', 'January', 'Lessons paced in January.', 50),
  ('february', 'February', 'Lessons paced in February.', 60),
  ('march', 'March', 'Lessons paced in March.', 70),
  ('april', 'April', 'Lessons paced in April.', 80),
  ('may', 'May', 'Lessons paced in May.', 90),
  ('june', 'June', 'Lessons paced in June.', 100),
  ('back-to-school', 'Back to school', 'The opening month of the school year; maps to September pacing.', 110),
  ('before-winter-break', 'Before winter break', 'The final month before the winter school break; maps to December pacing.', 120),
  ('after-winter-break', 'After winter break', 'The first school month after the winter break; maps to January pacing.', 130);

INSERT OR IGNORE INTO planning_window_aliases (planning_window_id, alias)
SELECT id, key FROM planning_windows;

INSERT OR IGNORE INTO planning_window_aliases (planning_window_id, alias)
SELECT id, alias FROM (
  SELECT 'september' AS key, 'sept' AS alias UNION ALL
  SELECT 'back-to-school', 'back to school' UNION ALL
  SELECT 'back-to-school', 'start of school year' UNION ALL
  SELECT 'back-to-school', 'start of year' UNION ALL
  SELECT 'before-winter-break', 'before holidays' UNION ALL
  SELECT 'before-winter-break', 'before winter break' UNION ALL
  SELECT 'after-winter-break', 'after holidays' UNION ALL
  SELECT 'after-winter-break', 'after the holidays' UNION ALL
  SELECT 'after-winter-break', 'after winter break'
) AS aliases
JOIN planning_windows windows ON windows.key = aliases.key;

INSERT OR IGNORE INTO planning_window_months (planning_window_id, month)
SELECT id, month FROM (
  SELECT 'september' AS key, 'Sep' AS month UNION ALL
  SELECT 'october', 'Oct' UNION ALL
  SELECT 'november', 'Nov' UNION ALL
  SELECT 'december', 'Dec' UNION ALL
  SELECT 'january', 'Jan' UNION ALL
  SELECT 'february', 'Feb' UNION ALL
  SELECT 'march', 'Mar' UNION ALL
  SELECT 'april', 'Apr' UNION ALL
  SELECT 'may', 'May' UNION ALL
  SELECT 'june', 'Jun' UNION ALL
  SELECT 'back-to-school', 'Sep' UNION ALL
  SELECT 'before-winter-break', 'Dec' UNION ALL
  SELECT 'after-winter-break', 'Jan'
) AS placements
JOIN planning_windows windows ON windows.key = placements.key;

COMMIT;
