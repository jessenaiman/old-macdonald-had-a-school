import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const db = new Database('./data/omhas.db');

console.log('=== PARSING METADATA FILES ===\n');

const metadataDir = 'docs/early-years-music-resources/metadata';
const metadataFiles = fs.readdirSync(metadataDir)
  .filter(f => f.endsWith('.md') && !f.includes('unresolved') && f !== 'SQL_EXPERT_RECOMMENDATION.md');

console.log(`Found ${metadataFiles.length} metadata files to parse\n`);

let totalSources = 0;
let importedSources = 0;
let skippedSources = 0;

// Prepare insert statement
const insertSource = db.prepare(`
  INSERT OR IGNORE INTO research_sources (
    id,
    educator_org,
    source_title,
    source_type,
    age_setting,
    songs_covered,
    direct_url,
    local_pdf_filename,
    download_status,
    research_notes,
    created_at,
    updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
  )
`);

for (const file of metadataFiles) {
  console.log(`\nParsing ${file}...`);
  
  const filePath = path.join(metadataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Split into detailed records (each starts with ### and a number)
  const recordSections = content.split(/(?=### \d+\.)/);
  
  for (const section of recordSections) {
    // Skip if not a detailed record
    if (!section.match(/^### \d+\./)) continue;
    
    totalSources++;
    
    try {
      // Extract fields using regex
      const titleMatch = section.match(/\*\*title:\*\* (.+?)(?:\n|$)/);
      const creatorMatch = section.match(/\*\*creator:\*\* (.+?)(?:\n|$)/);
      const sourceTypeMatch = section.match(/\*\*source_type:\*\* (.+?)(?:\n|$)/);
      const ageRangeMatch = section.match(/\*\*age_range:\*\* (.+?)(?:\n|$)/);
      const songsTopicsMatch = section.match(/\*\*songs_topics:\*\* (.+?)(?:\n|$)/);
      const urlMatch = section.match(/\*\*url:\*\* (.+?)(?:\n|$)/);
      const localFilenameMatch = section.match(/\*\*local_filename:\*\* (.+?)(?:\n|$)/);
      const descriptionMatch = section.match(/\*\*description:\*\* (.+?)(?:\n|$)/);
      
      const title = titleMatch ? titleMatch[1].trim() : '';
      const creator = creatorMatch ? creatorMatch[1].trim() : '';
      const sourceType = sourceTypeMatch ? sourceTypeMatch[1].trim() : '';
      const ageRange = ageRangeMatch ? ageRangeMatch[1].trim() : null;
      const songsTopics = songsTopicsMatch ? songsTopicsMatch[1].trim() : null;
      const url = urlMatch ? urlMatch[1].trim() : null;
      const localFilename = localFilenameMatch ? localFilenameMatch[1].trim() : null;
      const description = descriptionMatch ? descriptionMatch[1].trim() : null;
      
      // Skip if no title
      if (!title) {
        skippedSources++;
        continue;
      }
      
      const id = randomUUID();
      
      insertSource.run(
        id,
        creator,
        title,
        sourceType,
        ageRange,
        songsTopics,
        url,
        localFilename,
        'Available', // All sources in metadata are already downloaded
        description
      );
      
      importedSources++;
      
    } catch (error) {
      console.error(`  ERROR parsing record: ${error.message}`);
      skippedSources++;
    }
  }
}

console.log(`\n\n=== PARSING COMPLETE ===`);
console.log(`Total source records found: ${totalSources}`);
console.log(`Imported: ${importedSources}`);
console.log(`Skipped: ${skippedSources}`);

// Verify
const sourceCount = db.prepare('SELECT COUNT(*) as count FROM research_sources').get();
console.log(`\nTotal sources in database: ${sourceCount.count}`);

// Show breakdown by source type
console.log(`\n=== SOURCES BY TYPE ===`);
const typeCounts = db.prepare(`
  SELECT source_type, COUNT(*) as count
  FROM research_sources
  GROUP BY source_type
  ORDER BY count DESC
  LIMIT 10
`).all();

for (const row of typeCounts) {
  console.log(`  ${row.source_type}: ${row.count} sources`);
}

// Show sample sources
console.log(`\n=== SAMPLE SOURCES ===`);
const sampleSources = db.prepare(`
  SELECT source_title, educator_org, source_type
  FROM research_sources
  LIMIT 5
`).all();

for (const source of sampleSources) {
  console.log(`\n  Title: ${source.source_title}`);
  console.log(`  Creator: ${source.educator_org}`);
  console.log(`  Type: ${source.source_type}`);
}

db.close();
console.log(`\n✓ All research sources imported successfully!`);
