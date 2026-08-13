/**
 * Ingest early-years music knowledge base into Neon Postgres search_chunks.
 *
 * Splits markdown files by ## headings, inserts each section as a chunk.
 * Embeddings are skipped in this first batch (schema expects 1536-dim
 * OpenAI vectors; we'll backfill after deciding on a local model dimension).
 *
 * Usage:  node scripts/ingest-knowledge.mjs
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';

// ── Config ──────────────────────────────────────────────────────────────────

const KNOWLEDGE_DIR = 'docs/early-years-music-resources/knowledge';
const FILES = [
  'core-lessons.md',
  'history-fingerplays.md',
  'retrieval-guide.md',
  'README.md',
];

const MIN_CHUNK_CHARS = 100;
const MAX_FILE_BYTES = 10 * 1024; // 10 KB

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

/**
 * Split markdown by ## headings. Each chunk includes its heading.
 * Content before the first ## heading is returned as a "preamble" chunk
 * with title = file basename.
 */
function splitByHeadings(markdown, fileBaseName) {
  const lines = markdown.split('\n');
  const chunks = [];
  let currentTitle = fileBaseName;
  let currentLines = [];

  for (const line of lines) {
    if (/^## /.test(line)) {
      // Flush previous section
      if (currentLines.length > 0) {
        chunks.push({
          title: currentTitle,
          text: currentLines.join('\n').trim(),
        });
      }
      currentTitle = line.replace(/^## /, '').trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  // Flush last section
  if (currentLines.length > 0) {
    chunks.push({
      title: currentTitle,
      text: currentLines.join('\n').trim(),
    });
  }

  return chunks;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const DATABASE_URL = loadDatabaseUrl();
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  console.log('Connected to Neon database.\n');

  const log = {
    filesProcessed: 0,
    totalChunks: 0,
    skippedFiles: [],
    skippedChunks: [],
    errors: [],
  };

  for (const file of FILES) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const sourcePath = filePath.replace(/\\/g, '/'); // repo-relative, forward slashes

    console.log(`── Processing: ${file}`);

    // Check file exists and size
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      console.log(`   SKIP: file not found`);
      log.skippedFiles.push({ file, reason: 'not found' });
      continue;
    }

    if (stat.size > MAX_FILE_BYTES) {
      console.log(`   SKIP: file too large (${stat.size} bytes > ${MAX_FILE_BYTES})`);
      log.skippedFiles.push({ file, reason: `too large (${stat.size} bytes)` });
      continue;
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');
    const rawChunks = splitByHeadings(markdown, path.basename(file, '.md'));
    let inserted = 0;

    for (const chunk of rawChunks) {
      if (chunk.text.length < MIN_CHUNK_CHARS) {
        console.log(`   SKIP chunk "${chunk.title}": too small (${chunk.text.length} chars)`);
        log.skippedChunks.push({ file, title: chunk.title, reason: `too small (${chunk.text.length} chars)` });
        continue;
      }

      try {
        await client.query(
          `INSERT INTO search_chunks (kind, source_path, url, title, chunk_text, embedding, meta)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            'knowledge',
            sourcePath,
            '', // url — to be mapped later
            chunk.title,
            chunk.text,
            null, // embedding — backfill after dimension decision
            JSON.stringify({
              section: chunk.title,
              file: file,
              ingestion_date: new Date().toISOString(),
            }),
          ]
        );
        inserted++;
      } catch (err) {
        console.error(`   DB ERROR on chunk "${chunk.title}": ${err.message}`);
        log.errors.push({ file, title: chunk.title, error: err.message });
        // Per instructions: stop on database errors
        await client.end();
        console.error('\nStopped due to database error.');
        process.exit(1);
      }
    }

    console.log(`   Inserted ${inserted} chunks`);
    log.filesProcessed++;
    log.totalChunks += inserted;
  }

  await client.end();

  // ── Summary ─────────────────────────────────────────────────────────────

  console.log('\n════════════════════════════════════════');
  console.log('  INGESTION SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`  Files processed:   ${log.filesProcessed}`);
  console.log(`  Total chunks:      ${log.totalChunks}`);
  console.log(`  Skipped files:     ${log.skippedFiles.length}`);
  for (const s of log.skippedFiles) {
    console.log(`    - ${s.file}: ${s.reason}`);
  }
  console.log(`  Skipped chunks:    ${log.skippedChunks.length}`);
  for (const s of log.skippedChunks) {
    console.log(`    - ${s.file} / "${s.title}": ${s.reason}`);
  }
  console.log(`  Errors:            ${log.errors.length}`);
  for (const e of log.errors) {
    console.log(`    - ${e.file} / "${e.title}": ${e.error}`);
  }
  console.log('════════════════════════════════════════\n');

  // ── Verification ────────────────────────────────────────────────────────

  const client2 = new pg.Client(loadDatabaseUrl());
  await client2.connect();
  const verify = await client2.query(
    `SELECT kind, COUNT(*) as count FROM search_chunks GROUP BY kind ORDER BY kind`
  );
  console.log('Verification — search_chunks by kind:');
  for (const row of verify.rows) {
    console.log(`  ${row.kind}: ${row.count}`);
  }
  await client2.end();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
