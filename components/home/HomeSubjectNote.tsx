import Image from "next/image";
import Link from "next/link";
import { CAST } from "@/lib/cast";
import styles from "./HomePage.module.css";

export type SubjectNoteShape = "torn" | "grid" | "deckled" | "ruled" | "scalloped" | "folded";

export type HomeSubjectNoteProps = {
  subject: "language" | "math" | "science" | "music" | "arts" | "health";
  title: string;
  href: string;
  iconClass: string;
  teacherReason: string;
  highlights: readonly string[];
  fastenerClass: string;
  noteShape: SubjectNoteShape;
  guideCharacter?: "whiskers" | "sam" | "scout" | "penny" | "puddles" | "hopper";
  rotation?: "left" | "none" | "right";
};

export function HomeSubjectNote({
  subject,
  title,
  href,
  iconClass,
  teacherReason,
  highlights,
  fastenerClass,
  noteShape,
  guideCharacter,
  rotation = "none",
}: HomeSubjectNoteProps) {
  const guide = guideCharacter ? CAST[guideCharacter] : undefined;
  return (
    <article
      className={styles.subjectNote}
      data-subject={subject}
      data-note-shape={noteShape}
      data-rotation={rotation}
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
          {guide ? (
            <span className={styles.subjectNoteGuide}>
              <Image src={guide.portrait} alt="" width={32} height={32} />
              <span>{guide.name}</span>
            </span>
          ) : <span />}
          <Link href={href} className={styles.subjectNoteAction}>Explore lessons <span aria-hidden="true">→</span></Link>
        </span>
      </div>
    </article>
  );
}
