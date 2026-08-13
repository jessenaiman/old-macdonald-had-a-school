import Database from 'better-sqlite3';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const databasePath = path.resolve(process.argv[2] ?? 'data/omhas.db');
const recordResults = process.argv.includes('--record');
const summaryOnly = process.argv.includes('--summary');
const database = new Database(databasePath, { readonly: !recordResults });
database.pragma('foreign_keys = ON');

const requiredTables = [
  'search_chunks',
  'search_chunks_fts',
  'curriculum_topic_songs',
  'topics',
  'retrieval_evaluation_queries',
];

function tableExists(name) {
  return Boolean(database.prepare(
    "SELECT 1 FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?",
  ).get(name));
}

const missingTables = requiredTables.filter((table) => !tableExists(table));
if (missingTables.length > 0) {
  database.close();
  throw new Error(`Retrieval evaluator requires missing tables: ${missingTables.join(', ')}`);
}

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'for', 'from', 'find', 'include',
  'includes', 'in', 'is', 'it', 'lesson', 'must', 'of', 'or', 'result', 'results',
  'that', 'the', 'their', 'this', 'to', 'use', 'uses', 'using', 'with',
]);

function termsFor(query) {
  return [...new Set(query.toLowerCase().replaceAll('&', ' and ')
    .split(/[^a-z0-9]+/).filter((term) => term.length > 1 && !stopWords.has(term)))];
}

function ftsExpression(terms) {
  return terms.map((term) => `"${term.replaceAll('"', '""')}"`).join(' OR ');
}

function evaluate(query) {
  const terms = termsFor(query.query_text);
  if (terms.length === 0) return { terms, results: [] };
  const expression = ftsExpression(terms);
  // SQLite only permits bm25() in the direct FTS query context. Rank chunks
  // first, then aggregate their curriculum links in JavaScript.
  const chunks = database.prepare(`
    SELECT id, bm25(search_chunks_fts) AS raw_score
    FROM search_chunks_fts
    WHERE search_chunks_fts MATCH ?
    ORDER BY raw_score ASC, id ASC
    LIMIT 100
  `).all(expression);
  if (chunks.length === 0) return { terms, results: [] };
  const placeholders = chunks.map(() => '?').join(', ');
  const topicRows = database.prepare(`
    SELECT
      cts.search_chunk_id,
      t.id,
      COALESCE(NULLIF(t.teacher_title, ''), t.topic) AS title,
      t.topic AS source_topic,
      t.category,
      s.label AS subject
    FROM curriculum_topic_songs cts
    JOIN topics t ON t.id = cts.topic_id
    LEFT JOIN subjects s ON s.id = t.subject_id
    WHERE cts.search_chunk_id IN (${placeholders})
  `).all(...chunks.map((chunk) => chunk.id));
  const scoreByChunk = new Map(chunks.map((chunk) => [chunk.id, chunk.raw_score]));
  const byTopic = new Map();
  for (const row of topicRows) {
    const existing = byTopic.get(row.id);
    const rawScore = scoreByChunk.get(row.search_chunk_id);
    if (!existing) {
      byTopic.set(row.id, { ...row, bestRawScore: rawScore, matchedChunks: 1 });
    } else {
      existing.bestRawScore = Math.min(existing.bestRawScore, rawScore);
      existing.matchedChunks += 1;
    }
  }
  const rows = [...byTopic.values()]
    .sort((left, right) => left.bestRawScore - right.bestRawScore
      || right.matchedChunks - left.matchedChunks
      || left.title.localeCompare(right.title))
    .slice(0, 20)
    .map((row) => ({
      id: row.id,
      title: row.title,
      sourceTopic: row.source_topic,
      category: row.category,
      subject: row.subject,
      matchedChunks: row.matchedChunks,
      score: Number((-row.bestRawScore).toFixed(6)),
    }));
  return { terms, results: rows };
}

