import Database from 'better-sqlite3';
import { performance } from 'node:perf_hooks';

const databasePath = process.argv[2] ?? 'data/omhas.db';
const database = new Database(databasePath);
database.pragma('foreign_keys = ON');

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'for', 'from', 'find', 'include',
  'includes', 'in', 'is', 'it', 'lesson', 'must', 'of', 'or', 'result', 'results',
  'that', 'the', 'their', 'this', 'to', 'use', 'uses', 'using', 'with',
]);

function termsFor(query) {
  return [...new Set(query.toLowerCase().replaceAll('&', ' and ')
    .split(/[^a-z0-9]+/).filter((term) => term.length > 1 && !stopWords.has(term)))];
}

function evaluate(query) {
  const terms = termsFor(query.query_text);
  if (terms.length === 0) return [];
  const topics = database.prepare(`
    SELECT id, lesson_topic AS title, subject, category, skill_statement, tags, standards, linked_resources
    FROM curriculum_topics
  `).all();
  const topicScores = new Map(topics.map((topic) => {
    const fields = [
      [topic.title, 8], [topic.subject, 5], [topic.category, 4],
      [topic.skill_statement, 3], [topic.tags, 3], [topic.standards, 1],
      [topic.linked_resources, 1],
    ];
    const score = terms.reduce((total, term) => total + fields.reduce((subtotal, [value, weight]) => (
      value?.toLowerCase().includes(term) ? subtotal + weight : subtotal
    ), 0), 0);
    return [topic.id, score];
  }));
  const fts = terms.map((term) => `"${term.replaceAll('"', '""')}"`).join(' OR ');
  const chunks = database.prepare(`
    SELECT id, title, bm25(search_chunks_fts) AS raw_score
    FROM search_chunks_fts WHERE search_chunks_fts MATCH ? ORDER BY raw_score LIMIT 100
  `).all(fts);
  const linkedScores = new Map();
  if (chunks.length > 0) {
    const placeholders = chunks.map(() => '?').join(', ');
    const scoreByChunk = new Map(chunks.map((chunk, index) => [chunk.id, 100 - index]));
    const links = database.prepare(`
      SELECT cts.curriculum_topic_id AS id, cts.search_chunk_id
      FROM curriculum_topic_songs cts WHERE cts.search_chunk_id IN (${placeholders})
    `).all(...chunks.map((chunk) => chunk.id));
    for (const link of links) {
      linkedScores.set(link.id, Math.max(linkedScores.get(link.id) ?? 0, scoreByChunk.get(link.search_chunk_id) ?? 0));
    }
  }
  return topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    score: (topicScores.get(topic.id) ?? 0) * 1000 + (linkedScores.get(topic.id) ?? 0),
  })).filter((topic) => topic.score > 0)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 10);
}

const queries = database.prepare(`
  SELECT * FROM retrieval_evaluation_queries WHERE active = 1 ORDER BY id
`).all();
const insertRun = database.prepare(`
  INSERT INTO retrieval_evaluation_runs
    (query_id, engine_kind, engine_version, duration_ms, result_count, expectation_met, evaluator_note)
  VALUES (?, 'sqlite-fts5-linked-topics', '1', ?, ?, ?, ?)
`);
const insertResult = database.prepare(`
  INSERT INTO retrieval_evaluation_results
    (run_id, rank, result_kind, result_id, title, match_scope, score)
  VALUES (?, ?, 'topic', ?, ?, 'supplementary-source', ?)
`);

const execute = database.transaction(() => queries.map((query) => {
  const started = performance.now();
  const results = evaluate(query);
  const durationMs = Math.max(0, Math.round(performance.now() - started));
  const hasExpectation = Boolean(query.expected_title_contains);
  const expectationMet = hasExpectation
    ? results.some((result) => result.title.toLowerCase().includes(query.expected_title_contains.toLowerCase()))
    : null;
  const note = hasExpectation && !expectationMet ? 'No ranked topic met the current expectation.' : null;
  const run = insertRun.run(query.id, durationMs, results.length, expectationMet === null ? null : expectationMet ? 1 : 0, note);
  results.forEach((result, index) => insertResult.run(
    run.lastInsertRowid, index + 1, result.id, result.title, result.score,
  ));
  return { query: query.query_text, durationMs, count: results.length, expectationMet, top: results[0]?.title ?? null };
}));

const results = execute();
const reviewed = results.filter((result) => result.expectationMet !== null);
const passed = reviewed.filter((result) => result.expectationMet).length;
console.log(JSON.stringify({
  databasePath,
  engine: 'sqlite-fts5-linked-topics',
  semantic: false,
  passed,
  reviewed: reviewed.length,
  total: results.length,
  results,
}, null, 2));
database.close();
