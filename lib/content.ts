import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type LessonMetadata = Record<string, string> & {
  slug: string;
  title: string;
  subject: string;
  category: string;
  gradeBand: string;
  summary: string;
  focus: string;
  template: string;
};

export type LessonModule = {
  default: ComponentType;
  metadata?: Record<string, unknown>;
};

export type Lesson = {
  Content: ComponentType;
  metadata: LessonMetadata;
  sourcePath: string;
};

type LessonFile = {
  slug: string;
  relativePath: string;
  sourcePath: string;
};

const lessonDirectory = path.join(process.cwd(), "content", "lessons");

function findMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMarkdownFiles(entryPath);
    return /\.mdx?$/i.test(entry.name) ? [entryPath] : [];
  });
}

function titleFromSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

function gradeFromFolder(sourcePath: string) {
  const folder = path.basename(path.dirname(sourcePath));
  return /^(daycare|preschool|kindergarten|grade-one|grade-two)$/i.test(folder)
    ? titleFromSlug(folder)
    : "";
}

function stringMetadata(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  return value == null ? "" : String(value);
}

function normalizeMetadata(file: LessonFile, metadata: Record<string, unknown> = {}): LessonMetadata {
  const values = Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, stringMetadata(value)]));
  return {
    ...values,
    slug: values.slug || file.slug,
    title: values.title || titleFromSlug(file.slug),
    subject: values.subject || "Curriculum",
    category: values.category || "Lesson plan",
    gradeBand: values.gradeBand || values.grade || gradeFromFolder(file.sourcePath) || "All learners",
    summary: values.summary || "Open this lesson plan and adapt it for your learners.",
    focus: values.focus || values.goal || "Use the lesson plan below to guide the learning experience.",
    template: values.template || "lesson",
  };
}

const lessonFiles: LessonFile[] = findMarkdownFiles(lessonDirectory).map((sourcePath) => {
  const relativePath = path.relative(lessonDirectory, sourcePath).replaceAll("\\", "/");
  return {
    slug: path.basename(sourcePath, path.extname(sourcePath)),
    relativePath,
    sourcePath,
  };
});

const duplicateSlugs = lessonFiles.filter((file, index) => lessonFiles.findIndex((item) => item.slug === file.slug) !== index);
if (duplicateSlugs.length > 0) {
  throw new Error(`Duplicate lesson filenames: ${duplicateSlugs.map((file) => file.slug).join(", ")}`);
}

async function importLesson(relativePath: string): Promise<LessonModule> {
  return import(`../content/lessons/${relativePath}`);
}

export function getLessonSlugs() {
  return lessonFiles.map((file) => file.slug);
}

export async function getLesson(slug: string): Promise<Lesson | undefined> {
  const file = lessonFiles.find((entry) => entry.slug === slug);
  if (!file) return undefined;
  const module = await importLesson(file.relativePath);
  return {
    Content: module.default,
    metadata: normalizeMetadata(file, module.metadata),
    sourcePath: file.sourcePath,
  };
}

export async function getAllLessons(): Promise<Lesson[]> {
  const lessons = await Promise.all(lessonFiles.map((file) => getLesson(file.slug)));
  return lessons.filter((lesson): lesson is Lesson => Boolean(lesson)).sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
}

// Existing visual prototypes still import these shapes. They are UI-only types,
// not content parsing or MDX infrastructure.
export type Step = { label: string; title: string; teacher: string; students: string; lookFor: string; resourceState: "ready" | "missing" | "none"; resourceTitle: string; resourceSource: string; resourceUrl: string; resourceRole: string; resourceNote: string };
export type SearchPrompt = { short: string; label: string; prompt: string };
export type GradeLesson = { grade: string; lesson: string; mode: string; standards: string; goal: string; materials: string; accent: string; steps: Step[]; searches: SearchPrompt[] };
export type LessonTopic = { meta: Record<string, string>; grades: GradeLesson[]; planningNote: string };
export type PrintableDoc = { title: string; image: string; format: string; url: string };
export type TryStep = Step & { key: "try"; subtitle: string; description: string; tip: string };
export type PracticeStep = Step & { key: "practice"; subtitle: string; description: string; printable: boolean; printableLabel: string; printableURL: string; printableSource: string; printableFormat: string; icons: string[] };
export type CheckStep = { key: "check"; label: string; subtitle: string; title: string; description: string; teacher: string; students: string; lookFor: string; tip: string };
export type SingleLessonTopic = {
  format: "single";
  meta: Record<string, string>;
  goal: string;
  materials: string[];
  printables: PrintableDoc[];
  steps: Array<{ key: string; label: string; subtitle: string; title?: string; description?: string }>;
  watch: { key: "watch"; label: string; subtitle: string; title: string; description: string; url: string; source: string; viewLabel: string; openLabel: string; thumbnailNote: string };
  try: TryStep;
  practice: PracticeStep;
  check: CheckStep;
  extend: { key: "extend"; label: string; subtitle: string; searchPrompt: string; categories: Array<{ label: string; icon: string }> };
  searches: SearchPrompt[];
  planningNote: string;
  curriculumPath: string[];
};
