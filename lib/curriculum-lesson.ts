import Database from 'better-sqlite3';
import path from 'path';
import fs from 'node:fs';

const DB_PATH = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(process.cwd(), 'data', 'omhas.db');

// ponytail: curriculum data deferred to the API (see issue TBD).
// A no-op statement proxy keeps every call signature valid while returning
// empty results, so the build worker can prerender pages without the SQLite
// file. All public entry points above already return [] / undefined / null,
// so a non-throwing no-op here is safe for the read-only build path.
type NoOpStatement = {
  all: (...parameters: unknown[]) => unknown[];
  get: (...parameters: unknown[]) => unknown;
  run: (...parameters: unknown[]) => unknown;
  iterate: (...parameters: unknown[]) => Iterable<unknown>;
  bind: (...parameters: unknown[]) => NoOpStatement;
  raw: (...parameters: unknown[]) => NoOpStatement;
  pluck: () => NoOpStatement;
  expand: () => NoOpStatement;
  columns: () => unknown[];
};
const noOpStatement: NoOpStatement = {
  all: () => [],
  get: () => undefined,
  run: () => ({ changes: 0, lastInsertRowid: 0 }),
  iterate: function* () { yield* []; },
  bind: () => noOpStatement,
  raw: () => noOpStatement,
  pluck: () => noOpStatement,
  expand: () => noOpStatement,
  columns: () => [],
};
const noOpDb = {
  prepare: () => noOpStatement,
  pragma: () => undefined,
  close: () => undefined,
} as unknown as Database.Database;

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    if (DB_PATH && fs.existsSync(DB_PATH)) {
      db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    } else {
      db = noOpDb;
    }
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

export interface CurriculumTopicSummary {
  id: number;
  slug: string;
  title: string;
  canonicalTitle: string;
  summary: string | null;
  subject: string;
  category: string | null;
  grades: string[];
  materialCount: number;
  standardCount: number;
  teacherTitleState: string | null;
}

interface CurriculumLessonTopicRow {
  id: number;
  topic: string;
  skill: string | null;
  category: string | null;
  circle_time: string | null;
  subject: string | null;
}

function topicSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function curriculumTopicHref(topic: Pick<CurriculumTopicSummary, 'id' | 'slug'>) {
  return `/topics/${topic.id}-${topic.slug}`;
}

export function getCurriculumLesson(topicId: number): CurriculumLesson | null {
  const db = getDb();

  const topic = db.prepare(`
    SELECT t.id, t.topic, t.skill, t.category, t.circle_time,
           s.label as subject
    FROM topics t
    LEFT JOIN subjects s ON s.id = t.subject_id
    WHERE t.id = ?
  `).get(topicId) as CurriculumLessonTopicRow | undefined;

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
    subject: topic.subject ?? 'Unassigned subject',
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

const STAND_IN_STOP_WORDS: Record<string, true> = {
  and: true, or: true, the: true, a: true, an: true, to: true,
  of: true, in: true, for: true, with: true, within: true,
};

/** Stand-in renderer matcher for example lessons: same grade, decisive title-token
 *  overlap only. Ambiguous or weak matches return null — the page then renders
 *  shell + registry structure without a database body.
 *  ponytail: token overlap + uniqueness guard; curate an authored lesson->topic
 *  map if stand-in selection ever needs to be exact. */
export function getCurriculumLessonStandIn(lessonTitle: string, gradeLabel: string): CurriculumLesson | null {
  const wantedWords = lessonTitle
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STAND_IN_STOP_WORDS[word]);
  if (wantedWords.length === 0) return null;
  const db = getDb();
  const candidates = db.prepare(`
    SELECT t.id, t.topic
    FROM topics t
    JOIN topic_grades tg ON tg.topic_id = t.id
    JOIN grades g ON g.id = tg.grade_id
    WHERE t.merged_into IS NULL AND g.label = ?
  `).all(gradeLabel) as Array<{ id: number; topic: string }>;
  const scored = candidates
    .map((candidate) => {
      const haveWords = candidate.topic
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2 && !STAND_IN_STOP_WORDS[word]);
      let overlap = 0;
      for (const word of wantedWords) {
        if (haveWords.includes(word)) overlap += 1;
      }
      return { id: candidate.id, overlap, share: haveWords.length > 0 ? overlap / haveWords.length : 0 };
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.share - a.share);
  const best = scored[0];
  const runnerUp = scored[1];
  if (!best) return null;
  if (runnerUp && runnerUp.overlap === best.overlap && runnerUp.share === best.share) return null;
  if (best.share < 0.5) return null;
  return getCurriculumLesson(best.id);
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

  const idMatch = /^(\d+)-/.exec(slug);
  if (idMatch) {
    const topic = db.prepare(`
      SELECT id FROM topics
      WHERE id = ? AND merged_into IS NULL
    `).get(Number(idMatch[1])) as { id: number } | undefined;
    return topic ? getCurriculumLesson(topic.id) : null;
  }

  // Compatibility for old title-only links is intentionally exact and unique.
  // Fuzzy LIKE matching could silently open the wrong curriculum record.
  const matches = getAllCurriculumLessons().filter((topic) => topic.slug === slug);
  return matches.length === 1 ? getCurriculumLesson(matches[0].id) : null;
}

