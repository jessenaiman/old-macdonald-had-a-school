# Handoff: Componentize the Relational Craft UI

Status: user-confirmed; implementation changes required.

## The failure to correct

The current WIP in `components/builder/CurriculumTemplates.tsx` renders each grade's lesson-planning tray as one composite PNG and overlays invisible link hotspots. The visible buttons, labels, resource cards, borders, and typography are therefore pixels inside the image rather than reusable website components.

This is explicitly rejected. Do not extend or repeat this pattern.

## Required production pipeline

1. Use Canva-authored exports for textures, felt/paper pieces, fasteners, icons, and other visual assets.
2. Use the approved Figma composition for typography, spacing, hierarchy, responsive layout, and component boundaries.
3. Build the result as semantic React/HTML components.
4. Use raster images only for objects that are genuinely visual assets: material textures, character art, icons, fasteners, blank felt patches, and printable stationery surfaces.
5. Keep button text, navigation labels, resource titles, headings, links, and layout containers as real DOM content.
6. Compare a matching-viewport implementation screenshot with the approved reference and repeat until the componentized page matches.

If an automated Figma-to-code or Canva-to-code export is used, treat its output as an implementation starting point. Inspect it to ensure it has not flattened multiple interactive elements into one image.

## Locked sources

- Visual references: `public/design-concepts/` and `public/design-explorations-v5/`
- Canva-separated grade parts: `public/design-concepts/grade-family/canva-parts/`
- Authored web materials: `public/design-assets/web-material-library-v1/`
- Character and curriculum facts: `public/CAST_AND_ROLES.md`
- Asset navigation: `docs/BRAND_KIT_ASSET_MAP.md`
- Asset-creation provenance: `codex://threads/019fd387-f31e-7ed3-8594-0457595d4ca3`

Do not invent, recolor, rename, or substitute locked assets. Do not use the known clipped blank rectangle exports.

## Immediate code target

Replace these WIP constructs:

- `planningReference`
- `.planningReference`
- `.referenceHotspot`
- `.editGoalHotspot`
- `.saveWeekHotspot`
- `.resourceHotspot1`, `.resourceHotspot2`, `.resourceHotspot3`

Create a componentized planning tray containing:

- a real current-goal section;
- real `Edit goal` and `Save to week` controls;
- three real resource-card links using separate supplied icons and fasteners;
- an authored printable paper surface where the reference requires one;
- grade-specific copy and asset mappings without positional or color approximations.

The same rule applies to the header/navigation prototype under `public/design-prototypes/header-nav-v1/`: it is a visual target, not a production screenshot to embed.

## Acceptance checklist

- [ ] No composite reference screenshot is used as a multi-control UI component.
- [ ] Buttons and links remain keyboard accessible and expose their visible text to assistive technology.
- [ ] Text remains selectable and responsive.
- [ ] Canva/Figma/project assets are used as separate files.
- [ ] The page matches the approved reference at the same viewport.
- [ ] Mobile and print layouts preserve useful teacher workflows.
- [ ] Next.js `get_compilation_issues` returns no issues.
- [ ] TypeScript and ESLint pass.
- [ ] Independent visual review returns `APPROVED`.

## Current verification evidence

- TypeScript passed before handoff.
- ESLint passed for `CurriculumTemplates.tsx` before handoff.
- Next.js reported no compilation issues before handoff.
- Visual approval was not granted.

## First action for the next instance

Read this file, `AGENTS.md`, `docs/TEAM_WORKFLOW.md`, `docs/BRAND_KIT_ASSET_MAP.md`, and the GitHub issue tied to this handoff. Then inventory the separate assets required for the grade-planning tray before editing the component.
