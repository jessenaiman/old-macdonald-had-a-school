"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { TEACHER_GRADE_ITEMS } from "@/components/site-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { NativeSelect } from "@/components/ui/native-select";
import { ExternalLink, Search } from "lucide-react";
import { GRADE_SEARCH_VALUES, lessonHref, type GradeKey } from "@/lib/grade-routes";
import { cn } from "@/lib/utils";
import { WorkingWallBoard, WorkingWallNote } from "@/components/working-wall/WorkingWallComponents";

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
 * Search-domain workspace. The query sheet is a clipped paper work stage; the
 * answer is a working wall: curriculum topics pinned as numbered paper rows on
 * cork, lesson drafts clipped to a secondary sheet, linked resources listed on
 * a compact related-resources panel. Logic coordinates this site's API and URL state.
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
      <Card className="card-paper relative overflow-visible py-0">
        <span className="brand-asset fastener-paperclip icon-small pointer-events-none absolute -top-3 right-6" aria-hidden="true" />
        <CardHeader className="pt-8"><Badge className="w-fit" variant="secondary">{lockedGrade ? `${gradeLabel} search` : "Curriculum workroom"}</Badge><CardTitle className="font-heading text-3xl leading-none sm:text-4xl">{heading}</CardTitle><CardDescription>{summary}</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={submitSearch} role="search" aria-busy={loading}>
            <FieldGroup className="gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] lg:items-end">
              <Field>
                <FieldLabel htmlFor={lockedGrade ? `search-${lockedGrade}` : "search-all"}>Search words</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={lockedGrade ? `search-${lockedGrade}` : "search-all"}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    name="q"
                    autoComplete="off"
                    placeholder="Try ponies, counting, or a lesson goal"
                    minLength={2}
                    required
                  />
                </InputGroup>
              </Field>
              {lockedGrade ? null : <Field><FieldLabel htmlFor="search-grade">Grade</FieldLabel><NativeSelect id="search-grade" name="grade" value={grade} onChange={(event) => setGrade(event.target.value)}>{GRADE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</NativeSelect></Field>}
              <Field><FieldLabel htmlFor={lockedGrade ? `kind-${lockedGrade}` : "search-kind"}>Resource type</FieldLabel><NativeSelect id={lockedGrade ? `kind-${lockedGrade}` : "search-kind"} name="kind" value={kind} onChange={(event) => setKind(event.target.value)}><option value="">All resources</option><option value="song">Songs</option><option value="knowledge">Knowledge</option></NativeSelect></Field>
              <Field className="lg:w-auto"><Button className="min-h-[44px]" type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</Button></Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {!searched ? (
        <Empty className="card-paper relative border">
          <span className="brand-asset fastener-push-pin icon-small pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2" aria-hidden="true" />
          <EmptyHeader>
            <EmptyTitle>Start with what you want to teach.</EmptyTitle>
            <EmptyDescription>{lockedGrade ? `Try a classroom word, song, activity, or learning goal for ${gradeLabel}.` : "Try ponies, fingerplay, steady beat, or a learning goal."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : loading ? (
        <WorkingWallBoard aria-label="Search in progress">
          <WorkingWallNote fastener="pin" heading="Searching the curriculum collection…" role="status">
            <p className="leading-6">Finding curriculum topics, lesson drafts, and linked resources.</p>
          </WorkingWallNote>
        </WorkingWallBoard>
      ) : error ? (
        <Card className="card-paper relative overflow-visible" role="alert">
          <span className="brand-asset fastener-push-pin icon-small pointer-events-none absolute -top-3 right-6" aria-hidden="true" />
          <span className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-r-full bg-destructive" aria-hidden="true" />
          <CardHeader className="pt-8">
            <CardTitle className="font-heading text-2xl leading-tight text-[var(--rose-muted)]">The search could not be completed.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold leading-6">{error}</p>
          </CardContent>
        </Card>
      ) : resultCount === 0 ? (
        <Card className="card-paper relative overflow-visible" role="status">
          <span className="brand-asset fastener-push-pin icon-small pointer-events-none absolute -top-3 right-6" aria-hidden="true" />
          <CardHeader className="pt-8">
            <CardTitle className="font-heading text-2xl leading-tight">Nothing matched that search yet.</CardTitle>
            <CardDescription>{lockedGrade ? `Try a different ${gradeLabel} classroom word or song title.` : "Try a shorter phrase or a different classroom word."}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <section className="flex min-w-0 flex-col gap-5" aria-label="Search results">
          <header className="flex min-w-0 flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl">{resultCount} {resultCount === 1 ? "result" : "results"}</h2>
            {searchMode === "hybrid-keyword-semantic" ? <p className="max-w-2xl text-sm leading-6 text-foreground/70">Semantic search widened this list beyond your exact words, so skim the topics board even where wording differs.</p> : null}
          </header>
          {curriculum.length > 0 ? (
            <WorkingWallBoard aria-label="Matching curriculum topics">
              <h3 className="font-section text-lg leading-none sm:text-xl">Curriculum topics</h3>
              <ol className="grid gap-4">
                {curriculum.map((topic, index) => (
                  <li key={`topic:${topic.id}:${topic.grade_key}`}>
                    <Card className="material-surface material-cardboard-paper relative gap-3 px-4 py-4">
                      <span className="brand-asset fastener-push-pin icon-micro pointer-events-none absolute -top-2.5 left-6" aria-hidden="true" />
                      <div className="flex flex-wrap items-start gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground" aria-hidden="true">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black uppercase tracking-widest text-foreground/70">Curriculum topic · {topic.grade} · {topic.subject}</p>
                          <p className="font-heading text-xl leading-snug">{topicTitle(topic)}</p>
                        </div>
                        <Button asChild className="min-h-[44px]" variant="outline" size="sm"><Link href={topicHref(topic)}>Open topic</Link></Button>
                      </div>
                      <p className="text-sm leading-6 text-foreground/70">{topicSummary(topic)}</p>
                      {topic.why_match ? <p className="text-sm font-bold leading-6">{topic.why_match}</p> : null}
                    </Card>
                  </li>
                ))}
              </ol>
            </WorkingWallBoard>
          ) : null}
          {lessons.length > 0 || results.length > 0 ? (
            <div className={cn("grid min-w-0 gap-5", lessons.length > 0 && results.length > 0 && "lg:grid-cols-[minmax(0,1fr)_20rem]")}>
              {lessons.length > 0 ? (
                <section aria-label="Matching lesson drafts" className="min-w-0">
                  <Card className="card-paper relative h-full rounded-xl shadow-[5px_7px_0_color-mix(in_srgb,var(--border)_75%,transparent)]">
                    <span className="brand-asset fastener-binder-clip icon-small pointer-events-none absolute -top-4 left-6" aria-hidden="true" />
                    <CardHeader className="pt-9">
                      <h3 className="font-section text-lg leading-none sm:text-xl">Lesson drafts</h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-4">
                        {lessons.map((lesson) => (
                          <li key={`lesson:${lesson.id}`} className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black uppercase tracking-widest text-foreground/70">Lesson draft · {lesson.grade_band} · {lesson.subject}</p>
                              <p className="font-heading text-lg leading-snug">{lesson.title}</p>
                              <p className="text-sm leading-6 text-foreground/70">{lesson.summary || lesson.purpose || "No lesson summary is available."}</p>
                            </div>
                            <Button asChild className="min-h-[44px]" variant="outline" size="sm"><Link href={lessonHref({ slug: lesson.slug, grade: lesson.grade_band || "" })}>Open lesson</Link></Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              ) : null}
              {results.length > 0 ? (
                <Card className="card-paper h-fit" aria-label="Matching external resources">
                  <CardHeader>
                    <h3 className="font-section text-lg leading-none sm:text-xl">Linked resources</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3">
                      {results.map((result) => (
                        <li key={`resource:${result.kind}:${result.id}`} className="flex items-start gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-widest text-foreground/70">{result.kind}</p>
                            {result.href ? (
                              <a className="min-w-0 text-sm font-bold underline-offset-4 hover:underline" href={result.href} target="_blank" rel="noreferrer">
                                {result.title}<ExternalLink className="ml-1 inline size-3.5" aria-hidden="true" />
                              </a>
                            ) : (
                              <span className="min-w-0 text-sm font-bold">{result.title}</span>
                            )}
                            <p className="text-sm leading-6 text-foreground/70">{resourcePreview(result)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}
        </section>
      )}
      {onBack ? <Button type="button" variant="link" onClick={onBack}>← Back to today</Button> : null}
    </div>
  );
}
