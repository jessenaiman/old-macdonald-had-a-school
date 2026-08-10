-- Add lyrics and instructions columns to search_chunks
ALTER TABLE "search_chunks" ADD COLUMN "lyrics" text;
ALTER TABLE "search_chunks" ADD COLUMN "instructions" text;

-- Add indexes for querying
CREATE INDEX "search_chunks_lyrics_idx" ON "search_chunks" USING btree ("lyrics");
CREATE INDEX "search_chunks_instructions_idx" ON "search_chunks" USING btree ("instructions");
