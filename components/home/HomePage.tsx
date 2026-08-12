import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeCarousel } from "./HomeCarousel";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import { globalClassNames as styles } from "@/lib/global-class-names";
import { ResponsiveFeatureSplit } from "@/components/layout/ResponsiveFeatureSplit";

type HomePageProps = {
  hero: { title?: string };
  lessons: HomeLesson[];
};

type SubjectLearner = {
  name: string;
  portrait: string;
  texture: string;
};

const SUBJECT_LEARNERS: Record<string, SubjectLearner> = {
  language: {
    name: "Whiskers",
    portrait: "/staff_and_students/whiskers-transparent-circle.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-10-whiskers-tile.png",
  },
  math: {
    name: "Sam",
    portrait: "/staff_and_students/sam-transparent-circle.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-15-sam-tile.png",
  },
  science: {
    name: "Scout",
    portrait: "/staff_and_students/scout-transparent-circle.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-11-scout-tile.png",
  },
  music: {
    name: "Penny",
    portrait: "/staff_and_students/penny-transparent-circle.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-12-penny-tile.png",
  },
  arts: {
    name: "Puddles",
    portrait: "/staff_and_students/puddles-transparent-circle.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-14-puddles-tile.png",
  },
  health: {
    name: "Hopper",
    portrait: "/staff_and_students/hopper-transparent-circle.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-09-hopper-tile.png",
  },
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
    <div className={styles.homePage} data-style-scope="bulletin-home-page">
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
          {HOME_SUBJECTS.map((subject, index) => {
            const lessonCount = lessons.filter(subject.matches).length;
            const learner = SUBJECT_LEARNERS[subject.key];

            return (
              <article className={styles.subjectCard} data-subject={subject.key} key={subject.key}>
                <Image
                  className={styles.cardFastener}
                  src={index % 3 === 1
                    ? "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png"
                    : "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"}
                  alt=""
                  width={38}
                  height={38}
                />
                <Link href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}>
                  <span className={styles.subjectMain}>
                    <Image className={styles.subjectIcon} src={subject.icon} alt="" width={112} height={112} />
                    <span className={styles.subjectCopy}>
                      <h3>{subject.title}</h3>
                      <ul aria-label={`${subject.title} learning ideas`}>
                        {subject.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>
                      <small>{lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</small>
                      <b>Explore subject <span aria-hidden="true">-&gt;</span></b>
                    </span>
                  </span>
                  <span className={styles.learnerBand}>
                    <span>Explore with {learner.name}</span>
                    <Image src={learner.portrait} alt="" width={66} height={66} />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
}

export { type HomePageProps };
