<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# This is shadcn

What is shadcn? Use the @shadcn skill and read the rules. Report 3 assumptions you would have made that you will never do now that you've reviewed the documentation. 

You must review the online current documentation. If you provided in memory or past converation knowledge you must repeat the steps and read the documentation.

# Project contract

1. Before editing, read the relevant [Next.js docs](node_modules/next/dist/docs/), [shadcn rules](.agents/skills/shadcn/SKILL.md), matching [branding MDX](content/pages/branding/), and its rendered `/branding` example; inspect the rendered result visually.
2. Follow those references exactly: use App Router, Tailwind utilities, installed shadcn components, and demonstrated production patterns; do not invent replacements, layouts, wrappers, breakpoints, or styles.
3. If the code conflicts with documentation, stop and tell the user the exact conflict and actionable repair before continuing.
4. Do not call code bloated or removable merely because it appears unused; prove that it has no import, runtime, data, or documented purpose first.
5. Register every asset URL only in [`app/brand-assets.css`](app/brand-assets.css), update that registry for new assets, and consume semantic names from components.
6. Preserve user-authored copy and data; use the [current schema](.agents/skills/sql-expert/references/current-schema.md) for Drizzle, SQLite, and semantic search work.
7. Reuse `http://localhost:3000`, report progress with checkmarks, fix confirmed violations immediately, and verify affected UI at Tailwind breakpoints with keyboard and overflow checks.
