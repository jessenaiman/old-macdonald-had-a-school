import Link from "next/link";
import { lessonHref } from "@/lib/grade-routes";
import styles from "./HomePage.module.css";

export type WeeklyLesson = {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  href?: string;
};

export function WeeklyLessonList({
  lessons,
  title,
  compact = false,
  participation = false,
  limit = 3,
  twoColumn = false,
  selected = false,
}: {
  lessons: readonly WeeklyLesson[];
  title: string;
  compact?: boolean;
  participation?: boolean;
  limit?: number;
  twoColumn?: boolean;
  selected?: boolean;
}) {
  return (
    <section className={`${styles.weeklyList} ${compact ? styles.weeklyListCompact : ""} ${participation ? styles.weeklyParticipation : ""} ${twoColumn ? styles.weeklyTwoColumn : ""}`} aria-label={title}>
      <header><h2>{title}</h2><Link href="/lessons">See all lessons <span aria-hidden="true">→</span></Link></header>
      <ul>
        {lessons.slice(0, limit).map((lesson) => (
          <li key={lesson.slug}>
            <span className={`${styles.noteIcon} brand-asset music-icon icon-micro`} aria-hidden="true" />
            <Link
              href={lesson.href ?? lessonHref(lesson)}
              target={lesson.href?.startsWith("https://") ? "_blank" : undefined}
              rel={lesson.href?.startsWith("https://") ? "noreferrer" : undefined}
            >
              {lesson.title}
            </Link>
            {participation && !lesson.summary ? (
              <span className={styles.participationWays} role="group" aria-label="Ways to join: listen, move, hum, or sing">
                <span>Listen</span>
                <span>Move</span>
                <span>Hum</span>
                <span>Sing</span>
              </span>
            ) : <p>{lesson.summary}</p>}
            {selected ? null : <Link className={styles.lessonAction} href={lesson.href ?? lessonHref(lesson)}>Play lesson <span aria-hidden="true">-&gt;</span></Link>}
          </li>
        ))}
      </ul>
    </section>
  );
}
