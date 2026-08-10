import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(process.cwd(), "data", "omhas.db");

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
  lesson_topic: string;
  category: string | null;
  skill_statement: string | null;
  subject: string;
  grade_keys: string;
  grades: string;
  standards: string | null;
  tags: string | null;
};

type LessonRow = {
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
};

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
  const title = row.lesson_topic.toLowerCase();
  const category = (row.category ?? "").toLowerCase();
  const skill = (row.skill_statement ?? "").toLowerCase();
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
        t.id, t.lesson_topic, t.category, t.skill_statement,
        s.label AS subject,
        coalesce((SELECT group_concat(g.key, '|') FROM TOPIC_GRADES tg JOIN GRADES g ON g.id = tg.grade_id WHERE tg.topic_id = t.id), '') AS grade_keys,
        coalesce((SELECT group_concat(g.label, ', ') FROM TOPIC_GRADES tg JOIN GRADES g ON g.id = tg.grade_id WHERE tg.topic_id = t.id), '') AS grades,
        (SELECT group_concat(st.framework || ' ' || st.code || ': ' || st.full_text, ' | ') FROM TOPIC_STANDARDS ts JOIN STANDARDS st ON st.id = ts.standard_id WHERE ts.topic_id = t.id) AS standards,
        (SELECT group_concat(ta.name, ', ') FROM TOPIC_TAGS tt JOIN TAGS ta ON ta.id = tt.tag_id WHERE tt.topic_id = t.id) AS tags
      FROM TOPICS t
      JOIN SUBJECTS s ON s.id = t.subject_id
      WHERE t.merged_into_topic_id IS NULL
    `).all() as TopicRow[];

    const curriculumResults = topicRows
      .filter((row) => !grade || row.grade_keys.split("|").includes(grade))
      .map((row) => ({ row, match: scoreTopic(row, primary, expanded) }))
      .filter(({ match }) => match.score >= 4)
      .sort((a, b) => b.match.score - a.match.score || a.row.lesson_topic.localeCompare(b.row.lesson_topic))
      .slice(0, 30)
      .map(({ row, match }) => ({
        id: String(row.id),
        grade_key: row.grade_keys,
        grade: row.grades || "Grade placement not recorded",
        subject: row.subject,
        lesson_topic: row.lesson_topic,
        skill_statement: row.skill_statement,
        standards: row.standards,
        tags: row.tags,
        matched_terms: match.matched.slice(0, 6),
        why_match: match.matched.length
          ? `Matched ${match.matched.slice(0, 3).join(", ")} in the curriculum topic, skill, tags, or standards.`
          : "Related curriculum wording matched this search.",
      }));

    const ftsTerms = expanded.filter((term) => term.length > 1).slice(0, 18);
    const resultRows = ftsTerms.length ? db.prepare(`
      SELECT sc.id, sc.kind, sc.title, sc.lyrics, sc.instructions, sc.source_path, sc.url, sc.meta,
        snippet(search_chunks_fts, 4, '<mark>', '</mark>', '…', 20) AS excerpt,
        rank
      FROM search_chunks_fts
      JOIN search_chunks sc ON sc.rowid = search_chunks_fts.rowid
      WHERE search_chunks_fts MATCH ? ${kind ? "AND sc.kind = ?" : ""}
      ORDER BY rank
      LIMIT 40
    `).all(...(kind ? [makeFtsQuery(ftsTerms), kind] : [makeFtsQuery(ftsTerms)])) as Array<Record<string, unknown>> : [];

    const lessonQuery = `%${primary[0] ?? q.toLowerCase()}%`;
    const lessonResults = db.prepare(`
      SELECT lb.id, lb.slug, lb.title, lb.subject, lb.grade_band, lb.summary, lb.purpose,
        lb.duration_minutes, lb.editorial_status, lb.review_state,
        lb.curriculum_topic_id AS topic_id,
        SUM(CASE WHEN lm.material_kind = 'song' THEN 1 ELSE 0 END) AS song_count,
        SUM(CASE WHEN lm.material_kind <> 'song' THEN 1 ELSE 0 END) AS resource_count
      FROM lesson_blueprints lb
      LEFT JOIN lesson_materials lm ON lm.lesson_id = lb.id
      WHERE lower(lb.title || ' ' || coalesce(lb.subject, '') || ' ' || coalesce(lb.summary, '') || ' ' || coalesce(lb.purpose, '')) LIKE ?
      GROUP BY lb.id
      ORDER BY CASE WHEN lower(lb.title) = lower(?) THEN 0 ELSE 1 END, lb.title
      LIMIT 20
    `).all(lessonQuery, q) as LessonRow[];

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
      searchMode: "structured-keyword",
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
