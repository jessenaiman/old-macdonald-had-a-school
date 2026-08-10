import Link from "next/link";
import styles from "./HomePage.module.css";

export type WeeklyLesson = { slug: string; title: string; summary: string; grade: string };

function gradeChips(grade: string) {
  const normalized = grade.toLowerCase();
  if (normalized.includes("daycare")) return ["D"];
  if (normalized.includes("pre")) return ["Pre-K"];
  if (normalized.includes("kindergarten")) return ["K"];
  if (normalized.includes("one") || normalized.includes("1")) return ["1"];
  if (normalized.includes("two") || normalized.includes("2")) return ["2"];
  return ["All"];
}

export function WeeklyLessonList({ lessons, title, compact = false }: { lessons: WeeklyLesson[]; title: string; compact?: boolean }) {
  return (
    <section className={`${styles.weeklyList} ${compact ? styles.weeklyListCompact : ""}`} aria-label={title}>
      <header><h2>{title}</h2><span>Best for</span></header>
      <ul>
        {lessons.slice(0, 3).map((lesson) => (
          <li key={lesson.slug}>
            <span className={styles.noteIcon} aria-hidden="true">♪</span>
            <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
            <p>{lesson.summary}</p>
            <span className={styles.gradeChips} aria-label={`Best for ${lesson.grade}`}>{gradeChips(lesson.grade).map((grade) => <b key={grade}>{grade}</b>)}</span>
          </li>
        ))}
      </ul>
      <Link className={styles.weeklyMore} href="/lessons">See all new lessons <span aria-hidden="true">→</span></Link>
    </section>
  );
}
