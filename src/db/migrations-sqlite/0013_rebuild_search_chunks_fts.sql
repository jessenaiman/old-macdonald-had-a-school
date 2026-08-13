-- Rebuild the external-content FTS5 index from canonical search_chunks after
-- removing a corrupt duplicate chunk in 0012. This changes only the derived
-- index; source rows, song records, and curriculum links are untouched.
PRAGMA foreign_keys = ON;
BEGIN;
INSERT INTO search_chunks_fts(search_chunks_fts) VALUES('rebuild');
COMMIT;
