import type { ComponentType } from "react";
import type { LessonMetadata } from "../lib/content";
import { LessonPrintActions } from "./planning/LessonPrintActions";

export function LessonDocument({ Content, metadata }: { Content: ComponentType; metadata: LessonMetadata }) {
  const externalResource = metadata.externalResource || metadata.practiceResource?.match(/https?:\/\/\S+/)?.[0];
  const hasProvenance = Boolean(metadata.standards || metadata.sourceReference || metadata.recommendedSource);
  const isWorksheet = metadata.template === "worksheet" || metadata.slug === "worksheet-example";

  return (
    <article className="lesson-article lesson-document" data-template={metadata.template} data-planning-layout={isWorksheet ? "worksheet" : undefined}>
      <header className="lesson-header">
        <p className="lesson-eyebrow">{isWorksheet ? "Ready-to-use teacher activity" : metadata.template === "lesson" ? "Lesson plan" : `${metadata.template} lesson`}</p>
        <p className="lesson-breadcrumb">{metadata.grade} <span aria-hidden="true">·</span> {metadata.subject} <span aria-hidden="true">·</span> {metadata.category}</p>
        <h1>{metadata.title}</h1>
        <p className="lesson-summary">{metadata.summary}</p>
        <div className="lesson-primary-actions">
          <LessonPrintActions />
          {externalResource ? <a className="lesson-resource-link" href={externalResource} target="_blank" rel="noreferrer">Open teaching resource</a> : null}
        </div>
        <dl className="lesson-meta">
          <div><dt>Focus</dt><dd>{metadata.focus}</dd></div>
          {metadata.timeEstimate ? <div><dt>Time</dt><dd>{metadata.timeEstimate}</dd></div> : null}
        </dl>
        {isWorksheet ? (
          <ol className="lesson-planning-strip" aria-label="Teaching workflow">
            <li><span>1</span><div><strong>Prepare</strong><small>Choose materials and participation options.</small></div></li>
            <li><span>2</span><div><strong>Teach</strong><small>Follow the short, repeatable sequence.</small></div></li>
            <li><span>3</span><div><strong>Notice</strong><small>Record one useful observation for next time.</small></div></li>
          </ol>
        ) : null}
      </header>
      <div className="lesson-markdown lesson-document-content" id="lesson-plan">
        <Content />
      </div>
      {hasProvenance ? (
        <aside className="lesson-provenance" aria-label="Curriculum alignment and source notes">
          <details>
            <summary><span>Curriculum alignment &amp; source notes</span><small>Verified planning provenance</small></summary>
            <dl>
              {metadata.standards ? <div><dt>Standards</dt><dd>{metadata.standards}</dd></div> : null}
              {metadata.recommendedSource ? <div><dt>Recommended source</dt><dd>{metadata.recommendedSource}</dd></div> : null}
              {metadata.sourceReference ? <div><dt>Record provenance</dt><dd>{metadata.sourceReference}</dd></div> : null}
            </dl>
          </details>
        </aside>
      ) : null}
    </article>
  );
}
