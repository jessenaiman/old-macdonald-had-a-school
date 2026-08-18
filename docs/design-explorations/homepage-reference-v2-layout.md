# Homepage Reference v2 — Layout Design & Implementation Guide

> **Date:** 2026-08-18 · **Source:** reference image `upload_20260818_104350_1.png`
> **Status:** Design spec + asset/CSS insertion documentation (implementation = follow-up task)
> **Scope:** `app/page.tsx` (currently staged-deleted — this guide recreates it), `components/home/*`, `app/globals.css`, `app/brand-assets.css`, `components/SiteHeader.tsx`

---

## 1. What the reference shows (analysis)

The reference is a **skeuomorphic "craft & felt" homepage** on a dark navy felt canvas:

1. **Header** — navy felt with white dashed perimeter stitching; red barn emblem + serif wordmark; links **Resources · Curriculum · About · Support**; right-side **"My Plan"** button (open-book icon). Mobile: hamburger.
2. **Hero (2 columns on desktop)** —
   - *Left:* a cream **paper note card** pinned with a glossy red pushpin (top center), curled corner, containing a small-caps olive label **TEACHER RESOURCES**, headline **"Where familiar songs become new places to learn."**, a sage-green stitched divider, and the tagline **"Plan from the lesson, not a catalogue."** Below the note: a row of **5 stitched felt pill badges** — Daycare (mustard, sun), Pre-School (lavender, flower), Kindergarten (sky blue, star), Grade 1 (soft rose, heart), Grade 2 (burnt red, apple).
   - *Right:* a **leather-framed carousel** titled **"Choose a classroom path"** (handwriting-style navy heading, felt leaf corner decorations) with a needle-felted farm diorama slide, circular stitched arrows, dots + **"1 of 4"**, and a navy **"Open grade planner"** button.
3. **"Find a Lesson by Subject"** — a **corkboard** with thick stitched leather/wood border and two red corner pushpins, holding **6 cream paper cards** pinned with colored fasteners: Language & Literacy, Math, Nature & Science, Health & Movement, Feelings & Friendship, Hands-on Learning.
4. **Bottom banner** — a cream paper strip pinned with a yellow pushpin: two purple eighth notes + **"Songs and creative arts"**.

**Responsive:** desktop 1440 (2-col hero, 1×6 subject cards); tablet 768 (stacked hero, badges full-width, 2×3 subjects); mobile 390 (hamburger, 2-2-1 badge grid, 1-col subjects).

---

## 2. Layout blueprint (component tree)

### Desktop (`lg+`) — `app/page.tsx`

```tsx
<main className="home-canvas">            {/* navy felt canvas — homepage only */}
  {/* HERO */}
  <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Left column */}
      <div className="flex flex-col gap-6">
        <HomeHeroNote />                  {/* Card — pinned paper note */}
        <HomeGradeBadges />               {/* 5 Badge pills — felt + stitch */}
      </div>
      {/* Right column */}
      <HomeClassroomPath />               {/* Card frame (leather) + Carousel */}
    </div>
  </section>

  {/* SUBJECTS — corkboard */}
  <section className="corkboard-frame ..."> {/* cork texture + leather/wood border + corner pins */}
    <header>… “Find a lesson by subject” …</header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {HOME_SUBJECTS.filter(6).map(s => <HomeSubjectNote key={s.key} … />)}
    </div>
  </section>

  {/* BOTTOM BANNER */}
  <CreativeArtsSection />                 {/* restyled: pinned paper strip */}
</main>
```

- **Tablet (`md`)**: hero grid becomes single column (`grid-cols-1`), carousel below the text note, badges wrap, subjects `sm:grid-cols-2`.
- **Mobile**: `grid-cols-1` throughout; badges `grid grid-cols-2` with Grade 2 spanning 2 (`last:col-span-2`); subjects `grid-cols-1`.
- All breakpoints are **Tailwind defaults only** (`sm=640, md=768, lg=1024, xl=1280`). No custom breakpoints, no `clamp()`, no arbitrary px spacing.

---

## 3. Reference → component mapping

