import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonDocument } from "../LessonDocument";
import { SiteShell, type ActivePage } from "../SiteShell";
import { getLesson } from "../../lib/content";
import { gradeKeysForLabel, type GradeKey } from "../../lib/grade-routes";
import styles from "./GradeLessonPage.module.css";

const GRADE_LESSON_DETAILS: Record<GradeKey, {
  label: string;
  age: string;
  badge: string;
  teacher: string;
  teacherName: string;
}> = {
  daycare: { label: "Daycare", age: "Ages 2–3", badge: "/brand-kit-icon-sheets/individual-icons/grade-daycare.png", teacher: "/staff_and_students/miss-puddles-transparent-circle.png", teacherName: "Miss Puddles" },
  "pre-school": { label: "Pre-School", age: "Ages 3–4", badge: "/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-circle.png", teacher: "/staff_and_students/miss-maisy-transparent-circle.png", teacherName: "Miss Maisy" },
  kindergarten: { label: "Kindergarten", age: "Ages 4–6", badge: "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png", teacher: "/staff_and_students/mr-rusty-transparent-circle.png", teacherName: "Mr Rusty" },
  "grade-one": { label: "Grade 1", age: "5–6 yrs", badge: "/brand-kit-icon-sheets/individual-icons/grade-1.png", teacher: "/staff_and_students/miss-hayley-transparent-circle.png", teacherName: "Miss Hayley" },
  "grade-two": { label: "Grade 2", age: "6–7 yrs", badge: "/brand-kit-icon-sheets/individual-icons/grade-2.png", teacher: "/staff_and_students/mr-sam-transparent-circle.png", teacherName: "Mr Sam" },
};

export async function GradeLessonPage({
  slug,
  grade,
  active,
  className,
}: {
  slug: string;
  grade: GradeKey;
  active: ActivePage;
  className: string;
}) {
  const lesson = await getLesson(slug);
  if (!lesson || !gradeKeysForLabel(lesson.metadata.grade).includes(grade)) notFound();
  const details = GRADE_LESSON_DETAILS[grade];

  return (
    <SiteShell active={active}>
      <div className={`${styles.lessonPage} ${className}`} data-grade-template={grade} data-lesson-template={lesson.metadata.template}>
        <aside className={styles.rail} aria-label={`${details.label} lesson sections`}>
          <div className={styles.railIdentity}>
            <Image src={details.badge} alt="" width={68} height={68} className={styles.gradeBadge} priority />
            <div><span>Farm School</span><strong>{details.label}</strong><small>{details.age}</small></div>
          </div>
          <nav className={styles.railNav}>
            <a href="#lesson-overview"><b>01</b><span>Overview</span></a>
            <a href="#lesson-plan"><b>02</b><span>Lesson plan</span></a>
            <a href="#lesson-notes"><b>03</b><span>Teacher notes</span></a>
            <Link href={`/grade/${grade}`}><b>04</b><span>All {details.label}</span></Link>
          </nav>
          <div className={styles.teacherPatch}>
            <Image src={details.teacher} alt={details.teacherName} width={150} height={150} />
            <span>Your {details.label} guide</span>
            <strong>{details.teacherName}</strong>
          </div>
        </aside>
        <div className={styles.lessonStage}>
          <div className={styles.lessonCrumb}><Link href={`/grade/${grade}`}>{details.label}</Link><span aria-hidden="true">›</span><span>{lesson.metadata.subject}</span><span aria-hidden="true">›</span><span>Individual lesson</span></div>
          <div id="lesson-overview">
            <LessonDocument Content={lesson.Content} metadata={lesson.metadata} />
          </div>
          <section className={styles.teacherNotes} id="lesson-notes" aria-label="Teacher planning notes">
            <header>
              <p>Three quiet places to make the lesson your own.</p>
            </header>
            <div className={styles.teacherNoteGrid}>
              {[
                ["Before learners arrive", "Materials, room setup, or one reassuring reminder.", "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"],
                ["As we learn", "A child idea, an adaptation, or a question worth following.", "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png"],
                ["For next time", "What to repeat, extend, or offer in another way.", "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png"],
              ].map(([title, prompt, fastener]) => (
                <article className={styles.teacherNote} key={title}>
                  <Image src={fastener} alt="" width={38} height={38} />
                  <h2>{title}</h2>
                  <p>{prompt}</p>
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </article>
              ))}
            </div>
          </section>
          <div className={styles.bottomAction}>
            <Link href={`/grade/${grade}`}>← Back to {details.label} lessons</Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
