import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeCarousel } from "./HomeCarousel";
import { FolkArtsSection } from "./FolkArtsSection";
import { HomeSubjectNote } from "./HomeSubjectNote";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./HomePage.module.css";
import { ResponsiveFeatureSplit } from "@/components/layout/ResponsiveFeatureSplit";
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
      <section className={`${styles.hero} mx-auto !w-[calc(100%_-_2rem)] !max-w-7xl sm:!w-[calc(100%_-_3rem)]`} aria-labelledby="home-title">
        <Card className={styles.heroCopyCard}>
          <CardHeader className={styles.heroCopy}>
            <CardTitle>
              <HeroTitle title={hero.title} />
            </CardTitle>
          </CardHeader>
          <ResponsiveFeatureSplit asChild ratio="feature" className={styles.heroFeatureGrid}>
            <CardContent>
              <div className={styles.heroWeeklyLessons}>
                <WeeklyLessonList lessons={HOME_VIDEO_SONGS.slice(0, 3)} title="New this week" limit={3} participation selected />
              </div>
              <HomeCarousel selected />
            </CardContent>
          </ResponsiveFeatureSplit>
        </Card>
      </section>

      <nav className={styles.gradeRail} aria-label="Choose a grade workspace">
        {TEACHER_GRADE_ITEMS.map((grade) => (
          <Link key={grade.key} href={grade.href} data-grade={grade.key}>{grade.label}</Link>
        ))}
      </nav>

      <section className={`${styles.bulletinBoard} mx-auto !w-[calc(100%_-_2rem)] !max-w-7xl sm:!w-[calc(100%_-_3rem)]`} id="browse-by-subject" aria-labelledby="subjects-title">
        <header className={styles.subjectHeading}>
          <h2 id="subjects-title">Find a lesson by subject.</h2>
        </header>
        <div className={styles.subjectGrid}>
          {HOME_SUBJECTS.map((subject) => (
              <HomeSubjectNote
                key={subject.key}
                title={subject.title}
                href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}
                color={subject.color as `#${string}`}
                iconClass={subject.iconClass}
                highlights={subject.highlights}
                fastenerClass={subject.fastenerClass}
                paperAsset={subject.paperAsset}
                rotation={subject.rotation}
              />
          ))}
        </div>
      </section>

      <FolkArtsSection />

    </div>
  );
}

export { type HomePageProps };
