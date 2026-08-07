import Link from "next/link";
import { SiteShell } from "../../components/SiteShell";
import { CLUSTERS, clusterFor } from "../../components/SubjectDiscovery";
import { getAllLessons } from "../../lib/content";

function matchesBand(gradeBand: string, band: string) {
  if (band === "grade-one") return /1/.test(gradeBand);
  if (band === "grade-two") return /2/.test(gradeBand);
  return true;
}

export default async function TopicsPage({ searchParams }: { searchParams: Promise<{ band?: string; cluster?: string }> }) {
  const { band, cluster } = await searchParams;
  const lessons = (await getAllLessons())
    .filter((l) => !band || matchesBand(l.metadata.gradeBand, band))
    .filter((l) => !cluster || clusterFor(l.metadata.subject) === cluster);
  const clusterInfo = cluster ? CLUSTERS.find((c) => c.key === cluster) : undefined;

  return (
    <SiteShell active="topics">
      <header className="listing-header">
        <div className="breadcrumb">Curriculum-organized starting points</div>
        <h1>Browse lesson topics</h1>
        <p>Each page gives you a complete teaching sequence, one curated starting resource, and targeted searches when you need a different option.</p>
        {(band || clusterInfo) && (
          <p className="listing-filter-note">
            Showing {clusterInfo ? clusterInfo.title : "all subjects"}{band ? ` · ${band === "grade-one" ? "Grade 1" : "Grade 2"}` : ""}
            {" — "}<Link href="/topics">clear filter</Link>
          </p>
        )}
      </header>
      <section className="topic-list">
        {lessons.map((lesson) => (
          <Link href={`/topics/${lesson.metadata.slug}`} className="topic-list-card stitch" key={lesson.metadata.slug}>
            <div><span>{lesson.metadata.subject}</span><strong>{lesson.metadata.category}</strong></div>
            <h2>{lesson.metadata.title}</h2>
            <p>{lesson.metadata.summary}</p>
            <div className="topic-list-action">{lesson.metadata.gradeBand}<strong>Open lesson →</strong></div>
          </Link>
        ))}
        {lessons.length === 0 && (
          <p className="listing-empty">No topics match this filter yet.</p>
        )}
      </section>
    </SiteShell>
  );
}
