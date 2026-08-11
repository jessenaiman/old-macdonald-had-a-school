# Asset Library Governance

Status: Phase 1 inventory complete; all asset mutations paused.

This document records the verified asset locations, naming rules, exclusions, duplicate findings,
and proposed future actions for the Old MacDonald Had a School design library. It does not authorize
any action in the proposed-action manifest.

## Mandatory approval gate

No person or agent may move, rename, delete, overwrite, export, upload, archive, reorganize, or edit
an asset until the parent agent records explicit approval for the exact manifest line ID in this
document. Approval of this document, a category, a folder, or a general cleanup objective is not
approval to perform a manifest line.

Before executing an approved line, the acting agent must:

1. Quote the exact manifest line ID, source, and destination to the parent agent.
2. Confirm that the source still exists and the destination does not already contain a conflicting file.
3. Check project references to the source path when the action affects a local file.
4. Wait for explicit approval naming that exact line ID.
5. Perform only that approved line and report the result and reversal procedure.

If the source, destination, visual content, dimensions, or proposed filename differs from the manifest,
the approval is invalid and a revised manifest line must be reviewed first.

## Locked source and usage rules

- Canva is the source for authored textures, patches, icons, fasteners, and separated visual pieces.
- Figma defines typography, spacing, hierarchy, responsive layout, and component boundaries.
- React and HTML provide semantic production implementation.
- `public/CAST_AND_ROLES.md` locks character names, roles, grade ownership, and exact colors.
- Locked assets cannot be substituted or recolored.
- Reference sheets, atlases, page composites, and page-section crops cannot become flattened UI
  components.
- Files marked `DO NOT USE` cannot enter production.
- Files marked for review cannot enter production until visually cleared.

## Verified local location map

| Location | Canonical purpose | Verified inventory note |
| --- | --- | --- |
| `docs/DESIGN_ASSET_MASTER_LIST.md` | Human-readable asset index | Describes 350 raster files |
| `docs/design-asset-master-list.csv` | Exhaustive development lookup | 350 records with dimensions, alpha bounds, status, and SHA-256 |
| `docs/design-asset-master-list.json` | Machine-readable asset lookup | 350 asset records and duplicate groups |
| `public/CAST_AND_ROLES.md` | Locked identities, roles, grades, and colors | Canonical source of truth |
| `public/staff_and_students/` | Canonical transparent character portraits | 18 indexed assets |
| `public/brand-kit-icon-sheets/individual-icons/` | Production grade and subject icons | 15 usable individuals |
| `public/design-assets/classroom-fasteners-v1/individual-icons/` | Production fasteners and attachment cues | 16 individuals |
| `public/design-assets/blank-felt-patches-v1/` | Blank patch sheets and individuals | 52 assets; 16 rectangle exports rejected |
| `public/design-assets/web-material-library-v1/` | Repeatable material textures | 73 assets |
| `public/design-concepts/` | Page and grade-family visual references | Reference only |
| `public/design-explorations-v5/` | Working-wall and template references | Reference only |
| `public/design-concepts/grade-family/canva-parts/` | Separated page-section references | Reference only; not production components |
| `figma-copy-design/` | Exported Figma prototype | Reference only; not production code |

For a canonical colored character badge, layer the matching
`public/staff_and_students/*-transparent-circle.png` portrait over the matching circle patch from
`public/design-assets/blank-felt-patches-v1/individual-patches/`. Do not recolor either layer.

## Verified Canva location map

Connected root folder: **Old MacDonald Farm School - Relational Craft** (`FAHRj95eIY8`).

| Folder | Canva ID | Contents | Count | Local reconciliation |
| --- | --- | --- | ---: | --- |
| `01 Asset Sheets` | `FAHRjxEG47E` | Material, cast, grade, subject, atlas, and reference sheets | 9 | Corresponding local sheets found |
| `02 Classroom Fasteners` | `FAHRj8p4S4Y` | Transparent sheet plus individual fasteners | 17 | Matches local family count |
| `03 Grade Page Parts` | `FAHRj-YuiCY` | Five sections for each of five grade pages | 25 | Matches local family count |
| `04 Blank Felt Patches` | `FAHRkG84KIQ` | 48 individuals plus four contact sheets | 52 | Matches local family count; local rectangles are rejected |
| `05 Web Material Textures` | `FAHRkMIVglU` | Contact sheets and material subfolders | 73 | Matches local family count |
| `00 Contact Sheets` | `FAHRkMwLFk8` | Cardboard, paper, felt, woven, and thread sheets | 5 | Reference sheets only |
| `01 Cardboard` | `FAHRkKzckrI` | Neutral seamless cardboard tiles | 4 | Corresponding local tiles found |
| `02 Construction Paper` | `FAHRkOszArA` | Character-indexed construction-paper tiles | 16 | Corresponding local tiles found |
| `03 Felt` | `FAHRkNOA238` | Character-indexed felt tiles | 16 | Corresponding local tiles found |
| `04 Woven Fabric` | `FAHRkB1Z9Lc` | Character-indexed woven-fabric tiles | 16 | Corresponding local tiles found |
| `05 Thread Overlays` | `FAHRkFzMLg0` | Character-indexed thread-overlay tiles | 16 | Corresponding local tiles found |

