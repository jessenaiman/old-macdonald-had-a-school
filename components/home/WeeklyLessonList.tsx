import Link from "next/link";
import { lessonHref } from "@/lib/grade-routes";

export type WeeklyLesson = {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  href?: string;
  icon?: string;
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
    <section className="overflow-hidden rounded-[inherit] text-foreground" aria-label={title} data-compact={compact || undefined} data-participation={participation || undefined} data-two-column={twoColumn || undefined}>
      <header className="flex min-h-11 items-center justify-between gap-4 border-b border-border px-4 py-2"><h2 className="font-hand text-2xl text-destructive">{title}</h2><Link className="text-xs font-bold text-muted-foreground underline underline-offset-4" href="/lessons">See all lessons <span aria-hidden="true">→</span></Link></header>
      <ul className={twoColumn ? "grid list-none md:grid-cols-2" : "grid list-none"}>
        {lessons.slice(0, limit).map((lesson) => (
          <li className="grid min-h-16 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 border-b border-border px-4 py-2 last:border-b-0" key={lesson.slug}>
            <span className={`brand-asset ${lesson.icon ?? "music-icon"} icon-micro row-span-2 text-destructive`} aria-hidden="true" />
            <Link
              className="min-w-0 text-sm font-extrabold leading-tight"
              href={lesson.href ?? lessonHref(lesson)}
              target={lesson.href?.startsWith("https://") ? "_blank" : undefined}
              rel={lesson.href?.startsWith("https://") ? "noreferrer" : undefined}
            >
              {lesson.title}
            </Link>
            {participation && !lesson.summary ? (
              <span className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground" role="group" aria-label="Ways to join: listen, move, hum, or sing">
                <span>Listen</span>
                <span>Move</span>
                <span>Hum</span>
                <span>Sing</span>
              </span>
            ) : <p className="col-start-2 text-xs leading-snug">{lesson.summary}</p>}
            {selected ? null : <Link className="sr-only" href={lesson.href ?? lessonHref(lesson)}>Play lesson <span aria-hidden="true">→</span></Link>}
          </li>
        ))}
      </ul>
    </section>
  );
}
