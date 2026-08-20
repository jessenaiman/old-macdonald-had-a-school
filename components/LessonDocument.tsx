import type { ComponentType } from "react";
import type { LessonMetadata } from "../lib/content";
import type { CurriculumLesson } from "../lib/curriculum-lesson";
import { LessonPrintActions } from "./planning/LessonPrintActions";
import { Button } from "./ui/button";

export function LessonDocument({
  Content,
  metadata,
  curriculumLesson = null,
}: {
  Content: ComponentType;
  metadata: LessonMetadata;
  curriculumLesson?: CurriculumLesson | null;
}) {
  const externalResource =
    metadata.externalResource ||
    metadata.practiceResource?.match(/https?:\/\/\S+/)?.[0];
  const hasProvenance = Boolean(
    metadata.standards ||
    metadata.sourceReference ||
    metadata.recommendedSource,
  );
  const isWorksheet =
    metadata.template === "worksheet" || metadata.slug === "worksheet-example";
  const curriculumMaterials =
    curriculumLesson?.materials.filter((material) => material.title) ?? [];
  const curriculumAssets =
    curriculumLesson?.assets.filter((asset) => asset.filePath) ?? [];

  return (
    <article
      className="min-w-0"
      data-template={metadata.template}
      data-planning-layout={isWorksheet ? "worksheet" : undefined}
    >
      <header className="flex min-w-0 flex-col gap-3 border-b pb-6">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {isWorksheet
            ? "Ready-to-use teacher activity"
            : metadata.template === "lesson"
              ? "Lesson plan"
              : `${metadata.template} lesson`}
        </p>
        <p className="text-sm text-muted-foreground">
          {metadata.grade} <span aria-hidden="true">·</span> {metadata.subject}{" "}
          <span aria-hidden="true">·</span> {metadata.category}
        </p>
        <h1 className="max-w-4xl text-balance font-heading text-4xl leading-none sm:text-5xl lg:text-6xl">{metadata.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{metadata.summary}</p>
        <div className="flex flex-wrap gap-3 print:hidden">
          <LessonPrintActions />
          {externalResource ? (
            <Button asChild variant="outline">
              <a href={externalResource} target="_blank" rel="noreferrer">
                Open teaching resource
              </a>
            </Button>
          ) : null}
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <dt>Focus</dt>
            <dd>{metadata.focus}</dd>
          </div>
          {metadata.timeEstimate ? (
            <div className="rounded-lg border p-4">
              <dt>Time</dt>
              <dd>{metadata.timeEstimate}</dd>
            </div>
          ) : null}
        </dl>
        {isWorksheet ? (
          <ol className="grid gap-3 sm:grid-cols-3" aria-label="Teaching workflow">
            <li className="flex gap-3 rounded-lg border p-3">
              <span>1</span>
              <div>
                <strong>Prepare</strong>
                <small>Choose materials and participation options.</small>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border p-3">
              <span>2</span>
              <div>
                <strong>Teach</strong>
                <small>Follow the short, repeatable sequence.</small>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border p-3">
              <span>3</span>
              <div>
                <strong>Notice</strong>
                <small>Record one useful observation for next time.</small>
              </div>
            </li>
          </ol>
        ) : null}
      </header>
      <div
        className="prose prose-lg mt-6 max-w-none font-body leading-7 prose-headings:font-heading prose-headings:text-balance"
        id="lesson-plan"
      >
        <Content />
        {curriculumMaterials.length > 0 || curriculumAssets.length > 0 ? (
          <section>
            <h2>Linked curriculum materials</h2>
            {curriculumMaterials.length > 0 ? (
              <ul>
                {curriculumMaterials.map((material) => (
                  <li key={`${material.kind}-${material.id}`}>
                    {material.url ? (
                      <a href={material.url}>{material.title}</a>
                    ) : (
                      material.title
                    )}
                    {material.useInPhase ? ` - ${material.useInPhase}` : ""}
                    {material.teacherRationale
                      ? `: ${material.teacherRationale}`
                      : ""}
                  </li>
                ))}
              </ul>
            ) : null}
            {curriculumAssets.length > 0 ? (
              <ul>
                {curriculumAssets.map((asset) => (
                  <li key={asset.id}>
                    <a href={asset.filePath!}>{asset.title}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}
      </div>
      {hasProvenance ? (
        <aside className="mt-8 border-t pt-6" aria-label="Curriculum alignment and source notes">
          <details>
            <summary>
              <span>Curriculum alignment &amp; source notes</span>
              <small>Verified planning provenance</small>
            </summary>
            <dl>
              {metadata.standards ? (
                <div>
                  <dt>Standards</dt>
                  <dd>{metadata.standards}</dd>
                </div>
              ) : null}
              {metadata.recommendedSource ? (
                <div>
                  <dt>Recommended source</dt>
                  <dd>{metadata.recommendedSource}</dd>
                </div>
              ) : null}
              {metadata.sourceReference ? (
                <div>
                  <dt>Record provenance</dt>
                  <dd>{metadata.sourceReference}</dd>
                </div>
              ) : null}
            </dl>
          </details>
        </aside>
      ) : null}
    </article>
  );
}
