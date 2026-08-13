import { HomeCarousel } from "./HomeCarousel";
import { FolkArtsSection } from "./FolkArtsSection";
import { HomeSubjectNote } from "./HomeSubjectNote";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, SUBJECT_LEARNERS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./HomePage.module.css";
import { TEACHER_GRADE_ITEMS } from "@/components/site-navigation";
import Link from "next/link";

type HomePageProps = {
  hero: { title?: string };
  lessons: HomeLesson[];
};

export function pickLessons(lessons: HomeLesson[], slugs: readonly string[]) {
  return slugs
    .map((slug) => lessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is HomeLesson => Boolean(lesson));
}

function HeroTitle({ title }: { title?: string }) {
  const resolvedTitle = title ?? "Where familiar songs become new places to learn.";

  if (resolvedTitle === "Where familiar songs become new places to learn.") {
    return <h1 id="home-title">Where familiar songs become <em>new places</em> to learn.</h1>;
  }

  return <h1 id="home-title">{resolvedTitle}</h1>;
}

export function HomePage({ hero }: HomePageProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}><HeroTitle title={hero.title} /></div>
        <div className={styles.heroFeatureGrid}>
          <div className={styles.heroWeeklyLessons}>
            <WeeklyLessonList lessons={HOME_VIDEO_SONGS.slice(0, 3)} title="New this week" limit={3} participation selected />
          </div>
          <HomeCarousel selected />
        </div>
      </section>

      <nav className={styles.gradeRail} aria-label="Choose a grade workspace">
        <span className={styles.gradeRailLabel}>Early Years / Grades</span>
        {TEACHER_GRADE_ITEMS.map((grade) => (
          <Link key={grade.key} href={grade.href} data-grade={grade.key}>{grade.label}</Link>
        ))}
      </nav>

      <section className={styles.bulletinBoard} id="browse-by-subject" aria-labelledby="subjects-title">
        <header className={styles.subjectHeading}>
          <h2 id="subjects-title">Find a lesson by subject.</h2>
        </header>
        <div className={styles.subjectGrid}>
          {HOME_SUBJECTS.map((subject) => (
              <HomeSubjectNote
                key={subject.key}
                subject={subject.key}
                title={subject.title}
                href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}
                  iconClass={subject.iconClass}
                  teacherReason={subject.teacherReason}
                  highlights={subject.highlights}
                fastenerClass={subject.fastenerClass}
                noteShape={subject.noteShape}
                rotation={subject.rotation}
                guideCharacter={SUBJECT_LEARNERS[subject.key]?.character}
              />
          ))}
        </div>
      </section>

      <FolkArtsSection />

    </div>
  );
}

export { type HomePageProps };
