# Old MacDonald production asset recipes

This is the text companion to the live `#asset-patterns` section on `/branding`. Start here instead of scanning `public/`.

There are two human-editable brand sources:

- This file defines visual classes, component recipes, materials, typography, and asset usage.
- `content/pages/branding/cast.mdx` defines character facts, roles, grades, colours, activities, portrait sources, and rendered examples. `/branding#cast` renders that same source.

The live `/branding` route is the single visual authority. Storybook stories are isolated viewers of components from that page; they are not additional brand definitions.

## Rules

- Use the real shadcn component for behavior, then add only the approved global material or patch class shown below.
- Keep labels, headings, links, and buttons as semantic HTML. Raster assets are visible layers, not controls.
- Never use `blank-felt-patches-v1/individual-patches/*-rectangle.png`; all sixteen rectangle exports are `DO NOT USE`.
- Do not use contact sheets, atlases, composites, Figma exports, design concepts, or review-only extractions in production.
- A grade is a curriculum hub, not a character theme. Character colour belongs only to a character-specific component, scene, or activity.
- A `cast-*` class exposes one character identity locally. It must not recolour a whole grade page.
- Use authored repeat tiles for paper, felt, cork, leather, thread, and fabric. Do not imitate them with gradients or generated noise.
- Preserve canonical portraits unchanged; do not recolour them or substitute a generated portrait.

## Named asset registry

The filepath registry is `app/brand-assets.css`, imported once by `app/globals.css`. Components use semantic classes; they do not repeat public filepaths.

```html
<span class="brand-asset music-fiddle icon-small" role="img" aria-label="Fiddle"></span>
```

Class responsibilities:

| Class | Responsibility |
| --- | --- |
| `brand-asset` | Renders the registered image as a contained background asset |
| `music-fiddle` | Selects the approved dimensional fiddle file |
| `music-fiddle-flat` | Selects the compact review fiddle file |
| `icon-micro`, `icon-small`, `icon-medium`, `icon-large` | Selects display size without changing asset identity |
| `grade-one`, `grade-two` | Selects the approved general grade signal |
| `fastener-*` | Selects a fastener that must remain inside the component it attaches to |

### Direct lookup examples

| Search term | Class recipe | Status | Meaning |
| --- | --- | --- | --- |
| Grade 1 music, small | `brand-asset music-note-single-flat icon-small` | Review family | Compact music signal; do not call it a Grade 1-owned asset |
| Grade 1 fiddle, medium | `brand-asset music-fiddle icon-medium` | Approved | Music/dance activity, appropriate with Mr Rusty |
| Grade 2 general badge | `brand-asset grade-two icon-medium` | Approved | General Grade 2 signal |
| Grade 2 measuring | `brand-asset grade-two-measuring-patterns icon-medium` | Approved | Measuring and patterns; not a science badge |
| Grade 2 science badge | No class exists | Missing | No approved science-specific badge exists; do not substitute a math/building icon |

### Music and arts names

The dimensional class is for medium and large use. Add `-flat` to the asset class only for the compact review family.

| Topic | Named asset classes |
| --- | --- |
| Instruments | `music-fiddle`, `music-hand-drum`, `music-banjo`, `music-handbells` |
| Dance | `dance-turning-footprints`, `dance-crossing-ribbons`, `dance-tap-shoes`, `dance-spiralling-scarves` |
| Music signals | `music-note-single`, `music-notes-paired`, `music-notes-ascending`, `music-rhythm-dots` |
| Acting | `acting-theatre-masks`, `acting-stage-curtains`, `acting-pocket-puppets`, `acting-spotlight-star` |
| Painting | `painting-handprint`, `painting-sponge-shapes`, `painting-crayon-swatches`, `painting-easel` |

### Fastener names

Use `fastener-push-pin`, `fastener-paperclip`, `fastener-binder-clip`, `fastener-masking-tape`, `fastener-washi-tape`, `fastener-sewing-button`, `fastener-gingham-tape`, `fastener-apple-peg`, `fastener-kraft-pocket`, or `fastener-quilted-tab`. The fastener element belongs inside the button, note, or card that it attaches to so its positioning remains responsive.

### Authored patch layers

Use `patch-old-macdonald-square` and `patch-miss-puddles-circle` as decorative `brand-asset` layers. The semantic control or figure owns the layout; the patch does not become a clickable image.

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

Use `article + material-surface material-cardboard-paper` for a lesson-card surface. Add a named semantic asset class instead of a public filepath:

```html
<article class="material-surface material-cardboard-paper">
  <span class="brand-asset fastener-masking-tape icon-medium" aria-hidden="true"></span>
  <span class="brand-asset music-icon icon-medium" role="img" aria-label="Music and dance"></span>
</article>
```

Static public paths belong only in `app/brand-assets.css`. Layout and component selectors belong in `app/globals.css`.

## Character and material class contract

```html
<aside class="cast-miss-hayley material-surface material-felt">
  <!-- Only content about Miss Hayley belongs here. -->
</aside>
```

`cast-miss-hayley` supplies local character variables. Other approved character keys follow the same `cast-<name>` convention.

Approved material recipes include `material-cardboard-paper`, `material-felt`, `material-woven-fabric`, `material-construction-paper`, `material-cork`, and `material-leather`, always paired with `material-surface`.

## Typography contract

- `type-display` / the farm display face: short branded headings.
- `type-hand` / the farm hand face: occasional expressive emphasis and teacher voice.
- `type-body` / the farm body face: paragraphs, labels, controls, and readable UI.
- The live typography specimens on `/branding#typography` show the actual selector, face, size role, and usage. Do not infer a font from appearance.

## Component contract

Use shadcn primitives for behavior and accessibility. Brand classes supply the visual material; they do not replace the primitive.

| Primitive | Use it for | Do not use it for |
| --- | --- | --- |
| `Button` | Actions, action-like links, state changes | A generic clickable `div` |
| `Dialog` | Focused asset recipes and copy actions | Permanent page content |
| `Tabs` | Related panels in one place | Unrelated route navigation |
| `NavigationMenu` / `DropdownMenu` | Related destinations or actions | A permanent grade rail |
| `Collapsible` | Optional supporting detail | Required primary content |
| `Sheet` | Focused mobile or secondary work | A full page replacement |
| `Card` / `Separator` | Grouped content and meaningful boundaries | Decorating every item with an arbitrary box |

## Branding guide specimen shelf

The horizontal shelf immediately below the `/branding` hero is navigation and a working control reference at the same time. Each shadcn `Button` uses a distinct approved background family and exposes its exact asset path beneath the control. On narrow screens the shelf scrolls horizontally; do not replace it with uniform pills or flatten the examples into one generic button style.

The second shelf demonstrates semantic `<a>` elements that are deliberately not styled like buttons: a taped note, stitched tab, portrait-led link, and pinned label. They keep native link behavior and visible focus while using governed image assets as decorative layers.

Every specimen also demonstrates an attachment rule. Push pins belong on cork, tape belongs across a paper edge, clips grip an edge, and thread or sewing details belong with felt. The hover/focus information panel lists both the surface path and attachment path.