function databaseChecks() {
  const integrity = database.prepare('PRAGMA integrity_check').get().integrity_check;
  const foreignKeys = database.prepare('PRAGMA foreign_key_check').all();
  const sourceRows = database.prepare('SELECT COUNT(*) AS count FROM search_chunks').get().count;
  const ftsRows = database.prepare('SELECT COUNT(*) AS count FROM search_chunks_fts').get().count;
  return {
    integrityOk: integrity === 'ok',
    foreignKeyViolations: foreignKeys.length,
    searchChunks: sourceRows,
    ftsRows,
    ftsParity: sourceRows === ftsRows,
  };
}

const queries = database.prepare(`
  SELECT id, category, query_text, expected_title_contains, expected_result_kind
  FROM retrieval_evaluation_queries
  WHERE active = 1
  ORDER BY id
`).all();

const results = queries.map((query) => {
  const started = performance.now();
  const evaluated = evaluate(query);
  const durationMs = Math.max(0, Math.round(performance.now() - started));
  const expected = query.expected_title_contains?.toLowerCase() ?? null;
  const expectationMet = expected
    ? evaluated.results.some((result) => result.title.toLowerCase().includes(expected))
    : null;
  return {
    queryId: query.id,
    category: query.category,
    query: query.query_text,
    terms: evaluated.terms,
    durationMs,
    count: evaluated.results.length,
    expectationMet,
    top: evaluated.results[0] ?? null,
    results: evaluated.results,
  };
});

const checks = databaseChecks();
const reviewed = results.filter((result) => result.expectationMet !== null);
const expectationFailures = reviewed.filter((result) => !result.expectationMet);
const emptyQueries = results.filter((result) => result.count === 0);
const summary = {
  databasePath,
  engine: 'sqlite-fts5-linked-topics',
  engineVersion: '2',
  semantic: false,
  recordResults,
  checks,
  queryCount: results.length,
  nonEmptyQueries: results.length - emptyQueries.length,
  reviewedExpectations: reviewed.length,
  passedExpectations: reviewed.length - expectationFailures.length,
  expectationFailures: expectationFailures.map(({ query, top }) => ({ query, top: top?.title ?? null })),
  emptyQueries: emptyQueries.map(({ query }) => query),
  results,
};
summary.passed = summary.checks.integrityOk
  && summary.checks.foreignKeyViolations === 0
  && summary.checks.ftsParity
  && summary.emptyQueries.length === 0
  && summary.expectationFailures.length === 0;

if (recordResults) {
  const insertRun = database.prepare(`
    INSERT INTO retrieval_evaluation_runs
      (query_id, engine_kind, engine_version, duration_ms, result_count, expectation_met, evaluator_note)
    VALUES (?, 'sqlite-fts5-linked-topics', '2', ?, ?, ?, ?)
  `);
  const insertResult = database.prepare(`
    INSERT INTO retrieval_evaluation_results
      (run_id, rank, result_kind, result_id, title, match_scope, score)
    VALUES (?, ?, 'topic', ?, ?, 'fts5-linked-topic', ?)
  `);
  database.transaction(() => {
    for (const result of results) {
      const run = insertRun.run(
        result.queryId,
        result.durationMs,
        result.count,
        result.expectationMet === null ? null : result.expectationMet ? 1 : 0,
        result.expectationMet === false ? 'No ranked topic met the stored expectation.' : null,
      );
      result.results.forEach((item, index) => insertResult.run(
        run.lastInsertRowid,
        index + 1,
        item.id,
        item.title,
        item.score,
      ));
    }
  })();
}

const output = summaryOnly ? { ...summary, results: undefined } : summary;
console.log(JSON.stringify(output, null, 2));
database.close();

if (!checks.integrityOk || checks.foreignKeyViolations > 0 || !checks.ftsParity
  || emptyQueries.length > 0 || expectationFailures.length > 0) {
  process.exitCode = 1;
}
