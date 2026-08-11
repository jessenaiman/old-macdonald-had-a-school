# Homepage asset audit

Date: 2026-08-11  
Scope: Selected stitched-paper homepage redesign  
Authority: `docs/ASSET_LIBRARY_GOVERNANCE.md`, `docs/DESIGN_ASSET_MASTER_LIST.md`, and `public/CAST_AND_ROLES.md`

## Audit method

- Read the repository asset-governance and master-inventory documents before selecting assets.
- Inspected the authored homepage reference, felt contact sheet, cork-board contact sheet, classroom-fastener sheet, and cast icon sheet visually.
- Checked pixel dimensions and transparency metadata from `docs/design-asset-master-list.json` and direct image inspection.
- Inspected the connected Figma file `OMHS — Design Assets` (`eWvVPyees5lDxp7PShSOnu`). Its only populated page is `Backgrounds`, containing seven material assets; it does not contain the supplied plant-planning board.
- Treated the two identical supplied plant screenshots as one visual reference.

## Required asset map

| Slot | Selected source | Pixels | Alpha | Status | Review |
| --- | --- | ---: | --- | --- | --- |
| Header emblem | `public/brand-emblem.png` | 1254×1254 | yes | reuse | Canonical project emblem; visually intact. |
| Hero paper | `public/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png` | 512×512 | no | reuse | Matches the warm paper surface in the selected reference. |
| Subject board | `public/design-assets/cork-board-kit-v1/seamless-cork-tile.png` | 1024×1024 | no | reuse | Seamless, high-resolution cork suitable for the unrolling board. |
| Presentation strip reference | `public/design-assets/cork-board-kit-v1/wide-planning-strip.png` | 1824×693 | no | adapt | Use as material/layout reference; interactive controls remain semantic HTML. |
| Early Years felt | `public/design-assets/web-material-library-v1/felt/felt-05-mr-sam-tile.png` | 512×512 | no | reuse | Canonical teal texture. |
| Grade School felt | `public/design-assets/web-material-library-v1/felt/felt-04-miss-hayley-tile.png` | 512×512 | no | reuse | Canonical pink texture. |
| Fasteners | `public/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png`, `03-paperclip-double-loop.png` | 512×512 | yes | reuse | Authored, clean transparent edges. |
| Theme control | `public/design-assets/theme-toggle-patches-v1/sun-patch.png`, `moon-patch.png` | 1254×1254 | yes | reuse | Authored theme patches. |
| Carousel: gathering | `public/scenes/home-schoolhouse-classroom-hero-v1.png` | 1798×899 | no | reuse | Exact indoor classroom gathering used by the selected desktop, tablet, and mobile references. |
| Carousel: singing | `public/scenes/singing-together-on-old-macs-farm.png` | 1672×941 | no | reuse | Correct 16:9 hero scene. |
| Carousel: planting | `public/scenes/plant-your-seeds-with-care.png` | 1536×1024 | no | adapt | Existing source can be cropped responsively. |
| Carousel: plant planning board | Supplied “What Does a Plant Need?” screenshot | 303×175 reference | no | missing | No original or full-resolution copy exists in `public` or the connected Figma file. Requires governed production below. |
| Subject icons | `public/brand-kit-icon-sheets/individual-icons/subject-*.png` | 305–338×343–359 | yes | reuse | All six selected icons are visually intact and approved. |
| Curriculum portrait strip | `public/staff_and_students/{mr-rusty,miss-hayley,mr-sam,mr-maisy,mr-puddles,miss-maisy,old-macdonald,miss-puddles}-transparent-circle.png` | 512×512 each | yes | reuse | Canonical staff portraits mapped respectively to Music, Stories, Math, Movement, Art, Nature, Community, and Early Learning. Character names remain accessible but are not visible labels. |
| Curriculum portrait color fields | Matching canonical circle patches `03`, `04`, `05`, `06`, `07`, `08`, `01`, and `02` | 1254×1254 each | yes | reuse | Layer each portrait over its matching authored circle patch; do not recolor either layer. |
| Footer material | Existing navy felt/thread material family | 512×512 tiles | varies | reuse | No new footer raster required. |

