import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { BrandIcon } from "@/components/brand-icon";
import { getAllLessons } from "../../lib/content";
import { searchCurriculumTopics } from "../../lib/curriculum-db";
import { GRADE_KEYS, gradeKeysForLabel, lessonHref, lessonIcon, type GradeKey } from "../../lib/grade-routes";

export const metadata: Metadata = {
  title: "Lessons | Old MacDonald Had a School",
  description: "Search teacher-ready Markdown lessons and curriculum planning records.",
};

type SearchParams = Promise<{ q?: string | string[]; grade?: string | string[] }>;

const activityFilters = [
  ["Acting", "acting-stage-curtains", "drama performance"],
  ["Role play", "acting-theatre-masks", "role play"],
  ["Colour", "art-color-wheel", "colour art"],
  ["Ribbon dance", "dance-crossing-ribbons", "ribbon dance"],
  ["Early learning", "early-learning-blocks", "early learning blocks"],
  ["Garden", "garden-watering-produce", "garden plants"],
  ["Balance", "grade-two-balance-scale", "balance scale"],
  ["Healthy food", "health-gingham-lunch", "healthy food"],
  ["Counting", "math-abacus-ruler", "counting numbers"],
  ["Banjo", "music-banjo", "banjo"],
  ["Painting", "painting-easel", "painting"],
  ["Handprints", "painting-handprint", "handprint art"],
  ["Physical play", "physical-ball-rope", "physical play"],
] as const;

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
      score: query ? textScore(query, [lesson.metadata.title, lesson.metadata.subject, lesson.metadata.category, lesson.metadata.summary, lesson.metadata.focus]) : 1,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.lesson.metadata.title.localeCompare(right.lesson.metadata.title));

  const lessonByPath = new Map(lessons.map((lesson) => [lesson.sourcePath.replaceAll("\\", "/"), lesson]));
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
    const markdownLesson = topic.markdownHints.map((hint) => lessonByPath.get(hint.sourcePath)).find(Boolean);
    const href = markdownLesson ? lessonHref(markdownLesson.metadata) : `/grade/${topic.grade}/${topic.id}`;
    if (seenHrefs.has(href)) return [];
    seenHrefs.add(href);
    return [{ topic, href, markdownLesson }];
  }).slice(0, markdownLessons.length > 0 ? 12 : 24);

  const resultCount = markdownLessons.length + databaseResults.length;

  return (
    <section className="mx-auto my-7 w-[min(1240px,calc(100%-28px))] text-foreground max-sm:my-3 max-sm:w-[calc(100%-12px)]" aria-labelledby="lessons-index-title">
        <header className="material-surface material-cardboard-paper relative overflow-hidden rounded-2xl border border-border p-[clamp(1.625rem,4vw,3rem)] shadow-[0_8px_0_color-mix(in_srgb,var(--border)_28%,transparent)] max-sm:px-4 max-sm:py-6">
          <div className="max-w-[850px]">
            <p className="m-0 font-body text-xs font-black leading-tight tracking-[.12em] text-primary uppercase">Teacher planning library</p>
            <h1 className="my-3 max-w-3xl font-heading text-[clamp(2.7rem,6vw,4.75rem)] font-normal leading-[.9] tracking-tight text-balance" id="lessons-index-title">What do you need to teach?</h1>
            <p className="m-0 max-w-3xl font-body text-sm font-semibold leading-relaxed text-muted-foreground">Start with a skill, song, or classroom moment. Teacher-ready lessons appear first, with planning records clearly marked for further review.</p>
          </div>
          <form className="mt-7 grid items-end gap-3 rounded-xl border border-border bg-card/70 p-4 md:grid-cols-[minmax(260px,1fr)_220px_auto]" method="get" action="/lessons" role="search">
            <label className="grid gap-2 font-body text-xs font-black tracking-wider uppercase"><span>What are you planning?</span><Input name="q" type="search" autoComplete="off" defaultValue={query} placeholder="Try steady beat, rhyming, plants, or calming songs..." /></label>
            <label className="grid gap-2 font-body text-xs font-black tracking-wider uppercase">
              <span>Teaching group</span>
              <NativeSelect name="grade" defaultValue={grade ?? ""}>
                <option value="">All supported grades</option><option value="daycare">Daycare</option><option value="pre-school">Pre-School</option><option value="kindergarten">Kindergarten</option><option value="grade-one">Grade 1</option><option value="grade-two">Grade 2</option>
              </NativeSelect>
            </label>
            <Button type="submit">Search lessons</Button>
          </form>
        </header>

        <div className="mx-2 mb-4 mt-8 flex items-end justify-between gap-5 max-sm:mt-6 max-sm:flex-col max-sm:items-start max-sm:gap-2" aria-live="polite">
          <div><span>{query ? "Search results" : "Ready for your week"}</span>{query ? <p>{resultCount} result{resultCount === 1 ? "" : "s"} for &quot;{query}&quot;</p> : <p>{markdownLessons.length} finished lessons ready to browse</p>}</div>
          <p className="max-w-sm text-right text-sm font-bold text-muted-foreground max-sm:text-left">Clear goals, classroom steps, and source notes stay together.</p>
          {databaseUnavailable ? <p className="font-extrabold text-destructive">The curriculum database is unavailable; finished Markdown lessons are still shown.</p> : null}
        </div>

        <nav className="material-surface material-cardboard-paper grid gap-4 rounded-xl border border-border p-5 shadow-sm" aria-label="Browse lessons by classroom activity">
          <div><h2 className="m-0 font-heading text-xl font-normal leading-none text-balance">Browse by classroom activity</h2><p className="mb-0 mt-2 font-body text-base font-semibold leading-[1.7]">Each approved classroom icon opens the matching lesson-library search.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activityFilters.map(([label, icon, cue]) => <Button asChild className="justify-start" key={icon} variant="outline">
              <Link href={`/lessons?q=${encodeURIComponent(cue)}`}><BrandIcon icon={icon} size="small" /><span>{label}</span></Link>
            </Button>)}
          </div>
        </nav>

        <section className="grid gap-5 md:grid-cols-2" aria-label="Available lessons">
          {markdownLessons.map(({ lesson }) => (
            <Card className="material-surface material-cardboard-paper grid grid-cols-[92px_minmax(0,1fr)] gap-0 overflow-hidden border-t-4 border-t-[var(--curriculum-green)] p-0 max-[360px]:grid-cols-1" key={lesson.metadata.slug}>
              <div className="material-surface material-woven-fabric grid items-start justify-items-center p-5 max-[360px]:place-items-center max-[360px]:p-3"><span className={`brand-asset ${lessonIcon(lesson.metadata.title, lesson.metadata.subject, lesson.metadata.category, lesson.metadata.focus, lesson.metadata.summary, lesson.metadata.grade)} icon-medium`} aria-hidden="true" /></div>
              <div className="grid min-w-0 gap-3 p-5"><CardHeader className="p-0"><div className="flex justify-between gap-3 text-xs font-black tracking-wider text-muted-foreground uppercase"><span>Teacher-ready lesson</span><strong>{lesson.metadata.grade}</strong></div><CardTitle className="font-heading text-3xl font-normal leading-none"><Link href={lessonHref(lesson.metadata)}>{lesson.metadata.title}</Link></CardTitle></CardHeader><CardContent className="p-0 text-sm font-semibold leading-6 text-muted-foreground">{lesson.metadata.summary}</CardContent><CardFooter className="flex justify-between gap-3 border-t border-dashed border-border p-0 pt-3 text-xs font-black uppercase"><span>{lesson.metadata.subject}</span><Link className="text-primary" href={lessonHref(lesson.metadata)}>Open lesson →</Link></CardFooter></div>
            </Card>
          ))}
          {databaseResults.map(({ topic, href, markdownLesson }) => (
            <Card className={`material-surface material-cardboard-paper grid grid-cols-[92px_minmax(0,1fr)] gap-0 overflow-hidden border-t-4 p-0 max-[360px]:grid-cols-1 ${markdownLesson ? "border-t-[var(--curriculum-green)]" : "border-t-accent"}`} key={topic.id}>
              <div className="material-surface material-woven-fabric grid items-start justify-items-center p-5 max-[360px]:place-items-center max-[360px]:p-3"><span className={`brand-asset ${lessonIcon(markdownLesson?.metadata.title ?? topic.title, markdownLesson?.metadata.subject ?? topic.subject, markdownLesson?.metadata.category ?? topic.category ?? "", markdownLesson?.metadata.focus ?? topic.skillStatement ?? "", topic.grade)} icon-medium`} aria-hidden="true" /></div>
              <div className="grid min-w-0 gap-3 p-5"><CardHeader className="p-0"><div className="flex justify-between gap-3 text-xs font-black tracking-wider text-muted-foreground uppercase"><span>{markdownLesson ? "Teacher-ready lesson" : "Planning record"}</span><strong>{topic.grade}</strong></div><CardTitle className="font-heading text-3xl font-normal leading-none"><Link href={href}>{markdownLesson?.metadata.title ?? topic.title}</Link></CardTitle></CardHeader><CardContent className="p-0 text-sm font-semibold leading-6 text-muted-foreground">{markdownLesson?.metadata.summary ?? topic.skillStatement ?? "Open the grade-scoped curriculum record and review what is available."}</CardContent><CardFooter className="flex justify-between gap-3 border-t border-dashed border-border p-0 pt-3 text-xs font-black uppercase"><span>{markdownLesson?.metadata.subject ?? topic.subject}</span><Link className="text-primary" href={href}>{markdownLesson ? "Open lesson" : "Review record"} →</Link></CardFooter></div>
            </Card>
          ))}
          {resultCount === 0 ? <Empty className="col-span-full border"><EmptyHeader><EmptyTitle>No matching lesson</EmptyTitle><EmptyDescription>Try a shorter teaching goal or another grade.</EmptyDescription></EmptyHeader></Empty> : null}
        </section>
    </section>
  );
}
