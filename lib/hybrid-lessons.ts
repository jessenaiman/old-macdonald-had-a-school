import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { CurriculumTopic } from "./lesson-model";
import type { CurriculumLesson } from "./curriculum-lesson";
import { appendCurriculumMaterialsToMarkdown } from "./curriculum-lesson";
import type { SongDetail } from "./songbook";

/*
 * Hybrid lesson/song authoring (KISS):
 *
 * 1. Author writes a plain markdown file in content/lessons/ (optionally in a
 *    grade subfolder) and tags it in frontmatter with `topicId: <uuid>` (for
 *    curriculum rows) or `songId: <number>` (for songbook rows).
 * 2. Resolution order for a database row:
 *    a. Authored match — an mdx declaring the row's id in frontmatter wins.
 *    b. Template fallback — the row renders through content/templates/
 *       (`template: video` for topics, `template: music` for songs) with the
 *       database data filling the placeholder frontmatter fields.
 * 3. Both paths output markdown through the /markdown API endpoints.
 *
 * No invented markdown parsing: lesson pages themselves render via the
 * documented @next/mdx pipeline; this module only produces markdown text
 * for export, reading frontmatter with a minimal key/value scanner.
 */

type Frontmatter = Record<string, string>;

export type AuthoredSource = {
  sourcePath: string;
  frontmatter: Frontmatter;
  body: string;
  topicId: string | null;
  songId: number | null;
};

const lessonDirectory = path.join(process.cwd(), "content", "lessons");
const templateDirectory = path.join(process.cwd(), "content", "templates");

let authoredSources: AuthoredSource[] | undefined;

function scanFrontmatterBlock(content: string): { frontmatter: Frontmatter; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: {}, body: content };
  const frontmatter: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*)$/);
    if (!pair) continue;
    frontmatter[pair[1]] = pair[2].trim().replace(/^["']|["']$/g, "");
  }
  return { frontmatter, body: content.slice(match[0].length) };
}

function collectAuthoredSources(directory: string): AuthoredSource[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectAuthoredSources(entryPath);
    if (!/\.mdx?$/i.test(entry.name)) return [];
    const content = fs.readFileSync(entryPath, "utf8");
    const { frontmatter, body } = scanFrontmatterBlock(content);
    const songIdRaw = frontmatter.songId;
    return [{
      sourcePath: path.relative(process.cwd(), entryPath).replaceAll("\\", "/"),
      frontmatter,
      body,
      topicId: frontmatter.topicId || null,
      songId: songIdRaw && /^\d+$/.test(songIdRaw) ? Number(songIdRaw) : null,
    }];
  });
}

function getAuthoredSources(): AuthoredSource[] {
  // Cache invalidated on module reload; edit this file to refresh in dev.
  authoredSources ??= collectAuthoredSources(lessonDirectory);
  return authoredSources;
}

/** Authored lesson that declares this curriculum row's id in frontmatter. */
export function getAuthoredLessonForTopic(topicId: string): AuthoredSource | undefined {
  return getAuthoredSources().find((source) => source.topicId === topicId);
}

/** Authored lesson that declares this songbook row's id in frontmatter. */
export function getAuthoredLessonForSong(songId: number): AuthoredSource | undefined {
  return getAuthoredSources().find((source) => source.songId === songId);
}

type Template = { frontmatter: Frontmatter; body: string };

const templateCache = new Map<string, Template | undefined>();

function getTemplate(name: string): Template | undefined {
  if (templateCache.has(name)) return templateCache.get(name);
  const candidates = fs.existsSync(templateDirectory) ? fs.readdirSync(templateDirectory) : [];
  const file = candidates.find((candidate) => {
    if (!/\.mdx?$/i.test(candidate)) return false;
    const { frontmatter } = scanFrontmatterBlock(fs.readFileSync(path.join(templateDirectory, candidate), "utf8"));
    return frontmatter.template === name;
  });
  const template = file
    ? (() => {
        const parsed = scanFrontmatterBlock(fs.readFileSync(path.join(templateDirectory, file), "utf8"));
        return { frontmatter: parsed.frontmatter, body: parsed.body };
      })()
    : undefined;
  templateCache.set(name, template);
  return template;
}

