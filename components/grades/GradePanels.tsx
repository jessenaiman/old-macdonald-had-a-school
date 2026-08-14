"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { SearchWorkspace } from "@/components/search/SearchWorkspace";
import type { GradePathItem } from "./types";
import type {
  GradeInteractionConfig,
  GradeInteractionSection,
} from "./GradeInteractionLane";

type SharedProps = {
  config: GradeInteractionConfig;
  items: GradePathItem[];
  selectedIndex: number;
  onChoose: (index: number) => void;
  onSection: (section: GradeInteractionSection) => void;
};


function PanelHeading({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
}) {
  return (
    <header className="flex min-w-0 flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-heading text-4xl leading-none md:text-5xl">
          {title}
        </h2>
      </div>
      {summary ? (
        <p className="max-w-md text-sm text-muted-foreground">{summary}</p>
      ) : null}
    </header>
  );
}

function LessonCard({
  item,
  index,
  active,
  onChoose,
}: {
  item: GradePathItem;
  index: number;
  active: boolean;
  onChoose: (index: number) => void;
}) {
  const content = (
    <>
      <span
        className="brand-asset fastener-push-pin icon-small absolute -top-2 right-2"
        aria-hidden="true"
      />
      <span
        className={`brand-asset ${item.icon} icon-medium row-span-4 self-start`}
        aria-hidden="true"
      />
      <span className="grade-surface w-fit rounded-md px-2 py-1 text-xs font-black uppercase tracking-widest">
        {item.kicker}
      </span>
      <strong className="font-heading text-xl leading-none text-balance">
        {item.title}
      </strong>
      <span className="text-sm text-muted-foreground">{item.summary}</span>
      <span className="self-end text-sm font-bold underline underline-offset-4">
        View path →
      </span>
    </>
  );
  const className =
    "material-surface material-cardboard-paper relative grid h-auto min-h-36 min-w-0 grid-cols-[4.75rem_minmax(0,1fr)] grid-rows-[auto_auto_1fr_auto] gap-x-4 gap-y-1 whitespace-normal rounded-xl border p-4 text-left shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1";
  return item.href ? (
    <Button asChild className={className} variant="ghost">
      <Link
        href={item.href}
        onClick={() => onChoose(index)}
        data-active={active || undefined}
      >
        {content}
      </Link>
    </Button>
  ) : (
    <Button
      className={className}
      variant="ghost"
      onClick={() => onChoose(index)}
      data-active={active || undefined}
      type="button"
    >
      {content}
    </Button>
  );
}

