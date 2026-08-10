import XLSX from 'xlsx';
import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');
const workbook = XLSX.readFile('data/Early Years Action Song Research Corpus.xlsx');

console.log('=== IMPORTING RESEARCH SOURCES ===\n');

// Read the "Sources" sheet
const sheet = workbook.Sheets['Sources'];
if (!sheet) {
  console.error('ERROR: "Sources" sheet not found');
  console.error('Available sheets:', workbook.SheetNames);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet);
console.log(`Found ${data.length} rows in "Sources" sheet\n`);

// Prepare insert statement
const insert = db.prepare(`
  INSERT OR REPLACE INTO research_sources (
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

let imported = 0;
let skipped = 0;

// Import each row
for (const row of data) {
  // Skip empty rows
  if (!row['Source ID'] && !row['Source title']) {
    skipped++;
    continue;
  }

  const id = row['Source ID'] || '';
  const educatorOrg = row['Educator / organization'] || '';
  const sourceTitle = row['Source title'] || '';
  const sourceType = row['Source type'] || '';
  const ageSetting = row['Age / setting'] || null;
  const songsCovered = row['Songs covered'] || null;
  const directUrl = row['Direct URL'] || null;
  const localPdfFilename = row['Local PDF filename'] || null;
  const downloadStatus = row['Download status'] || 'Download needed';
  const researchNotes = row['Research notes'] || null;

  try {
    insert.run(
      id,
      educatorOrg,
      sourceTitle,
      sourceType,
      ageSetting,
      songsCovered,
      directUrl,
      localPdfFilename,
      downloadStatus,
      researchNotes
    );
    imported++;
  } catch (error) {
    console.error(`ERROR importing source: ${sourceTitle}`);
    console.error(error.message);
    skipped++;
  }
}

console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`Imported: ${imported}`);
console.log(`Skipped: ${skipped}`);

// Verify
const sources = db.prepare('SELECT * FROM research_sources').all();
console.log(`\n=== IMPORTED SOURCES ===`);
for (const source of sources) {
  console.log(`${source.id}: ${source.source_title}`);
  console.log(`  Type: ${source.source_type}`);
  console.log(`  Status: ${source.download_status}`);
  console.log('');
}

db.close();
console.log(`\n✓ Research sources imported successfully!`);