| Reference element | shadcn primitive | Existing project component | Action |
|---|---|---|---|
| Navy felt canvas + stitch | — (brand surface) | `body`/`main` in layout + page | New `.home-canvas` brand surface (Section 5) |
| Header stitch + "My Plan" CTA | `Button`, `NavigationMenu` | `components/SiteHeader.tsx` | Add stitched border utility + CTA button; nav items per decision (Section 7 flag) |
| Hero paper note | `Card` | — | **New** `components/home/HomeHeroNote.tsx` |
| 5 felt grade pills | `Badge` | `components/home/HomeGradeNav.tsx` (data) | **New** `components/home/HomeGradeBadges.tsx` (reuses `HOME_GRADES`, grade tokens, `data-grade` textures) |
| Leather carousel frame | `Card` + `Carousel` | `components/ui/carousel.tsx` **installed** | **New** `components/home/HomeClassroomPath.tsx` |
| Corkboard section | — (surface) | `HomeSubjectNote.tsx`, `home-data.ts` | Restyle section surface; reuse `HomeSubjectNote` as-is for 6 subjects |
| Subject paper cards | `Card` (+ `[data-subject]` papers) | `HomeSubjectNote.tsx` | **Reuse unchanged** |
| Bottom "Songs and creative arts" banner | `Card`/section | `components/home/CreativeArtsSection.tsx` | Restyle to pinned paper strip |

### Carousel composition (authoritative — shadcn docs + local source)
```tsx
<Carousel className="…">
  <CarouselContent>
    <CarouselItem>…</CarouselItem>   {/* one felt-diorama slide each */}
  </CarouselContent>
  <CarouselPrevious />               {/* OUTSIDE CarouselContent */}
  <CarouselNext />
</Carousel>
```
- `CarouselPrevious`/`CarouselNext` go **outside** `CarouselContent`; default placement `-left-12`/`-right-12` — restyle via `className` prop (they are `Button`s with `variant`/`size` props).
- Pagination ("1 of 4") is **not** a built-in part — read `setApi` → `api.on("select", …)` (pattern already used elsewhere in this repo if needed).

---

## 4. Design tokens — what exists vs what to add (`app/globals.css`)

### Already available (no change needed)
| Token | Value | Used for |
|---|---|---|
| `--brand-navy` / `--brand-navy-foreground` | `#1e2a38` / `#fefce8` | Canvas, header (stable in dark mode — pinned literal) |
| `--paper-cream` / `--paper-warm` / `--paper-muted` | cream family | Paper notes, cards |
| `--wood-warm` / `--wood-muted` | `#c4a07a` / `#d4b896` | Leather/wood frames (consider adding a darker `--wood-deep` for the thick frame) |
| `--gold-bright` | `#d4a82a` | Accents |
| `--grade-daycare-color` | `#e8a227` mustard | **matches reference** |
| `--grade-kindergarten-color` | `#2c6c9b` blue | close to reference sky blue |
| `--grade-one-color` | `#c9527a` rose | **matches reference** |
| `--grade-two-color` | `#b5272c` burnt red | **matches reference** |
| `--cast-whiskers-color` | `#7b4fa8` purple (cast.mdx approved) | Pre-School lavender candidate |

### Token changes to make
1. **`--grade-pre-school-color`**: `#55705a` (green) → **lavender** for the reference badge. Use an **approved cast.mdx color** — recommend `#7b4fa8` (Whiskers purple) or add a foundation token `--lavender-warm` derived from the cast palette. *Rule: never invent raw hex in components; tokens come from cast.mdx palette.*
2. **Stitching**: add a utility surface (below) — white dashed borders + optional `--asset-thread-old-macdonald` overlay for fabric stitch feel.
3. **Homepage canvas**: add `.home-canvas` surface class (Section 5) — navy felt, homepage only; **other routes keep the ivory paper canvas** (no global body change).
4. Keep `@theme inline` mapping in sync (`--color-grade-pre-school: var(--grade-pre-school-color)` already exists — the value change propagates automatically).

---

## 5. Brand surface classes to add (CSS alteration rules)

Follow the **existing canonical pattern** (`cast-surface` / `grade-surface` in `globals.css`, ~lines 484–525): color flood + real texture asset via `background-blend-mode`, never flat color alone.

