import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../../components/SiteShell";
import { getAllLessons } from "../../lib/content/lessons";

export const metadata: Metadata = {
  title: "Lessons | Old MacDonald Had a School",
  description: "Browse canonical music and video-first lessons from Old MacDonald Had a School.",
};

export default function LessonsIndexPage() {
  const lessons = getAllLessons();

  return (
    <SiteShell active="topics">
      <section className="lessons-index" aria-labelledby="lessons-index-title">
        <header className="lessons-index-header">
          <p className="lesson-eyebrow">Canonical lesson library</p>
          <h1 id="lessons-index-title">Lessons</h1>
          <p>Start with a song or a video-first resource, then move through the supports that belong to that lesson.</p>
        </header>
        <section className="lessons-index-grid" aria-label="Available lessons">
          {lessons.map((lesson) => (
            <article className="lesson-index-card" data-template={lesson.metadata.template} key={lesson.metadata.slug}>
              <p className="lesson-card-template">{lesson.metadata.template} lesson</p>
              <h2><Link href={`/lessons/${lesson.metadata.slug}`}>{lesson.metadata.title}</Link></h2>
              <p>{lesson.metadata.summary}</p>
              <dl className="lesson-card-meta">
                <div><dt>Subject</dt><dd>{lesson.metadata.subject}</dd></div>
                <div><dt>Band</dt><dd>{lesson.metadata.gradeBand}</dd></div>
              </dl>
              <Link className="lesson-card-link" href={`/lessons/${lesson.metadata.slug}`}>Open lesson <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </section>
      </section>
    </SiteShell>
  );
}
