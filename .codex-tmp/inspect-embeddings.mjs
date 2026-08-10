import Database from "better-sqlite3";

const db = new Database("data/omhas.db", { readonly: true, fileMustExist: true });
const counts = db.prepare(`
  SELECT
    COUNT(*) AS total,
    SUM(CASE WHEN embedding IS NOT NULL AND length(trim(embedding)) > 0 THEN 1 ELSE 0 END) AS populated,
    MIN(length(embedding)) AS min_length,
    MAX(length(embedding)) AS max_length
  FROM search_chunks
`).get();
const samples = db.prepare(`
  SELECT id, kind, title, embedding, substr(embedding, 1, 180) AS prefix, length(embedding) AS length
  FROM search_chunks
  WHERE embedding IS NOT NULL AND length(trim(embedding)) > 0
  LIMIT 4
`).all();

const parsed = samples.map((sample) => {
  let outer;
  let vector;
  try {
    outer = JSON.parse(sample.embedding);
    vector = Array.isArray(outer) && typeof outer[0] === "string" ? JSON.parse(outer.join("")) : outer;
  } catch {
    outer = null;
    vector = null;
  }
  const norm = Array.isArray(vector)
    ? Math.sqrt(vector.reduce((sum, item) => sum + Number(item) * Number(item), 0))
    : null;
  return {
    id: sample.id,
    kind: sample.kind,
    title: sample.title,
    prefix: sample.prefix,
    length: sample.length,
    outer_length: Array.isArray(outer) ? outer.length : null,
    vector_dimensions: Array.isArray(vector) ? vector.length : null,
    vector_norm: norm,
    first_values: Array.isArray(vector) ? vector.slice(0, 5) : [],
  };
});

console.log(JSON.stringify({ counts, samples: parsed }, null, 2));
db.close();
