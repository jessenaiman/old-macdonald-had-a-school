import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Altering embedding column from vector(1536) to vector(384)...');
  
  // Drop the old index first
  await client.query('DROP INDEX IF EXISTS idx_search_chunks_embedding');
  
  // Alter the column
  await client.query(`
    ALTER TABLE search_chunks 
    ALTER COLUMN embedding TYPE vector(384)
  `);
  
  // Recreate the index with new dimensions
  await client.query(`
    CREATE INDEX idx_search_chunks_embedding
    ON search_chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64)
  `);
  
  console.log('✓ Column altered and index recreated');
  
  // Verify
  const result = await client.query(`
    SELECT column_name, udt_name 
    FROM information_schema.columns 
    WHERE table_name = 'search_chunks' AND column_name = 'embedding'
  `);
  console.log('Column type:', result.rows[0].udt_name);
  
  await client.end();
})();
