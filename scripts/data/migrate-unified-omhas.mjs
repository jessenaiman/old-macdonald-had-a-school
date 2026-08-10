import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import Database from "better-sqlite3";

const MIGRATION_ID = "20260810_001_unify_curriculum_lessons_into_omhas";
const EXPECTED = {
  omhas: "2FD34AB91188F2FBF0B82D9BEC350889949DB95A2579C4ED4F901B8279FB175D",
  curriculum: "20B0679F956EAA5206E8DB7A47046043E55B32F0F3FEFDD076A56D5076465F35",
  generated: "8F5222A6F5413241F0F512EE47F89DF9A923F8533012F93B0B9DCA37752C88EE",
};

const CURRICULUM_TABLES = [
  "SUBJECTS", "GRADES", "TOPICS", "TOPIC_GRADES", "WEEKLY_PACING",
  "STANDARDS", "TOPIC_STANDARDS", "SONGS", "ACTIVITIES",
  "BOOK_SUGGESTIONS", "RESOURCES", "SOURCES", "MATERIAL_RELATIONS",
  "TAGS", "MATERIAL_TAGS", "TOPIC_TAGS", "TOPIC_MATERIALS",
];

const GENERATED_TABLES = [
  "lesson_blueprints", "lesson_resource_guidance", "lesson_review",
  "lesson_search_prompts", "lesson_song_guidance", "lesson_steps",
  "worksheet_briefs",
];

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}

function assertFile(filename, label, expectedHash) {
  if (!filename || !fs.existsSync(filename)) throw new Error(`${label} database not found: ${filename ?? "(missing argument)"}`);
  const actual = sha256(filename);
  if (actual !== expectedHash) {
    throw new Error(`${label} database changed since this migration was reviewed. Expected ${expectedHash}; found ${actual}. Review and version a new migration instead of bypassing this check.`);
  }
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

function tableSql(db, table) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND lower(name) = lower(?)").get(table);
  if (!row?.sql) throw new Error(`Source table schema missing: ${table}`);
  if (table === "lesson_blueprints") {
    return row.sql.replace(
      /REFERENCES\s+curriculum_topics\s*\(id\)/i,
      "REFERENCES TOPICS(id)",
    );
  }
  return row.sql;
}

function copyTable(source, target, table) {
  target.exec(tableSql(source, table));
  const columns = source.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all().map((column) => column.name);
  const columnSql = columns.map(quoteIdentifier).join(", ");
  const placeholders = columns.map(() => "?").join(", ");
  const insert = target.prepare(`INSERT INTO ${quoteIdentifier(table)} (${columnSql}) VALUES (${placeholders})`);
  const rows = source.prepare(`SELECT ${columnSql} FROM ${quoteIdentifier(table)}`).iterate();
  let count = 0;
  for (const row of rows) {
    insert.run(...columns.map((column) => row[column]));
    count += 1;
  }
  return count;
}

function sourceKind(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();
  if (extension === ".md" || extension === ".mdx") return "markdown";
  if (extension === ".pdf") return "pdf";
  if (extension === ".html" || extension === ".htm") return "web-capture";
  if (extension === ".txt") return "text";
  return "other";
}

const omhasPath = path.resolve(option("--omhas") ?? "data/omhas.db");
const curriculumPath = path.resolve(option("--curriculum") ?? "C:/Users/jesse/OneDrive/Documents/New project/data/curriculum.db");
const generatedPath = path.resolve(option("--generated") ?? "C:/Users/jesse/OneDrive/Documents/New project/data/generated_lessons.db");
const apply = process.argv.includes("--apply");
const backupPath = option("--backup") ? path.resolve(option("--backup")) : undefined;

if (!apply) throw new Error("Migration not applied. Re-run with --apply and --backup <new backup path>.");
if (!backupPath) throw new Error("A new --backup path is required before migrating omhas.db.");
if (fs.existsSync(backupPath)) throw new Error(`Refusing to overwrite backup: ${backupPath}`);
if ([omhasPath, curriculumPath, generatedPath].includes(backupPath)) throw new Error("Backup must be a new file, not a source database.");

assertFile(omhasPath, "omhas", EXPECTED.omhas);
assertFile(curriculumPath, "curriculum", EXPECTED.curriculum);
assertFile(generatedPath, "generated lessons", EXPECTED.generated);

fs.mkdirSync(path.dirname(backupPath), { recursive: true });
fs.copyFileSync(omhasPath, backupPath, fs.constants.COPYFILE_EXCL);
if (sha256(backupPath) !== EXPECTED.omhas) throw new Error("Backup verification failed; omhas.db was not opened.");

const curriculum = new Database(curriculumPath, { readonly: true, fileMustExist: true });
const generated = new Database(generatedPath, { readonly: true, fileMustExist: true });
const target = new Database(omhasPath, { fileMustExist: true });

