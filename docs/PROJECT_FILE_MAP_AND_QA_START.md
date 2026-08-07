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
