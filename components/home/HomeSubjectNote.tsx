import Link from "next/link";
import styles from "./HomePage.module.css";

export type HomeSubjectNoteProps = {
  title: string;
  href: string;
  iconClass: string;
  highlights: readonly string[];
  color: `#${string}`;
  paperAsset: string;
  fastenerClass: string;
  rotation?: "left" | "none" | "right";
};

export function HomeSubjectNote({
  title,
  href,
  iconClass,
  highlights,
  color,
  paperAsset,
  fastenerClass,
  rotation = "none",
}: HomeSubjectNoteProps) {
  return (
    <article
      className={styles.subjectNote}
      data-rotation={rotation}
      style={{ "--subject-note-color": color, "--subject-note-paper": `url("${paperAsset}")` } as React.CSSProperties}
    >
      <span className={`${styles.subjectNoteFastener} brand-asset ${fastenerClass}`} aria-hidden="true" />
      <Link href={href} className={styles.subjectNoteLink}>
        <span className={`${styles.subjectNoteIcon} brand-asset ${iconClass}`} aria-hidden="true" />
        <h3>{title}</h3>
        <ul aria-label={`${title} learning areas`}>
          {highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
        <span className={styles.subjectNoteAction}>Explore lessons <span aria-hidden="true">→</span></span>
      </Link>
    </article>
  );
}
