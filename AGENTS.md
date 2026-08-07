<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project operating rules

## Approved architecture only

This is a simple content website. Its approved production architecture is:

`Next.js App Router route -> reusable page template -> Markdown/MDX content file -> rendered page`

Tailwind CSS and ordinary component-scoped CSS may style those templates. There is no approved custom
application framework, content platform, database, API layer, repository pattern, ingestion pipeline,
search index, embedding system, or alternate frontend runtime. If an agent finds or believes it needs
one, it must explain the exact need and receive explicit user approval before changing or extending it.

A future database must use a current, documented Next.js integration and direct Server Component reads
or Server Actions for mutations unless an external API genuinely requires a Route Handler. Future
possibility is not approval to add database infrastructure now.

The future curriculum spreadsheet and its schema are still being designed. Do not hard-code spreadsheet
column names, required columns, sheet names, workbook names, row positions, status values, or mappings
into routes or templates. Until the user explicitly approves a schema, spreadsheet work is limited to
read-only inspection and proposals. When approved, isolate column mapping in one import adapter so the
pages consume a small documented content model rather than spreadsheet-shaped records.

## Required orientation

Before changing application code or selecting a visual asset, read:

1. `docs/PROJECT_STRUCTURE.md`
2. `docs/PROJECT_FILE_MAP_AND_QA_START.md`
3. `docs/ASSET_LIBRARY_GOVERNANCE.md`
4. `public/CAST_AND_ROLES.md`
5. `docs/DESIGN_ASSET_MASTER_LIST.md` when the task involves imagery

Treat `app/`, `components/`, `content/`, `lib/`, and `public/` as the production system. Treat
`figma-copy-design/`, page composites, contact sheets, atlases, and design explorations as references,
not production components.

## Stop instead of guessing

An agent must pause and report the exact unanswered question before making a change when any of these
conditions applies:

- the intended asset, character, role, grade, subject, colour, reference design, or responsive behavior
  is not explicitly identified by a locked source;
- two sources conflict, a source appears stale, or a required source cannot be opened;
- an asset may be clipped, damaged, flattened, recoloured, duplicated, or marked for review;
- a proposed action would substitute an approximation, generated alternative, emoji, CSS drawing, or
  generic icon for an authored asset;
- a move, rename, deletion, overwrite, export, upload, archive, or dependency migration is contemplated;
- custom architecture or infrastructure exists, or a task appears to require introducing it;
- spreadsheet columns, mappings, required fields, defaults, or validation rules have not been approved;
- the requested result would require choosing among plausible interpretations.

The pause report must contain only:

1. what was verified;
2. the conflicting or missing evidence;
3. the smallest concrete question needed to continue;
4. the files that remain unchanged.

Do not convert a likely answer into an implementation assumption. Continue only after the parent agent
or user resolves the question. Safe read-only inspection and verification may continue while paused.

## Locked design authority

- `public/CAST_AND_ROLES.md` locks identities, roles, grade ownership, and exact colours.
- Canva-authored project assets supply textures, patches, icons, fasteners, and separated visual pieces.
- Approved Figma/reference designs supply typography, spacing, hierarchy, and component boundaries.
- React and HTML must provide semantic controls and content. Never replace interactive UI with a page
  screenshot, composite image, or invisible hotspot layer.
- Follow the exact mutation approval gate in `docs/ASSET_LIBRARY_GOVERNANCE.md` for every asset action.

## Change and handoff discipline

- Preserve unrelated and pre-existing worktree changes.
- Prefer the smallest reversible patch. Do not reorganize directories during feature or visual QA work.
- Run `npm run lint` and `npm run typecheck` after source changes. Run the relevant runtime or visual test
  for behavior or layout changes.
- Report completed checks with evidence, and list unresolved items separately. Never report a visual
  match without a same-viewport comparison against the named reference.
