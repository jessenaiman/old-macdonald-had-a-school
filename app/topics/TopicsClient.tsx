"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
    .filter((l) => !cluster || clusterFor(l.subject) === cluster);
  const clusterInfo = cluster ? CLUSTERS.find((c) => c.key === cluster) : undefined;

  return (
    <>
      <header className="listing-header">
        <div className="breadcrumb">Curriculum-organized starting points</div>
        <h1>Browse lesson topics</h1>
        <p>Each page gives you a complete teaching sequence, one curated starting resource, and targeted searches when you need a different option.</p>
        {(grade || clusterInfo) && (
          <p className="listing-filter-note">
            Showing {clusterInfo ? clusterInfo.title : "all subjects"}{grade ? ` · ${grade === "grade-one" ? "Grade 1" : "Grade 2"}` : ""}
            {" — "}<Link href="/topics">clear filter</Link>
          </p>
        )}
      </header>
      <section className="topic-list" aria-label="Lesson topics">
        {filtered.map((lesson) => (
          <Link
            href={lessonHref(lesson)}
            className="topic-list-card stitch [content-visibility:auto] [contain-intrinsic-size:auto_240px] print:[content-visibility:visible] print:[contain-intrinsic-size:none]"
            key={lesson.slug}
          >
            <div><span>{lesson.subject}</span><strong>{lesson.category}</strong></div>
            <h2>{lesson.title}</h2>
            <p>{lesson.summary}</p>
            <div className="topic-list-action">{lesson.grade}<strong>Open lesson →</strong></div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="listing-empty">No topics match this filter yet.</p>
        )}
      </section>
    </>
  );
}