## Exclusions

- Do not use any of the 16 clipped blank rectangle exports marked `DO NOT USE`.
- Do not use reference composites, page-section crops, atlases, or contact sheets as production UI.
- Do not copy stale role/color data or emoji from `figma-copy-design/`.
- Do not replace authored icons, portraits, textures, or fasteners with CSS drawings or generic substitutes.

## Proposed asset mutation manifest

This document does not authorize a line by itself. Each line requires explicit approval by ID under `docs/ASSET_LIBRARY_GOVERNANCE.md`; approvals and execution evidence are recorded below.

| ID | Source | Figma staging destination | Local destination | Exact operation | Reversal |
| --- | --- | --- | --- | --- | --- |
| PAM-HOME-001 | The user-supplied 303×175 “What Does a Plant Need?” carousel reference in this conversation | Figma file `eWvVPyees5lDxp7PShSOnu`, new page `Homepage v2 — Generated Assets`, frame `Carousel / What Does a Plant Need / 1600×900` | `public/design-assets/homepage-v2/what-does-a-plant-need-carousel.png` | A delegated image agent creates a faithful 1600×900 high-resolution version preserving the authored planning-board text and composition; stage variants in Figma; download only the approved PNG. If separation fails, use Canva Magic Layers and restage the isolated result in Figma. | Remove the newly created Figma page/frame and delete only the new local destination file. No existing asset is overwritten. |
| PAM-HOME-002 | Image generation grounded in `public/brand-kit-icon-sheets/curriculum-subject-icon-sheet.png` and the selected `qa/homepage-concepts/revised-option-2.png` | Local review output under `qa/homepage-concepts/generated-asset-review/folk-songs-rhymes-drum-icon-v01.png` | `public/design-assets/homepage-v2/folk-songs-rhymes-drum-icon-v01.png` | Create one square, transparent-ready felt-and-thread hand-drum appliqué matching the authored curriculum icon style; inspect identity, crop, edges, and transparency before copying the approved new file to the production destination. No existing asset is overwritten. | Delete only the new review and production files. |
| PAM-HOME-003 | Image generation grounded in `public/brand-kit-icon-sheets/curriculum-subject-icon-sheet.png` and the selected `qa/homepage-concepts/revised-option-2.png` | Local review output under `qa/homepage-concepts/generated-asset-review/folk-dancing-circle-icon-v01.png` | `public/design-assets/homepage-v2/folk-dancing-circle-icon-v01.png` | Create one square, transparent-ready felt appliqué depicting an inclusive child dance-circle motif without using or approximating a canonical cast member; inspect crop, edges, and transparency before copying the approved new file to the production destination. No existing asset is overwritten. | Delete only the new review and production files. |

## Gate result

- Reusable assets: visually cleared for the homepage roles above.
- Existing assets cover the emblem, hero scene, grade tabs, six subject notes, Folk Stories, Folk Instruments, curriculum portraits, materials, and fasteners.
- `PAM-HOME-001` remains paused and excluded from this homepage pass.
- The user explicitly approved `PAM-HOME-002` and `PAM-HOME-003` on 2026-08-11.
- Both approved lines were executed without overwriting an existing asset. The generated review PNGs were inspected for subject identity, crop, material treatment, RGBA output, transparent corners, and clean edge coverage before byte-identical copies were placed at the declared production destinations.
- `PAM-HOME-002` SHA-256: `bcb57c56ebbd81aabcf695143b3784434b07a6acc31fbfdbce2bb51fff8c0b64`.
- `PAM-HOME-003` SHA-256: `967605152b92293ff4d0c448fc0d44c1873a18d9e0fd5f345fb7cca6019451be`.
