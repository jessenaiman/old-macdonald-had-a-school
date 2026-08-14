"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

type SearchResult = {
  id: string;
  kind: string;
  title: string;
  excerpt?: string;
  instructions?: string;
  lyrics?: string;
  url?: string;
  href?: string;
};

type SearchResponse = { results?: SearchResult[]; error?: string };

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
        eyebrow="Curriculum · topic overview"
        title={`${config.grade} learning paths`}
        summary="Choose a topic, then shape the lesson around the learners who will meet it."
      />
      <Card className="material-surface material-cardboard-paper">
        <CardHeader>
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Featured topic goal
          </p>
          <CardTitle>{selected?.title ?? "Choose a lesson to begin"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {selected?.summary ??
              "Open a learning path to load the current goal."}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => onSection("planner")}>
            Plan this topic
          </Button>
        </CardFooter>
      </Card>
      <section className="material-surface material-cork-board rounded-xl border p-4" aria-label="Lesson sequence">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {items.map((item, index) => (
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
    ["Set a goal", "Name the one thing learners might notice, try, or share."],
    [
      "Gather what helps",
      "Leave room for the materials, song, book, or visual support.",
    ],
    [
      "Prepare your plan",
      "Carry forward what children showed you and one next step.",
    ],
  ];
  return (
    <div className="flex min-h-96 min-w-0 flex-col gap-6">
      <PanelHeading
        eyebrow="Planner"
        title="Prepare one helpful next step"
        summary={`A quiet place to gather what ${config.grade} learners need before the lesson begins.`}
      />
      <Card className="material-surface material-cardboard-paper">
        <CardHeader>
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
      <section className="material-surface material-cork-board rounded-xl border p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {notes.map(([title, prompt], index) => (
            <Card className="material-surface material-cardboard-paper relative" key={title}>
              <span
                className={`brand-asset ${["fastener-paperclip", "fastener-masking-tape", "fastener-push-pin"][index]} icon-small absolute -top-4 left-1/2 -translate-x-1/2`}
                aria-hidden="true"
              />
              <CardHeader className="pt-8"><CardTitle>{title}</CardTitle></CardHeader>
              <CardContent><p className="font-hand text-lg">{prompt}</p></CardContent>
            </Card>
          ))}
        </div>
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

function embedUrl(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com"))
      return `https://www.youtube-nocookie.com/embed/${parsed.searchParams.get("v")}`;
    if (parsed.hostname === "youtu.be")
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("spotify.com"))
      return `https://open.spotify.com/embed${parsed.pathname}`;
  } catch {
    return null;
  }
  return null;
}

export function GradeSearchPanel({
  config,
  onSection,
}: Pick<SharedProps, "config" | "onSection">) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState("Search within this grade.");
  async function search(event: FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (term.length < 2) return setStatus("Enter at least two characters.");
    setStatus("Searching…");
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(term)}&grade=${encodeURIComponent(config.gradeKey)}`,
      );
      const data = (await response.json()) as SearchResponse;
      if (!response.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results ?? []);
      setStatus(`${data.results?.length ?? 0} ${config.grade} results.`);
    } catch {
      setResults([]);
      setStatus("Search is temporarily unavailable.");
    }
  }
  const media = embedUrl(selected?.url ?? selected?.href);
  return (
    <div className="flex min-h-96 min-w-0 flex-col gap-6">
      <PanelHeading
        eyebrow="Search this grade"
        title={`Find ${config.grade} lessons`}
        summary="Search stays inside this workspace and keeps the current grade applied."
      />
      <form
        className="flex min-w-0 flex-col gap-3 sm:flex-row"
        onSubmit={search}
      >
        <Input
          name="grade-search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try rhythm, counting, plants…"
          aria-label={`Search ${config.grade}`}
        />
        <Button type="submit">Search</Button>
      </form>
      <p role="status" className="text-sm text-muted-foreground">
        {status}
      </p>
      {results.length ? (
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {results.map((result) => (
            <Card
              className="material-surface material-cardboard-paper"
              key={`${result.kind}:${result.id}`}
            >
              <CardHeader>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  {result.kind}
                </p>
                <CardTitle>{result.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {result.excerpt ??
                    result.instructions ??
                    result.lyrics ??
                    "Preview available."}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" onClick={() => setSelected(result)}>
                  Preview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="material-surface material-cardboard-paper relative max-w-3xl">
          <span
            className="brand-asset fastener-paperclip icon-small"
            aria-hidden="true"
          />
          <CardHeader className="pt-8"><CardTitle>Search this workroom</CardTitle></CardHeader>
          <CardContent><p>
            Try a curriculum word, classroom material, song, movement, or
            teaching goal. Results remain connected to {config.grade}.
          </p></CardContent>
        </Card>
      )}
      <Button variant="link" onClick={() => onSection("today")}>
        ← Back to today
      </Button>
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.kind} preview for {config.grade}
            </DialogDescription>
          </DialogHeader>
          {media ? (
            <iframe
              className="aspect-video w-full rounded-lg border"
              src={media}
              title={selected?.title}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-6">
              {selected?.instructions ??
                selected?.lyrics ??
                selected?.excerpt ??
                "No inline preview is available."}
            </div>
          )}
          {selected?.href ? (
            <Button asChild>
              <a href={selected.href} target="_blank" rel="noreferrer">
                Open full resource
              </a>
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