```css
/* Homepage navy felt canvas — homepage only */
.home-canvas {
  color: var(--brand-navy-foreground);
  background-color: var(--brand-navy);
  background-image: linear-gradient(var(--brand-navy), var(--brand-navy)),
    var(--asset-denim-indigo);            /* or a navy felt tile */
  background-blend-mode: color, normal;
  background-repeat: repeat;
  background-size: auto, 180px;
}

/* Stitched border — white dashed thread on brand surfaces */
.stitched {
  border: 2px dashed color-mix(in oklch, var(--brand-navy-foreground) 45%, transparent);
}

/* Leather frame (carousel + corkboard border) */
.leather-frame {
  color: var(--ink-primary);
  background-color: var(--wood-warm);
  background-image: linear-gradient(var(--wood-warm), var(--wood-warm)),
    var(--asset-leather-old-macdonald);
  background-blend-mode: color, normal;
  background-repeat: repeat;
  background-size: auto, 180px;
}

/* Cork board surface */
.corkboard-surface {
  color: var(--ink-primary);
  background-color: var(--brand-cork-color, #bd8f58);
  background-image: linear-gradient(var(--brand-cork-color), var(--brand-cork-color)),
    var(--asset-cork-board);
  background-blend-mode: color, normal;
  background-repeat: repeat;
  background-size: auto, 160px;
}
```

**CSS alteration rules (project hard rules):**
1. `app/globals.css` is the **only** place for custom CSS variables/surfaces; `app/brand-assets.css` is the **only** place for asset URL registries.
2. **No raw hex in components** — always via tokens/`@theme inline` utilities (`bg-brand-navy`, `text-brand-navy-foreground`, `grade-surface`, …).
3. No custom breakpoints, no `clamp()`/`vw` padding — fixed scale (`p-4`, `gap-6`) and Tailwind defaults only.
4. `@theme inline` maps `--color-*` tokens to utilities (Tailwind v4 docs: `@theme inline { --color-canvas: var(--acme-canvas-color) }`).
5. Never put `@property` in globals.css (breaks Tailwind v4 PostCSS) — use `data-*` variants / inline styles for animated vars; `color-mix()` inside arbitrary values needs underscores: `in_oklch` not `in oklch`.
6. Custom CSS is **limited to brand identity surfaces** (felt/paper/cork/leather/stitch). Layout/typography live in component classes.

---

## 6. How to insert assets correctly (the asset pipeline)

**The rule: components never carry URLs. The registry in `app/brand-assets.css` is the single place file paths exist.**

### Workflow (4 steps)
1. **Drop the approved file** into `public/design-assets/<kit>/<file>.webp` (never `public/` root, never a raw path in a component).
2. **Register the URL** in `app/brand-assets.css` `:root`:
   ```css
   --asset-hero-diorama-barn: url('/design-assets/homepage-v2/hero-diorama-barn.webp');
   ```
3. **Map a semantic class or `[data-*]` selector** to it:
   ```css
   .hero-diorama-barn { --brand-asset-image: var(--asset-hero-diorama-barn); }
   /* or keyed by grade/subject: */
   [data-grade='daycare'] { --grade-badge-icon: url('/design-assets/…/sun-embroidered.webp'); }
   ```
4. **Use it in the component** (existing `.brand-asset` / `.brand-scene` machinery):
   ```tsx
   <span className="brand-asset hero-diorama-barn icon-medium" role="img" aria-label="Barn diorama" />
   ```
   — or `.brand-scene` for full-bleed cover images.

