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
  /** Resolved curriculum topic — present when the route slug matched the curriculum database directly. */
  topic?: CurriculumTopic;
  /** Resolved curriculum record (topics table) — required when no topic was resolved by slug. */
  curriculumLesson: CurriculumLesson | null;
}) {
  if (!topic && !curriculumLesson) return null;

  const title = topic?.title ?? curriculumLesson!.topic;
  const gradeLabel =
    topic?.grade ??
    curriculumLesson!.grades.map((grade) => grade.label).join(", ");
  const subject = topic?.subject ?? curriculumLesson!.subject;
  const skillStatement = topic?.skillStatement ?? curriculumLesson!.skill;
  const category = topic?.category ?? curriculumLesson!.category;
  const standardsText =
    topic?.standards ??
    (curriculumLesson!.standards.length > 0
      ? curriculumLesson!.standards
          .map((standard) =>
            standard.code
              ? `${standard.framework} ${standard.code}`
              : standard.framework,
          )
          .join("; ")
      : null);
  const tags = topic?.tags ?? curriculumLesson!.tags;
  const linkedResources = topic?.linkedResources ?? null;
  const supplementarySources = topic?.supplementarySources ?? [];
  const completeness = topic?.completeness;

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
      className="min-w-0"
      data-source-type="database"
      data-completeness={completeness}
    >
      <header className="flex min-w-0 flex-col gap-3 border-b pb-6">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Curriculum lesson outline
        </p>
        <p className="text-sm text-muted-foreground">
          {gradeLabel} · {subject}
        </p>
        <h1 className="max-w-4xl text-balance font-heading text-4xl leading-none sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="max-w-3xl text-muted-foreground">
          {skillStatement ||
            "This curriculum record is available as a planning starting point while its complete lesson is prepared."}
        </p>
        <div className="flex flex-wrap gap-3 print:hidden">
          <LessonPrintButton />
          {topic ? (
            <Button asChild variant="outline">
              <Link href={`/api/lessons/${topic.grade}/${topic.id}/markdown`}>
                Download Markdown
              </Link>
            </Button>
          ) : null}
        </div>
        <dl className="grade-workspace-metadata grid gap-3 sm:grid-cols-2">
          <div className="grade-workspace-artifact rounded-lg border p-4">
            <span className="brand-asset fastener-push-pin icon-small grade-workspace-fastener" aria-hidden="true" />
            <dt>Subject</dt>
            <dd>{subject}</dd>
          </div>
          <div className="grade-workspace-artifact rounded-lg border p-4">
            <span className="brand-asset fastener-masking-tape icon-small grade-workspace-fastener" aria-hidden="true" />
            <dt>Status</dt>
            <dd>
              {completeness === "complete"
                ? "Reviewed lesson"
                : "Database-led outline"}
            </dd>
          </div>
          <div className="grade-workspace-artifact rounded-lg border p-4">
            <span className="brand-asset fastener-paperclip icon-small grade-workspace-fastener" aria-hidden="true" />
            <dt>Category</dt>
            <dd>{available(category)}</dd>
          </div>
          <div className="grade-workspace-artifact rounded-lg border p-4">
            <span className="brand-asset fastener-push-pin icon-small grade-workspace-fastener" aria-hidden="true" />
            <dt>Standards</dt>
            <dd>{available(standardsText)}</dd>
          </div>
        </dl>
      </header>
      <div
        className="prose prose-lg mt-6 max-w-none font-body leading-7 prose-headings:font-heading prose-headings:text-balance"
        id="lesson-plan"
      >
        <h2>Curriculum focus</h2>
        <p>{available(skillStatement)}</p>
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
          <p>{available(linkedResources)}</p>
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
          {skillStatement
            ? `Observe evidence of: ${skillStatement}`
            : "Not yet available."}
        </p>
        <h2>Tags and planning context</h2>
        <p>{tags.length > 0 ? tags.join(", ") : "Not yet available"}</p>
        {supportingMaterials.length > 0 ? (
          <>
            <h2>Optional supporting materials</h2>
            <p>
              {supportingMaterials.map((material) => material.title).join(", ")}
            </p>
          </>
        ) : null}
        {supplementarySources.length > 0 ? (
          <>
            <h2>Supplementary source material</h2>
            <ul>
              {supplementarySources.map((source) => (
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
