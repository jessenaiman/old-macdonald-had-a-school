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
