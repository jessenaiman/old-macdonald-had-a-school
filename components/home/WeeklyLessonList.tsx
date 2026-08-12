import Link from "next/link";
import Image from "next/image";
import { lessonHref } from "@/lib/grade-routes";
import { globalClassNames as legacyStyles } from "@/lib/global-class-names";
import { globalClassNames as selectedStyles } from "@/lib/global-class-names";

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
  const chips: string[] = [];
  if (normalized.includes("daycare")) chips.push("D");
  if (normalized.includes("pre")) chips.push("Pre-K");
  if (normalized.includes("kindergarten")) chips.push("K");
  if (normalized.includes("one") || normalized.includes("1")) chips.push("1");
  if (normalized.includes("two") || normalized.includes("2")) chips.push("2");
  return chips.length ? chips : ["All"];
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
            <Image className={styles.noteIcon} src="/brand-kit-icon-sheets/individual-icons/subject-music-dance.png" alt="" width={24} height={24} />
            <Link
              href={lesson.href ?? lessonHref(lesson)}
              target={lesson.href?.startsWith("https://") ? "_blank" : undefined}
              rel={lesson.href?.startsWith("https://") ? "noreferrer" : undefined}
            >
              {lesson.title}
            </Link>
            {participation ? (
              <span className={styles.participationWays} role="group" aria-label="Ways to join: listen, move, hum, or sing">
                <span>Listen</span>
                <span>Move</span>
                <span>Hum</span>
                <span>Sing</span>
              </span>
            ) : <p>{lesson.summary}</p>}
            <span className={styles.gradeChips} role="group" aria-label={`Best for ${lesson.grade}`}>
              {gradeChips(lesson.grade).map((grade) => <b key={grade}>{grade}</b>)}
            </span>
            {selected ? null : <Link className={styles.lessonAction} href={lesson.href ?? lessonHref(lesson)}>Play lesson <span aria-hidden="true">-&gt;</span></Link>}
          </li>
        ))}
      </ul>
      <Link className={styles.weeklyMore} href="/lessons">See all lessons <span aria-hidden="true">-&gt;</span></Link>
    </section>
  );
}
