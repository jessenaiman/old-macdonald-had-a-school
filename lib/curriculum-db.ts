import "server-only";

import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import {
  GRADE_KEY_MAP,
  SUPPLEMENTARY_SOURCE_LIMITATION,
  type CurriculumGradeKey,
  type CurriculumTopic,
  type CurriculumTopicSearchResult,
  type DatabaseGradeKey,
  type MarkdownMatchHint,
  type SupplementarySource,
} from "./lesson-model";

type ReadOnlyStatement = {
  all: (...parameters: unknown[]) => unknown[];
  get: (...parameters: unknown[]) => unknown;
};

type ReadOnlyDatabase = {
  prepare: (sql: string) => ReadOnlyStatement;
  pragma: (sql: string, options?: { simple?: boolean }) => unknown;
};

type CurriculumTopicRow = {
  id: string;
  grade_key: string;
  subject: string;
  category: string | null;
  seq_number: number | null;
  lesson_topic: string;
  skill_statement: string | null;
  standards: string | null;
  song_count: number | null;
  linked_songs: string | null;
  linked_resources: string | null;
  tags: string | null;
  circle_time_slot: string | null;
};

type SearchChunkRow = {
  kind: string;
  source_path: string;
  title: string;
  url: string | null;
};

type MarkdownSource = {
  sourcePath: string;
  title: string | null;
  slug: string;
};

const databasePath = path.join(process.cwd(), "data", "omhas.db");
const supportedDatabaseGrades = Object.keys(GRADE_KEY_MAP) as DatabaseGradeKey[];
const supplementarySourceLimit = 5;
let database: ReadOnlyDatabase | undefined;
let markdownSources: MarkdownSource[] | undefined;

function openDatabase(): ReadOnlyDatabase {
  if (!database) {
    database = new Database(databasePath, {
      readonly: true,
      fileMustExist: true,
    }) as ReadOnlyDatabase;
    database.pragma("query_only = ON");
  }

  return database;
}

function databaseGradeFor(grade: CurriculumGradeKey): DatabaseGradeKey | undefined {
  return (Object.entries(GRADE_KEY_MAP) as [DatabaseGradeKey, CurriculumGradeKey][])
    .find(([, normalizedGrade]) => normalizedGrade === grade)?.[0];
}

function normalizedText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function splitTags(value: string | null): string[] {
  return value?.split(";").map((tag) => tag.trim()).filter(Boolean) ?? [];
}

