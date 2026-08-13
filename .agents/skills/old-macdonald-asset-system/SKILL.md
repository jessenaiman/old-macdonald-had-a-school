---
name: old-macdonald-asset-system
description: Use for Old MacDonald Had a School visual work involving branding, pages, components, responsive layout, characters, colors, textures, paper notes, fasteners, or icons. Treats the current design as an established working system, reuses its `/branding` references and approved assets, and makes restrained changes without redesigning unrelated areas.
---

# Old MacDonald brand design system

Use this skill before selecting assets or changing visual code in this repository. The site is an established design system that is mostly working. Improve the named area; do not reinterpret the whole site.

## Working approach

1. State the requested change and what nearby working elements will remain unchanged.
2. Inspect the owning component and its local styles.
3. Open the relevant example on `/branding`.
4. Reuse an existing component, token, or approved asset whenever it fits.
5. Make the smallest coherent change.
6. Render the changed route at desktop and mobile before reporting success.

Do not turn a bounded request into a redesign, route migration, asset-library audit, or broad CSS rewrite. Do not change adjacent components simply because they share a page.

## Where to look

1. Open `/branding`. It is the visual catalog for working components, materials, icons, character treatments, and responsive examples.
2. Read only the targeted source needed for the choice:
   - character identity, role, grade, or colour: the relevant row in `public/CAST_AND_ROLES.md`;
   - asset status, ambiguity, or a proposed asset mutation: the relevant section or manifest line in
     `docs/ASSET_LIBRARY_GOVERNANCE.md`;
   - exact dimensions/status not shown on `/branding`: query the matching record in
     `docs/design-asset-master-list.json` by the already-selected path.
   - semantic colors and themes: `app/theme.css`;
   - asset class names: `app/brand-assets.css`;
   - layout and behavior: the owning React component and CSS Module.

Do not read the full governance document, cast document, asset inventory, or global stylesheet for an ordinary component task. Do not recursively scan `public/` when `/branding` or the owning component already gives an exact path.

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

## Design rules

- Preserve the hierarchy and composition shown in the user’s reference; do not copy incorrect labels or bake the screenshot into the UI.
- Keep reusable patterns demonstrated on `/branding`.
- Keep text and controls semantic. Decorative raster layers must not contain required copy or interaction.
- Use repeating authored tiles for large material surfaces and separate transparent assets for icons, portraits, fasteners, patches, and irregular silhouettes.
- A fastener must visibly attach something by crossing its edge and the supporting surface.
- Contact sheets, atlases, and page composites are review/export aids, never runtime crops.
- Use canonical portraits unchanged and respect the current character role, grade, and color references.
- Use semantic tokens from `theme.css`; character and grade colors are identity signals rather than the entire page palette.
- Let text wrap and surfaces grow. Check dense layouts at 320 px.
- Preserve explicitly excluded elements exactly, including their behavior.

If a required asset is missing, report the gap and follow the exact approval gate in `docs/ASSET_LIBRARY_GOVERNANCE.md`. Do not generate, export, recolor, move, or replace assets before the named action is approved.

## Verification

For a visual change:

1. Capture the current target at the controlling viewport.
2. Render the result at the same viewport, 390 px, and 320 px when the layout is dense.
3. Check horizontal overflow, clipping, overlap, readability, asset loading, and the affected interaction.
4. Exercise any explicitly preserved adjacent interaction once to catch regressions; do not redesign it.
5. Run focused lint/typecheck. Run a production build when shared shell, routing, or global tokens changed.

Passing lint or accessibility tooling does not replace visual inspection.

## Handoff format

Report concisely:

- the exact reference and viewport used;
- assets reused, with paths;
- missing or excluded assets and their governance status;
- screenshots and overflow measurements at each viewport;
- lint, typecheck, and runtime results;
- unresolved items separately.

Never call a design matched or complete without a fresh same-viewport comparison.
