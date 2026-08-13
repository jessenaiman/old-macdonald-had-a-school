import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Database from "better-sqlite3";

const migrationId = "20260813_006_add_suggested_curriculum_plans";
const root = process.cwd();
const databasePath = path.resolve(option("--db") ?? "data/omhas.db");
const backupPath = option("--backup") ? path.resolve(option("--backup")) : undefined;
const migrationPath = path.join(root, "src", "db", "migrations-sqlite", "0021_add_suggested_curriculum_plans.sql");

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}
if (!process.argv.includes("--apply")) throw new Error("Migration not applied. Re-run with --apply and --backup <new backup path>.");
if (!backupPath || fs.existsSync(backupPath)) throw new Error("A new --backup path is required before migrating omhas.db.");
if (!fs.existsSync(databasePath) || !fs.existsSync(migrationPath)) throw new Error("Database or migration SQL is missing.");

const db = new Database(databasePath, { fileMustExist: true });
try {
  db.pragma("foreign_keys = ON");
  if (db.pragma("integrity_check", { simple: true }) !== "ok" || db.pragma("foreign_key_check").length) throw new Error("Refusing migration: database integrity check failed.");
  if (db.prepare("SELECT 1 FROM schema_migrations WHERE migration_id = ?").get(migrationId)) {
    console.log(JSON.stringify({ status: "already applied", migrationId }, null, 2));
    process.exit(0);
  }
  const sourceHash = sha256(databasePath);
  fs.copyFileSync(databasePath, backupPath, fs.constants.COPYFILE_EXCL);
  if (sha256(backupPath) !== sourceHash) throw new Error("Backup verification failed; live database was not changed.");
  db.exec(fs.readFileSync(migrationPath, "utf8"));
  db.prepare("INSERT INTO schema_migrations (migration_id, applied_at, omhas_sha256, curriculum_sha256, generated_sha256) VALUES (?, ?, ?, 'PENDING', 'PENDING')").run(migrationId, new Date().toISOString(), sourceHash);
  db.pragma("user_version = 21");
  const integrity = db.pragma("integrity_check", { simple: true });
  const foreignKeys = db.pragma("foreign_key_check");
  if (integrity !== "ok" || foreignKeys.length) throw new Error(`Migration validation failed: integrity=${integrity}; foreignKeyErrors=${foreignKeys.length}`);
  console.log(JSON.stringify({ status: "applied", migrationId, backup: backupPath, plans: db.prepare("SELECT count(*) AS n FROM suggested_curriculum_plans").get().n, placements: db.prepare("SELECT count(*) AS n FROM suggested_curriculum_plan_placements").get().n, integrity, foreignKeyErrors: foreignKeys.length }, null, 2));
} finally { db.close(); }
