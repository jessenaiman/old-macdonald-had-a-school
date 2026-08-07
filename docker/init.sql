-- Initialize the omhas search database.
-- Runs once on first container start (docker-entrypoint-initdb.d).

-- Required extensions
-- CREATE EXTENSION IF NOT EXISTS vector;     -- pgvector for semantic search (requires pgvector/pgvector image)
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- trigram similarity for fuzzy text

-- Main search chunks table.
-- One table serves both the public /api/search and the AI skill's retrieval.
CREATE TABLE IF NOT EXISTS search_chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         TEXT NOT NULL CHECK (kind IN (
                 'lesson', 'song', 'knowledge', 'source', 'grade_level'
               )),
  source_path  TEXT NOT NULL,          -- repo-relative path (stable across re-ingests)
  url          TEXT NOT NULL,          -- live site URL for the result
  title        TEXT NOT NULL,
  chunk_text   TEXT NOT NULL,
  embedding    vector(1536),           -- text-embedding-3-small
  meta         JSONB DEFAULT '{}'::jsonb,  -- kind-specific fields (ageRange, era, region, ...)
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Auto-generated tsvector with title weighted higher than body.
-- GENERATED columns can't be declared inline with other defaults in all
-- Postgres versions, so we add it after table creation.
ALTER TABLE search_chunks
  ADD COLUMN IF NOT EXISTS tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(chunk_text, '')), 'B')
  ) STORED;

-- Indexes.
-- GIN for full-text keyword search.
CREATE INDEX IF NOT EXISTS idx_search_chunks_tsv
  ON search_chunks USING GIN (tsv);

-- HNSW for semantic search. Chosen over ivfflat because the corpus
-- will never reach 100k rows; HNSW has better recall at small scale
-- and is simpler to tune.
CREATE INDEX IF NOT EXISTS idx_search_chunks_embedding
  ON search_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Filter indexes for common kind/path queries.
CREATE INDEX IF NOT EXISTS idx_search_chunks_kind
  ON search_chunks (kind);
CREATE INDEX IF NOT EXISTS idx_search_chunks_source_path
  ON search_chunks (source_path);

-- Keep updated_at fresh.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON search_chunks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON search_chunks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
