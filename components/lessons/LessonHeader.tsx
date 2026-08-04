import type { LessonEntry } from "../../lib/content/lessons";
import { LessonPrintActions } from "../planning/LessonPrintActions";

export function LessonHeader({ lesson, templateLabel }: { lesson: LessonEntry; templateLabel: string }) {
  const { metadata } = lesson;
  return (
    <header className="lesson-header">
      <p className="lesson-eyebrow">{templateLabel} lesson</p>
      <p className="lesson-breadcrumb">
        {metadata.gradeBand} <span aria-hidden="true">·</span> {metadata.subject} <span aria-hidden="true">·</span> {metadata.category}
      </p>
      <h1>{metadata.title}</h1>
      <p className="lesson-summary">{metadata.summary}</p>
      <LessonPrintActions />
      <dl className="lesson-meta">
        <div>
          <dt>Focus</dt>
          <dd>{metadata.focus}</dd>
        </div>
        {metadata.timeEstimate ? (
          <div>
            <dt>Time</dt>
            <dd>{metadata.timeEstimate}</dd>
          </div>
        ) : null}
        {metadata.standardUS || metadata.standardOntario ? (
          <div>
            <dt>Standards</dt>
            <dd>{[metadata.standardUS, metadata.standardOntario].filter(Boolean).join(" · ")}</dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
