"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { GradePathItem } from "../builder/CurriculumTemplates";
import type { GradeInteractionConfig, GradeInteractionSection } from "./GradeInteractionLane";

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

function PanelHeading({ eyebrow, title, summary }: { eyebrow: string; title: string; summary?: string }) {
  return <header className="flex min-w-0 flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="font-body text-xs font-black uppercase tracking-widest text-muted-foreground">{eyebrow}</p><h2 className="font-hand text-4xl leading-none text-foreground md:text-5xl">{title}</h2></div>{summary ? <p className="max-w-md text-sm text-muted-foreground">{summary}</p> : null}</header>;
}

function LessonCard({ item, index, active, onChoose }: { item: GradePathItem; index: number; active: boolean; onChoose: (index: number) => void }) {
  return <Card className="min-w-0 border-border bg-card text-card-foreground" data-active={active || undefined}><CardHeader><p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{String(index + 1).padStart(2, "0")} · {item.kicker}</p><CardTitle>{item.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{item.summary}</p></CardContent><CardFooter>{item.href ? <Button asChild><Link href={item.href} onClick={() => onChoose(index)}>View lesson</Link></Button> : <Button onClick={() => onChoose(index)}>Choose path</Button>}</CardFooter></Card>;
}

export function GradeTodayPanel({ config, summary, items, selectedIndex, onChoose, onSection, welcome, headingLevel }: SharedProps & { summary: string; welcome: React.ReactNode; headingLevel: "h1" | "h2" }) {
  return <div className="flex min-w-0 flex-col gap-8">{welcome}<section className="flex min-w-0 flex-col gap-5"><div className="flex flex-wrap items-end justify-between gap-3"><PanelHeading eyebrow="Pick a starting point" title={`Learning paths for ${config.grade}`} /><Button variant="link" onClick={() => onSection("resources")}>See all resources →</Button></div><div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,28rem),1fr))] gap-4">{items.slice(0, 4).map((item, index) => <LessonCard key={`${item.title}-${index}`} item={item} index={index} active={index === selectedIndex} onChoose={onChoose} />)}</div></section><Card className="grade-surface"><CardContent className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="text-xs font-black uppercase tracking-wider">Today&apos;s planning board</p><strong className="font-hand text-xl">Invite a choice and notice the story.</strong></div><Button variant="secondary" onClick={() => onSection("planner")}>Open planner →</Button></CardContent></Card></div>;
}

export function GradeCurriculumPanel({ config, items, selectedIndex, onChoose, onSection }: SharedProps) {
  const selected = items[selectedIndex] ?? items[0];
  return <div className="flex min-w-0 flex-col gap-6"><PanelHeading eyebrow="Curriculum · topic overview" title={`${config.grade} learning paths`} summary="Choose a topic, then shape the lesson around the learners who will meet it." /><Card><CardHeader><p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Featured topic goal</p><CardTitle>{selected?.title ?? "Choose a lesson to begin"}</CardTitle></CardHeader><CardContent><p>{selected?.summary ?? "Open a learning path to load the current goal."}</p></CardContent><CardFooter><Button variant="secondary" onClick={() => onSection("planner")}>Plan this topic</Button></CardFooter></Card><div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,28rem),1fr))] gap-4">{items.map((item, index) => <LessonCard key={`${item.title}-${index}`} item={item} index={index} active={index === selectedIndex} onChoose={onChoose} />)}</div><Button variant="link" onClick={() => onSection("today")}>← Back to today</Button></div>;
}

