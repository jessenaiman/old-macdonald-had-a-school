import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');

// ── CASEL 5 competencies (official definitions) ────────────────────────────
const CASEL = [
  {
    code: 'Self-Awareness',
    fullText: "The abilities to understand one's own emotions, thoughts, and values and how they influence behavior across contexts. This includes capacities to recognize one's strengths and limitations with a well-grounded sense of confidence and purpose.",
  },
  {
    code: 'Self-Management',
    fullText: "The abilities to manage one's emotions, thoughts, and behaviors effectively in different situations and to achieve goals and aspirations. This includes the capacities to delay gratification, manage stress, and feel motivation and agency to accomplish personal and collective goals.",
  },
  {
    code: 'Social Awareness',
    fullText: 'The abilities to understand the perspectives of and empathize with others, including those from diverse backgrounds, cultures, and contexts. This includes the capacities to feel compassion for others, understand broader historical and social structures, and recognize family, school, and community resources and supports.',
  },
  {
    code: 'Relationship Skills',
    fullText: 'The abilities to establish and maintain healthy and supportive relationships and to effectively navigate settings with diverse individuals and groups. This includes the capacities to communicate clearly, listen actively, cooperate, work collaboratively to problem solve and negotiate conflict constructively, and seek or offer help when needed.',
  },
  {
    code: 'Responsible Decision-Making',
    fullText: 'The abilities to make caring and constructive choices about personal behavior and social interactions across diverse situations. This includes the capacities to consider ethical standards and safety concerns, and to evaluate the benefits and consequences of various actions for personal, social, and collective well-being.',
  },
];

// Upsert CASEL rows (match on code; 2 new rows get inserted, 3 get updated text)
const getCasel = db.prepare("SELECT id FROM standards WHERE framework = 'CASEL' AND code = ?");
const insertCasel = db.prepare(
  "INSERT INTO standards (framework, code, full_text, source) VALUES ('CASEL', ?, ?, 'casel.org/framework')"
);
const updateCasel = db.prepare("UPDATE standards SET full_text = ?, source = 'casel.org/framework' WHERE id = ?");

for (const s of CASEL) {
  const existing = getCasel.get(s.code);
  if (existing) {
    updateCasel.run(s.fullText, existing.id);
    console.log(`  updated CASEL ${s.code}`);
  } else {
    insertCasel.run(s.code, s.fullText);
    console.log(`  inserted CASEL ${s.code}`);
  }
}

// ── SHAPE America 5 national PE standards ──────────────────────────────────
const SHAPE = [
  { code: 'S1', fullText: 'The physically literate individual demonstrates competency in a variety of motor skills and movement patterns.' },
  { code: 'S2', fullText: 'The physically literate individual applies knowledge of concepts, principles, strategies, and tactics related to movement and performance.' },
  { code: 'S3', fullText: 'The physically literate individual demonstrates the knowledge and skills to achieve and maintain a health-enhancing level of physical activity and fitness.' },
  { code: 'S4', fullText: 'The physically literate individual exhibits responsible personal and social behavior that respects self and others.' },
  { code: 'S5', fullText: 'The physically literate individual recognizes the value of physical activity for health, enjoyment, challenge, self-expression, and/or social interaction.' },
];

const getShape = db.prepare("SELECT id FROM standards WHERE framework = 'SHAPE America' AND code = ?");
const insertShape = db.prepare(
  "INSERT INTO standards (framework, code, full_text, source) VALUES ('SHAPE America', ?, ?, 'shapeamerica.org/standards')"
);
const updateShape = db.prepare("UPDATE standards SET full_text = ?, source = 'shapeamerica.org/standards' WHERE id = ?");

for (const s of SHAPE) {
  const existing = getShape.get(s.code);
  if (existing) {
    updateShape.run(s.fullText, existing.id);
    console.log(`  updated SHAPE ${s.code}`);
  } else {
    insertShape.run(s.code, s.fullText);
    console.log(`  inserted SHAPE ${s.code}`);
  }
}

// ── Verification ───────────────────────────────────────────────────────────
console.log('\n=== Verify ===');
const casel = db.prepare("SELECT code, full_text FROM standards WHERE framework='CASEL' ORDER BY code").all();
console.log('CASEL:', casel.length, 'rows');
casel.forEach(c => console.log(`  ${c.code}: ${c.fullText.slice(0, 60)}...`));

const shape = db.prepare("SELECT code, full_text FROM standards WHERE framework='SHAPE America' ORDER BY code").all();
console.log('SHAPE America:', shape.length, 'rows');
shape.forEach(s => console.log(`  ${s.code}: ${s.fullText.slice(0, 60)}...`));

db.close();