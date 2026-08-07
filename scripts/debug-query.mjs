import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('=== CHECKING INDEXED CONTENT ===\n');
  
  // Check what chunks mention Poulsson or 1893
  const result = await client.query(`
    SELECT id, title, LEFT(chunk_text, 300) as snippet
    FROM search_chunks
    WHERE chunk_text ILIKE '%Poulsson%'
       OR chunk_text ILIKE '%1893%'
       OR chunk_text ILIKE '%trademark%'
    LIMIT 5
  `);
  
  console.log(`Found ${result.rows.length} chunks mentioning Poulsson/1893/trademark:\n`);
  result.rows.forEach((row, i) => {
    console.log(`${i + 1}. ${row.title}`);
    console.log(`   Snippet: "${row.snippet}..."`);
    console.log();
  });
  
  // Now try a broader semantic search
  console.log('\n=== BROADER SEMANTIC SEARCH ===\n');
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  
  const query = 'history of fingerplays 1893 book';
  const output = await embedder(query, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data);
  const embeddingStr = '[' + queryEmbedding.join(',') + ']';
  
  const searchResult = await client.query(`
    SELECT 
      id,
      title,
      LEFT(chunk_text, 200) as snippet,
      1 - (embedding <=> $1::vector) as semantic_score
    FROM search_chunks
    WHERE embedding <=> $1::vector < 0.7
    ORDER BY semantic_score DESC
    LIMIT 3
  `, [embeddingStr]);
  
  console.log(`Query: "${query}"\n`);
  console.log(`Found ${searchResult.rows.length} results:\n`);
  searchResult.rows.forEach((row, i) => {
    console.log(`${i + 1}. ${row.title} (score: ${row.semantic_score.toFixed(3)})`);
    console.log(`   "${row.snippet}..."`);
    console.log();
  });
  
  await client.end();
})();
