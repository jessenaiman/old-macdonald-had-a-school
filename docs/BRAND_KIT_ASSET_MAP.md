# Brand-kit asset map

Use this guide to locate approved visual materials during the redesign. It is an
index, not a substitute for the preserved Figma implementation, which remains
the primary visual source when the two disagree.

## Start here

| Need | Location | Notes |
| --- | --- | --- |
| Complete, scannable brand reference | `public/animal-brand-kit-demo-preview-full.png` | Best first review: palette, typography, cast, page examples, and material treatment in one vertical board. |
| Interactive/reference companion | `public/animal-brand-kit-demo.html` | Uses the assets in `public/brand-kit-demo-assets/`. |
| Homepage / planning-workspace concept | `public/design-concepts/relational-craft-homepage-concept.png` | A concept reference, not an implementation mandate. It establishes the Relational Craft material language. |
| Core rationale | `public/design-concepts/relational-craft-philosophy.md` | Read before introducing new tactile treatments. |

## Brand foundations

- `public/brand-emblem.png` — brand mark.
- `public/brand-kit-demo-assets/` — demo fonts, warm-kraft and felt tiles,
  stitched corners and rules, and example badges/patches. Use
  `animal-brand-kit-demo-preview-full.png` to see them in context.
- Typography supplied with the demo: `BricolageGrotesque-Bold.ttf`,
  `InstrumentSans-Regular.ttf`, and `InstrumentSans-Bold.ttf`.
- Core colour roles shown in the demo: denim (anchor), tomato (attention),
  mustard (discovery), garden sage (care/growth), warm kraft and cream
  (quiet fields). Do not derive a new palette from screenshots.

## Cast and curriculum iconography

- `public/animal-cast-contact-sheet.png` — all cast members at a glance;
  canonical text details live in `public/CAST_AND_ROLES.md`.
- `public/brand-kit-icon-sheets/` — cast, grade, and subject icon sheets;
  `*-keyed.png` is the easiest lookup, `*-atlas.png` is useful for visual
  comparison, and `individual-icons/` is for direct use.
- `public/icons/` — production-oriented icon library, divided into
  `canva-animal-icons/`, `early-years/`, `staff/`, `generated-mascot/`, and
  `old-macdonald-icon-pack/` (read its `README.md`).
- `public/patches/`, `public/scenes/`, and `public/staff_and_students/` —
  supplied legacy/Figma-support imagery. Inspect the exact asset and source
  context before use; do not replace it with generated art.

## Tactile component library

| Asset family | Location | Use |
| --- | --- | --- |
| Material overview sheets | `public/core-material-sheets-v1/` | Visual comparison of fabric, construction-paper, stitched-border, and button treatments. |
| Repeatable web textures | `public/design-assets/web-material-library-v1/` | Character-indexed felt, construction paper, woven fabric, thread overlays, plus neutral cardboard. Contact sheets provide the fastest selection. |
| Blank stitched containers | `public/design-assets/blank-felt-patches-v1/` | Circle, square, and rectangle patches; 16 character-coloured sets plus all-colours contact sheets. Keep them text-free as designed. |
| Fasteners | `public/design-assets/classroom-fasteners-v1/` | Individual pins, clips, tape, labels, thread, and other physical joinery. Use only as purposeful attachment cues. |
| Material and joinery guidance | `public/design-assets/web-material-library-v1/material-language-philosophy.md`, `public/design-assets/blank-felt-patches-v1/quiet-joinery-philosophy.md` | Defines intended restraint, scale, and stitching behavior. |

## Grade and page concepts

- `public/design-concepts/grade-family/` — rendered variants for daycare,
  preschool, kindergarten, Grade 1, and Grade 2, plus the family philosophy.
- `public/design-concepts/grade-family/canva-parts/<grade>/` — cropped
  navigation, hero, curriculum-pathway, planning-resource, and teacher-panel
  references for the matching grade.
- These are design concepts. Follow the approved Figma implementation for
  shared chrome, layout, and final page behavior; use concepts to understand
  the permitted material vocabulary and grade-specific pacing.

## Guardrails for asset use

1. Begin with the whole-board preview, then inspect the matching sheet/contact
   sheet before selecting an individual asset.
2. Preserve the canonical character, colour, and role mappings in
   `CAST_AND_ROLES.md`; never recolour or reassign a character.
3. Stitching and fasteners indicate construction or attachment. They are not
   general decoration; reserve them for major panels, joins, notes, or chosen
   states.
4. Prefer a quiet paper field and a small number of substantial felt accents.
   Keep textures subtle enough to protect reading, printing, and contrast.
5. Do not create substitute imagery, emoji, handcrafted SVGs, or generic
   visual replacements when a supplied asset exists.
