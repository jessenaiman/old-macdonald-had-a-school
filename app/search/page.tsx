"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GRADE_SEARCH_VALUES, lessonHref } from "@/lib/grade-routes";
import { cn } from "@/lib/utils";
import { TEACHER_GRADE_ITEMS } from "@/components/site-navigation";
import Link from "next/link";

interface SearchResult {
  id: string;
  kind: string;
  title: string;
  excerpt: string | null;
  lyrics: string | null;
  instructions: string | null;
  sourcePath: string;
  meta: Record<string, string>;
  url: string | null;
  href: string | null;
}

interface CurriculumResult {
  id: string;
  grade_key: string;
  grade: string;
  subject: string;
  lesson_topic: string;
  skill_statement: string | null;
  standards: string | null;
  tags?: string | null;
  matched_terms?: string[];
  why_match?: string;
  pacing?: string | null;
  suggested_plan?: string | null;
  planning_windows?: string[];
}

interface LessonResult {
  id: string;
  slug: string;
  title: string;
  subject: string;
  grade_band: string;
  summary: string;
  purpose: string;
  duration_minutes: number | null;
  editorial_status: string;
  review_state: string;
  topic_id: number | null;
  song_count: number;
  resource_count: number;
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-{2,}/g, "-");
}

function curriculumResultHref(topic: CurriculumResult) {
  const slug = slugify(topic.lesson_topic);
  // Normalized curriculum topics are rendered by the canonical topic route.
  // Grade routes serve a different lesson-draft model and can legitimately be absent.
  return `/topics/${slug}`;
}

function lessonResultHref(lesson: LessonResult) {
  return lessonHref({ slug: lesson.slug, grade: lesson.grade_band || "" });
}

interface SearchResponse {
  results?: SearchResult[];
  curriculum?: CurriculumResult[];
  lessons?: LessonResult[];
  total?: number;
  searchMode?: "structured-keyword" | "hybrid-keyword-semantic";
  semanticModel?: string | null;
  database?: string;
  error?: string;
}

type ResourceTab = "video" | "songs" | "printouts";

const GRADE_OPTIONS = [
  { value: "", label: "All grades" },
  ...TEACHER_GRADE_ITEMS.map(({ key, label }) => ({ value: GRADE_SEARCH_VALUES[key], label })),
] as const;

function plainText(value: string | null | undefined) {
  return value?.replace(/<[^>]+>/g, "").replace(/&hellip;/g, "...") ?? "";
}

function readableStatus(value: string | undefined) {
  return value ? value.replaceAll("_", " ") : "Not available";
}

