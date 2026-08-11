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

# Responsive Bulletin-Board Homepage QA — 2026-08-11

## Comparison target

- Source visual truth: `C:/Users/jesse/AppData/Local/Temp/codex-clipboard-20992ca1-dc26-4040-bff0-b03fc038c400.png`
- Approved concept: `qa/homepage-concepts/simplified-bulletin-board-responsive-v2.png`
- Desktop implementation: `qa/homepage-runtime-final/desktop-1440x900-final.png`
- Tablet implementation: `qa/homepage-runtime-final/tablet-768x1024-final.png`
- Mobile implementation: `qa/homepage-runtime-final/mobile-390x844-compact-final.png`
- Narrow safety capture: `qa/homepage-runtime-final/mobile-320x800-final.png`
- Same-input comparison: `qa/homepage-runtime-final/comparison-reference-vs-runtime.png`
- Route and state: `/`, first carousel slide, default theme
- Browser viewports: 1440 x 900, 768 x 1024, 390 x 844, and 320 x 800 CSS pixels
- Device scale: browser default 1x CSS pixel density

## Full-view comparison evidence

- [x] The existing interactive classroom carousel remains the hero visual; no simulated screenshot or CSS substitute is used.
- [x] The navy shell, compact hero, cork bulletin board, six paper subject cards, notebook lesson strip, grade guide, utility links, and shared legal footer preserve the reference hierarchy.
- [x] Desktop renders six subject cards in one row; tablet renders a 2 x 3 board; mobile renders one compact card per row.
- [x] Every subject uses its authored stitched icon as the primary image.
- [x] Every subject card uses one different transparent learner image on a full-width authored construction-paper texture band.
- [x] Grade 1 and Grade 2 are separate cards. The grade guide follows `public/CAST_AND_ROLES.md`: Early Years uses Miss Puddles and Miss Maisy; Kindergarten uses Old MacDonald and Mr Rusty; Grade 1 uses Miss Hayley; Grade 2 uses Mr Maisy.
- [x] No plain-color substitute replaces the woven, cork, cardboard, construction-paper, or grade-felt surfaces.
- [x] The final 390px and 320px captures contain no visible overlapping text, clipped controls, or horizontal scroll.

## Focused-region evidence

- Hero: heading wraps cleanly at all four widths; the two mobile actions retain 44px minimum target height; carousel arrows retain 44px targets.
- Subjects: long Language and Health titles remain contained; subject icons stay primary while learner characters stay secondary; textured bands span the full card width.
- Responsive states: 1440 uses 6 columns, 768 uses 2 columns, and 390/320 use normal-flow single columns with no horizontal overflow.
- Grade guide: Grade 1 and Grade 2 are independently addressable links and no teacher identity is duplicated.

## Comparison history

1. Baseline implementation preserved the correct components but used an oversized hero; the subject board did not enter the first mobile viewport. Result: blocked.
2. Density pass reduced the desktop hero and card heights; desktop matched the reference hierarchy, while tablet and mobile still over-prioritized the carousel. Result: blocked.
3. Breakpoint pass introduced the compact tablet crop, compact horizontal subject cards, and full-width learner bands. All six subjects became visible in the tablet board and the mobile weekly section begins immediately after the board. Result: passed.
4. Final accessibility pass restored 44px hero-action and carousel-arrow targets, then rechecked 390px and 320px widths. Result: passed.

## Runtime and source checks

- [x] `http://localhost:3000/` returned the current homepage.
- [x] Browser document width at 390px: `390:390`.
- [x] Browser document width at 320px: `320:320`.
- [x] Six subject links are present.
- [x] Carousel next control changed the active image to `The farm-school class singing together`.
- [x] `npm.cmd run typecheck`: passed.
- [x] Focused ESLint on `HomePage.tsx`, `HomeCarousel.tsx`, and `WeeklyLessonList.tsx`: passed.
- [x] `git diff --check` on the homepage scope: passed.
- [ ] Repository-wide `npm.cmd run lint`: blocked by five unrelated pre-existing `no-explicit-any` errors in `lib/curriculum-lesson.ts` and `src/db/schema-sqlite.ts`, plus one unrelated warning in `components/curriculum/CurriculumLessonPage.tsx`.

## Remaining P3 differences

- The shared production header uses the site's current navigation labels rather than the generated mockup's illustrative labels.
- Grade and utility sections remain in normal document flow below the first mobile viewport instead of shrinking teacher-facing text below a readable size.
- The runtime uses the bundled project typography system; the generated reference's exact raster lettering is not reproduced as an image.

final result: passed

---

# Locked Asset and Printable Planning Correction — CHANGES REQUIRED

## Comparison targets

- Grade references: `public/design-concepts/grade-family/relational-craft-{preschool,kindergarten,grade-1,grade-2}.png`
- Exact planning sections: `public/design-concepts/grade-family/canva-parts/<grade>/<grade>-lesson-planning-resources.png`
- Homepage character facts and colors: `public/CAST_AND_ROLES.md`
- Material sources: `public/design-assets/web-material-library-v1/`

## Asset fidelity

- [x] Homepage grade selectors layer the canonical transparent staff portraits over the corresponding official felt-circle assets.
- [x] Miss Puddles, Mr Rusty, Miss Hayley, and Mr Sam use their exact authored patch colors; no CSS recoloring is used.
- [x] The clipped blank rectangle exports are excluded from the implementation.
- [x] Grade planning artwork is rendered at its authored 1955 x 450 aspect ratio.
- [ ] The current implementation incorrectly flattens the planning tray, its buttons, its labels, and its resource cards into one image.
- [ ] Invisible absolute-positioned hotspots are not an acceptable replacement for authored button, link, typography, and layout components.
- [ ] Rebuild the tray from separate Canva/Figma/project assets. Raster artwork is permitted only for the physical paper/felt/fastener pieces that are genuinely images.

## Runtime and behavior

- [x] Grade 1 planning artwork loaded successfully, but the hotspot implementation is rejected as an architectural shortcut.
- [x] Grade landing pages contain no textarea or checkbox controls in the printable planning section.
- [x] Homepage selector assets loaded with no missing images.
- [x] Next.js `get_compilation_issues`: no issues.
- [x] Next.js browser session reported no console warnings or errors before the dependency-server restart.
- [x] TypeScript: passed.
- [x] ESLint on `CurriculumTemplates.tsx`: passed.

## Remaining review item

- [ ] Replace the composite-image/hotspot implementation before requesting another visual review.
- [ ] A fresh combined screenshot comparison is still required after componentization because the in-app browser screenshot backend timed out during this pass.

final result: CHANGES REQUIRED — runtime passed, component architecture rejected

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
