import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEMANTIC_MODEL = "Xenova/all-MiniLM-L6-v2";

const DB_PATH = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(process.cwd(), "data", "omhas.db");

// ── Semantic search (lazy-loaded MiniLM embedder) ──────────────────────────

let embedderPromise: Promise<{ embed: (text: string) => Promise<number[]> }> | null = null;

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const { pipeline, env } = await import("@xenova/transformers");
      // Allow remote download on first use; cache persists so subsequent loads are local.
      env.allowRemoteModels = true;
      env.allowLocalModels = true;
      const embedder = await pipeline("feature-extraction", SEMANTIC_MODEL);
      return {
        async embed(text: string): Promise<number[]> {
          const output = await embedder(text, { pooling: "mean", normalize: true });
          return Array.from(output.data) as number[];
        },
      };
    })();
  }
  return embedderPromise;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

const STOP_WORDS = new Set([
  "a", "an", "and", "for", "from", "in", "of", "on", "the", "to", "with",
]);

const RELATED_TERMS: Record<string, string[]> = {
  animal: ["animals", "creature", "farm"],
  calm: ["calming", "quiet", "soothing", "relaxation"],
  cleanup: ["clean", "transition", "routine"],
  fingerplay: ["fingerplays", "rhyme", "gesture"],
  horse: ["horses", "pony", "ponies", "gallop", "riding"],
  lap: ["bounce", "bouncing", "knee", "rocking", "caregiver"],
  pony: ["ponies", "horse", "horses", "gallop", "riding"],
  rhyme: ["rhymes", "fingerplay", "chant"],
  song: ["songs", "singing", "music"],
  story: ["stories", "book", "retelling", "literacy"],
};

type TopicRow = {
  id: number;
  topic: string;
  category: string | null;
  skill: string | null;
  subject: string;
  grade_keys: string;
  grades: string;
  standards: string | null;
  tags: string | null;
};

type LessonRow = {
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
};

