# Launch Plan — Old MacDonald Had a School

**Project identity (for every future session and agent):** Next.js 16.3 App Router + Tailwind CSS v4 + shadcn/ui (vendored `components/ui/`, semantic-token architecture). `new-york` is shadcn component-style metadata, not the site theme. `omhas` is the canonical brand theme (`data-brand="omhas"`); light/dark are display variants of its token set. Advanced or customized controls compose shadcn primitives + Tailwind v4 tokens, never parallel hand-rolled control systems. Fonts use `next/font` CSS variables. Content uses `@next/mdx` + `remark-mdx-frontmatter`. Dark mode uses `next-themes` class strategy.

Full-site design audit completed across all 9 route families (60 screenshots, 4 states each). Audit score: 16/20 (Good). The song side-tabs finding is resolved; the remaining owner decisions are lessons IA (P2) and radii (P3). The 44px control fixes already applied and verified. MiniLM semantic search remains a separate P1 blocker.

The single documented chain — one place changes the entire site:

1. `app/globals.css` `:root` / `.dark` define semantic tokens (`--background`, `--primary`, …) plus the OMHAS brand tokens (paper, wood, navy, ink, gold, `--characters-*`, `--grade-*`). **Since 2026-08-27 `DESIGN.md` is the design source of truth** (complete character/grade/subject records); `content/pages/branding/characters.mdx` was the historical palette authority and is retired, pending owner deletion; `globals.css` is the token implementation layer.
2. `@theme inline` (globals.css:242) maps every token to Tailwind theme variables (`--color-*`, `--font-*`, `--radius-*`) per Tailwind v4 docs and the shadcn customization doc.
3. Tailwind v4 generates utilities (`bg-background`, `text-muted-foreground`, `font-hand`, `rounded-lg`).
4. Vendored shadcn components consume only utilities derived from tokens; app chrome does too.

Verified consequences: changing a `:root`/`.dark` value re-themes every component that references the token. Compliance line (grep-verified, scoped to `app/` `components/` `lib/` `data/`): numeric palette utilities (`red-500` shape) — zero; raw hex literals — zero outside `globals.css`; manual `dark:` color overrides — zero outside vendored `components/ui/`; white/black utilities — present only at the lines under R2 (vendored) and R3 (app chrome), each with a disposition. `content/` was NOT covered by this sweep — see R4. Typography scale is centralized in `globals.css @layer base` (`:where(h1)`–`:where(h4, h5, h6)`, `p, li`); components do not define their own heading system.
## Done (verified this session 2026-08-27)

- [x] `.mcp.json` root file with `next-devtools` entry — written exactly per bundled `node_modules/next/dist/docs/01-app/02-guides/mcp.md`
- [x] `next-dev-loop` skill installed from `vercel/next.js` (the new official home) — `.agents/skills/next-dev-loop/`
- [x] `.mise.toml`: node 24, pnpm dropped (matches `package.json` engines + packageManager)
- [x] `package.json`: playwright pinned `1.62.1` (was `latest`)
- [x] **Bug fix verified in browser (375 + 1280):** `components/grades/GradeInteractionLane.tsx` — template-literal className (line 219 old) generated no CSS; replaced with the file's own `--teacher-foreground` style pattern. Computed quote color now resolves `rgb(30, 42, 56)` = `--characters-miss-hayley-foreground`.
- [x] **Fix verified in browser:** `app/globals.css` `:where(p, li, span, div)` → `:where(p, li)`. `p` lineHeight 19.5px (relaxed), `span` 24px (unforced).
- [x] `components.json` legacy `baseColor: "slate"` replaced with documented supported compatibility metadata `baseColor: "neutral"`. `style: "new-york"` remains valid component-style metadata; neither field owns runtime OMHAS colors. No `shadcn init`, preset apply, reinstall, or component overwrite was run.

## Required refactor items (white/black utility inventory, verified lines)

### R1 — raw rgba shadows duplicate `--navy-deep`
- [x] `app/page.tsx` raw navy/gold `rgba(...)` shadows replaced with Tailwind shadow/ring utilities. Brand CSS variables used through `@theme inline` mappings instead of arbitrary `var(...)` color utilities. Computed-style and screenshot verification still required at 375×812 and 1280×900.

