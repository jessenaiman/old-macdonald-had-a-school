import Link from "next/link";
import { CLUSTERS, clusterFor } from "./SubjectDiscovery";
import { CharacterBadge } from "./CharacterBadge";
import { lessonHref } from "../lib/grade-routes";

export type GradeLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  grade: string;
  ready: boolean;
  hasPrintables: boolean;
  hasVideo: boolean;
  lead?: {
    key: string;
    name: string;
  };
};

function ClusterIcon({ clusterKey }: { clusterKey: string }) {
  const cluster = CLUSTERS.find((c) => c.key === clusterKey);
  return cluster?.icon ?? null;
}

// Presentational only — the active-subject filter state lives in
// GradeDirectoryPage (shared with the sidebar Subjects list), so this just
// renders whichever lessons it's handed.
export function GradeLessonGrid({ lessons }: { lessons: GradeLesson[] }) {
  return (
    <div className="gb-cards">
      {lessons.map((lesson) => {
        const clusterKey = clusterFor(lesson.subject);
        const cluster = CLUSTERS.find((c) => c.key === clusterKey);
        const tags: string[] = [];
        if (lesson.hasVideo) tags.push("Video");
        if (lesson.hasPrintables) tags.push("Printable");
        if (lesson.ready) tags.push("5 steps");

        return (
          <article className={`gb-card stitch tone-${clusterKey}`} key={lesson.slug}>
            <div className="gb-card-top">
              <ClusterIcon clusterKey={clusterKey} />
              {!lesson.ready && <span className="gb-card-badge">Coming soon</span>}
            </div>
            <div className="gb-card-body">
              <span className="gb-card-subject">{cluster?.title ?? lesson.subject}</span>
              <h3 className="gb-card-title">{lesson.title}</h3>
              {lesson.lead ? (
                <div className="gb-card-teacher">
                  <CharacterBadge charKey={lesson.lead.key} color="var(--navy)" name={lesson.lead.name} size={24} />
                  <span>{lesson.lead.name}</span>
                </div>
              ) : null}
              {tags.length > 0 && (
                <div className="gb-card-tags">
                  {tags.map((t) => <span key={t} className="gb-tag">{t}</span>)}
                </div>
              )}
              {lesson.ready ? (
                <Link className="gb-card-action ready" href={lessonHref(lesson)}>
                  Open lesson →
                </Link>
              ) : (
                <span className="gb-card-action coming-soon">In the works 🌱</span>
              )}
            </div>
          </article>
        );
      })}
      {lessons.length === 0 && (
        <p className="gb-empty">No lessons match this filter yet.</p>
      )}
    </div>
  );
}
