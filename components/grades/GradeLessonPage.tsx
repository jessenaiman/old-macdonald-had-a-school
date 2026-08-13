import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonDocument } from "../LessonDocument";
import { getLesson, getLessonByTitleAndGrade } from "../../lib/content";
import { getCurriculumTopic } from "../../lib/curriculum-db";
import { getCurriculumLessonByTitleAndGrade } from "../../lib/curriculum-lesson";
import { gradeKeysForLabel, type GradeKey } from "../../lib/grade-routes";
import { DatabaseLessonDocument } from "./DatabaseLessonDocument";
import styles from "./GradeLessonPage.module.css";

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
    teacher: "/staff_and_students/miss-puddles-transparent-circle.png",
    teacherName: "Miss Puddles",
  },
  "pre-school": {
    label: "Pre-School",
    age: "Ages 3-4",
    teacher: "/staff_and_students/miss-maisy-transparent-circle.png",
    teacherName: "Miss Maisy",
  },
  kindergarten: {
    label: "Kindergarten",
    age: "Ages 4-6",
    teacher: "/staff_and_students/mr-rusty-transparent-circle.png",
    teacherName: "Mr Rusty",
  },
  "grade-one": {
    label: "Grade 1",
    age: "5-6 yrs",
    teacher: "/staff_and_students/miss-hayley-transparent-circle.png",
    teacherName: "Miss Hayley",
  },
  "grade-two": {
    label: "Grade 2",
    age: "6-7 yrs",
    teacher: "/staff_and_students/mr-maisy-transparent-circle.png",
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
      className={styles.lessonPage}
      data-grade={grade}
      data-grade-template={grade}
      data-lesson-template={lesson?.metadata.template ?? "database-draft"}
      data-style-scope="grade-lesson-page"
    >
      <aside
        className={styles.rail}
        aria-label={`${details.label} lesson sections`}
      >
        <div className={styles.railIdentity}>
          <span
            className={`${styles.gradeBadge} brand-asset grade-icon icon-medium`}
            data-grade-icon={grade}
            aria-hidden="true"
          />
          <div>
            <span>Farm School</span>
            <strong>{details.label}</strong>
            <small>{details.age}</small>
          </div>
        </div>
        <nav className={styles.railNav}>
          <a href="#lesson-overview">
            <span>Overview</span>
          </a>
          <a href="#lesson-plan">
            <span>Lesson plan</span>
          </a>
          <a href="#lesson-notes">
            <span>Teacher notes</span>
          </a>
          <Link href={`/grade/${grade}`}>
            <span>All {details.label}</span>
          </Link>
        </nav>
        <div className={styles.teacherPatch}>
          <Image
            src={details.teacher}
            alt={details.teacherName}
            width={150}
            height={150}
          />
          <span>Your {details.label} guide</span>
          <strong>{details.teacherName}</strong>
        </div>
      </aside>
      <div className={styles.lessonStage}>
        <div className={styles.lessonCrumb}>
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
          className={styles.teacherNotes}
          id="lesson-notes"
          aria-label="Teacher planning notes"
        >
          <header>
            <p>Three quiet places to make the lesson your own.</p>
          </header>
          <div className={styles.teacherNoteGrid}>
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
              <article className={styles.teacherNote} key={title}>
                <span
                  className={`brand-asset ${fastener} icon-small`}
                  aria-hidden="true"
                />
                <h2>{title}</h2>
                <p>{prompt}</p>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>
        <div className={styles.bottomAction}>
          <Link
            href={`/grade/${grade}`}
          >{`<- Back to ${details.label} lessons`}</Link>
        </div>
      </div>
    </div>
  );
}
