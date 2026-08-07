# Design asset master list

Generated from the current working tree. This is the development handoff index for icons, patches,
fasteners, material textures, canonical portraits, and separated Canva page parts.

## Locked usage rules

- Canva-authored files provide textures, patches, icons, and physical attachment cues.
- Figma defines typography, spacing, hierarchy, responsive layout, and component boundaries.
- React/HTML must keep visible labels, links, buttons, and layout semantic; reference sheets are not UI components.
- Preserve character names, roles, and exact colours from `public/CAST_AND_ROLES.md`.
- Any `REVIEW` asset must be visually cleared before use.
- Do not use files marked `DO NOT USE` or silently substitute a lookalike.

## Canonical source order

1. `public/CAST_AND_ROLES.md` for names, roles, grade ownership, and exact hex colours.
2. `public/staff_and_students/*-transparent-circle.png` for canonical character artwork.
3. `public/design-assets/blank-felt-patches-v1/individual-patches/*-{circle,square}.png` for colour-bearing patch backgrounds.
4. `public/brand-kit-icon-sheets/individual-icons/` for grade and subject icons.
5. `public/design-assets/classroom-fasteners-v1/individual-icons/` for pins, clips, tape, staples, buttons, and thread cues.
6. `public/design-assets/web-material-library-v1/` for repeatable felt, paper, cardboard, woven-fabric, and thread textures.
7. `public/design-concepts/`, `public/design-explorations-v5/`, and `public/design-concepts/grade-family/canva-parts/` for composition reference only.

For a canonical coloured character badge, layer the transparent character artwork over the matching circle patch. Do not recolour either layer in CSS.

| Website identity | Character art | Colour patch | Locked colour |
| --- | --- | --- | --- |
| Daycare | `miss-puddles-transparent-circle.png` | `02-miss-puddles-circle.png` | `#E8A227` |
| Kindergarten | `mr-rusty-transparent-circle.png` | `03-mr-rusty-circle.png` | `#2C6C9B` |
| Grade 1 | `miss-hayley-transparent-circle.png` | `04-miss-hayley-circle.png` | `#C9527A` |
| Grade 2 | `mr-sam-transparent-circle.png` | `05-mr-sam-circle.png` | `#1F6B6B` |

> Preschool identity conflict: the current `CAST_AND_ROLES.md` assigns Mr Maisy to Preschool, while existing UI/reference work assigns Miss Maisy. Treat the current cast file as repository truth and flag the stale reference before implementation; never silently choose or recolour.

## Figma and Canva provenance

- Canva supplied the raster material pieces and separated page parts now stored under `public/`.
- Figma supplied layout, typography, hierarchy, and component-boundary intent. The local `figma-copy-design/` export is a prototype reference, not production code.
- The local Figma export still contains emoji, generated CSS texture/stitch effects, and stale role/colour assignments. Development agents must not copy those parts as canonical assets.
- A live Figma file key is not stored in the repository. Review the connected Figma file again when a node-specific URL is available.

## Summary

- Total raster assets indexed: **350**
- DO NOT USE: **16**
- REFERENCE ONLY: **44**
- REVIEW: EXTRACTION ARTIFACTS: **32**
- REVIEW: POSSIBLE CLIPPING: **4**
- USABLE SOURCE: **254**
- Exact duplicate groups: **2**
- Full machine-readable records: `docs/design-asset-master-list.csv` and `docs/design-asset-master-list.json`

## Asset families

| Family | Files | Usable | Reference | Clipping review | Do not use | Primary role |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Canva animal icons | 16 | 4 | 0 | 12 | 0 | curriculum / classroom icon |
| Canva grade-page parts | 25 | 0 | 25 | 0 | 0 | layout reference part |
| blank felt patches | 52 | 36 | 0 | 0 | 16 | felt patch / badge |
| brand-kit curriculum icons | 19 | 15 | 4 | 0 | 0 | curriculum / classroom icon |
| canonical character portraits | 18 | 18 | 0 | 0 | 0 | character portrait / icon |
| character patches | 18 | 18 | 0 | 0 | 0 | felt patch / badge |
| classroom and education icon pack | 19 | 19 | 0 | 0 | 0 | curriculum / classroom icon |
| classroom fasteners | 17 | 17 | 0 | 0 | 0 | fastener / attachment cue |
| core material review sheets | 4 | 4 | 0 | 0 | 0 | curriculum / classroom icon |
| early-years activity icons | 32 | 12 | 0 | 20 | 0 | curriculum / classroom icon |
| legacy and production texture assets | 35 | 22 | 9 | 4 | 0 | felt patch / badge |
| miscellaneous icon sheets | 3 | 2 | 1 | 0 | 0 | felt patch / badge |
| staff and student icons | 16 | 16 | 0 | 0 | 0 | character portrait / icon |
| theme toggle patches | 3 | 3 | 0 | 0 | 0 | felt patch / badge |
| web material textures | 73 | 68 | 5 | 0 | 0 | repeatable material texture |

