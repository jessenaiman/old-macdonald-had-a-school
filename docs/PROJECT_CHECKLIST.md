# Old MacDonald Had a School — Project Checklist

This is the durable handoff record for the project. Every agent should read this file and `AGENTS.md` before working. Update task status and evidence as work is reviewed.

## Product direction

- Build a highly efficient teacher blog under the hood: Markdown/MDX content, reusable Next.js templates, static routes, and simple build-time validation.
- Use the Figma implementation as the visible design source for layout, typography, palette, spacing, icons, and page rhythm.
- Optimize for teachers preparing between lessons: quickly preview and print resources, or find and save videos for classroom playback.
- Maintain two lesson patterns: music-led and video-led.
- Keep curriculum content out of SQLite. The archive site and spreadsheets remain the research/data-collection system.

## Source hierarchy

1. **Visual design:** the Figma implementation, this repository's preserved `src/` and `src/assets/`, and approved Figma screenshots. The header and top of every page must be based on Figma.
2. **Content only:** canonical brand facts, cast identities/roles, biography, and project wording from `C:\Users\jesse\OneDrive\Documents\New project`.
3. The other website must never be copied as the visual design system; it is an archive/content source the new design is intended to replace.

## Active checklist

- [ ] Replace the invented `The school day, by band` section; do not use that phrase or framing.
- [ ] Match the attached Figma grade-selector layout exactly unless the user approves a visible prototype of an exception.
- [x] Prototype Daycare + Preschool as `Early Years`; this was later superseded by the user's newest exact Figma screenshot.
- [ ] Match the Figma top-of-home order exactly: compact header, four-card dark selector band, then the Figma hero/introduction below.
- [ ] Use four selector cards: Early Years (combining Daycare + Preschool), Kindergarten, Grade 1, and Grade 2. The selector band itself is the section divider; do not add an invented title or extra divider.
- [ ] Match each grade card's Figma color, left-positioned character icon, stitched inset border, dark shadow, compact typography, and stitched lesson-count button.
- [ ] Allow direct implementation of exact Figma/screenshot specifications; require rendered prototypes only for proposed visual departures, reinterpretations, or new choices.
- [x] Create and validate a project-local lead-handoff skill plus living state record for fresh-chat alignment.
- [x] Upgrade to Next.js 16.3+ and verify Turbopack.
- [x] Verify `agent-browser` 0.31.1+ and complete the installed `/next-dev-loop` preflight.
- [x] Add the `/next-dev-loop` requirement and this checklist to `AGENTS.md`.
- [ ] Keep the compact approved homepage hero: eyebrow, headline, italic promise, and smaller framed image only.
- [ ] Professionally tighten homepage hierarchy and wording without changing its fonts or palette.
- [ ] Make the age-band section efficient teacher navigation with consistent metadata and explicit linked destinations.
- [ ] Rebuild Browse by Subject as the dense Figma 2×2 cluster pattern with correct real icons, useful lesson rows, age/grade labels, Ready states, and more links.
- [ ] Remove invented homepage copy and nested text-block/card treatments that are absent from Figma; keep the lower page flat and responsive.
- [ ] Remove the cast presentation from the homepage and all curriculum-planning sections.
- [ ] Build a polished standalone `/cast` page from canonical cast data and transparent assets.
- [ ] Fix the shared top-of-page layout on every route: one compact header row, consistent content offset, no collisions, and no oversized blank band.
- [ ] Group curriculum navigation into `Early Years` and `Primary Grades` menus.
- [ ] Replace the text theme selector with an accessible real icon button.
- [ ] Preserve the bottom `A Barn Band Day` feature panel's layout, exact text, and real resource image.
- [ ] Preserve the navy/gold footer's structure, logo/credit, navigation, Cast Guide link, and closing statement.
- [ ] Verify bottom-panel and footer colors against the original Figma source/tokens; do not assume screenshot colors are authoritative.
- [ ] Migrate Jesse's existing About/portfolio content from the source website and written source files.
- [ ] Make `/about` the canonical portfolio hub and primary About page.
- [ ] Collect each cover letter, biography, personal promotion, and employer/marketing angle into its own Markdown/MDX file.
- [ ] Render every About variant through one reusable About template rather than building unrelated custom pages.
- [ ] Give every variant a stable direct URL suitable for messaging a specific employer or marketing contact.
- [ ] Ensure every variant clearly leads back to the canonical `/about` portfolio hub.
- [ ] Provide a simple Markdown index/order mechanism so Jesse can add, remove, reorder, or switch featured About variants without changing page code.
- [ ] Preserve source wording, never invent credentials or biographical claims, and flag material that requires Jesse's verification.
- [ ] Produce a source inventory showing where each Markdown file came from and what written material remains uncollected.
- [ ] Review desktop and mobile screenshots against references at matching viewport sizes.
- [ ] Require an independent Figma comparison and `APPROVED` verdict after every visual implementation batch.
- [ ] Require scoped milestone commits and draft pull-request review following `docs/TEAM_WORKFLOW.md`.
- [ ] Run independent runtime, accessibility, link, print, content, and Playwright checks.
- [ ] Add regression coverage ensuring the protected bottom feature and footer remain present.
- [x] Establish the GitHub remote and push the initial project checkpoint to `jessenaiman/old-macdonald-had-a-school`.
- [ ] Continue creating verified milestone commits as implementation and QA lanes finish.