The verified family counts establish that no complete texture, fastener, grade-part, or blank-patch
family is obviously absent locally. Canva does not automatically expose hashes matching local SHA-256
records, so name/count correspondence is not proof that every Canva item is byte-identical to its
local counterpart.

## Figma and exported-reference map

- Approved composition references are stored under `public/design-concepts/` and
  `public/design-explorations-v5/`.
- Canva-separated page sections are under `public/design-concepts/grade-family/canva-parts/`.
- `figma-copy-design/` is a prototype export. It may contain emoji, generated CSS treatments, and stale
  identity assignments and must not be treated as a canonical asset source.
- No live Figma file key or node-specific URL is currently recorded in the repository. Live Figma
  reconciliation remains pending until one is supplied.

## Canonical naming taxonomy

Use lowercase kebab-case and preserve authored identity rather than encoding a substituted color.

| Family | Pattern | Example |
| --- | --- | --- |
| Texture | `{material}-{identity-or-neutral}-{variant}-tile-vNN.png` | `felt-miss-hayley-primary-tile-v01.png` |
| Patch | `{cast-index}-{identity}-{shape}-vNN.png` | `04-miss-hayley-circle-v01.png` |
| Curriculum icon | `{grade-or-subject}-{concept}-icon-vNN.png` | `subject-music-icon-v01.png` |
| Fastener | `{index}-{fastener}-{variant}-vNN.png` | `03-paperclip-double-loop-v01.png` |
| Page reference | `{grade}-{template}-{section}-reference-vNN.png` | `grade-1-landing-hero-reference-v01.png` |
| Contact sheet | `{family}-contact-sheet-vNN.png` | `felt-textures-contact-sheet-v01.png` |
| Atlas | `{family}-atlas-vNN.png` | `curriculum-subject-icons-atlas-v01.png` |

Store lifecycle status such as usable, review, rejected, or archived in the inventory rather than in
the filename. Apply this taxonomy to new assets first; existing canonical paths require separate,
line-specific migration approval.

## Duplicate and derivative groups

### Exact duplicates

1. Keeper: `public/brand-kit-icon-sheets/cast-icon-sheet.png`
   Duplicate: `public/patches/simple/farm_school_character_face_patch_sheet_primary_secondary_16.png`
2. Keeper: `public/texture-assets/stitch-corner-bottom-left.png`
   Duplicate: `public/texture-assets/stitch-corner-bottom-left-alt.png`

The keepers are recommendations only. Neither duplicate may be moved or archived without approval of
its exact manifest line and a current reference scan.

### Expected derivatives, not disposable duplicates

- Contact sheets and atlases are review/index artifacts; individuals are production candidates.
- Grade-page section crops are composition references, not reusable interactive components.
- Early-years face patches and Canva animal extractions are not canonical replacements for portraits
  in `public/staff_and_students/`.
- Canonical grade badges should be composed from separate portrait and color-patch layers.

## Do-not-use and review rules

### DO NOT USE

All 16 files matching:

`public/design-assets/blank-felt-patches-v1/individual-patches/*-rectangle.png`

These local exports are known to be clipped at the left and right canvas edges. They remain preserved
for provenance but cannot be used in production.

### Review for extraction damage

The 32 master-list records marked `REVIEW: EXTRACTION ARTIFACTS` under these locations require visual
clearance before use:

- `public/icons/canva-animal-icons/`
- `public/icons/early-years/face-busts/`
- `public/icons/early-years/face-patches/`

Potential damage includes chroma-key streaks, cut-off artwork, and content touching one or more canvas
edges.

### Review for possible clipping

- `public/texture-assets/material-kit-v2/badge-red-scalloped.png`
- `public/texture-assets/material-kit-v2/patch-label.png`
- `public/texture-assets/material-kit-v2/patch-tall.png`
- `public/texture-assets/material-kit-v2/patch-wide.png`

## Unidentified Canva designs

Ten top-level Canva designs in `FAHRj95eIY8` currently have no verified descriptive titles exposed by
the connector. They must not be renamed, exported, deleted, or treated as canonical until visually
identified:

- `DAHRj-hgh5k`
- `DAHRj2hk41Y`
- `DAHRj4Lt0Ss`
- `DAHRj4_uQyU`
- `DAHRj6z3aCk`
- `DAHRjwQjF9Q`
- `DAHRkBjlEYI`
- `DAHRlCRD6B8`
- `DAHRlCeB8qU`
- `DAHRlN94kjE`

