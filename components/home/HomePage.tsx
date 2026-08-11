import Image from "next/image";
import Link from "next/link";
import { lessonHref } from "@/lib/grade-routes";
import { HomeCarousel } from "./HomeCarousel";
import {
  EARLY_YEARS_STAFF,
  HOME_SUBJECTS,
  NEW_SLUGS,
  SONG_SLUGS,
  type HomeLesson,
} from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./HomePage.module.css";

type HomePageProps = {
  hero: { eyebrow?: string; title?: string; summary?: string };
  lessons: HomeLesson[];
};

export function pickLessons(lessons: HomeLesson[], slugs: readonly string[]) {
  return slugs
    .map((slug) => lessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is HomeLesson => Boolean(lesson));
}

function SubjectIcon({ subject }: { subject: (typeof HOME_SUBJECTS)[number] }) {
  return (
    <span className={styles.subjectIcon} aria-hidden="true">
      <Image src={subject.icon} alt="" width={72} height={72} />
    </span>
  );
}

function StaffBadge({ portrait, color, texture }: { portrait: string; color: string; texture: string }) {
  return (
    <span
      className={styles.staffBadge}
      style={{ "--staff-color": color, "--staff-texture": `url(${texture})` } as React.CSSProperties}
      aria-hidden="true"
    >
      <Image className={styles.staffPortrait} src={portrait} alt="" fill sizes="38px" />
    </span>
  );
}

function shortGrade(grade: string) {
  const normalized = grade.toLowerCase();
  if (normalized.includes("daycare")) return "Daycare";
  if (normalized.includes("pre-school") || normalized.includes("preschool")) return "Pre-School";
  if (normalized.includes("kindergarten")) return "Kindergarten";
  if (normalized.includes("grade 1") && normalized.includes("2")) return "Grades 1–2";
  if (normalized.includes("grade 1")) return "Grade 1";
  if (normalized.includes("grade 2")) return "Grade 2";
  if (normalized.includes("ages 1-3")) return "Ages 1–3";
  if (normalized.includes("ages 2-4")) return "Ages 2–4";
  if (normalized.includes("ages 2-5")) return "Ages 2–5";
  return grade;
}

export function HomePage({ hero, lessons }: HomePageProps) {
  const songs = pickLessons(lessons, SONG_SLUGS);
  const newLessons = pickLessons(lessons, NEW_SLUGS);

  return (
    <div className={styles.homePage}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <h1 id="home-title">{hero.title ?? "Plan your next lesson."}</h1>
          <div className={styles.heroActions}>
            <Link href="#browse-by-subject">Browse subjects</Link>
            <Link href="/search">Search lessons</Link>
          </div>
        </div>
        <HomeCarousel />
      </section>

      <section className={styles.subjectBoard} id="browse-by-subject" aria-labelledby="subjects-title">
        <div className={styles.staffCorner} aria-hidden="true">
          {EARLY_YEARS_STAFF.map((staff) => <StaffBadge key={staff.portrait} {...staff} />)}
        </div>

        <header className={styles.sectionHeading}>
          <p>Early years core → grade school core</p>
          <h2 id="subjects-title">Find a lesson by subject</h2>
          <nav aria-label="Other ways to find a lesson">
            <Link href="#grade-navigation">Choose a grade</Link>
            <Link href="/topics">View every topic</Link>
            <Link href="/search">Search lessons</Link>
          </nav>
        </header>

        <div className={styles.subjectGrid}>
          {HOME_SUBJECTS.map((subject, index) => {
            const subjectLessons = lessons.filter(subject.matches).slice(0, 3);
            return (
              <article className={styles.subjectCard} style={{ "--subject-color": subject.color } as React.CSSProperties} key={subject.key}>
                <Image
                  className={styles.cardFastener}
                  src={index % 3 === 1
                    ? "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png"
                    : "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"}
                  alt=""
                  width={42}
                  height={42}
                />
                <header>
                  <SubjectIcon subject={subject} />
                  <div>
                    <p>{subject.earlyYearsLabel} →</p>
                    <h3>{subject.title}</h3>
                    <span>{subjectLessons.length} {subjectLessons.length === 1 ? "lesson" : "lessons"} currently available</span>
                  </div>
                </header>
                {subjectLessons.length > 0 && (
                  <ul>
                    {subjectLessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <Link href={lessonHref(lesson)}>
                          <span>{lesson.title}</span>
                          <small title={lesson.grade}>{shortGrade(lesson.grade)}</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link className={styles.subjectMore} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}>
                  Explore this subject <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.discovery} aria-label="Songs and new lessons">
        <WeeklyLessonList lessons={songs} title="Songs to repeat" />
        <WeeklyLessonList lessons={newLessons} title="New this week" compact />
      </section>
    </div>
  );
}

export { type HomePageProps };
