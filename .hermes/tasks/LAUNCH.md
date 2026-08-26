# Old MacDonald — Launch Checklist (living tracker)

> **Canonical project:** `C:\old-macdonald-had-a-school` (branch `main`).
> This is the copy the dev server `:3000` and browser use. ALL fixes apply here, NOT in the stale `.codex/worktrees/845c/...` copy — that one is 14 commits behind and is read-only reference only now.
>
> Rules that govern every fix (from `.agents/skills/shadcn/*` + official shadcn/Next.js docs):
> - `className` for layout only; semantic tokens / variants / CSS variables for appearance.
> - No `space-y-*`/`space-x-*` → use `flex gap-*`. Use `size-*` when w==h. Use `truncate`.
> - No `clamp()` for padding/gap — fixed scale values only (`p-4`, `gap-3`).
> - No custom breakpoints / arbitrary `max-[NNNpx]` / `max-w-[NNNpx]` — use Tailwind default sm/md/lg/xl + `max-w-*` tokens.
> - Grids must not skip breakpoints (md→xl directly is wrong; include lg when applicable).
> - shadcn components are proper (Radix + cva + data-slot) — compose/extend, don't reinvent or reinstall.
> - Card spacing is `--card-spacing` CSS variable (`--spacing(6)` default, `--spacing(4)` sm, `--spacing(0)` flush). No `py-0`/`p-0`/`gap-0` overrides.
>
> Status legend: `[ ]` todo · `[/]` in progress · `[x]` done (verified on main) · `[~]` blocked/awaiting user

---

## Phase 1 — Layout & shadcn divergence in `main`

- [x] **Card `--card-spacing` refactor** — `components/ui/card.tsx` still has hardcoded `gap-6`/`py-6`/`px-6`, no `size` prop. Migrate to `--card-spacing` variable + `size="sm"` per official docs.
- [ ] **Nav ribbon at `md`, not `lg`** — `components/SiteHeader.tsx:39,111,114` uses `lg:flex`/`lg:hidden`. Change to `md:` so the ribbon shows from 768px (no hamburger at non-mobile widths).
- [x] **Header logo `flex-1` vs `flex-none`** — logo currently `flex-1` fights the nav for space; make nav fill.
- [ ] **`app/lessons/page.tsx`** — remove `p-[clamp(…)]`, `max-[360px]`, `max-w-[850px]`; card `p-0`/`gap-0` → `[--card-spacing:--spacing(0)]`; heading `text-[clamp(…)]` → `sm:text-5xl lg:text-6xl`.
- [ ] **`app/topics/TopicsClient.tsx`** — remove `py-[clamp(…)]`, `p-[clamp(…)]`, `max-w-[840px]`; card `gap-0 p-0` → `size="sm"`.
- [ ] **`app/songs/page.tsx`** — filter grid `md→xl` and results `md→xl` skip `lg`; add `lg:grid-cols-4` / `lg:grid-cols-3`.
- [ ] **`app/page.tsx`** — subject grid `xl:grid-cols-6` crams cards → cap at `lg:grid-cols-3`; card `py-0 p-0` → `--card-spacing`.
- [ ] **Components grid skips** — `FolkArtsSection`, `HomepageBrandPatterns`, `FabricReference` (`md→xl` without `lg`).
- [ ] **`text-[clamp(2.5rem,6vw,…)]` headings** — lessons/topics/BrandSystemExamples/FabricReference → responsive utilities.

## Phase 3 — Launch gate

- [x] `npm run typecheck` passes on `main`.
- [ ] `npm run build` + `npm start`; verify header is a ribbon (no hamburger) at ≥ md.
- [ ] Spot-check each page at sm/md/lg/xl (home, lessons, topics, songs, search, about, grades).
- [ ] Set up reusable **delegation persona** (existing persona, fed this system context) + free/slow **ollama** model for lint/fix chores.