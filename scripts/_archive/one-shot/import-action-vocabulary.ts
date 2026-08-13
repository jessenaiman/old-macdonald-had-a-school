import XLSX from 'xlsx';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./data/omhas.db');
const workbook = XLSX.readFile('data/Early Years Action Song Research Corpus.xlsx');

console.log('=== IMPORTING ACTION VOCABULARY ===\n');

// Read the "Action Vocabulary" sheet
const sheet = workbook.Sheets['Action Vocabulary'];
if (!sheet) {
  console.error('ERROR: "Action Vocabulary" sheet not found');
  console.error('Available sheets:', workbook.SheetNames);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet);
console.log(`Found ${data.length} rows in "Action Vocabulary" sheet\n`);

// Prepare insert statement
const insert = db.prepare(`
  INSERT INTO action_vocabulary (
    id,
    normalized_action_family,
    examples,
    do_not_use_as_proof,
    created_at
  ) VALUES (
    ?, ?, ?, ?, datetime('now')
  )
`);

let imported = 0;
let skipped = 0;

// Import each row
for (const row of data) {
  // Skip empty rows
  if (!row['Normalized action family']) {
    skipped++;
    continue;
  }

  const id = randomUUID();
  const normalizedActionFamily = row['Normalized action family'] || '';
  const examples = row['Examples'] || null;
  const doNotUseAsProof = row['Do not use as proof of song intent'] || null;

  try {
    insert.run(
      id,
      normalizedActionFamily,
      examples,
      doNotUseAsProof
    );
    imported++;
  } catch (error) {
    console.error(`ERROR importing action family: ${normalizedActionFamily}`);
    console.error(error.message);
    skipped++;
  }
}

console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`Imported: ${imported}`);
console.log(`Skipped: ${skipped}`);

// Verify
const families = db.prepare('SELECT normalized_action_family, examples FROM action_vocabulary').all();
console.log(`\n=== IMPORTED ACTION FAMILIES ===`);
for (const family of families) {
  console.log(`• ${family.normalized_action_family}`);
  if (family.examples) {
    console.log(`  Examples: ${family.examples}`);
  }
}

db.close();
console.log(`\n✓ Action vocabulary imported successfully!`);
