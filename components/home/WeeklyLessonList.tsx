import Link from "next/link";
import { FaEarListen, FaMicrophone, FaMusic, FaPersonWalking, FaWaveSquare } from "react-icons/fa6";
import { lessonHref } from "@/lib/grade-routes";
import legacyStyles from "./HomePage.module.css";
import selectedStyles from "./BulletinHomePage.module.css";

export type WeeklyLesson = {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  href?: string;
};

function gradeChips(grade: string) {
  const normalized = grade.toLowerCase();
  if (normalized.includes("all")) return ["All"];
  if (normalized.includes("daycare")) return ["D"];
  if (normalized.includes("pre")) return ["Pre-K"];
  if (normalized.includes("kindergarten")) return ["K"];
  if (normalized.includes("one") || normalized.includes("1")) return ["1"];
  if (normalized.includes("two") || normalized.includes("2")) return ["2"];
  return ["All"];
}

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
  const styles = selected ? selectedStyles : legacyStyles;
  return (
    <section className={`${styles.weeklyList} ${compact ? styles.weeklyListCompact : ""} ${participation ? styles.weeklyParticipation : ""} ${twoColumn ? styles.weeklyTwoColumn : ""}`} aria-label={title}>
      <header><h2>{title}</h2><span>Best for</span></header>
      <ul>
        {lessons.slice(0, limit).map((lesson) => (
          <li key={lesson.slug}>
            <FaMusic className={styles.noteIcon} aria-hidden="true" />
            <Link
              href={lesson.href ?? lessonHref(lesson)}
              target={lesson.href?.startsWith("https://") ? "_blank" : undefined}
              rel={lesson.href?.startsWith("https://") ? "noreferrer" : undefined}
            >
              {lesson.title}
            </Link>
            {participation ? (
              <span className={styles.participationWays} role="group" aria-label="Ways to join: listen, move, hum, or sing">
                <span><FaEarListen aria-hidden="true" />Listen</span>
                <span><FaPersonWalking aria-hidden="true" />Move</span>
                <span><FaWaveSquare aria-hidden="true" />Hum</span>
                <span><FaMicrophone aria-hidden="true" />Sing</span>
              </span>
            ) : <p>{lesson.summary}</p>}
            <span className={styles.gradeChips} role="img" aria-label={`Best for ${lesson.grade}`}>
              {gradeChips(lesson.grade).map((grade) => <b key={grade}>{grade}</b>)}
            </span>
            {selected ? <Link className={styles.lessonAction} href={lesson.href ?? lessonHref(lesson)}>Play lesson <span aria-hidden="true">→</span></Link> : null}
          </li>
        ))}
      </ul>
      <Link className={styles.weeklyMore} href="/lessons">See all lessons <span aria-hidden="true">→</span></Link>
    </section>
  );
}