The root also contains the image **Old MacDonald UI - Option 1 Working Wall Reference**
(`MAHRlFeyeRc`). It is a visual reference, not a component asset.

## Proposed-action manifest

Every line below is unapproved and paused. Proposed replacement exports use a new review directory and
must not overwrite the rejected originals. `REVERSIBLE` means the proposed action preserves the source
and can be undone; it does not waive the approval gate.

| ID | Action | Source | Proposed destination | Reason | Reversibility | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| PAM-LEATHER-001 | Copy generated source sheet | `C:/Users/jesse/.codex/generated_images/019ff0a1-89b3-7c90-849e-c8dbff9cb2be/exec-c50218f7-c324-4616-9497-993e45a312ec.png` (1536x1024) | `public/design-assets/web-material-library-v1/leather/leather-staff-colors-sheet-v01.png` | Add the explicitly requested original eight-colour leather material family without overwriting an existing asset | Generated source retained; new file removable | APPROVED by user request 2026-08-11 |
| PAM-LEATHER-002 | Derive repeat tiles by fixed center crops and mirrored 2x2 edge composition | `public/design-assets/web-material-library-v1/leather/leather-staff-colors-sheet-v01.png` | `public/design-assets/web-material-library-v1/leather/individual-tiles/01-old-macdonald-leather-tile-v01.png` through `08-miss-maisy-leather-tile-v01.png` (eight 512x512 PNGs) | Produce deterministic repeating production tiles in the canonical staff order and colours | Source sheet retained; derived family directory removable | APPROVED by user request 2026-08-11 |
| PAM-LEATHER-003 | Upload asset family | PAM-LEATHER-001 sheet and PAM-LEATHER-002 eight tiles | Figma file `eWvVPyees5lDxp7PShSOnu`, existing `Backgrounds` page | Make the separated repeating patterns available in the supplied OMHS design-assets file | Local source retained; uploaded Figma nodes individually removable | APPROVED by user request 2026-08-11 |
| PAM-001 | Export | Canva `MAHRkBcB4gQ` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/01-old-macdonald-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-002 | Export | Canva `MAHRkGGTFXU` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/02-miss-puddles-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-003 | Export | Canva `MAHRkH_HUDo` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/03-mr-rusty-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-004 | Export | Canva `MAHRkPec27o` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/04-miss-hayley-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-005 | Export | Canva `MAHRkOBYhY0` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/05-mr-sam-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-006 | Export | Canva `MAHRkPCC-LI` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/06-mr-maisy-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-007 | Export | Canva `MAHRkAWLdu8` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/07-mr-puddles-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-008 | Export | Canva `MAHRkEe59Og` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/08-miss-maisy-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-009 | Export | Canva `MAHRkOE0-xI` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/09-hopper-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-010 | Export | Canva `MAHRkAu6JSg` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/10-whiskers-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-011 | Export | Canva `MAHRkBJAqzk` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/11-scout-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-012 | Export | Canva `MAHRkOoBuBg` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/12-penny-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-013 | Export | Canva `MAHRkGbFOLA` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/13-maisy-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-014 | Export | Canva `MAHRkAE_S_A` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/14-puddles-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-015 | Export | Canva `MAHRkCP3x4w` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/15-sam-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-016 | Export | Canva `MAHRkP_MrMU` | `public/design-assets/blank-felt-patches-v2-review/individual-patches/16-rusty-rectangle.png` | Produce an unclipped review candidate | Source retained; new file removable | PAUSED |
| PAM-017 | Move | `public/patches/simple/farm_school_character_face_patch_sheet_primary_secondary_16.png` | `public/reference-archive/exact-duplicates/farm_school_character_face_patch_sheet_primary_secondary_16.png` | Separate exact duplicate from canonical sheet | Move can be reversed | PAUSED |
| PAM-018 | Move | `public/texture-assets/stitch-corner-bottom-left-alt.png` | `public/reference-archive/exact-duplicates/stitch-corner-bottom-left-alt.png` | Separate exact duplicate from canonical corner | Move can be reversed | PAUSED |

Before PAM-001 through PAM-016 can be approved, the acting agent must verify that each Canva source is
not itself clipped and that its identity and color match `public/CAST_AND_ROLES.md`. Before PAM-017 or
PAM-018 can be approved, the acting agent must perform a current code and documentation reference scan.

## Current authorization state

- Documentation creation: approved and completed by the parent agent.
- Asset mutation: not approved.
- Canva mutation: not approved.
- Figma mutation: not approved.
- Manifest execution: no line approved.

**PAUSED FOR PARENT APPROVAL**