export function GradeTodayPanel({
  config,
  items,
  selectedIndex,
  onChoose,
  onSection,
  welcome,
}: SharedProps & {
  summary: string;
  welcome: React.ReactNode;
  headingLevel: "h1" | "h2";
}) {
  const notes = [
    [
      "Set a goal",
      "Follow one clear sequence and make one meaningful choice.",
      "fastener-paperclip",
    ],
    [
      "Gather what helps",
      "Pick resources, prompts, and supports.",
      "fastener-masking-tape",
    ],
    [
      "Prepare your plan",
      "Map the lesson steps and learner needs.",
      "fastener-push-pin",
    ],
  ];
  return (
    <div className="flex min-w-0 flex-col gap-7">
      {welcome}
      <section className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <PanelHeading
            eyebrow="Pick a starting point"
            title={`Learning paths for ${config.grade}`}
          />
          <Button variant="link" onClick={() => onSection("resources")}>
            See all resources →
          </Button>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {items.slice(0, 4).map((item, index) => (
            <LessonCard
              key={`${item.title}-${index}`}
              item={item}
              index={index}
              active={index === selectedIndex}
              onChoose={onChoose}
            />
          ))}
        </div>
      </section>
      <section
        className="material-surface material-cork-board flex min-w-0 flex-col gap-5 rounded-xl border p-4"
        aria-label="Today's planning board"
      >
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p>Today&apos;s planning board</p>
            <strong>Invite a choice and notice the story.</strong>
          </div>
          <Button variant="secondary" onClick={() => onSection("planner")}>
            Open planner →
          </Button>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {notes.map(([title, prompt, fastener]) => (
            <Card className="material-surface material-cardboard-paper relative" key={title}>
              <span
                className={`brand-asset ${fastener} icon-small absolute -top-4 left-1/2 -translate-x-1/2`}
                aria-hidden="true"
              />
              <CardHeader className="pt-8"><CardTitle>{title}</CardTitle></CardHeader>
              <CardContent><p className="font-hand text-lg">{prompt}</p></CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function GradeCurriculumPanel({
  config,
  items,
  selectedIndex,
  onChoose,
  onSection,
}: SharedProps) {
  const selected = items[selectedIndex] ?? items[0];
  return (
    <div className="flex min-h-96 min-w-0 flex-col gap-6">
      <PanelHeading
        eyebrow={`Curriculum · ${config.grade}`}
        title={`${config.grade} learning paths`}
        summary="Start with the grade goal, follow the teaching sequence, then open the path that fits your learners."
      />
      <div className="min-w-0">
        <Card className="material-surface material-cardboard-paper relative gap-3 overflow-hidden py-4">
          <span className="brand-asset fastener-masking-tape icon-medium absolute -top-5 left-1/2 -translate-x-1/2" aria-hidden="true" />
          <CardHeader className="px-4 pt-7">
            <Badge variant="secondary">Featured learning goal</Badge>
            <CardTitle>{selected?.title ?? "Choose a lesson to begin"}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-4 px-4">
            {selected ? <span className={`brand-asset ${selected.icon} icon-medium`} aria-hidden="true" /> : null}
            <p className="m-0">{selected?.summary ?? "Open a learning path to load the current goal."}</p>
          </CardContent>
          <CardFooter className="px-4">
            <Button onClick={() => onSection("planner")}>Plan this path</Button>
          </CardFooter>
        </Card>
      </div>
      <section className="material-surface material-cork relative rounded-xl border p-4 sm:p-5" aria-label="Learning path sequence">
        <span className="brand-asset fastener-push-pin icon-small absolute -top-3 right-5" aria-hidden="true" />
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-widest">Learning path sequence</p><h3 className="font-heading text-3xl">Choose the next teaching path</h3></div>
          <p className="text-sm text-muted-foreground">{items.length} paths</p>
        </header>
        <div className="flex min-w-0 flex-col gap-3">
          {items.map((item, index) => (
            <Card className="material-surface material-cardboard-paper relative gap-0 py-3" key={`${item.title}-${index}`}>
              <CardHeader className="gap-0 px-4 has-data-[slot=card-action]:grid-cols-1 sm:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                <div className="flex min-w-0 items-center gap-3">
                  <Badge className="size-7 shrink-0 justify-center rounded-full p-0" variant="secondary" aria-label={`Path ${index + 1}`}>{index + 1}</Badge>
                  <span className={`brand-asset ${item.icon} icon-medium shrink-0`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.kicker}</p>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.summary}</CardDescription>
                  </div>
                </div>
                <CardAction className="relative col-start-1 row-start-3 mt-2 justify-self-start sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:mt-0 sm:justify-self-end">
                  {index === selectedIndex ? (
                    <Badge>Current path</Badge>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => onChoose(index)}>
                      Choose path
                    </Button>
                  )}
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <Button variant="link" onClick={() => onSection("today")}>
        ← Back to today
      </Button>
    </div>
  );
}

export function GradePlannerPanel({
  config,
  item,
  onSection,
}: {
  config: GradeInteractionConfig;
  item?: GradePathItem;
  onSection: (section: GradeInteractionSection) => void;
}) {
  const notes = [
    ["planner-goal", "Set a goal", "What is the one thing learners might notice, try, or share?"],
    ["planner-supports", "Gather what helps", "Which materials, songs, books, visuals, or supports belong close at hand?"],
    ["planner-next-step", "Prepare the next step", "What will you watch for, and what could happen next?"],
  ] as const;
  return (
    <div className="flex min-h-96 min-w-0 flex-col gap-6">
      <PanelHeading
        eyebrow="Planner"
        title="Prepare one helpful next step"
        summary={`A quiet place to gather what ${config.grade} learners need before the lesson begins.`}
      />
      <Card className="material-surface material-cardboard-paper relative">
        <span className="brand-asset fastener-paperclip icon-small absolute -top-4 right-5" aria-hidden="true" />
        <CardHeader>
          <Badge variant="secondary">Current planning focus</Badge>
          <CardTitle>{item?.title ?? "Choose a lesson to begin"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {item?.summary ??
              "Open a learning path above to load the current goal."}
          </p>
        </CardContent>
        <CardFooter>
          {item?.href ? (
            <Button asChild>
              <Link href={item.href}>Open lesson</Link>
            </Button>
          ) : (
            <Button onClick={() => onSection("curriculum")}>
              Choose a lesson
            </Button>
          )}
        </CardFooter>
      </Card>
      <section className="material-surface material-cork rounded-xl border p-4 sm:p-5" aria-labelledby="planning-board-title">
        <header className="mb-5"><p className="text-xs font-black uppercase tracking-widest">Working board</p><h3 className="font-heading text-3xl" id="planning-board-title">Prepare the lesson</h3></header>
        <FieldGroup className="grid gap-4 lg:grid-cols-3">
          {notes.map(([id, title, prompt], index) => (
            <Field key={id}>
              <Card className="material-surface material-cardboard-paper relative w-full">
                <span
                  className={`brand-asset ${["fastener-paperclip", "fastener-masking-tape", "fastener-push-pin"][index]} icon-small absolute -top-4 left-1/2 -translate-x-1/2`}
                  aria-hidden="true"
                />
                <CardHeader className="pt-8">
                  <Badge variant="outline">Step {index + 1}</Badge>
                  <FieldLabel htmlFor={id}>{title}</FieldLabel>
                </CardHeader>
                <CardContent>
                  <FieldDescription>{prompt}</FieldDescription>
                  <Textarea id={id} className="min-h-32 resize-y" placeholder="Add your planning notes…" />
                </CardContent>
              </Card>
            </Field>
          ))}
        </FieldGroup>
        <Field className="mt-5">
          <Card className="material-surface material-paper-ruled w-full">
            <CardHeader>
              <FieldLabel htmlFor="planner-teacher-notes">Notes for this lesson</FieldLabel>
            </CardHeader>
            <CardContent>
              <FieldDescription>Plan, jot observations, or record what to carry into the next lesson.</FieldDescription>
              <Textarea id="planner-teacher-notes" className="min-h-40 resize-y" placeholder="Write a note for your future self…" />
            </CardContent>
          </Card>
        </Field>
      </section>
      <Button variant="link" onClick={() => onSection("today")}>
        Return to today →
      </Button>
    </div>
  );
}

export function GradeResourcesPanel({
  config,
  items,
  onChoose,
}: Pick<SharedProps, "config" | "items" | "onChoose">) {
  return (
    <div className="flex min-h-96 min-w-0 flex-col gap-6">
      <PanelHeading
        eyebrow="Resources"
        title="Gather what helps"
        summary="Open an existing lesson to find its starting point and supporting materials."
      />
      <section className="material-surface material-cork-board rounded-xl border p-4">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <LessonCard
              key={`${item.title}-${index}`}
              item={item}
              index={index}
              active={false}
              onChoose={onChoose}
            />
          ))}
        </div>
      </section>
      <p className="text-sm text-muted-foreground">
        Related to {config.grade}. Use the lesson sequence to keep the work
        close at hand.
      </p>
    </div>
  );
}

export function GradeSearchPanel({
  config,
  onSection,
}: Pick<SharedProps, "config" | "onSection">) {
  return (
    <SearchWorkspace
      lockedGrade={config.gradeKey}
      gradeLabel={config.grade}
      onBack={() => onSection("today")}
    />
  );
}
