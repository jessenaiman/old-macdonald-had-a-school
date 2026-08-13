PRAGMA foreign_keys = ON;
BEGIN;

CREATE TABLE resource_file_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_path TEXT NOT NULL UNIQUE,
  source_kind TEXT NOT NULL,
  checksum TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  modified_at TEXT,
  discovered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_scanned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resource_file_dispositions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL REFERENCES resource_file_inventory(id) ON DELETE CASCADE,
  disposition TEXT NOT NULL CHECK (disposition IN (
    'pending', 'processed', 'duplicate_reference', 'quarantined',
    'unsupported', 'intentionally_excluded'
  )),
  material_kind TEXT,
  material_id INTEGER,
  evidence_note TEXT,
  decided_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX resource_file_dispositions_inventory_idx
  ON resource_file_dispositions(inventory_id, created_at);

CREATE TABLE resource_quarantine (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL REFERENCES resource_file_inventory(id) ON DELETE CASCADE,
  record_locator TEXT,
  reason_code TEXT NOT NULL,
  evidence TEXT NOT NULL,
  retry_status TEXT NOT NULL DEFAULT 'queued'
    CHECK (retry_status IN ('queued', 'retrying', 'resolved', 'needs_human', 'closed')),
  retry_count INTEGER NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  resolution_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX resource_quarantine_status_idx
  ON resource_quarantine(retry_status, created_at);

CREATE TABLE tag_aliases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  alias TEXT NOT NULL COLLATE NOCASE,
  provenance TEXT NOT NULL DEFAULT 'editorial',
  UNIQUE(tag_id, alias)
);

COMMIT;
