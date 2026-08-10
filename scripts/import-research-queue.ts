import XLSX from 'xlsx';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./data/omhas.db');
const workbook = XLSX.readFile('data/Early Years Action Song Research Corpus.xlsx');

console.log('=== IMPORTING RESEARCH QUEUE ===\n');

// Read the "Research Queue" sheet
const sheet = workbook.Sheets['Research Queue'];
if (!sheet) {
  console.error('ERROR: "Research Queue" sheet not found');
  console.error('Available sheets:', workbook.SheetNames);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet);
console.log(`Found ${data.length} rows in "Research Queue" sheet\n`);

// Prepare insert statement
const insert = db.prepare(`
  INSERT INTO research_queue (
    id,
    priority,
    resource,
    why_it_matters,
    source_url,
    download_filename,
    assigned_to,
    status,
    notes,
    created_at,
    updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
  )
`);

let imported = 0;
let skipped = 0;

// Import each row
for (const row of data) {
  // Skip empty rows
  if (!row['Priority'] && !row['Resource']) {
    skipped++;
    continue;
  }

  const id = randomUUID();
  const priority = row['Priority'] || 0;
  const resource = row['Resource'] || '';
  const whyItMatters = row['Why it matters'] || null;
  const sourceUrl = row['Source URL'] || null;
  const downloadFilename = row['Download filename'] || null;
  const assignedTo = row['Assigned to'] || null;
  const status = row['Status'] || 'Download needed';
  const notes = row['Notes'] || null;

  try {
    insert.run(
      id,
      priority,
      resource,
      whyItMatters,
      sourceUrl,
      downloadFilename,
      assignedTo,
      status,
      notes
    );
    imported++;
  } catch (error) {
    console.error(`ERROR importing queue item: ${resource}`);
    console.error(error.message);
    skipped++;
  }
}

console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`Imported: ${imported}`);
console.log(`Skipped: ${skipped}`);

// Verify
const items = db.prepare('SELECT * FROM research_queue ORDER BY priority').all();
console.log(`\n=== IMPORTED QUEUE ITEMS ===`);
for (const item of items) {
  console.log(`[${item.priority}] ${item.resource}`);
  console.log(`    Status: ${item.status}`);
  if (item.why_it_matters) {
    console.log(`    Why: ${item.why_it_matters}`);
  }
  console.log('');
}

db.close();
console.log(`\n✓ Research queue imported successfully!`);
