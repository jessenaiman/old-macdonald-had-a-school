import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonDocument } from "../LessonDocument";
import { getLesson, getLessonByTitleAndGrade } from "../../lib/content";
import { getCurriculumTopic } from "../../lib/curriculum-db";
import { getCurriculumLessonByTitleAndGrade } from "../../lib/curriculum-lesson";
import { gradeKeysForLabel, type GradeKey } from "../../lib/grade-routes";
import { DatabaseLessonDocument } from "./DatabaseLessonDocument";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRADE_LESSON_DETAILS: Record<
  GradeKey,
  {
    label: string;
    age: string;
    teacher: string;
    teacherName: string;
  }
> = {
  daycare: {
    label: "Daycare",
    age: "Ages 2-3",
    teacher: "/staff_and_students/miss-puddles-transparent-circle.webp",
    teacherName: "Miss Puddles",
  },
  "pre-school": {
    label: "Pre-School",
    age: "Ages 3-4",
    teacher: "/staff_and_students/miss-maisy-transparent-circle.webp",
    teacherName: "Miss Maisy",
  },
  kindergarten: {
    label: "Kindergarten",
    age: "Ages 4-6",
    teacher: "/staff_and_students/mr-rusty-transparent-circle.webp",
    teacherName: "Mr Rusty",
  },
  "grade-one": {
    label: "Grade 1",
    age: "5-6 yrs",
    teacher: "/staff_and_students/miss-hayley-transparent-circle.webp",
    teacherName: "Miss Hayley",
  },
  "grade-two": {
    label: "Grade 2",
    age: "6-7 yrs",
    teacher: "/staff_and_students/mr-maisy-transparent-circle.webp",
    teacherName: "Mr Maisy",
  },
};

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
  const databaseTopic = lesson ? undefined : getCurriculumTopic(slug, grade);
  if (!lesson && !databaseTopic) notFound();
  const authoredLesson =
    lesson ??
    (databaseTopic
      ? await getLessonByTitleAndGrade(databaseTopic.title, grade)
      : undefined);
  const details = GRADE_LESSON_DETAILS[grade];
  const curriculumGradeLabel =
    grade === "pre-school" ? "Preschool" : details.label;
  const curriculumLesson = databaseTopic
    ? getCurriculumLessonByTitleAndGrade(
        databaseTopic.title,
        curriculumGradeLabel,
      )
    : null;
  const subject =
    authoredLesson?.metadata.subject ?? databaseTopic?.subject ?? "Curriculum";
  const title =
    authoredLesson?.metadata.title ?? databaseTopic?.title ?? "Lesson";

  return (
    <div
      className="material-surface material-cardboard-paper my-4 grid w-full grid-cols-1 overflow-hidden rounded-2xl border shadow-sm lg:my-8 lg:grid-cols-[14rem_minmax(0,1fr)] print:block print:w-full print:border-0 print:shadow-none"
      data-grade={grade}
      data-grade-template={grade}
      data-lesson-template={lesson?.metadata.template ?? "database-draft"}
    >
      <aside
        className="grade-surface flex min-w-0 flex-col gap-4 p-4 lg:min-h-[60rem] print:hidden"
        aria-label={`${details.label} lesson sections`}
      >
        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
          <span
            className="brand-asset grade-icon icon-medium"
            data-grade-icon={grade}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-black uppercase tracking-widest">
              Farm School
            </span>
            <strong className="font-heading text-xl leading-none">
              {details.label}
            </strong>
            <small className="text-xs font-bold">{details.age}</small>
          </div>
        </div>
        <nav
          className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:mt-4 lg:grid-cols-1"
          aria-label={`${details.label} lesson navigation`}
        >
          <Button asChild variant="ghost" className="justify-start">
            <Link href="#lesson-overview">
              <span>Overview</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="#lesson-plan">
              <span>Lesson plan</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="#lesson-notes">
              <span>Teacher notes</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href={`/grade/${grade}`}>
              <span>All {details.label}</span>
            </Link>
          </Button>
        </nav>
        <Card className="material-surface material-cardboard-paper relative mt-auto hidden overflow-hidden lg:block">
          <Image
            src={details.teacher}
            alt={details.teacherName}
            width={150}
            height={150}
          />
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
      <div className="min-w-0 p-4 sm:p-6 lg:p-8 print:p-0">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
          <Link href={`/grade/${grade}`}>{details.label}</Link>
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
          ) : (
            <DatabaseLessonDocument
              topic={databaseTopic!}
              curriculumLesson={curriculumLesson}
            />
          )}
        </div>
        <section
          className="material-surface material-cork-board mt-8 rounded-xl border p-4 print:break-before-page"
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
