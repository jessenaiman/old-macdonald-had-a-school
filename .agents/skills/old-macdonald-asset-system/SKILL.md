---
name: old-macdonald-asset-system
description: Use for every Old MacDonald Had a School visual, homepage, grade, topic, lesson, character, icon, texture, patch, or responsive design task. Locates approved assets, enforces repeating authored textures instead of flat colour, locks characters to CAST_AND_ROLES.md colours and teaching or grade associations, and prevents reference composites or prohibited assets from entering production.
---

# Old MacDonald asset system

Use this skill before selecting assets or changing visual code in this repository.

## Read first

1. `docs/PROJECT_STRUCTURE.md`
2. `docs/PROJECT_FILE_MAP_AND_QA_START.md`
3. `docs/ASSET_LIBRARY_GOVERNANCE.md`
4. `public/CAST_AND_ROLES.md`
5. `docs/DESIGN_ASSET_MASTER_LIST.md`
6. `docs/HOMEPAGE_REFERENCE_ASSET_INVENTORY.md` for homepage/reference work

## Production lookup order

- Repeating materials: `public/design-assets/web-material-library-v1/`
- Cork surfaces: `public/design-assets/cork-board-kit-v1/`
- Classroom fasteners: `public/design-assets/classroom-fasteners-v1/individual-icons/`
- Subject and grade icons: `public/brand-kit-icon-sheets/individual-icons/`
- Canonical character portraits: `public/staff_and_students/`
- Blank usable patches: `public/design-assets/blank-felt-patches-v1/`; reject every rectangle marked `DO NOT USE`
- Homepage-specific reviewed assets: `public/design-assets/homepage-v2/` and, once approved, `homepage-reference-parts-v1/`

Treat contact sheets, atlases, page composites, page-section crops, `figma-copy-design/`, `public/design-concepts/`,
and `public/design-explorations-v5/` as references, never production components.

## Material rule

Never represent cork, felt, woven cloth, cardboard, construction paper, wood, chalkboard, stitching, or torn
paper with a flat colour, CSS gradient, CSS noise, drawn pseudo-element, emoji, or generic substitute when that
material is visible in the locked reference. Use a repeatable authored tile or a governed separated raster asset.
CSS may position, size, repeat, and responsively crop real assets; it may not counterfeit them.

## Character and curriculum rule

Before showing a character, read the current row in `public/CAST_AND_ROLES.md` and verify:

- exact character identity and filename;
- exact signature hex colour;
- staff or student status;
- grade ownership and teaching role;
- topic/scene suitability.

Use the canonical portrait unchanged. Build coloured badges only from the matching portrait and matching authored
patch/material. Do not recolour portraits or invent a TypeScript character registry. Associate staff with their
locked teaching topics and grades; if a requested association conflicts, stop and report the conflict.

## Visual implementation workflow

1. Capture or inspect the current page at the target viewport before editing.
2. Name the reference image and viewport that control the change.
3. Reconcile every visible raster element against the inventory. Record `present`, `missing`, `reference-only`,
   `DO NOT USE`, or `needs review`.
4. If anything required is missing or ambiguous, follow the exact mutation approval gate in
   `docs/ASSET_LIBRARY_GOVERNANCE.md`. Never approximate it.
5. Keep navigation, headings, labels, links, and buttons as semantic React/HTML. Never use a screenshot with
   invisible hotspots.
6. Use `next/image` with intrinsic dimensions or a correctly sized `fill` container to prevent layout shift.
7. Use the existing Tailwind v4 theme and local font variables for the type scale. Do not introduce a new visual
   language or force single-line headings.
8. Make grid/flex children shrinkable, allow text wrapping, and avoid fixed heights for text-bearing surfaces.
9. Verify at matching desktop, tablet, 390px, and 320px viewports. Scan the entire document for horizontal
   overflow, clipped text, overlap, keyboard focus, reduced-motion behavior, and meaningful alt text.
10. Run `npm.cmd run lint` and `npm.cmd run typecheck`; run the relevant runtime/visual checks for layout work.

## Handoff format

Report:

- the exact reference and viewport used;
- assets reused, with paths;
- missing or excluded assets and their governance status;
- character-to-colour/topic/grade checks;
- screenshots and overflow measurements at each viewport;
- lint, typecheck, and runtime results;
- unresolved items separately.

Never call a design matched or complete without a fresh same-viewport comparison.
