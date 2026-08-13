import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('=== DATABASE QUERY (Keyword Search) ===');
  console.log('Query: chunks mentioning "Poulsson" AND "1893"\n');
  
  const result = await client.query(`
    SELECT 
      id,
      kind,
      title,
      source_path,
      chunk_text,
      ts_rank(tsv, plainto_tsquery('english', 'Poulsson 1893')) as relevance
    FROM search_chunks
    WHERE tsv @@ plainto_tsquery('english', 'Poulsson 1893')
    ORDER BY relevance DESC
    LIMIT 2
  `);
  
  console.log(`Found ${result.rows.length} matching chunks:\n`);
  
  result.rows.forEach((row, i) => {
    console.log(`${i + 1}. ${row.title}`);
    console.log(`   Source: ${row.source_path}`);
    console.log(`   Relevance: ${row.relevance.toFixed(3)}`);
    console.log(`   Full text:\n${row.chunk_text}`);
    console.log('\n' + '='.repeat(80) + '\n');
  });
  
  // Extract the fact
  if (result.rows.length > 0) {
    const text = result.rows[0].chunk_text;
    const trademarkMatch = text.match(/\*\*FINGER PLAYS\. TRADE-MARK\. Registered in U\.S\. Patent\s+Office\.\*\*[^.]+\./);
    if (trademarkMatch) {
      console.log('=== EXTRACTED FACT ===');
      console.log(trademarkMatch[0]);
    }
  }
  
  await client.end();
})();
