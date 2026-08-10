import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Applying migration: Add lyrics and instructions columns...\n');
  
  const migration = fs.readFileSync('src/db/migrations/0004_add_lyrics_instructions.sql', 'utf-8');
  
  try {
    await client.query(migration);
    console.log('✓ Migration applied successfully');
    
    // Verify columns exist
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'search_chunks' 
      AND column_name IN ('lyrics', 'instructions')
      ORDER BY column_name
    `);
    
    console.log(`\n✓ Verified ${result.rows.length} new columns:`);
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}`);
    });
    
  } catch (error) {
    console.error('Error applying migration:', error.message);
    process.exit(1);
  }
  
  await client.end();
})();
