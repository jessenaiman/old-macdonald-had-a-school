import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.argv[2] ?? path.join(process.cwd(), 'data', 'omhas.db');
const slug = process.argv[3] ?? 'addition-subtraction';
const db = new Database(DB_PATH, { readonly: true });

function getCurriculumLessonBySlug(slug) {
  // Convert slug to search pattern - match any word from the slug
  const words = slug.split('-').filter(w => w.length > 2);
  if (words.length === 0) return null;

  // Build LIKE pattern with first significant word
  const pattern = `%${words[0].charAt(0).toUpperCase() + words[0].slice(1)}%`;

  const topic = db.prepare(`
    SELECT id, topic FROM topics
    WHERE topic LIKE ? OR teacher_title LIKE ?
    ORDER BY id
    LIMIT 1
  `).get(pattern, pattern);

  if (!topic) return null;

  const lesson = db.prepare(`
    SELECT t.id, t.topic, t.skill, t.category, t.teacher_title, t.teacher_summary,
           s.label as subject
    FROM topics t
    LEFT JOIN subjects s ON s.id = t.subject_id
    WHERE t.id = ?
  `).get(topic.id);

  const grades = db.prepare(`
    SELECT g.label
    FROM topic_grades tg
    JOIN grades g ON g.id = tg.grade_id
    WHERE tg.topic_id = ?
  `).all(topic.id);

  const materials = db.prepare(`
    SELECT tm.material_kind, tm.material_id, tm.role, tm.use_in_phase,
           CASE WHEN tm.material_kind = 'song' THEN s.title ELSE r.name END as title
    FROM topic_materials tm
    LEFT JOIN songs s ON s.id = tm.material_id AND tm.material_kind = 'song'
    LEFT JOIN resources r ON r.id = tm.material_id AND tm.material_kind = 'resource'
    WHERE tm.topic_id = ?
  `).all(topic.id);

  return {
    id: lesson.id,
    topic: lesson.topic,
    teacherTitle: lesson.teacher_title,
    teacherSummary: lesson.teacher_summary,
    skillStatement: lesson.skill,
    category: lesson.category,
    subject: lesson.subject,
    grades: grades.map(g => g.label),
    ageRange: null,
    materials: materials.map(m => ({
      kind: m.material_kind,
      title: m.title,
      role: m.role,
      useInPhase: m.use_in_phase,
    })),
  };
}

const lesson = getCurriculumLessonBySlug(slug);
console.log(JSON.stringify(lesson, null, 2));

db.close();
