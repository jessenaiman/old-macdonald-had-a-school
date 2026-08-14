---
name: old-macdonald-asset-system
description: Learn the visual design rules for this project.
---

# Old MacDonald asset system

Use this skill before selecting an asset or changing visual code. Treat the current site as an established system. Do not reconstruct project history or carry assumptions from an earlier task: the rendered `/branding` route and its focused Markdown chapters are the current visual contract.

## User-authored implementation rules

- Only requirements the user actually states are rules. Do not invent additional prohibitions, approval gates, architectural layers, or historical compatibility requirements.
- Unless the user explicitly requests a custom component, reuse or extend an existing production component or installed shadcn primitive.
- When the user requests a texture, select the authored texture whose palette and material role match the requested grade, curriculum area, topic, or surrounding composition. Do not treat the currently registered class as the complete set of choices.
- Grade, curriculum, topic, and cast colors share an identity system. A component may use the matching color or texture without displaying the associated character portrait.
- When the useful source is a large contact sheet and no suitable individual export exists, use Canva Magic Layers to separate the needed asset, export a web-ready file, inspect the result for clipping, broken transparency, edge damage, and responsive legibility, and fix defects before connecting it to production.

## Non-negotiable ownership

- `app/layout.tsx` is the root layout. It owns `ThemeProvider`, shared header, shared footer, and the global `<main>`. Pages and nested layouts must not duplicate or visually replace them.
- `app/globals.css` is the single Tailwind/shadcn theme entrypoint and palette owner. Raw HEX, RGB, HSL, named presentation colors, and component-local dark palettes are forbidden outside it. Literal HEX is allowed only as printed reference content on the matching live semantic surface.
- `app/brand-assets.css` maps approved asset paths and textures; it must not own palette values.
- Shared shadcn primitives own control behavior. Pages may compose and position them; pages must not recolor or redesign them.
- Use Tailwind's configured responsive breakpoints unless an approved raster asset requires a documented exception.
- Components receive semantic identities such as `character="miss-puddles"`, `data-grade="grade-two"`, or a subject key—never color, ink, portrait URL, texture URL, or breakpoint props.
- One reusable component represents one behavior. Variants are semantic props or data attributes, not copied components.

## Tailwind and responsive contract

CSS Modules are forbidden by default. Use Tailwind utilities, shared shadcn primitives, and reusable material recipes first. A CSS Module is allowed only when a small, component-specific mechanism cannot be expressed clearly with Tailwind and is not reusable elsewhere—for example authored raster safe-area geometry, a complex pseudo-element, print-only document mechanics, or tightly coupled animation geometry. The owning file must document the reason beside the import. CSS Modules must never own palette values, breakpoints, ordinary grid/flex layout, typography, spacing, shared control states, or a whole page composition.

Use intrinsic layout first: normal flow, `flex-wrap`, `min-w-0`, `max-w-full`, flexible tracks, and `minmax(0, 1fr)`. Let the parent determine available space.

Use only Tailwind's configured standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) when content truly changes arrangement. Do not declare custom viewport widths in TSX, MDX, CSS modules, inline styles, or component props. Do not create a page-private breakpoint system.

A custom media or container query is allowed only for an approved raster asset with a documented safe-area/aspect-ratio requirement that intrinsic layout cannot express. Document the asset and reason beside the rule, keep it in the owning primitive, and verify the boundary widths. Convenience is not an exception.

Never hide overflow at a page or section boundary to conceal a responsive failure. Find the child whose minimum, unwrapped text, fixed width, or positioning expands the document. Horizontal scrolling is acceptable only inside an intentionally labelled control such as a code sample, tab rail, or data region.

## Fast path

1. Identify the decision: material/surface, character, icon/fastener, typography/theme, or component/layout.
2. Search the asset inventory before concluding that an asset is missing:
   - human lookup: `docs/DESIGN_ASSET_MASTER_LIST.md`
   - filterable lookup: `docs/design-asset-master-list.csv`
   - machine lookup: `docs/design-asset-master-list.json`
   - targeted filename discovery: `rg --files public | rg -i "<role-or-material>"`
3. Read the candidate's status and plain-language role as implementation guidance, not a ban on discovery or use. Everything under `public/design-assets/` is part of the allowed design library. Prefer an individual export over a contact sheet when the component needs one separate piece.
4. Open the matching `/branding` anchor:
   - `#assets` — materials, fasteners, and registered asset classes
   - `#icons` — curriculum and music/arts signals
   - `#cast` — canonical character facts and visible pairings
   - `#page-recipe` or `#subject-cards` — composed board/card examples
   - `#typography` — type roles in a real composition
   - `#controls` or `#grades` — interaction and grade composition
5. Use the source file named by the page for the exact registered class or current consumer. Registration describes current use; omission from `brand-assets.css` does not prove that the asset does not exist.
6. Inspect the owning component and local styles before editing.
7. Reuse the existing class, primitive, token, or allowed asset. If a suitable asset exists but is not registered for the requested role, report that concrete candidate and connect it through `brand-assets.css` and the asset recipe. If the page, inventory, recipe, and implementation disagree, report the conflict with all four states.

## Source hierarchy

These sources have different jobs; `/branding` is visual evidence, not a substitute for every source file.

