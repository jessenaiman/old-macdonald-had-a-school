#!/usr/bin/env node
// Read-only integrity audit over data/omhas.db. NEVER writes.
// Checks:
//   1. Orphaned topic_standards rows (topic_id or standard_id with no parent row).
//   2. Ambiguous bare framework codes in standards (same code across >1 framework)
//      and topic_standards links riding on them (known ~164-row fuzzy-link issue).
//   3. Row-count drift signals vs import_batches ledger:
//      - every import_batches.migration_id exists in schema_migrations;
//      - live topics never exceed the curriculum_topics import stage;
//      - core tables non-empty.
// Exit 1 on any FAIL; advisory sections do not affect exit code.

import Database from "better-sqlite3";

const DB_PATH = "data/omhas.db";
const db = new Database(DB_PATH, { readonly: true });

/** @type {{ name: string, status: "pass"|"fail"|"warn", detail: string }} */
const results = [];
const fail = (name, detail) => results.push({ name, status: "fail", detail });
const pass = (name, detail) => results.push({ name, status: "pass", detail });
const warn = (name, detail) => results.push({ name, status: "warn", detail });

// --- 1. Orphaned topic_standards ---
{
  const orphanTopics = db
    .prepare(
      `SELECT COUNT(*) AS n FROM topic_standards ts
       LEFT JOIN topics t ON t.id = ts.topic_id WHERE t.id IS NULL`
    )
    .get().n;
  const orphanStandards = db
    .prepare(
      `SELECT COUNT(*) AS n FROM topic_standards ts
       LEFT JOIN standards s ON s.id = ts.standard_id WHERE s.id IS NULL`
    )
    .get().n;
  const total = orphanTopics + orphanStandards;
  if (total === 0) {
    pass("orphaned topic_standards", "0 rows reference a missing topics/standards parent");
  } else {
    const samples = db
      .prepare(
        `SELECT ts.id, ts.topic_id, ts.standard_id,
                (t.id IS NULL) AS bad_topic,
                (s.id IS NULL) AS bad_standard
         FROM topic_standards ts
         LEFT JOIN topics t ON t.id = ts.topic_id
         LEFT JOIN standards s ON s.id = ts.standard_id
         WHERE t.id IS NULL OR s.id IS NULL LIMIT 10`
      )
      .all();
    fail(
      "orphaned topic_standards",
      `${total} orphaned join row(s): ${JSON.stringify(samples)}`
    );
  }
}

// --- 2. Ambiguous bare framework codes ---
let ambiguousLinks = 0;
{
  // A code is ambiguous when the identical code string appears under more than one
  // distinct framework. Bare codes (e.g. "B2") were fuzzy-matched without framework
  // awareness during import, so links onto these codes may sit on the wrong framework.
  const ambiguous = db
    .prepare(
      `SELECT code, COUNT(DISTINCT framework) AS frameworks, COUNT(*) AS standards
       FROM standards
       WHERE code IS NOT NULL AND TRIM(code) <> ''
       GROUP BY TRIM(code)
       HAVING COUNT(DISTINCT framework) > 1
       ORDER BY standards DESC`
    )
    .all();
  if (ambiguous.length === 0) {
    warn("ambiguous bare framework codes", "no code shared across frameworks");
  } else {
    ambiguousLinks = db
      .prepare(
        `SELECT COUNT(*) AS n FROM topic_standards ts
         JOIN standards s ON s.id = ts.standard_id
         WHERE TRIM(s.code) IN (
           SELECT TRIM(code) FROM standards
           GROUP BY TRIM(code) HAVING COUNT(DISTINCT framework) > 1
         )`
      )
      .get().n;
    warn(
      "ambiguous bare framework codes",
      `${ambiguous.length} code(s) span multiple frameworks; ${ambiguousLinks} topic_standards link(s) ride on them ` +
        `(known issue: ~164 fuzzy links from normalized ontario_code matching; sanctioned fix is framework-aware re-import, not ad-hoc deletes)`
    );
  }
}

// --- 3. Row-count drift vs import_batches ---
{
  const unledgered = db
    .prepare(
      `SELECT b.migration_id FROM import_batches b
       LEFT JOIN schema_migrations m ON m.migration_id = b.migration_id
       WHERE m.migration_id IS NULL`
    )
    .all()
    .map((r) => r.migration_id);
  if (unledgered.length === 0) {
    pass(
      "import_batches ledger",
      `every import_batches.migration_id (${db.prepare("SELECT COUNT(*) n FROM import_batches").get().n} batches) exists in schema_migrations`
    );
  } else {
    fail(
      "import_batches ledger",
      `${unledgered.length} batch migration_id(s) missing from schema_migrations: ${unledgered.slice(0, 10).join(", ")}`
    );
  }

  const stageRows = db.prepare("SELECT COUNT(*) AS n FROM curriculum_topics").get().n;
  const liveRows = db
    .prepare("SELECT COUNT(*) AS n FROM topics WHERE merged_into IS NULL")
    .get().n;
  if (liveRows > 0 && liveRows <= stageRows) {
    pass(
      "topics vs import stage",
      `live topics (${liveRows}) within curriculum_topics import stage (${stageRows})`
    );
  } else {
    fail(
      "topics vs import stage",
      `row-count drift: live topics=${liveRows}, curriculum_topics stage=${stageRows}`
    );
  }

  const coreTables = ["topics", "standards", "topic_standards", "songs", "search_chunks"];
  const emptyTables = coreTables.filter(
    (t) => db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n === 0
  );
  if (emptyTables.length === 0) {
    pass("core tables populated", coreTables.join(", "));
  } else {
    fail("core tables populated", `unexpectedly empty: ${emptyTables.join(", ")}`);
  }
}

db.close();

// --- Report ---
console.log(`Integrity report for ${DB_PATH} (read-only)\n`);
for (const r of results) {
  const tag = { pass: "PASS", fail: "FAIL", warn: "WARN" }[r.status];
  console.log(`[${tag}] ${r.name}`);
  console.log(`       ${r.detail}\n`);
}
const failed = results.filter((r) => r.status === "fail");
console.log(
  failed.length === 0
    ? "Result: PASS"
    : `Result: FAIL (${failed.length} failing check${failed.length > 1 ? "s" : ""})`
);
process.exit(failed.length === 0 ? 0 : 1);
