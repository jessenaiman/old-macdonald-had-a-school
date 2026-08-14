import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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

export async function CurriculumLessonPage({ slug }: Props) {
  const lesson = getCurriculumLessonBySlug(slug);
  if (!lesson) notFound();

  const focus = lesson.materials.filter((material) => material.role === "focus");
  const supporting = lesson.materials.filter((material) => material.role === "supporting");
  const songs = lesson.materials.filter((material) => material.kind === "song");
  const resources = lesson.materials.filter((material) => material.kind === "resource");
  const standardsByFramework = new Map<string, typeof lesson.standards>();

  for (const standard of lesson.standards) {
    const list = standardsByFramework.get(standard.framework) ?? [];
    list.push(standard);
    standardsByFramework.set(standard.framework, list);
  }

  return (
    <div className="material-surface material-cork min-h-screen px-3 py-6 sm:px-6 lg:px-12" data-style-scope="curriculum-lesson-page">
      <article className="material-surface material-cardboard-paper mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-xl border p-5 shadow-lg sm:p-8 lg:p-10">
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
              <h1 className="font-heading text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">{lesson.topic}</h1>
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
                  Legacy pacing: {lesson.pacing.map((placement) => placement.month).filter((value, index, values) => values.indexOf(value) === index).join(", ")}
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

        <LessonSection title="Curriculum focus">
          {standardsByFramework.size > 0 ? (
            <div className="flex flex-col gap-6">
              {[...standardsByFramework.entries()].map(([framework, list]) => (
                <section className="flex flex-col gap-3" key={framework}>
                  <h3 className="font-heading text-lg text-primary">
                    {framework}{framework.includes("Kindergarten") ? <em className="text-sm font-semibold text-muted-foreground"> — full-day Kindergarten</em> : null}
                  </h3>
                  <div className="grid gap-3">
                    {list.map((standard, index) => (
                      <Card key={`${standard.code}-${index}`}>
                        <CardHeader className="gap-2">
                          <Badge variant="secondary">{standard.code}</Badge>
                          <p className="text-sm leading-6">{standard.fullText}</p>
                          {standard.frames ? <p className="text-xs text-muted-foreground">{standard.frames.split(",").map((frame) => FRAME_LABELS[frame.trim()]).filter(Boolean).join(" — ")}</p> : null}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <Empty className="border"><EmptyHeader><EmptyTitle>No verified standards are linked yet.</EmptyTitle><EmptyDescription>This topic does not currently have a reviewed standards connection.</EmptyDescription></EmptyHeader></Empty>
          )}
        </LessonSection>

        {focus.length > 0 ? (
          <LessonSection title="Focus materials" cue="Start here">
            <div className="grid gap-4">{focus.slice(0, 8).map((material, index) => <MaterialCard key={`${material.kind}-${material.id}-${index}`} material={material} />)}</div>
            {focus.length > 8 ? <p className="text-sm text-muted-foreground">{focus.length - 8} more focus items in the full bank.</p> : null}
          </LessonSection>
        ) : null}

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
          <details>
            <summary className="cursor-pointer font-bold text-primary">{material.lyrics ? "Preview lyrics" : material.actions ? "Preview actions" : "Preview"}</summary>
            {material.lyrics ? <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-body text-sm leading-6">{material.lyrics}</pre> : null}
            {material.actions ? <p className="mt-3 rounded-md bg-muted p-4 text-sm leading-6">{material.actions}</p> : null}
            {material.instructions ? <p className="mt-3 rounded-md bg-muted p-4 text-sm leading-6">{material.instructions}</p> : null}
          </details>
        </CardContent>
      ) : null}
    </Card>
  );
}
