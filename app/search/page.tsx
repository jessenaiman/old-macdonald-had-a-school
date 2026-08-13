"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GRADE_SEARCH_VALUES, lessonHref } from "@/lib/grade-routes";
import { TEACHER_GRADE_ITEMS } from "@/components/site-navigation";
import Link from "next/link";
import styles from "./SearchPage.module.css";

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
  const firstGrade = (topic.grade_key || "").split("|")[0] || "daycare";
  const slug = slugify(topic.lesson_topic);
  if (/^daycare$/.test(firstGrade)) return `/grade/daycare/${slug}`;
  if (/^preschool$/.test(firstGrade) || /^pre[- ]?school$/.test(firstGrade)) return `/grade/pre-school/${slug}`;
  if (/^kindergarten$/.test(firstGrade)) return `/grade/kindergarten/${slug}`;
  if (/^grade[- ]?1$/.test(firstGrade) || /^grade-one$/.test(firstGrade) || /^grade1$/.test(firstGrade)) return `/grade/grade-one/${slug}`;
  if (/^grade[- ]?2$/.test(firstGrade) || /^grade-two$/.test(firstGrade) || /^grade2$/.test(firstGrade)) return `/grade/grade-two/${slug}`;
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
  const selectedTitle = selectedTopic?.lesson_topic ?? selectedLesson?.title ?? "";
  const topicFigure = topicGuide(selectedTopic, selectedLesson);

  const songs = useMemo(() => results.filter((result) => result.kind === "song"), [results]);
  const videos = useMemo(() => results.filter(isVideo), [results]);
  const printouts = useMemo(() => results.filter(isPrintout), [results]);
  const totalCurriculum = curriculum.length + lessons.length;

  const activeResources = activeTab === "video" ? videos : activeTab === "printouts" ? printouts : songs;

  return (
    <div className={styles.page} data-style-scope="search-page">
        <section className={styles.searchSheet} aria-labelledby="search-title">
          <Image className={styles.emblem} src="/brand-emblem.png" alt="" width={86} height={86} priority />
          <div className={styles.headingCopy}>
            <p>Old MacDonald Had a School</p>
            <h1 id="search-title">Curriculum workroom</h1>
          </div>
          <form className={styles.searchForm} onSubmit={submitSearch} role="search" aria-busy={loading}>
            <label className={styles.srOnly} htmlFor="curriculum-search">Search curriculum and teaching resources</label>
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
          <div className={styles.filters} aria-label="Search filters">
            <label>
              <span>Grade</span>
              <NativeSelect name="grade" value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)}>
                {GRADE_OPTIONS.map((grade) => <option key={grade.value} value={grade.value}>{grade.label}</option>)}
              </NativeSelect>
            </label>
            <label>
              <span>Resource type</span>
              <NativeSelect name="kind" value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}>
                <option value="">All resources</option>
                <option value="song">Songs</option>
                <option value="knowledge">Knowledge</option>
              </NativeSelect>
            </label>
          </div>
        </section>

        {!searched ? (
          <section className={styles.welcomeState}>
            <span className="brand-asset fastener-push-pin icon-medium" aria-hidden="true" />
            <h2>Start with what you want to teach.</h2>
            <p>Search a topic, goal, song, rhyme, activity, story, or classroom resource.</p>
            <p className={styles.suggestions}>Try ...ponies lap rhymes..., ...fingerplay..., or ...word problems....</p>
          </section>
        ) : loading ? (
          <div className={styles.loadingState} role="status">Searching the curriculum collection...</div>
        ) : error ? (
          <section className={styles.errorState} role="alert">
            <h2>The search could not be completed.</h2>
            <p>{error}</p>
            <Button type="button" onClick={() => void search()}>Try again</Button>
          </section>
        ) : totalCurriculum === 0 && results.length === 0 ? (
          <section className={styles.emptyState}>
            <h2>No matching curriculum or resources were found.</h2>
            <p>Try a shorter phrase, another grade, or a broader resource type.</p>
          </section>
        ) : (
          <div className={styles.workspace}>
            <aside className={styles.resultsPanel} aria-label="Curriculum search results">
              <div className={styles.resultsHeading}>
                <div>
                  <p>Curriculum first</p>
                  <h2>{totalCurriculum} curriculum {totalCurriculum === 1 ? "result" : "results"}</h2>
                </div>
                <span>{results.length} related {results.length === 1 ? "resource" : "resources"}</span>
              </div>
              <p className={styles.searchProvenance} role="status">
                {searchStatus.database === "omhas.db" ? "Curriculum database connected" : "Curriculum index connected"}
                {searchStatus.searchMode === "hybrid-keyword-semantic"
                  ? " ... keyword + meaning search"
                  : " ... keyword search"}
              </p>

              {totalCurriculum > 0 ? (
                <ol className={styles.resultList}>
                  {curriculum.map((topic) => {
                    const key = `topic:${topic.id}:${topic.grade_key}`;
                    const detailHref = curriculumResultHref(topic);
                    return (
                      <li key={key}>
                        <Link
                          href={detailHref}
                          className={selectedKey === key ? `${styles.selectedResult}` : styles.resultButton}
                          onClick={() => {
                            setSelectedKey(key);
                          }}
                        >
                          <span className={styles.resultType}>Topic</span>
                          <span className={styles.resultBody}>
                            <strong>{topic.lesson_topic}</strong>
                            <span>{topic.skill_statement || "No topic summary has been reviewed yet."}</span>
                            {topic.why_match ? <small>{topic.why_match}</small> : null}
                          </span>
                          <span className={styles.resultMeta}>{topic.grade}<br />{topic.subject}{topic.pacing ? <><br />{topic.pacing}</> : null}</span>
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
                          className={selectedKey === key ? `${styles.selectedResult}` : styles.resultButton}
                          onClick={() => {
                            setSelectedKey(key);
                          }}
                        >
                          <span className={styles.resultType}>Lesson draft</span>
                          <span className={styles.resultBody}>
                            <strong>{lesson.title}</strong>
                            <span>{lesson.summary || "No lesson summary is available."}</span>
                          </span>
                          <span className={styles.resultMeta}>{lesson.grade_band}<br />{lesson.subject}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className={styles.noCurriculum}>
                  <strong>No curriculum topic matched this phrase.</strong>
                  <span>The related resource matches below may still help you refine the search.</span>
                </div>
              )}
            </aside>

            <aside className={styles.learningCrew} aria-label="Puddles and Rusty are excited to explore the curriculum">
              <span className={`${styles.crewTape} brand-asset fastener-washi-tape icon-medium`} aria-hidden="true" />
              <Image src="/staff_and_students/puddles-transparent-circle.png" alt="Puddles" width={118} height={118} />
              <Image src="/staff_and_students/rusty-transparent-circle.png" alt="Rusty" width={118} height={118} />
            </aside>

            <main className={styles.detailColumn}>
              {selectedTopic || selectedLesson ? (
                <>
                  <article className={styles.detailSheet}>
                    <span className={`${styles.tape} brand-asset fastener-washi-tape icon-large`} aria-hidden="true" />
                    <span className={`${styles.paperclip} brand-asset fastener-paperclip icon-medium`} aria-hidden="true" />
                    <header className={styles.detailHeader}>
                      <div>
                        <p>{selectedTopic ? "Selected curriculum topic" : "Selected database lesson draft"}</p>
                        <h2>{selectedTitle}</h2>
                        <div className={styles.detailTags}>
                          <span>{selectedTopic?.grade ?? selectedLesson?.grade_band}</span>
                          <span>{selectedTopic?.subject ?? selectedLesson?.subject}</span>
                          {selectedLesson ? <span>{selectedLesson.duration_minutes} minutes</span> : null}
                        </div>
                      </div>
                      {selectedTopic ? (
                        <Link href={curriculumResultHref(selectedTopic)} className={styles.primaryCtaLink}>Open topic</Link>
                      ) : selectedLesson ? (
                        <Link href={lessonResultHref(selectedLesson)} className={styles.primaryCtaLink}>Open lesson</Link>
                      ) : null}
                      {topicFigure ? (
                        <Image className={styles.topicFigure} src={topicFigure.src} alt={topicFigure.alt} width={154} height={154} />
                      ) : null}
                    </header>

                    <div className={styles.factGrid}>
                      <section>
                        <h3>{selectedTopic ? "Topic overview" : "Lesson summary"}</h3>
                        <p>{selectedTopic?.skill_statement || selectedLesson?.summary || "No reviewed overview is available for this record."}</p>
                      </section>
                      <section>
                        <h3>{selectedTopic ? "Curriculum placement" : "Teaching purpose"}</h3>
                        <p>{selectedTopic ? `${selectedTopic.grade} ... ${selectedTopic.subject}${selectedTopic.pacing ? ` ... ${selectedTopic.pacing}` : ""}` : selectedLesson?.purpose || "No purpose is available."}</p>
                      </section>
                      <section>
                        <h3>Related standards</h3>
                        <p>{selectedTopic?.standards || "No standard is attached to this result."}</p>
                      </section>
                      <section>
                        <h3>Search-related materials</h3>
                        <ul>
                          <li>{videos.length} video {videos.length === 1 ? "match" : "matches"}</li>
                          <li>{songs.length} song or rhyme {songs.length === 1 ? "match" : "matches"}</li>
                          <li>{printouts.length} printable {printouts.length === 1 ? "match" : "matches"}</li>
                        </ul>
                      </section>
                    </div>

                    <section className={styles.reviewStatus}>
                      <h3>Source and review status</h3>
                      {selectedLesson ? (
                        <p>Editorial status: {readableStatus(selectedLesson.editorial_status)}. Review state: {readableStatus(selectedLesson.review_state)}.</p>
                      ) : (
                        <p>Review status is not stored on this curriculum topic record. Confirm the source and standard before classroom use.</p>
                      )}
                    </section>
                  </article>

                  <Tabs className={styles.resourceShelf} value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceTab)}>
                    <TabsList className={styles.tabList} aria-label="Teaching material previews">
                      {(["video", "songs", "printouts"] as const).map((tab) => (
                        <TabsTrigger
                          key={tab}
                          className={activeTab === tab ? styles.activeTab : styles.tab}
                          value={tab}
                        >
                          {tab === "songs" ? "Songs & Spotify" : tab[0].toUpperCase() + tab.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent className={styles.resourceContent} value={activeTab}>
                      <h2 id="resources-title" className={styles.srOnly}>Search-related teaching materials</h2>
                      {activeResources.length > 0 ? (
                    <div className={styles.resourceGrid}>
                      {activeResources.slice(0, 6).map((resource) => (
                        <article key={resource.id} className={styles.resourceCard}>
                          <p>{resource.kind}</p>
                          <h3>{readableResourceTitle(resource.title)}</h3>
                          <span>{plainText(resource.excerpt) || "No preview is available."}</span>
                          {resource.meta.ageRange || resource.meta.domain ? (
                            <span>{[readableMetadata(resource.meta.ageRange), readableMetadata(resource.meta.domain)].filter(Boolean).join(" ... ")}</span>
                          ) : null}
                          {activeTab === "songs" && resource.lyrics ? (
                            <details>
                              <summary>Preview lyrics</summary>
                              <pre>{resource.lyrics}</pre>
                            </details>
                          ) : null}
                          {resource.href ? (
                            <a href={resource.href} target="_blank" rel="noreferrer">
                              {activeTab === "songs" ? "Open song page" : "Open source"}
                            </a>
                          ) : activeTab === "songs" && resource.meta.spotifyUrl?.startsWith("https://") ? (
                            <a href={resource.meta.spotifyUrl} target="_blank" rel="noreferrer">Open Spotify source</a>
                          ) : null}
                        </article>
                      ))}
                        </div>
                      ) : (
                        <div className={styles.resourceEmpty}>
                          <strong>No {activeTab === "songs" ? "song or Spotify" : activeTab} preview is attached.</strong>
                          <span>The database record is preserved, but this material type has not been linked or reviewed yet.</span>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <section className={styles.resourceOnlyState}>
                  <span className="brand-asset fastener-binder-clip icon-medium" aria-hidden="true" />
                  <h2>Related resources were found, but no curriculum topic matched.</h2>
                  <p>Use a grade filter or a broader teaching goal to find a curriculum starting point.</p>
                </section>
              )}
            </main>
          </div>
        )}
    </div>
  );
}
