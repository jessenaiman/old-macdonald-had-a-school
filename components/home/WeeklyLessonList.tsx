import Link from "next/link";
import { lessonHref } from "@/lib/grade-routes";
import { cn } from "@/lib/utils";

export type WeeklyLesson = { slug: string; title: string; summary: string; grade: string; href?: string; icon?: string };

export function WeeklyLessonList({ lessons, title, limit = 3 }: { lessons: readonly WeeklyLesson[]; title: string; compact?: boolean; participation?: boolean; limit?: number; twoColumn?: boolean; selected?: boolean }) {
  return (
    <section className="overflow-hidden border-t border-border" aria-label={title}>
      <header className="flex min-h-10 items-center justify-between gap-4 px-4 py-1">
        <h2 className="font-hand text-2xl">{title}</h2>
        <Link className="text-xs font-bold text-muted-foreground underline underline-offset-4" href="/lessons">See all <span aria-hidden="true">→</span></Link>
      </header>
      <ul className="grid list-none">
        {lessons.slice(0, limit).map((lesson) => {
          const href = lesson.href ?? lessonHref(lesson);
            const external = lesson.href?.startsWith("https://");
          return (
            <li className="grid min-h-14 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-3 border-t border-border px-4 py-2" key={lesson.slug}>
              <span className={cn("brand-asset", "icon-micro", "row-span-2", lesson.icon ?? "music-icon")} aria-hidden="true" />
              <Link className="min-w-0 text-sm font-extrabold leading-tight" href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{lesson.title}</Link>
              <p className="col-start-2 text-xs leading-snug text-muted-foreground">{lesson.summary}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
