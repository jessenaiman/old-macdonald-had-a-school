import { ArrowLeft, ArrowRight, Check, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CHARACTERS } from "../../data/brand/characters-registry";
import { GRADE_INTERACTION_CONFIGS } from "../grades/grade-config";
import { WorkingWallBoard, WorkingWallNote } from "../working-wall/WorkingWallComponents";
import { getCurriculumLessonBySlug } from "../../lib/curriculum-lesson";

interface Props {
  slug: string;
}

const FRAME_LABELS: Record<string, string> = {
  BC: "Belonging & Contributing",
  SRWB: "Self-Regulation & Well-Being",
  DLMB: "Literacy & Mathematics Behaviours",
  PSI: "Problem Solving & Innovating",
};

/* Grade label -> grade-ownership key (DESIGN.md grade-ownership table). */
const GRADE_OWNER_KEYS = {
  Daycare: "daycare",
  Preschool: "pre-school",
  Kindergarten: "kindergarten",
  "Grade 1": "grade-one",
  "Grade 2": "grade-two",
} as const;

export async function CurriculumLessonPage({ slug }: Props) {
  const lesson = getCurriculumLessonBySlug(slug);
  if (!lesson) notFound();

  const focus = lesson.materials.filter((material) => material.role === "focus");
  const supporting = lesson.materials.filter((material) => material.role === "supporting");
  const songs = lesson.materials.filter((material) => material.kind === "song");
  const resources = lesson.materials.filter((material) => material.kind === "resource");

  /* Featured topic goal: the strongest real sentence the database has for this topic. */
  const goal = lesson.skill ?? lesson.standards[0]?.fullText ?? null;

  /* Grade-owner character banner: first grade label that maps to a grade owner. */
  const ownerKey = lesson.grades
    .map((grade) => GRADE_OWNER_KEYS[grade.label as keyof typeof GRADE_OWNER_KEYS])
    .find((key) => Boolean(key));
  const ownerConfig = ownerKey ? GRADE_INTERACTION_CONFIGS[ownerKey] : null;
  const ownerName = ownerConfig ? CHARACTERS[ownerConfig.teacher].name : null;

  return (
    <div className="material-surface material-cork min-h-screen px-3 py-6 sm:px-6 lg:px-12" data-style-scope="curriculum-lesson-page">
      <article className="material-surface material-cardboard-paper flex w-full flex-col gap-8 rounded-xl border p-5 shadow-lg sm:p-8 lg:p-10">
        <header className="flex flex-col gap-5">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
            <Link className="text-primary underline-offset-4 hover:underline" href="/topics">Curriculum</Link>
            <span aria-hidden="true">›</span>
            <span>{lesson.subject}</span>
            <span aria-hidden="true">›</span>
            <span>{lesson.topic}</span>
          </nav>
          <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Topic overview</p>
              <h1 className="mt-1 font-heading text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">{lesson.topic}</h1>
              {lesson.skill ? <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{lesson.skill}</p> : null}
            </div>
            <div className="flex flex-wrap items-start gap-2 md:max-w-sm md:justify-end">
              {lesson.grades.map((grade) => <Badge key={grade.label} variant="outline">{grade.label}</Badge>)}
              {lesson.circleTime ? <Badge variant="secondary">Circle time: {lesson.circleTime}</Badge> : null}
              {lesson.suggestedPlacements.length > 0 ? (
                lesson.suggestedPlacements.map((placement) => (
                  <Badge key={`${placement.planLabel}-${placement.month}-${placement.week ?? ""}`} variant="outline">
                    Suggested: {placement.planLabel} · {placement.month}{placement.week ? ` Week ${placement.week}` : ""}
                  </Badge>
                ))
              ) : lesson.pacing.length > 0 ? (
                <Badge variant="outline">
                  Recorded pacing: {lesson.pacing.map((placement) => placement.month).filter((value, index, values) => values.indexOf(value) === index).join(", ")}
                </Badge>
              ) : null}
            </div>
          </div>
        </header>

        <Separator />

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Lesson resources at a glance">
          {[
            [songs.length, "songs & rhymes"],
            [resources.length, "resources"],
            [lesson.standards.length, "standards"],
            [lesson.assets.length, "printables"],
          ].map(([count, label]) => (
            <Card key={label}>
              <CardContent className="flex flex-col items-center gap-1 py-4 text-center">
                <strong className="font-heading text-3xl">{count}</strong>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
              </CardContent>
            </Card>
          ))}
        </section>

        {goal || focus.length > 0 ? (
          <LessonSection title="Lesson sequence" cue="Start here">
            <WorkingWallBoard aria-label="Featured topic goal and lesson sequence">
              {goal ? (
                <WorkingWallNote fastener="pin" heading="Featured topic goal">
                  <p className="font-heading text-xl leading-snug">{goal}</p>
                </WorkingWallNote>
              ) : null}
              {focus.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-black uppercase tracking-widest">Lesson sequence</h3>
                  <ol className="grid gap-4">
                    {focus.slice(0, 8).map((material, index) => {
                      const openHref = material.kind === "song" ? `/songs/${material.id}` : material.url || null;
                      return (
                        <li key={`${material.kind}-${material.id}-${index}`}>
                          <Card className="material-surface material-cardboard-paper relative gap-3 px-4 py-4">
                            <span className="brand-asset fastener-push-pin icon-micro pointer-events-none absolute -top-2.5 left-6" aria-hidden="true" />
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground" aria-hidden="true">
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <CardTitle className="font-heading text-lg leading-tight">{material.title}</CardTitle>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                  {material.kind === "song" ? "Song" : "Resource"} · Step {index + 1} of {Math.min(focus.length, 8)}
                                </p>
                              </div>
                              {openHref ? (
                                material.kind === "song" ? (
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={openHref}>Open</Link>
                                  </Button>
                                ) : (
                                  <Button asChild variant="outline" size="sm">
                                    <a href={openHref} target="_blank" rel="noopener noreferrer">Open<ExternalLink data-icon="inline-end" /></a>
                                  </Button>
                                )
                              ) : null}
                            </div>
                            <MaterialPreview material={material} />
                            {material.kind === "song" && material.url ? (
                              <Button asChild variant="link" size="sm" className="self-start">
                                <a href={material.url} target="_blank" rel="noopener noreferrer">Source<ExternalLink data-icon="inline-end" /></a>
                              </Button>
                            ) : null}
                          </Card>
                        </li>
                      );
                    })}
                  </ol>
                  {focus.length > 8 ? <p className="text-sm font-bold">{focus.length - 8} more focus items in the full bank.</p> : null}
                </div>
              ) : null}
            </WorkingWallBoard>
          </LessonSection>
        ) : null}

        <LessonSection title="Topic objectives">
          {lesson.standards.length > 0 || resources.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
              {lesson.standards.length > 0 ? (
                <ul className="grid gap-2" aria-label="Curriculum standards checklist">
                  {lesson.standards.map((standard, index) => (
                    <li key={`${standard.code}-${index}`}>
                      <Card className="material-surface material-cardboard-paper flex-row items-start gap-3 px-4 py-3">
                        <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{standard.code} · {standard.framework}</p>
                          <p className="text-sm leading-6">{standard.fullText}</p>
                          {standard.frames ? <p className="text-xs text-muted-foreground">{standard.frames.split(",").map((frame) => FRAME_LABELS[frame.trim()]).filter(Boolean).join(" — ")}</p> : null}
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty className="border"><EmptyHeader><EmptyTitle>No verified standards are linked yet.</EmptyTitle><EmptyDescription>This topic does not currently have a reviewed standards connection.</EmptyDescription></EmptyHeader></Empty>
              )}
              {resources.length > 0 ? (
                <Card className="material-surface material-cardboard-paper h-fit">
                  <CardHeader>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Related resources</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <ul className="grid gap-2">
                      {resources.map((resource, index) => (
                        <li key={`${resource.kind}-${resource.id}-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          {resource.url ? (
                            <a className="min-w-0 text-sm font-bold underline-offset-4 hover:underline" href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.title}<ExternalLink className="ml-1 inline size-3.5" aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="min-w-0 text-sm font-bold">{resource.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-fit">
                      <Link href="/search">Browse all resources<ArrowRight data-icon="inline-end" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : (
            <Empty className="border"><EmptyHeader><EmptyTitle>No verified standards are linked yet.</EmptyTitle><EmptyDescription>This topic does not currently have a reviewed standards connection.</EmptyDescription></EmptyHeader></Empty>
          )}
        </LessonSection>

        {supporting.length > 0 ? (
          <LessonSection title="Supporting bank">
            <p className="text-sm text-muted-foreground">Reinforce or vary the lesson with songs and resources on the same skill.</p>
            <div className="grid gap-4">{supporting.slice(0, 6).map((material, index) => <MaterialCard compact key={`${material.kind}-${material.id}-${index}`} material={material} />)}</div>
            {supporting.length > 6 ? <p className="text-sm text-muted-foreground">{supporting.length - 6} more supporting items in the full bank.</p> : null}
          </LessonSection>
        ) : null}

        {lesson.assets.length > 0 ? (
          <LessonSection title="Printable resources">
            <div className="grid gap-3">
              {lesson.assets.map((asset, index) => (
                <Card key={`${asset.title}-${index}`}>
                  <CardContent className="flex flex-wrap items-center gap-4 py-4">
                    <Badge variant="secondary">{asset.type === "poster" ? "Poster" : "Printable"}</Badge>
                    <div className="min-w-0 flex-1">
                      <strong className="font-heading text-lg">{asset.title}</strong>
                      <p className="text-xs text-muted-foreground">{asset.type} {asset.format ? `— ${asset.format.toUpperCase()}` : ""}</p>
                    </div>
                    <Button asChild variant="outline">
                      <a href={asset.filePath || "#"} download><Download data-icon="inline-start" />Download</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </LessonSection>
        ) : null}

        <LessonSection title="Teacher planning notes">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Before learners arrive", "Gather focus materials and review the skill statement so you can name the goal aloud."],
              ["As we learn", "Watch for whether children respond to the focus song or need the supporting bank as a slower entry."],
              ["For next time", "Note which material children returned to, and whether the skill statement needs a different entry point."],
            ].map(([label, copy]) => (
              <Card key={label}><CardHeader><CardTitle>{label}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-muted-foreground">{copy}</p></CardContent></Card>
            ))}
          </div>
        </LessonSection>

        {lesson.tags.length > 0 ? <div className="flex flex-wrap gap-2">{lesson.tags.map((tag, index) => <Badge key={`${tag}-${index}`}>{tag}</Badge>)}</div> : null}

        {ownerConfig && ownerName ? (
          <section
            className={cn("characters-surface flex flex-wrap items-center gap-5 rounded-xl border p-5 shadow-sm", `characters-${ownerConfig.teacher}`)}
            aria-label={`Teaching note from ${ownerName}`}
          >
            <span className="brand-asset character-face-bust icon-control shrink-0" data-character={ownerConfig.teacher} aria-hidden="true" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-xs font-black uppercase tracking-widest">From {ownerName}</p>
              <p className="font-hand text-2xl leading-snug">{ownerConfig.leadQuote}</p>
            </div>
          </section>
        ) : null}

        <Separator />
        <Button asChild className="self-start" variant="link"><Link href="/topics"><ArrowLeft data-icon="inline-start" />Back to curriculum</Link></Button>
      </article>
    </div>
  );
}

function LessonSection({ title, cue, children }: { title: string; cue?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-heading text-2xl">{title}</h2>
        {cue ? <Badge variant="destructive">{cue}</Badge> : null}
      </div>
      {children}
      <Separator />
    </section>
  );
}

function MaterialPreview({ material }: {
  material: { lyrics?: string | null; actions?: string | null; instructions?: string | null };
}) {
  if (!material.lyrics && !material.actions && !material.instructions) return null;
  return (
    <details className="min-w-0">
      <summary className="cursor-pointer font-bold text-primary">{material.lyrics ? "Preview lyrics" : material.actions ? "Preview actions" : "Preview"}</summary>
      {material.lyrics ? <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-body text-sm leading-6">{material.lyrics}</pre> : null}
      {material.actions ? <p className="mt-3 rounded-md bg-muted p-4 text-sm leading-6">{material.actions}</p> : null}
      {material.instructions ? <p className="mt-3 rounded-md bg-muted p-4 text-sm leading-6">{material.instructions}</p> : null}
    </details>
  );
}

function MaterialCard({ material, compact = false }: {
  material: { kind: string; title: string; lyrics?: string | null; actions?: string | null; instructions?: string | null; url?: string | null };
  compact?: boolean;
}) {
  return (
    <Card>
      <CardHeader className={cn("gap-3", compact && "py-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge>{material.kind}</Badge>
          {material.url ? <Button asChild variant="link" size="sm"><a href={material.url} target="_blank" rel="noopener noreferrer">Source<ExternalLink data-icon="inline-end" /></a></Button> : null}
        </div>
        <CardTitle>{material.title}</CardTitle>
      </CardHeader>
      {material.lyrics || material.actions || material.instructions ? (
        <CardContent>
          <MaterialPreview material={material} />
        </CardContent>
      ) : null}
    </Card>
  );
}
