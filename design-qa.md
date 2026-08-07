# Grade Working-Wall Design QA

## Comparison target

- Source visual truth: `public/design-explorations-v5/option-1-working-wall/01-grade-landing-magic-layers.png`
- Browser-rendered implementation: `qa/preschool-full-final.png`
- Combined comparison: `qa/grade-reference-vs-final.png`
- Route and state: `/preschool`, default Farm Day theme, first learning path selected
- Browser viewport: 1440 x 1000 CSS pixels at device scale factor 1
- Source pixels: 500 x 1007
- Full implementation pixels: 1440 x 1900
- Compared implementation board crop: 959 x 1524
- Density normalization: the source was resized to 757 x 1524 so both working-wall boards could be reviewed at the same rendered height.

## Full-view comparison evidence

- [x] The board uses the reference's portrait working-wall composition and approximately one-third-width green felt rail.
- [x] The hero keeps the compact welcome copy, felt primary action, paper secondary action, and purple Miss Maisy note.
- [x] Four alternating green and purple learning patches use the supplied felt activity artwork.
- [x] Felt edges use quiet inset construction lines; no literal dashed CSS stitching is present.
- [x] The existing warm cork texture is used for the planning board with three attached white paper notes.
- [x] The correct circular Miss Maisy rail badge is distinct from the larger teacher illustration.
- [x] The yellow reminder and secondary action now use the reference's softer paper tone.

The implementation is a responsive web interpretation, so canonical curriculum titles replace the generic mockup examples and the shared navy site header remains outside the comparison crop. These are intentional product differences rather than fidelity defects.

## Focused-region comparison evidence

- Hero: heading wrapping, quote-card scale, portrait crop, action hierarchy, felt texture, and inset borders were checked in the combined image.
- Learning cards: all four icons, corner button accents, vertical content order, alternating materials, card shadows, and selected treatment were checked at full resolution.
- Planning board: cork texture, fastener assets, paper-note contrast, editable note areas, and border weight were checked at full resolution.
- Rail: grade identity, navigation spacing, inset edge, and pinned reminder were checked at full resolution.

## Comparison history

1. Baseline screenshot used broad horizontal cards, a 21% rail, missing `/design-explorations-v4/` activity assets, the large teacher bust as the rail badge, heavy outer borders, and no visible cork section in a 1000px capture. Result: blocked.
2. Pass 1 restored supplied activity icons, the circular badge, subtle inset felt borders, and a compact cork board. It exposed a tablet hero overlap and incorrect horizontal card flow. Result: blocked.
3. Pass 2 repaired the card flow, reduced the teacher portrait overlap, narrowed the board to a portrait planning surface, and restored all primary interactions. It exposed overly orange paper accents and one note-label contrast violation. Result: blocked.
4. Final pass softened the yellow paper treatment, reduced portrait overlap, and increased note-label contrast. The combined source/implementation review found no remaining P0, P1, or P2 mismatch. Result: passed.

## Runtime, behavior, and accessibility

- [x] Next.js `get_compilation_issues`: no issues.
- [x] Next.js `get_errors`: no config or browser-session errors.
- [x] `npm run typecheck`: passed.
- [x] `npm run lint`: passed with six pre-existing warnings and no errors.
- [x] Build-this-lesson preview opens and closes with Escape.
- [x] Selected learning-path buttons expose `aria-pressed`.
- [x] Planning checkboxes and note fields have separate accessible labels.
- [x] Axe WCAG 2 A/AA: zero violations; textured backgrounds remain manual contrast checks because automated color extraction is incomplete.
- [x] Mobile capture: `qa/preschool-mobile-final.png`; 390 x 844 viewport reported 375px client width and 375px scroll width, with no horizontal overflow.

## Remaining P3 polish

- The approved mockup's display lettering is more hand-drawn than the locally bundled web font.
- The cream paper texture has slightly more horizontal fiber than the mockup's mottled paper.
- Additional character-specific grade copy can be tuned after curriculum content approval.

final result: passed

---

# Authored Material Texture Audit

## Captures

- Homepage: `qa/texture-authored-home-final.png`
- Kindergarten: `qa/texture-authored-kindergarten-final.png`
- Daycare: `qa/texture-audit-daycare-final.png`
- Grade 1: `qa/texture-audit-grade-one.png`
- Grade 2: `qa/texture-audit-grade-two.png`
- Topic: `qa/texture-audit-topic.png`
- Lesson: `qa/texture-audit-lesson.png`

## Material mapping

