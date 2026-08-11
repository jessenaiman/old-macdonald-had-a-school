/**
 * Regenerate all search_chunks embeddings with proper 384-dim number arrays.
 * 
 * The existing embeddings are corrupted (double-serialized as character arrays).
 * This script re-generates them from scratch using Xenova/all-MiniLM-L6-v2.
 * 
 * Usage: node scripts/regenerate-embeddings.mjs
 */

import Database from 'better-sqlite3';
import path from 'path';
import { pipeline, env } from '@xenova/transformers';

const DB_PATH = path.join(process.cwd(), 'data', 'omhas.db');
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';
const MAX_CHUNK_CHARS = 8000;
const BATCH_SIZE = 50;

// Use locally cached model files
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = path.join(process.cwd(), 'node_modules', '@xenova', 'transformers', '.cache');

async function main() {
  const db = new Database(DB_PATH);

  // Load model
  console.log(`Loading model ${MODEL_ID}...`);
  const embedder = await pipeline('feature-extraction', MODEL_ID);
  console.log('Model loaded.\n');

  // Get all chunks
  const chunks = db.prepare('SELECT id, title, chunk_text FROM search_chunks ORDER BY id').all();
  console.log(`Found ${chunks.length} chunks to process.\n`);

  const updateStmt = db.prepare('UPDATE search_chunks SET embedding = ? WHERE id = ?');
  const transaction = db.transaction((batch) => {
    for (const { id, embedding } of batch) {
      updateStmt.run(embedding, id);
    }
  });

  let successCount = 0;
  let failureCount = 0;
  const batch = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const progress = `[${i + 1}/${chunks.length}]`;

    try {
      let text = chunk.chunk_text || '';
      if (text.length > MAX_CHUNK_CHARS) {
        text = text.slice(0, MAX_CHUNK_CHARS);
      }

      // Generate embedding
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data); // 384-dimensional float64 array

      if (embedding.length !== 384) {
        throw new Error(`Expected 384-dim embedding, got ${embedding.length}`);
      }

      // Store as proper JSON number array string
      const embeddingJson = JSON.stringify(embedding);
      batch.push({ id: chunk.id, embedding: embeddingJson });
      successCount++;

      // Flush batch
      if (batch.length >= BATCH_SIZE) {
        transaction(batch.splice(0));
        console.log(`${progress} ✓ Batch committed (${successCount} total)`);
      }

      if (successCount % 100 === 0) {
        console.log(`  ... ${successCount} embeddings generated`);
      }
    } catch (err) {
      failureCount++;
      console.error(`${progress} ✗ Chunk ${chunk.id} "${(chunk.title || '').slice(0, 40)}" — ${err.message}`);
    }
  }

  // Flush remaining
  if (batch.length > 0) {
    transaction(batch.splice(0));
  }

  // Verify
  console.log('\n─────────────────────────────────────────');
  console.log('  EMBEDDING REGENERATION SUMMARY');
  console.log('─────────────────────────────────────────');
  console.log(`  Total chunks:     ${chunks.length}`);
  console.log(`  Successful:       ${successCount}`);
  console.log(`  Failures:         ${failureCount}`);

  // Verify a sample embedding is properly formatted
  const sample = db.prepare('SELECT embedding FROM search_chunks WHERE embedding IS NOT NULL LIMIT 1').get();
  if (sample) {
    const parsed = JSON.parse(sample.embedding);
    console.log(`\n  Verification:`);
    console.log(`    Sample embedding length: ${parsed.length}`);
    console.log(`    First 3 values: ${parsed.slice(0, 3).map(v => v.toFixed(6)).join(', ')}`);
    console.log(`    Type of first element: ${typeof parsed[0]}`);
    console.log(`    ✓ Embeddings are proper number arrays`);
  }

  console.log('─────────────────────────────────────────');
  db.close();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
