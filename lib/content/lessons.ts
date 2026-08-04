// Server-only by construction: this module reads the local lesson directory with node:fs.
import fs from "node:fs";
import path from "node:path";

export type LessonTemplate = "music" | "video";

type CommonLessonMetadata = {
  template: LessonTemplate;
  slug: string;
  title: string;
  subject: string;
  category: string;
  gradeBand: string;
  focus: string;
  summary: string;
  [key: string]: string;
};

export type MusicLessonMetadata = CommonLessonMetadata & {
  template: "music";
};

export type VideoLessonMetadata = CommonLessonMetadata & {
  template: "video";
};

export type LessonMetadata = MusicLessonMetadata | VideoLessonMetadata;

export type LessonSection = {
  heading: string;
  body: string;
};

export type LessonEntry = {
  metadata: LessonMetadata;
  body: string;
  sourceFile: string;
};

const LESSONS_DIRECTORY = path.join(process.cwd(), "content", "lessons");
const REQUIRED_METADATA = [
  "slug",
  "title",
  "subject",
  "category",
  "gradeBand",
  "focus",
  "summary",
] as const;

function unquote(value: string) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function parseFrontmatter(raw: string, sourceFile: string) {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`${sourceFile}: expected YAML frontmatter between --- markers`);
  }

  const rawMetadata: Record<string, string> = {};
  for (const [lineNumber, line] of match[1].split("\n").entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator <= 0) {
      throw new Error(`${sourceFile}:${lineNumber + 1}: invalid frontmatter line`);
    }
    const key = trimmed.slice(0, separator).trim();
    const value = unquote(trimmed.slice(separator + 1).trim());
    rawMetadata[key] = value;
  }

  const template = rawMetadata.template;
  if (template !== "music" && template !== "video") {
    throw new Error(`${sourceFile}: template must be either music or video`);
  }

  for (const key of REQUIRED_METADATA) {
    if (!rawMetadata[key]) {
      throw new Error(`${sourceFile}: missing required metadata field \"${key}\"`);
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawMetadata.slug)) {
    throw new Error(`${sourceFile}: slug must be lowercase kebab-case`);
  }

  const metadata = { ...rawMetadata, template } as LessonMetadata;
  return { metadata, body: match[2].trim() };
}

function readLesson(fileName: string): LessonEntry {
  const sourceFile = path.join(LESSONS_DIRECTORY, fileName);
  const { metadata, body } = parseFrontmatter(fs.readFileSync(sourceFile, "utf8"), fileName);
  const fileSlug = fileName.replace(/\.mdx$/, "");
  if (metadata.slug !== fileSlug) {
    throw new Error(`${fileName}: slug \"${metadata.slug}\" must match the filename slug \"${fileSlug}\"`);
  }
  if (!body) {
    throw new Error(`${fileName}: lesson body cannot be empty`);
  }
  return { metadata, body, sourceFile };
}

export function getAllLessons(): LessonEntry[] {
  if (!fs.existsSync(LESSONS_DIRECTORY)) return [];
  const lessons = fs
    .readdirSync(LESSONS_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => readLesson(entry.name))
    .sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
  const slugs = new Set<string>();
  for (const lesson of lessons) {
    if (slugs.has(lesson.metadata.slug)) {
      throw new Error(`Duplicate lesson slug: ${lesson.metadata.slug}`);
    }
    slugs.add(lesson.metadata.slug);
  }
  return lessons;
}

export function getLesson(slug: string): LessonEntry | undefined {
  return getAllLessons().find((lesson) => lesson.metadata.slug === slug);
}

export function getLessonSections(body: string): LessonSection[] {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  const matches = [...normalized.matchAll(/^##\s+(.+?)\s*$/gm)];
  if (matches.length === 0) return [{ heading: "Lesson content", body: normalized }];

  return matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? normalized.length;
    return { heading: match[1].trim(), body: normalized.slice(start, end).trim() };
  });
}

export function getSectionField(sectionBody: string, fieldName: string) {
  const prefix = `- ${fieldName}:`;
  return sectionBody
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith(prefix))
    ?.slice(prefix.length)
    .trim();
}

export function getVideoCore(lesson: LessonEntry) {
  const watch = getLessonSections(lesson.body).find((section) => /^watch$/i.test(section.heading));
  const sourceBody = watch?.body ?? lesson.body;
  return {
    title: getSectionField(sourceBody, "Title") ?? getSectionField(sourceBody, "Resource") ?? lesson.metadata.videoTitle ?? lesson.metadata.title,
    description: getSectionField(sourceBody, "Description") ?? lesson.metadata.focus,
    url: getSectionField(sourceBody, "URL") ?? lesson.metadata.videoUrl ?? "",
    source: getSectionField(sourceBody, "Source") ?? lesson.metadata.videoSource ?? "",
    isExplicitWatchSection: Boolean(watch),
  };
}
