import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(process.cwd(), "data", "omhas.db");

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

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const kind = req.nextUrl.searchParams.get("kind") ?? "";
  const grade = req.nextUrl.searchParams.get("grade") ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });

    // Build FTS5 query with wildcards
    const ftsQuery = q.split(/\s+/).map(w => `"${w.replace(/"/g, "")}"*`).join(" ");

    let sql = `
      SELECT
        sc.id,
        sc.kind,
        sc.title,
        sc.lyrics,
        sc.instructions,
        sc.source_path,
        sc.meta,
        snippet(search_chunks_fts, 4, '<mark>', '</mark>', '…', 20) as excerpt,
        rank
      FROM search_chunks_fts
      JOIN search_chunks sc ON sc.rowid = search_chunks_fts.rowid
      WHERE search_chunks_fts MATCH ?
    `;

    const params: (string)[] = [ftsQuery];

    if (kind) {
      sql += ` AND sc.kind = ?`;
      params.push(kind);
    }

    sql += ` ORDER BY rank LIMIT 50`;

    const results = db.prepare(sql).all(...params);

    // Also query curriculum topics if grade is specified
    let curriculumResults: Array<Record<string, unknown>> = [];
    if (grade) {
      const topicSql = `
        SELECT id, grade_key, grade, subject, lesson_topic, skill_statement, standards
        FROM curriculum_topics
        WHERE grade_key = ? AND (lesson_topic LIKE ? OR skill_statement LIKE ? OR subject LIKE ?)
        LIMIT 20
      `;
      const topicQuery = `%${q}%`;
      curriculumResults = db.prepare(topicSql).all(grade, topicQuery, topicQuery, topicQuery) as Array<Record<string, unknown>>;
    }

    let lessonResults: LessonRow[] = [];
    const hasUnifiedLessons = db.prepare(`
      SELECT 1
      FROM sqlite_master
      WHERE type = 'table' AND name = 'lesson_blueprints'
      LIMIT 1
    `).get();

    if (hasUnifiedLessons) {
      const lessonQuery = `%${q}%`;
      lessonResults = db.prepare(`
        SELECT
          lb.id,
          lb.slug,
          lb.title,
          lb.subject,
          lb.grade_band,
          lb.summary,
          lb.purpose,
          lb.duration_minutes,
          lb.editorial_status,
          lb.review_state,
          lb.curriculum_topic_id AS topic_id,
          SUM(CASE WHEN lm.material_kind = 'song' THEN 1 ELSE 0 END) AS song_count,
          SUM(CASE WHEN lm.material_kind <> 'song' THEN 1 ELSE 0 END) AS resource_count
        FROM lesson_blueprints lb
        LEFT JOIN lesson_materials lm ON lm.lesson_id = lb.id
        WHERE lb.title LIKE ?
           OR lb.subject LIKE ?
           OR lb.summary LIKE ?
           OR lb.purpose LIKE ?
        GROUP BY lb.id
        ORDER BY
          CASE WHEN lower(lb.title) = lower(?) THEN 0
               WHEN lower(lb.title) LIKE lower(?) THEN 1
               ELSE 2 END,
          lb.title
        LIMIT 20
      `).all(
        lessonQuery,
        lessonQuery,
        lessonQuery,
        lessonQuery,
        q,
        `${q}%`,
      ) as LessonRow[];
    }

    db.close();

    return NextResponse.json({
      results: (results as Array<Record<string, unknown>>).map((r) => ({
        id: r.id,
        kind: r.kind,
        title: r.title,
        excerpt: r.excerpt,
        lyrics: r.lyrics,
        instructions: r.instructions,
        sourcePath: r.source_path,
        meta: r.meta ? JSON.parse(r.meta as string) : {},
      })),
      curriculum: curriculumResults,
      lessons: lessonResults,
      total: results.length + curriculumResults.length + lessonResults.length,
      database: path.basename(DB_PATH),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Search error:", message);
    return NextResponse.json(
      { error: "Search failed", message },
      { status: 500 }
    );
  }
}
