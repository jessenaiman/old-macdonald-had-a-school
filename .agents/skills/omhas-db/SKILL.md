---
name: omhas-db
description: Drizzle + better-sqlite3 guardrails for data/omhas.db. Read-only by default. No schema change or data insert without explicit per-change human approval delivered through the orchestrator. Schema changes only via committed drizzle migrations.
---

# OMHAS database skill (drizzle + sqlite)

`data/omhas.db` is the READ-ONLY source truth for the website. This skill governs every database task.

## Hard guardrails

1. Never execute INSERT/UPDATE/DELETE/DDL ad hoc. The only sanctioned schema path is a committed migration file in `src/db/migrations-sqlite/` applied with `npm run db:migrate` (drizzle-kit). `npm run db:push` and `drizzle-kit push` are policy-denied — do not attempt them.
2. Every write proposal must include, before any SQL runs: exact SQL, a read-only SELECT preview with row counts, a rollback statement, and the citable human-approved provenance (source_documents/research_sources/import_batches chain). No provenance chain → the row does not exist.
3. Proposals go to the orchestrator for human approval. Subagents never self-approve.
4. Read-only access uses `readonly: true` opens (pattern: `scripts/db/verify-integrity.mjs`). Extend that script for recurring checks instead of one-off scripts.
5. Drizzle config is `drizzle.sqlite.config.ts` (dialect sqlite, schema `./src/db/schema-sqlite.ts`). Migrations are plain SQL in `src/db/migrations-sqlite/` (see `0000_baseline_sqlite_schema.sql` for shape).

## Commands (repo root)

- `npm run db:generate` — generate a migration from schema diff
- `npm run db:migrate` — apply committed migrations (the only sanctioned write path)
- `npm run db:evaluate-search` — read-only retrieval evaluation
- `npm run db:embeddings` — rebuild search embeddings sidecar (owner-run; excluded from agent scope)

## Documentation (read these; cite the exact page you used)

- Drizzle Kit: https://orm.drizzle.team/docs/kit-overview
- Drizzle SQLite dialect: https://orm.drizzle.team/docs/sqlite-dialect
- better-sqlite3: https://github.com/WiseLibs/better-sqlite3
- Repo schema map and read path: `.omp/agents/db-curator.md`
