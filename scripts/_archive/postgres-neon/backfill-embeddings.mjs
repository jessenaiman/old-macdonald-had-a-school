/**
 * Backfill embeddings for search_chunks with NULL embedding.
 *
 * Uses Xenova/all-MiniLM-L6-v2 (384-dim) via @xenova/transformers.
 * Processes chunks sequentially to keep memory low.
 *
 * Usage:  node scripts/backfill-embeddings.mjs
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { pipeline, env } from '@xenova/transformers';

// Point to the local cache where download-model.mjs stored the files.
// @xenova/transformers resolves: {localModelPath}/{modelId}/tokenizer.json
// So localModelPath must be the parent of "Xenova/all-MiniLM-L6-v2"
const CACHE_ROOT = path.join(
  process.cwd(),
  'node_modules', '@xenova', 'transformers', '.cache'
);
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = CACHE_ROOT;

// ── Config ──────────────────────────────────────────────────────────────────

const MAX_CHUNK_CHARS = 8000;
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

// ── Helpers ─────────────────────────────────────────────────────────────────

function loadDatabaseUrl() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/^DATABASE_URL=(.+)$/m);
  if (!match) {
    console.error('ERROR: DATABASE_URL not found in .env.local');
    process.exit(1);
  }
  return match[1].trim();
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const DATABASE_URL = loadDatabaseUrl();
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  console.log('Connected to database.\n');

  // Load the embedding model (with retries for network issues)
  console.log(`Loading model ${MODEL_ID}...`);
  let embedder;
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      embedder = await pipeline('feature-extraction', MODEL_ID);
      console.log('Model loaded.\n');
      break;
    } catch (err) {
      console.error(`  Attempt ${attempt}/${MAX_RETRIES} failed: ${err.cause?.code || err.message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to load model after ${MAX_RETRIES} attempts: ${err.message}`);
      }
      const waitMs = attempt * 3000;
      console.log(`  Retrying in ${waitMs / 1000}s...`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }

  // Fetch all chunks with NULL embedding
  const { rows: chunks } = await client.query(
    `SELECT id, title, chunk_text FROM search_chunks WHERE embedding IS NULL ORDER BY id`
  );

  console.log(`Found ${chunks.length} chunks with NULL embedding.\n`);

  let successCount = 0;
  let failureCount = 0;
  const failures = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const titlePreview = (chunk.title || '').slice(0, 50);
    const progress = `[${i + 1}/${chunks.length}]`;

    try {
      // Truncate if too long
      let text = chunk.chunk_text;
      if (text.length > MAX_CHUNK_CHARS) {
        text = text.slice(0, MAX_CHUNK_CHARS);
        console.log(`${progress} Chunk ${chunk.id} truncated from ${chunk.chunk_text.length} to ${MAX_CHUNK_CHARS} chars`);
      }

      // Generate embedding
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data); // 384-dimensional

      // Verify dimension
      if (embedding.length !== 384) {
        throw new Error(`Expected 384-dim embedding, got ${embedding.length}`);
      }

      // Format as PostgreSQL vector literal: [0.1,0.2,...]
      const vectorStr = '[' + embedding.join(',') + ']';

      // Update the chunk
      await client.query(
        `UPDATE search_chunks SET embedding = $1::vector WHERE id = $2`,
        [vectorStr, chunk.id]
      );

      successCount++;
      console.log(`${progress} ✓ Chunk ${chunk.id} — "${titlePreview}" — embedding generated (384-dim)`);
    } catch (err) {
      failureCount++;
      failures.push({ id: chunk.id, title: titlePreview, error: err.message });
      console.error(`${progress} ✗ Chunk ${chunk.id} — "${titlePreview}" — ERROR: ${err.message}`);
    }
  }

  // ── Verification ──────────────────────────────────────────────────────────

  console.log('\n─────────────────────────────────────────');
  console.log('  BACKFILL SUMMARY');
  console.log('─────────────────────────────────────────');
  console.log(`  Total chunks processed:  ${chunks.length}`);
  console.log(`  Successful embeddings:   ${successCount}`);
  console.log(`  Failures:                ${failureCount}`);
  if (failures.length > 0) {
    console.log('  Failed chunks:');
    for (const f of failures) {
      console.log(`    - ID ${f.id} "${f.title}": ${f.error}`);
    }
  }
  console.log('─────────────────────────────────────────');

  // Final verification query
  const verifyResult = await client.query(
    `SELECT COUNT(*) AS total, COUNT(embedding) AS with_embedding, COUNT(*) - COUNT(embedding) AS without_embedding FROM search_chunks`
  );
  const v = verifyResult.rows[0];
  console.log(`\n  Verification:`);
  console.log(`    Total chunks:             ${v.total}`);
  console.log(`    With embedding:           ${v.with_embedding}`);
  console.log(`    Without embedding (NULL): ${v.without_embedding}`);
  console.log('');

  await client.end();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
