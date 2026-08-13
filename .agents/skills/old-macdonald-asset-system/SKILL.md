---
name: old-macdonald-asset-system
description: Mandatory for Old MacDonald visual work involving branding, pages, components, layout, characters, colors, textures, paper, fasteners, icons, or responsive behavior. Read the current rendered /branding guide and its focused MDX source first; reuse the established Tailwind, theme, shadcn, and governed-asset contract without inventing palettes, viewports, or parallel components.
---

# Old MacDonald asset system

Use this skill before selecting an asset or changing visual code. Treat the current site as an established system. Do not reconstruct project history or carry assumptions from an earlier task: the rendered `/branding` route and its focused Markdown chapters are the current visual contract.

## Mandatory preflight

1. Identify the active route, owning component, and exact requested change.
2. Open the current rendered `/branding` page at the closest matching anchor and viewport. Source inspection alone is insufficient for visual work.
3. Read only the matching file in `content/pages/branding/`: page recipe, assets, icons, cast, subject cards, typography, buttons, controls, grades, or palette.
4. Follow links in that chapter to the owning component or focused source. Do not recursively scan `public/`, a giant stylesheet, or unrelated chapters.
5. Compare the live production component with the branding example. If they differ, stop and identify which is a fixture, fork, or stale reference before editing.

## Non-negotiable ownership

- `app/layout.tsx` owns the single site shell, `ThemeProvider`, shared header, shared footer, and global main. Pages and nested layouts must not duplicate or visually replace them.
- `app/theme.css` is the only palette owner. Raw HEX, RGB, HSL, named presentation colors, and component-local dark palettes are forbidden outside it. Literal HEX is allowed only as printed reference content on the matching live semantic surface.
- `app/brand-assets.css` maps approved asset paths and textures; it must not own palette values.
- Shared shadcn primitives own control appearance and behavior. Pages may compose and position them; pages must not recolor or redesign them.
- Components receive semantic identities such as `character="miss-puddles"`, `data-grade="grade-two"`, or a subject key—never color, ink, portrait URL, texture URL, or breakpoint props.
- One reusable component represents one behavior. Variants are semantic props or data attributes, not copied components.

## Tailwind and responsive contract

Use intrinsic layout first: normal flow, `flex-wrap`, `min-w-0`, `max-w-full`, flexible tracks, and `minmax(0, 1fr)`. Let the parent determine available space.

Use only Tailwind's configured standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) when content truly changes arrangement. Do not declare custom viewport widths in TSX, MDX, CSS modules, inline styles, or component props. Do not create a page-private breakpoint system.

A custom media or container query is allowed only for an approved raster asset with a documented safe-area/aspect-ratio requirement that intrinsic layout cannot express. Document the asset and reason beside the rule, keep it in the owning primitive, and verify the boundary widths. Convenience is not an exception.

Never hide overflow at a page or section boundary to conceal a responsive failure. Find the child whose minimum, unwrapped text, fixed width, or positioning expands the document. Horizontal scrolling is acceptable only inside an intentionally labelled control such as a code sample, tab rail, or data region.

## Fast path

1. Identify the decision: material/surface, character, icon/fastener, typography/theme, or component/layout.
2. Open only the matching `/branding` anchor:
   - `#assets` — materials, fasteners, and registered asset classes
   - `#icons` — curriculum and music/arts signals
   - `#cast` — canonical character facts and visible pairings
   - `#page-recipe` or `#subject-cards` — composed board/card examples
   - `#typography` — type roles in a real composition
   - `#controls` or `#grades` — interaction and grade composition
3. Use the source file named by the page for the exact class, path, fact, or status. Do not recursively scan `public/` to discover options.
4. Inspect the owning component and local styles before editing.
5. Reuse the existing class, primitive, token, or approved asset. If the page, recipe, and implementation disagree, stop and report the conflict.

## Source hierarchy

These sources have different jobs; `/branding` is visual evidence, not a substitute for every source file.

