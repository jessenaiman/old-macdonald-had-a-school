"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { TEACHER_GRADE_ITEMS } from "@/components/site-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { GRADE_SEARCH_VALUES, lessonHref, type GradeKey } from "@/lib/grade-routes";

type SearchResult = { id: string; kind: string; title: string; excerpt: string | null; lyrics: string | null; instructions: string | null; meta: Record<string, string>; href: string | null };
type CurriculumResult = { id: string; grade_key: string; grade: string; subject: string; lesson_topic: string; skill_statement: string | null; teacher_title?: string | null; teacher_summary?: string | null; why_match?: string };
type LessonResult = { id: string; slug: string; title: string; subject: string; grade_band: string; summary: string; purpose: string };
type SearchResponse = { results?: SearchResult[]; curriculum?: CurriculumResult[]; lessons?: LessonResult[]; searchMode?: "structured-keyword" | "hybrid-keyword-semantic"; error?: string };

type SearchWorkspaceProps = { initialQuery?: string; initialGrade?: string; lockedGrade?: GradeKey; gradeLabel?: string; onBack?: () => void };

const GRADE_OPTIONS = [{ value: "", label: "All grades" }, ...TEACHER_GRADE_ITEMS.map(({ key, label }) => ({ value: GRADE_SEARCH_VALUES[key], label }))] as const;

function slugify(value: string) { return value.toLocaleLowerCase().replaceAll("&", " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").replace(/-{2,}/g, "-"); }
function topicHref(topic: CurriculumResult) { return `/topics/${topic.id}-${slugify(topic.lesson_topic)}`; }
function topicTitle(topic: CurriculumResult) { return topic.teacher_title || topic.lesson_topic; }
function topicSummary(topic: CurriculumResult) { return topic.teacher_summary || topic.skill_statement || "No reviewed topic summary is available yet."; }
function resourcePreview(result: SearchResult) { return result.excerpt || result.instructions || result.lyrics || "A resource preview is available."; }

/**
 * Search-domain workspace. It composes the installed shadcn Field, Button,
 * Card, Badge, and Empty primitives; the custom logic coordinates this site's API and URL state.
 */