try {
  curriculum.pragma("query_only = ON");
  generated.pragma("query_only = ON");
  target.pragma("foreign_keys = OFF");

  const migrate = target.transaction(() => {
    target.exec(`
      CREATE TABLE schema_migrations (
        migration_id TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL,
        omhas_sha256 TEXT NOT NULL,
        curriculum_sha256 TEXT NOT NULL,
        generated_sha256 TEXT NOT NULL
      );

      CREATE TABLE import_batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        migration_id TEXT NOT NULL,
        source_name TEXT NOT NULL,
        source_path TEXT NOT NULL,
        source_sha256 TEXT NOT NULL,
        imported_at TEXT NOT NULL,
        FOREIGN KEY (migration_id) REFERENCES schema_migrations(migration_id)
      );
    `);

    const imported = {};
    for (const table of CURRICULUM_TABLES) imported[table] = copyTable(curriculum, target, table);
    for (const table of GENERATED_TABLES) imported[table] = copyTable(generated, target, table);

    target.exec(`
      CREATE TABLE lesson_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_id INTEGER NOT NULL,
        material_kind TEXT NOT NULL CHECK (material_kind IN ('song', 'activity', 'book', 'resource', 'video', 'assignment', 'story', 'craft', 'printable', 'other')),
        material_id INTEGER NOT NULL,
        role TEXT NOT NULL DEFAULT 'supporting' CHECK (role IN ('focus', 'supporting')),
        use_in_phase TEXT,
        teacher_rationale TEXT,
        verification_state TEXT NOT NULL DEFAULT 'unverified',
        source_table TEXT NOT NULL,
        source_row_id INTEGER NOT NULL,
        FOREIGN KEY (lesson_id) REFERENCES lesson_blueprints(id) ON DELETE CASCADE,
        UNIQUE (lesson_id, material_kind, material_id, source_table, source_row_id)
      );

      INSERT INTO lesson_materials (
        lesson_id, material_kind, material_id, role, use_in_phase,
        teacher_rationale, verification_state, source_table, source_row_id
      )
      SELECT lesson_id, 'song', song_id,
             CASE WHEN lower(relevance) IN ('primary', 'focus') THEN 'focus' ELSE 'supporting' END,
             use_in_phase, teacher_rationale, 'unverified', 'lesson_song_guidance', id
      FROM lesson_song_guidance;

      INSERT INTO lesson_materials (
        lesson_id, material_kind, material_id, role, use_in_phase,
        teacher_rationale, verification_state, source_table, source_row_id
      )
      SELECT lesson_id, 'resource', resource_id,
             CASE WHEN lower(relevance) IN ('primary', 'focus') THEN 'focus' ELSE 'supporting' END,
             use_in_phase, teacher_rationale, verification_state, 'lesson_resource_guidance', id
      FROM lesson_resource_guidance;

      CREATE TABLE source_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_path TEXT NOT NULL UNIQUE,
        source_kind TEXT NOT NULL,
        review_state TEXT NOT NULL DEFAULT 'research_wip',
        checksum TEXT,
        imported_at TEXT NOT NULL
      );

      CREATE TABLE search_chunk_sources (
        search_chunk_id TEXT NOT NULL,
        source_document_id INTEGER NOT NULL,
        PRIMARY KEY (search_chunk_id, source_document_id),
        FOREIGN KEY (search_chunk_id) REFERENCES search_chunks(id) ON DELETE CASCADE,
        FOREIGN KEY (source_document_id) REFERENCES source_documents(id) ON DELETE CASCADE
      );
    `);

    const now = new Date().toISOString();
    const insertSource = target.prepare("INSERT INTO source_documents (source_path, source_kind, review_state, imported_at) VALUES (?, ?, 'research_wip', ?)");
    const sourcePaths = target.prepare("SELECT DISTINCT source_path FROM search_chunks ORDER BY source_path").all();
    for (const row of sourcePaths) insertSource.run(row.source_path, sourceKind(row.source_path), now);
    target.exec(`
      INSERT INTO search_chunk_sources (search_chunk_id, source_document_id)
      SELECT sc.id, sd.id
      FROM search_chunks sc
      JOIN source_documents sd ON sd.source_path = sc.source_path;
    `);

    target.prepare("INSERT INTO schema_migrations VALUES (?, ?, ?, ?, ?)").run(
      MIGRATION_ID, now, EXPECTED.omhas, EXPECTED.curriculum, EXPECTED.generated,
    );
    const batch = target.prepare("INSERT INTO import_batches (migration_id, source_name, source_path, source_sha256, imported_at) VALUES (?, ?, ?, ?, ?)");
    batch.run(MIGRATION_ID, "curriculum.db", curriculumPath, EXPECTED.curriculum, now);
    batch.run(MIGRATION_ID, "generated_lessons.db", generatedPath, EXPECTED.generated, now);
    return imported;
  });

  const imported = migrate();
  target.pragma("foreign_keys = ON");
  const integrity = target.pragma("integrity_check", { simple: true });
  const foreignKeyErrors = target.pragma("foreign_key_check");
  const summary = {
    migrationId: MIGRATION_ID,
    database: omhasPath,
    backup: backupPath,
    integrity,
    foreignKeyErrors: foreignKeyErrors.length,
    imported,
    searchChunksPreserved: target.prepare("SELECT count(*) count FROM search_chunks").get().count,
    curriculumTopicsPreserved: target.prepare("SELECT count(*) count FROM curriculum_topics").get().count,
    normalizedTopicsImported: target.prepare("SELECT count(*) count FROM TOPICS").get().count,
    lessonsImported: target.prepare("SELECT count(*) count FROM lesson_blueprints").get().count,
    lessonMaterials: target.prepare("SELECT material_kind, count(*) count FROM lesson_materials GROUP BY material_kind ORDER BY material_kind").all(),
    sourceDocuments: target.prepare("SELECT count(*) count FROM source_documents").get().count,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (integrity !== "ok" || foreignKeyErrors.length > 0) {
    throw new Error(`Staged migration validation failed: integrity=${integrity}; foreignKeyErrors=${foreignKeyErrors.length}`);
  }
} finally {
  target.close();
  generated.close();
  curriculum.close();
}
