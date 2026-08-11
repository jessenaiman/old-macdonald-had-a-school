# Homepage reference asset inventory

Date: 2026-08-11

Scope: the three user-supplied homepage references from this task. This inventory supplements
`docs/DESIGN_ASSET_MASTER_LIST.md`; it does not replace that exhaustive per-file index.

## Decision rules

- Production surfaces use authored repeating texture tiles from `public/design-assets/web-material-library-v1/`.
- Text, links, headings, and controls remain semantic HTML. Reference screenshots are never flattened into UI.
- `public/CAST_AND_ROLES.md` controls character identity, teaching association, grade ownership, and exact colour.
- Existing transparent icons and fasteners are reused without recolouring.
- The 16 clipped blank rectangle exports remain `DO NOT USE`.

## Reference reconciliation

| Visible element | Local source | Result |
| --- | --- | --- |
| Warm kraft, ivory paper, construction paper, woven cloth, felt | `public/design-assets/web-material-library-v1/` | Present as repeatable production tiles. |
| Cork planning surface | `public/design-assets/cork-board-kit-v1/seamless-cork-tile.png` | Present. |
| Push pins, paperclips, masking tape, brass split pins, buttons, needle/thread | `public/design-assets/classroom-fasteners-v1/individual-icons/` | Present. |
| Six curriculum subject symbols | `public/brand-kit-icon-sheets/individual-icons/subject-*.png` | Present, though reference-specific book/abacus/sprout/note/palette/shoe drawings are not exact individual exports. Use the canonical subject icons unless a new governed icon family is approved. |
| Folk Stories banjo and Folk Instruments fiddle | Existing curriculum/scene imagery can represent the topics | Present enough for semantic use; do not claim pixel identity with the references. |
| Folk Songs drum and Folk Dancing circle | `public/design-assets/homepage-v2/folk-*-v01.png` | Present as newly generated review assets; approval provenance is recorded in `qa/homepage-asset-audit.md`. |
| Character portraits and colour fields | `public/staff_and_students/` plus matching canonical material tiles/patches | Present. Must follow `public/CAST_AND_ROLES.md`. |
| Horizontal wooden roller with turned end caps | None | Missing separated production asset. |
| Matching short wooden side rail/end-cap pieces | None | Missing separated production asset. |
| Dark green classroom chalkboard surface with worn edge character | None | Missing as an authored repeatable texture; do not substitute a flat green fill. |
| Chalkboard wooden frame/corner joinery | None | Missing separated production asset. |
| Blank torn/deckled paper note silhouettes used in Image 2 | None | Missing as reusable transparent note shapes. Texture tiles alone do not reproduce the authored edges. |
| Blank stitched rounded felt grade/topic tabs with safe unclipped edges and brad positions | Existing rectangle exports are clipped and prohibited | Missing usable separated production family. |
| Cream stitched carousel tray and circular inset arrow buttons | No exact separated raster family | Missing. Controls must still be real buttons layered with these assets. |
| Hanging cord/tassel and loose red/blue teaching cords | No exact separated assets | Missing. Decorative only; omit until governed assets exist. |
| Washi corner pieces in the exact orange-dot and yellow-grid patterns | General tape assets exist, exact patterns do not | Missing exact variants; general authored masking/washi tape may be used only when exact pattern identity is not claimed. |
| Hand-drawn botanical/music divider strip from Image 1 | None | Missing. Decorative only; omit until governed. |

## Homepage grade-selection staff map

Use this mapping for grade-selection patches and associated homepage entry points. Use the separate transparent
face assets in `public/icons/staff/` over the felt patch surface; do not use a precomposed circle background or
recolour the faces.

