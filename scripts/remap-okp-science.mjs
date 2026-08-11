import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');
const FRAMEWORK = 'Ontario Kindergarten Program';
const SOURCE = 'The Kindergarten Program (2016) — best-fit mapping for legacy science codes (OE 32-37 do not exist in the 2016 document)';

// Legacy fabricated codes → best-fit REAL 2016 standard
// OE 32 What Makes Things Move? → OE 13 (inquiry: questioning, predicting, observing)
// OE 33 Exploring Living Things / Spring Growth → OE 14 (natural environment)
// OE 34 Winter Weather → OE 14 (natural environment)
// OE 35 Building Structures → OE 24 (technological problem-solving / constructing)
// OE 37 Simple Machines → OE 24 (technological problem-solving / constructing)
const LEGACY_MAP = {
  'OE 32': 'OE 13',
  'SE 32.1': null, // best fit: no exact SE; handled at OE level
  'OE 33': 'OE 14',
  'SE 33.1': 'SE 14.1', // ask questions about natural occurrences
  'SE 33.2': 'SE 14.2', // sort and classify living/non-living things
  'OE 34': 'OE 14',
  'SE 34.1': 'SE 14.3', // patterns in the natural environment
  'OE 35': 'OE 24',
  'SE 35.1': 'SE 24.4', // select and use tools to construct things
  'OE 37': 'OE 24',
  'SE 37.1': 'SE 24.2', // state problems and pose questions as part of creating/designing
};

// Topics that had these legacy codes, from the to-be-mapped set
const legacyTopics = db.prepare(`
  SELECT ts.topic_id, s.code
  FROM topic_standards ts
  JOIN standards s ON s.id = ts.standard_id
  WHERE s.framework = ?
`).all(FRAMEWORK);

// We need the legacy codes, but they've been deleted. Reconstruct from topic names.
const scienceTopics = db.prepare(`
  SELECT id, topic FROM topics
  WHERE topic IN (
    'What Makes Things Move?',
    'Exploring Living Things',
    'Spring Growth and Change',
    'Winter Weather Explorations',
    'Building Structures',
    'Simple Machines in Action'
  )
`).all();

console.log('Topics to relink:');
const topicLegacyCode = {
  'What Makes Things Move?': 'OE 32',
  'Exploring Living Things': 'OE 33',
  'Spring Growth and Change': 'OE 33',
  'Winter Weather Explorations': 'OE 34',
  'Building Structures': 'OE 35',
  'Simple Machines in Action': 'OE 37',
};

const findByCode = db.prepare("SELECT id FROM standards WHERE framework = ? AND code = ?");
const insertLink = db.prepare('INSERT OR IGNORE INTO topic_standards (topic_id, standard_id) VALUES (?, ?)');

for (const t of scienceTopics) {
  const legacy = topicLegacyCode[t.topic];
  const target = LEGACY_MAP[legacy];
  if (!target) { console.log(`  SKIP ${t.topic}: no mapping for ${legacy}`); continue; }
  const row = findByCode.get(FRAMEWORK, target);
  if (!row) { console.log(`  SKIP ${t.topic}: target ${target} not found`); continue; }
  insertLink.run(t.id, row.id);
  console.log(`  ${t.topic} → ${target} (topic id ${t.id})`);
}

// Also link the OE-level for those topics
const linkOe = (topicId, oeTarget) => {
  const row = findByCode.get(FRAMEWORK, oeTarget);
  if (row) insertLink.run(topicId, row.id);
};

for (const t of scienceTopics) {
  const legacy = topicLegacyCode[t.topic];
  const oeTarget = LEGACY_MAP[legacy]?.startsWith('OE ') ? LEGACY_MAP[legacy] : null;
  if (oeTarget) linkOe(t.id, oeTarget);
}

// Verify
const check = db.prepare(`
  SELECT COUNT(*) as n FROM topic_standards ts
  JOIN standards s ON s.id = ts.standard_id
  WHERE s.framework = ?
`).get(FRAMEWORK);
console.log(`\nTopics linked to OKP now: ${check.n} links`);

db.close();