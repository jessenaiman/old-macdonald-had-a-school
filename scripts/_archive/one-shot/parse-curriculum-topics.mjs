import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');

console.log('=== Parsing curriculum_topics text fields ===\n');

// 1. Parse tags
console.log('1. Parsing tags...');
const tagsToParse = db.prepare(`
  SELECT ct.id as ct_id, ct.tags, t.id as topic_id
  FROM curriculum_topics ct
  JOIN topics t ON t.topic = ct.lesson_topic
  WHERE ct.tags IS NOT NULL AND ct.tags != ''
`).all();

let tagsInserted = 0;
const insertTag = db.prepare(`
  INSERT OR IGNORE INTO topic_tags (topic_id, tag_id)
  SELECT ?, t.id FROM tags t WHERE t.name = ?
`);

for (const row of tagsToParse) {
  const tagNames = row.tags.split(';').map(t => t.trim()).filter(Boolean);
  for (const tagName of tagNames) {
    const result = insertTag.run(row.topic_id, tagName);
    if (result.changes > 0) tagsInserted++;
  }
}
console.log(`   Inserted ${tagsInserted} topic_tags relations\n`);

// 2. Parse standards
console.log('2. Parsing standards...');
const stdsToParse = db.prepare(`
  SELECT ct.id as ct_id, ct.standards, t.id as topic_id
  FROM curriculum_topics ct
  JOIN topics t ON t.topic = ct.lesson_topic
  WHERE ct.standards IS NOT NULL AND ct.standards != ''
`).all();

let stdsInserted = 0;
const insertStd = db.prepare(`
  INSERT OR IGNORE INTO topic_standards (topic_id, standard_id)
  SELECT ?, s.id FROM standards s WHERE s.code = ?
`);

for (const row of stdsToParse) {
  // Split on semicolons for multiple standards
  const stdList = row.standards.split(';').map(s => s.trim()).filter(Boolean);

  for (const stdText of stdList) {
    // Strip framework prefixes to get the code
    let code = stdText
      .replace(/^Ontario Kindergarten Program\s+/i, '')
      .replace(/^Ontario\s+/i, '')
      .replace(/^ELOF\s+/i, '')
      .replace(/^ELECT\s+/i, '')
      .replace(/^US Common Core\s+/i, '')
      .replace(/^NGSS\s+/i, '')
      .replace(/^CASEL\s+/i, '')
      .replace(/^SHAPE America\s+/i, '')
      .trim();

    // Handle ranges like "B1.3/B1.4" - split and insert both
    const codes = code.split('/').map(c => c.trim()).filter(Boolean);

    for (const c of codes) {
      const result = insertStd.run(row.topic_id, c);
      if (result.changes > 0) stdsInserted++;
    }
  }
}
console.log(`   Inserted ${stdsInserted} topic_standards relations\n`);

// 3. Parse linked_songs
console.log('3. Parsing linked_songs...');
const songsToParse = db.prepare(`
  SELECT ct.id as ct_id, ct.linked_songs, t.id as topic_id
  FROM curriculum_topics ct
  JOIN topics t ON t.topic = ct.lesson_topic
  WHERE ct.linked_songs IS NOT NULL AND ct.linked_songs != ''
`).all();

let songsInserted = 0;
const insertSong = db.prepare(`
  INSERT OR IGNORE INTO topic_materials (topic_id, material_kind, material_id, role)
  SELECT ?, 'song', s.id, 'focus'
  FROM songs s
  WHERE s.title LIKE ?
`);

for (const row of songsToParse) {
  // Extract song names (ignore "+48 more (53 total)" part)
  const songList = row.linked_songs.split(';').map(s => s.trim()).filter(s => !s.startsWith('+'));

  for (const songName of songList) {
    // Use LIKE for fuzzy matching
    const pattern = `%${songName}%`;
    const result = insertSong.run(row.topic_id, pattern);
    if (result.changes > 0) songsInserted++;
  }
}
console.log(`   Inserted ${songsInserted} topic_materials relations\n`);

// Summary
console.log('=== Summary ===');
const tm = db.prepare('SELECT COUNT(*) as n FROM topic_materials').get();
const ts = db.prepare('SELECT COUNT(*) as n FROM topic_standards').get();
const tt = db.prepare('SELECT COUNT(*) as n FROM topic_tags').get();
console.log(`topic_materials: ${tm.n} rows`);
console.log(`topic_standards: ${ts.n} rows`);
console.log(`topic_tags: ${tt.n} rows`);

db.close();
