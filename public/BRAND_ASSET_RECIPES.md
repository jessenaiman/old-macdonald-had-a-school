# Old MacDonald production asset recipes

This is the text companion to the live `#asset-patterns` section on `/branding`. Start here instead of scanning `public/`.

## Rules

- Use the real shadcn component for behavior, then add only the approved global material or patch class shown below.
- Keep labels, headings, links, and buttons as semantic HTML. Raster assets are visible layers, not controls.
- Never use `blank-felt-patches-v1/individual-patches/*-rectangle.png`; all sixteen rectangle exports are `DO NOT USE`.
- Do not use contact sheets, atlases, composites, Figma exports, design concepts, or review-only extractions in production.

## Patch-shaped shadcn buttons

| Example | Component recipe | Public asset |
| --- | --- | --- |
| Old MacDonald circle | `Button + patchAssetButton patchAssetButton-circle` | `public/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-circle.png` |
| Old MacDonald square | `Button + patchAssetButton patchAssetButton-square` | `public/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-square.png` |
| Miss Hayley circle | `Button + patchAssetButton patchAssetButton-circle` | `public/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png` |
| Miss Hayley square | `Button + patchAssetButton patchAssetButton-square` | `public/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-square.png` |

## Material-bearing shadcn controls

| Example | Global class recipe | Public asset |
| --- | --- | --- |
| Felt action | `material-surface material-felt` | `public/design-assets/web-material-library-v1/felt/felt-01-old-macdonald-tile.png` |
| Paper action | `material-surface material-cardboard-paper` | `public/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png` |
| Cork notice | `material-surface material-cork` | `public/design-assets/cork-board-kit-v1/seamless-cork-tile.png` |

## Semantic asset composition

Use `article + material-surface material-cardboard-paper` for the lesson-card example, then add these unchanged decorative images with `next/image`:

- `public/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png`
- `public/brand-kit-icon-sheets/individual-icons/subject-music-dance.png`

The live implementation is `components/cast/AssetPatternCatalogue.tsx`. Global selectors live only in `app/globals.css`.

## Branding guide specimen shelf

The horizontal shelf immediately below the `/branding` hero is navigation and a working control reference at the same time. Each shadcn `Button` uses a distinct approved background family and exposes its exact asset path beneath the control. On narrow screens the shelf scrolls horizontally; do not replace it with uniform pills or flatten the examples into one generic button style.

The second shelf demonstrates semantic `<a>` elements that are deliberately not styled like buttons: a taped note, stitched tab, portrait-led link, and pinned label. They keep native link behavior and visible focus while using governed image assets as decorative layers.

Every specimen also demonstrates an attachment rule. Push pins belong on cork, tape belongs across a paper edge, clips grip an edge, and thread or sewing details belong with felt. The hover/focus information panel lists both the surface path and attachment path.
