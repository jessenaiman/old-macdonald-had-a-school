import pg from 'pg';
import fs from 'fs';

// Neon database URL (source)
const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_crtE6i8yCzJh@ep-soft-butterfly-ax1441oa-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Local database URL (destination)
const LOCAL_DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

async function migrateTable(sourceClient, destClient, tableName, columns, skipColumns = []) {
  console.log(`\nMigrating ${tableName}...`);
  
  // Get count from source
  const countResult = await sourceClient.query(`SELECT COUNT(*) FROM ${tableName}`);
  const totalCount = parseInt(countResult.rows[0].count);
  console.log(`  Found ${totalCount} rows in Neon`);
  
  if (totalCount === 0) {
    console.log(`  Skipping (no data)`);
    return;
  }
  
  // Filter out skipped columns
  const filteredColumns = columns.filter(col => !skipColumns.includes(col));
  const columnList = filteredColumns.join(', ');
  const placeholders = filteredColumns.map((_, i) => `$${i + 1}`).join(', ');
  
  // Get all rows from source
  const sourceResult = await sourceClient.query(`SELECT ${columnList} FROM ${tableName}`);
  const rows = sourceResult.rows;
  
  console.log(`  Migrating ${rows.length} rows...`);
  
  // Insert in batches
  const batchSize = 100;
  let migrated = 0;
  
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    for (const row of batch) {
      const values = filteredColumns.map(col => row[col]);
      
      try {
        await destClient.query(
          `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders})
           ON CONFLICT (id) DO NOTHING`,
          values
        );
        migrated++;
      } catch (error) {
        console.error(`    Error inserting row: ${error.message}`);
      }
    }
    
    console.log(`  Progress: ${migrated}/${rows.length}`);
  }
  
  console.log(`  ✓ Migrated ${migrated} rows`);
}

(async () => {
  console.log('=== MIGRATING DATA FROM NEON TO LOCAL POSTGRESQL ===\n');
  
  const sourceClient = new pg.Client(NEON_DATABASE_URL);
  const destClient = new pg.Client(LOCAL_DATABASE_URL);
  
  try {
    await sourceClient.connect();
    console.log('✓ Connected to Neon (source)');
    
    await destClient.connect();
    console.log('✓ Connected to local PostgreSQL (destination)');
    
    // Migrate search_chunks (skip embedding column since we don't have pgvector)
    await migrateTable(
      sourceClient,
      destClient,
      'search_chunks',
      ['id', 'kind', 'source_path', 'url', 'title', 'chunk_text', 'lyrics', 'instructions', 'meta', 'created_at', 'updated_at'],
      ['embedding'] // Skip embedding column
    );
    
    // Verify migration
    console.log('\n=== VERIFICATION ===\n');
    
    const verifyQuery = `
      SELECT 
        (SELECT COUNT(*) FROM search_chunks) as search_chunks_count,
        (SELECT COUNT(*) FROM curriculum_topics) as curriculum_topics_count,
        (SELECT COUNT(*) FROM song_actions) as song_actions_count,
        (SELECT COUNT(*) FROM research_sources) as research_sources_count,
        (SELECT COUNT(*) FROM curriculum_topic_songs) as curriculum_topic_songs_count,
        (SELECT COUNT(*) FROM song_action_chunks) as song_action_chunks_count,
        (SELECT COUNT(*) FROM research_queue) as research_queue_count,
        (SELECT COUNT(*) FROM action_vocabulary) as action_vocabulary_count
    `;
    
    const verifyResult = await destClient.query(verifyQuery);
    const counts = verifyResult.rows[0];
    
    console.log('Table counts in local database:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count}`);
    });
    
    console.log('\n✓ Migration complete!');
    console.log('  Note: Embedding vectors were not migrated (pgvector not available locally)');
    console.log('  Full-text search via tsv column is still available');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sourceClient.end();
    await destClient.end();
  }
})();
