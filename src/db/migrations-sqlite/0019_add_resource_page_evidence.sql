PRAGMA foreign_keys = ON;
BEGIN;

-- A source file can have a usable text layer while still carrying teaching
-- directions in margins, images, orientation, or page layout. Keep that
-- review evidence at page level before it supports a song or lesson import.
CREATE TABLE IF NOT EXISTS resource_page_evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL REFERENCES resource_file_inventory(id) ON DELETE CASCADE,
  source_document_id INTEGER REFERENCES source_documents(id) ON DELETE SET NULL,
  page_number INTEGER NOT NULL CHECK (page_number > 0),
  assessment_method TEXT NOT NULL CHECK (assessment_method IN ('text', 'vision', 'hybrid')),
  text_layer_state TEXT NOT NULL CHECK (text_layer_state IN ('definitive', 'incomplete', 'unavailable', 'not-applicable')),
  visual_review_state TEXT NOT NULL CHECK (visual_review_state IN ('not-required', 'pending', 'reviewed', 'not-applicable')),
  image_or_layout_present INTEGER NOT NULL DEFAULT 0 CHECK (image_or_layout_present IN (0, 1)),
  rendered_page_path TEXT,
  evidence_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  UNIQUE (inventory_id, page_number)
);

CREATE INDEX IF NOT EXISTS resource_page_evidence_inventory_idx
  ON resource_page_evidence(inventory_id, visual_review_state, page_number);

COMMIT;
