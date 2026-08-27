# Launch Plan — Old MacDonald Had a School

**Project identity (for every future session and agent):** Next.js 16.3 App Router + Tailwind CSS v4 + shadcn/ui (`style: new-york`, vendored `components/ui/`, semantic-token architecture). Advanced or customized components are built on shadcn primitives + Tailwind v4 tokens, never on hand-rolled CSS systems. Fonts via `next/font` with CSS variables. Content via `@next/mdx` + `remark-mdx-frontmatter`. Dark mode via `next-themes` (class strategy).

## How the theme actually works (verified 2026-08-27)

The single documented chain — one place changes the entire site:

1. `app/globals.css` `:root` / `.dark` define semantic tokens (`--background`, `--primary`, …) plus the OMHAS brand tokens (paper, wood, navy, ink, gold, `--characters-*`, `--grade-*`). `content/pages/branding/characters.mdx` is the owner's documented palette authority; `globals.css` is the token implementation layer.
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
- [x] REFUTED (keep on record): "`slate` is no longer a supported `baseColor`" — `components.json` docs state `tailwind.baseColor` "cannot be changed after initialization" and only fed token generation at init. `baseColor: "slate"` is inert metadata. Do not edit it; a full `shadcn init` re-run is the only way to change it (owner decision, not planned).

## Required refactor items (white/black utility inventory, verified lines)

### R1 — raw rgba shadows duplicate `--navy-deep`
`app/page.tsx` — `rgba(30,42,56,…)` (= `--navy-deep`) raw shadows at lines 38, 71, 72, 77, 83, 84, 85, plus line 174 `rgba(212,168,42,…)` duplicating `--gold-*`. Replace with token-derived shadow (`color-mix` from `var(--navy-deep)` / `var(--gold-bright)`, or `--shadow-*` tokens). Verify visually at 375/1280.

### R2 — vendored shadcn drift check
`npx shadcn@latest info` + `npx shadcn@latest add <component> --dry-run`/`--diff` across `components/ui/*`. Current upstream-shaped patterns found: `bg-black/50` overlays (`dialog.tsx:42`, `sheet.tsx:39`, `alert-dialog.tsx:39`), `text-white` on destructive (`badge.tsx:16`, `button.tsx:18` — shadcn's upstream choice; local theme already has `--destructive-foreground`), `bg-white` slider thumb (`slider.tsx:56`). Apply upstream where sensible; never `--overwrite` without owner approval.

### R3 — documented intentional exceptions (no code change; comment in source)
- `app/page.tsx:85` `border-white bg-white` — polaroid photo frame, DESIGN.md art direction (literal photo paper).
- `app/page.tsx:137` `bg-black/40 text-white` — video play overlay.
- `app/songs/[id]/page.tsx:32–54` `print:bg-white print:text-black print:shadow-none` (×6) — print contract: PRODUCT.md "teachers print sheets nearly as-is"; physical paper is white. Add one explanatory comment at the first occurrence.

### R4 — content/pages/branding/characters.mdx raw-palette inventory (owner call: refactor vs documented exception)
`content/` is outside the compliance sweep scope. This page — the brand source-of-truth, so an owner who greps it lands here first — carries numeric palette utilities and inline hex: `border-amber-200/80`, `shadow-amber-900/8` (line 20), `bg-white/65` (lines 20, 43, 101), `text-stone-700` (24), `text-stone-600` (27), `border-stone-200` (29–32), `bg-[#B87A4A]/20` etc. (29–32), and `style={{"--characters-card-color":"#…"}}` on every character Card. `dark:` is zero here (verified). Owner decides: refactor these to tokens, or accept as a documented brand-page exception and note it.

## Owner decisions carried forward (unresolved)

- [ ] `app/page.tsx:135` raw `<img>` for YouTube thumbnails (eslint-disabled). Either `next/image` + `images.remotePatterns` for `i.ytimg.com`, or a documented deliberate-exception comment. Owner picks.
- [ ] Deploy contract: `next.config.ts` `outputFileTracingIncludes` traces `data/omhas.db` only; `data/search-vectors.db` sidecar and `models/` are NOT traced (`models/` gitignored and absent locally). Decide (A) vendor weights + sidecar into deploy (check Vercel size limits for ~55MB) or (B) keyword-only fallback on serverless (`app/api/search/route.ts` already degrades cleanly) and make README say so. README ↔ `next.config.ts` ↔ `.vercelignore` must tell one story.
- [ ] `npx shadcn@latest mcp init` — interactive client picker (Claude Code/Cursor/VS Code/Codex/OpenCode). Owner runs; assistant cannot answer the prompt.
- [ ] `modelRoles.vision` = `alibaba-token-plan/qwen3.8-flash` rejects image input (verified error this session). Pixel-level screenshot review impossible until owner sets a vision-capable model. Standing rule: assistant requests, owner changes settings.
- [ ] Database/embedding migration — owner handling separately; excluded here.
- [ ] Security flag: `src/db/migrate-to-sqlite.ts:7` contains a live Neon connection string, present in 2 commits of git history on `main`. Rotate credential at Neon; history scrub is a separate destructive call.

## Verification gates (all must pass before any "done" claim)

1. `npm run typecheck` && `npm run lint` && `npm run build` clean.
2. next-devtools MCP `get_errors` / `get_compilation_issues` empty; `compile_route` green for touched routes (zero-arg MCP calls; the parameterized bridge path is known-broken — use no `args`).
3. Browser proof per `next-dev-loop` skill: 375×812 and 1280×900 — computed styles AND screenshots. Screenshots go to `tmp/visual-audit/` for owner eyeball; vision-model review only when owner enables a vision-capable role. Computed-style evidence is automated evidence, never labeled "visually verified".
4. Diff reviewed and committed before file removal; `git status` clean or intentional.

## Rules for future sessions

1. Do site work or harness work — never both in one uncommitted tree.
2. Commit (or revert) experimental code changes before ending a task; never leave silent behavior changes behind.
3. New `.omp/` agent files must be validated (frontmatter parses, role resolves) before other agents are told to depend on them.
4. Keep this file current; it is the anti-drift contract.
5. Settings installs and changes (model roles, skills installs, MCP client choices) are owner actions; the assistant proposes them in chat, never applies silently.
6. Docs are the contract: bundled `node_modules/next/dist/docs/`, `https://ui.shadcn.com/docs` (fetch with `.md` suffix), `https://tailwindcss.com/docs`, `.agents/skills/shadcn/`. Anything contradicting them is a defect to report, not a style choice.
