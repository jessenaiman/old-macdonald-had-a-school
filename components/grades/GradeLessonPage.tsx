import Link from "next/link";
import { notFound } from "next/navigation";
import type { CharacterKey } from "../../data/brand/characters-registry";
import { LessonDocument } from "../LessonDocument";
import { getLesson } from "../../lib/content";
import { getCurriculumTopic } from "../../lib/curriculum-db";
import { getCurriculumLessonByTitleAndGrade, getCurriculumLessonStandIn } from "../../lib/curriculum-lesson";
import { gradeKeysForLabel, type GradeKey } from "../../lib/grade-routes";
import { DatabaseLessonDocument } from "./DatabaseLessonDocument";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EARLY_YEARS,
  type EarlyYearsGradeKey,
  type EarlyYearsTopic,
} from "../../lib/early-years";
import {
  WorkingWallBoard,
  WorkingWallNote,
} from "../working-wall/WorkingWallComponents";
import {
  BookOpen,
  Check,
  Clock,
  FileText,
  Paperclip,
  Star,
  Users,
} from "lucide-react";

const GRADE_LESSON_DETAILS: Record<
  GradeKey,
  {
    label: string;
    age: string;
    teacher: CharacterKey;
    academicLead: string;
    teacherName: string;
  }
> = {
  daycare: {
    label: "Daycare",
    age: "Ages 2-3",
    teacher: "miss-puddles",
    academicLead: "Early Learning · Movement · SEL",
    teacherName: "Miss Puddles",
  },
  "pre-school": {
    label: "Preschool",
    age: "Ages 3-4",
    teacher: "miss-maisy",
    academicLead: "Community · Science · Food & Health",
    teacherName: "Miss Maisy",
  },
  kindergarten: {
    label: "Kindergarten",
    age: "Ages 4-6",
    teacher: "mr-rusty",
    academicLead: "Music · Rhythm · Counting",
    teacherName: "Mr Rusty",
  },
  "grade-one": {
    label: "Grade 1",
    age: "5-6 yrs",
    teacher: "miss-hayley",
    academicLead: "Literacy · Music · Drama",
    teacherName: "Miss Hayley",
  },
  "grade-two": {
    label: "Grade 2",
    age: "6-7 yrs",
    teacher: "mr-maisy",
    academicLead: "Physical Education · Health",
    teacherName: "Mr Maisy",
  },
};

const EARLY_YEARS_BY_GRADE: Partial<Record<GradeKey, EarlyYearsGradeKey>> = {
  daycare: "daycare",
  "pre-school": "pre-school",
  kindergarten: "kindergarten",
};

