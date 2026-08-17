# Old MacDonald Had a School — draft icon pack

Non-production visual exploration. Nothing in this folder is linked into the application. The supplied staff/student art was used only as a material-and-palette reference; no canonical character was redrawn, renamed, recoloured, or modified.

## Strongest direction

Use the navy felt schoolhouse/open-book mark as the direction for a future favicon. Its barn-school silhouette, gold book doorway, and red apple remain recognizable at 16 px without impersonating a cast member. Before production, simplify the stitch count at 16/32 px and redraw the approved geometry as a clean vector master.

## Inventory

- `pack-preview.jpg` — review board for the full draft pack.
- `app-mark-512.png`, `favicon-64.png`, `favicon-32.png`, `favicon-16.png` — transparent app-mark exports.
- `topic-language.png`, `topic-math.png`, `topic-music-movement.png`, `topic-routines-regulation.png` — transparent 512 × 512 topic icons.
- `sticker-backpack.png`, `sticker-apple.png`, `sticker-boots.png`, `sticker-handbell.png` — transparent 512 × 512 classroom stickers.
- `app-mark-master.png`, `topic-icons-master.png`, `classroom-stickers-master.png` — transparent generated masters.
- `*-source-chroma.png` — untouched generated sources retained for provenance and reprocessing.

## Prompt record

Mode: built-in image generation, one call per distinct asset family, followed by the installed chroma-key-removal helper and deterministic cropping/downscaling.

Style-reference inputs:

- `public/staff_and_students/old-macdonald-transparent.png`
- `public/staff_and_students/miss-hayley-transparent-circle.webp`
- `public/staff_and_students/rusty-transparent-circle.webp`
- `public/staff_and_students/maisy-transparent-circle.webp`

Shared constraints: original symbols only; use tactile felt, denim/navy, mustard, barn red, cream thread, and warm brown from the references; real sewn-thread cues rather than a graphic dashed border; no character likeness, people, animals, faces, mascots, words, numerals, watermark, cast shadow, or green inside the artwork; isolate every asset on flat `#00ff00` for background removal.

1. App mark: “One extremely simple navy felt barn/school silhouette, a warm golden open-book doorway, and one tiny red felt apple accent; square, symmetrical, chunky, vector-friendly, readable at 16 px and 32 px.”
2. Topic icons: “Exact 2 × 2 grid: language = open cream book plus red speech bubble; math = mustard/navy abacus with five beads; music/movement = red tambourine plus two navy motion ribbons; routines/regulation = gold sunrise behind a small navy clock without numerals.”
3. Classroom stickers: “Exact 2 × 2 grid: navy school backpack with mustard pocket; red apple with cream stitched highlight; brown rain boots with navy cuffs; brass-gold handbell with a tiny barn-red ribbon.”

## Production and accessibility notes

- These are raster concepts, not approved production assets. Preserve the original reference images separately and never present these symbols as staff/student characters.
- Redraw an approved direction as SVG with a 24 px optical variant and simplified 16/32 px favicon variants; keep a transparent PNG fallback at 2× display size.
- Do not rely on colour alone to distinguish topics. Pair each topic icon with its visible label.
- Treat icons beside visible text as decorative (`aria-hidden="true"`). Give standalone icon controls a concise accessible name such as “Browse math resources.”
- Preserve at least 3:1 contrast for meaningful icon shapes against their final background; test both light construction-paper and navy surfaces.
- Sticker/emoji images need adjacent text or meaningful alt text when they convey content; use empty alt text when they are purely decorative.
