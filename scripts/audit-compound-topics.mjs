import Database from 'better-sqlite3';

const db = new Database('./data/omhas.db', { readonly: true });

const compound = db.prepare(`
  SELECT id, topic, skill, subject_id
  FROM topics
  WHERE topic LIKE '% & %'
     OR topic LIKE '% / %'
     OR topic LIKE '% and %'
  ORDER BY topic
`).all();

console.log('Compound topics found:', compound.length);
compound.forEach(t => {
  console.log('\n[' + t.id + '] ' + t.topic);
  console.log('  Skill:', (t.skill || 'NULL').slice(0, 120));
});

console.log('\n=== Relations per compound topic ===');
compound.forEach(t => {
  const grades = db.prepare('SELECT COUNT(*) as n FROM TOPIC_GRADES WHERE topic_id=?').get(t.id);
  const materials = db.prepare('SELECT COUNT(*) as n FROM TOPIC_MATERIALS WHERE topic_id=?').get(t.id);
  const standards = db.prepare('SELECT COUNT(*) as n FROM TOPIC_STANDARDS WHERE topic_id=?').get(t.id);
  const tags = db.prepare('SELECT COUNT(*) as n FROM TOPIC_TAGS WHERE topic_id=?').get(t.id);
  const pacing = db.prepare('SELECT COUNT(*) as n FROM WEEKLY_PACING wp JOIN TOPIC_GRADES tg ON tg.id=wp.topic_grade_id WHERE tg.topic_id=?').get(t.id);
  console.log('[' + t.id + '] ' + t.topic.slice(0, 40) + ': grades=' + grades.n + ' materials=' + materials.n + ' standards=' + standards.n + ' tags=' + tags.n + ' pacing=' + pacing.n);
});

db.close();