### R2 — vendored shadcn drift check
`npx shadcn@latest info` + `npx shadcn@latest add <component> --dry-run`/`--diff` across `components/ui/*`. Current upstream-shaped patterns found: `bg-black/50` overlays (`dialog.tsx:42`, `sheet.tsx:39`, `alert-dialog.tsx:39`), `text-white` on destructive (`badge.tsx:16`, `button.tsx:18` — shadcn's upstream choice; local theme already has `--destructive-foreground`), `bg-white` slider thumb (`slider.tsx:56`). Apply upstream where sensible; never `--overwrite` without owner approval.

### R3 — documented intentional exceptions (no code change; comment in source)
- `app/page.tsx:85` `border-white bg-white` — polaroid photo frame, DESIGN.md art direction (literal photo paper).
- `app/page.tsx:137` `bg-black/40 text-white` — video play overlay.
- `app/songs/[id]/page.tsx:32–54` `print:bg-white print:text-black print:shadow-none` (×6) — print contract: PRODUCT.md "teachers print sheets nearly as-is"; physical paper is white. Add one explanatory comment at the first occurrence.

### R4 — content/pages/branding/characters.mdx (HISTORICAL — page retired 2026-08-27)
Superseded: the page's design records now live completely in `DESIGN.md`; its raw-palette inventory is moot because the page is pending owner deletion. Runtime consumers (`CharacterPortrait`, `data/brand/characters-registry.ts`, `image-registry.ts`) remain and read tokens/assets, not the page.

## Frontend standards audit and refactor (active branch)

Documentation contract: [Next.js CSS](https://nextjs.org/docs/app/getting-started/css), [`next/font`](https://nextjs.org/docs/app/api-reference/components/font), [Tailwind theme variables](https://tailwindcss.com/docs/theme), [Tailwind custom styles](https://tailwindcss.com/docs/adding-custom-styles), [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode), [shadcn theming](https://ui.shadcn.com/docs/theming), [shadcn Create](https://ui.shadcn.com/create), [`components.json`](https://ui.shadcn.com/docs/components-json), and [`registry:theme`](https://ui.shadcn.com/docs/registry/registry-item-json).
- Tracking: [Issue #11 — OMHAS frontend standards integration](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/11), [Issue #10 — clean frontend lint](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/10), [Issue #12 — reinstall drifted shadcn controls](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/12), [Issue #13 — homepage Impeccable findings](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/13).
- Impeccable hook readiness verified: shared config enabled; Codex PostToolUse + Stop manifests installed; Copilot postToolUse manifest installed; no ignored rules, files, or values. `DESIGN.md` front-loads locked identity requirements through a Mermaid relationship diagram before theme guidance.

- [x] Name runtime design system: `app/layout.tsx` now declares `data-brand="omhas"` while `next-themes` remains responsible only for light/dark classes.
- [x] Map OMHAS paper, ink, gold, and rose roles through Tailwind v4 `@theme inline`; homepage no longer repeats arbitrary CSS-variable color utilities for these roles.
- [x] Restrict Tailwind v4 source detection to `app/`, `components/`, `content/`, and root `mdx-components.tsx` using documented `source(none)` + `@source`; skills, plans, and audit text no longer generate malformed or unused CSS utilities.
- [x] Put custom material, working-wall, character, and grade recipes inside `@layer components`; utilities can now override component recipes through documented cascade order.
- [x] Replace undefined `material-cork-board` consumers with registered `material-cork` in grade lesson and resource panels.
- [x] Use repeating `card-paper` and `material-cork` textures on homepage artifacts instead of flat paper-color copies and inline background-image composition.
- [x] Repair subject cards: valid `color-mix(...)`, canonical subject owners/colors, canonical face assets through `BRAND_IMAGE_ASSETS`, and token-derived shadows.
- [x] Replace raw YouTube `<img>` with `next/image`; allow only `https://i.ytimg.com/vi/**` through `images.remotePatterns`.
- [x] Remove duplicate root paper texture wrapper; body remains single owner of repeating canvas texture.
- [x] [Issue #12](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/12): closed 2026-08-27 — upstream comparison done, six-file diff applied, z-50 layering adopted where upstream required it.
- [ ] Consolidate legacy `.bg-*` / `.card-*` recipes with `.material-*`; remove only recipes proven to have zero consumers after route verification.
- [ ] Remove duplicated subject/grade color derivation from component data; CSS semantic owner must supply grade and subject colors.
- [ ] Replace JavaScript `matchMedia("(min-width: 64rem)")` ownership with one documented responsive owner or a responsive component API.
- [ ] Audit remaining arbitrary typography/geometry values; promote repeated design decisions to Tailwind theme tokens, retain true one-off composition values.
- [ ] Verify shadcn animation utilities in compiled CSS before adding any dependency; no dependency may be installed from inference alone.
- [ ] Browser-check homepage and representative grade routes in OMHAS light/dark at 375×812 and 1280×900. Under the binding `omhas-harness` contract, this session may capture screenshots and verify DOM/computed values but may not perform model-based pixel judgment.

## Owner decisions carried forward (unresolved)

- [x] `app/page.tsx` YouTube thumbnails now use `next/image`; `next.config.ts` restricts the remote source to `https://i.ytimg.com/vi/**`.
- [ ] **Deploy contract — deferred to Issue #19.** `next.config.ts` `outputFileTracingIncludes` traces `data/omhas.db` only; `data/search-vectors.db` sidecar and `models/` are NOT traced (`models/` gitignored and absent locally). Architecture review complete (see 2026-08-28 section below); owner will implement flat-file export or hosted database as the next plan. Remaining unrefactored: no `output: "export"` in `next.config.ts`, no build-export script, `/songs` and `/lessons` still query SQLite, `lib/curriculum-db.ts`/`lib/curriculum-lesson.ts`/`lib/songbook.ts` still open `better-sqlite3`, `/api/search` and both Markdown API routes remain Node handlers, no generated JSON/search/Markdown artifacts or static-link replacement exists.
- [ ] `npx shadcn@latest mcp init` — interactive client picker (Claude Code/Cursor/VS Code/Codex/OpenCode). Owner runs; assistant cannot answer the prompt.
- [ ] The earlier delegated `modelRoles.vision` check used `alibaba-token-plan/qwen3.8-flash` and rejected image input; the role was later changed to `alibaba-token-plan/qwen3.8-max` (line 103). Independently, the binding `omhas-harness` contract disables `inspect_image` and limits this session to screenshot metadata plus browser DOM checks, so changing the model alone does not authorize model-based pixel review.
- [x] Database/embedding migration — **deferred to [Issue #19](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/19).** Architecture review complete; flat-file release recommended as lowest-cost option; owner implements hosting/database as next plan.
- [x] **Song side-tabs (audit P3, `app/songs/[id]/page.tsx:47,49`) — resolved.** Action and song-level cards use the existing `card-paper` semantic surface; the former `border-l-4 border-l-primary` treatment is gone.
- [ ] **Lessons IA (audit P2, `app/lessons/page.tsx:98-140`) — owner decision pending.** First viewport presents competing search and activity-browse paths. Owner must choose: (a) visually subordinate activity routes until after grade/query action, or (b) make relationship to search explicit. No restructuring without approval.
- [ ] **Radii (audit P3, `app/globals.css:644,656,678,730,861`) — owner decision pending.** Off-scale border-radius values (`1rem`, `.9rem`, `.1rem`, `.15rem`, `.75rem`). Owner must approve changing to DESIGN.md rounded-scale values.
- [x] **44px control heights — verified.** `min-h-11` applied at `SearchWorkspace.tsx:101,114-116`, `lessons/page.tsx:109,119,123`, `songs/[id]/page.tsx:33` (44px fallback). No further action.
- [ ] **MiniLM semantic search (P1 blocker) — owner decision pending.** `all-MiniLM-L6-v2` missing locally; search degrades to string match. Owner must choose: (a) place files at `models/all-MiniLM-L6-v2/`, (b) allow remote download, or (c) remove semantic-search dependency.
- [x] **Tailwind v4 docs sync (prerequisite) — verified.** Python sync completed with `--accept-docs-license`; `.agents/skills/tailwind-4-docs/references/docs/` contains generated Tailwind v4 reference pages. Tailwind-dependent implementation is no longer blocked by missing docs.

## Verification gates (all must pass before any "done" claim)

- [x] `npm run typecheck` passes.
- [x] `npm run lint` exits 0 with zero warnings after [Issue #10](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/10): vendored `.github/skills/**` excluded from application lint and three application warnings fixed at source.
- [x] `npm run build` passes: Next.js 16.3.0 production build compiled and generated 490 static pages.
- [x] next-devtools MCP `get_errors` and `get_compilation_issues` return empty arrays after refactor.
- [x] Browser computed-style proof at 375×812 and 1280×900: `data-brand="omhas"`, one `main`, zero horizontal overflow, body cardboard texture, homepage paper/cork textures, grade felt/denim textures, and light/dark token changes all resolve. Screenshots saved under `tmp/visual-audit/` for owner review.
- [x] Impeccable live-panel rendering and DOM/metadata verification completed 2026-08-28 for Primary Button, Paper Card, all five grade chips, Search Input, three character artwork roles, subject signals, six material swatches, attached pin/tape, emblem, and classroom hero. Search Input sidecar CSS was changed from the dark card surface to warm textured paper.
- [ ] Pixel-level visual review of the Impeccable component set remains pending under the binding `omhas-harness` operating contract.
- [x] axe-core reports zero WCAG A/AA violations on homepage and Grade 1 route; textured backgrounds leave contrast checks incomplete for manual review.
- [ ] Final diff review, commit, push, and clean working tree.
- [x] [Issue #19](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/19) database/hosting architecture review complete; implementation deferred to owner.

## Rules for future sessions

1. Do site work or harness work — never both in one uncommitted tree.
2. Commit (or revert) experimental code changes before ending a task; never leave silent behavior changes behind.
3. New `.omp/` agent files must be validated (frontmatter parses, role resolves) before other agents are told to depend on them.
4. Keep this file current; it is the anti-drift contract.
5. Settings installs and changes (model roles, skills installs, MCP client choices) are owner actions; the assistant proposes them in chat, never applies silently.
6. Docs are the contract: bundled `node_modules/next/dist/docs/`, `https://ui.shadcn.com/docs` (fetch with `.md` suffix), `https://tailwindcss.com/docs`, `.agents/skills/shadcn/`. Anything contradicting them is a defect to report, not a style choice.

## 2026-08-27 evening — Impeccable setup + design authority cutover (verified)

- `context.mjs` run (platform web); hooks enabled with zero ignores; `doctor.mjs` zero findings before and after; `.impeccable/design.json` generated (schemaVersion 2: 23 colorMeta, 3 shadows, 2 motion, 5 ds- component snippets, narrative).
- DESIGN.md rewritten as the design source of truth: YAML frontmatter + eight canonical sections; complete 16-character records (academic lead, grade/scope, species, role, curriculum contributions/learning actions, personality, exact color + foreground, bound icon), 64 artwork paths, grade ownership + grade icons, subject ownership + icons (two documented music strands: Mr Rusty rhythm vs Old MacDonald whole-school singing), fastener assets, Mermaid identity diagram, provenance (2026-08-25 PDF + 2026-08-27 Register 02 revision).
- Revised identity colors applied atomically: Old MacDonald `#A66A32`, Mr Rusty `#267CBA`, Mr Sam `#1D8787`, Mr Maisy `#D81D24`, Miss Maisy `#5D8164`, Scout `#C59E7A`, Maisy `#96AD9A`; grades/subjects inherit owners; `--grade-early-years-color` aliases preschool; Scout/Maisy/Penny foregrounds dark ink. Stale hex grep across app/components/lib/data: zero.
- `content/pages/branding/characters.mdx` retired (header + historical banner); no route renders it; runtime consumers (`CharacterPortrait`, `data/brand/characters-registry.ts`, `image-registry.ts`) read tokens/assets, not the page. Owner deletion pending.
- `docs/design-explorations/character-colour-register/` deleted by owner after transcription into DESIGN.md provenance.
- Gates: `npm run typecheck` clean; `npm run lint` clean (combobox unused `children` removed); `npm run build` 490 pages; browser evidence at 1280×900 light+dark and 375×812 light+dark: one `main`, revised grade colors live, fasteners cross the polaroid border, no overflow.
- `modelRoles.vision` set to `alibaba-token-plan/qwen3.8-max` (flash role lacked image input).
- Issues closed this pass: #12 (shadcn controls), #13 (homepage critique), #17 (color reconciliation), #18 (consolidated into #17). #15 remains open for the separate design-advisor harness configuration.
- `npx impeccable detect app/page.tsx components/home/SubjectTeachers.tsx components/home/HomeGradeNav.tsx`: 16 `design-system-font-size` findings → resolved by documenting the observed type ramp in DESIGN.md frontmatter (12 roles); final run exit 0. 10px avatar fallback raised to 11px (a11y floor). Sidecar refreshed via the document workflow; `doctor.mjs` final: zero findings.
- Stale-hex sweep scope (2026-08-27): active source paths (`app/`, `components/`, `lib/`, `data/`, `content/`, `DESIGN.md`, `PRODUCT.md`) = zero retired literals. Repo-wide, retired literals remain ONLY in intentionally untouched historical/generated artifacts: `archive/color-concept-prompts.md` (pre-revision design exploration, kept as history) and `dogfood-output/bundle.html` (generated bundle; regenerate or delete when that tooling runs next). `scripts/resources/song_import_evidence_run*.jsonl` hits are false positives (`2a9a9a` inside SHA-256 checksums). `docs/` verified clean.
- Issue #12 upstream comparison: shadcn dry runs for alert-dialog, badge, button, dialog, sheet, slider, native-select, combobox, input, textarea, and input-group. z-50 layering was adopted where upstream required it. OMHAS semantic destructive foregrounds, local button variants, and slider bg-background were intentionally preserved over upstream text-white/bg-white because DESIGN.md owns the theme and local variants are used by the app. Six-file diff is whitespace-clean.
- Live review setup: live.mjs resolved the Next.js App Router, live helper is on port 8400, configDrift is null, and live-poll is active with one connected browser client. The injected localhost script is deliberately not committed; live config remains local for this review session to keep production free of a localhost dependency.
- Issue #12 commit: 05df9f9 pushed after official shadcn dry-run review; GitHub issue #12 is closed with the per-component decisions and green gates recorded in its comment.
- Live config is intentionally local while under review: .impeccable/live/config.json targets app/layout.tsx; the localhost script is injected only for the active review session and must be removed with live-server.mjs stop before production commits.

## 2026-08-27 night — dependency hygiene, content retirement, doc-aligned dark mode (verified)

- Direct `lightningcss` removed from `package.json` (Tailwind v4 owns it transitively: `npm ls` shows `@tailwindcss/postcss → @tailwindcss/node → lightningcss@1.31.1`; Next bundles Turbopack itself — neither is ever a direct install). Committed by owner in 7fde4e3 with the content retirement.
- Owner retired brand-page/staff content in 7fde4e3: `content/pages/branding/characters.mdx` + 8 `content/staff/*.md` deleted (zero code references, grep-verified). DESIGN.md is now the sole character authority. AGENTS.md working rules + shadcn-ui skill added in the same commit.
- Dark mode aligned verbatim to documentation (commit 885bd3a, pushed): `ThemeProvider defaultTheme="system" enableSystem` per ui.shadcn.com/docs/dark-mode/next (was undocumented `defaultTheme="light" enableSystem={false}`); `@custom-variant dark (&:where(.dark, .dark *))` per tailwindcss.com/docs/dark-mode (was `:is(.dark *)` hand-roll). `enableColorScheme`/`disableTransitionOnChange` retained per same docs.
- Verified via next-devtools MCP + agent-browser (next-dev-loop skill preflight passed: Next 16.3 Turbopack, `get_compilation_issues` [], `get_errors` []): fresh browser with no stored theme follows OS dark (`stored:null → htmlDark:true`); real header toggle round-trips light/dark with tokens flipping (`--background` #1a1f24 dark) and identity colors constant (`#a66a32`/`#267cba`); one `main`, zero overflow at 1280×900 and 375×812.
- Impeccable live-review localhost script stripped from `app/layout.tsx` (it had been committed in owner's 7fde4e3; removed in 885bd3a); live helper on :8400 stopped via `live-server.mjs stop`. Gates on final tree: typecheck ✓, lint ✓, build ✓ 490 pages. Working tree clean, branch pushed.
- Harness side (separate plan `local://omp-harness-team-plan.md`): db `bash.patterns` deny list live and proof-denied (`*db:push*` blocked); `next-dev-loop` + `web-design-guidelines` skills installed to `.agents/skills/` (resolve after session restart — omp discovers skills at startup); `ohm-doc` agent disabled in settings pending owner `/agents` enable; `omhas-db` skill written.

## 2026-08-28 — homepage critique batch (dual-agent, fixes verified)

- `$impeccable critique` run as two isolated sub-agents (A: design review with vision; B: `detect.mjs` + live overlay on `/`, `/grade/grade-one`, `/songs`), synthesized + parent-verified. Snapshot: `.impeccable/critique/2026-08-28T02-45-53Z__app-page-tsx.md` (28/36, P0×1, P1×2).
- Owner decisions (ask): dark mode = **true low-light environment**; scope = all issues; first priority = nav dedupe.
- **P0 fixed without breaking the material contract** (DESIGN.md "paper remains paper"): hero h1 and every theme-flipping `--ink-*`/`--muted-foreground` consumer inside pinned paper surfaces switched to stable `brand-paper-*`/`--theme-ink` tokens; environment text uses `text-foreground`. Contrast sweep (solid surfaces, AA thresholds): **0 failures at 375 and 1280 in light and dark**. `HomeSubjectNote` (only consumed by dead `HomepageBrandPatterns`) pinned to `--theme-ink`/`--brand-paper-muted` in 604c67b.
- **P2**: header now Home/Search/About only (3 links measured); grade rail + grade-page rail own grade entry; dead `GRADE_TAB_COLORS`/`GRADE_NAV_ITEMS` deleted.
- **P1**: compact quick-search form under the grade rail on mobile (`lg:hidden`), short placeholder.
- **P3**: "Preschool" display labels (keys unchanged); kickers above headings removed (craft-floor ban); `/songs` h1 leading 0.95→1.05; New-this-week rows labeled static K–2 (no dead-end affordance; titles verified absent from DB/content so not linked).
- Commits: `eabf5f1` (batch), `604c67b` (subject-note), pushed; gates typecheck/lint/build exit 0.
- **Owner-decision open**: DESIGN.md binds navy foreground `#1E2A38` to mid hues (e.g. Miss Hayley `#D95C86`) ≈ 2.3–3.8:1 at body size on grade rails — fails WCAG AA; locked identity colors mean the fix (cream ink on darkened surfaces, header precedent) needs a DESIGN.md amendment the owner approves.
- **Not mine, left uncommitted**: 23 `public/characters/*` deletions appeared in the working tree during the wait (owner-side, matches the 7fde4e3 pattern). Un-restored, un-committed; owner commits or delegates.

## 2026-08-28 — database/hosting architecture review (Issue #19, deferred)

- [Issue #19](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/19) created as the single parking lot for the database/hosting/API decision. The issue explicitly defers migration and remediation until the owner re-opens it.
- Architecture review completed: verified `better-sqlite3` consumers (`lib/curriculum-db.ts`, `lib/curriculum-lesson.ts`, `lib/songbook.ts`, `app/api/search/route.ts`), `data/omhas.db` tracing in `next.config.ts`, missing `models/` directory, vector sidecar, and both Markdown export routes (`app/api/lessons/[grade]/[id]/markdown/route.ts`, `app/api/songs/[id]/markdown/route.ts`).
- Recommended release architecture: static flat-file export from SQLite (pre-generate lesson/topic/song pages, search index, and Markdown files), deployed to Vercel or Cloudflare Pages.
- Hosting options documented: Vercel static, Cloudflare Pages static, Vercel + Turso/libSQL (best live SQLite-compatible option, smallest migration), Vercel + Neon Postgres (largest migration but best conventional API path).
- Nothing has been refactored yet. Implementation deferred to owner as the next plan.
- Markdown download routes (`components/grades/DatabaseLessonDocument.tsx:77–78` → `/api/lessons/.../markdown`, `/api/songs/.../markdown`) cannot remain as Node handlers on pure static hosting; pre-generate `.md` files as the replacement.
## 2026-08-28 — home reference implementation (plan of record, owner-approved)

Durable copy of approved plan `local://home-reference-implementation-plan.md`. Goal: recompose `/` to the supplied reference direction (navy/blue-leather structural chrome, warm paper artifacts, working-wall grammar) with zero route or behavior change. Context: prior critique snapshot `.impeccable/critique/2026-08-28T02-45-53Z__app-page-tsx.md` (28/36) already fixed in `eabf5f1`/`604c67b`; this is the reference-composition pass.

### Frozen contract

- Preserve `app/page.tsx` metadata, `components/site-navigation.ts` `NAV_ITEMS`/`TEACHER_GRADE_ITEMS`/`activePageFromPathname`, every current home link (five `/grade/*`, six subject search queries, `/songs`, two YouTube externals, `/search`, popular queries, `/grade/daycare` tip link), `MobileQuickSearch` form, and `SiteFooter` destinations. No new pages, controls, sign-in, filters, or content claims. Home order stays: hero, grade nav, mobile quick search, character wall, subject teachers, what's new, curriculum planner.
- External asset dir `C:\Users\jesse\OneDrive\Documents\Endless Measures\AI Generated Images\generated_images` inventoried read-only: UUID folders + `exec-*.png` carry no approved semantic role in DESIGN.md or `data/brand/image-registry.ts`, so all stay unused. Hero remains `HERO_PHOTO = BRAND_IMAGE_ASSETS.scenes["old-macs-open-circle-gathering"]` → `/hero/old-macs-open-circle-gathering.webp`. No copied files, direct external paths, or new registry keys.
- `app/layout.tsx` keeps zero `localhost:8400/live.js` injection through commit.

### Steps

1. `DESIGN.md`: insert `### Homepage presentation` after `### Composition grammar`. Binding rules: structural chrome + hero support use navy with existing `material-leather-blue` recipe; readable content on warm paper; wood joinery; gold focus/highlight; rose/sage/teal/blue/red/amber/purple stay semantic grade/subject/character accents; 16 character tokens verbatim; responsive intent (wide split hero, tablet reduced split, mobile stacked + compact menu); subject board = one support + attached paper; song/recent = one calm ruled-paper area; no nested card maze, no duplicated CTA to one destination.
2. `HeroBanner` (`app/page.tsx:61`): support `material-leather` → `material-leather-blue`; keep title, `NEW_LESSONS`, `RIBBON_WORDS`, taped paper, `/songs` link, `HERO_PHOTO` alt/caption/1536×1024, polaroid `border-white bg-white` (R3 exception). Wide 3-track grid retained; tablet tightened; mobile stacked, zero overflow.
3. `SubjectTeachers` (`components/home/SubjectTeachers.tsx`): all six entries verbatim; cork `material-cork` single support, one attached paper artifact per subject.
4. `CharacterPerspectiveWall` (`app/page.tsx:34`): keep `CHARACTER_KEYS` order staff-then-learner, all 16 visible at every breakpoint; paper/working-board support; keep `data-character` + `characters-surface` + `fastener-push-pin` + `character-face-patch`; stop truncating identity names.
5. `WhatsNew` + `CurriculumPlanner` (`app/page.tsx:150`): one ruled-paper support each (`material-paper-ruled`/`working-wall-note`); preserve every link, external target, aria-label.
6. Navigation untouched unless verification exposes a homepage-specific a11y defect.
7. CSS additions only in `app/globals.css` where utilities cannot express shared material behavior; no new tokens/deps.

### Verification

1. `npm run typecheck`, `npm run lint`, `npm run build` (490 pages baseline) exit 0.
2. Dev on :3100; `/` DOM: title, zero `live.js`, zero `impeccable-live-*`, 16 character keys in registry order, all current links unchanged.
3. Screenshots 1440/768/390 stored for owner review — never labeled model-visually verified under the binding `omhas-harness` contract (line 81).
4. Computed styles: hero `material-leather-blue`, exact `--characters-*-color` bridges ×16, AA contrast on changed surfaces light+dark.
5. Navigate `/search`, `/about`, `/songs`, `/topics`, `/lessons`, all five `/grade/*`; routes unchanged; mobile Sheet + `aria-current` intact.
6. `npx impeccable detect app/page.tsx components/home/SubjectTeachers.tsx components/home/HomeGradeNav.tsx` exit 0; fresh critique snapshot after changes.

### Execution evidence (2026-08-28, verified)

- Gates: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓ (all pages generated). Confirm round: `detect.mjs --json` exit 0, `tsc --noEmit` exit 0, `eslint` exit 0.
- DESIGN.md: `### Homepage presentation` inserted after `### Composition grammar` (line 434).
- app/page.tsx: hero support `material-leather-blue` (computed rgb(30,42,56) + leather-blue texture), h1 cream `brand-navy-foreground` (~14:1 on navy), tablet gap tightened (`gap-6 lg:gap-8`); character wall support `working-wall-stage` (paper, wood border), kicker above the wall heading deleted (craft-floor ban), name `truncate` removed; WhatsNew videos grouped in one `card-paper-ruled` support (articles demoted to bare artifacts, no nested cards); CurriculumPlanner support `card-paper-ruled`.
- **Defect found & fixed**: home character cards never applied the `characters-${key}` bridge class (grade pages did) — all 16 surfaces were transparent. Added the class; computed verification: all 16 resolve exact DESIGN.md tokens (Old MacDonald #A66A32, Mr Rusty #267CBA, Mr Sam #1D8787, Mr Maisy #D81D24, Miss Maisy #5D8164, Scout #C59E7A, Penny #F9CB7A, Maisy #96AD9A, …) with correct foreground pairing (dark ink on Miss Puddles/Miss Hayley/Scout/Penny/Maisy; cream on the rest).
- Browser DOM (1440/768/390): one `main`, zero duplicate ids, zero `localhost:8400/live.js`, zero `impeccable-live-*`, 16 `data-character` keys in registry order, 5 grade tiles + daycare tip link, `/songs`, `/search`, 3 YouTube links, mobile quick-search present, zero horizontal overflow at all three widths. Duplicate `h2#character-perspective-title` introduced mid-edit was caught by advisor and removed before gates.
- Screenshots captured 1440/768/390 (full-page, owner temp dir) — stored for owner review, NOT visually verified (vision-role block, line 80).
- Impeccable suite ledger: `$impeccable critique` ran **DEGRADED** (two isolated subagents exceeded the time-box after a finalize directive; cancelled; parent assessments inline, anchored-run caveat recorded in the snapshot). Snapshot: `.impeccable/critique/2026-08-28T23-25-44Z__app-page-tsx.md` — 23/28 (n/a: 7,9,10), P0×0 P1×0 P2×2 P3×2. Trend: 28/36 → 28/36 → 23/28 (mixed denominators, not like-for-like). `$impeccable layout` finding (video affordance) + `$impeccable typeset` finding (monotone header rhythm) fixed in one batch: thumbnail group-hover ring/lift restored on video artifacts; redundant "pick a subject to start" aside removed. Confirm round: detector 0, tsc 0, eslint 0, DOM verified. `$impeccable colorize` skipped — page already carries the full semantic palette; no monochrome surface. `$impeccable animate` skipped — DESIGN.md motion contract is restrained functional motion; hover transitions exist, no findings. `$impeccable live` requires the owner's eyes for variant selection (vision-role block) — available on request; the "off but unnameable" item (transparent character ghosts) was found and fixed via computed evidence instead.
- Not mine, untouched: `WATCHDOG.yml` advisor reconfiguration (owner-side), `next-env.d.ts` build churn, `output/menu-regression-*.png` + `output/daycare-current.png`.

## 2026-08-28 — navigation and search owner decisions

- About and Contact are one destination and use the same route/link.
- Teacher toolbox routes to the subject/topic discovery surface: `/subjects` and `/topics` are equivalent product concepts; do not create two competing destinations.
- Search is semantic/fuzzy discovery, not exact-string-only lookup.