async function searchLessonFiles(query: string): Promise<LessonRow[]> {
  const { getAllLessons } = await import("../../../lib/content");
  const lessons = await getAllLessons();
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  const scored = lessons
    .map((lesson) => {
      const meta = lesson.metadata;
      const haystack = `${meta.title} ${meta.subject} ${meta.grade} ${meta.summary} ${meta.focus} ${meta.category}`.toLowerCase();
      const score = terms.reduce((acc, term) => acc + (haystack.includes(term) ? 1 : 0), 0);
      return { lesson, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.lesson.metadata.title.localeCompare(b.lesson.metadata.title))
    .slice(0, 20);

  return scored.map(({ lesson }) => {
    const meta = lesson.metadata;
    return {
      id: meta.slug,
      slug: meta.slug,
      title: meta.title,
      subject: meta.subject,
      grade_band: meta.grade,
      summary: meta.summary,
      purpose: meta.focus,
      duration_minutes: meta.timeEstimate ? Number(meta.timeEstimate.replace(/\D/g, "")) || null : null,
      editorial_status: "mdx-published",
      review_state: "published",
      topic_id: null,
      song_count: 0,
      resource_count: 0,
    };
  });
}

function normalizeToken(value: string) {
  const token = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (token.endsWith("ies") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (token.endsWith("ing") && token.length > 5) return token.slice(0, -3);
  if (token.endsWith("s") && !token.endsWith("ss") && token.length > 3) return token.slice(0, -1);
  return token;
}

function queryTerms(query: string) {
  const primary = [...new Set(query.split(/[^a-zA-Z0-9-]+/).map(normalizeToken).filter((token) => token.length > 1 && !STOP_WORDS.has(token)))];
  const expanded = new Set(primary);
  for (const token of primary) {
    for (const related of RELATED_TERMS[token] ?? []) expanded.add(normalizeToken(related));
  }
  return { primary, expanded: [...expanded] };
}

function includesTerm(text: string, term: string) {
  return new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(text);
}

function scoreTopic(row: TopicRow, primary: string[], expanded: string[]) {
  const title = row.topic.toLowerCase();
  const category = (row.category ?? "").toLowerCase();
  const skill = (row.skill ?? "").toLowerCase();
  const standards = (row.standards ?? "").toLowerCase();
  const tags = (row.tags ?? "").toLowerCase();
  let score = 0;
  const matched = new Set<string>();

  for (const term of expanded) {
    const primaryWeight = primary.includes(term) ? 1 : 0.45;
    if (includesTerm(title, term)) { score += 10 * primaryWeight; matched.add(term); }
    if (includesTerm(category, term)) { score += 6 * primaryWeight; matched.add(term); }
    if (includesTerm(skill, term)) { score += 5 * primaryWeight; matched.add(term); }
    if (includesTerm(tags, term)) { score += 3 * primaryWeight; matched.add(term); }
    if (includesTerm(standards, term)) { score += 2 * primaryWeight; matched.add(term); }
  }

  const directMatches = primary.filter((term) => matched.has(term)).length;
  score += directMatches * directMatches * 4;
  if (normalizeToken(title) === primary.join(" ")) score += 30;
  return { score, matched: [...matched] };
}

function makeFtsQuery(terms: string[]) {
  return terms.map((term) => `"${term.replace(/"/g, "")}"*`).join(" OR ");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const kind = req.nextUrl.searchParams.get("kind") ?? "";
  const grade = req.nextUrl.searchParams.get("grade") ?? "";

  if (!q || q.length < 2) return NextResponse.json({ results: [], curriculum: [], lessons: [], total: 0 });

  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  try {
    const { primary, expanded } = queryTerms(q);
    const topicRows = db.prepare(`
      SELECT
        t.id, t.topic, t.category, t.skill,
        s.label AS subject,
        coalesce((SELECT group_concat(g.key, '|') FROM topic_grades tg JOIN grades g ON g.id = tg.grade_id WHERE tg.topic_id = t.id), '') AS grade_keys,
        coalesce((SELECT group_concat(g.label, ', ') FROM topic_grades tg JOIN grades g ON g.id = tg.grade_id WHERE tg.topic_id = t.id), '') AS grades,
        (SELECT group_concat(st.framework || ' ' || st.code || ': ' || st.full_text, ' | ') FROM topic_standards ts JOIN standards st ON st.id = ts.standard_id WHERE ts.topic_id = t.id AND st.code IS NOT NULL) AS standards,
        (SELECT group_concat(ta.name, ', ') FROM topic_tags tt JOIN tags ta ON ta.id = tt.tag_id WHERE tt.topic_id = t.id) AS tags
      FROM topics t
      JOIN subjects s ON s.id = t.subject_id
      WHERE t.merged_into IS NULL
    `).all() as TopicRow[];

    const curriculumResults = topicRows
      .filter((row) => !grade || row.grade_keys.split("|").includes(grade))
      .map((row) => ({ row, match: scoreTopic(row, primary, expanded) }))
      .filter(({ match }) => match.score >= 4)
      .sort((a, b) => b.match.score - a.match.score || a.row.topic.localeCompare(b.row.topic))
      .slice(0, 30)
      .map(({ row, match }) => ({
        id: String(row.id),
        grade_key: row.grade_keys,
        grade: row.grades || "Grade placement not recorded",
        subject: row.subject,
        lesson_topic: row.topic,
        skill_statement: row.skill,
        standards: row.standards,
        tags: row.tags,
        matched_terms: match.matched.slice(0, 6),
        why_match: match.matched.length
          ? `Matched ${match.matched.slice(0, 3).join(", ")} in the curriculum topic, skill, tags, or standards.`
          : "Related curriculum wording matched this search.",
      }));

    const ftsTerms = expanded.filter((term) => term.length > 1).slice(0, 18);

    // ── Keyword search (FTS5) ─────────────────────────────────────────────
    const keywordRows = ftsTerms.length ? db.prepare(`
      SELECT sc.id, sc.kind, sc.title, sc.lyrics, sc.instructions, sc.source_path, sc.url, sc.meta, sc.embedding,
        snippet(search_chunks_fts, 4, '<mark>', '</mark>', '…', 20) AS excerpt,
        rank
      FROM search_chunks_fts
      JOIN search_chunks sc ON sc.rowid = search_chunks_fts.rowid
      WHERE search_chunks_fts MATCH ?
        AND COALESCE(json_extract(sc.meta, '$.visibility'), 'public') <> 'internal'
        ${kind ? "AND sc.kind = ?" : ""}
      ORDER BY rank
      LIMIT 40
    `).all(...(kind ? [makeFtsQuery(ftsTerms), kind] : [makeFtsQuery(ftsTerms)])) as Array<Record<string, unknown>> : [];

    // ── Semantic search (embedding cosine similarity) ─────────────────────
    let semanticRows: Array<Record<string, unknown>> = [];
    let searchMode = "structured-keyword";

    try {
      const model = await getEmbedder();
      const queryEmbedding = await model.embed(q);

      // Fetch chunks with embeddings (broader candidate set for semantic)
      const candidateRows = db.prepare(`
        SELECT sc.id, sc.kind, sc.title, sc.lyrics, sc.instructions, sc.source_path, sc.url, sc.meta, sc.embedding
        FROM search_chunks sc
        WHERE sc.embedding IS NOT NULL
          AND COALESCE(json_extract(sc.meta, '$.visibility'), 'public') <> 'internal'
          ${kind ? "AND sc.kind = ?" : ""}
      `).all(...(kind ? [kind] : [])) as Array<Record<string, unknown>>;

      // Score each candidate by cosine similarity
      const scored = candidateRows
        .map((row) => {
          let stored: number[] = [];
          try { stored = JSON.parse(row.embedding as string); } catch { return null; }
          if (!Array.isArray(stored) || stored.length !== 384 || typeof stored[0] !== "number") return null;
          const semanticScore = cosineSimilarity(queryEmbedding, stored);
          return { row, semanticScore };
        })
        .filter((item): item is { row: Record<string, unknown>; semanticScore: number } => item !== null)
        .filter(({ semanticScore }) => semanticScore > 0.35)
        .sort((a, b) => b.semanticScore - a.semanticScore)
        .slice(0, 40);

      semanticRows = scored.map(({ row, semanticScore }) => ({ ...row, semantic_score: semanticScore }));
      if (semanticRows.length > 0) searchMode = "hybrid-keyword-semantic";
    } catch (embedError) {
      // Semantic search is best-effort — fall back to keyword-only
      console.warn("Semantic search unavailable:", embedError instanceof Error ? embedError.message : String(embedError));
    }

    // ── Merge keyword + semantic results (deduplicated, hybrid-ranked) ────
    const mergedMap = new Map<string, { row: Record<string, unknown>; keywordRank: number; semanticScore: number }>();

    keywordRows.forEach((row, idx) => {
      const id = row.id as string;
      const existing = mergedMap.get(id);
      if (existing) {
        existing.keywordRank = Math.min(existing.keywordRank, idx);
      } else {
        mergedMap.set(id, { row, keywordRank: idx, semanticScore: 0 });
      }
    });

    semanticRows.forEach((row) => {
      const id = row.id as string;
      const semanticScore = row.semantic_score as number;
      const existing = mergedMap.get(id);
      if (existing) {
        existing.semanticScore = Math.max(existing.semanticScore, semanticScore);
      } else {
        mergedMap.set(id, { row, keywordRank: 999, semanticScore });
      }
    });

    // Hybrid score: 0.5 keyword rank score + 0.5 semantic score
    const maxKeywordRank = keywordRows.length || 1;
    const merged = [...mergedMap.values()]
      .map(({ row, keywordRank, semanticScore }) => {
        const keywordScore = 1 - (keywordRank / maxKeywordRank);
        const combinedScore = 0.5 * keywordScore + 0.5 * semanticScore;
        return { row, combinedScore, semanticScore };
      })
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 40);

    const resultRows = merged.map(({ row }) => row);

    // ── Lesson pages (MDX files in content/lessons/) ─────────────────────
    const lessonResults = await searchLessonFiles(q) as LessonRow[];

    const results = resultRows.map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      excerpt: row.excerpt,
      lyrics: row.lyrics,
      instructions: row.instructions,
      sourcePath: row.source_path,
      url: row.url,
      meta: row.meta ? JSON.parse(row.meta as string) : {},
    }));

    return NextResponse.json({
      results,
      curriculum: curriculumResults,
      lessons: lessonResults,
      total: results.length + curriculumResults.length + lessonResults.length,
      searchMode,
      semanticModel: searchMode === "hybrid-keyword-semantic" ? SEMANTIC_MODEL : null,
      database: path.basename(DB_PATH),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Search error:", message);
    return NextResponse.json({ error: "Search failed", message }, { status: 500 });
  } finally {
    db.close();
  }
}
