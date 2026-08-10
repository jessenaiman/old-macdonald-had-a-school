import Link from "next/link";
import type { CurriculumTopic } from "../../lib/lesson-model";
import { LessonPrintButton } from "./LessonPrintButton";

function available(value: string | null) {
  return value || "Not yet available";
}

export function DatabaseLessonDocument({ topic }: { topic: CurriculumTopic }) {
  return (
    <article className="lesson-article" data-source-type="database" data-completeness={topic.completeness}>
      <header className="lesson-header">
        <p className="lesson-eyebrow">Database planning draft</p>
        <p className="lesson-breadcrumb">{topic.grade} · {topic.subject}</p>
        <h1>{topic.title}</h1>
        <p className="lesson-summary">
          {topic.skillStatement || "This curriculum record is available as a planning starting point while its complete lesson is prepared."}
        </p>
        <div className="lesson-primary-actions">
          <LessonPrintButton />
          <Link className="lesson-resource-link" href={`/api/lessons/${topic.grade}/${topic.id}/markdown`}>
            Download Markdown
          </Link>
        </div>
        <dl className="lesson-meta">
          <div><dt>Subject</dt><dd>{topic.subject}</dd></div>
          <div><dt>Status</dt><dd>Planning draft</dd></div>
          <div><dt>Category</dt><dd>{available(topic.category)}</dd></div>
          <div><dt>Standards</dt><dd>{available(topic.standards)}</dd></div>
        </dl>
      </header>
      <div className="lesson-markdown lesson-document-content" id="lesson-plan">
        <h2>Curriculum focus</h2>
        <p>{available(topic.skillStatement)}</p>
        <h2>Teaching sequence</h2>
        <p>Not yet available. This record must not be presented as a complete lesson until a reviewed sequence is attached.</p>
        <h2>Materials and adaptations</h2>
        <p>{available(topic.linkedResources)}</p>
        <h2>Observation and assessment</h2>
        <p>Not yet available.</p>
        <h2>Tags and planning context</h2>
        <p>{topic.tags.length > 0 ? topic.tags.join(", ") : "Not yet available"}</p>
        {topic.supplementarySources.length > 0 ? (
          <>
            <h2>Supplementary source material</h2>
            <ul>
              {topic.supplementarySources.map((source) => (
                <li key={`${source.sourcePath}-${source.title}`}>
                  {source.url ? <a href={source.url}>{source.title}</a> : source.title}
                  {" — "}
                  <span>{source.kind}</span>
                </li>
              ))}
            </ul>
            <p>Linked sources are supporting material only; they do not establish grade alignment or lesson completeness.</p>
          </>
        ) : null}
      </div>
    </article>
  );
}
