import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

async function generateQueryEmbedding(query) {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  const output = await embedder(query, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  const query = 'Poulsson trademark finger plays 1893 Patent Office';
  console.log('=== DATABASE QUERY ===');
  console.log(`Query: "${query}"\n`);
  
  console.log('Generating query embedding...');
  const queryEmbedding = await generateQueryEmbedding(query);
  const embeddingStr = '[' + queryEmbedding.join(',') + ']';
  
  console.log('Running hybrid search...\n');
  const result = await client.query(`
    SELECT 
      id,
      kind,
      title,
      LEFT(chunk_text, 200) as snippet,
      ts_rank(tsv, plainto_tsquery('english', $1)) as keyword_score,
      1 - (embedding <=> $2::vector) as semantic_score,
      (0.6 * ts_rank(tsv, plainto_tsquery('english', $1))) + 
      (0.4 * (1 - (embedding <=> $2::vector))) as combined_score
    FROM search_chunks
    WHERE tsv @@ plainto_tsquery('english', $1)
       OR embedding <=> $2::vector < 0.5
    ORDER BY combined_score DESC
    LIMIT 3
  `, [query, embeddingStr]);
  
  console.log('=== RESULTS ===');
  console.log(`Found ${result.rows.length} matching chunks:\n`);
  
  result.rows.forEach((row, i) => {
    console.log(`${i + 1}. ${row.title}`);
    console.log(`   Kind: ${row.kind}`);
    console.log(`   Combined score: ${row.combined_score.toFixed(3)}`);
    console.log(`   Keyword score: ${row.keyword_score?.toFixed(3) || '0.000'}`);
    console.log(`   Semantic score: ${row.semantic_score.toFixed(3)}`);
    console.log(`   Snippet: "${row.snippet}..."`);
    console.log();
  });
  
  await client.end();
})();
