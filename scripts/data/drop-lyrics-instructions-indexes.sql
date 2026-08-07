-- Remove btree indexes on lyrics and instructions (they exceed max row size for long text)
-- Full-text search via tsv column handles content searching
DROP INDEX IF EXISTS "search_chunks_lyrics_idx";
DROP INDEX IF EXISTS "search_chunks_instructions_idx";
