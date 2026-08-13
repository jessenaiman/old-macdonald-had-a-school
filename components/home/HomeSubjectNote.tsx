import Image from "next/image";
import Link from "next/link";
import styles from "./HomePage.module.css";

export type SubjectNoteShape = "torn" | "grid" | "deckled" | "ruled" | "scalloped" | "folded";

export type HomeSubjectNoteProps = {
  title: string;
  href: string;
  iconClass: string;
  teacherReason: string;
  highlights: readonly string[];
  color: `#${string}`;
  paperAsset: string;
  fastenerClass: string;
  noteShape: SubjectNoteShape;
  guideName?: string;
  guidePortrait?: string;
  rotation?: "left" | "none" | "right";
};

export function HomeSubjectNote({
  title,
  href,
  iconClass,
  teacherReason,
  highlights,
  color,
  paperAsset,
  fastenerClass,
  noteShape,
  guideName,
  guidePortrait,
  rotation = "none",
}: HomeSubjectNoteProps) {
  return (
    <article
      className={styles.subjectNote}
      data-note-shape={noteShape}
      data-rotation={rotation}
      style={{ "--subject-note-color": color, "--subject-note-paper": `url("${paperAsset}")` } as React.CSSProperties}
    >
      <span className={`${styles.subjectNoteFastener} brand-asset ${fastenerClass}`} aria-hidden="true" />
      <div className={styles.subjectNoteLink}>
        <span className={styles.subjectNoteTop}>
          <span className={`${styles.subjectNoteIcon} brand-asset ${iconClass}`} aria-hidden="true" />
          <span className={styles.subjectNoteTitle}>
            <span className={styles.subjectNoteEyebrow}>Teach through</span>
            <h3><Link href={href}>{title}</Link></h3>
          </span>
        </span>
        <span className={styles.subjectNoteReason}>{teacherReason}</span>
        <ul aria-label={`${title} learning areas`}>
          {highlights.map((highlight) => (
            <li key={highlight}>
              <Link href={`/search?q=${encodeURIComponent(`${title} ${highlight}`)}`}>{highlight}</Link>
            </li>
          ))}
        </ul>
        <span className={styles.subjectNoteBottom}>
          {guidePortrait && guideName ? (
            <span className={styles.subjectNoteGuide}>
              <Image src={guidePortrait} alt="" width={32} height={32} />
              <span>{guideName}</span>
            </span>
          ) : <span />}
          <Link href={href} className={styles.subjectNoteAction}>Explore lessons <span aria-hidden="true">→</span></Link>
        </span>
      </div>
    </article>
  );
}
