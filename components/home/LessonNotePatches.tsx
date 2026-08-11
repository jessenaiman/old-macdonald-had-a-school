import Image from "next/image";
import Link from "next/link";
import { lessonHref } from "@/lib/grade-routes";
import type { HomeLesson } from "./home-data";
import styles from "./HomePage.module.css";

const NOTE_TEXTURES = [
  "/design-assets/web-material-library-v1/felt/felt-04-miss-hayley-tile.png",
  "/design-assets/web-material-library-v1/felt/felt-05-mr-sam-tile.png",
  "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png",
] as const;

export function LessonNotePatches({ lessons }: { lessons: HomeLesson[] }) {
  return (
    <section className={styles.lessonNotes} aria-labelledby="lesson-notes-title">
      <header>
        <p>Fresh from the planning board</p>
        <h2 id="lesson-notes-title">Three notes for your week</h2>
      </header>
      <div className={styles.lessonNoteGrid}>
        {lessons.slice(0, 3).map((lesson, index) => (
          <article className={styles.lessonNote} style={{ "--note-texture": `url(${NOTE_TEXTURES[index]})` } as React.CSSProperties} key={lesson.slug}>
            <Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={38} height={38} />
            <p>{lesson.grade}</p>
            <h3>{lesson.title}</h3>
            <span>{lesson.summary}</span>
            <Link href={lessonHref(lesson)}>Open lesson <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