function serializeFrontmatter(values: Frontmatter): string {
  const lines = Object.entries(values)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}: ${value.includes(":") ? `"${value}"` : value}`);
  return `---\n${lines.join("\n")}\n---\n`;
}

function filledValues(provided: Frontmatter, data: Frontmatter): Frontmatter {
  const merged: Frontmatter = { ...data };
  for (const [key, value] of Object.entries(provided)) {
    if (value !== "") merged[key] = value; // authored values win over database data
  }
  return merged;
}

function valueOrPlaceholder(value: string | null): string {
  return value && value.trim() !== "" ? value.trim() : "Not yet available";
}

/**
 * Render a curriculum row as export markdown.
 * Authored match wins; otherwise the topic template is filled with database data.
 */
export function renderTopicHybridMarkdown(topic: CurriculumTopic, curriculumLesson: CurriculumLesson | null): string {
  const authored = getAuthoredLessonForTopic(topic.id);
  const data: Frontmatter = {
    template: "video",
    slug: topic.title.toLocaleLowerCase().replaceAll("&", " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: topic.title,
    subject: topic.subject,
    category: valueOrPlaceholder(topic.category),
    grade: topic.grade,
    focus: valueOrPlaceholder(topic.skillStatement),
    summary: valueOrPlaceholder(topic.skillStatement),
    standardUS: valueOrPlaceholder(topic.standards),
    sourceReference: `data/omhas.db · curriculum_topics · ${topic.id}`,
  };

  if (authored) {
    const merged = filledValues(authored.frontmatter, data);
    return appendCurriculumMaterialsToMarkdown(serializeFrontmatter(merged) + "\n" + authored.body.trim() + "\n", curriculumLesson);
  }

  const template = getTemplate("video");
  if (!template) {
    return appendCurriculumMaterialsToMarkdown(serializeFrontmatter(data) + `\n# ${topic.title}\n\nAuthored lesson content is not available yet; use the curriculum record below to plan.\n`, curriculumLesson);
  }
  // Template supplies scaffolding fields; database data fills the placeholders.
  const merged = filledValues(data, template.frontmatter);
  return appendCurriculumMaterialsToMarkdown(serializeFrontmatter(merged) + "\n" + template.body.trim() + "\n", curriculumLesson);
}

/**
 * Render a songbook row as export markdown.
 * Authored match wins; otherwise the music template is filled with database data.
 */
export function renderSongHybridMarkdown(song: SongDetail): string {
  const authored = getAuthoredLessonForSong(song.id);
  const lyrics = song.sections.map((section) => section.lyrics).filter(Boolean).join("\n\n");
  const data: Frontmatter = {
    template: "music",
    slug: song.title.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: song.title,
    subject: "Music & Movement",
    grade: Array.from(new Set(song.topics.flatMap((topic) => topic.grades).filter(Boolean))).join(", ") || "All learners",
    focus: valueOrPlaceholder(song.educationalDomain),
    summary: valueOrPlaceholder(song.educationalDomain),
    sourceReference: `data/omhas.db · songs · ${song.id}`,
  };

  if (authored) {
    const merged = filledValues(authored.frontmatter, data);
    return serializeFrontmatter(merged) + "\n" + authored.body.trim() + "\n";
  }

  const template = getTemplate("music");
  if (!template) {
    return serializeFrontmatter(data) + `\n# ${song.title}\n\n## Song\n\n${lyrics || "Not yet available"}\n`;
  }
  // Template supplies scaffolding fields; database data fills the placeholders.
  const merged = filledValues(data, template.frontmatter);
  return serializeFrontmatter(merged) + "\n" + template.body.trim() + `\n\n## Song lyrics (database)\n\n${lyrics || "Not yet available"}\n`;
}
