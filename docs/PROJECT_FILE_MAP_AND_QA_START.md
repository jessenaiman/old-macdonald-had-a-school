# Project file map and QA starting point

This is the read-only orientation checkpoint before implementation resumes.

## Production application

| Concern | Location | Notes |
| --- | --- | --- |
| Next.js routes | `app/` | Production surface. Routes include home, daycare, preschool, kindergarten, Grade 1/2 bands, topics, lessons, cast, and about. |
| Shared site chrome | `components/SiteShell.tsx`, `components/ThemeSwitcher.tsx` | Header, navigation, footer, responsive menu, and theme control. |
| Homepage | `components/home/HomePage.tsx`, `app/globals.css` | Grade selectors, hero, subject browser, and featured resource. |
| Grade/topic/lesson family | `components/builder/CurriculumTemplates.tsx`, `components/builder/CurriculumTemplates.module.css` | Current componentized workroom templates. These files already contain uncommitted user/agent work. |
| Daycare planner | `components/builder/DaycarePlanningBoard.tsx`, `components/builder/DaycarePlanningBoard.module.css` | Separate planning-board implementation with print rules. |
| Content/data | `content/`, `lib/mdx-content.ts`, `lib/early-years.ts`, `lib/content/lessons.ts` | Canonical lesson and early-years records. |
| Cast identity | `public/CAST_AND_ROLES.md`, `lib/cast.ts` | Locked names, roles, grade ownership, and colours. |
| Tests | `tests/e2e/`, `tests/visual/`, `tests/rendered-html.test.mjs` | Runtime, screenshot, and rendered-HTML verification. |

## Visual sources and assets

| Source | Location | Production disposition |
| --- | --- | --- |
| Locked page references | `public/design-concepts/`, `public/design-explorations-v5/` | Visual truth for composition and material language. |
| Separated Canva parts | `public/design-concepts/grade-family/canva-parts/` | Reference pieces; do not flatten controls into screenshots. |
| Repeatable materials | `public/design-assets/web-material-library-v1/` | Production textures. |
| Blank patches | `public/design-assets/blank-felt-patches-v1/` | Circle and square sources are usable; 16 rectangle exports are excluded as clipped. |
| Classroom fasteners | `public/design-assets/classroom-fasteners-v1/` | Production physical attachment cues. |
| Curriculum icons | `public/brand-kit-icon-sheets/individual-icons/` | Production grade and subject icons; tightly trimmed but visually intact. |
| Canonical character art | `public/staff_and_students/` | Preferred character layer for coloured patch badges. |
| Theme art | `public/design-assets/theme-toggle-patches-v1/` | Authored sun/moon patches exist but are not used by the current switcher. |
| Figma export | `figma-copy-design/` | Layout/reference prototype only. It contains stale role data, emoji, CSS texture/stitch effects, and non-canonical approximations. |
| QA evidence | `qa/`, `docs/reviews/`, `design-qa.md` | Prior comparisons; new approval still requires fresh matched screenshots. |

The exhaustive per-file asset handoff is `docs/DESIGN_ASSET_MASTER_LIST.md`; CSV and JSON versions sit beside it.

## Verified breaking or high-risk mismatches

- **Preschool discovery:** the homepage selector and desktop/mobile “Early Years” links open Daycare, making Preschool secondary despite its own route.
- **Locked identity drift:** Grade 2 topic and lesson templates use Mr Maisy and Mr Puddles identity layers even though the current cast file assigns Grade 2 to Mr Sam and teal `#1F6B6B`.
- **Preschool source conflict:** the current cast file assigns Mr Maisy to Preschool; existing design/code uses Miss Maisy. Treat the cast file as current repository truth and mark the older reference stale unless the user updates the locked source.
- **Printable-note mismatch:** several grade/daycare/lesson “paper” surfaces are live textareas and checkboxes. The user’s locked intent is printable stationery for handwritten notes, except where a genuinely interactive planning control is explicitly required.
- **Theme icon mismatch:** authored felt sun/moon assets exist, while `ThemeSwitcher.tsx` uses generic React outline icons and adds a third palette theme.
- **Homepage icon mismatch:** subject headers use generic React outline icons even though authored curriculum icons are present.
- **Action semantics:** “Save to week” currently jumps to the top of the page; it does not save. “Edit goal” is only navigation. Labels must match behavior.
- **Prototype contamination risk:** `figma-copy-design/` must not be copied wholesale; its emoji, synthetic stitches, role mappings, and colour values conflict with locked project sources.

## Working-tree safety

