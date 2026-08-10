import Image from "next/image";
import Link from "next/link";
import { HomeCarousel } from "./HomeCarousel";
import { NEW_SLUGS, SONG_SLUGS } from "./home-data";
import { pickLessons, type HomePageProps } from "./HomePage";
import { TopicCabinet } from "./TopicCabinet";
import { WeeklyLessonList } from "./WeeklyLessonList";
import styles from "./HomePage.module.css";

export function HomePageAlternative({ lessons }: HomePageProps) {
  return <div className={`${styles.homePage} ${styles.alternative}`}>
    <section className={styles.hero} aria-labelledby="alternative-title">
      <div className={styles.altIdentity}><Image src="/staff_and_students/old-macdonald-transparent-circle.png" alt="Old MacDonald" width={74} height={74} /><p>Farm School<br /><span>topic room</span></p></div>
      <div className={styles.heroCopy}><p>A familiar place to begin</p><h1 id="alternative-title">Plan with the <em>whole child</em> in mind.</h1><span>Start with rhythm, language, movement, curiosity, or calm—then choose how your class will join.</span><div className={styles.heroActions}><Link href="#topic-cabinet">Open the topic cabinet</Link></div></div>
      <HomeCarousel />
    </section>
    <div id="topic-cabinet"><TopicCabinet /></div>
    <section className={styles.discovery} aria-label="Songs and new lessons">
      <div className={styles.discoveryIntro}><p>Keep it familiar</p><h2>Repeat, vary, and invite</h2><span>Use the same song another way: change a name, add a gesture, or let a child invent the next verse.</span></div>
      <WeeklyLessonList lessons={pickLessons(lessons, SONG_SLUGS)} title="Songs and rhymes" />
      <WeeklyLessonList lessons={pickLessons(lessons, NEW_SLUGS)} title="New this week" compact />
    </section>
  </div>;
}
