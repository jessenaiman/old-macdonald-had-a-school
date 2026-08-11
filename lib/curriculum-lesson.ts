import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(process.cwd(), 'data', 'omhas.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export interface CurriculumLesson {
  id: number;
  topic: string;
  skillStatement: string | null;
  category: string | null;
  subject: string;
  grades: string[];
  ageRange: string | null;
  standards: Array<{ code: string; fullText: string }>;
  tags: string[];
  materials: Array<{
    kind: 'song' | 'resource';
    id: number;
    role: string | null;
    useInPhase: string | null;
    title: string;
    lyrics?: string;
    actions?: string;
    url?: string;
  }>;
  assets: Array<{
    id: number;
    type: string;
    title: string;
    filePath: string | null;
    format: string | null;
  }>;
  pacing: Array<{
    week: number;
    month: string;
  }>;
}

export function getCurriculumLesson(topicId: number): CurriculumLesson | null {
  const db = getDb();

  const topic = db.prepare(`
    SELECT t.id, t.lesson_topic, t.skill_statement, t.category,
           s.label as subject
    FROM TOPICS t
    LEFT JOIN SUBJECTS s ON s.id = t.subject_id
    WHERE t.id = ?
  `).get(topicId) as any;

  if (!topic) return null;

  const grades = db.prepare(`
    SELECT g.label, g.age_range
    FROM TOPIC_GRADES tg
    JOIN GRADES g ON g.id = tg.grade_id
    WHERE tg.topic_id = ?
  `).all(topicId) as Array<{ label: string; age_range: string }>;

  const standards = db.prepare(`
    SELECT s.code, s.full_text
    FROM TOPIC_STANDARDS ts
    JOIN STANDARDS s ON s.id = ts.standard_id
    WHERE ts.topic_id = ?
  `).all(topicId) as Array<{ code: string; full_text: string }>;

  const tags = db.prepare(`
    SELECT t.name
    FROM TOPIC_TAGS tt
    JOIN TAGS t ON t.id = tt.tag_id
    WHERE tt.topic_id = ?
  `).all(topicId) as Array<{ name: string }>;

  const materials = db.prepare(`
    SELECT tm.material_kind, tm.material_id, tm.role, tm.use_in_phase,
           CASE WHEN tm.material_kind = 'song' THEN s.song_name ELSE r.name END as title,
           s.lyrics, s.actions, s.url as song_url, r.url as resource_url
    FROM TOPIC_MATERIALS tm
    LEFT JOIN SONGS s ON s.id = tm.material_id AND tm.material_kind = 'song'
    LEFT JOIN RESOURCES r ON r.id = tm.material_id AND tm.material_kind = 'resource'
    WHERE tm.topic_id = ?
  `).all(topicId) as Array<{
    material_kind: string;
    material_id: number;
    role: string;
    use_in_phase: string;
    title: string;
    lyrics: string;
    actions: string;
    song_url: string;
    resource_url: string;
  }>;

  const assets = db.prepare(`
    SELECT id, asset_type, title, file_path, format
    FROM lesson_assets
    WHERE topic_id = ? AND status != 'draft'
  `).all(topicId) as Array<{
    id: number;
    asset_type: string;
    title: string;
    file_path: string;
    format: string;
  }>;

  const pacing = db.prepare(`
    SELECT wp.week_number, wp.month
    FROM WEEKLY_PACING wp
    JOIN TOPIC_GRADES tg ON tg.id = wp.topic_grade_id
    WHERE tg.topic_id = ?
  `).all(topicId) as Array<{ week_number: number; month: string }>;

  return {
    id: topic.id,
    topic: topic.lesson_topic,
    skillStatement: topic.skill_statement,
    category: topic.category,
    subject: topic.subject,
    grades: grades.map(g => g.label),
    ageRange: grades[0]?.age_range || null,
    standards: standards.map(s => ({ code: s.code, fullText: s.full_text })),
    tags: tags.map(t => t.name),
    materials: materials.map(m => ({
      kind: m.material_kind as 'song' | 'resource',
      id: m.material_id,
      role: m.role,
      useInPhase: m.use_in_phase,
      title: m.title,
      lyrics: m.lyrics,
      actions: m.actions,
      url: m.song_url || m.resource_url,
    })),
    assets: assets.map(a => ({
      id: a.id,
      type: a.asset_type,
      title: a.title,
      filePath: a.file_path,
      format: a.format,
    })),
    pacing: pacing.map(p => ({ week: p.week_number, month: p.month })),
  };
}

export function getCurriculumLessonBySlug(slug: string): CurriculumLesson | null {
  const db = getDb();

  // Convert slug to search pattern - match first significant word
  const words = slug.split('-').filter(w => w.length > 2);
  if (words.length === 0) return null;

  const pattern = `%${words[0].charAt(0).toUpperCase() + words[0].slice(1)}%`;

  const topic = db.prepare(`
    SELECT id FROM TOPICS
    WHERE lesson_topic LIKE ?
    LIMIT 1
  `).get(pattern) as any;

  if (!topic) return null;

  return getCurriculumLesson(topic.id);
}

export function getAllCurriculumLessons(): Array<{ id: number; topic: string; slug: string }> {
  const db = getDb();

  const topics = db.prepare(`
    SELECT id, lesson_topic
    FROM TOPICS
    WHERE merged_into_topic_id IS NULL
    ORDER BY lesson_topic
  `).all() as Array<{ id: number; lesson_topic: string }>;

  return topics.map(t => ({
    id: t.id,
    topic: t.lesson_topic,
    slug: t.lesson_topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80),
  }));
}
