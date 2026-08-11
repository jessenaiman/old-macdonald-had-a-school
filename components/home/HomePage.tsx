import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HomeCarousel } from "./HomeCarousel";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./BulletinHomePage.module.css";

type HomePageProps = {
  hero: { eyebrow?: string; title?: string; summary?: string };
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
    portrait: "/icons/staff/whiskers.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-10-whiskers-tile.png",
  },
  math: {
    name: "Sam",
    portrait: "/icons/staff/sam.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-15-sam-tile.png",
  },
  science: {
    name: "Scout",
    portrait: "/icons/staff/scout.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-11-scout-tile.png",
  },
  music: {
    name: "Penny",
    portrait: "/icons/staff/penny.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-12-penny-tile.png",
  },
  arts: {
    name: "Puddles",
    portrait: "/icons/staff/puddles.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-14-puddles-tile.png",
  },
  health: {
    name: "Hopper",
    portrait: "/icons/staff/hopper.png",
    texture: "/design-assets/web-material-library-v1/construction-paper/construction-paper-09-hopper-tile.png",
  },
};

const GRADE_GUIDES = [
  {
    label: "Early Years",
    href: "/grade/daycare",
    texture: "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-08-miss-maisy-tile.png",
    guides: [
      { name: "Miss Puddles", portrait: "/icons/staff/miss-puddles.png" },
      { name: "Miss Maisy", portrait: "/icons/staff/miss-maisy.png" },
    ],
  },
  {
    label: "Kindergarten",
    href: "/grade/kindergarten",
    texture: "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-03-mr-rusty-tile.png",
    guides: [
      { name: "Old MacDonald", portrait: "/icons/staff/old-mac.png" },
      { name: "Mr Rusty", portrait: "/icons/staff/mr-rusty.png" },
    ],
  },
  {
    label: "Grade 1",
    href: "/grade/grade-one",
    texture: "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-04-miss-hayley-tile.png",
    guides: [{ name: "Miss Hayley", portrait: "/icons/staff/miss-hayley.png" }],
  },
  {
    label: "Grade 2",
    href: "/grade/grade-two",
    texture: "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-06-mr-maisy-tile.png",
    guides: [{ name: "Mr Maisy", portrait: "/icons/staff/mr-maisy.png" }],
  },
] as const;

export function pickLessons(lessons: HomeLesson[], slugs: readonly string[]) {
  return slugs
    .map((slug) => lessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is HomeLesson => Boolean(lesson));
}

function HeroTitle({ title }: { title?: string }) {
  return <h1 id="home-title">{title ?? "Songs teachers know. Places children can grow."}</h1>;
}

export function HomePage({ hero, lessons }: HomePageProps) {
  return (
    <div className={styles.homePage}>
      <section className={`${styles.gradeGuide} mx-auto !w-[calc(100%_-_2rem)] !max-w-7xl sm:!w-[calc(100%_-_3rem)]`} id="grade-navigation" aria-labelledby="grade-guide-title">
        <h2 id="grade-guide-title">Choose a grade</h2>
        <div className={styles.gradeGuideGrid}>
          {GRADE_GUIDES.map((grade) => (
            <Link
              className={styles.gradeGuideCard}
              href={grade.href}
              style={{ "--grade-texture": `url(${grade.texture})` } as React.CSSProperties}
              key={grade.label}
            >
              <span className={styles.gradeFaces} aria-hidden="true">
                {grade.guides.map((guide) => <Image src={guide.portrait} alt="" width={58} height={58} key={guide.name} />)}
              </span>
              <span className={styles.gradeGuideCopy}>
                <strong>{grade.label}</strong>
                <small>{grade.guides.map((guide) => guide.name).join(" · ")}</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.hero} mx-auto !w-[calc(100%_-_2rem)] !max-w-7xl sm:!w-[calc(100%_-_3rem)]`} aria-labelledby="home-title">
        <Card className={styles.heroCopyCard}>
          <CardHeader className={styles.heroCopy}>
            <HeroTitle title={hero.title} />
          </CardHeader>
          <CardContent className={styles.heroFeatureGrid}>
            <div className={styles.heroWeeklyLessons}>
              <WeeklyLessonList lessons={HOME_VIDEO_SONGS.slice(2, 5)} title="New this week" limit={3} participation selected />
            </div>
            <HomeCarousel selected />
          </CardContent>
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
              <article
                className={styles.subjectCard}
                style={{ "--subject-color": subject.color } as React.CSSProperties}
                key={subject.key}
              >
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
                      <b>Explore subject <span aria-hidden="true">→</span></b>
                    </span>
                  </span>
                  <span
                    className={styles.learnerBand}
                    style={{ "--learner-texture": `url(${learner.texture})` } as React.CSSProperties}
                  >
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