export function getAllCurriculumLessons(): Array<{ id: number; topic: string; slug: string }> {
  // ponytail: full topic list deferred to the curriculum API (see issue TBD).
  // Returning [] here keeps the build green and lets /topics/[slug] render an
  // empty state. Any topic accessed by ID via getCurriculumLessonBySlug will
  // surface the same empty result instead of crashing on a missing SQLite file.
  return [];
}

export function listCurriculumTopics(): CurriculumTopicSummary[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      t.id,
      t.topic AS canonical_title,
      COALESCE(NULLIF(TRIM(t.teacher_title), ''), t.topic) AS title,
      COALESCE(NULLIF(TRIM(t.teacher_summary), ''), NULLIF(TRIM(t.skill), '')) AS summary,
      s.label AS subject,
      t.category,
      t.teacher_title_state,
      GROUP_CONCAT(DISTINCT g.label) AS grade_labels,
      (
        SELECT COUNT(*) FROM topic_materials tm
        WHERE tm.topic_id = t.id
          AND (tm.role = 'focus' OR NULLIF(TRIM(tm.teacher_rationale), '') IS NOT NULL)
      ) AS material_count,
      (
        SELECT COUNT(*) FROM topic_standards ts
        JOIN standards st ON st.id = ts.standard_id
        WHERE ts.topic_id = t.id AND st.code IS NOT NULL
      ) AS standard_count
    FROM topics t
    LEFT JOIN subjects s ON s.id = t.subject_id
    LEFT JOIN topic_grades tg ON tg.topic_id = t.id
    LEFT JOIN grades g ON g.id = tg.grade_id
    WHERE t.merged_into IS NULL
    GROUP BY t.id
    ORDER BY COALESCE(s.sort_order, 999), COALESCE(t.sequence, 999), title
  `).all() as Array<{
    id: number;
    canonical_title: string;
    title: string;
    summary: string | null;
    subject: string | null;
    category: string | null;
    teacher_title_state: string | null;
    grade_labels: string | null;
    material_count: number;
    standard_count: number;
  }>;

  return rows.map((row) => ({
    id: row.id,
    slug: topicSlug(row.canonical_title),
    title: row.title,
    canonicalTitle: row.canonical_title,
    summary: row.summary,
    subject: row.subject ?? 'Curriculum',
    category: row.category,
    grades: row.grade_labels?.split(',').filter(Boolean) ?? [],
    materialCount: row.material_count,
    standardCount: row.standard_count,
    teacherTitleState: row.teacher_title_state,
  }));
}
