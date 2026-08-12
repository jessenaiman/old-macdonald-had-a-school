---
name: old-macdonald-asset-system
description: Use for every Old MacDonald Had a School visual, homepage, grade, topic, lesson, character, icon, texture, patch, or responsive design task. Locates approved assets, enforces repeating authored textures instead of flat colour, locks characters to CAST_AND_ROLES.md colours and teaching or grade associations, and prevents reference composites or prohibited assets from entering production.
---

# Old MacDonald asset system

Use this skill before selecting assets or changing visual code in this repository.

## Start here: the compact visual catalog

1. Open `/branding` in the running app. It is the visual index for approved production families, canonical
   character pairings, exact example paths, and the main prohibited/reference-only rules.
2. Choose a family from that page before reading directories. Do not recursively scan `public/` to discover
   options already shown on `/branding`.
3. Read only the targeted source needed for the choice:
   - character identity, role, grade, or colour: the relevant row in `public/CAST_AND_ROLES.md`;
   - asset status, ambiguity, or a proposed asset mutation: the relevant section or manifest line in
     `docs/ASSET_LIBRARY_GOVERNANCE.md`;
   - exact dimensions/status not shown on `/branding`: query the matching record in
     `docs/design-asset-master-list.json` by the already-selected path.

Do not read the full governance document, full cast document, or full asset inventory by default. Full-file reads
are reserved for governance audits or when several unrelated families are explicitly in scope.

## What is available

| Need | Use first | Example shown on `/branding` |
| --- | --- | --- |
| Character | Canonical transparent-circle portrait | `public/staff_and_students/` |
| Character badge | Matching portrait over matching authored circle patch | `public/design-assets/blank-felt-patches-v1/individual-patches/` |
| Felt, woven cloth, paper, cardboard | Repeatable authored material tile | `public/design-assets/web-material-library-v1/` |
| Cork | Governed seamless tile or board piece | `public/design-assets/cork-board-kit-v1/` |
| Attachment detail | Separated classroom fastener | `public/design-assets/classroom-fasteners-v1/individual-icons/` |
| Curriculum signal | Approved grade or subject icon | `public/brand-kit-icon-sheets/individual-icons/` |

If `/branding` does not show a suitable option, report the missing category before scanning. Then search only the
single production family above that matches the need.


## Targeted production lookup order

- Repeating materials: `public/design-assets/web-material-library-v1/`
- Cork surfaces: `public/design-assets/cork-board-kit-v1/`
- Classroom fasteners: `public/design-assets/classroom-fasteners-v1/individual-icons/`
- Subject and grade icons: `public/brand-kit-icon-sheets/individual-icons/`
- Canonical character portraits: `public/staff_and_students/`
- Blank usable patches: `public/design-assets/blank-felt-patches-v1/`; reject every rectangle marked `DO NOT USE`
- Homepage-specific reviewed assets: `public/design-assets/homepage-v2/` and, once approved, `homepage-reference-parts-v1/`

Use exact paths presented by `/branding` wherever possible. A file tree listing is not an asset-selection method.

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
2. Open `/branding`, name the shown production example(s) you will reuse, and record their exact paths.
3. Name the reference image and viewport that control the change.
4. Reconcile every visible raster element against the targeted catalog records. Record `present`, `missing`, `reference-only`,
   `DO NOT USE`, or `needs review`.
5. If anything required is missing or ambiguous, follow the exact mutation approval gate in
   `docs/ASSET_LIBRARY_GOVERNANCE.md`. Never approximate it.
6. Keep navigation, headings, labels, links, and buttons as semantic React/HTML. Never use a screenshot with
   invisible hotspots.
7. Use `next/image` with intrinsic dimensions or a correctly sized `fill` container to prevent layout shift.
8. Use the existing Tailwind v4 theme and local font variables for the type scale. Do not introduce a new visual
   language or force single-line headings.
9. Make grid/flex children shrinkable, allow text wrapping, and avoid fixed heights for text-bearing surfaces.
10. Verify at matching desktop, tablet, 390px, and 320px viewports. Scan the entire document for horizontal
   overflow, clipped text, overlap, keyboard focus, reduced-motion behavior, and meaningful alt text.
11. Run `npm.cmd run lint` and `npm.cmd run typecheck`; run the relevant runtime/visual checks for layout work.

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
