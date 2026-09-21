# Role

This repo is the Old MacDonald Had a School **website** — improving it is the whole job. No database, schema, migration, embedding, or API-connection work happens here, ever.

The API and its Postgres database are a separate project: `jessenaiman/curriculum-api` (a different repo with its own AGENTS.md). If a task is about the API or database rather than the website UI/content, say so and stop — do not build it here.

## Workflow (keep it simple)

- All real work happens on `main`. This is a small website repo — one branch at a time.
- The old kanban/handoff machinery is dead: ignore `project-management/STATUS.md` and `project-management/Handoffs/`. Do not scan branches, worktrees, or "identify the current task" — there is no mapped task.
- Make edits directly on `main`, or on a single short-lived `<type>/<slug>` branch off `main` when the work needs a PR. Open PRs into `main` only when the user asks; never push `main` directly.
- All feature branches exist on `origin` (the archive). If you need history from a deleted local branch, check it out from `origin/<branch>`.

## Commands & verification

- Verify with `npm run lint` (eslint) then `npm run typecheck` (`tsc --noEmit`). `npm run build` runs the full Next build and requires `data/omhas.db` on disk.
- There is no `test` script. The only check is `npm run test:theme-contrast`.
- `.husky/pre-commit` runs `npx lint-staged` (Prettier on staged files) then `npm run typecheck`; it runs no tests. `.prettierignore` excludes `**/*.md` and `**/*.mdx`, so prose is never auto-formatted.
- Node 24 is pinned via `package.json` engines and `.mise.toml`.

## Runtime data (read-only, do not manage)

- `data/omhas.db` (committed, ~30 MB SQLite) is the curriculum source of truth, traced into the build by `next.config.ts` and opened read-only from server code (`lib/curriculum-db.ts`: `readonly: true`, `query_only ON`, `fileMustExist: true`). Never delete or edit it; runtime and build both fail without it.
- `app/api/search/route.ts` also reads `data/search-vectors.db` (committed embeddings sidecar; throws if missing). Never edit or rebuild prompts from it.
- These files ship with the repo and are only read at runtime. There is no write tooling in this repo — schema/data changes happen in `curriculum-api` or upstream, not here.

## Stack notes

- Next.js 16 App Router + Tailwind v4 (`app/globals.css`, `DESIGN.md`, shadcn via `components.json`). MDX is enabled (`pageExtensions` includes `md`/`mdx`) via `@next/mdx`; MDX prose lives in `content/{lessons,pages,templates}`. `content/lessons` is also read at runtime by `lib/` for markdown-match hints, so keep lesson slugs/titles stable.
- After changing app code, verify against a running `npm run dev` using the `next-dev-loop` skill (it uses the `next-devtools` MCP declared in `.mcp.json`).

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `jessenaiman/old-macdonald-had-a-school`, driven by the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles, each label string equal to its role name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.