| Grade | Staff lead | Locked colour | Portrait | Felt tile |
| --- | --- | --- | --- | --- |
| Daycare | Miss Puddles | Yellow `#E8A227` | `miss-puddles.png` | `felt-02-miss-puddles-tile.png` |
| Pre-School | Miss Maisy | Sage green `#55705A` | `miss-maisy.png` | `felt-08-miss-maisy-tile.png` |
| Kindergarten | Old MacDonald | Brown `#8B5E34` | `old-mac.png` | `felt-01-old-macdonald-tile.png` |
| Grade 1 | Mr Rusty | Blue `#2C6C9B` | `mr-rusty.png` | `felt-03-mr-rusty-tile.png` |
| Grade 2 | Mr Maisy | Red `#B5272C` | `mr-maisy.png` | `felt-06-mr-maisy-tile.png` |

Miss Hayley remains an additional Grade 1/2 drama teacher according to `CAST_AND_ROLES.md`; she is not the
primary grade-entry patch lead.

## Proposed asset-sheet mutation manifest

These are additive, versioned assets. Nothing existing is overwritten. Under
`docs/ASSET_LIBRARY_GOVERNANCE.md`, generation remains paused until the user explicitly approves the line IDs.

| ID | Source references | Local destination | Exact operation | Reversal |
| --- | --- | --- | --- | --- |
| PAM-HOME-004 | Images 1-3, structural pieces only | `public/design-assets/homepage-reference-parts-v1/homepage-wood-and-board-parts-sheet-v01.png` | Generate one high-resolution, crop-ready sheet containing a long horizontal turned wooden roller, paired short end rails, four frame/corner joinery pieces, and a seamless dark-green chalkboard swatch. No text, labels, characters, or UI composite. | Delete only this new file. |
| PAM-HOME-005 | Image 2 paper-note silhouettes | `public/design-assets/homepage-reference-parts-v1/homepage-paper-note-parts-sheet-v01.png` | Generate one high-resolution, crop-ready sheet containing six blank, fully separated note silhouettes: ivory ruled, warm kraft, pale sage deckled, pink construction paper, pale blue construction paper, and squared cream paper. Include natural torn/deckled edges only; no text, icons, pins, clips, tape, shadows connecting pieces, or background texture outside each piece. | Delete only this new file. |
| PAM-HOME-006 | Image 3 grade and carousel controls; canonical colours from `CAST_AND_ROLES.md` | `public/design-assets/homepage-reference-parts-v1/homepage-felt-control-parts-sheet-v01.png` | Generate one high-resolution, crop-ready sheet of blank stitched felt control skins: five grade tabs, four wide topic tabs, one cream carousel tray, and two circular inset arrow skins. Use repeating textile detail and safe unclipped padding. No words, icons, or characters. | Delete only this new file. |
| PAM-HOME-007 | Images 1-2 decorative classroom pieces | `public/design-assets/homepage-reference-parts-v1/homepage-classroom-ornaments-sheet-v01.png` | Generate one high-resolution, crop-ready sheet containing hanging cord/tassel, loose red and blue cords, orange-dot and yellow-grid tape corners, and one botanical/music divider strip. All pieces separated; no text, characters, or composite layout. | Delete only this new file. |

## Execution status

- `PAM-HOME-004` completed on 2026-08-11: `homepage-wood-and-board-parts-sheet-v01.png` is a 1989 x 791 RGBA sheet with transparent corners. The top roller is used as a CSS-clipped real-image sprite in the homepage.
- `PAM-HOME-005`, `PAM-HOME-006`, and `PAM-HOME-007` failed visual review: built-in chroma-key removal damaged cyan-adjacent blue and teal parts. The failed candidates and temporary source copies were removed. A native-transparency fallback requires explicit user approval before these lines can be retried.

## Homepage implementation gate

The current homepage may use existing repeatable materials, icons, fasteners, scenes, and semantic HTML now.
It must not simulate the missing wooden roller, frame, chalkboard material, torn-paper silhouettes, or stitched
control skins with gradients, flat colours, CSS drawings, emoji, or generic icons. Those details remain omitted
until the corresponding approved asset sheet is generated, reviewed, separated if needed, and indexed.
