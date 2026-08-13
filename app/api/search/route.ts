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
  "curriculum", "lesson", "lessons", "plan", "planning", "resource", "resources", "teach", "teaching",
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
  teacher_title: string | null;
  teacher_summary: string | null;
  category: string | null;
  skill: string | null;
  subject: string;
  grade_keys: string;
  grades: string;
  standards: string | null;
  tags: string | null;
  pacing: string | null;
};

type TopicMaterialRow = {
  topic_id: number;
  material_kind: string;
  material_id: number;
  title: string;
  url: string | null;
  preview: string | null;
  resource_type: string | null;
  role: string | null;
  use_in_phase: string | null;
  routine_slot: string | null;
  teacher_rationale: string;
};

type PlanningWindowMatch = {
  id: number;
  label: string;
  alias: string;
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

type CanonicalMatch = {
  chunk_id: string;
  song_id: number;
  song_title: string;
  relationship: string;
  review_state: string | null;
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

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function includesPhrase(value: string, phrase: string) {
  return ` ${value} `.includes(` ${phrase} `);
}

function planningWindowMatches(db: Database.Database, query: string): PlanningWindowMatch[] {
  const normalizedQuery = normalizeSearchText(query);
  const aliases = db.prepare(`
    SELECT planning_window_aliases.planning_window_id AS id, planning_windows.label, planning_window_aliases.alias
    FROM planning_window_aliases
    JOIN planning_windows ON planning_windows.id = planning_window_aliases.planning_window_id
    WHERE planning_windows.active = 1
    ORDER BY length(planning_window_aliases.alias) DESC, planning_windows.sort_order
  `).all() as PlanningWindowMatch[];

  const matches = aliases.filter((item) => includesPhrase(normalizedQuery, normalizeSearchText(item.alias)));
  return [...new Map(matches.map((item) => [item.id, item])).values()];
}

function inferredGradeKey(db: Database.Database, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  const grades = db.prepare("SELECT key, label FROM grades ORDER BY sort_order").all() as Array<{ key: string; label: string }>;
  return grades.find((item) => includesPhrase(normalizedQuery, normalizeSearchText(item.label)))?.key ?? "";
}

function stripIntentPhrases(query: string, phrases: string[]) {
  let result = query;
  for (const phrase of phrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    result = result.replace(new RegExp(`\\b${escaped}\\b`, "ig"), " ");
  }
  return result.trim();
}

function canonicalSongMap(
  db: Database.Database,
  songChunkIds: string[],
): Map<string, { songId: number; songTitle: string } | null> {
  if (songChunkIds.length === 0) return new Map();

  const placeholders = songChunkIds.map(() => "?").join(", ");
  const rows = db.prepare(`
    SELECT
      sc.id AS chunk_id,
      s.id AS song_id,
      s.title AS song_title,
      ss.relationship,
      sd.review_state
    FROM search_chunks sc
    INNER JOIN search_chunk_sources scs ON scs.search_chunk_id = sc.id
    INNER JOIN source_documents sd ON sd.id = scs.source_document_id
    INNER JOIN song_sources ss ON ss.source_document_id = sd.id
    INNER JOIN songs s ON s.id = ss.song_id
    WHERE sc.kind = 'song'
      AND sc.id IN (${placeholders})
    ORDER BY sc.id, CASE ss.relationship
      WHEN 'primary' THEN 0
      WHEN 'transcription' THEN 1
      ELSE 2
    END, COALESCE(sd.review_state, 'research_wip')
  `).all(...songChunkIds) as CanonicalMatch[];

  const groupedByChunk = new Map<string, CanonicalMatch[]>();
  for (const row of rows) {
    const existing = groupedByChunk.get(row.chunk_id) ?? [];
    if (!existing.some((candidate) => candidate.song_id === row.song_id)) {
      existing.push(row);
    }
    groupedByChunk.set(row.chunk_id, existing);
  }

  const result = new Map<string, { songId: number; songTitle: string } | null>();
  for (const [chunkId, matches] of groupedByChunk.entries()) {
    const uniqueSongIds = new Set<number>(matches.map((match) => match.song_id));
    if (uniqueSongIds.size !== 1) {
      result.set(chunkId, null);
      continue;
    }
    const best = matches[0];
    result.set(chunkId, { songId: best.song_id, songTitle: best.song_title });
  }
  return result;
}

function queryTerms(query: string) {
  const primary = [...new Set(query.split(/[^a-zA-Z0-9-]+/).map(normalizeToken).filter((token) => token.length > 1 && !STOP_WORDS.has(token)))];
  const expanded = new Set(primary);
  for (const token of primary) {
    for (const related of RELATED_TERMS[token] ?? []) expanded.add(normalizeToken(related));
  }
  return { primary, expanded: [...expanded] };
}

function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function includesTerm(text: string, term: string) {
  return new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(text);
}

function hasKeywordAnchor(row: Record<string, unknown>, primary: string[]) {
  if (primary.length < 2) return true;
  const searchable = [row.title, row.lyrics, row.instructions]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  return primary.filter((term) => includesTerm(searchable, term)).length >= 2;
}

function scoreTopic(row: TopicRow, primary: string[], expanded: string[]) {
  const title = row.topic.toLowerCase();
  const teacherTitle = (row.teacher_title ?? "").toLowerCase();
  const teacherSummary = (row.teacher_summary ?? "").toLowerCase();
  const category = (row.category ?? "").toLowerCase();
  const skill = (row.skill ?? "").toLowerCase();
  const standards = (row.standards ?? "").toLowerCase();
  const tags = (row.tags ?? "").toLowerCase();
  let score = 0;
  const matched = new Set<string>();

  for (const term of expanded) {
    const primaryWeight = primary.includes(term) ? 1 : 0.45;
    if (includesTerm(title, term)) { score += 10 * primaryWeight; matched.add(term); }
    if (includesTerm(teacherTitle, term)) { score += 12 * primaryWeight; matched.add(term); }
    if (includesTerm(teacherSummary, term)) { score += 7 * primaryWeight; matched.add(term); }
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

function linkedMaterialsForTopics(db: Database.Database, topicIds: number[]) {
  const grouped = new Map<number, Array<{
    id: string;
    kind: string;
    title: string;
    url: string | null;
    preview: string | null;
    role: string | null;
    use_in_phase: string | null;
    routine_slot: string | null;
    teacher_rationale: string;
  }>>();
  if (topicIds.length === 0) return grouped;

  const placeholders = topicIds.map(() => "?").join(", ");
  const rows = db.prepare(`
    SELECT
      tm.topic_id,
      tm.material_kind,
      tm.material_id,
      COALESCE(s.title, r.name) AS title,
      COALESCE(s.url, r.url) AS url,
      COALESCE(s.lyrics, s.actions, r.description) AS preview,
      r.type AS resource_type,
      tm.role,
      tm.use_in_phase,
      tm.routine_slot,
      tm.teacher_rationale
    FROM topic_materials tm
    LEFT JOIN songs s ON tm.material_kind = 'song' AND s.id = tm.material_id
    LEFT JOIN resources r ON tm.material_kind = 'resource' AND r.id = tm.material_id
    WHERE tm.topic_id IN (${placeholders})
      AND trim(COALESCE(tm.teacher_rationale, '')) <> ''
    ORDER BY tm.topic_id, CASE tm.role WHEN 'focus' THEN 0 ELSE 1 END, tm.id
  `).all(...topicIds) as TopicMaterialRow[];

  for (const row of rows) {
    const materials = grouped.get(row.topic_id) ?? [];
    materials.push({
      id: `${row.material_kind}:${row.material_id}`,
      kind: row.material_kind === 'resource' ? row.resource_type ?? 'resource' : 'song',
      title: row.title,
      url: row.url,
      preview: row.preview,
      role: row.role,
      use_in_phase: row.use_in_phase,
      routine_slot: row.routine_slot,
      teacher_rationale: row.teacher_rationale,
    });
    grouped.set(row.topic_id, materials);
  }
  return grouped;
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
    const planningMatches = planningWindowMatches(db, q);
    const resolvedGrade = grade || inferredGradeKey(db, q);
    const intentPhrases = [
      ...planningMatches.map((item) => item.alias),
      ...(resolvedGrade ? [db.prepare("SELECT label FROM grades WHERE key = ?").get(resolvedGrade) as { label: string } | undefined].flatMap((item) => item ? [item.label] : []) : []),
    ];
    const searchQuery = stripIntentPhrases(q, intentPhrases);
    const { primary, expanded } = queryTerms(searchQuery);
    const planningWindowIds = planningMatches.map((item) => item.id);
    const planningPlaceholders = planningWindowIds.map(() => "?").join(", ");
    const pacingSelect = planningWindowIds.length
      ? `
        (SELECT group_concat('Week ' || paced_wp.week_number || ' - ' || paced_wp.month, ' | ')
         FROM topic_grades paced_tg
         JOIN weekly_pacing paced_wp ON paced_wp.topic_grade_id = paced_tg.id
         JOIN planning_window_months paced_month ON paced_month.month = paced_wp.month
         WHERE paced_tg.topic_id = t.id
           AND paced_month.planning_window_id IN (${planningPlaceholders})) AS pacing`
      : "NULL AS pacing";
    const pacingFilter = planningWindowIds.length
      ? `
        AND EXISTS (
          SELECT 1
          FROM topic_grades paced_tg
          JOIN weekly_pacing paced_wp ON paced_wp.topic_grade_id = paced_tg.id
          JOIN planning_window_months paced_month ON paced_month.month = paced_wp.month
          WHERE paced_tg.topic_id = t.id
            AND paced_month.planning_window_id IN (${planningPlaceholders})
        )`
      : "";
    const topicRows = db.prepare(`
      SELECT
        t.id, t.topic, t.teacher_title, t.teacher_summary, t.category, t.skill,
        s.label AS subject,
        coalesce((SELECT group_concat(g.key, '|') FROM topic_grades tg JOIN grades g ON g.id = tg.grade_id WHERE tg.topic_id = t.id), '') AS grade_keys,
        coalesce((SELECT group_concat(g.label, ', ') FROM topic_grades tg JOIN grades g ON g.id = tg.grade_id WHERE tg.topic_id = t.id), '') AS grades,
        (SELECT group_concat(st.framework || ' ' || st.code || ': ' || st.full_text, ' | ') FROM topic_standards ts JOIN standards st ON st.id = ts.standard_id WHERE ts.topic_id = t.id AND st.code IS NOT NULL) AS standards,
        (SELECT group_concat(ta.name, ', ') FROM topic_tags tt JOIN tags ta ON ta.id = tt.tag_id WHERE tt.topic_id = t.id) AS tags,
        ${pacingSelect}
      FROM topics t
      JOIN subjects s ON s.id = t.subject_id
      WHERE t.merged_into IS NULL ${pacingFilter}
    `).all(...planningWindowIds, ...planningWindowIds) as TopicRow[];

    const linkedMaterialsByTopic = linkedMaterialsForTopics(db, topicRows.map((row) => row.id));
    const curriculumResults = topicRows
      .filter((row) => !resolvedGrade || row.grade_keys.split("|").includes(resolvedGrade))
      .map((row) => ({ row, match: scoreTopic(row, primary, expanded) }))
      .filter(({ match }) => planningWindowIds.length > 0 && primary.length === 0 || match.score >= 4)
      .sort((a, b) => b.match.score - a.match.score || (a.row.pacing ?? "").localeCompare(b.row.pacing ?? "") || a.row.topic.localeCompare(b.row.topic))
      .slice(0, 30)
      .map(({ row, match }) => ({
        id: String(row.id),
        grade_key: row.grade_keys,
        grade: row.grades || "Grade placement not recorded",
        subject: row.subject,
        lesson_topic: row.topic,
        teacher_title: row.teacher_title,
        teacher_summary: row.teacher_summary,
        skill_statement: row.skill,
        standards: row.standards,
        tags: row.tags,
        pacing: row.pacing,
        planning_windows: planningMatches.map((item) => item.label),
        linked_materials: linkedMaterialsByTopic.get(row.id) ?? [],
        matched_terms: match.matched.slice(0, 6),
        why_match: [
          planningMatches.length ? `Scheduled for ${planningMatches.map((item) => item.label).join(", ")}${row.pacing ? ` (${row.pacing})` : ""}.` : "",
          match.matched.length
            ? `Matched ${match.matched.slice(0, 3).join(", ")} in the curriculum topic, skill, tags, or standards.`
            : planningMatches.length ? "" : "Related curriculum wording matched this search.",
        ].filter(Boolean).join(" "),
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
        ${kind ? "AND sc.kind = ?" : "AND sc.kind <> 'knowledge'"}
      ORDER BY rank
      LIMIT 40
    `).all(...(kind ? [makeFtsQuery(ftsTerms), kind] : [makeFtsQuery(ftsTerms)])) as Array<Record<string, unknown>> : [];

    // ── Semantic search (embedding cosine similarity) ─────────────────────
    const anchoredKeywordRows = keywordRows.filter((row) => hasKeywordAnchor(row, primary));

    let semanticRows: Array<Record<string, unknown>> = [];
    let searchMode = "structured-keyword";

    try {
      const model = await getEmbedder();
      if (primary.length === 0) throw new Error("No resource-search terms after resolving grade and school-year placement.");
      const queryEmbedding = await model.embed(searchQuery);

      // Fetch chunks with embeddings (broader candidate set for semantic)
      const candidateRows = db.prepare(`
        SELECT sc.id, sc.kind, sc.title, sc.lyrics, sc.instructions, sc.source_path, sc.url, sc.meta, sc.embedding
        FROM search_chunks sc
        WHERE sc.embedding IS NOT NULL
          AND COALESCE(json_extract(sc.meta, '$.visibility'), 'public') <> 'internal'
          ${kind ? "AND sc.kind = ?" : "AND sc.kind <> 'knowledge'"}
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
        .filter(({ row }) => hasKeywordAnchor(row, primary))
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

    anchoredKeywordRows.forEach((row, idx) => {
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
    const maxKeywordRank = anchoredKeywordRows.length || 1;
    const merged = [...mergedMap.values()]
      .map(({ row, keywordRank, semanticScore }) => {
        const keywordScore = 1 - (keywordRank / maxKeywordRank);
        const combinedScore = 0.5 * keywordScore + 0.5 * semanticScore;
        return { row, combinedScore, semanticScore };
      })
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 40);

    const searchRowCandidates = [...merged.values()]
      .filter((item) => item)
      .sort((a, b) => b.combinedScore - a.combinedScore);

    const songChunkIds = [
      ...new Set(
        searchRowCandidates
          .filter(({ row }) => row.kind === "song")
          .map(({ row }) => row.id as string),
      ),
    ];
    const canonicalSongMapByChunk = canonicalSongMap(db, songChunkIds);

    const dedupedRows: Array<{
      row: Record<string, unknown>;
      combinedScore: number;
      canonicalSongId: number | null;
      displayTitle: string;
    }> = [];
    const seenKeys = new Set<string>();
    for (const item of searchRowCandidates) {
      const row = item.row;
      const rowId = row.id as string;
      const canonical = row.kind === "song" ? canonicalSongMapByChunk.get(rowId) ?? null : null;
      const canonicalSongId = canonical ? canonical.songId : null;
      const dedupeKey = canonicalSongId ? `song:${canonicalSongId}` : `chunk:${rowId}`;
      if (seenKeys.has(dedupeKey)) continue;
      seenKeys.add(dedupeKey);
      dedupedRows.push({
        row,
        combinedScore: item.combinedScore,
        canonicalSongId,
        displayTitle: canonical?.songTitle ?? String(row.title),
      });
    }

    const resultRows = dedupedRows.slice(0, 40);

    // ── Lesson pages (MDX files in content/lessons/) ─────────────────────
    const lessonResults = primary.length ? await searchLessonFiles(searchQuery) as LessonRow[] : [];

    const results = resultRows.map((item) => ({
      id: item.row.id as string,
      kind: item.row.kind as string,
      title: item.displayTitle,
      canonicalSongId: item.canonicalSongId,
      excerpt: item.row.excerpt as string,
      lyrics: item.row.lyrics as string,
      instructions: item.row.instructions as string,
      sourcePath: item.row.source_path as string,
      url: item.row.url as string,
      meta: item.row.meta ? JSON.parse(item.row.meta as string) : {},
      href: item.row.kind === "song" && item.canonicalSongId
        ? `/songs/${item.canonicalSongId}`
        : normalizeUrl(item.row.url as string),
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