export function SearchWorkspace({ initialQuery = "", initialGrade = "", lockedGrade, gradeLabel, onBack }: SearchWorkspaceProps) {
  const lockedGradeValue = lockedGrade ? GRADE_SEARCH_VALUES[lockedGrade] : "";
  const initialResolvedGrade = lockedGradeValue || (GRADE_OPTIONS.some((option) => option.value === initialGrade) ? initialGrade : "");
  const [query, setQuery] = useState(initialQuery);
  const [grade, setGrade] = useState(initialResolvedGrade);
  const [kind, setKind] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumResult[]>([]);
  const [lessons, setLessons] = useState<LessonResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchResponse["searchMode"]>();
  const searchedInitial = useRef(false);

  const search = useCallback(async (requestedQuery = query) => {
    const cleanedQuery = requestedQuery.trim();
    const activeGrade = lockedGradeValue || grade;
    if (cleanedQuery.length < 2) { setError("Enter at least two characters to search."); return; }
    const params = new URLSearchParams({ q: cleanedQuery });
    if (activeGrade) params.set("grade", activeGrade);
    if (kind) params.set("kind", kind);
    if (!lockedGrade) window.history.replaceState(null, "", `/search?${params.toString()}`);
    setLoading(true); setSearched(true); setError(null);
    try {
      const response = await fetch(`/api/search?${params.toString()}`);
      const payload = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(payload.error || "Search service did not return a usable response.");
      setResults(payload.results ?? []); setCurriculum(payload.curriculum ?? []); setLessons(payload.lessons ?? []); setSearchMode(payload.searchMode);
    } catch (searchError) {
      setResults([]); setCurriculum([]); setLessons([]);
      setError(searchError instanceof Error ? searchError.message : "Search failed.");
    } finally { setLoading(false); }
  }, [grade, kind, lockedGrade, lockedGradeValue, query]);

  useEffect(() => {
    if (searchedInitial.current || initialQuery.trim().length < 2) return;
    searchedInitial.current = true;
    void search(initialQuery);
  }, [initialQuery, search]);

  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void search(); }

  const resultCount = curriculum.length + lessons.length + results.length;
  const heading = lockedGrade ? `Find ${gradeLabel} lessons` : "Search curriculum and teaching resources";
  const summary = lockedGrade ? `Search stays inside ${gradeLabel} and keeps the grade filter applied.` : "Start with a topic, teaching goal, song, rhyme, activity, story, or classroom resource.";

  return (
    <div className="flex min-w-0 flex-col gap-6" data-search-scope={lockedGrade ? "grade" : "all"}>
      <Card className="material-surface material-cardboard-paper relative overflow-visible py-0">
        <span className="brand-asset fastener-paperclip icon-small pointer-events-none absolute -top-3 right-6" aria-hidden="true" />
        <CardHeader className="pt-8"><Badge className="w-fit" variant="secondary">{lockedGrade ? `${gradeLabel} search` : "Curriculum workroom"}</Badge><CardTitle className="font-heading text-3xl leading-none sm:text-4xl">{heading}</CardTitle><CardDescription>{summary}</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} role="search" aria-busy={loading}>
            <FieldGroup className="gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] lg:items-end">
              <Field><FieldLabel htmlFor={lockedGrade ? `search-${lockedGrade}` : "search-all"}>Search words</FieldLabel><Input id={lockedGrade ? `search-${lockedGrade}` : "search-all"} type="search" value={query} onChange={(event) => setQuery(event.target.value)} name="q" autoComplete="off" placeholder="Try ponies, counting, or a lesson goal" minLength={2} required /></Field>
              {lockedGrade ? null : <Field><FieldLabel htmlFor="search-grade">Grade</FieldLabel><NativeSelect id="search-grade" name="grade" value={grade} onChange={(event) => setGrade(event.target.value)}>{GRADE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</NativeSelect></Field>}
              <Field><FieldLabel htmlFor={lockedGrade ? `kind-${lockedGrade}` : "search-kind"}>Resource type</FieldLabel><NativeSelect id={lockedGrade ? `kind-${lockedGrade}` : "search-kind"} name="kind" value={kind} onChange={(event) => setKind(event.target.value)}><option value="">All resources</option><option value="song">Songs</option><option value="knowledge">Knowledge</option></NativeSelect></Field>
              <Field className="lg:w-auto"><Button type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</Button></Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {!searched ? <Empty className="material-surface material-cardboard-paper border"><EmptyHeader><EmptyTitle>Start with what you want to teach.</EmptyTitle><EmptyDescription>{lockedGrade ? `Try a classroom word, song, activity, or learning goal for ${gradeLabel}.` : "Try ponies, fingerplay, steady beat, or a learning goal."}</EmptyDescription></EmptyHeader></Empty> : loading ? <Card className="material-surface material-cardboard-paper"><CardHeader><CardTitle>Searching the curriculum collection…</CardTitle><CardDescription role="status">Finding curriculum topics, lesson drafts, and linked resources.</CardDescription></CardHeader></Card> : error ? <Empty className="material-surface material-cardboard-paper border" role="alert"><EmptyHeader><EmptyTitle>The search could not be completed.</EmptyTitle><EmptyDescription>{error}</EmptyDescription></EmptyHeader><Button type="button" onClick={() => void search()}>Try again</Button></Empty> : resultCount === 0 ? <Empty className="material-surface material-cardboard-paper border"><EmptyHeader><EmptyTitle>No matching curriculum or resources were found.</EmptyTitle><EmptyDescription>Try a shorter phrase or a broader teaching goal.</EmptyDescription></EmptyHeader></Empty> : <section className="flex min-w-0 flex-col gap-4" aria-live="polite"><header className="flex flex-wrap items-baseline justify-between gap-2"><div><Badge variant="outline">{searchMode === "hybrid-keyword-semantic" ? "Keyword + meaning search" : "Keyword search"}</Badge><h2 className="mt-2 font-heading text-3xl">{resultCount} matches</h2></div>{lockedGrade ? <p className="text-sm text-muted-foreground">Filtered to {gradeLabel}</p> : null}</header><div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {curriculum.map((topic) => <Card className="material-surface material-cardboard-paper relative overflow-visible" key={`topic:${topic.id}:${topic.grade_key}`}><span className="brand-asset fastener-push-pin icon-small pointer-events-none absolute -top-3 right-6" aria-hidden="true" /><CardHeader><Badge className="w-fit" variant="outline">Curriculum topic</Badge><CardTitle>{topicTitle(topic)}</CardTitle><CardDescription>{topicSummary(topic)}</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge variant="secondary">{topic.grade}</Badge><Badge variant="secondary">{topic.subject}</Badge>{topic.why_match ? <p className="w-full text-sm text-muted-foreground">{topic.why_match}</p> : null}</CardContent><CardFooter><Button asChild variant="outline"><Link href={topicHref(topic)}>Open topic</Link></Button></CardFooter></Card>)}
        {lessons.map((lesson) => <Card className="material-surface material-cardboard-paper" key={`lesson:${lesson.id}`}><CardHeader><Badge className="w-fit" variant="outline">Lesson draft</Badge><CardTitle>{lesson.title}</CardTitle><CardDescription>{lesson.summary || lesson.purpose || "No lesson summary is available."}</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge variant="secondary">{lesson.grade_band}</Badge><Badge variant="secondary">{lesson.subject}</Badge></CardContent><CardFooter><Button asChild variant="outline"><Link href={lessonHref({ slug: lesson.slug, grade: lesson.grade_band || "" })}>Open lesson</Link></Button></CardFooter></Card>)}
        {results.map((result) => <Card className="material-surface material-cardboard-paper" key={`resource:${result.kind}:${result.id}`}><CardHeader><Badge className="w-fit" variant="outline">{result.kind}</Badge><CardTitle>{result.title}</CardTitle><CardDescription>{resourcePreview(result)}</CardDescription></CardHeader>{result.href ? <CardFooter><Button asChild variant="outline"><a href={result.href} target="_blank" rel="noreferrer">Open resource</a></Button></CardFooter> : null}</Card>)}
      </div></section>}
      {onBack ? <Button type="button" variant="link" onClick={onBack}>← Back to today</Button> : null}
    </div>
  );
}