function EarlyYearsLessonStructure({ topic }: { topic: EarlyYearsTopic }) {
  const materials = topic.materials ?? [];
  const vocabulary = topic.vocabulary ?? [];

  return (
    <section className="mt-8" aria-label="Lesson structure">
      <dl className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <div className="flex items-start gap-2">
          <FileText
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <dt className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Focus
            </dt>
            <dd className="text-sm font-bold">{topic.focus}</dd>
          </div>
        </div>
        {typeof topic.estimatedMinutes === "number" ? (
          <div className="flex items-start gap-2">
            <Clock
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <dt className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Estimated time
              </dt>
              <dd className="text-sm font-bold">
                {topic.estimatedMinutes} minutes
              </dd>
            </div>
          </div>
        ) : null}
        {topic.learners ? (
          <div className="flex items-start gap-2">
            <Users
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <dt className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Learners
              </dt>
              <dd className="text-sm font-bold">{topic.learners}</dd>
            </div>
          </div>
        ) : null}
      </dl>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="material-surface material-cardboard-paper relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Star className="size-4 text-primary" aria-hidden="true" />
              Today&rsquo;s goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-xl leading-snug">{topic.focus}</p>
          </CardContent>
        </Card>
        {materials.length > 0 ? (
          <Card className="material-surface material-cardboard-paper relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <Paperclip className="size-4 text-primary" aria-hidden="true" />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {materials.map((material) => (
                  <li key={material} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm">{material}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                {materials.length} {materials.length === 1 ? "item" : "items"}
              </p>
            </CardContent>
          </Card>
        ) : null}
        {vocabulary.length > 0 ? (
          <Card className="material-surface material-cardboard-paper relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <BookOpen className="size-4 text-primary" aria-hidden="true" />
                Vocabulary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {vocabulary.map((term) => (
                  <li
                    className="rounded-full border px-3 py-1 text-sm font-bold"
                    key={term}
                  >
                    {term}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Lesson flow
          </h3>
          <ol className="mt-3 grid gap-3">
            {topic.steps.map((step, index) => (
              <li key={step}>
                <Card
                  className="material-surface material-cardboard-paper relative flex-row items-center gap-4 px-4"
                  size="sm"
                >
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="min-w-0 font-heading text-lg leading-tight">
                    {step}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
        <WorkingWallBoard
          className="self-start"
          aria-label="Teacher support notes"
        >
          {topic.choice && topic.choice.length > 0 ? (
            <WorkingWallNote fastener="pin" heading="Teacher support">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Ways to join in
              </p>
              <ul className="grid gap-1.5 text-sm">
                {topic.choice.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </WorkingWallNote>
          ) : null}
          {topic.noticeFor && topic.noticeFor.length > 0 ? (
            <WorkingWallNote fastener="clip" heading="Look-fors">
              <ul className="grid gap-1.5 text-sm">
                {topic.noticeFor.map((notice) => (
                  <li key={notice}>{notice}</li>
                ))}
              </ul>
            </WorkingWallNote>
          ) : null}
        </WorkingWallBoard>
      </div>
    </section>
  );
}

export async function GradeLessonPage({
  slug,
  grade,
}: {
  slug: string;
  grade: GradeKey;
}) {
  const lesson = await getLesson(slug);
  if (lesson && !gradeKeysForLabel(lesson.metadata.grade).includes(grade))
    notFound();
  const databaseTopic = getCurriculumTopic(slug, grade);
  const earlyYearsGrade = EARLY_YEARS_BY_GRADE[grade];
  const earlyYearsTopic = earlyYearsGrade
    ? EARLY_YEARS[earlyYearsGrade].find((topic) => topic.slug === slug)
    : undefined;
  if (!lesson && !databaseTopic && !earlyYearsTopic) notFound();
  // Markdown files are examples until validated; the database and registry lead.
  const authoredLesson = lesson?.validated ? lesson : undefined;
  const details = GRADE_LESSON_DETAILS[grade];
  const curriculumGradeLabel =
    grade === "pre-school" ? "Preschool" : details.label;
  const curriculumLesson = getCurriculumLessonByTitleAndGrade(
    databaseTopic?.title ?? lesson?.metadata.title ?? "",
    curriculumGradeLabel,
  ) ?? (lesson ? getCurriculumLessonStandIn(lesson.metadata.title, curriculumGradeLabel) : null);
  const subject =
    databaseTopic?.subject ??
    lesson?.metadata.subject ??
    "Curriculum";
  const title =
    databaseTopic?.title ??
    earlyYearsTopic?.title ??
    lesson?.metadata.title ??
    "Lesson";

  return (
    <div
      className="grade-workspace-stage working-wall-stage my-4 grid w-full grid-cols-1 overflow-hidden rounded-2xl border shadow-sm lg:my-8 lg:grid-cols-[14rem_minmax(0,1fr)] print:block print:w-full print:border-0 print:shadow-none"
      data-grade={grade}
      data-grade-template={grade}
      data-style-scope="grade-workspace"
      data-lesson-template={lesson?.metadata.template ?? "database-draft"}
    >
      <aside
        className="grade-surface flex min-w-0 flex-col gap-4 p-4 lg:min-h-[60rem] print:hidden"
        aria-label={`${details.label} lesson sections`}
      >
        <div className="grade-workspace-rail-header relative flex flex-col items-start gap-1">
          <span data-character={details.teacher} className="brand-asset character-face-bust icon-medium grade-workspace-rail-character" role="img" aria-label={details.teacherName} />
          <span
            className="brand-asset grade-icon icon-medium"
            data-grade-icon={grade}
            aria-hidden="true"
          />
          <div className="grade-workspace-rail-copy flex min-w-0 max-w-full flex-col pe-13 text-[11px] leading-tight tracking-tight lg:pe-14">
            <span className="text-xs font-black uppercase tracking-widest">
              Old MacDonald Had a School
            </span>
            <small className="max-w-[10rem] text-xs font-bold leading-tight">{details.academicLead}</small>

            <strong className="font-heading text-xl leading-none">
              {details.label}
            </strong>
            <small className="text-xs font-bold">{details.age}</small>
            <small className="text-xs font-semibold">{details.teacherName}</small>
          </div>
        </div>
        <nav
          className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:mt-4 lg:grid-cols-1"
          aria-label={`${details.label} lesson navigation`}
        >
          <Button asChild variant="ghost" className="min-h-11 justify-start">
            <Link href="#lesson-overview" aria-current="page">
              <span>Overview</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="min-h-11 justify-start">
            <Link href="#lesson-plan">
              <span>Lesson plan</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="min-h-11 justify-start">
            <Link href="#lesson-notes">
              <span>Teacher notes</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="min-h-11 justify-start">
            <Link href={`/grade/${grade}`}>
              <span>All {details.label}</span>
            </Link>
          </Button>
        </nav>
        <Card className="grade-workspace-guide material-surface material-cardboard-paper relative mt-auto hidden overflow-visible lg:block">
          <CardHeader>
            <span className="text-xs font-black uppercase tracking-widest">
              Your {details.label} guide
            </span>
            <CardTitle className="font-hand text-2xl">
              {details.teacherName}
            </CardTitle>
          </CardHeader>
        </Card>
      </aside>
      <div className="grade-workspace-stage-content min-w-0 p-4 sm:p-6 lg:p-8 print:p-0">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
          <Link className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`/grade/${grade}`}>{details.label}</Link>
          <span aria-hidden="true">&gt;</span>
          <span>{subject}</span>
          <span aria-hidden="true">&gt;</span>
          <span>{title}</span>
        </div>
        <div id="lesson-overview">
          {authoredLesson ? (
            <LessonDocument
              Content={authoredLesson.Content}
              metadata={authoredLesson.metadata}
              curriculumLesson={curriculumLesson}
            />
          ) : databaseTopic || curriculumLesson ? (
            <DatabaseLessonDocument
              topic={databaseTopic}
              curriculumLesson={curriculumLesson}
            />
          ) : null}
        </div>
        {earlyYearsTopic ? <EarlyYearsLessonStructure topic={earlyYearsTopic} /> : null}
        <section
          className="material-surface material-cork mt-8 rounded-xl border p-4 print:break-before-page"
          id="lesson-notes"
          aria-label="Teacher planning notes"
        >
          <header className="mb-5 text-center">
            <p className="font-hand text-2xl">
              Three quiet places to make the lesson your own.
            </p>
          </header>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "Before learners arrive",
                "Materials, room setup, or one reassuring reminder.",
                "fastener-paperclip",
              ],
              [
                "As we learn",
                "A child idea, an adaptation, or a question worth following.",
                "fastener-masking-tape",
              ],
              [
                "For next time",
                "What to repeat, extend, or offer in another way.",
                "fastener-push-pin",
              ],
            ].map(([title, prompt, fastener]) => (
              <Card
                className="material-surface material-cardboard-paper relative min-h-48 print:min-h-[5.8in] print:break-inside-avoid"
                key={title}
              >
                <span
                  className={`brand-asset ${fastener} icon-small`}
                  aria-hidden="true"
                />
                <CardHeader className="pt-8">
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{prompt}</p>
                  <div className="mt-3 grid gap-7">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        className="border-b"
                        aria-hidden="true"
                        key={index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <div className="mt-6 flex justify-end print:hidden">
          <Button asChild>
            <Link
              href={`/grade/${grade}`}
            >{`← Back to ${details.label} lessons`}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
