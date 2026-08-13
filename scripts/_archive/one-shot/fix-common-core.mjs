import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');
const FRAMEWORK = 'US Common Core';
const SOURCE = 'Common Core State Standards English Language Arts (2023 PDF), corestandards.org';

// Real codes verified against the official PDF — fill missing text
const FILL = {
  'RL.1.1': 'Ask and answer questions about key details in a text.',
  'RL.1.2': 'Retell stories, including key details, and demonstrate understanding of their central message or lesson.',
  'RL.1.3': 'Describe characters, settings, and major events in a story, using key details.',
  'W.2.4': 'With guidance and support from adults, produce writing in which the development and organization are appropriate to task and purpose. (Grade-specific expectations for writing types are defined in standards 1–3 above.)',
  'RI.3.1': 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.',
  'RI.3.2': 'Determine the main idea of a text; recount the key details and explain how they support the main idea.',
  'RL.3.1': 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.',
  'RL.3.3': 'Describe characters in a story (e.g., their traits, motivations, or feelings) and explain how their actions contribute to the sequence of events.',
};

// ── 1. Handle the fabricated RF.3.3.g ──────────────────────────────────────
// Official RF.3.3 has subparts a–d only. "Read grade-appropriate irregularly
// spelled words" is RF.3.3.d — remap the linked topic to the real code.
const fake = db.prepare("SELECT id FROM standards WHERE framework = ? AND code = 'RF.3.3.g'").get(FRAMEWORK);
if (fake) {
  const real = db.prepare("SELECT id FROM standards WHERE framework = ? AND code = 'RF.3.3.d'").get(FRAMEWORK);
  if (real) {
    // Move topic links from fabricated code to the real RF.3.3.d
    const links = db.prepare("SELECT topic_id FROM topic_standards WHERE standard_id = ?").all(fake.id);
    const ins = db.prepare('INSERT OR IGNORE INTO topic_standards (topic_id, standard_id) VALUES (?, ?)');
    const del = db.prepare('DELETE FROM topic_standards WHERE topic_id = ? AND standard_id = ?');
    for (const l of links) {
      ins.run(l.topic_id, real.id);
      del.run(l.topic_id, fake.id);
    }
    console.log(`Remapped ${links.length} topic links from fabricated RF.3.3.g → RF.3.3.d`);
  }
  const delStd = db.prepare("DELETE FROM standards WHERE id = ?").run(fake.id);
  console.log(`Deleted fabricated RF.3.3.g (id ${fake.id})`);
} else {
  console.log('RF.3.3.g already gone');
}

// ── 2. Fill the 8 real empty codes ─────────────────────────────────────────
const get = db.prepare("SELECT id FROM standards WHERE framework = ? AND code = ?");
const upd = db.prepare("UPDATE standards SET full_text = ?, source = ? WHERE id = ?");
let filled = 0, missing = 0;
for (const [code, text] of Object.entries(FILL)) {
  const row = get.get(FRAMEWORK, code);
  if (row) {
    upd.run(text, SOURCE, row.id);
    filled++;
  } else {
    console.log(`  WARN: no row for ${code}`);
    missing++;
  }
}
console.log(`Filled ${filled} standards (${missing} missing rows)`);

// ── 3. Verify ──────────────────────────────────────────────────────────────
const check = db.prepare(`
  SELECT COUNT(*) as total,
         SUM(CASE WHEN full_text IS NOT NULL AND full_text != '' THEN 1 ELSE 0 END) as withText
  FROM standards WHERE framework = ?
`).get(FRAMEWORK);
console.log(`\nUS Common Core: ${check.withText}/${check.total} with text`);
const still = db.prepare("SELECT code FROM standards WHERE framework = ? AND (full_text IS NULL OR full_text = '')").all(FRAMEWORK);
console.log(`Still empty: ${still.length ? still.map(r => r.code).join(', ') : 'NONE'}`);
const fake2 = db.prepare("SELECT COUNT(*) as n FROM standards WHERE framework = ? AND code LIKE 'RF.3.3%'").get(FRAMEWORK);
console.log(`RF.3.3 subparts present: ${fake2.n} (should be a-d)`);
const rf = db.prepare("SELECT code FROM standards WHERE framework = ? AND code LIKE 'RF.3.3%' ORDER BY code").all(FRAMEWORK);
rf.forEach(r => console.log('  ', r.code));

db.close();