## Environment lane evidence — Parfit (2026-08-04)

- Changed only environment/configuration files: `AGENTS.md`, `package.json`,
  `pnpm-lock.yaml`, `skills-lock.json`, and this checklist. Installed
  `.agents/skills/next-dev-loop/SKILL.md`.
- `package.json` and the pnpm lockfile specify `next@16.3.0` and
  `eslint-config-next@16.3.0`; `packageManager` remains `pnpm@10.25.0`.
- Global `agent-browser` resolves from `C:\Users\jesse\AppData\Roaming\npm`
  at version `0.33.2` (meets the `>=0.31.1` floor).
- Runtime command: `pnpm dev --turbopack -p 8443`.
- MCP preflight at `http://localhost:8443/_next/mcp`: `tools/list` includes
  `get_compilation_issues` and `get_routes`; `get_compilation_issues` returned
  `{"issues":[]}`; `get_routes` returned the App Router route map; `get_errors`
  returned empty `configErrors` and `sessionErrors`.
- Workspace-local recovery completed with `pnpm install --offline
  --ignore-scripts --frozen-lockfile --node-linker=hoisted`; `pnpm exec next
  --version` reports `Next.js v16.3.0` and the bundled docs are present.
- To recover from OneDrive's locked generated tree, it was moved intact to
  `C:\tmp\old-macdonald-node_modules-backup-20260804` before reinstalling; no
  source, visual, or content files were deleted or changed.
- `pnpm run typecheck` and `pnpm run build` compile application code but remain
  blocked by the pre-existing missing `@playwright/test` dev dependency in
  `playwright.config.ts` and `tests/e2e/site.spec.ts`; this lane did not broaden
  its write set to install Playwright.
- Browser verification rendered `/` successfully. `agent-browser a11y` found
  existing homepage color-contrast findings; visual remediation belongs to the
  independent Figma/QA lanes and was not changed here.

## QA infrastructure lane evidence — Luna (2026-08-05)

- Added `@playwright/test` `^1.62.1` with pnpm and hydrated the workspace-local
  dependency tree successfully.
- Added `playwright.visual.config.ts`,
  `tests/visual/homepage.visual.spec.ts`, and `docs/visual-qa.md`; no
  application components, visual CSS, or content files were changed.
- `pnpm run typecheck` passed and `pnpm run build` passed on Next.js 16.3.0
  with Turbopack.
- `pnpm qa:visual`: 6 of 8 checks passed across desktop `1543x900` and mobile
  `390x844`. The two screenshot checks failed only because approved automated
  baselines do not exist yet; Playwright wrote actuals to ignored
  `test-results/visual` and did not update baselines.
- Baseline policy is documented: raw Figma screenshots remain human specs;
  only an explicitly user/team-lead-approved rendered page may become a
  committed baseline, and CI never updates snapshots automatically.

## Protected visual references

- Compact hero scope: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-af870afc-d26a-4839-aa0e-c6b5a8182e81.png`
- Browse by Subject: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-697ed39e-b5db-4525-81cb-17d23bb3ca4d.png`
- Homepage hierarchy/age bands: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-7ac4671c-46c1-48ab-a574-636da0118afe.png`
- Protected bottom feature and footer: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-af5830df-b640-4e46-9527-2f4b58fb1e5e.png`
- Compact header reference: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-bae8f311-8e3b-4353-ae42-c93ee9e0bc20.png`
- Exact Figma below-hero divider and four grade cards: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-fb4b233f-9039-496a-a7d5-d5664f9e90fa.png`
- Exact Figma Browse by Subject structure: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-cf6df32a-a696-41a7-96ee-70407141af13.png`
- Exact stitched CTA treatment: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-147808b2-f68e-4cf6-be48-6b5e2f3ba5b5.png`
- Exact top-of-home order and Figma header/card/hero composition: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-3da769ee-de72-4218-bdf3-ea1d35bb07f7.png`

## Agent-reported lane snapshot — reverify before use

- **Team lead:** review, acceptance criteria, coordination, visual comparison, and approval. No application-code implementation.
- **Parfit (Luna):** dependency/runtime upgrade and `/next-dev-loop` preflight only.
- **Carson (Luna):** stopped after an unapproved implementation batch; its final files require a fresh comparison.
- **Faraday (Terra):** isolated grouped Early Years prototype image only; no production edits before user approval.
- **About/portfolio:** unassigned after Descartes completed without implementation.
- **Independent reviewer:** to be assigned after implementation lanes finish; must not author the surfaces being reviewed.
- **Independent Figma reviewer:** Epicurus completed a baseline with `CHANGES REQUIRED`; re-run after the next approved visual implementation.
- **Git steward:** checks in only batches that have independent design and runtime approval.

## Model escalation rule

- Use Luna by default to conserve resources.
- Promote an implementation lane to Terra when its Luna worker stalls, misreads the Figma/content source hierarchy, cannot complete `/next-dev-loop`, or fails the team lead's visual/runtime acceptance review.
- A model upgrade does not relax the lane's write scope or acceptance criteria.

## Review gate

No item is complete merely because it compiles. Completion requires the running app, the installed `/next-dev-loop`, matching-viewport visual comparison, working links and controls, responsive review, and independent QA evidence.
