import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import Database from "better-sqlite3";

const migrationId = "20260813_003_add_planning_windows";
const root = process.cwd();
const databasePath = path.resolve(option("--db") ?? "data/omhas.db");
const backupPath = option("--backup") ? path.resolve(option("--backup")) : undefined;
const migrationPath = path.join(root, "src", "db", "migrations-sqlite", "0018_add_planning_windows.sql");

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}

if (!process.argv.includes("--apply")) {
  throw new Error("Migration not applied. Re-run with --apply and --backup <new backup path>.");
}
if (!fs.existsSync(databasePath)) throw new Error(`Database not found: ${databasePath}`);
if (!fs.existsSync(migrationPath)) throw new Error(`Migration SQL not found: ${migrationPath}`);
if (!backupPath) throw new Error("A new --backup path is required before migrating omhas.db.");
if (fs.existsSync(backupPath)) throw new Error(`Refusing to overwrite backup: ${backupPath}`);
if (path.resolve(backupPath) === databasePath) throw new Error("Backup must be a new file, not the live database.");

const db = new Database(databasePath, { fileMustExist: true });
try {
  db.pragma("foreign_keys = ON");
  const preIntegrity = db.pragma("integrity_check", { simple: true });
  const preForeignKeys = db.pragma("foreign_key_check");
  if (preIntegrity !== "ok" || preForeignKeys.length > 0) {
    throw new Error(`Refusing migration: integrity=${preIntegrity}; foreignKeyErrors=${preForeignKeys.length}`);
  }

  const ledger = db.prepare("SELECT 1 FROM schema_migrations WHERE migration_id = ?").get(migrationId);
  if (ledger) {
    console.log(JSON.stringify({ status: "already applied", migrationId, database: databasePath }, null, 2));
    process.exit(0);
  }

  const sourceHash = sha256(databasePath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(databasePath, backupPath, fs.constants.COPYFILE_EXCL);
  if (sha256(backupPath) !== sourceHash) throw new Error("Backup verification failed; live database was not changed.");

  db.exec(fs.readFileSync(migrationPath, "utf8"));
  db.prepare(`
    INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256)
    VALUES (?, ?, ?, 'PENDING', 'PENDING')
  `).run(migrationId, new Date().toISOString(), sourceHash);
  db.pragma("user_version = 18");

  const integrity = db.pragma("integrity_check", { simple: true });
  const foreignKeys = db.pragma("foreign_key_check");
  if (integrity !== "ok" || foreignKeys.length > 0) {
    throw new Error(`Migration validation failed: integrity=${integrity}; foreignKeyErrors=${foreignKeys.length}`);
  }

  console.log(JSON.stringify({
    status: "applied",
    migrationId,
    database: databasePath,
    backup: backupPath,
    planningWindows: db.prepare("SELECT count(*) AS count FROM planning_windows").get().count,
    aliases: db.prepare("SELECT count(*) AS count FROM planning_window_aliases").get().count,
    monthMappings: db.prepare("SELECT count(*) AS count FROM planning_window_months").get().count,
    integrity,
    foreignKeyErrors: foreignKeys.length,
  }, null, 2));
} finally {
  db.close();
}