- [x] Generated global SVG grain was replaced by authored kraft and denim-felt image tiles.
- [x] Grade work surfaces use the authored light-kraft texture with a readability wash.
- [x] Grade-specific rails, teacher cards, pathway cards, and primary actions use character-palette felt tiles.
- [x] Note sheets, resource cards, topic cards, and lesson cards use the authored ivory cardboard stock.
- [x] Reminder notes and secondary actions use authored construction-paper tiles.
- [x] Planning, topic, and support boards use the seamless cork production tile.
- [x] Daycare's missing cork URL and opaque wrong-color felt assignments were repaired.
- [x] All audited local background-image URLs resolve to files in `public/`.

## Runtime

- [x] Desktop route captures completed without browser errors.
- [x] Kindergarten mobile reports zero horizontal overflow.
- [x] `npm run typecheck`: passed.
- [x] `npm run lint`: passed with six pre-existing warnings and no errors.

final result: passed

---

# Kindergarten / Mr Rusty Reference QA

## Comparison target

- Reference: `public/design-concepts/grade-family/relational-craft-kindergarten.png`
- Desktop capture: `qa/kindergarten-rusty-pass2.png`
- Mobile capture: `qa/kindergarten-rusty-mobile.png`
- Desktop viewport: 1440 x 1000 CSS pixels
- Mobile viewport: 390 x 844 CSS pixels

## Reference fidelity

- [x] The Kindergarten page follows the approved wide workroom composition and editorial hierarchy.
- [x] Mr Rusty replaces Old MacDonald as the lead teacher and uses his canonical blue `#2C6C9B` felt palette.
- [x] The rail badge, cream work surface, teacher-note card, pathway cards, and planning tray use supplied project assets.
- [x] The headline matches the approved Kindergarten reference while the supporting copy remains teacher-focused.
- [x] The two displayed pathways are canonical Kindergarten curriculum paths; no unverified pathways were invented to fill the four-card reference grid.
- [x] The shared site header remains intact as required by the current website design system.

## Runtime and behavior

- [x] Desktop and mobile captures report no horizontal overflow.
- [x] The teacher-notes control targets the functional planning section.
- [x] `npm run typecheck`: passed.
- [x] `npm run lint`: passed with six pre-existing warnings and no errors.

## Remaining P3 polish

- The source mockup shows four conceptual pathways while the verified Kindergarten dataset currently contains two.
- The shared site header adds vertical chrome outside the standalone reference board.

final result: passed

---

# Grade 2 Three-Template Family QA

## Comparison target

- Family reference: `public/design-explorations-v5/option-1-working-wall/00-option-1-reference.png`
- Grade-specific reference: `public/design-concepts/grade-family/relational-craft-grade-2.png`
- Grade landing capture: `qa/grade-two-family-pass1.png`
- Topic overview capture: `qa/grade-two-topic-family-pass3.png`
- Individual lesson capture: `qa/grade-two-lesson-family-pass3.png`
- Mobile landing capture: `qa/grade-two-mobile-pass1.png`
- Desktop viewport: 1440 x 1000 CSS pixels
- Mobile viewport: 390 x 844 CSS pixels

## Reference fidelity

- [x] All three pages use the approved left-rail, cream worktable, felt/cork/paper hierarchy.
- [x] Grade 2 uses the blue felt rail and correct Grade 2 badge across landing, topic, and lesson views.
- [x] Mr Maisy is the Grade 2 lead in the hero, rail identity, and teaching-team treatment.
- [x] The landing page keeps the wide editorial hero, four compact pathways, and planning-resource tray.
- [x] The topic page keeps the four-step cork sequence and supporting teacher/resource notes.
- [x] The lesson page keeps compact planning cards, selectable lesson flow, cork support notes, and a large printable notes field.
- [x] Grade-specific subject icons are selected from the supplied icon library instead of by card position.
- [x] Real lesson resource titles populate the materials card when the canonical MDX has no separate materials list.
- [x] Quiet inset felt edges remain in place; no glaring CSS stitch simulation was reintroduced.

## Runtime and behavior

- [x] Grade 2 landing paths now link to their topic/lesson routes and preserve `band=grade-two` context.
- [x] The shared Grade 1–2 topic resolves to a Grade 2 rail and Mr Maisy when entered from Grade 2.
- [x] Desktop topic and lesson captures report no horizontal overflow.
- [x] Mobile Grade 2 landing reports 390px client width and 390px scroll width.
- [x] Next.js `get_compilation_issues`: no issues.
- [x] Next.js `get_errors`: no config or browser-session errors.
- [x] `npm run typecheck`: passed.
- [x] `npm run lint`: passed with six pre-existing warnings and no errors.

## Remaining P3 polish

- Some long canonical lesson titles remain denser than the short placeholder titles in the reference.
- The shared site header and footer add vertical chrome outside the reference board.
- Button sizing and micro-spacing can receive a final family-wide polish after all grade content is connected.

final result: passed
