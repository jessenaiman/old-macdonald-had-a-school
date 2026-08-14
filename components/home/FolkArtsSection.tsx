import Link from "next/link";
import styles from "./HomePage.module.css";

const FOLK_ARTS_LINKS = [
  { title: "Folk Songs & Rhymes", href: "/songs?type=Folk", icon: "music-hand-drum", tone: "red" },
  { title: "Folk Stories", href: "/search?q=folk%20stories", icon: "acting-pocket-puppets", tone: "green" },
  { title: "Folk Instruments", href: "/search?q=folk%20instruments", icon: "music-fiddle", tone: "blue" },
  { title: "Folk Dancing", href: "/search?q=folk%20dancing", icon: "dance-turning-footprints", tone: "purple" },
] as const;

export function FolkArtsSection() {
  return (
    <section className={`${styles.folkArts} material-surface material-cardboard-paper`} aria-labelledby="folk-arts-title">
      <span className={`${styles.folkArtsFastener} brand-asset fastener-masking-tape`} aria-hidden="true" />
      <h2 id="folk-arts-title">Music and Folk Arts Education</h2>
      <div className={`${styles.folkArtsGrid} grid-cols-1 md:grid-cols-2 xl:grid-cols-4`}>
        {FOLK_ARTS_LINKS.map((item) => (
          <Link key={item.title} href={item.href} className={styles.folkArtsCard} data-tone={item.tone}>
            <span className={`${styles.folkArtsIcon} brand-asset ${item.icon}`} aria-hidden="true" />
            <strong>{item.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