function readableResourceTitle(value: string) {
  const cleaned = value
    .replace(/html$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readableMetadata(value: string | undefined) {
  return value
    ?.replace(/^"+|"+$/g, "")
    .replaceAll("...??", "...")
    .replaceAll("...??", "...")
    .trim();
}

function topicGuide(topic: CurriculumResult | undefined, lesson: LessonResult | undefined) {
  const title = `${topic?.lesson_topic ?? lesson?.title ?? ""} ${topic?.subject ?? lesson?.subject ?? ""}`.toLowerCase();
  const grades = (topic?.grade ?? lesson?.grade_band ?? "").toLowerCase();
  if (/pony|horse|dance|movement|music|rhythm|beat/.test(title)) {
    return { src: "/staff_and_students/mr-rusty-transparent-circle.png", alt: "Mr Rusty, the dance and rhythm teacher" };
  }
  if (/math|count|measure|pattern|science|build/.test(title)) {
    return { src: "/staff_and_students/mr-sam-transparent-circle.png", alt: "Mr Sam, the math, science, and building teacher" };
  }
  if (/story|drama|language|literacy|rhyme|imagination/.test(title)) {
    return { src: "/staff_and_students/miss-hayley-transparent-circle.png", alt: "Miss Hayley, the story, song, and drama teacher" };
  }
  if (/daycare|preschool/.test(grades)) {
    return { src: "/staff_and_students/miss-puddles-transparent-circle.png", alt: "Miss Puddles, the early-years teacher" };
  }
  return null;
}

function isVideo(result: SearchResult) {
  const haystack = `${result.meta.contentKind ?? ""} ${result.sourcePath}`.toLowerCase();
  return /video|youtube|vimeo|\.mp4|\.mov/.test(haystack);
}

function isPrintout(result: SearchResult) {
  const haystack = `${result.meta.contentKind ?? ""} ${result.sourcePath}`.toLowerCase();
  return /printable|worksheet|printout|\.pdf/.test(haystack);
}

function isSong(result: SearchResult) {
  return result.kind === "song" || /spotify/.test(`${result.meta.contentKind ?? ""} ${result.href ?? ""}`.toLowerCase());
}

function topicMaterialResults(topic: CurriculumResult): SearchResult[] {
  const materials = (topic as CurriculumResult & {
    linked_materials?: Array<{
      id: string;
      kind: string;
      title: string;
      url: string | null;
      preview: string | null;
      teacher_rationale: string;
    }>;
  }).linked_materials ?? [];
  return materials.map((material) => ({
    id: `topic-${topic.id}-${material.id}`,
    kind: material.kind,
    title: material.title,
    lyrics: material.kind === "song" ? material.preview : null,
    excerpt: material.teacher_rationale,
    sourcePath: material.url ?? "",
    href: material.url,
    meta: { contentKind: material.kind },
  } as unknown as SearchResult));
}

function teacherFacingTopicTitle(topic: CurriculumResult) {
  return (topic as CurriculumResult & { teacher_title?: string | null }).teacher_title || topic.lesson_topic;
}

function teacherFacingTopicSummary(topic: CurriculumResult) {
  return (topic as CurriculumResult & { teacher_summary?: string | null }).teacher_summary || topic.skill_statement;
}

export default function SearchPage() {
  const initialSearchApplied = useRef(false);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumResult[]>([]);
  const [lessons, setLessons] = useState<LessonResult[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ResourceTab>("songs");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<Pick<SearchResponse, "searchMode" | "semanticModel" | "database">>({});

  const search = useCallback(async (requestedQuery?: string, requestedGrade?: string) => {
    const cleanedQuery = (requestedQuery ?? query).trim();
    const selectedGrade = requestedGrade ?? gradeFilter;
    if (cleanedQuery.length < 2) return;

    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: cleanedQuery });
      if (kindFilter) params.set("kind", kindFilter);
      if (selectedGrade) params.set("grade", selectedGrade);
      window.history.replaceState(null, "", `/search?${params.toString()}`);
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error("Search service did not return a usable response.");
      const baseResponse = await response.json() as SearchResponse;
      const nextCurriculum = baseResponse.curriculum ?? [];
      const nextLessons = baseResponse.lessons ?? [];
      setResults(baseResponse.results ?? []);
      setCurriculum(nextCurriculum);
      setLessons(nextLessons);
      setSearchStatus({
        searchMode: baseResponse.searchMode,
        semanticModel: baseResponse.semanticModel,
        database: baseResponse.database,
      });
      setSelectedKey(
        nextCurriculum[0]
          ? `topic:${nextCurriculum[0].id}:${nextCurriculum[0].grade_key}`
          : nextLessons[0]
            ? `lesson:${nextLessons[0].id}`
            : null,
      );
      setActiveTab("songs");
    } catch (searchError) {
      setResults([]);
      setCurriculum([]);
      setLessons([]);
      setSelectedKey(null);
      setSearchStatus({});
      setError(searchError instanceof Error ? searchError.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }, [gradeFilter, kindFilter, query]);

  useEffect(() => {
    if (initialSearchApplied.current) return;

    const initialParams = new URLSearchParams(window.location.search);
    const initialQuery = (initialParams.get("q") ?? initialParams.get("cue") ?? "").trim();
    const initialGrade = initialParams.get("grade") ?? "";
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      initialSearchApplied.current = true;
      if (initialGrade && GRADE_OPTIONS.some((option) => option.value === initialGrade)) {
        setGradeFilter(initialGrade);
      }
      if (initialQuery.length < 2) return;
      setQuery(initialQuery);
      void search(initialQuery, initialGrade);
    });

    return () => {
      cancelled = true;
    };
  }, [search]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void search();
  }

  const selectedTopic = curriculum.find(
    (topic) => selectedKey === `topic:${topic.id}:${topic.grade_key}`,
  );
  const selectedLesson = lessons.find((lesson) => selectedKey === `lesson:${lesson.id}`);
  const selectedTitle = selectedTopic ? teacherFacingTopicTitle(selectedTopic) : selectedLesson?.title ?? "";
  const topicFigure = topicGuide(selectedTopic, selectedLesson);

  const materialPool = selectedTopic ? topicMaterialResults(selectedTopic) : results;
  const songs = materialPool.filter(isSong);
  const videos = materialPool.filter((result) => isVideo(result) || result.meta.contentKind === "activity");
  const printouts = materialPool.filter(isPrintout);
  const totalCurriculum = curriculum.length + lessons.length;

  const activeResources = activeTab === "video" ? videos : activeTab === "printouts" ? printouts : songs;

  return (
    <div className="material-surface material-cork flex flex-col gap-6 px-3 py-6 text-foreground sm:px-6 lg:px-10" data-style-scope="search-page">
        <Card className="material-surface material-cardboard-paper mx-auto w-full max-w-screen-2xl">
          <CardContent className="grid items-center gap-4 md:grid-cols-2 lg:grid-cols-[auto_1fr_2fr_auto]">
          <Image className="size-16 rounded-full object-cover" src="/brand-emblem.png" alt="" width={86} height={86} priority />
          <div className="min-w-0">
            <p className="font-heading text-lg">Old MacDonald Had a School</p>
            <h1 className="type-eyebrow text-muted-foreground" id="search-title">Curriculum workroom</h1>
          </div>
          <form className="flex min-w-0 flex-col gap-2 sm:flex-row" onSubmit={submitSearch} role="search" aria-busy={loading}>
            <label className="sr-only" htmlFor="curriculum-search">Search curriculum and teaching resources</label>
            <Input
              id="curriculum-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              name="q"
              autoComplete="off"
              placeholder="Try ponies, counting, or a lesson goal..."
              minLength={2}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
          <div className="flex flex-wrap gap-3" aria-label="Search filters">
            <label className="flex min-w-32 flex-1 flex-col gap-1 text-xs font-bold">
              <span className="text-muted-foreground">Grade</span>
              <NativeSelect name="grade" value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)}>
                {GRADE_OPTIONS.map((grade) => <option key={grade.value} value={grade.value}>{grade.label}</option>)}
              </NativeSelect>
            </label>
            <label className="flex min-w-32 flex-1 flex-col gap-1 text-xs font-bold">
              <span className="text-muted-foreground">Resource type</span>
              <NativeSelect name="kind" value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}>
                <option value="">All resources</option>
                <option value="song">Songs</option>
                <option value="knowledge">Knowledge</option>
              </NativeSelect>
            </label>
          </div>
          </CardContent>
        </Card>

        {!searched ? (
          <Empty className="material-surface material-cardboard-paper mx-auto w-full max-w-3xl border">
            <span className="brand-asset fastener-push-pin icon-medium" aria-hidden="true" />
            <EmptyHeader><EmptyTitle>Start with what you want to teach.</EmptyTitle><EmptyDescription>Search a topic, goal, song, rhyme, activity, story, or classroom resource.</EmptyDescription></EmptyHeader>
            <EmptyDescription>Try ponies lap rhymes, fingerplay, or word problems.</EmptyDescription>
          </Empty>
        ) : loading ? (
          <Card className="mx-auto w-full max-w-3xl"><CardContent className="py-10 text-center font-bold" role="status">Searching the curriculum collection...</CardContent></Card>
        ) : error ? (
          <Empty className="mx-auto w-full max-w-3xl border" role="alert"><EmptyHeader><EmptyTitle>The search could not be completed.</EmptyTitle><EmptyDescription>{error}</EmptyDescription></EmptyHeader><Button type="button" onClick={() => void search()}>Try again</Button></Empty>
        ) : totalCurriculum === 0 && results.length === 0 ? (
          <Empty className="mx-auto w-full max-w-3xl border"><EmptyHeader><EmptyTitle>No matching curriculum or resources were found.</EmptyTitle><EmptyDescription>Try a shorter phrase, another grade, or a broader resource type.</EmptyDescription></EmptyHeader></Empty>
        ) : (
          <div className="mx-auto grid w-full max-w-screen-2xl items-start gap-6 lg:grid-cols-[minmax(20rem,27rem)_minmax(0,1fr)]">
            <Card className="material-surface material-cardboard-paper overflow-hidden lg:sticky lg:top-24" aria-label="Curriculum search results">
              <CardHeader className="flex-row items-end justify-between gap-4 border-b">
                <div>
                  <p className="type-eyebrow text-muted-foreground">Curriculum first</p>
                  <CardTitle>{totalCurriculum} curriculum {totalCurriculum === 1 ? "result" : "results"}</CardTitle>
                </div>
                <span className="text-right text-xs text-muted-foreground">{results.length} related {results.length === 1 ? "resource" : "resources"}</span>
              </CardHeader>
              <p className="border-b px-6 py-2 text-xs font-bold text-muted-foreground" role="status">
                {searchStatus.database === "omhas.db" ? "Curriculum database connected" : "Curriculum index connected"}
                {searchStatus.searchMode === "hybrid-keyword-semantic"
                  ? " ... keyword + meaning search"
                  : " ... keyword search"}
              </p>

              {totalCurriculum > 0 ? (
                <ol className="flex max-h-[calc(100vh-14rem)] flex-col gap-2 overflow-y-auto p-2">
                  {curriculum.map((topic) => {
                    const key = `topic:${topic.id}:${topic.grade_key}`;
                    const detailHref = curriculumResultHref(topic);
                    return (
                      <li key={key}>
                        <Link
                          href={detailHref}
                          className={cn("grid min-h-20 grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground sm:grid-cols-[auto_minmax(0,1fr)_auto]", selectedKey === key && "border-primary bg-accent text-accent-foreground")}
                          onClick={() => {
                            setSelectedKey(key);
                          }}
                        >
                          <span className="type-eyebrow text-muted-foreground">Topic</span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <strong className="font-heading text-lg">{teacherFacingTopicTitle(topic)}</strong>
                            <span className="text-sm text-muted-foreground">{teacherFacingTopicSummary(topic) || "No topic summary has been reviewed yet."}</span>
                            {topic.why_match ? <small>{topic.why_match}</small> : null}
                          </span>
                          <span className="col-start-2 text-xs text-muted-foreground sm:col-auto sm:text-right">{topic.grade}<br />{topic.subject}{topic.suggested_plan ? <><br />Suggested: {topic.suggested_plan}</> : topic.pacing ? <><br />Recorded pacing: {topic.pacing}</> : null}</span>
                        </Link>
                      </li>
                    );
                  })}
                  {lessons.map((lesson) => {
                    const key = `lesson:${lesson.id}`;
                    const detailHref = lessonResultHref(lesson);
                    return (
                      <li key={key}>
                        <Link
                          href={detailHref}
                          className={cn("grid min-h-20 grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground sm:grid-cols-[auto_minmax(0,1fr)_auto]", selectedKey === key && "border-primary bg-accent text-accent-foreground")}
                          onClick={() => {
                            setSelectedKey(key);
                          }}
                        >
                          <span className="type-eyebrow text-muted-foreground">Lesson draft</span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <strong className="font-heading text-lg">{lesson.title}</strong>
                            <span className="text-sm text-muted-foreground">{lesson.summary || "No lesson summary is available."}</span>
                          </span>
                          <span className="col-start-2 text-xs text-muted-foreground sm:col-auto sm:text-right">{lesson.grade_band}<br />{lesson.subject}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <Empty><EmptyHeader><EmptyTitle>No curriculum topic matched this phrase.</EmptyTitle><EmptyDescription>The related resource matches below may still help you refine the search.</EmptyDescription></EmptyHeader></Empty>
              )}
            </Card>

            <div className="min-w-0">
              {selectedTopic || selectedLesson ? (
                <>
                  <Card className="material-surface material-cardboard-paper">
                    <CardHeader className="flex-row flex-wrap items-end justify-between gap-6 border-b">
                      <div>
                        <p className="type-eyebrow text-muted-foreground">{selectedTopic ? "Selected curriculum topic" : "Selected database lesson draft"}</p>
                        <CardTitle className="mt-2 text-3xl">{selectedTitle}</CardTitle>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border px-3 py-1">{selectedTopic?.grade ?? selectedLesson?.grade_band}</span>
                          <span className="rounded-full border px-3 py-1">{selectedTopic?.subject ?? selectedLesson?.subject}</span>
                          {selectedLesson ? <span className="rounded-full border px-3 py-1">{selectedLesson.duration_minutes} minutes</span> : null}
                        </div>
                      </div>
                      {selectedTopic ? (
                        <Button asChild variant="outline"><Link href={curriculumResultHref(selectedTopic)}>Open topic</Link></Button>
                      ) : selectedLesson ? (
                        <Button asChild variant="outline"><Link href={lessonResultHref(selectedLesson)}>Open lesson</Link></Button>
                      ) : null}
                      {topicFigure ? (
                        <Image className="size-28 object-contain object-bottom" src={topicFigure.src} alt={topicFigure.alt} width={154} height={154} />
                      ) : null}
                    </CardHeader>

                    <CardContent className="grid gap-6 py-6 md:grid-cols-2 xl:grid-cols-4">
                      <section className="flex flex-col gap-2">
                        <h3 className="font-heading text-lg">{selectedTopic ? "Topic overview" : "Lesson summary"}</h3>
                        <p>{selectedTopic ? teacherFacingTopicSummary(selectedTopic) || "No reviewed overview is available for this record." : selectedLesson?.summary || "No reviewed overview is available for this record."}</p>
                      </section>
                      <section className="flex flex-col gap-2">
                        <h3 className="font-heading text-lg">{selectedTopic ? "Curriculum placement" : "Teaching purpose"}</h3>
                        <p>{selectedTopic ? `${selectedTopic.grade} ... ${selectedTopic.subject}${selectedTopic.suggested_plan ? ` ... Suggested in ${selectedTopic.suggested_plan}` : selectedTopic.pacing ? ` ... Recorded pacing: ${selectedTopic.pacing}` : ""}` : selectedLesson?.purpose || "No purpose is available."}</p>
                      </section>
                      <section className="flex flex-col gap-2">
                        <h3 className="font-heading text-lg">Curriculum reference</h3>
                        {selectedTopic ? (
                          <details>
                            <summary>Read the official curriculum wording</summary>
                            <p>{selectedTopic.lesson_topic}{selectedTopic.standards ? ` ${selectedTopic.standards}` : ""}</p>
                          </details>
                        ) : <p>No standard is attached to this result.</p>}
                      </section>
                    <section className="flex flex-col gap-2">
                        <h3 className="font-heading text-lg">Linked lesson materials</h3>
                        <ul className="list-disc pl-5">
                          <li>{videos.length} video or activity {videos.length === 1 ? "link" : "links"}</li>
                          <li>{songs.length} song or rhyme {songs.length === 1 ? "match" : "matches"}</li>
                          <li>{printouts.length} printable {printouts.length === 1 ? "match" : "matches"}</li>
                        </ul>
                      </section>
                    </CardContent>

                    <CardFooter className="flex-col items-start gap-2 border-t">
                      <h3 className="font-heading text-lg">Source and review status</h3>
                      {selectedLesson ? (
                        <p>Editorial status: {readableStatus(selectedLesson.editorial_status)}. Review state: {readableStatus(selectedLesson.review_state)}.</p>
                      ) : (
                        <p>Review status is not stored on this curriculum topic record. Confirm the source and standard before classroom use.</p>
                      )}
                    </CardFooter>
                  </Card>

                  <Tabs className="mt-6" value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceTab)}>
                    <TabsList aria-label="Teaching material previews">
                      {(["video", "songs", "printouts"] as const).map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                        >
                          {tab === "songs" ? "Songs & Spotify" : tab === "video" ? "Videos & activities" : "Printouts"}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value={activeTab}>
                      <h2 id="resources-title" className="sr-only">Search-related teaching materials</h2>
                      {activeResources.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {activeResources.slice(0, 6).map((resource) => (
                        <Card key={resource.id}>
                          <CardHeader><p className="type-eyebrow text-muted-foreground">{resource.kind}</p><CardTitle>{readableResourceTitle(resource.title)}</CardTitle></CardHeader>
                          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                          <span>{plainText(resource.excerpt) || "No preview is available."}</span>
                          {resource.meta.ageRange || resource.meta.domain ? (
                            <span>{[readableMetadata(resource.meta.ageRange), readableMetadata(resource.meta.domain)].filter(Boolean).join(" ... ")}</span>
                          ) : null}
                          {activeTab === "songs" && resource.lyrics ? (
                            <details className="text-foreground">
                              <summary>Preview lyrics</summary>
                              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs">{resource.lyrics}</pre>
                            </details>
                          ) : null}
                          {resource.href ? (
                            <a className="font-bold text-primary underline underline-offset-4" href={resource.href} target="_blank" rel="noreferrer">
                              {activeTab === "songs" ? "Open song page" : "Open source"}
                            </a>
                          ) : activeTab === "songs" && resource.meta.spotifyUrl?.startsWith("https://") ? (
                            <a className="font-bold text-primary underline underline-offset-4" href={resource.meta.spotifyUrl} target="_blank" rel="noreferrer">Open Spotify source</a>
                          ) : null}
                          </CardContent>
                        </Card>
                      ))}
                        </div>
                      ) : (
                        <Empty><EmptyHeader><EmptyTitle>No {activeTab === "songs" ? "song or Spotify" : activeTab === "video" ? "video or activity" : activeTab} link is attached.</EmptyTitle><EmptyDescription>This lesson currently has no reviewed link for this material type.</EmptyDescription></EmptyHeader></Empty>
                      )}
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <Empty className="material-surface material-cardboard-paper border">
                  <span className="brand-asset fastener-binder-clip icon-medium" aria-hidden="true" />
                  <EmptyHeader><EmptyTitle>Related resources were found, but no curriculum topic matched.</EmptyTitle><EmptyDescription>Use a grade filter or a broader teaching goal to find a curriculum starting point.</EmptyDescription></EmptyHeader>
                </Empty>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
