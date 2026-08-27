# Launch Plan — Old MacDonald Had a School

**Project identity (for every future session and agent):** Next.js 16.3 App Router + Tailwind CSS v4 + shadcn/ui (vendored `components/ui/`, semantic-token architecture). `new-york` is shadcn component-style metadata, not the site theme. `omhas` is the canonical brand theme (`data-brand="omhas"`); light/dark are display variants of its token set. Advanced or customized controls compose shadcn primitives + Tailwind v4 tokens, never parallel hand-rolled control systems. Fonts use `next/font` CSS variables. Content uses `@next/mdx` + `remark-mdx-frontmatter`. Dark mode uses `next-themes` class strategy.

## How the theme actually works (verified 2026-08-27)

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
- [ ] [Issue #12](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/12): compare `native-select` and `combobox` with current shadcn registry source, then reinstall each named component when source differs instead of hand-refactoring vendored primitives. Migrate callers to installed APIs. Keep accessible structure/behavior in shadcn source, OMHAS design in semantic CSS, and page layout in Tailwind composition classes.
- [ ] Consolidate legacy `.bg-*` / `.card-*` recipes with `.material-*`; remove only recipes proven to have zero consumers after route verification.
- [ ] Remove duplicated subject/grade color derivation from component data; CSS semantic owner must supply grade and subject colors.
- [ ] Replace JavaScript `matchMedia("(min-width: 64rem)")` ownership with one documented responsive owner or a responsive component API.
- [ ] Audit remaining arbitrary typography/geometry values; promote repeated design decisions to Tailwind theme tokens, retain true one-off composition values.
- [ ] Verify shadcn animation utilities in compiled CSS before adding any dependency; no dependency may be installed from inference alone.
- [ ] Browser-check homepage and representative grade routes in OMHAS light/dark at 375×812 and 1280×900. Pixel judgment remains blocked until a vision-capable role is configured; computed values and screenshots are still required.

## Owner decisions carried forward (unresolved)

- [x] `app/page.tsx` YouTube thumbnails now use `next/image`; `next.config.ts` restricts the remote source to `https://i.ytimg.com/vi/**`.
- [ ] Deploy contract: `next.config.ts` `outputFileTracingIncludes` traces `data/omhas.db` only; `data/search-vectors.db` sidecar and `models/` are NOT traced (`models/` gitignored and absent locally). Decide (A) vendor weights + sidecar into deploy (check Vercel size limits for ~55MB) or (B) keyword-only fallback on serverless (`app/api/search/route.ts` already degrades cleanly) and make README say so. README ↔ `next.config.ts` ↔ `.vercelignore` must tell one story.
- [ ] `npx shadcn@latest mcp init` — interactive client picker (Claude Code/Cursor/VS Code/Codex/OpenCode). Owner runs; assistant cannot answer the prompt.
- [ ] `modelRoles.vision` = `alibaba-token-plan/qwen3.8-flash` rejects image input (verified error this session). Pixel-level screenshot review impossible until owner sets a vision-capable model. Standing rule: assistant requests, owner changes settings.
- [ ] Database/embedding migration — owner handling separately; excluded here.
- [ ] Security flag: `src/db/migrate-to-sqlite.ts:7` contains a live Neon connection string, present in 2 commits of git history on `main`. Rotate credential at Neon; history scrub is a separate destructive call.

## Verification gates (all must pass before any "done" claim)

- [x] `npm run typecheck` passes.
- [x] `npm run lint` exits 0 with zero warnings after [Issue #10](https://github.com/jessenaiman/old-macdonald-had-a-school/issues/10): vendored `.github/skills/**` excluded from application lint and three application warnings fixed at source.
- [x] `npm run build` passes: Next.js 16.3.0 production build compiled and generated 490 static pages.
- [x] next-devtools MCP `get_errors` and `get_compilation_issues` return empty arrays after refactor.
- [x] Browser computed-style proof at 375×812 and 1280×900: `data-brand="omhas"`, one `main`, zero horizontal overflow, body cardboard texture, homepage paper/cork textures, grade felt/denim textures, and light/dark token changes all resolve. Screenshots saved under `tmp/visual-audit/` for owner review.
- [ ] Pixel-level screenshot review remains blocked because configured vision model rejects image input. Do not label screenshots visually verified.
- [x] axe-core reports zero WCAG A/AA violations on homepage and Grade 1 route; textured backgrounds leave contrast checks incomplete for manual review.
- [ ] Final diff review, commit, push, and clean working tree.

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
- Issues closed this pass: #13 (homepage critique implemented), #17 (color reconciliation), #18 (consolidated into #17). #12 remains open: vendored control drift needs upstream `shadcn add --diff` review.
- `npx impeccable detect app/page.tsx components/home/SubjectTeachers.tsx components/home/HomeGradeNav.tsx`: 16 `design-system-font-size` findings → resolved by documenting the observed type ramp in DESIGN.md frontmatter (12 roles); final run exit 0. 10px avatar fallback raised to 11px (a11y floor). Sidecar refreshed via the document workflow; `doctor.mjs` final: zero findings.