export function GradePlannerPanel({ config, item, onSection }: { config: GradeInteractionConfig; item?: GradePathItem; onSection: (section: GradeInteractionSection) => void }) {
  const notes = [["Set a goal", "Name the one thing learners might notice, try, or share."], ["Gather what helps", "Leave room for the materials, song, book, or visual support."], ["Prepare your plan", "Carry forward what children showed you and one next step."]];
  return <div className="flex min-w-0 flex-col gap-6"><PanelHeading eyebrow="Planner" title="Prepare one helpful next step" summary={`A quiet place to gather what ${config.grade} learners need before the lesson begins.`} /><Card><CardHeader><CardTitle>{item?.title ?? "Choose a lesson to begin"}</CardTitle></CardHeader><CardContent><p>{item?.summary ?? "Open a learning path above to load the current goal."}</p></CardContent><CardFooter>{item?.href ? <Button asChild><Link href={item.href}>Open lesson</Link></Button> : <Button onClick={() => onSection("curriculum")}>Choose a lesson</Button>}</CardFooter></Card><div className="grid min-w-0 gap-4 md:grid-cols-3">{notes.map(([title, prompt]) => <Card key={title}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><p>{prompt}</p><div className="mt-5 grid gap-5" aria-hidden="true"><span className="border-b"/><span className="border-b"/><span className="border-b"/></div></CardContent></Card>)}</div><Button variant="link" onClick={() => onSection("today")}>Return to today →</Button></div>;
}

export function GradeResourcesPanel({ config, items, onChoose }: Pick<SharedProps, "config" | "items" | "onChoose">) {
  return <div className="flex min-w-0 flex-col gap-6"><PanelHeading eyebrow="Resources" title="Gather what helps" summary="Open an existing lesson to find its starting point and supporting materials." /><div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,28rem),1fr))] gap-4">{items.map((item, index) => <LessonCard key={`${item.title}-${index}`} item={item} index={index} active={false} onChoose={onChoose} />)}</div><p className="text-sm text-muted-foreground">Related to {config.grade}. Use the lesson sequence to keep the work close at hand.</p></div>;
}

function embedUrl(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) return `https://www.youtube-nocookie.com/embed/${parsed.searchParams.get("v")}`;
    if (parsed.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("spotify.com")) return `https://open.spotify.com/embed${parsed.pathname}`;
  } catch { return null; }
  return null;
}

export function GradeSearchPanel({ config, onSection }: Pick<SharedProps, "config" | "onSection">) {
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
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&grade=${encodeURIComponent(config.gradeKey)}`);
      const data = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results ?? []);
      setStatus(`${data.results?.length ?? 0} ${config.grade} results.`);
    } catch { setResults([]); setStatus("Search is temporarily unavailable."); }
  }
  const media = embedUrl(selected?.url ?? selected?.href);
  return <div className="flex min-w-0 flex-col gap-6"><PanelHeading eyebrow="Search this grade" title={`Find ${config.grade} lessons`} summary="Search stays inside this workspace and keeps the current grade applied." /><form className="flex min-w-0 flex-col gap-3 sm:flex-row" onSubmit={search}><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try rhythm, counting, plants…" aria-label={`Search ${config.grade}`} /><Button type="submit">Search</Button></form><p role="status" className="text-sm text-muted-foreground">{status}</p><div className="grid min-w-0 gap-4 md:grid-cols-2">{results.map((result) => <Card key={`${result.kind}:${result.id}`}><CardHeader><p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{result.kind}</p><CardTitle>{result.title}</CardTitle></CardHeader><CardContent><p className="line-clamp-4 text-sm text-muted-foreground">{result.excerpt ?? result.instructions ?? result.lyrics ?? "Preview available."}</p></CardContent><CardFooter><Button variant="secondary" onClick={() => setSelected(result)}>Preview</Button></CardFooter></Card>)}</div><Button variant="link" onClick={() => onSection("today")}>← Back to today</Button><Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>{selected?.kind} preview for {config.grade}</DialogDescription></DialogHeader>{media ? <iframe className="aspect-video w-full rounded-lg border" src={media} title={selected?.title} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /> : <div className="whitespace-pre-wrap text-sm leading-6">{selected?.instructions ?? selected?.lyrics ?? selected?.excerpt ?? "No inline preview is available."}</div>}{selected?.href ? <Button asChild><a href={selected.href} target="_blank" rel="noreferrer">Open full resource</a></Button> : null}</DialogContent></Dialog></div>;
}