function sourceSlug(value: string): string {
  return value
    .toLocaleLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function comparableTitle(value: string): string {
  return value
    .toLocaleLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function titleFromMarkdown(content: string): string | null {
  const metadataTitle = content.match(/"title"\s*:\s*"([^"]+)"/i)?.[1];
  if (metadataTitle) return metadataTitle.trim();

  const frontmatterTitle = content.match(/^title:\s*["']?(.+?)["']?\s*$/im)?.[1];
  return frontmatterTitle?.trim() || null;
}

function collectMarkdownSources(directory: string): MarkdownSource[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMarkdownSources(entryPath);
    if (!/\.mdx?$/i.test(entry.name)) return [];

    const sourcePath = path.relative(process.cwd(), entryPath).replaceAll("\\", "/");
    const content = fs.readFileSync(entryPath, "utf8");
    return [{
      sourcePath,
      title: titleFromMarkdown(content),
      slug: path.basename(entry.name, path.extname(entry.name)),
    }];
  });
}

function getMarkdownSources(): MarkdownSource[] {
  markdownSources ??= collectMarkdownSources(path.join(process.cwd(), "content", "lessons"));
  return markdownSources;
}

function markdownHintsFor(title: string): MarkdownMatchHint[] {
  const titleComparable = comparableTitle(title);
  const titleSlug = sourceSlug(title);

  return getMarkdownSources()
    .flatMap((source): MarkdownMatchHint[] => {
      if (source.title && comparableTitle(source.title) === titleComparable) {
        return [{ sourcePath: source.sourcePath, title: source.title, matchBasis: "exact-title" }];
      }
      if (source.slug === titleSlug) {
        return [{ sourcePath: source.sourcePath, title: source.title, matchBasis: "exact-slug" }];
      }
      return [];
    });
}

function supplementarySourcesFor(topicId: string): SupplementarySource[] {
  const rows = openDatabase().prepare(`
    SELECT sc.kind, sc.source_path, sc.title, NULLIF(sc.url, '') AS url
    FROM curriculum_topic_songs AS cts
    INNER JOIN search_chunks AS sc ON sc.id = cts.search_chunk_id
    WHERE cts.curriculum_topic_id = ?
    ORDER BY sc.source_path, sc.title
    LIMIT ?
  `).all(topicId, supplementarySourceLimit) as SearchChunkRow[];

  return rows.map((row) => ({
    kind: row.kind,
    sourcePath: row.source_path,
    title: row.title,
    url: normalizedText(row.url),
    limitation: SUPPLEMENTARY_SOURCE_LIMITATION,
  }));
}

function normalizeTopic(row: CurriculumTopicRow): CurriculumTopic | undefined {
  const grade = GRADE_KEY_MAP[row.grade_key as DatabaseGradeKey];
  if (!grade) return undefined;

  return {
    id: row.id,
    grade,
    subject: row.subject.trim(),
    category: normalizedText(row.category),
    sequence: row.seq_number,
    title: row.lesson_topic.trim(),
    skillStatement: normalizedText(row.skill_statement),
    standards: normalizedText(row.standards),
    tags: splitTags(row.tags),
    linkedSongs: normalizedText(row.linked_songs),
    linkedSongCount: row.song_count ?? 0,
    linkedResources: normalizedText(row.linked_resources),
    circleTimeSlot: normalizedText(row.circle_time_slot),
    sourceType: "database",
    // The database has curriculum fields but no complete teaching-plan sections.
    completeness: "planning-draft",
    markdownHints: markdownHintsFor(row.lesson_topic),
    // This relation is intentionally supplementary and never supplies grade authority.
    supplementarySources: supplementarySourcesFor(row.id),
  };
}

function gradeWhere(grade: CurriculumGradeKey | undefined): { sql: string; parameters: unknown[] } | null {
  if (grade === undefined) {
    return {
      sql: `grade_key IN (${supportedDatabaseGrades.map(() => "?").join(", ")})`,
      parameters: supportedDatabaseGrades,
    };
  }

  const databaseGrade = databaseGradeFor(grade);
  return databaseGrade ? { sql: "grade_key = ?", parameters: [databaseGrade] } : null;
}

const searchStopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "for", "from", "find", "include",
  "includes", "in", "is", "it", "lesson", "must", "of", "or", "result", "results",
  "that", "the", "their", "this", "to", "use", "uses", "using", "with",
]);

function searchTerms(query: string): string[] {
  return [...new Set(query.toLocaleLowerCase()
    .replaceAll("&", " and ")
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1 && !searchStopWords.has(term)))];
}

function topicSearchScore(row: CurriculumTopicRow, terms: string[]): number {
  const weightedFields: Array<[string | null, number]> = [
    [row.lesson_topic, 8],
    [row.subject, 5],
    [row.category, 4],
    [row.skill_statement, 3],
    [row.tags, 3],
    [row.standards, 1],
    [row.linked_resources, 1],
  ];

  return terms.reduce((score, term) => score + weightedFields.reduce((fieldScore, [value, weight]) => (
    value?.toLocaleLowerCase().includes(term) ? fieldScore + weight : fieldScore
  ), 0), 0);
}

