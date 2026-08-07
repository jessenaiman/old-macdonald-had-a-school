import pg from 'pg';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

/**
 * Parse song markdown to separate lyrics and instructions
 */
function parseSongMarkdown(markdown) {
  const lines = markdown.split('\n');
  const lyrics = [];
  const instructions = [];
  
  let inPrintedActions = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for "Printed actions:" section
    if (line.trim().toLowerCase().includes('printed actions:')) {
      inPrintedActions = true;
      continue;
    }
    
    // If we're in the Printed Actions section, everything is an instruction
    if (inPrintedActions) {
      if (line.trim()) {
        instructions.push(line.trim());
      }
      continue;
    }
    
    // Check for inline italicized instructions
    // Pattern: *instruction text* or _instruction text_
    const italicPattern = /[*_]([^*_]+)[*_]/g;
    const hasItalics = italicPattern.test(line);
    
    if (hasItalics) {
      // Extract italicized parts as instructions
      let match;
      italicPattern.lastIndex = 0; // Reset regex
      while ((match = italicPattern.exec(line)) !== null) {
        instructions.push(match[1].trim());
      }
      
      // Extract non-italicized parts as lyrics
      const lyricsLine = line.replace(italicPattern, '').trim();
      if (lyricsLine) {
        lyrics.push(lyricsLine);
      }
    } else {
      // No italics - this is a lyrics line
      if (line.trim()) {
        lyrics.push(line.trim());
      }
    }
  }
  
  return {
    lyrics: lyrics.join('\n'),
    instructions: instructions.join('\n')
  };
}

/**
 * Test parsing on a sample file
 */
function testParsing() {
  console.log('=== TESTING PARSING LOGIC ===\n');
  
  const testFiles = [
    'humpty-dumpty-wagga-wagga-library-baby-bounce-songs-rhymes.md',
    'humpty-dumpty-good-days-with-kids-circle-time-songs-toddlers.md',
    'humpty-dumpty-mid-north-coast-library-baby-bounce-booklet.md'
  ];
  
  for (const file of testFiles) {
    const filePath = path.join('docs/early-years-music-resources/song_versions', file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ File not found: ${file}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract chunk_text (everything after frontmatter)
    const frontmatterEnd = content.indexOf('---', content.indexOf('---') + 3);
    const chunkText = content.substring(frontmatterEnd + 3).trim();
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`FILE: ${file}`);
    console.log('='.repeat(80));
    
    const parsed = parseSongMarkdown(chunkText);
    
    console.log('\n--- LYRICS ---');
    console.log(parsed.lyrics || '(none)');
    
    console.log('\n--- INSTRUCTIONS ---');
    console.log(parsed.instructions || '(none)');
  }
}

/**
 * Parse and update all song records in database
 */
async function parseAndUpdateAll() {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('\n=== PARSING AND UPDATING ALL SONG RECORDS ===\n');
  
  // Get all song records
  const songs = await client.query(`
    SELECT id, source_path, chunk_text
    FROM search_chunks
    WHERE kind = 'song'
    ORDER BY source_path
  `);
  
  console.log(`Found ${songs.rows.length} song records to parse\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const song of songs.rows) {
    try {
      const parsed = parseSongMarkdown(song.chunk_text);
      
      // Only update if we found something
      if (parsed.lyrics || parsed.instructions) {
        await client.query(`
          UPDATE search_chunks
          SET lyrics = $1, instructions = $2, updated_at = now()
          WHERE id = $3
        `, [parsed.lyrics, parsed.instructions, song.id]);
        
        updated++;
        
        if (updated % 100 === 0) {
          console.log(`  Progress: ${updated}/${songs.rows.length} updated`);
        }
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`  ✗ Error parsing ${song.source_path}: ${error.message}`);
      skipped++;
    }
  }
  
  console.log(`\n✓ Parsing complete`);
  console.log(`  Updated: ${updated} records`);
  console.log(`  Skipped: ${skipped} records`);
  
  // Verify results
  const verify = await client.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(lyrics) as with_lyrics,
      COUNT(instructions) as with_instructions,
      COUNT(CASE WHEN lyrics IS NOT NULL AND instructions IS NOT NULL THEN 1 END) as with_both
    FROM search_chunks
    WHERE kind = 'song'
  `);
  
  console.log('\n✓ Verification:');
  console.log(`  Total songs: ${verify.rows[0].total}`);
  console.log(`  With lyrics: ${verify.rows[0].with_lyrics}`);
  console.log(`  With instructions: ${verify.rows[0].with_instructions}`);
  console.log(`  With both: ${verify.rows[0].with_both}`);
  
  await client.end();
}

// Main execution
(async () => {
  const mode = process.argv[2];
  
  if (mode === 'test') {
    testParsing();
  } else if (mode === 'update') {
    await parseAndUpdateAll();
  } else {
    console.log('Usage:');
    console.log('  node scripts/data/parse-song-lyrics-instructions.mjs test   # Test parsing on sample files');
    console.log('  node scripts/data/parse-song-lyrics-instructions.mjs update # Parse and update all records');
  }
})();
