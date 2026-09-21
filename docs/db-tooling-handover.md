# DB/API tooling removal — handover

**Date:** 2026-09-21 · **Branch:** `main` · **Status:** committed, build passes

## Why

This repo is the Old MacDonald Had a School **website** and nothing else. Schema,
migration, embedding, and API-connection work belongs to the separate project
`jessenaiman/curriculum-api` (its own repo, Postgres, own AGENTS.md). The legacy
SQLite/Postgres tooling that lived here distracted agents and duplicated DB
ownership, so it was removed.

## What was removed (107 files, ~22k lines)

- `scripts/db/` — drive-by migrations (apply-0018..0021), `build-search-embeddings.mjs`, schema/integrity checkers.
- `scripts/data/` — `migrate-unified-omhas.mjs`, retrieval eval, import/repair scripts, `.sql` files.
- `scripts/resources/`, `scripts/songbook/` — one-off song/resource research + import pipelines (JSONL batches, PDF parsing).
- `src/db/` — Drizzle schema + all 22 SQLite migrations (`migrate-to-sqlite.ts` embedded a live Neon Postgres connection string — removed, never re-add).
- `drizzle.sqlite.config.ts`, `db-diagram.mmd`, `data/*.xlsx` (5 curriculum exports), `data/TEST_SEARCH_QUERIES.md`.
- Loose scripts: `extract-pdf-facts*.py`, `clean-songs-lyrics.mjs`, `test-lesson-query.mjs`, `test-sqlite-queries.ts`, `check-clean-worktree.mjs`, `init-artifact.sh`.
- `lefthook.yml` + `lefthook` devDep — advertised a CI gate that never ran.
- `.agents/skills/omhas-db/`, `.omp/agents/db-curator.md` — DB-management roles/skills, out of scope here.
- Deps dropped: `drizzle-orm`, `drizzle-kit`, `pg` (lockfile regenerated).

## What stayed (runtime, read-only)

- `data/omhas.db` and `data/search-vectors.db` — committed, read-only at runtime
  (`lib/curriculum-db.ts` opens `readonly: true`, `query_only ON`; search route
  reads the sidecar). Both must stay in the repo — build fails without `omhas.db`.
- `@xenova/transformers` — **runtime** dep of `app/api/search/route.ts` (query
  embedding), re-added after initial removal; its lazy import needs it at build time.
- `scripts/verify-theme-contrast.mjs` — the only check (`npm run test:theme-contrast`).
- Design/asset scripts in `scripts/` (brand emblem, icon convert, Blender renders, etc.).

## Verification

- `npm run lint` — 0 errors (1 pre-existing warning removed with `.worktrees/` disk leftover).
- `npm run typecheck` — clean.
- `npm run build` — full Next build **passes** (`data/omhas.db` traced by `next.config.ts`).
- `npm run test:theme-contrast` — run before merge as usual.

## Handoffs for the DB project

- Schema/data evolution now happens exclusively in `curriculum-api`; downstream DB
  refresh happens upstream, not here.
- If search embeddings need rebuilding, that tooling must live in `curriculum-api`
  (the committed sidecar is consumed read-only here).
- AGENTS.md now states the role boundary explicitly.