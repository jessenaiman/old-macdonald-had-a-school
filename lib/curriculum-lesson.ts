import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(process.cwd(), 'data', 'omhas.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return db;
}

export interface CurriculumMaterial {
  kind: 'song' | 'resource';
  id: number;
  role: 'focus' | 'supporting';
  title: string;
  useInPhase?: string | null;
  routineSlot?: string | null;
  teacherRationale?: string | null;
  lyrics?: string | null;
  actions?: string | null;
  instructions?: string | null;
  url?: string | null;
  sourceTitle?: string | null;
}

export interface CurriculumStandard {
  framework: string;
  code: string;
  fullText: string;
  frames?: string | null;
}

export interface CurriculumGrade {
  label: string;
}

export interface CurriculumAsset {
  id: number;
  type: string;
  title: string;
  filePath: string | null;
  format: string | null;
}

export interface SuggestedCurriculumPlacement {
  planLabel: string;
  provenanceStatus: 'source_backed' | 'editorial' | 'legacy_unverified';
  week: number | null;
  month: string | null;
  note: string | null;
}

export interface CurriculumLesson {
  id: number;
  topic: string;
  skill: string | null;
  category: string | null;
  subject: string;
  grades: CurriculumGrade[];
  circleTime: string | null;
  standards: CurriculumStandard[];
  tags: string[];
  materials: CurriculumMaterial[];
  assets: CurriculumAsset[];
  pacing: Array<{ week: number; month: string }>;
  suggestedPlacements: SuggestedCurriculumPlacement[];
}

export function getCurriculumLesson(topicId: number): CurriculumLesson | null {
  const db = getDb();

  const topic = db.prepare(`
    SELECT t.id, t.topic, t.skill, t.category, t.circle_time,
           s.label as subject
    FROM topics t
    LEFT JOIN subjects s ON s.id = t.subject_id
    WHERE t.id = ?
  `).get(topicId) as any;

  if (!topic) return null;

  const grades = db.prepare(`
    SELECT g.label
    FROM topic_grades tg
    JOIN grades g ON g.id = tg.grade_id
    WHERE tg.topic_id = ?
    ORDER BY g.sort_order
  `).all(topicId) as Array<{ label: string }>;

  const standards = db.prepare(`
    SELECT s.framework, s.code, s.full_text, s.frames
    FROM topic_standards ts
    JOIN standards s ON s.id = ts.standard_id
    WHERE ts.topic_id = ?
      AND s.code IS NOT NULL
    ORDER BY s.framework, s.code
  `).all(topicId) as Array<{ framework: string; code: string; full_text: string; frames: string }>;

  const tags = db.prepare(`
    SELECT t.name
    FROM topic_tags tt
    JOIN tags t ON t.id = tt.tag_id
    WHERE tt.topic_id = ?
    ORDER BY t.name
  `).all(topicId) as Array<{ name: string }>;

  const materials = db.prepare(`
    SELECT tm.material_kind, tm.material_id, tm.role, tm.use_in_phase,
           tm.routine_slot, tm.teacher_rationale,
           CASE WHEN tm.material_kind = 'song' THEN s.title ELSE r.name END as title,
           s.lyrics, s.actions, s.instructions,
           CASE WHEN tm.material_kind = 'song' THEN s.url ELSE r.url END as url,
           s.source_title
    FROM topic_materials tm
    LEFT JOIN songs s ON s.id = tm.material_id AND tm.material_kind = 'song'
    LEFT JOIN resources r ON r.id = tm.material_id AND tm.material_kind = 'resource'
    WHERE tm.topic_id = ?
      AND (
        tm.role = 'focus'
        OR NULLIF(TRIM(tm.teacher_rationale), '') IS NOT NULL
      )
    ORDER BY CASE tm.role WHEN 'focus' THEN 0 ELSE 1 END,
             CASE tm.material_kind WHEN 'song' THEN 0 ELSE 1 END,
             title
  `).all(topicId) as Array<{
    material_kind: string;
    material_id: number;
    role: string;
    use_in_phase: string | null;
    routine_slot: string | null;
    teacher_rationale: string | null;
    title: string;
    lyrics: string;
    actions: string;
    instructions: string;
    url: string;
    source_title: string;
  }>;

  const assets = db.prepare(`
    SELECT id, asset_type, title, file_path, format
    FROM lesson_assets
    WHERE topic_id = ? AND status != 'draft'
    ORDER BY asset_type, title
  `).all(topicId) as Array<{
    id: number;
    asset_type: string;
    title: string;
    file_path: string;
    format: string;
  }>;

  const pacing = db.prepare(`
    SELECT wp.week_number, wp.month
    FROM weekly_pacing wp
    JOIN topic_grades tg ON tg.id = wp.topic_grade_id
    WHERE tg.topic_id = ?
    ORDER BY wp.week_number
  `).all(topicId) as Array<{ week_number: number; month: string }>;

  const suggestedPlacements = db.prepare(`
    SELECT plan.label, plan.provenance_status, placement.week_number, placement.month, placement.relationship_note
    FROM suggested_curriculum_plan_placements placement
    JOIN suggested_curriculum_plans plan ON plan.id = placement.plan_id
    JOIN topic_grades tg ON tg.id = placement.topic_grade_id
    WHERE tg.topic_id = ? AND plan.active = 1
    ORDER BY placement.month, placement.week_number, plan.label
  `).all(topicId) as Array<{ label: string; provenance_status: SuggestedCurriculumPlacement['provenanceStatus']; week_number: number | null; month: string | null; relationship_note: string | null }>;

  return {
    id: topic.id,
    topic: topic.topic,
    skill: topic.skill,
    category: topic.category,
    subject: topic.subject,
    grades,
    circleTime: topic.circle_time,
    standards: standards.map(s => ({
      framework: s.framework,
      code: s.code,
      fullText: s.full_text,
      frames: s.frames,
    })),
    tags: tags.map(t => t.name),
    materials: materials.map(m => ({
      kind: m.material_kind as 'song' | 'resource',
      id: m.material_id,
      role: m.role === 'focus' ? 'focus' : 'supporting',
      title: m.title,
      useInPhase: m.use_in_phase,
      routineSlot: m.routine_slot,
      teacherRationale: m.teacher_rationale,
      lyrics: m.lyrics,
      actions: m.actions,
      instructions: m.instructions,
      url: m.url,
      sourceTitle: m.source_title,
    })),
    assets: assets.map(a => ({
      id: a.id,
      type: a.asset_type,
      title: a.title,
      filePath: a.file_path,
      format: a.format,
    })),
    pacing: pacing.map(p => ({ week: p.week_number, month: p.month })),
    suggestedPlacements: suggestedPlacements.map(p => ({
      planLabel: p.label,
      provenanceStatus: p.provenance_status,
      week: p.week_number,
      month: p.month,
      note: p.relationship_note,
    })),
  };
}

