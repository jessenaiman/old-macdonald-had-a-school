import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('=== QUERYING DATABASE FOR HUMPTY DUMPTY ===\n');
  
  // Query for Humpty Dumpty
  const result = await client.query(`
    SELECT 
      id,
      kind,
      title,
      source_path,
      chunk_text,
      meta
    FROM search_chunks
    WHERE title ILIKE '%humpty dumpty%'
       OR chunk_text ILIKE '%humpty dumpty%'
    ORDER BY title
    LIMIT 10
  `);
  
  console.log(`Found ${result.rows.length} records\n`);
  console.log('='.repeat(80));
  
  result.rows.forEach((row, i) => {
    console.log(`\n${i + 1}. ${row.title}`);
    console.log(`   Kind: ${row.kind}`);
    console.log(`   Source: ${row.source_path}`);
    console.log(`   Meta: ${JSON.stringify(row.meta, null, 2)}`);
    console.log(`\n   Full chunk_text:\n${row.chunk_text}`);
    console.log('\n' + '-'.repeat(80));
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\nANALYSIS:');
  console.log('- Instructions and lyrics are in the SAME chunk_text field');
  console.log('- Instructions appear as:');
  console.log('  • Italicized text within lyrics (e.g., *Hold baby still on lap*)');
  console.log('  • "Printed actions:" section at the end');
  console.log('  • Embedded in evidence_quote in frontmatter');
  console.log('\nRECOMMENDATION:');
  console.log('- Current structure: instructions mixed with lyrics');
  console.log('- To separate: would need to parse chunk_text and extract instructions');
  console.log('- Alternative: add separate columns for lyrics and instructions');
  
  await client.end();
})();
