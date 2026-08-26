# Teacher Home Page (designed hero) — Canonical Repo Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build the canonical home page (`/`) in `C:\old-macdonald-had-a-school` by porting the verified designed-her hero from the preview artifact (`homepage-artifact` teacher-bundle.html) into the real Next.js 16 app, composed with the existing home components and theme tokens.

**Architecture:** A new Server Component `app/page.tsx` that renders `<HeroBanner />` (new, ports the designed 3-column hero) above the existing building blocks — `HomeGradeNav`, the subject-board (`HomeSubjectNote` over `HOME_SUBJECTS`), `CreativeArtsSection`, and `SubjectDiscovery`. Everything uses shadcn components + theme tokens per the shadcn-ui skill rules (no raw hex in components, semantic color tokens, no custom breakpoints). Hero assets come from `public/hero/`; all 4 webp are already referenced in `app/brand-assets.css`.

**Tech Stack:** Next.js 16 (App Router), React Server Components, Tailwind v4, shadcn/ui (new-york, radix, lucide), `@/` alias. Verification via next-devtools MCP (confirmed accessible @ :3000) + `scripts/capture-visual-state.mjs` + qa references.

---

## Current state (verified 2026-08-18)

- **next-devtools is accessible**: auto-discovers Next.js dev server on `:3000`, projectPath `C:\old-macdonald-had-a-school`, 9 MCP tools, `get_errors` clean (only "no browser session" note). Reach via `nextjs_call` (port=3000, toolName, args-object; **omit args for no-arg tools** — passing `{}`/string errors).
- **No home route exists**: `app/page.tsx` absent; `curl http://localhost:3000/` → **500**; `compile_route "/"` → `notFound`.
- **All building blocks exist and are wired to grade/topics pages**:
  - `components/home/HomeGradeNav.tsx` — grade-route cards (5 grades), already shadcn `Card` + `grade-surface`.
  - `components/home/HomeSubjectNote.tsx` — subject card (Card parts + `cast-*` surface + `material-cardboard-paper`).
  - `components/home/CreativeArtsSection.tsx` — music/art/drama/dancing cards.
  - `components/home/home-data.ts` — `HOME_SUBJECTS`, `HOME_VIDEO_SONGS`, `NEW_SLUGS` (real lesson slugs).
  - `components/SubjectDiscovery.tsx`, `components/EarlyYearsHub.tsx` — search/curriculum discovery surfaces (used on grade/topics pages).
- **Theme tokens present** in `app/globals.css`: `--navy-deep #1e2a38`, `--brand-navy`, `--paper-*`, `--rose-*`, `--gold-bright`, `--accent`(=gold), `--primary`(=navy), `--muted`. `--font-farm-hand` (Caveat) available via `handFont` in layout.
- **Hero assets staged**: `public/hero/{oldmac-school, old-macs-open-circle-gathering, home-journey-reflect-v1, old-mac-branding-where-did-the-folder-go}.webp`, referenced in `app/brand-assets.css`.
- **Design reference (verified via preview)**: the designed hero = 3 columns — serif headline *"Where familiar songs become **new places** to learn."*, a "New this week" lesson card, a vertical stitch-border **"Sing • Play • Learn • Together"** ribbon, and a pinned (Polaroid, gold push-pins) hero illustration. Header + staff cards unchanged.

---

## Key design-token decisions (must reconcile with cast.mdx before writing)

The preview used literal hex (`#2f5a4b` forest-teal, `#c06c84` rose, `#f2b63d` gold). **Canonical rules forbid raw hex in components.** Before coding:
1. Open `content/pages/branding/cast.mdx` + `data/brand/cast-registry` and map the hero palette to existing semantic tokens:
   - forest-teal hero text → likely derive from `--navy-*` (or add ONE `--hero-teal` to `app/globals.css` `:root` gated on cast approval).
   - rose accent → reuse `--rose-warm`/`--rose-soft` (already tokens).
   - gold dots/border → `--gold-bright` / `--accent`.
   - background → `--paper-cream`.
   - If a teal is genuinely needed and absent, add a **single** `--hero-felt-teal` token to globals.css (brand-identity surface, allowed) — never inline hex.
- Ribbon must use the real felt texture approach (color flood + `--brand-asset`), NOT a flat div.

---

## Task Plan

### Task 1: Wire home route + confirm dev typecheck

**Objective:** Make `app/page.tsx` the home route and establish a green baseline.

**Files:**
- Create: `app/page.tsx` (minimal shell composing existing blocks, no hero yet)
- Test/verify: next-devtools `compile_route "/"` and `curl :3000/`

**Step 1 — create shell**
```tsx
import { HomeGradeNav } from "@/components/home/HomeGradeNav";
import { CreativeArtsSection } from "@/components/home/CreativeArtsSection";
import { SubjectDiscovery } from "@/components/SubjectDiscovery";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 pb-10">
      {/* Hero lands here in Task 2 */}
      <HomeGradeNav />
      <CreativeArtsSection />
      <SubjectDiscovery />
    </section>
  );
}
```
**Step 2 — verify route:** `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/` → **200** (was 500).
**Step 3 — verify via next-dev:** `nextjs_call` `compile_route` path `/` → no `notFound`.
**Step 4 — typecheck:** `npm run typecheck` → pass.

