"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { CLUSTERS, clusterFor } from "../../components/SubjectDiscovery";
import { lessonHref } from "../../lib/grade-routes";
import type { LessonMetadata } from "../../lib/content";

function matchesGrade(gradeLabel: string, grade: string) {
  if (grade === "grade-one") return /1/.test(gradeLabel);
  if (grade === "grade-two") return /2/.test(gradeLabel);
  return true;
}

export default function TopicsClient({ lessons }: { lessons: LessonMetadata[] }) {
  const params = useSearchParams();
  const grade = params.get("grade") ?? undefined;
  const cluster = params.get("cluster") ?? undefined;
  const filtered = lessons
    .filter((lesson) => !grade || matchesGrade(lesson.grade, grade))
    .filter((lesson) => !cluster || clusterFor(lesson.subject) === cluster);
  const clusterInfo = cluster ? CLUSTERS.find((item) => item.key === cluster) : undefined;

  return (
    <div className="w-full py-[clamp(1.5rem,4vw,3.5rem)] pb-16 max-sm:pt-4">
      <header className="material-surface material-cardboard-paper relative mx-auto mb-8 max-w-[840px] rounded-xl border border-border p-[clamp(1.75rem,4vw,3rem)] text-center shadow-[5px_7px_0_color-mix(in_srgb,var(--border)_75%,transparent)] max-sm:px-5 max-sm:pb-6 max-sm:pt-8">
        <span className="brand-asset fastener-push-pin icon-medium absolute -top-5 left-1/2 -translate-x-1/2" aria-hidden="true" />
        <div className="font-body text-[.68rem] font-black leading-none tracking-[.12em] text-primary uppercase">Curriculum-organized starting points</div>
        <h1 className="my-3 font-heading text-[clamp(2.5rem,6vw,4rem)] font-normal leading-[.95] text-balance text-foreground max-sm:text-[clamp(2.25rem,12vw,3.25rem)]">Browse lesson topics</h1>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted-foreground">Each page gives you a complete teaching sequence, one curated starting resource, and targeted searches when you need a different option.</p>
        {(grade || clusterInfo) && (
          <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
            Showing {clusterInfo ? clusterInfo.title : "all subjects"}{grade ? ` · ${grade === "grade-one" ? "Grade 1" : "Grade 2"}` : ""}
            {" — "}<Link className="font-black text-primary" href="/topics">clear filter</Link>
          </p>
        )}
      </header>
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-sm:gap-3" aria-label="Lesson topics">
        {filtered.map((lesson) => (
          <Card className="material-surface material-cardboard-paper min-h-60 gap-0 p-0 shadow-[4px_6px_0_color-mix(in_srgb,var(--border)_75%,transparent)] [contain-intrinsic-size:auto_240px] [content-visibility:auto] print:[contain-intrinsic-size:none] print:[content-visibility:visible] max-sm:min-h-0" key={lesson.slug}>
            <Link className="flex min-h-full flex-1 flex-col p-6 max-sm:p-5" href={lessonHref(lesson)}>
              <CardHeader className="p-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-muted-foreground"><span>{lesson.subject}</span><strong>{lesson.category}</strong></div>
                <CardTitle className="font-heading text-3xl font-normal leading-none text-balance">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-3 leading-6 text-muted-foreground">{lesson.summary}</CardContent>
              <CardFooter className="mt-auto flex justify-between gap-3 border-t border-border p-0 pt-4 text-xs font-extrabold text-primary"><span>{lesson.grade}</span><strong className="whitespace-nowrap">Open lesson →</strong></CardFooter>
            </Link>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Empty className="col-span-full border">
            <EmptyHeader><EmptyTitle>No matching topics</EmptyTitle><EmptyDescription>No topics match this filter yet.</EmptyDescription></EmptyHeader>
          </Empty>
        )}
      </section>
    </div>
  );
}
