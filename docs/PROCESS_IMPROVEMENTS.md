# Process Improvement Log

This log keeps the team honest about speed, clarity, and unnecessary ceremony.
The team lead adds a short entry after major visual-review, runtime-recovery, or
content-migration milestones. Chat updates stay brief: one paragraph plus three
to five bullets, leaving room for side discussions.

## 2026-08-05 — Homepage visual recovery

What worked best:

- Exact screenshots produced much better implementation instructions than prose.
- Separate implementer and reviewer roles caught visible mismatches before push.
- Playwright made responsive/runtime checks repeatable.
- Escalating the failed OneDrive recovery from Luna to Terra restored the server
  without losing the broken dependency tree.

What to improve next:

- Keep one runtime owner; never install dependencies while a reviewer is using
  the same dev server.
- Use the Markdown request inbox so unanswered decisions block only their named
  task.
- Limit each visual pass to one evidence-backed mismatch list and one re-review.
- Promote screenshots to regression baselines only after user/lead approval.
- Prefer verified Figma assets and copy directly; do not let workers invent
  substitute text, icons, or layout rationale.

## 2026-08-05 â€” Homepage top iteration 5 review

The compact hero landed cleanly because the exact source image and target
viewport were identified before implementation. The remaining review failure
is concentrated in one mobile selector-card pass, so the next worker can work
from a short measured mismatch list rather than redesigning the homepage.

- Treat the 273×486 mobile reference as a strict height budget, not merely a
  responsive-layout suggestion.
- Use purpose-made transparent character assets for homepage link icons; do
  not leave generic emoji in a felt/craft surface.
- Make stitch and shadow treatments once, reuse them consistently, and apply
  them only where the Figma reference indicates felt construction.
- Keep the teacher-planning hierarchy in the post-repair design review: grade
  and subject must lead; staff imagery is supporting brand context.

## 2026-08-07 — Grade planning template pass

The strongest correction came from treating supplied planning boards as structural templates, not mood references: Kindergarten now has its own planning dashboard, while Grade 1 and Grade 2 remain distinct grade routes rather than a combined selector.

- Match every felt, cardboard, fastener, grade badge, and topic icon to its `public/` source before styling around it.
- Keep the Kindergarten lesson-path selector, but let its planning surface follow the Kindergarten dashboard template.
- Preserve planning notes as functional controls, not merely pictured stationery.
- Do not infer a Grade 1/2 combined user choice from shared teacher roles or pre-existing UI.

## 2026-08-07 — Grade reference fidelity pass

The strict side-by-side review worked because the approved board was treated as a measurable composition while the site's canonical curriculum copy and shared header stayed explicit product constraints.

- Audit asset paths before visual tuning; the missing v4 icon directory was the largest apparent design failure.
- Compare the working-wall crop separately from shared site chrome so page-template fidelity remains measurable.
- Use supplied material images for texture and quiet inset edges for construction; avoid decorative CSS stitch simulations.
- Stop duplicate asset generation as soon as an existing production texture proves suitable.
- Keep one combined reference/implementation image for every final visual verdict.

## 2026-08-07 — Grade 2 three-template family

Treating the landing, topic, and lesson views as one continuous family made the grade identity much easier to keep coherent without redesigning each route independently.

- Carry grade context in navigation URLs when one canonical topic serves more than one grade.
- Derive planning labels from canonical lesson resources when optional MDX fields are empty; do not fill gaps with invented classroom materials.
- Keep character leadership explicit at the route boundary so shared templates do not silently choose the first whole-school staff member.
- Use one grade-specific surface class to carry rail and teacher colors through every template.
- Verify the journey and the individual reference frames; either check alone can miss a broken transition.

## 2026-08-07 — Kindergarten lead adaptation

Adapting an approved grade composition to a different canonical teacher worked best when the layout stayed fixed and only identity-bearing layers changed.

- Change the lead character, felt color, teacher label, and supporting accent as one coordinated identity layer.
- Preserve canonical pathway counts even when a visual reference contains additional placeholder cards.
- Keep the shared website header outside the page-template comparison instead of removing product navigation to mimic a standalone board.
- Check long grade labels at both desktop and mobile rail widths before finalizing typography.

## 2026-08-07 — Authored material-token audit

The visual mismatch was not primarily color selection; several opaque texture files were assigned to the wrong semantic surface, while global components still synthesized generic SVG noise.

- Treat background color and background image as one material assignment because opaque tiles do not inherit the declared color.
- Map felt, construction paper, cardboard, cork, and woven fabric by semantic surface before tuning opacity or blending.
- Keep large reading surfaces quiet by layering a translucent paper wash over the authored tile instead of removing texture.
- Scan every CSS `url()` against `public/` after asset-folder changes so deleted legacy paths cannot silently flatten a board.
- Maintain authored kraft and felt files as the global material tokens; do not reintroduce generated noise as a substitute.

## 2026-08-07 — Locked asset provenance and printable stationery

The asset-creation thread was useful as provenance, but replacing a component group with a single reference image created a new failure: the interface looked closer while its authored buttons, typography, and layout ceased to be real components.

- Treat current project, Figma, and Canva assets as authoritative; historical conversations are a map to them, not a replacement source.
- Reject any transparent export whose alpha bounds touch the canvas edge when the authored object is visibly clipped.
- Render genuinely printable paper or felt stationery as static artwork when appropriate, while keeping all labels, buttons, links, and layout structure as semantic components.
- Never use invisible hotspots over a flattened UI screenshot as the production implementation.
- Use Canva for authored textures and button assets, Figma for typography/layout, and HTML/React as the proof that those separate assets can reproduce the design.
- Run package operations serially on Windows; parallel dependency checks can collide with active Next.js native modules.
