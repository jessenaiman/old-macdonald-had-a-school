import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db');

// ── ELECT — Early Learning for Every Child Today (Ontario) ────────────────
// Descriptions align with the official ELECT indicator names and verified
// usage in curriculum_topics (probed per-code before writing).
const ELECT = {
  'CA 1': 'Child engages in music-related experiences — singing, playing instruments, and responding to rhythm and sound (e.g., Shaker Music, Drumming Circle).',
  'CA 1a': 'Child explores sound and participates in music with adult support during the earliest age band.',
  'CA 1b': 'Child sings, plays instruments, and keeps a rhythm with growing independence and group awareness.',
  'CA 2a': 'Child responds to music and rhythm through early, adult-supported creative movement.',
  'CA 2b': 'Child moves creatively and expressively to music, exploring dance and body awareness (e.g., Scarves Dance).',
  'CA 3a': 'Child explores visual art materials and mark-making with adult guidance (e.g., Finger Painting).',
  'CA 3b': 'Child creates with art materials such as drawing, painting, cutting, and collage, expressing ideas through artwork.',
  'CA 4a': 'Child engages in early pretend and dramatic play with adult support.',
  'CA 4b': 'Child participates in dramatic play and storytelling, taking roles and retelling narratives (e.g., Puppet Show).',
  'LLD 1a': 'Child communicates verbally with increasing clarity, using sounds, words, and greetings (e.g., Hello Songs, Name Recognition).',
  'LLD 2a': 'Child uses spoken language to share ideas, experiences, and preferences (e.g., Show & Tell, Singing & Signing).',
  'LLD 2b': 'Child uses language to describe, question, and connect with peers during conversations and sharing activities.',
  'LLD 2c': 'Child builds vocabulary and word knowledge through songs, rhymes, and bilingual/growth language experiences.',
  'LLD 5': 'Child explores books, print, and story texts, developing comprehension and a love of reading (e.g., Storytime, Story Walk).',
  'MR 2a': 'Child explores early number concepts such as one-to-one correspondence, counting, and quantity (e.g., Stacking & Nesting Cups).',
  'MR 5': 'Child recognises, extends, and creates patterns (e.g., Pattern Block Exploration).',
  'MR 6': 'Child sorts, classifies, and groups objects by attributes such as shape, colour, and size (e.g., Sensory Bin Sorting).',
  'MR 7': 'Child explores spatial relationships, geometry, and problem-solving with objects and materials (e.g., Cooperative Building).',
  'PD 1': 'Child develops gross motor skills — rolling, reaching, balancing, and whole-body movement (e.g., Tummy Time, Ball Rolling).',
  'PD 2': 'Child develops fine motor skills — grasping, pinching, tearing, and manipulating small materials (e.g., Palmar Grasp, Playdough).',
  'SCI 1': 'Child explores cause-and-effect, object permanence, and early scientific thinking through hands-on play (e.g., Peek-a-Boo, Water Play).',
  'SCI 3': 'Child investigates living things, growth, and the natural world (e.g., Planting Seeds, Life Cycle Discovery).',
  'SED 1a': 'Child begins to develop a sense of self, recognising own reflection and identity with adult support (e.g., Mirror Play).',
  'SED 1b': 'Child develops a positive self-identity, expressing preferences and awareness of self (e.g., All About Me).',
  'SED 2a': 'Child begins to recognise and name emotions in self and others (e.g., Feelings Faces).',
  'SED 2b': 'Child identifies and expresses feelings, and begins to use calming strategies (e.g., Calm-Down Corner, Breathing).',
  'SED 2c': 'Child communicates feelings and needs constructively and responds to the feelings of peers (e.g., Sharing Circle).',
  'SED 3a': 'Child regulates emotions and behaviour, responding to cues and stopping at signals (e.g., Dancing Freeze Game).',
  'SED 3b': 'Child manages impulses and follows multi-step routines and rules (e.g., Obstacle Course Relay).',
  'SED 4a': 'Child shows care, kindness, and empathy toward others (e.g., Love & Kindness activities).',
  'SED 4b': 'Child cooperates, shares, takes turns, and works with peers in groups (e.g., Parachute Play, Cooperative Building).',
  'SED 4c': 'Child develops positive peer relationships and resolves simple conflicts with support (e.g., Team Challenges).',
  'SS 1c': 'Child develops awareness of identity, family, language, and belonging in a diverse community (e.g., Bilingual Celebration Songs).',
  'SS 4': 'Child explores the world around them, making predictions and understanding place and community (e.g., Outdoor Story Walk).',
};

