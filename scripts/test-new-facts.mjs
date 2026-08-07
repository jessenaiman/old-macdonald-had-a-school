import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

const testQueries = [
  '5 months old babies discriminate happy sad music',
  'crossing the midline bilateral coordination drumming',
  'rhyming problem early literacy Harper Gildon'
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
  const embeddingStr = '[' + queryEmbedding.join(',') + ']';
  const result = await client.query(`
    SELECT id, kind, title, source_path,
           LEFT(chunk_text, 250) as snippet,
           ts_rank(tsv, plainto_tsquery('english', $1)) as keyword_score,
           1 - (embedding <=> $2::vector) as semantic_score,
           (0.6 * ts_rank(tsv, plainto_tsquery('english', $1))) + 
           (0.4 * (1 - (embedding <=> $2::vector))) as combined_score
    FROM search_chunks
    WHERE tsv @@ plainto_tsquery('english', $1)
       OR embedding <=> $2::vector < 0.6
    ORDER BY combined_score DESC
    LIMIT 3
  `, [query, embeddingStr]);
  const latency = Date.now() - start;
  return { query, latency, count: result.rows.length, results: result.rows };
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Testing search for 3 NEW facts from PDFs...\n');
  console.log('Loading MiniLM model...');
  
  const results = [];
  for (const query of testQueries) {
    console.log(`\nGenerating embedding for: "${query}"`);
    const queryEmbedding = await generateQueryEmbedding(query);
    const result = await runSearch(client, query, queryEmbedding);
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('SEARCH RESULTS FOR NEW FACTS');
  console.log('='.repeat(80));
  
  results.forEach((result, i) => {
    console.log(`\n${i + 1}. QUERY: "${result.query}"`);
    console.log(`   Latency: ${result.latency}ms`);
    console.log(`   Found: ${result.count} results\n`);
    
    if (result.results.length > 0) {
      result.results.forEach((row, j) => {
        console.log(`   ${j + 1}. ${row.title}`);
        console.log(`      Source: ${row.source_path}`);
        console.log(`      Combined: ${row.combined_score.toFixed(3)} | Keyword: ${(row.keyword_score || 0).toFixed(3)} | Semantic: ${row.semantic_score.toFixed(3)}`);
        console.log(`      Snippet: "${row.snippet}..."`);
        console.log();
      });
    } else {
      console.log('   ❌ No results found\n');
    }
  });
  
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  const successful = results.filter(r => r.count > 0).length;
  console.log(`Queries with results: ${successful}/${results.length}`);
  console.log(`Average latency: ${Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length)}ms`);
  
  await client.end();
})();
