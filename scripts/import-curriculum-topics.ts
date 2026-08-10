import XLSX from 'xlsx';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./data/omhas.db');
const workbook = XLSX.readFile('data/Curriculum_Export_v2_2026-08-06.xlsx');

console.log('=== IMPORTING CURRICULUM TOPICS ===\n');

// Read the "All Topics" sheet
const sheet = workbook.Sheets['All Topics'];
if (!sheet) {
  console.error('ERROR: "All Topics" sheet not found');
  console.error('Available sheets:', workbook.SheetNames);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet);
console.log(`Found ${data.length} rows in "All Topics" sheet\n`);

// Prepare insert statement
const insert = db.prepare(`
  INSERT INTO curriculum_topics (
    id,
    grade_key,
    grade,
    early_years,
    subject,
    category,
    seq_number,
    lesson_topic,
    skill_statement,
    standards,
    song_count,
    linked_songs,
    linked_resources,
    tags,
    circle_time_slot,
    created_at,
    updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
  )
`);

let imported = 0;
let skipped = 0;

// Import each row
for (const row of data) {
  // Skip empty rows
  if (!row['Grade Key'] && !row['Lesson Topic']) {
    skipped++;
    continue;
  }

  const id = randomUUID();
  const gradeKey = row['Grade Key'] || '';
  const grade = row['Grade'] || '';
  const earlyYears = row['Early Years?'] === 'Yes' ? 1 : 0;
  const subject = row['Subject'] || '';
  const category = row['Category'] || null;
  const seqNumber = row['Seq #'] || null;
  const lessonTopic = row['Lesson Topic'] || '';
  const skillStatement = row['Skill Statement'] || null;
  const standards = row['Standards'] || null;
  const songCount = row['Song Count'] || 0;
  const linkedSongs = row['Linked Songs (sample)'] || null;
  const linkedResources = row['Linked Resources'] || null;
  const tags = row['Tags'] || null;
  const circleTimeSlot = row['Circle Time / Routine Slot'] || null;

  try {
    insert.run(
      id,
      gradeKey,
      grade,
      earlyYears,
      subject,
      category,
      seqNumber,
      lessonTopic,
      skillStatement,
      standards,
      songCount,
      linkedSongs,
      linkedResources,
      tags,
      circleTimeSlot
    );
    imported++;
  } catch (error) {
    console.error(`ERROR importing row: ${lessonTopic}`);
    console.error(error.message);
    skipped++;
  }
}

console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`Imported: ${imported}`);
console.log(`Skipped: ${skipped}`);

// Verify by grade level
const gradeCounts = db.prepare(`
  SELECT grade_key, COUNT(*) as count
  FROM curriculum_topics
  GROUP BY grade_key
  ORDER BY grade_key
`).all();

console.log(`\n=== TOPICS BY GRADE LEVEL ===`);
for (const row of gradeCounts) {
  console.log(`${row.grade_key}: ${row.count} topics`);
}

// Verify by subject
const subjectCounts = db.prepare(`
  SELECT subject, COUNT(*) as count
  FROM curriculum_topics
  GROUP BY subject
  ORDER BY count DESC
`).all();

console.log(`\n=== TOPICS BY SUBJECT ===`);
for (const row of subjectCounts) {
  console.log(`${row.subject}: ${row.count} topics`);
}

db.close();
console.log(`\n✓ Curriculum topics imported successfully!`);
