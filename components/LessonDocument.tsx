import type { ComponentType } from "react";
import type { LessonMetadata } from "../lib/content";
import { LessonPrintActions } from "./planning/LessonPrintActions";

export function LessonDocument({ Content, metadata }: { Content: ComponentType; metadata: LessonMetadata }) {
  return (
    <article className="lesson-article lesson-document" data-template={metadata.template}>
      <header className="lesson-header">
        <p className="lesson-eyebrow">{metadata.template === "lesson" ? "Lesson plan" : `${metadata.template} lesson`}</p>
        <p className="lesson-breadcrumb">{metadata.gradeBand} <span aria-hidden="true">·</span> {metadata.subject} <span aria-hidden="true">·</span> {metadata.category}</p>
        <h1>{metadata.title}</h1>
        <p className="lesson-summary">{metadata.summary}</p>
        <LessonPrintActions />
        <dl className="lesson-meta">
          <div><dt>Focus</dt><dd>{metadata.focus}</dd></div>
          {metadata.timeEstimate ? <div><dt>Time</dt><dd>{metadata.timeEstimate}</dd></div> : null}
        </dl>
      </header>
      <div className="lesson-markdown lesson-document-content">
        <Content />
      </div>
    </article>
  );
}
