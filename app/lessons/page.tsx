import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../../components/SiteShell";
import { getAllLessons } from "../../lib/content";
import { searchCurriculumTopics } from "../../lib/curriculum-db";
import { GRADE_KEYS, gradeKeysForLabel, lessonHref, type GradeKey } from "../../lib/grade-routes";
import styles from "./LessonsPage.module.css";

export const metadata: Metadata = {
  title: "Lessons | Old MacDonald Had a School",
  description: "Search teacher-ready Markdown lessons and curriculum planning records.",
};

type SearchParams = Promise<{ q?: string | string[]; grade?: string | string[] }>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isGradeKey(value: string): value is GradeKey {
  return GRADE_KEYS.includes(value as GradeKey);
}

function textScore(query: string, values: string[]) {
  const terms = query.toLocaleLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 1);
  const haystack = values.join(" ").toLocaleLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

export default async function LessonsIndexPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = one(params.q).trim();
  const requestedGrade = one(params.grade);
  const grade = isGradeKey(requestedGrade) ? requestedGrade : undefined;
  const lessons = await getAllLessons();
  const markdownLessons = lessons
    .filter((lesson) => !grade || gradeKeysForLabel(lesson.metadata.grade).includes(grade))
    .map((lesson) => ({
      lesson,
      score: query ? textScore(query, [
        lesson.metadata.title,
        lesson.metadata.subject,
        lesson.metadata.category,
        lesson.metadata.summary,
        lesson.metadata.focus,
      ]) : 1,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.lesson.metadata.title.localeCompare(right.lesson.metadata.title));

  const lessonByPath = new Map(lessons.map((lesson) => [
    lesson.sourcePath.replaceAll("\\", "/"),
    lesson,
  ]));
  let databaseUnavailable = false;
  const databaseTopics = query ? (() => {
    try {
      return searchCurriculumTopics({ query, grade });
    } catch {
      databaseUnavailable = true;
      return [];
    }
  })() : [];

  const seenHrefs = new Set(markdownLessons.map(({ lesson }) => lessonHref(lesson.metadata)));
  const databaseResults = databaseTopics.flatMap((topic) => {
    const markdownLesson = topic.markdownHints
      .map((hint) => lessonByPath.get(hint.sourcePath))
      .find(Boolean);
    const href = markdownLesson
      ? lessonHref(markdownLesson.metadata)
      : `/grade/${topic.grade}/${topic.id}`;
    if (seenHrefs.has(href)) return [];
    seenHrefs.add(href);
    return [{ topic, href, markdownLesson }];
  }).slice(0, markdownLessons.length > 0 ? 12 : 24);

  const resultCount = markdownLessons.length + databaseResults.length;

  return (
    <SiteShell active="topics">
      <section className={styles.page} aria-labelledby="lessons-index-title">
        <header className={styles.header}>
          <p className="lesson-eyebrow">Teacher planning library</p>
          <h1 id="lessons-index-title">Find a lesson</h1>
          <p>Search the finished Markdown lesson library first, then open a grade-scoped planning record when a complete lesson is not available yet.</p>
          <form className={styles.search} method="get" action="/lessons" role="search">
            <label>
              <span>What are you planning?</span>
              <input name="q" type="search" defaultValue={query} placeholder="Try steady beat, rhyming, plants, or calming songs" />
            </label>
            <label>
              <span>Grade</span>
              <select name="grade" defaultValue={grade ?? ""}>
                <option value="">All supported grades</option>
                <option value="daycare">Daycare</option>
                <option value="pre-school">Pre-School</option>
                <option value="kindergarten">Kindergarten</option>
                <option value="grade-one">Grade 1</option>
                <option value="grade-two">Grade 2</option>
              </select>
            </label>
            <button type="submit">Search lessons</button>
          </form>
        </header>

        <div className={styles.resultSummary} aria-live="polite">
          {query ? <p>{resultCount} result{resultCount === 1 ? "" : "s"} for “{query}”</p> : <p>{markdownLessons.length} finished lessons ready to browse</p>}
          {databaseUnavailable ? <p className={styles.warning}>The curriculum database is unavailable; finished Markdown lessons are still shown.</p> : null}
        </div>

        <section className={styles.grid} aria-label="Available lessons">
          {markdownLessons.map(({ lesson }) => (
            <article className={styles.card} data-source="markdown" key={lesson.metadata.slug}>
              <div className={styles.cardTop}><span>Finished Markdown lesson</span><strong>{lesson.metadata.grade}</strong></div>
              <h2><Link href={lessonHref(lesson.metadata)}>{lesson.metadata.title}</Link></h2>
              <p>{lesson.metadata.summary}</p>
              <dl><div><dt>Subject</dt><dd>{lesson.metadata.subject}</dd></div><div><dt>Status</dt><dd>Teacher-ready page</dd></div></dl>
              <Link className={styles.cardLink} href={lessonHref(lesson.metadata)}>Open lesson <span aria-hidden="true">→</span></Link>
            </article>
          ))}
          {databaseResults.map(({ topic, href, markdownLesson }) => (
            <article className={styles.card} data-source={markdownLesson ? "markdown" : "database"} key={topic.id}>
              <div className={styles.cardTop}><span>{markdownLesson ? "Finished Markdown lesson" : "Database planning draft"}</span><strong>{topic.grade}</strong></div>
              <h2><Link href={href}>{markdownLesson?.metadata.title ?? topic.title}</Link></h2>
              <p>{markdownLesson?.metadata.summary ?? topic.skillStatement ?? "Open the grade-scoped curriculum record and review what is available."}</p>
              <dl><div><dt>Subject</dt><dd>{markdownLesson?.metadata.subject ?? topic.subject}</dd></div><div><dt>Status</dt><dd>{markdownLesson ? "Teacher-ready page" : "Planning draft"}</dd></div></dl>
              <Link className={styles.cardLink} href={href}>{markdownLesson ? "Open lesson" : "Open planning record"} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
          {resultCount === 0 ? <p className={styles.empty}>No matching lesson was found in this grade. Try a shorter teaching goal or another grade.</p> : null}
        </section>
      </section>
    </SiteShell>
  );
}
