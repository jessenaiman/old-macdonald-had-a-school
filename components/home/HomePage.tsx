import Image from "next/image";
import Link from "next/link";
import { HomeCarousel } from "./HomeCarousel";
import { HOME_TOPICS, NEW_SLUGS, SONG_SLUGS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./HomePage.module.css";

type HomePageProps = {
  hero: { eyebrow?: string; title?: string; summary?: string };
  lessons: (HomeLesson & { subject: string; category: string })[];
};

function pickLessons(lessons: HomeLesson[], slugs: readonly string[]) {
  return slugs.map((slug) => lessons.find((lesson) => lesson.slug === slug)).filter((lesson): lesson is HomeLesson => Boolean(lesson));
}

function TopicBadge({ topic }: { topic: (typeof HOME_TOPICS)[number] }) {
  return (
    <span className={styles.topicBadge} style={{ "--topic-color": topic.color } as React.CSSProperties} aria-hidden="true">
      <Image className={styles.topicPatch} src={topic.patch} alt="" fill sizes="70px" />
      <Image className={styles.topicPortrait} src={topic.portrait} alt="" fill sizes="66px" />
    </span>
  );
}

export function HomePage({ lessons }: HomePageProps) {
  const songs = pickLessons(lessons, SONG_SLUGS);
  const newLessons = pickLessons(lessons, NEW_SLUGS);

  return (
    <div className={styles.homePage}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p>Old MacDonald Had a School · Teacher resources</p>
          <h1 id="home-title">Where familiar songs become <em>new places</em> to learn.</h1>
          <span>Choose a topic, find one useful starting point, and make room for every child to listen, move, hum, sing, or invent.</span>
          <div className={styles.heroActions}><Link href="#browse-by-topic">Browse topics</Link><Link href="/search">Search lessons</Link></div>
        </div>
        <HomeCarousel />
      </section>

      <section className={styles.topicBoard} id="browse-by-topic" aria-labelledby="topics-title">
        <header className={styles.sectionHeading}><p>Plan from what children will do</p><h2 id="topics-title">What would you like to explore?</h2></header>
        <div className={styles.topicGrid}>
          {HOME_TOPICS.map((topic, index) => (
            <article className={styles.topicCard} style={{ "--topic-color": topic.color } as React.CSSProperties} key={topic.key}>
              <Image className={styles.topicFastener} src={index % 2 ? "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" : "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"} alt="" width={46} height={46} aria-hidden="true" />
              <header><TopicBadge topic={topic} /><div><Image src={topic.icon} alt="" width={36} height={36} aria-hidden="true" /><h3>{topic.title}</h3></div></header>
              <p>{topic.prompt}</p>
              <ul>{topic.lessonTitles.map((title) => <li key={title}><Link href={`/topics?cluster=${topic.filter}`}>{title}<span aria-hidden="true">→</span></Link></li>)}</ul>
              <Link className={styles.topicMore} href={`/topics?cluster=${topic.filter}`}>Explore this topic</Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.discovery} aria-label="Songs and new lessons">
        <div className={styles.discoveryIntro}><p>Repeat what works</p><h2>Songs for bodies, voices, and belonging</h2><span>A small repertoire, revisited often, gives children more ways to join.</span><div className={styles.joinWays}><b>Listen</b><b>Move</b><b>Gesture</b><b>Hum</b><b>Sing</b><b>Invent</b></div></div>
        <WeeklyLessonList lessons={songs} title="Songs to repeat this week" />
        <WeeklyLessonList lessons={newLessons} title="New this week" compact />
      </section>
    </div>
  );
}

export { TopicBadge, pickLessons, type HomePageProps };
