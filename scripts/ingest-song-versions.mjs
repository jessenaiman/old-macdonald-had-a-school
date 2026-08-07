import pg from 'pg';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

// Get all song_versions files
const songVersionsDir = 'docs/early-years-music-resources/song_versions';
const files = fs.readdirSync(songVersionsDir).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} song_versions files to process`);

async function generateEmbedding(text) {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Connected to database');
  console.log('Loading MiniLM model...');
  
  // Load model once (should be cached now)
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  console.log('✓ Model loaded\n');
  
  let processed = 0;
  let skipped = 0;
  const batchSize = 50;
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)} (${batch.length} files)...`);
    
    for (const file of batch) {
      try {
        const filePath = path.join(songVersionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract metadata from frontmatter (handle both Unix and Windows line endings)
        const normalizedContent = content.replace(/\r\n/g, '\n');
        const frontmatterMatch = normalizedContent.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
          console.log(`  ⚠ No frontmatter in ${file}`);
          skipped++;
          continue;
        }
        
        const frontmatter = frontmatterMatch[1];
        const body = content.slice(frontmatterMatch[0].length).trim();
        
        // Skip if body is too short (less than 50 chars)
        if (body.length < 50) {
          skipped++;
          continue;
        }
        
        // Parse key fields
        const sourcePath = `docs/early-years-music-resources/song_versions/${file}`;
        const title = file.replace(/\.md$/, '').replace(/-/g, ' ');
        
        // Extract metadata fields
        const sourceMatch = frontmatter.match(/source:\s*(.+)/);
        const source = sourceMatch ? sourceMatch[1].trim() : '';
        
        const ageMatch = frontmatter.match(/age_range:\s*(.+)/);
        const ageRange = ageMatch ? ageMatch[1].trim() : '';
        
        const domainMatch = frontmatter.match(/educational_domain:\s*(.+)/);
        const domain = domainMatch ? domainMatch[1].trim() : '';
        
        // Generate embedding
        const embedding = await embedder(body, { pooling: 'mean', normalize: true });
        const embeddingArray = Array.from(embedding.data);
        const embeddingStr = '[' + embeddingArray.join(',') + ']';
        
        // Insert into database (no ON CONFLICT - just insert all)
        await client.query(`
          INSERT INTO search_chunks (kind, source_path, url, title, chunk_text, embedding, meta)
          VALUES ($1, $2, $3, $4, $5, $6::vector, $7)
        `, [
          'song',
          sourcePath,
          '',
          title,
          body,
          embeddingStr,
          { source, ageRange, domain }
        ]);
        
        processed++;
      } catch (err) {
        console.error(`  ✗ Error processing ${file}: ${err.message}`);
        skipped++;
      }
    }
    
    console.log(`  ✓ Batch complete (processed: ${processed}, skipped: ${skipped})`);
  }
  
  console.log(`\n✓ Ingestion complete`);
  console.log(`  Processed: ${processed} song_versions`);
  console.log(`  Skipped: ${skipped}`);
  
  // Verify
  const count = await client.query('SELECT COUNT(*) FROM search_chunks WHERE kind = $1', ['song']);
  console.log(`\nTotal song chunks in database: ${count.rows[0].count}`);
  
  const total = await client.query('SELECT COUNT(*) FROM search_chunks');
  console.log(`Total chunks (all kinds): ${total.rows[0].count}`);
  
  await client.end();
})();