| Question | First source | Open next only when needed |
| --- | --- | --- |
| Which material or asset pattern fits? | `/branding#assets` or the relevant anchor | `public/BRAND_ASSET_RECIPES.md` |
| What exact public file does a class use? | `public/BRAND_ASSET_RECIPES.md` | `app/brand-assets.css` |
| What may a character do or teach? | `/branding#cast` | `content/pages/branding/cast.mdx`, the portable canonical roster |
| What is the palette/type role? | `/branding#typography` | `public/branding/PALETTE_AND_TYPOGRAPHY.md`, then `app/globals.css` |
| How should a component behave? | `/branding#controls` | `public/branding/DESIGN_SYSTEM.md`, then the owning component |
| Is an asset approved, excluded, or ambiguous? | `/branding#governance` | the relevant section of `docs/ASSET_LIBRARY_GOVERNANCE.md` |

Use targeted inventory queries for ordinary choices; do not dump an entire inventory or global stylesheet into context. A targeted discovery search is required whenever the requested role is absent from the branding page, the user asks what else exists, or the current registered asset is rejected.

## Allowed design library

Everything under `public/design-assets/` is allowed for design discovery and production use. Registration in `brand-assets.css` records a current semantic consumer; it is not an allowlist and omission is not rejection. Choose the individual asset that fits the component role. Source sheets and contact sheets may guide selection; use a separated individual when interactive or responsive composition requires independent pieces.

Common families include:

- Canonical portraits: `public/staff_and_students/`
- Repeatable materials: `public/design-assets/web-material-library-v1/`
- Cork: `public/design-assets/cork-board-kit-v2/`
- Fasteners: `public/design-assets/classroom-fasteners-v1/individual-icons/`
- Blank paper notes: `public/design-assets/classroom-paper-notes-v1/individual-notes/`
- Grade and subject icons: `public/brand-kit-icon-sheets/individual-icons/`
- Blank patches: `public/design-assets/blank-felt-patches-v1/`

Do not confuse “allowed asset” with “embed the entire sheet.” Contact sheets, atlases, composites, and page crops are useful discovery or composition references; select separated pieces for semantic, responsive production components when those pieces exist. `figma-copy-design/`, `public/design-concepts/`, and `public/design-explorations-v5/` are outside `public/design-assets/` and remain composition references.

## Material and composition rules

- Use authored repeat tiles for cork, felt, woven cloth, cardboard, paper, leather, thread, or stitching. Never counterfeit a visible material with a flat color, gradient, CSS noise, emoji, or pseudo-element.
- Cork is a working board surface, not a generic page background.
- Keep labels, headings, links, and controls semantic. Raster assets are decorative or illustrative layers, never required copy or interaction.
- A fastener must visibly cross or grip the edge of the object it holds and must remain inside that component’s layout.
- Use shadcn primitives for behavior; brand classes provide the approved material or asset layer.
- Use semantic tokens. Character and grade colors are local identity signals, not permission to repaint an entire page.

## Character rules

Before showing a character, verify the current name, filename, signature color, staff/student status, grade ownership, role, and scene suitability. Use the canonical portrait unchanged. Do not recolor portraits, invent a TypeScript character registry, or associate staff with an unassigned teaching topic. Build badges from the matching portrait and approved patch/material.

If a required role is not registered, search all of `public/design-assets/` before reporting a gap. Connecting an existing asset for use is allowed. Moving, deleting, overwriting, recoloring, or generating files remains a separate mutation decision.

## Verification

For a visual change, capture the current target first, render the same target at the controlling desktop width plus 390px and 320px when dense, and check overflow, clipping, overlap, readability, asset loading, focus, reduced motion, and the affected interaction. Run focused lint/typecheck; run a production build when shared routing, root layout UI, or global tokens changed. Automated checks do not replace visual inspection.

For a documentation-only review, report the rendered route and source evidence without running unrelated checks.

### Required anti-regression counts

Before and after a cleanup, report these counts in chat and drive every applicable violation to zero:

- active CSS Module files and imports, excluding explicitly documented raster-safe-area, print, or animation exceptions;
- `site-shell`, `site-chrome`, `chrome-*`, and equivalent invented wrapper or presentation-layer aliases;
- raw runtime asset URLs in pages, MDX, and ordinary components outside `app/brand-assets.css` and canonical semantic identity components;
- broken stylesheet imports and imports of another page's private stylesheet;
- redundant material nesting where a board contains another identical board, or a paper workspace contains another paper wrapper with no physical meaning;
- production grade, topic, and lesson structures missing from their matching `/branding` working examples.

Folder paths may appear in a clearly labelled discovery inventory. Production examples must show the semantic component, prop, data attribute, or registered class that consumers actually use, never encourage copying a filename.

An App Router layout must provide real shared UI or behavior for its route segment. A pass-through element with an invented wrapper class is not a layout contract; return `children` directly when no segment-level UI exists.

Do not declare success from a zero text match alone. Run typecheck and focused lint, start exactly one project-local development server, inspect the rendered routes at the controlling desktop width plus 390px and 320px, and verify interactions, assets, computed overflow, and keyboard focus.

## Rejection checklist

Stop before editing if the proposed approach would add:

- another header, footer, root layout UI, theme provider, or root `<main>`;
- raw color values outside `app/globals.css`;
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
