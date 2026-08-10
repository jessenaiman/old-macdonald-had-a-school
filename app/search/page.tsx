"use client";

import { useState, useCallback } from "react";
import { SiteShell } from "../../components/SiteShell";

interface SearchResult {
  id: string;
  kind: string;
  title: string;
  excerpt: string;
  lyrics: string | null;
  instructions: string | null;
  sourcePath: string;
  meta: Record<string, string>;
}

interface CurriculumResult {
  id: string;
  grade_key: string;
  grade: string;
  subject: string;
  lesson_topic: string;
  skill_statement: string | null;
  standards: string | null;
}

interface LessonResult {
  id: number;
  slug: string;
  title: string;
  subject: string;
  grade_band: string;
  summary: string;
  purpose: string;
  duration_minutes: number;
  editorial_status: string;
  review_state: string;
  topic_id: number;
  song_count: number;
  resource_count: number;
}

interface SearchResponse {
  results: SearchResult[];
  curriculum: CurriculumResult[];
  lessons: LessonResult[];
  total: number;
  error?: string;
}

const KIND_LABELS: Record<string, string> = {
  song: "🎵 Song",
  knowledge: "📚 Knowledge",
  lesson: "📖 Lesson",
  source: "📄 Source",
  grade_level: "🏫 Grade",
};

