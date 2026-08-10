import type { ComponentType } from "react";
import type { LessonMetadata } from "../lib/content";
import { LessonPrintActions } from "./planning/LessonPrintActions";

export function LessonDocument({ Content, metadata }: { Content: ComponentType; metadata: LessonMetadata }) {
  const externalResource = metadata.externalResource || metadata.practiceResource?.match(/https?:\/\/\S+/)?.[0];

  return (
    <article className="lesson-article lesson-document" data-template={metadata.template}>
      <header className="lesson-header">
        <p className="lesson-eyebrow">{metadata.template === "lesson" ? "Lesson plan" : `${metadata.template} lesson`}</p>
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
          {metadata.standards ? <div><dt>Curriculum</dt><dd>{metadata.standards}</dd></div> : null}
          {metadata.recommendedSource ? <div><dt>Source</dt><dd>{metadata.recommendedSource}</dd></div> : null}
        </dl>
      </header>
      <div className="lesson-markdown lesson-document-content" id="lesson-plan">
        <Content />
      </div>
    </article>
  );
}