// ── ELOF — Head Start Early Learning Outcomes Framework ────────────────────
// Outcome-style descriptions for the 26 code-bearing rows (domain/subdomain + age band).
const ELOF = {
  'ELOF Approaches to Learning - Self-Regulation (birth-1)': "Infant's emerging ability to regulate attention, emotions, and behavior with caregiver support during everyday routines.",
  'ELOF Approaches to Learning - Self-Regulation (birth-1, caregiver-paced)': "Infant follows and responds to caregiver-paced routines and cues that support emerging self-regulation.",
  'ELOF Self-Regulation (1-3 yr)': 'Toddler manages emotions, attention, and impulses with adult guidance and predictable routines.',
  'ELOF Self-Regulation (Preschool)': 'Preschooler regulates emotions and behavior with increasing independence and supports from adults and peers.',
  'ELOF Cognitive Self-Regulation (1-3 yr)': 'Toddler develops executive-function skills such as sustaining attention, following simple plans, and holding information in mind.',
  'ELOF Emotional Functioning (1-3 yr)': "Toddler expresses and manages emotions with adult support, and begins to show awareness of others' feelings.",
  'ELOF Relationships with Adults (birth-1)': 'Infant forms secure attachments and uses trusted adults as a base for exploring and comfort.',
  'ELOF Relationships with Other Children (1-3 yr)': 'Toddler shows interest in peers and engages in simple social interactions and play alongside others.',
  'ELOF Social & Emotional Development - Relationships with Adults (birth-1)': 'Infant communicates needs and builds trust through warm, responsive relationships with caregivers.',
  'ELOF Fine Motor (birth-1)': 'Infant develops hand and finger control — reaching, grasping, and manipulating objects.',
  'ELOF Fine Motor (1-3 yr)': 'Toddler refines fine motor control for tasks such as stacking, scribbling, feeding, and manipulating small objects.',
  'ELOF Gross Motor (birth-1)': 'Infant develops large-muscle control — rolling, sitting, creeping, and beginning to stand.',
  'ELOF Gross Motor (1-3 yr)': 'Toddler develops balance, coordination, and locomotion — walking, running, jumping, and climbing.',
  'ELOF Attending & Understanding (1-3 yr)': 'Toddler sustains attention to people and objects and understands an increasing number of words and gestures.',
  'ELOF Language & Communication - Attending & Understanding (birth-1)': 'Infant attends to voices and sounds and responds to familiar words and gestures.',
  'ELOF Communicating & Speaking (birth-1)': 'Infant communicates through crying, babbling, gestures, and early sounds to convey needs and interests.',
  'ELOF Communicating & Speaking (1-3 yr)': 'Toddler uses words, phrases, and gestures to express needs, ideas, and feelings.',
  'ELOF Vocabulary (1-3 yr)': "Toddler's receptive and expressive vocabulary grows rapidly through everyday interactions and experiences.",
  'ELOF Phonological Awareness (1-3 yr, informal)': 'Toddler plays with sounds in words through rhymes, songs, and sound games in informal everyday settings.',
  'ELOF Language & Literacy - Emergent Literacy (birth-1)': 'Infant explores books, print, and language through lap reading, pictures, and caregiver talk.',
  'ELOF Emergent Literacy (1-3 yr)': 'Toddler shows early literacy behaviors such as holding books, turning pages, and recognizing familiar rhymes and logos.',
  'ELOF Conceptual Knowledge of the Natural World (Preschool)': 'Preschooler develops knowledge of the natural and physical world through observation, prediction, and inquiry.',
  'ELOF Patterns (1-3 yr, informal)': 'Toddler notices and begins to imitate simple patterns in sound, movement, and objects.',
  'ELOF Patterns (Preschool)': 'Preschooler recognises, extends, and creates simple patterns and uses them to make predictions.',
  'ELOF Cognition (birth-1, informal)': 'Infant explores objects and people through senses and actions, learning cause-and-effect in informal play.',
  'ELOF Cognition (1-3 yr, informal)': 'Toddler thinks, experiments, and solves simple problems through exploration and play in everyday settings.',
};

// ── Apply ELECT ────────────────────────────────────────────────────────────
const getStd = db.prepare("SELECT id FROM standards WHERE framework = ? AND code = ?");
const updateText = db.prepare(
  "UPDATE standards SET full_text = ?, source = COALESCE(source, ?) WHERE id = ?"
);

let electUpdated = 0;
for (const [code, text] of Object.entries(ELECT)) {
  const row = getStd.get('ELECT', code);
  if (row) {
    updateText.run(text, 'ELECT — Early Learning for Every Child Today (Ontario), adapted to curriculum usage', row.id);
    electUpdated++;
  } else {
    console.log(`  MISSING row for ELECT ${code}`);
  }
}
console.log(`ELECT: updated ${electUpdated}/${Object.keys(ELECT).length}`);

// ── Apply ELOF ─────────────────────────────────────────────────────────────
let elofUpdated = 0;
let elofSkipped = 0;
for (const [code, text] of Object.entries(ELOF)) {
  const row = getStd.get('ELOF', code);
  if (row) {
    updateText.run(text, 'Head Start Early Learning Outcomes Framework (ECLKC) — adapted to age band', row.id);
    elofUpdated++;
  } else {
    elofSkipped++;
    console.log(`  No exact row for ${code}`);
  }
}
console.log(`ELOF: updated ${elofUpdated}/${Object.keys(ELOF).length} (${elofSkipped} no-exact-match)`);

// ── Remaining ELOF code rows not covered ───────────────────────────────────
const remaining = db.prepare(
  "SELECT code FROM standards WHERE framework = 'ELOF' AND code IS NOT NULL AND (full_text IS NULL OR full_text = '')"
).all();
console.log(`\nELOF rows still missing text: ${remaining.length}`);
remaining.forEach(r => console.log(`  ${r.code}`));

// ── Verify ─────────────────────────────────────────────────────────────────
const electCheck = db.prepare("SELECT COUNT(*) as n FROM standards WHERE framework='ELECT' AND (full_text IS NOT NULL AND full_text != '')").get();
console.log(`\nELECT with text: ${electCheck.n}/34`);

db.close();