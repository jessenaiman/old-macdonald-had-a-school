import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

const testQueries = [
  'why do we sing to babies',
  'fingerplay history',
  'phonological awareness',
  'steady beat activities',
  'Froebel mother play'
];

async function generateQueryEmbedding(query) {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  const output = await embedder(query, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function runSearch(client, query, queryEmbedding) {
  const start = Date.now();
  // Format embedding as JSON array string for pgvector
  const embeddingStr = '[' + queryEmbedding.join(',') + ']';
  const result = await client.query(`
    SELECT id, kind, title, 
           ts_rank(tsv, plainto_tsquery('english', $1)) as keyword_score,
           1 - (embedding <=> $2::vector) as semantic_score,
           (0.6 * ts_rank(tsv, plainto_tsquery('english', $1))) + 
           (0.4 * (1 - (embedding <=> $2::vector))) as combined_score
    FROM search_chunks
    WHERE tsv @@ plainto_tsquery('english', $1)
       OR embedding <=> $2::vector < 0.5
    ORDER BY combined_score DESC
    LIMIT 5
  `, [query, embeddingStr]);
  const latency = Date.now() - start;
  return { 
    query, 
    latency, 
    count: result.rows.length,
    topResults: result.rows.slice(0, 3).map(r => ({
      title: r.title,
      combined_score: r.combined_score?.toFixed(3),
      semantic_score: r.semantic_score?.toFixed(3)
    }))
  };
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Loading MiniLM model for query embeddings...');
  const queryEmbeddings = {};
  for (const query of testQueries) {
    queryEmbeddings[query] = await generateQueryEmbedding(query);
  }
  console.log('✓ Model loaded\n');
  
  console.log('Running post-ingestion search tests (21 chunks with embeddings)...\n');
  const results = [];
  
  for (const query of testQueries) {
    const result = await runSearch(client, query, queryEmbeddings[query]);
    results.push(result);
    console.log(`Query: "${query}"`);
    console.log(`  Latency: ${result.latency}ms`);
    console.log(`  Results: ${result.count}`);
    if (result.topResults.length > 0) {
      console.log(`  Top matches:`);
      result.topResults.forEach((r, i) => {
        console.log(`    ${i + 1}. ${r.title} (score: ${r.combined_score})`);
      });
    }
    console.log();
  }
  
  await client.end();
  
  console.log('=== POST-INGESTION SUMMARY ===');
  console.log(`Total queries: ${results.length}`);
  console.log(`Avg latency: ${Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length)}ms`);
  console.log(`Total results returned: ${results.reduce((sum, r) => sum + r.count, 0)}`);
  console.log(`Queries with results: ${results.filter(r => r.count > 0).length}/${results.length}`);
  
  console.log('\n=== COMPARISON ===');
  console.log('Before (empty DB): 48ms avg, 0 results');
  console.log(`After (21 chunks):  ${Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length)}ms avg, ${results.reduce((sum, r) => sum + r.count, 0)} total results`);
})();
