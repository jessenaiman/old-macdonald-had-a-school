-- Keep collected, unreviewed song transcriptions in the managed database while
-- excluding them from teacher-facing search. Reviewed sources remain public.
-- This migration changes search metadata only; it does not alter song content,
-- source review state, curriculum links, or the derived FTS text.
PRAGMA foreign_keys = ON;
BEGIN;

UPDATE search_chunks
SET meta = json_set(
  COALESCE(NULLIF(meta, ''), '{}'),
  '$.visibility',
  CASE WHEN EXISTS (
    SELECT 1
    FROM search_chunk_sources scs
    JOIN source_documents sd ON sd.id = scs.source_document_id
    WHERE scs.search_chunk_id = search_chunks.id
      AND sd.review_state LIKE 'reviewed%'
  ) THEN 'public' ELSE 'internal' END,
  '$.reviewState',
  CASE WHEN EXISTS (
    SELECT 1
    FROM search_chunk_sources scs
    JOIN source_documents sd ON sd.id = scs.source_document_id
    WHERE scs.search_chunk_id = search_chunks.id
      AND sd.review_state LIKE 'reviewed%'
  ) THEN 'reviewed' ELSE 'research_wip' END
)
WHERE kind = 'song';

COMMIT;
