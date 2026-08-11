import Image from "next/image";
import Link from "next/link";
import styles from "./SelectedHomePage.module.css";

const TOPICS = [
  {
    title: "Folk Songs & Rhymes",
    href: "/search?q=folk+songs+rhymes",
    icon: "/design-assets/homepage-v2/folk-songs-rhymes-drum-icon-v01.png",
    className: styles.folkCardBerry,
  },
  {
    title: "Folk Stories",
    href: "/search?q=folk+stories+storytelling",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
    className: styles.folkCardTeal,
  },
  {
    title: "Folk Instruments",
    href: "/search?q=folk+music+instruments",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png",
    className: styles.folkCardBlue,
  },
  {
    title: "Folk Dancing",
    href: "/search?q=folk+dancing+movement",
    icon: "/staff_and_students/mr-rusty-transparent-circle.png",
    className: styles.folkCardIndigo,
  },
] as const;

export function EarlyFolkMusicSection() {
  return (
    <section className={styles.folkMusic} aria-labelledby="folk-music-title">
      <h2 id="folk-music-title">Music and Folk Education</h2>
      <div className={styles.folkRail}>
        {TOPICS.map((topic) => (
          <Link className={`${styles.folkCard} ${topic.className}`} href={topic.href} key={topic.title}>
            <Image src={topic.icon} alt="" width={92} height={92} loading="eager" />
            <strong>{topic.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