export function getCurriculumLessonByTitleAndGrade(topicTitle: string, gradeLabel: string): CurriculumLesson | null {
  const db = getDb();
  const topic = db.prepare(`
    SELECT t.id
    FROM topics t
    JOIN topic_grades tg ON tg.topic_id = t.id
    JOIN grades g ON g.id = tg.grade_id
    WHERE t.merged_into IS NULL
      AND t.topic = ?
      AND g.label = ?
    LIMIT 1
  `).get(topicTitle, gradeLabel) as { id: number } | undefined;

  return topic ? getCurriculumLesson(topic.id) : null;
}

export function appendCurriculumMaterialsToMarkdown(markdown: string, lesson: CurriculumLesson | null): string {
  if (!lesson || lesson.materials.length === 0) return markdown;

  const lines = lesson.materials
    .filter((material) => material.title)
    .map((material) => {
      const title = material.url ? `[${material.title}](${material.url})` : material.title;
      const details = [
        material.role === 'focus' ? 'focus material' : 'support material',
        material.useInPhase,
        material.routineSlot,
        material.teacherRationale,
      ].filter(Boolean).join('; ');
      return `- ${title}${details ? ` - ${details}` : ''}`;
    });

  return lines.length > 0
    ? `${markdown}\n## Linked lesson materials\n${lines.join('\n')}\n`
    : markdown;
}

export function getCurriculumLessonBySlug(slug: string): CurriculumLesson | null {
  const db = getDb();

  const words = slug.split('-').filter(w => w.length > 2);
  if (words.length === 0) return null;

  // Exact slug match first (skip merged topics), then partial word match
  const exact = db.prepare(`
    SELECT id FROM topics
    WHERE merged_into IS NULL AND topic LIKE ?
    LIMIT 1
  `).get(`%${words.join(' ')}%`) as any;
  if (exact) return getCurriculumLesson(exact.id);

  const trails = words.map((_, i) => words.slice(i).join(' '));
  for (const pattern of trails.map(t => `%${t.charAt(0).toUpperCase()}${t.slice(1)}%`)) {
    const topic = db.prepare(`
      SELECT id FROM topics
      WHERE merged_into IS NULL AND topic LIKE ?
      LIMIT 1
    `).get(pattern) as any;
    if (topic) return getCurriculumLesson(topic.id);
  }
  return null;
}

export function getAllCurriculumLessons(): Array<{ id: number; topic: string; slug: string }> {
  const db = getDb();

  const topics = db.prepare(`
    SELECT id, topic
    FROM topics
    WHERE merged_into IS NULL
    ORDER BY topic
  `).all() as Array<{ id: number; topic: string }>;

  return topics.map(t => ({
    id: t.id,
    topic: t.topic,
    slug: t.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80),
  }));
}