### Assets already in the registry that this design needs (no new files)
| Need | Registry asset |
|---|---|
| Cork board | `--asset-cork-board`, `--asset-cork-board-landscape`, `.cork-board-landscape` |
| Leather frame | `--asset-leather-old-macdonald` |
| Thread/stitch overlay | `--asset-thread-old-macdonald` |
| Grade felt textures | `[data-grade]` → `--grade-texture` (5 felt tiles) |
| Subject paper notes (6 cards) | `[data-subject]` → `--subject-*-paper` (torn/notebook notes) |
| Fasteners (subject pins) | `.fastener-push-pin`, `.fastener-paperclip`, `.fastener-binder-clip`, … |
| Grade icons | `.grade-icon[data-grade-icon=…]` (or new embroidered set, below) |
| Bottom banner eighth notes | `.music-notes-paired` (two purple notes) |
| Paper banner strip | `--asset-paper-note-board`, `--asset-paper-note-teacher` |
| Hero note paper | `--asset-paper-note-teacher` (wide teacher note) or `--subject-language-paper` |
| Wood frame kit (if used) | `--asset-working-wall-*` (rails, corners, posts) |
| Brand emblem | `ResponsiveBrandEmblem` component (already in header) |

### New assets to source/approve (reference-only elements)
1. **Felt diorama hero scene(s)** for the classroom-path carousel (needle-felted barnyard — the reference subject). Note: `public/scenes/hero/*` referenced by old registry entries (`--asset-home-scene-*`) **do not exist on disk** — supersede/remove those.
2. **Embroidered grade badge icons**: sun (daycare), flower (pre-school), star (kindergarten), heart (grade 1), apple (grade 2) — OR reuse existing grade icons if acceptable.
3. **Glossy red pushpin** (hero note + corkboard corners) and **yellow pushpin** (bottom banner) — or recolor/replace `.fastener-push-pin`.
4. Optional: felt leaf corner decorations for the carousel frame.
5. **Buttons need no assets** — use lucide icons (`BookOpen` for "My Plan", `CalendarDays`/`ClipboardList` for "Open grade planner").

---

## 7. Implementation plan (ordered)

1. **Fix build blocker** — `app/layout.tsx:40-47` references `../public/background-textures/Caveat-{Regular,Bold}.ttf` but that folder is **gone**; copies exist at `public/design-assets/background-textures/`. Update the `localFont` paths or the build fails before any UI work.
2. **Tokens** (`app/globals.css`): pre-school → lavender; add `.home-canvas`, `.stitched`, `.leather-frame`, `.corkboard-surface` surfaces.
3. **Registry** (`app/brand-assets.css`): register new assets from Section 6; remove stale `--asset-home-scene-*` → `scenes/hero` entries.
4. **Components**: `HomeHeroNote.tsx`, `HomeGradeBadges.tsx`, `HomeClassroomPath.tsx` (new); restyle `CreativeArtsSection.tsx` to banner.
5. **Page**: recreate `app/page.tsx` per Section 2 blueprint (6-subject subset: language, math, science, health, sel, fine-motor — music/arts move into the banner).
6. **Header** (`SiteHeader.tsx`): stitched border, "My Plan" CTA button, nav items.
7. **Verify**: `npm run typecheck` → `node scripts/capture-visual-state.mjs` → screenshots at **390 / 768 / 1440** compared against the reference.

### Flags / decisions for you
- **Nav**: reference shows `Resources · Curriculum · About · Support` + "My Plan" (no grade tabs in header — grades live in the hero badges). Current header shows Home/Search/About + 5 grade tabs. Which wins?
- **Canvas**: homepage becomes navy felt (reference) — all other pages keep the ivory paper canvas.
- **Pre-School color**: green → lavender (cast.mdx-approved `#7b4fa8` or similar).
- **6 vs 8 subjects**: reference shows 6; music/arts fold into the "Songs and creative arts" banner.

---

## 8. Documentation sources (authoritative)

- **shadcn/ui**: local component source is the API (`components/ui/carousel.tsx`, `badge.tsx`, `card.tsx`); docs via `npx shadcn@latest docs <component>` or context7 `/shadcn-ui/ui` (carousel composition confirmed: `Carousel → CarouselContent → CarouselItem`, arrows outside content, `Autoplay` plugin supported).
- **Tailwind CSS v4**: `@theme` / `@theme inline` for custom tokens (`https://tailwindcss.com/docs/theme`, `/websites/tailwindcss` via context7) — `--color-*` vars generate utilities; `@theme inline` for referencing runtime CSS vars (the project's exact pattern at `globals.css:237`).
- **Radix UI**: primitives compose via `asChild` (project base = radix; never `render`).