const KIND_COLORS: Record<string, string> = {
  song: "#e8f5e9",
  knowledge: "#e3f2fd",
  lesson: "#fff3e0",
  source: "#f3e5f5",
  grade_level: "#fce4ec",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumResult[]>([]);
  const [lessons, setLessons] = useState<LessonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    if (query.trim().length < 2) return;
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({ q: query });
      if (kindFilter) params.set("kind", kindFilter);
      if (gradeFilter) params.set("grade", gradeFilter);

      const res = await fetch(`/api/search?${params}`);
      const data: SearchResponse = await res.json();

      setResults(data.results || []);
      setCurriculum(data.curriculum || []);
      setLessons(data.lessons || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [query, kindFilter, gradeFilter]);

  return (
    <SiteShell active="home">
      <div className="search-page" style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-farm-display)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Search the Music &amp; Curriculum Database
          </h1>
          <p style={{ color: "var(--text-muted, #666)", fontSize: "1.1rem" }}>
            Find songs, lyrics, teaching instructions, and curriculum topics across all grade levels.
          </p>
        </header>

        {/* Search bar */}
        <div className="search-bar" style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search for songs, topics, lyrics, instructions…"
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "1.1rem",
              border: "2px solid var(--border-color, #ddd)",
              borderRadius: "0.5rem",
              fontFamily: "var(--font-farm-body)",
            }}
          />
          <button
            onClick={search}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 700,
              background: "var(--brand-primary, #2d5a1f)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontFamily: "var(--font-farm-body)",
            }}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Filters */}
        <div className="search-filters" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #ccc" }}
          >
            <option value="">All types</option>
            <option value="song">Songs</option>
            <option value="knowledge">Knowledge</option>
          </select>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #ccc" }}
          >
            <option value="">All grades</option>
            <option value="daycare">Daycare</option>
            <option value="preschool">Preschool</option>
            <option value="kindergarten">Kindergarten</option>
            <option value="grade-1">Grade 1</option>
            <option value="grade-2">Grade 2</option>
            <option value="grade-3">Grade 3</option>
          </select>
        </div>

        {/* Results */}
        {searched && !loading && (
          <div className="search-results">
            {results.length === 0 && curriculum.length === 0 && lessons.length === 0 ? (
              <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                No results found. Try different keywords.
              </p>
            ) : (
              <>
                {results.length > 0 && (
                  <p style={{ marginBottom: "1rem", color: "#666" }}>
                    Found {results.length} song/knowledge results
                  </p>
                )}

                {results.map((r) => (
                  <div
                    key={r.id}
                    className="search-result-card"
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      marginBottom: "1rem",
                      background: KIND_COLORS[r.kind] || "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontFamily: "var(--font-farm-display)", fontSize: "1.2rem", margin: 0 }}>
                        {KIND_LABELS[r.kind] || r.kind} {r.title}
                      </h3>
                      {r.meta?.ageRange && (
                        <span style={{ fontSize: "0.85rem", color: "#666" }}>{r.meta.ageRange}</span>
                      )}
                    </div>

                    <p
                      className="search-excerpt"
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                      style={{ fontSize: "0.95rem", color: "#444", marginBottom: "0.5rem" }}
                    />

                    {r.lyrics && (
                      <details style={{ marginBottom: "0.5rem" }}>
                        <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                          🎵 Lyrics
                        </summary>
                        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", padding: "0.5rem", background: "rgba(255,255,255,0.6)", borderRadius: "0.25rem" }}>
                          {r.lyrics}
                        </pre>
                      </details>
                    )}

                    {r.instructions && (
                      <details style={{ marginBottom: "0.5rem" }}>
                        <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                          ✋ Teaching Instructions
                        </summary>
                        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", padding: "0.5rem", background: "rgba(255,255,255,0.6)", borderRadius: "0.25rem" }}>
                          {r.instructions}
                        </pre>
                      </details>
                    )}

                    <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>
                      Source: {r.sourcePath}
                    </div>
                  </div>
                ))}

                {lessons.length > 0 && (
                  <>
                    <h2 style={{ fontFamily: "var(--font-farm-display)", marginTop: "2rem", marginBottom: "1rem" }}>
                      Lesson drafts from the curriculum database
                    </h2>
                    {lessons.map((lesson) => (
                      <article
                        key={lesson.id}
                        style={{
                          border: "2px solid var(--brand-primary, #2d5a1f)",
                          borderRadius: "0.75rem",
                          padding: "1rem",
                          marginBottom: "1rem",
                          background: "#fffdf6",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                          <h3 style={{ margin: 0, fontFamily: "var(--font-farm-display)" }}>{lesson.title}</h3>
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            {lesson.grade_band} · {lesson.subject}
                          </span>
                        </div>
                        <p style={{ margin: "0.75rem 0 0.5rem" }}>{lesson.summary}</p>
                        <p style={{ margin: "0 0 0.75rem", color: "#555", fontSize: "0.92rem" }}>
                          <strong>Teaching purpose:</strong> {lesson.purpose}
                        </p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#666" }}>
                          <span>{lesson.duration_minutes} minutes</span>
                          <span>{lesson.song_count} song links</span>
                          <span>{lesson.resource_count} other resource links</span>
                          <span>{lesson.review_state.replaceAll("_", " ")}</span>
                        </div>
                      </article>
                    ))}
                  </>
                )}

                {/* Curriculum topic results */}
                {curriculum.length > 0 && (
                  <>
                    <h2 style={{ fontFamily: "var(--font-farm-display)", marginTop: "2rem", marginBottom: "1rem" }}>
                      📋 Curriculum Topics
                    </h2>
                    {curriculum.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "0.5rem",
                          padding: "1rem",
                          marginBottom: "0.5rem",
                          background: "#fafafa",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>{t.lesson_topic}</strong>
                          <span style={{ fontSize: "0.85rem", color: "#666" }}>
                            {t.grade} · {t.subject}
                          </span>
                        </div>
                        {t.skill_statement && (
                          <p style={{ fontSize: "0.9rem", color: "#555", margin: "0.25rem 0" }}>
                            {t.skill_statement}
                          </p>
                        )}
                        {t.standards && (
                          <p style={{ fontSize: "0.8rem", color: "#999" }}>Standards: {t.standards}</p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {!searched && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Start typing to search</p>
            <p style={{ fontSize: "0.9rem" }}>
              Try: &quot;Humpty Dumpty&quot;, &quot;counting&quot;, &quot;baby bounce&quot;, &quot;fingerplay&quot;, &quot;circle game&quot;
            </p>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
