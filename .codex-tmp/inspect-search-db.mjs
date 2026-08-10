import Database from "better-sqlite3";

const db = new Database("data/omhas.db", { readonly: true, fileMustExist: true });
const tables = [
  "TOPICS", "GRADES", "SUBJECTS", "TOPIC_GRADES", "STANDARDS", "TOPIC_STANDARDS", "TOPIC_MATERIALS",
  "SONGS", "RESOURCES", "lesson_blueprints", "lesson_materials", "search_chunks",
  "curriculum_topics", "curriculum_topic_songs",
];

for (const table of tables) {
  const exists = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table);
  if (!exists) continue;
  const count = db.prepare(`SELECT COUNT(*) AS count FROM "${table}"`).get().count;
  const columns = db.prepare(`PRAGMA table_info("${table}")`).all().map(({ name, type }) => `${name}:${type}`);
  console.log(`\n[${table}] ${count}`);
  console.log(columns.join(", "));
}

for (const query of ["ponies lap rhymes", "fingerplays with ponies", "farm animal movement", "cleanup transition song"]) {
  const tokens = query.toLowerCase().split(/\s+/).filter((token) => token.length > 2);
  const clauses = tokens.map(() => "lower(coalesce(t.lesson_topic, '') || ' ' || coalesce(t.category, '') || ' ' || coalesce(t.skill_statement, '')) LIKE ?");
  const rows = db.prepare(`
    SELECT t.id, t.lesson_topic AS title, t.category, t.skill_statement,
      group_concat(DISTINCT g.key) AS grades,
      COUNT(DISTINCT ts.standard_id) AS standard_count,
      COUNT(DISTINCT tm.id) AS material_count
    FROM TOPICS t
    LEFT JOIN TOPIC_GRADES tg ON tg.topic_id = t.id
    LEFT JOIN GRADES g ON g.id = tg.grade_id
    LEFT JOIN TOPIC_STANDARDS ts ON ts.topic_id = t.id
    LEFT JOIN TOPIC_MATERIALS tm ON tm.topic_id = t.id
    WHERE ${clauses.join(" OR ")}
    GROUP BY t.id
    ORDER BY
      CASE WHEN lower(t.lesson_topic) = ? THEN 0 WHEN lower(t.lesson_topic) LIKE ? THEN 1 ELSE 2 END,
      material_count DESC, standard_count DESC, t.lesson_topic
    LIMIT 10
  `).all(...tokens.map((token) => `%${token}%`), query.toLowerCase(), `%${tokens[0] ?? query.toLowerCase()}%`);
  console.log(`\n[QUERY] ${query}`);
  console.log(JSON.stringify(rows, null, 2));
}

const linkSamples = db.prepare(`
  SELECT sc.kind, sc.title, sc.url, sc.source_path
  FROM search_chunks sc
  WHERE sc.url IS NOT NULL AND length(trim(sc.url)) > 0
  LIMIT 15
`).all();
console.log("\n[LINK SAMPLES]");
console.log(JSON.stringify(linkSamples, null, 2));

for (const table of ["TAGS", "SONG_TAGS", "TOPIC_TAGS"]) {
  const exists = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table);
  if (!exists) continue;
  console.log(`\n[${table}]`);
  console.log(db.prepare(`PRAGMA table_info("${table}")`).all().map(({ name, type }) => `${name}:${type}`).join(", "));
}

console.log("\n[PONY SONGS]");
console.log(JSON.stringify(db.prepare(`
  SELECT id, song_name, type, educational_domain, age_range, url, substr(tags, 1, 180) AS tags
  FROM SONGS
  WHERE lower(song_name) LIKE '%pony%' OR lower(coalesce(tags, '')) LIKE '%ponies%'
  ORDER BY song_name
  LIMIT 30
`).all(), null, 2));

console.log("\n[RESOURCE URL COUNTS]");
console.log(JSON.stringify({
  songsWithUrls: db.prepare("SELECT COUNT(*) AS n FROM SONGS WHERE url IS NOT NULL AND length(trim(url)) > 0").get().n,
  resourcesWithUrls: db.prepare("SELECT COUNT(*) AS n FROM RESOURCES WHERE url IS NOT NULL AND length(trim(url)) > 0").get().n,
  resourceTypes: db.prepare("SELECT type, COUNT(*) AS n FROM RESOURCES GROUP BY type ORDER BY n DESC").all(),
}, null, 2));

db.close();