### Task 2: Create hero data + registry mapping
**Objective:** Port the hero content and asset mappings into canonical data (no hex).

**Files:**
- Create: `components/home/hero-data.ts` (lessons with title/desc/gradeTags; hero image per grade via `data-grade`/hero asset key; ribbon copy `["Sing","Play","Learn","Together"]`)
- Modify: `app/brand-assets.css` — add `--hero-felt-teal` (if needed) + `.hero-pinned-photo` surface using the chosen `public/images/hero/*.webp` (copy the canonical `.cast-surface` blend pattern).

**Step 1 — data file** defined same shape as `HomeSubject` (real slugs from `NEW_SLUGS`).
**Step 2 — surface**: hero photo uses existing brand-asset / texture-apply pattern, `background-image` var referenced in registry.
**Step 3 — typecheck** + verify the texture class computes a real image (computed-style check, not just screenshot — see pitfalls).

### Task 3: Build `<HeroBand />` (the designed hero)
**Objective:** 3-column hero exactly per reference, using shadcn primitives + tokens.

**Files:**
- Create: `components/HeroBanner.tsx` (`"use client"` if it needs state; prefer stateless)
- Composes: `CardCard` (lesson list) / text headline (semantic color), `Badge` for grade tags, the ribbon as a decorative `div` (brand-surface), pinned photo `div` w/ push-pin `span`s.
- **Rules:** use `div`/`span` + `cn()`; `size-*` for equal dims; `flex gap-*` only; `Badge` not styled span; semantic tokens not hex.
- Ribbon: `bg-... border-2 border-dashed text-[brand]` vertical via `[writing-mode:vertical-rl]` (single allowed inline style) + `--hero` felt texture.

**Step 1 — layout:** 3-col grid `lg:grid-cols-[...]`, `items-center`, gap from token; on `sm/base` stack (headline above, photo below).
**Step 2 — assets:** `Image` or brand-asset for `oldmac-schools.webp` pinned photo w/ gold push-pin `.hero-pin`.
**Step 3 — typecheck** + screenshot via `scripts/capture-visual-state.mjs`; compare to `qa/hermes-visual-checks/`.

### Task 3: Include HeroBand in page + grade-linking
**Objective:** Runtime ordering hero above grade/lesson content and add the hero ribbon label + heading IDs for a11y/scraping.

**Files:** Modify `app/page.tsx` — render `<HeroBanner />` first; give hero `<h1>` the page's single title (replaces the grade-nav's implied h2 heading), keep `HomeGradeNav` below.

**Verify:** `get_page_metadata` sees the new h1; `compile_route "/"` OK; screenshot full page.

### Task 4: Responsive + a11y polish
**Objective:** hero degrades gracefully 390/768/1024/1440; keyboard focus, no empty interactive.

**Files:** Modify `components/HeroBanner.tsx`; rule check.
- `@media (min-width:64rem)` handled by Tailwind `lg:`; no custom breakpoints (process).
- On mobile: headline stacks, ribbon goes inline (horizontal) or hides, photo centered.
- Grades list keeps `data-grade` for routing.
- `useFocusRing`/focus-visible classes on any `a`/`button`.

**Verify:** responsive screenshots 4 widths via capture script; axe/console clean via next-devtools `getPageA11y` (if available) plus manual Tab.

### Task 5: Verification against references
**Files:** none new.
- `npm run typecheck` pass.
- `node scripts/capture-visual-state.mjs` all viewports.
- next-dev: `get_compilation_issues` → [] ; `get_errors` after attaching a browser session → none.
- Compare hero to `docs/design-explorations/teacher-home-page/teacher-home.html` + the approved preview screenshot.

---

## Files leading change (summary)
- Create `app/page.tsx`, `components/home/HeroBanner.tsx`, `components/home/hero-data.ts`
- Modify `app/globals.css` (minor token add if teal missing), `app/brand-assets.css` (hero photo + felt-teal surface)
- Existing reused: `components/home/*`, `components/SubjectDiscovery.tsx`, `components/EarlyYearsHub.tsx`

## Risks / Tradeoffs / Open Questions
- **Hex-in-components rule:** hero currently uses raw hex in the preview. Must map to tokens or add minimal `--hero-*` token in globals.css — do NOT inline hex in components.
- **Padding/clamp rule:** "no clamp()/vw for padding/gap" — use fixed scale (`p-4`, `gap-3`). Hero headline size uses fixed `text-*` steps, not clamp (respect user hard rule).
- **Single runtime matchMedia:** GradeInteractionLane owns the 64rem guard; hero must not duplicate it — use plain `lg:` utilities.
- **open question:** Should the home page's top-level "hero" also carry search (the current `SubjectDiscovery`)? Propose: keep hero lean (brand + 3 songs) and leave search to existing discovery components — confirm with user before final.
- **Verification tooling:** `scripts/capture-visual-state.mjs` exists? Confirm script path exists before Task 2; if absent, use next-dev screenshot route.
- **History:** previous work is on branch `feature-test-branch`; docs/design-explorations/* are untracked — decide commit vs ignore.

## Open question for user before task 2 (after confirming this plan)
1. Which hero image (of 4 in `public/hero/`) should be the pinned photo? I recommend `old-macs-open-circle-gathering.webp` (teacher + barnyard students) as the reference shows teacher-with-students.