import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'omhas.db');
const db = new Database(DB_PATH, { readonly: true });

function getCurriculumLessonBySlug(slug) {
  // Convert slug to search pattern - match any word from the slug
  const words = slug.split('-').filter(w => w.length > 2);
  if (words.length === 0) return null;

  // Build LIKE pattern with first significant word
  const pattern = `%${words[0].charAt(0).toUpperCase() + words[0].slice(1)}%`;

  const topic = db.prepare(`
    SELECT id, lesson_topic FROM TOPICS
    WHERE lesson_topic LIKE ?
    LIMIT 1
  `).get(pattern);

  if (!topic) return null;

  const lesson = db.prepare(`
    SELECT t.id, t.lesson_topic, t.skill_statement, t.category,
           s.label as subject
    FROM TOPICS t
    LEFT JOIN SUBJECTS s ON s.id = t.subject_id
    WHERE t.id = ?
  `).get(topic.id);

  const grades = db.prepare(`
    SELECT g.label, g.age_range
    FROM TOPIC_GRADES tg
    JOIN GRADES g ON g.id = tg.grade_id
    WHERE tg.topic_id = ?
  `).all(topic.id);

  const materials = db.prepare(`
    SELECT tm.material_kind, tm.material_id, tm.role, tm.use_in_phase,
           CASE WHEN tm.material_kind = 'song' THEN s.song_name ELSE r.name END as title
    FROM TOPIC_MATERIALS tm
    LEFT JOIN SONGS s ON s.id = tm.material_id AND tm.material_kind = 'song'
    LEFT JOIN RESOURCES r ON r.id = tm.material_id AND tm.material_kind = 'resource'
    WHERE tm.topic_id = ?
  `).all(topic.id);

  return {
    id: lesson.id,
    topic: lesson.lesson_topic,
    skillStatement: lesson.skill_statement,
    category: lesson.category,
    subject: lesson.subject,
    grades: grades.map(g => g.label),
    ageRange: grades[0]?.age_range || null,
    materials: materials.map(m => ({
      kind: m.material_kind,
      title: m.title,
      role: m.role,
      useInPhase: m.use_in_phase,
    })),
  };
}

const lesson = getCurriculumLessonBySlug('addition-subtraction');
console.log(JSON.stringify(lesson, null, 2));

db.close();
