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
    <div className={`${styles.homePage} home-structural-surface`}>
      <section className={`${styles.hero} site-leather-surface`} aria-labelledby="home-title">
        <div className={`${styles.heroCopy} material-surface material-cardboard-paper`}>
          <span className={`${styles.heroTitleFastener} brand-asset fastener-masking-tape icon-medium`} aria-hidden="true" />
          <HeroTitle title={hero.title} />
        </div>
        <div className={`${styles.heroFeatureGrid} grid-cols-1 lg:grid-cols-2`}>
          <div className={`${styles.heroWeeklyLessons} material-surface material-cardboard-paper`}>
            <span className={`${styles.weeklyFastener} brand-asset fastener-paperclip`} aria-hidden="true" />
            <WeeklyLessonList lessons={HOME_VIDEO_SONGS.slice(0, 3)} title="New this week" limit={3} participation selected />
          </div>
          <HomeCarousel selected />
        </div>
      </section>

      <nav className={`${styles.gradeRail} material-surface material-cardboard-paper lg:grid-cols-[minmax(10rem,.7fr)_repeat(5,minmax(0,1fr))] lg:overflow-visible`} aria-label="Choose a grade workspace">
        <span className={`${styles.gradeRailLabel} lg:static`}>Early Years / Grades</span>
        {TEACHER_GRADE_ITEMS.map((grade) => (
          <Link key={grade.key} href={grade.href} data-grade={grade.key}>
            <span className={`${styles.gradeIcon} brand-asset grade-icon`} data-grade-icon={grade.key} aria-hidden="true" />
            <span>{grade.label}</span>
            <span className={`${styles.gradeFastener} brand-asset fastener-brass-rivet`} aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <section className={`${styles.bulletinBoard} material-surface material-cork`} id="browse-by-subject" aria-labelledby="subjects-title">
        <header className={styles.subjectHeading}>
          <span className={`${styles.subjectHeadingFastener} brand-asset fastener-masking-tape`} aria-hidden="true" />
          <h2 id="subjects-title">Find a lesson by subject.</h2>
        </header>
        <div className={`${styles.subjectGrid} grid-cols-1 md:grid-cols-2 xl:grid-cols-3`}>
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
