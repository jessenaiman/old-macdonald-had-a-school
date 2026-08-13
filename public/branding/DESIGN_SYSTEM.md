# Old MacDonald design system

This document is the implementation contract behind `/branding`. It is written for people and agents who need to extend the site without scanning components or recreating the style.

## Source hierarchy

1. `app/globals.css` owns global tokens, typography, materials, layout rules, and component styling.
2. `app/brand-assets.css` maps a readable asset class to one approved public file.
3. [`CAST_AND_ROLES.md`](../CAST_AND_ROLES.md) owns staff and student facts.
4. [`BRAND_ASSET_RECIPES.md`](../BRAND_ASSET_RECIPES.md) owns asset names and production recipes.
5. `/branding` shows the working visual examples and Storybook links.

Do not repeat public image paths in page TSX. Use the named registry class.

## Component rule

Use shadcn for interactive behaviour and accessibility.

| Need | Primitive | Brand layer |
| --- | --- | --- |
| action | `Button` | `brand-button` plus the approved material variant |
| related panels | `Tabs` | `brandingTab` or the relevant scoped component class |
| menu | `NavigationMenu`, `DropdownMenu`, or `Sheet` | governed site chrome material |
| asset preview | `Dialog` | card/paper surface and named asset class |
| optional detail | `Collapsible` | readable card or paper surface |
| grouped information | `Card` and `Separator` | an authored material only when it communicates a physical object |

Never use a clickable `div`, raster hotspot, or a custom control to bypass these primitives.

## Material rule

Use a real governed material tile with `material-surface`:

```tsx
<Card className="material-surface material-cardboard-paper" />
```

Paper and cardboard are reading fields. Felt, woven cloth, construction paper, and leather are bounded accents or controls. Cork is a working board, not a page background. Thread is an attachment detail, never a full background.

## Attachment rule

- A push pin goes inside the note or card it pins, positioned by that component.
- Tape crosses the edge of the paper it holds.
- A clip grips an edge.
- Stitching belongs on felt or fabric.
- A border indicates a different surface or attached object, not a random box.

The named fastener classes are in [`BRAND_ASSET_RECIPES.md`](../BRAND_ASSET_RECIPES.md).

## Responsive rule

Use Tailwind grid or flex with `gap-*`, shrinking children, and text that wraps. The brand does not authorize fixed text heights or one-off breakpoint math. When a component needs an irregular visual, its semantic shadcn primitive remains the interaction footprint while the approved asset is a contained visual layer.

## Theme rule

The site has one shared neutral UI palette. Grade pages select grade content. Characters contribute colour only to character-specific surfaces. Do not repaint a whole grade page in a teacher's colour.
