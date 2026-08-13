import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectCard } from "@/components/brand/SubjectCard";
import { HomeCarousel } from "./HomeCarousel";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, SUBJECT_LEARNERS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./HomePage.module.css";
import { ResponsiveFeatureSplit } from "@/components/layout/ResponsiveFeatureSplit";

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

export function HomePage({ hero, lessons }: HomePageProps) {
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

      <section className={`${styles.bulletinBoard} mx-auto !w-[calc(100%_-_2rem)] !max-w-7xl sm:!w-[calc(100%_-_3rem)]`} id="browse-by-subject" aria-labelledby="subjects-title">
        <header className={styles.subjectHeading}>
          <h2 id="subjects-title">Find a lesson by subject.</h2>
        </header>
        <div className={styles.subjectGrid}>
            {HOME_SUBJECTS.map((subject) => {
            const lessonCount = lessons.filter(subject.matches).length;
            const learner = SUBJECT_LEARNERS[subject.key];

            return (
              <SubjectCard
                key={subject.key}
                title={subject.title}
                href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}
                color={learner.color}
                texture={learner.texture}
                characterName={learner.name}
                portrait={learner.portrait}
                iconClass={subject.iconClass}
                highlights={subject.highlights}
                lessonCount={lessonCount}
                ink={learner.ink}
                fastenerClass={subject.fastenerClass}
              />
            );
          })}
        </div>
      </section>

    </div>
  );
}

export { type HomePageProps };