function structuredSearchRows(query: string, grade: CurriculumGradeKey | undefined): CurriculumTopicRow[] {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];

  return allRows(grade)
    .map((row) => ({ row, score: topicSearchScore(row, terms) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score
      || (left.row.seq_number ?? Number.MAX_SAFE_INTEGER) - (right.row.seq_number ?? Number.MAX_SAFE_INTEGER)
      || left.row.lesson_topic.localeCompare(right.row.lesson_topic))
    .slice(0, 40)
    .map(({ row }) => row);
}

function allRows(grade: CurriculumGradeKey | undefined): CurriculumTopicRow[] {
  const gradeFilter = gradeWhere(grade);
  if (!gradeFilter) return [];

  return openDatabase().prepare(`
    SELECT id, grade_key, subject, category, seq_number, lesson_topic,
           skill_statement, standards, song_count, linked_songs,
           linked_resources, tags, circle_time_slot
    FROM curriculum_topics
    WHERE ${gradeFilter.sql}
    ORDER BY grade_key, seq_number IS NULL, seq_number, subject, lesson_topic
  `).all(...gradeFilter.parameters) as CurriculumTopicRow[];
}

function ftsQueryFor(query: string): string | null {
  const terms = searchTerms(query);
  return terms.length > 0 ? terms.map((term) => `"${term}"`).join(" OR ") : null;
}

function supplementaryMatchIds(query: string, grade: CurriculumGradeKey | undefined): string[] {
  const gradeFilter = gradeWhere(grade);
  const ftsQuery = ftsQueryFor(query);
  if (!gradeFilter || !ftsQuery) return [];

  try {
    const chunkRows = openDatabase().prepare(`
      SELECT id
      FROM search_chunks_fts
      WHERE search_chunks_fts MATCH ?
      LIMIT ?
    `).all(ftsQuery, 100) as { id: string }[];
    if (chunkRows.length === 0) return [];

    const chunkPlaceholders = chunkRows.map(() => "?").join(", ");
    const rows = openDatabase().prepare(`
      SELECT DISTINCT ct.id
      FROM curriculum_topics AS ct
      INNER JOIN curriculum_topic_songs AS cts ON cts.curriculum_topic_id = ct.id
      WHERE cts.search_chunk_id IN (${chunkPlaceholders})
        AND ${gradeFilter.sql}
      LIMIT ?
    `).all(...chunkRows.map((row) => row.id), ...gradeFilter.parameters, 100) as { id: string }[];
    return rows.map((row) => row.id);
  } catch {
    // The structured topic-field search remains the safe fallback when FTS is unavailable.
    return [];
  }
}

function rowsByIds(ids: string[], grade: CurriculumGradeKey | undefined): CurriculumTopicRow[] {
  const gradeFilter = gradeWhere(grade);
  if (!gradeFilter || ids.length === 0) return [];

  const placeholders = ids.map(() => "?").join(", ");
  return openDatabase().prepare(`
    SELECT id, grade_key, subject, category, seq_number, lesson_topic,
           skill_statement, standards, song_count, linked_songs,
           linked_resources, tags, circle_time_slot
    FROM curriculum_topics
    WHERE id IN (${placeholders}) AND ${gradeFilter.sql}
    ORDER BY grade_key, seq_number IS NULL, seq_number, subject, lesson_topic
  `).all(...ids, ...gradeFilter.parameters) as CurriculumTopicRow[];
}

export function searchCurriculumTopics({
  query,
  grade,
}: {
  query: string;
  grade?: CurriculumGradeKey;
}): CurriculumTopicSearchResult[] {
  if (grade !== undefined && !databaseGradeFor(grade)) return [];

  const trimmedQuery = query.trim();
  const directRows = trimmedQuery.length > 0 ? structuredSearchRows(trimmedQuery, grade) : allRows(grade);
  const directTopics = directRows.map(normalizeTopic).filter((topic): topic is CurriculumTopic => Boolean(topic));
  const directIds = new Set(directTopics.map((topic) => topic.id));
  const supplementaryTopics = trimmedQuery.length > 0
    ? rowsByIds(supplementaryMatchIds(trimmedQuery, grade), grade)
      .map(normalizeTopic)
      .filter((topic): topic is CurriculumTopic => Boolean(topic))
      .filter((topic) => !directIds.has(topic.id))
    : [];

  return [
    ...directTopics.map((topic) => ({ ...topic, matchScope: "topic-fields" as const })),
    ...supplementaryTopics.map((topic) => ({ ...topic, matchScope: "supplementary-source" as const })),
  ];
}

export function getCurriculumTopic(id: string, grade: CurriculumGradeKey): CurriculumTopic | undefined {
  const gradeFilter = gradeWhere(grade);
  if (!gradeFilter) return undefined;

  const row = openDatabase().prepare(`
    SELECT id, grade_key, subject, category, seq_number, lesson_topic,
           skill_statement, standards, song_count, linked_songs,
           linked_resources, tags, circle_time_slot
    FROM curriculum_topics
    WHERE id = ? AND ${gradeFilter.sql}
    LIMIT 1
  `).get(id, ...gradeFilter.parameters) as CurriculumTopicRow | undefined;

  return row ? normalizeTopic(row) : undefined;
}
