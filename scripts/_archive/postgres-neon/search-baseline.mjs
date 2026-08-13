import pg from 'pg';
import fs from 'fs';

// Load DATABASE_URL from .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
if (!dbUrlMatch) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const DATABASE_URL = dbUrlMatch[1];

const testQueries = [
  'why do we sing to babies',
  'fingerplay history',
  'phonological awareness',
  'steady beat activities',
  'Froebel mother play'
];

async function runSearch(client, query) {
  const start = Date.now();
  // For baseline (empty DB), just test keyword search
  const result = await client.query(`
    SELECT id, kind, title, 
           ts_rank(tsv, plainto_tsquery('english', $1)) as keyword_score
    FROM search_chunks
    WHERE tsv @@ plainto_tsquery('english', $1)
    ORDER BY keyword_score DESC
    LIMIT 5
  `, [query]);
  const latency = Date.now() - start;
  return { query, latency, count: result.rows.length };
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Running baseline search tests (empty database)...\n');
  const results = [];
  
  for (const query of testQueries) {
    const result = await runSearch(client, query);
    results.push(result);
    console.log(`Query: "${query}"`);
    console.log(`  Latency: ${result.latency}ms`);
    console.log(`  Results: ${result.count}\n`);
  }
  
  await client.end();
  
  console.log('\n=== BASELINE SUMMARY ===');
  console.log(`Total queries: ${results.length}`);
  console.log(`Avg latency: ${Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length)}ms`);
  console.log(`Total results returned: ${results.reduce((sum, r) => sum + r.count, 0)}`);
  console.log(`Queries with results: ${results.filter(r => r.count > 0).length}/${results.length}`);
})();
