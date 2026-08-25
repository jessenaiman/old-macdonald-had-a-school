import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { gradeKeysForLabel, type GradeKey } from "./grade-routes";

export type LessonMetadata = Record<string, string> & {
  slug: string;
  title: string;
  subject: string;
  category: string;
  grade: string;
  summary: string;
  focus: string;
  template: string;
};

export type LessonModule = {
  default: ComponentType;
  metadata?: Record<string, unknown>;
  frontmatter?: Record<string, unknown>;
};

export type Lesson = {
  Content: ComponentType;
  metadata: LessonMetadata;
  sourcePath: string;
  validated: boolean;
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

function comparableTitle(value: string) {
  return value
    .toLocaleLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function gradeFromFolder(sourcePath: string) {
  const folder = path.basename(path.dirname(sourcePath));
  return /^(daycare|pre-school|preschool|kindergarten|grade-one|grade-two)$/i.test(folder)
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
    grade: values.grade || gradeFromFolder(file.sourcePath) || "All learners",
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

export async function getLessonSlugsForGrade(grade: GradeKey) {
  const lessons = await getAllLessons();
  return lessons.filter((lesson) => gradeKeysForLabel(lesson.metadata.grade).includes(grade)).map((lesson) => lesson.metadata.slug);
}

export async function getLesson(slug: string): Promise<Lesson | undefined> {
  const file = lessonFiles.find((entry) => entry.slug === slug);
  if (!file) return undefined;
  const lessonModule = await importLesson(file.relativePath);
  const rawMetadata = { ...lessonModule.frontmatter, ...lessonModule.metadata };
  return {
    Content: lessonModule.default,
    metadata: normalizeMetadata(file, rawMetadata),
    validated: rawMetadata.validated === true,
    sourcePath: file.sourcePath,
  };
}

export async function getLessonByTitleAndGrade(title: string, grade: GradeKey): Promise<Lesson | undefined> {
  const matchingFiles = lessonFiles.filter((file) => comparableTitle(file.slug) === comparableTitle(title));

  for (const file of matchingFiles) {
    const lesson = await getLesson(file.slug);
    if (lesson && gradeKeysForLabel(lesson.metadata.grade).includes(grade)) return lesson;
  }

  return undefined;
}

export async function getAllLessons(): Promise<Lesson[]> {
  const lessons = await Promise.all(lessonFiles.map((file) => getLesson(file.slug)));
  return lessons.filter((lesson): lesson is Lesson => Boolean(lesson)).sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
}
