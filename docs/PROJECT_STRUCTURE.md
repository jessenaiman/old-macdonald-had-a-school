# Project structure

This repository is a conventional Next.js App Router content site. The tactile visual system is rich;

 ## USE SKILLS

- frontend-design — responsive layout, visual hierarchy, and intentional UI design.- vercel:nextjs — current Next.js App Router conventions.
- vercel:shadcn — shadcn/ui composition, accessible components, and Tailwind integration.
- vercel:agent-browser-verify — visual responsive checks in a real browser at mobile and desktop viewports.
- vercel:react-best-practices — review after multi-component TSX changes.

The complete approved request path is:

`App Router page -> reusable template component -> Markdown/MDX file -> HTML`

There is no approved database, API layer, custom content framework, search service, embedding pipeline,
or second frontend application.

The eventual curriculum source will be a spreadsheet, but its structure is not yet locked. No current
column name, sheet name, workbook name, row location, status vocabulary, or required-field list should
be treated as canonical.

## Production structure

| Path | Single responsibility |
| --- | --- |
| `app/` | Routes, layouts, route metadata, and global styles |
| `components/` | Reusable semantic React UI and page templates |
| `content/` | Teacher-facing Markdown/MDX curriculum content |
| `data/` | Structured non-page records that are not MDX content |
| `lib/` | Content loaders, typed domain records, and shared helpers |
| `public/` | Web-served images, fonts, printables, and locked design references |
| `tests/` | Runtime, rendered-output, accessibility, and visual checks |
| `scripts/` | Repeatable maintenance, validation, ingestion, and audit commands |
| `docs/` | Current project rules, maps, decisions, reviews, and handoffs |

The project intentionally uses root-level `app/` rather than `src/app/`. Do not introduce a second
source root. Use the `@/*` alias for imports from the repository root.

## Content model

Curriculum prose belongs in `content/`. React templates provide presentation and necessary interaction.
One small server-only content module should read frontmatter and Markdown, validate the documented
fields, and return plain data to those templates.

The current site names files `.mdx`, but renders their bodies through `react-markdown`; it does not yet
support JSX components inside MDX. Supporting real MDX would use Next.js's documented `@next/mdx`
integration and requires explicit approval. Until then, describe the content as Markdown stored in
`.mdx` files.

Two production loaders currently parse the same lesson directory: `lib/mdx-content.ts` and
`lib/content/lessons.ts`. This is unapproved duplication and should be consolidated into one loader in
a dedicated change after choosing the canonical lesson schema.

When the spreadsheet is approved, add one boundary adapter:

`spreadsheet row -> approved column map -> stable lesson/page model -> existing template`

Only that adapter may know spreadsheet column names. Routes and visual templates must not access raw
rows or infer missing columns. A later database may implement the same stable model without changing
the templates.

## Reference and prototype material

These paths are not production source:

- `figma-copy-design/`
- `public/design-concepts/`
- `public/design-explorations-v5/`
- contact sheets, atlases, page composites, and Canva page-section crops
- root HTML/Vite texture demos
- `qa/`, `playwright-report/`, and `test-results/` evidence

They may be inspected to understand or verify the design, but must not be copied wholesale into the
application. A visual reference does not override locked cast data or the asset governance status.

## Current structural risks

- Both `pnpm-lock.yaml` and an untracked `package-lock.json` are present. `package.json` declares pnpm;
  choose one package manager before deleting either lockfile.
- An untracked PostgreSQL/pgvector/embedding experiment is present in `docker/`, `docker-compose.yml`,
  several root `scripts/*.mjs` files, and uncommitted `package.json` dependencies. It is not imported by
  the website and is not approved production architecture. Preserve it unchanged until the user decides
  whether it belongs in a separate experiment or should be removed.
- `scripts/content/validate.mjs` currently assumes `publicationStatus`, workbook/sheet/row provenance,
  fixed template values, and fixed section names. Those rules are premature while the spreadsheet is
  still being defined and must not be treated as the approved content contract.
- The old root `texture-assets/` deletion and untracked `public/texture-assets/` copy are an in-progress
  relocation. Do not restore, delete, or finalize either side without explicit approval.
- Generated directories and logs (`.next/`, reports, test results, and local dev logs) should not be
  treated as source or reviewed as application architecture.

## Safe simplification sequence

1. Make lint, typecheck, content validation, build, and the focused runtime checks pass without warnings.
2. Confirm pnpm as the package manager and reconcile the npm lockfile only with explicit approval.
3. Mark or relocate prototypes and generated evidence in a dedicated cleanup change, after reference
   scans and explicit approval.
4. Consolidate overlapping project-status documents only after preserving still-current decisions.
5. Consider component subfolders only when ownership is clear; do not perform a broad cosmetic move.

No directory move, rename, deletion, or package-manager migration is authorized by this document.