| Question | First source | Open next only when needed |
| --- | --- | --- |
| Which material or asset pattern fits? | `/branding#assets` or the relevant anchor | `public/BRAND_ASSET_RECIPES.md` |
| What exact public file does a class use? | `public/BRAND_ASSET_RECIPES.md` | `app/brand-assets.css` |
| What may a character do or teach? | `/branding#cast` | `content/pages/branding/cast.mdx` or the relevant `public/CAST_AND_ROLES.md` row |
| What is the palette/type role? | `/branding#typography` | `public/branding/PALETTE_AND_TYPOGRAPHY.md`, then `app/theme.css` or `app/globals.css` |
| How should a component behave? | `/branding#controls` | `public/branding/DESIGN_SYSTEM.md`, then the owning component |
| Is an asset approved, excluded, or ambiguous? | `/branding#governance` | the relevant section of `docs/ASSET_LIBRARY_GOVERNANCE.md` |

Do not read a full governance, cast, inventory, or global stylesheet file for an ordinary component choice. Use the already-selected path or class to query exact details.

## Approved production boundary

- Canonical portraits: `public/staff_and_students/`
- Repeatable materials: `public/design-assets/web-material-library-v1/`
- Cork: `public/design-assets/cork-board-kit-v2/`
- Fasteners: `public/design-assets/classroom-fasteners-v1/individual-icons/`
- Blank paper notes: `public/design-assets/classroom-paper-notes-v1/individual-notes/`
- Grade and subject icons: `public/brand-kit-icon-sheets/individual-icons/`
- Approved blank patches: `public/design-assets/blank-felt-patches-v1/`

Contact sheets, atlases, composites, page crops, `figma-copy-design/`, `public/design-concepts/`, `public/design-explorations-v5/`, and anything marked `DO NOT USE` are references or review material, not production components.

## Material and composition rules

- Use authored repeat tiles for cork, felt, woven cloth, cardboard, paper, leather, thread, or stitching. Never counterfeit a visible material with a flat color, gradient, CSS noise, emoji, or pseudo-element.
- Cork is a working board surface, not a generic page background.
- Keep labels, headings, links, and controls semantic. Raster assets are decorative or illustrative layers, never required copy or interaction.
- A fastener must visibly cross or grip the edge of the object it holds and must remain inside that component’s layout.
- Use shadcn primitives for behavior; brand classes provide the approved material or asset layer.
- Use semantic tokens. Character and grade colors are local identity signals, not permission to repaint an entire page.

## Character rules

Before showing a character, verify the current name, filename, signature color, staff/student status, grade ownership, role, and scene suitability. Use the canonical portrait unchanged. Do not recolor portraits, invent a TypeScript character registry, or associate staff with an unassigned teaching topic. Build badges from the matching portrait and approved patch/material.

If a required asset is missing or ambiguous, report the gap and follow the named approval gate in `docs/ASSET_LIBRARY_GOVERNANCE.md`. Do not generate, recolor, export, move, or replace an asset before approval.

## Verification

For a visual change, capture the current target first, render the same target at the controlling desktop width plus 390px and 320px when dense, and check overflow, clipping, overlap, readability, asset loading, focus, reduced motion, and the affected interaction. Run focused lint/typecheck; run a production build when shared routing, shell, or global tokens changed. Automated checks do not replace visual inspection.

For a documentation-only review, report the rendered route and source evidence without running unrelated checks.

## Rejection checklist

Stop before editing if the proposed approach would add:

- another header, footer, page shell, theme provider, or root main;
- raw color values outside `theme.css`;
- runtime asset URLs outside `brand-assets.css` or a canonical identity mapping;
- private button/control appearance outside the shared primitive;
- arbitrary `w-[...]`, `max-w-[...]`, viewport calculations, or undocumented breakpoints used to force a screenshot match;
- a component that duplicates an existing production behavior;
- page-level overflow clipping that hides an oversized child;
- invented character, grade, subject, or curriculum data.

For App Router structure, layouts, Server/Client boundaries, metadata, or data loading, also use `next-best-practices` and read the installed guide under `node_modules/next/dist/docs/`. Use `vercel-react-best-practices` only for measurable performance work; it is not a design or routing validator. A branding example of a production route must use the same query, mapping, configuration, and component, or clearly identify fixture data.

## Handoff

Report briefly:

- reference anchor and viewport;
- exact source/class and assets reused;
- excluded, missing, or ambiguous items and their status;
- runtime/visual evidence and focused checks;
- unresolved items separately.

Never call a design matched or complete without a fresh same-viewport comparison.