## Files requiring review or exclusion

| Status | File | Pixels | Edge contact | Reason |
| --- | --- | ---: | --- | --- |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/06-mr-maisy-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/07-mr-puddles-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/09-hopper-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/10-whiskers-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/11-scout-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/12-penny-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/13-maisy-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/14-puddles-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/15-sam-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| DO NOT USE | `public/design-assets/blank-felt-patches-v1/individual-patches/16-rusty-rectangle.png` | 512×512 | left, right | Known clipped blank rectangle export; use an approved replacement only. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-02.png` | 236×273 | right | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-03.png` | 236×273 | right | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-04.png` | 236×273 | right | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-05.png` | 237×251 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-06.png` | 236×251 | top, right | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-07.png` | 236×251 | top, right | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-08.png` | 236×251 | left, top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-09.png` | 237×251 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-10.png` | 236×251 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-11.png` | 236×251 | top, right, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-13.png` | 237×252 | left | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/canva-animal-icons/canva-icon-14.png` | 236×252 | bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/hopper-red.png` | 286×286 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/miss-hayley-purple.png` | 267×267 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/miss-maisy-purple.png` | 286×286 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/miss-puddles-purple.png` | 267×267 | bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/mr-maisy-orange.png` | 286×286 | bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/mr-puddles-green.png` | 267×267 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/mr-rusty-blue.png` | 285×285 | bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/mr-sam-blue.png` | 267×267 | bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/old-macdonald-yellow.png` | 286×286 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/penny-orange.png` | 267×267 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/rusty-blue.png` | 266×266 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-busts/whiskers-orange.png` | 247×247 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/hopper-red.png` | 251×251 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/maisy-yellow.png` | 251×251 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/miss-maisy-purple.png` | 251×251 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/mr-maisy-orange.png` | 251×251 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/mr-puddles-green.png` | 251×251 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/mr-sam-blue.png` | 251×251 | top | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/penny-orange.png` | 251×251 | top, bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: EXTRACTION ARTIFACTS | `public/icons/early-years/face-patches/sam-red.png` | 252×252 | bottom | Tight chroma-key crop; visible edge streaks or cut-off artwork are possible. |
| REVIEW: POSSIBLE CLIPPING | `public/texture-assets/material-kit-v2/badge-red-scalloped.png` | 512×512 | right | Opaque alpha reaches canvas edge; inspect before development use. |
| REVIEW: POSSIBLE CLIPPING | `public/texture-assets/material-kit-v2/patch-label.png` | 512×512 | left | Opaque alpha reaches canvas edge; inspect before development use. |
| REVIEW: POSSIBLE CLIPPING | `public/texture-assets/material-kit-v2/patch-tall.png` | 512×512 | top, right | Opaque alpha reaches canvas edge; inspect before development use. |
| REVIEW: POSSIBLE CLIPPING | `public/texture-assets/material-kit-v2/patch-wide.png` | 512×512 | bottom | Opaque alpha reaches canvas edge; inspect before development use. |

## Exact duplicate groups

1. `public/icons/farm_school_character_face_patch_sheet_primary_secondary_16.png`; `public/patches/simple/farm_school_character_face_patch_sheet_primary_secondary_16.png`
2. `public/texture-assets/stitch-corner-bottom-left-alt.png`; `public/texture-assets/stitch-corner-bottom-left.png`

## Per-file inventory

The CSV is the canonical exhaustive list. Use its `family`, `role`, `status`, pixel dimensions, alpha bounds,
and SHA-256 columns when assigning assets to implementation agents.
