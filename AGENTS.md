# Old MacDonald Had a School — Website

## Role

This repository is the **Old MacDonald Had a School** teacher-resource website (Next.js 16 App Router, Tailwind CSS v4, MDX). No database, schema, migration, or API-connection work happens here — that lives in `jessenaiman/curriculum-api`.

## Workflow

- Feature and spec work happens on short-lived PR branches into `main`, reviewed by the coordinator.
- Specs, decisions, and board state live in **Spill** (`.spill.json`, gitignored).

## Visual Source of Truth

- Shared FigCraft design document: `main-vault/Creative/Design/omhas-website-v1.figcraft`
- `main-vault` DesignCraft Character Bibles
- Core aesthetic: zero parchment; inset cork section framing; physical paper notes and pinned cloth badges; *Our Circle Promise* as a silent design principle.

## Runtime Data (Read-Only)

- `data/omhas.db` and `data/search-vectors.db` are committed read-only SQLite databases (`better-sqlite3` with `readonly: true`); do not edit or delete them.

## Commands

- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — production Next.js build (requires `data/omhas.db`)
- `npm run dev` — local dev server (verify runtime changes with `.agents/skills/next-dev-loop`)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
