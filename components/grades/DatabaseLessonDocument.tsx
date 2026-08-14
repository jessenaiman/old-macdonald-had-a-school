import Link from "next/link";
import type { CurriculumTopic } from "../../lib/lesson-model";
import type { CurriculumLesson } from "../../lib/curriculum-lesson";
import { LessonPrintButton } from "./LessonPrintButton";
import { Button } from "@/components/ui/button";

function available(value: string | null) {
  return value || "Not yet available";
}

export function DatabaseLessonDocument({
  topic,
  curriculumLesson,
}: {
  topic: CurriculumTopic;
  curriculumLesson: CurriculumLesson | null;
}) {
  const materials =
    curriculumLesson?.materials.filter((material) => material.title) ?? [];
  const focusMaterials = materials.filter(
    (material) => material.role === "focus",
  );
  const supportingMaterials = materials.filter(
    (material) => material.role === "supporting",
  );
  const assets = curriculumLesson?.assets ?? [];

  return (
    <article
      className="lesson-article"
      data-source-type="database"
      data-completeness={topic.completeness}
    >
      <header className="lesson-header flex min-w-0 flex-col gap-3 border-b pb-6">
        <p className="lesson-eyebrow text-xs font-black uppercase tracking-widest text-muted-foreground">Curriculum lesson outline</p>
        <p className="lesson-breadcrumb text-sm text-muted-foreground">
          {topic.grade} · {topic.subject}
        </p>
        <h1 className="max-w-4xl text-balance font-heading text-4xl leading-none sm:text-5xl lg:text-6xl">{topic.title}</h1>
        <p className="lesson-summary max-w-3xl text-muted-foreground">
          {topic.skillStatement ||
            "This curriculum record is available as a planning starting point while its complete lesson is prepared."}
        </p>
        <div className="lesson-primary-actions flex flex-wrap gap-3 print:hidden">
          <LessonPrintButton />
          <Button asChild variant="outline"><Link
            className="lesson-resource-link"
            href={`/api/lessons/${topic.grade}/${topic.id}/markdown`}
          >
            Download Markdown
          </Link></Button>
        </div>
        <dl className="lesson-meta grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <dt>Subject</dt>
            <dd>{topic.subject}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt>Status</dt>
            <dd>
              {topic.completeness === "complete"
                ? "Reviewed lesson"
                : "Database-led outline"}
            </dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt>Category</dt>
            <dd>{available(topic.category)}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt>Standards</dt>
            <dd>{available(topic.standards)}</dd>
          </div>
        </dl>
      </header>
      <div
        className="lesson-markdown lesson-document-content prose prose-lg mt-6 max-w-none font-body leading-7 prose-headings:font-heading prose-headings:text-balance"
        id="lesson-plan"
      >
        <h2>Curriculum focus</h2>
        <p>{available(topic.skillStatement)}</p>
        <h2>Teaching sequence</h2>
        {focusMaterials.length > 0 ? (
          <ol>
            {focusMaterials.map((material) => (
              <li key={`${material.kind}-${material.id}`}>
                <strong>{material.title}</strong>
                {material.useInPhase ? ` during ${material.useInPhase}` : ""}
                {material.routineSlot ? ` as ${material.routineSlot}` : ""}
                {material.teacherRationale
                  ? `: ${material.teacherRationale}`
                  : "."}
              </li>
            ))}
          </ol>
        ) : (
          <p>
            No focus material is linked yet. Use the curriculum focus above as
            the planning starting point; this outline does not claim a complete
            sequence.
          </p>
        )}
        <h2>Materials and teacher options</h2>
        {materials.length > 0 ? (
          <ul>
            {materials.map((material) => (
              <li key={`${material.kind}-${material.id}`}>
                {material.url ? (
                  <a href={material.url}>{material.title}</a>
                ) : (
                  material.title
                )}
                {material.kind === "song" && material.actions
                  ? ` - actions: ${material.actions}`
                  : ""}
                {material.role === "supporting" && material.teacherRationale
                  ? ` - ${material.teacherRationale}`
                  : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>{available(topic.linkedResources)}</p>
        )}
        {assets.length > 0 ? (
          <>
            <h2>Printable resources</h2>
            <ul>
              {assets.map((asset) => (
                <li key={asset.id}>
                  {asset.filePath ? (
                    <a href={asset.filePath}>{asset.title}</a>
                  ) : (
                    asset.title
                  )}
                  {asset.format ? ` (${asset.format.toUpperCase()})` : ""}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <h2>Observation and assessment</h2>
        <p>
          {topic.skillStatement
            ? `Observe evidence of: ${topic.skillStatement}`
            : "Not yet available."}
        </p>
        <h2>Tags and planning context</h2>
        <p>
          {topic.tags.length > 0 ? topic.tags.join(", ") : "Not yet available"}
        </p>
        {supportingMaterials.length > 0 ? (
          <>
            <h2>Optional supporting materials</h2>
            <p>
              {supportingMaterials.map((material) => material.title).join(", ")}
            </p>
          </>
        ) : null}
        {topic.supplementarySources.length > 0 ? (
          <>
            <h2>Supplementary source material</h2>
            <ul>
              {topic.supplementarySources.map((source) => (
                <li key={`${source.sourcePath}-${source.title}`}>
                  {source.url ? (
                    <a href={source.url}>{source.title}</a>
                  ) : (
                    source.title
                  )}
                  {" — "}
                  <span>{source.kind}</span>
                </li>
              ))}
            </ul>
            <p>
              Linked sources are supporting material only; they do not establish
              grade alignment or lesson completeness.
            </p>
          </>
        ) : null}
      </div>
    </article>
  );
}
