import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('=== SEARCHING FOR TRADEMARK CHUNK ===\n');
  
  // Direct keyword search for TRADE-MARK
  const result = await client.query(`
    SELECT id, title, chunk_text
    FROM search_chunks
    WHERE chunk_text ILIKE '%TRADE-MARK%'
       OR chunk_text ILIKE '%Patent Office%'
  `);
  
  if (result.rows.length > 0) {
    console.log(`Found ${result.rows.length} chunk(s) with trademark info:\n`);
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.title}`);
      console.log(`   Full text:\n${row.chunk_text}\n`);
    });
  } else {
    console.log('No chunks found with TRADE-MARK or Patent Office.\n');
    console.log('This means the chunk containing that specific text was not ingested.');
    console.log('Let me check what chunks exist from history-fingerplays.md:\n');
    
    const historyChunks = await client.query(`
      SELECT id, title, LEFT(chunk_text, 150) as snippet
      FROM search_chunks
      WHERE source_path LIKE '%history-fingerplays%'
      ORDER BY title
    `);
    
    console.log(`Found ${historyChunks.rows.length} chunks from history-fingerplays.md:\n`);
    historyChunks.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.title}`);
      console.log(`   "${row.snippet}..."`);
      console.log();
    });
  }
  
  await client.end();
})();
