---
name: old-macdonald-asset-system
description: Find and use Old MacDonald visual assets correctly. Use whenever selecting, registering, reviewing, or displaying a texture, paper note, fastener, icon, logo, character, grade identity, or other artwork in this project.
---

# Old MacDonald asset system

## Purpose

Find an existing authored asset, connect it once through its semantic owner, reuse it through shared components, and verify the rendered result. Read `AGENTS.md` for framework and CSS rules; this skill covers asset decisions only.

## Workflow

1. Name the visual role: background surface, attached paper, patch, fastener, curriculum icon, character identity, logo, or illustration.
2. Inspect the matching `/branding` section and the production component that needs the asset. The branding page is a visual index, not a permission gate.
3. Search before declaring a gap:
   - browse `docs/DESIGN_ASSET_MASTER_LIST.md`;
   - filter `docs/design-asset-master-list.csv` or `.json`;
   - run a targeted `rg --files public | rg -i "<role-or-material>"`.
4. Prefer a web-ready individual export. Contact sheets are discovery references, not production UI. If only a large sheet contains the needed piece, use Canva Magic Layers, export the piece for the web, and inspect clipping, transparency, and responsive legibility.
5. Connect the asset through the correct owner, then reuse that semantic name in components.
6. Verify the affected interaction at 1440, 390, and 320 pixels. Check loading, cropping, transparency, seams, readability, focus, and overflow.

## Ownership

| Concern | Owner |
| --- | --- |
| Theme colors and reusable material recipes | `app/globals.css` |
| Asset URLs and semantic asset variables | `app/brand-assets.css` |
| Character facts and canonical portraits | `lib/cast.ts` and `components/brand/CharacterPortrait.tsx` |
| Responsive brand mark | `components/brand/ResponsiveBrandEmblem.tsx` |
| Interactive behavior | Existing production component or installed shadcn primitive |

Everything under `public/design-assets/` is available for discovery and use. `brand-assets.css` records current connections; it is not an allowlist. Pages and MDX examples should use semantic components, props, data attributes, or registered classes rather than copying runtime file paths.

## Material rules

- Hard surfaces support attached objects. Cork is a working board; cardboard may be the wall or presentation surface behind it.
- Put readable text on paper, construction paper, sticky notes, labels, stickers, or other plausible writing surfaces. Do not write directly on leather, denim, woven cloth, felt, or cork.
- Paper and textile backgrounds use authored repeat tiles. A note, patch, badge, pin, or torn label uses an individual transparent export.
- A fastener must visibly cross or grip the object it holds. Transparent corners must reveal the real surface beneath them.
- Match texture and color to the relevant grade, curriculum area, topic, or cast identity. The matching character does not need to be displayed.
- Use compact face patches or busts for navigation and dense controls. Use canonical full-body portraits for cards and introductions; do not shrink them into tiny icons.
- When artwork has distinct large, medium, and small exports, switch semantic assets with Tailwind's standard breakpoints instead of shrinking the detailed source.
- Do not counterfeit missing material with gradients, CSS noise, emoji, filters, or an unrelated asset. Report the concrete gap or create the required web-ready export through the approved asset workflow.

## Useful references

- `/branding#assets` - materials and asset families
- `/branding#icons` - curriculum and subject icons
- `/branding#cast` - character roles, colors, and asset families
- `/branding#logo-family` - responsive identity marks
- `content/pages/branding/cast.mdx` - portable canonical cast reference
- `public/BRAND_ASSET_RECIPES.md` - registered asset recipes

## Handoff

Report the semantic asset used, its owning file/component, the viewports inspected, and any genuine missing or ambiguous asset. Do not call a visual match complete without looking at the rendered result.
