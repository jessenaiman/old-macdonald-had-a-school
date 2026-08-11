# Homepage viewport QA boards — 2026-08-11

These are **QA-only planning images**. They are not production UI, web assets, or a source for flattening
interactive controls. React/HTML remains responsible for semantic links, buttons, focus states, and responsive
layout.

## Source grammar used for review

- User-provided wide grade/subject reference: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-4e2e2c05-423a-45d4-a29e-5e50e0ab54d4.png`
- User-provided compact grade-strip reference: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-a8d06d31-4e21-4458-b573-01ab274fd23e.png`
- User-provided expanded subject-board reference: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-af2d0b65-93cd-473b-becb-1bf778d11943.png`
- User-provided folk-card reference: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-307b1e06-a00f-4a89-98da-d2045383516f.png`
- Material/hardware reference: `public/design-assets/homepage-reference-parts-v1/homepage-wood-and-board-parts-sheet-v01.png`, the authored `public/design-assets/web-material-library-v1/` material tiles, `public/design-assets/classroom-fasteners-v1/individual-icons/`, and `public/brand-kit-icon-sheets/individual-icons/`.

The images preserve the asset-system rule: visible materials read as repeated fabric, felt, paper, cork, and wood;
they are not plain-colour replacements. No characters are shown, so no cast/colour/topic association is asserted.

## Boards and planned responsive states

| File | Exact pixels | Section order | Grade state | Subject state | Folk-card state |
| --- | ---: | --- | --- | --- | --- |
| `desktop-1440x900-subjects-expanded.png` | 1440 × 900 | grades → roller → six subjects → folk rail | wide, five patches in one row | expanded, six paper tiles in one row | four cards in one row |
| `tablet-768x1024-compact-grades-subjects-expanded.png` | 768 × 1024 | compact grades → roller → subjects → folk rail | compact five-choice strip | expanded, 2 × 3 tiles | four cards in one row |
| `mobile-390x844-single-column-subjects-rolled-up.png` | 390 × 844 | grades → roller/subject summary → folk cards → continuation | five full-width touch-sized patches, stacked | **rolled up**: a single `Subjects (6)` summary control | full-width cards stacked in order |

The four folk titles and order are locked throughout: **Folk Songs & Rhymes**, **Folk Stories**,
**Folk Instruments**, **Folk Dancing**.

## Overflow and implementation safeguards

- Mobile is one content column with 16px-or-greater side gutters and 44px-or-greater interactive targets.
- The subject area uses a semantic disclosure control: it is closed on mobile and may expand into a single column;
  it must never compress into a multi-column mobile grid.
- Desktop shows all six subjects as one row. Tablet permits the planned 2 × 3 expansion. The grade chooser must not
  make labels smaller to force an unsafe fit; it changes presentation at the breakpoint instead.
- Text-bearing patches and papers need intrinsic/correctly-sized image containers, min-width: 0 on flex children,
  wrapping labels, and content-driven height. Do not use a fixed text height.
- Keep the page vertically scrollable on small screens; do not introduce horizontal scrolling or crop the final folk
  card. The mobile continuation cue represents normal document flow, not a carousel.
- Before production approval, compare an implementation capture at 1440 × 900, 768 × 1024, 390 × 844, and 320px
  wide against this plan; check no horizontal document overflow, overlap, clipped labels, and keyboard focus.

## Visual review result

The three boards were visually inspected after generation and after proportional resizing to their stated output
dimensions. All targeted titles are legible and contained in the boards. They establish the requested responsive
intent, but they do not substitute for same-viewport runtime screenshots of the actual page.
