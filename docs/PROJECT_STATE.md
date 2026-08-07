# Project State

Updated: 2026-08-07

## Current objective

User-confirmed: reproduce the approved Relational Craft designs with separate Canva/Figma/project assets and semantic website components. Do not flatten buttons, labels, navigation, or multi-element sections into screenshots.

## Current branch

- `agent/homepage-visual-qa-in-progress`
- Status: WIP handoff checkpoint; not visually approved and not ready for `main`.

## Active lanes

- No background agents remain active.
- Next implementation lane: replace the composite grade-planning image and invisible hotspots with componentized React/HTML using separate authored assets.

## Evidence-verified progress

- Canonical character circles and material libraries are present under `public/`.
- Theme-toggle sun/moon assets and header/navigation prototypes exist for review under `public/design-assets/theme-toggle-patches-v1/` and `public/design-prototypes/header-nav-v1/`.
- TypeScript passed before handoff.
- ESLint passed for `components/builder/CurriculumTemplates.tsx` before handoff.
- Next.js reported no compilation issues before handoff.

## Changes required

- `components/builder/CurriculumTemplates.tsx` currently uses a grade-specific composite planning image with invisible hotspots. The user rejected this architecture.
- The header/navigation prototype is reference artwork only. It must be rebuilt from separate assets if approved; it must not be embedded as a page screenshot.
- A matching-viewport visual comparison is still required after componentization.

## Durable implementation rule

- Canva: textures, felt/paper pieces, icons, fasteners, and other authored image assets.
- Figma: typography, spacing, responsive layout, hierarchy, and component boundaries.
- React/HTML: semantic production implementation and proof that the design can be reproduced from separate assets.

## Handoff references

- `docs/HANDOFF_COMPONENT_ASSET_PIPELINE.md`
- `design-qa.md`
- `docs/PROCESS_IMPROVEMENTS.md`
- `codex://threads/019fd387-f31e-7ed3-8594-0457595d4ca3`

## Repository caveat

`docs/PROJECT_CHECKLIST.md` is referenced by the workflow but is currently absent. Do not assume an older checklist state.

## Next lead action

Open the GitHub handoff issue, inventory the separate tray assets, replace the composite-image/hotspot implementation, and run independent visual and runtime review before merging.