- `components/builder/CurriculumTemplates.tsx` and its module CSS are already modified; preserve those changes.
- The old root `texture-assets/` files appear deleted while `public/texture-assets/` is untracked. Treat this as an in-progress relocation, not permission to restore or delete either side.
- The master-inventory files and audit script are newly created and uncommitted.

## Implementation order after review

1. Resolve functional/semantic P0s: Preschool navigation, misleading actions, print-versus-input behavior, and canonical teacher identity.
2. Replace non-canonical icons with the indexed authored assets.
3. Run fresh desktop, mobile, and print comparisons against matched references.
4. Fix typography, spacing, cropping, and texture/border details without changing locked composition or assets.

## Consolidated agent reports — 2026-08-07

Both review agents completed and were shut down. Their reporting is consolidated here so development agents do not need the original agent threads.

### Visual and responsive QA

- [ ] **P1 — Mobile topic clipping:** `/topics/addition-subtraction-word-problems?band=grade-one` clips its title and summary at the right edge. The workroom hides overflow while the heading keeps a large minimum size. Review `CurriculumTemplates.module.css` around the workroom, heading, and mobile rules.
- [ ] **P1 — Grade resource-card overlap:** `/band/grade-one` has overlapping card titles, portraits, and subject icons on desktop, becoming substantially worse on mobile. Review the resource-card markup in `CurriculumTemplates.tsx` and its card layout rules.
- [ ] **P1 — Homepage composition mismatch:** `/` remains a conventional header, oversized grade strip, blue hero, and subject grid rather than the locked cream planning surface, left rail, felt pathways, and classroom-planning panel in `public/design-concepts/relational-craft-homepage-concept.png`.
- [ ] **P2 — Typography conflict:** Grade 1 forces Georgia with `!important`, overriding the intended display face, while the homepage uses Aptos. Establish the approved Figma typography tokens before visual polishing.
- [ ] **P2 — Printable-notepad mismatch:** the individual lesson uses a live textarea where `public/design-explorations-v5/option-1-working-wall/03-individual-lesson-magic-layers.png` shows printable physical stationery. The reference's print, download, and add-to-plan actions are also absent.
- [ ] **P2 — Mobile header accessibility:** opening the mobile menu truncates the brand; theme and menu controls render at about 34 px rather than a robust touch target.
- [ ] **P3 — Seam fidelity:** homepage felt-button seams are CSS-generated marks rather than the locked authored patch/thread assets.
- [x] The main cardboard, felt, and cork textures are present and referenced from `public/design-assets`; missing textures are not the primary defect.
- [x] No route crash or unusable primary navigation was observed in the captured homepage, Grade 1, topic, and individual-lesson flow.

The visual agent inspected an effective 1600x1066 desktop viewport and 433x937 mobile viewport. Full-page capture, print preview, screen-reader behavior, computed contrast, and exhaustive intrinsic image-edge inspection remain unverified.

### Early-years teaching and planning QA

- [ ] **P0 — Preschool destination:** restore Preschool as a first-class destination. The combined homepage selector and the shared Early Years navigation currently open Daycare despite a separate Preschool route.
- [ ] **P0 — Inclusive participation:** render the teaching information already present in the early-years records: step sequence, seated/standing/gesture/watch choices, and observable notice prompts. Watching, gesturing, humming, adapted movement, and full participation must all be represented as valid ways to join.
- [ ] **P0 — Honest resource actions:** early-years pathways currently lead to generic topic results, some planning tools are labels rather than controls, Save to week is only an anchor, and Build this lesson can open an image preview. Labels must describe their real behavior, and lesson rendering must expose its starting resource, printables, and extensions.
- [ ] **P1 — Repetition and ritual:** make the stable hello–activity–goodbye structure and weekly repeated repertoire visible; add a small Songs we are repeating this week planning area.
- [ ] **P1 — Caregiver transfer and child agency:** replace the Family Connection link to About with a concise adult explanation and take-home action. Let children invent a sound, movement, name substitution, or short sung response.
- [ ] **P1 — Unified printable planning:** provide one predictable Print teacher plan action and preserve goals, sequence, adaptations, resources, observation prompts, and generous handwriting space.
- [x] Preserve the teacher-first planning-board concept, movement-first lessons, accessible participation alternatives, concise Today → Curriculum → Planner → Resources hierarchy, and calm invitational prompts.

### Immediate development gate

Fix mobile topic clipping and grade resource-card overlap before visual polish. Then resolve Preschool routing, canonical cast identity, print-versus-input semantics, and misleading actions before applying authored icons or final typography.
