# Project State

Last updated: 2026-08-05

This is a provisional handoff record, not automatic policy. Use it only for an
explicit handoff or context recovery. Verify every material detail against the
user's current instructions, Git, the running site, and current agent state.
Labels should distinguish `user-confirmed`, `evidence-verified`,
`agent-reported`, and `provisional` information.

## Current objective

Restore the Figma design as the visible system while preserving a simple Next.js teacher blog underneath: Markdown/MDX content, reusable music-led and video-led lesson templates, fast preview/print/video discovery, and a Markdown-driven About/portfolio hub.

**Evidence-verified, 2026-08-05 (current lead):** the live homepage is
available at `http://localhost:8443/`; Next.js MCP reports no compilation or
session errors; and the existing top-of-home still requires repair. The
highest-priority batch is limited to the four selector cards and the blue hero
directly beneath them. The exact card portrait sources are
`src/imports/miss-puddles.png`, `src/imports/miss-maisy.png`,
`src/imports/mr-rusty.png`, and `src/imports/mr-sam.png`; the exact group-hero
source is `public/scenes/old-mac-and-barnyard-music-circle.png`. No visual
baseline, commit, or push is authorized until an independent matching-viewport
review returns `APPROVED` and runtime QA passes.

The user rejected the three-card implementation after seeing it live and
supplied newer exact Figma screenshots. The immediate lead task is to restore
the Figma top-of-home order: compact header, dark four-card selector band, then
the Figma hero/introduction below. The cards are Early Years (combining Daycare
+ Preschool), Kindergarten, Grade 1, and Grade 2. Restore the flat Figma Browse
by Subject layout and stitched buttons, and obtain an independent
matching-viewport comparison before check-in.

## Repository

- Root: `C:\Users\jesse\OneDrive\Documents\Endless Measures\Curriculum\old-macdonald-had-a-school`
- Remote: `https://github.com/jessenaiman/old-macdonald-had-a-school`
- Branch at last verification: `main`, tracking `origin/main`
- Current local checkpoint: `5cf6e51` — `wip: checkpoint homepage visual QA in progress` (not an approval milestone).
- Last verified remote checkpoint remains `234cb15` — `agent working on putting the figma design into a nextjs website`.
- Declared Next.js version: `16.3.0`
- Package manager: pnpm

Always re-run the skill snapshot script; these facts can change.

## Active and recent worker lanes

| Worker | Agent ID | Model | Responsibility / write set | Status | Evidence / next handoff |
|---|---|---|---|---|---|
| Parfit | `019fcec6-4ea8-7b91-8b20-d6d013fdc6e1` | Luna | Dependencies/runtime and Playwright visual-QA infrastructure only | stopped after runtime failure | Replaced `networkidle` with deterministic page readiness, but an in-place OneDrive recovery left `node_modules` incomplete and port 8443 offline. No application code edited. Escalated to Herschel/Terra. |
| Carson | `019fced8-7838-72f2-804b-673af8200bbd` | Luna | Shared header/top-of-page and homepage batch | stopped after completed batch | Agent reported multiple application changes, but no approval. Baseline review returned `CHANGES REQUIRED`; timing relative to the final edits must be reverified. |
| Epicurus | `019fcedc-0aa5-7921-93b4-75b844bbb61d` | Luna | Independent Figma reviewer; may write only `docs/reviews/` | completed iteration 2; `CHANGES REQUIRED` | Iteration 2 substantially improved the Figma match. Remaining blockers: stale red Next overlay in final capture, Browse typography/color mismatch, and no fresh full protected feature/footer capture. The earlier mobile-collapse hypothesis was disproved. |
| Faraday | `019fd20e-9d16-7c62-982d-49deb2ee36b3` | Terra | Created the approved grouped Early Years prototype | stopped after prototype | Production implementation stalled without editing files; replaced with a narrower worker. |
| Mencius | `019fd222-7407-7ad2-8580-993fa8f652e1` | Terra | Restore Figma header → four-card selector band → hero order, stitched controls, and Figma Browse by Subject structure | completed iteration 2; unapproved | Changed `HomePage.tsx`, `SiteShell.tsx`, and `globals.css`. Header/card/hero structure and Figma row content are much closer. Await clean runtime recapture and remaining visual fixes. No push. |
| Herschel | `019fd26c-e1d6-7773-a01b-b49d50222590` | Terra | Recover dependencies/runtime and run the repaired Playwright QA suite; no app edits | active | Must preserve the broken dependency tree recoverably, restore a complete Next/React/Playwright install without an in-place OneDrive reorganization, then certify port 8443 and the 8-check QA result. |
| Descartes | `019fcec8-1ba9-7301-8870-05070ae0ff20` | Luna | About/portfolio Markdown collection and reusable About template | completed without implementation | Reported no About files changed. This lane must be reassigned. |
| Git steward | not assigned | Luna default | Stage only approved files, create scoped milestone commit, push integration branch, open/update draft PR | queued | Assign after design and runtime approval. |

Agent IDs are session-scoped. A new chat must check whether each worker is still callable.

## Expected uncommitted coordination files

At the last lead verification, these coordination changes were not yet committed:

- `AGENTS.md`
- `docs/PROJECT_CHECKLIST.md`
- `docs/TEAM_WORKFLOW.md`
- `docs/PROJECT_STATE.md`
- `.agents/skills/old-macdonald-project-lead/`
- `docs/reviews/`
- `components/SiteShell.tsx`
- `components/ThemeSwitcher.tsx`
- `components/home/HomePage.tsx`

Re-check `git status`; do not assume this list remains exact.

The current visual files appeared during Carson's active lane and are not yet reviewed or approved.

## Current blockers and risks

- OneDrive/SWC locks left `node_modules` incomplete during a Luna recovery; port 8443 is offline pending Herschel's recoverable Terra repair.
- Iteration 2 remains `CHANGES REQUIRED`: the saved desktop capture contains a stale red Next issue overlay, Browse by Subject still differs in heading/row typography and color, and the protected feature/footer needs a clean full capture.
- The 390px capture is responsive and has no horizontal overflow; the earlier narrow-strip hypothesis was a capture artifact and is closed.
- The About/portfolio lane has not begun and needs a new implementation worker.
- Multiple agents share one checkout, so workers must not branch, stage, commit, or push independently. A lead-owned local `wip:` checkpoint may preserve active QA state; it is not an approval or push gate.

## User-confirmed decisions

1. Figma controls visual design. The archive website supplies content only.
2. The website is a teacher blog under the hood, not a database application. Markdown/MDX remains the source of truth; no SQLite.
3. Lessons use two reusable patterns: music-led and video-led.
4. The cast is removed from curriculum-planning surfaces and belongs on a standalone page.
5. `/about` is the canonical portfolio hub. Employer/marketing angles are individual Markdown/MDX files rendered through one reusable template, each with a stable URL and a link back to the hub.
6. The compact hero, dense Browse by Subject pattern, Barn Band feature, and footer are protected targets.
7. Header navigation should be compact, use `Early Years` and `Primary Grades`, and use a real accessible theme icon.
8. Luna is the default worker model; promote to Terra when Luna stalls or fails design/runtime review.
9. Implementers cannot approve their own work. Independent Figma and runtime approval precede Git check-in.
10. Raw early-years research resources remain local and ignored; agents curate publishable assets into the site.

11. Exact Figma/screenshot specifications may be implemented directly. A
    rendered prototype and user approval are required only when an agent wants
    to depart from, reinterpret, or add a new visual choice beyond the supplied
    design. Prose alone cannot approve a departure.
12. The phrase and concept `The school day, by band` is rejected and must be
    removed.
13. The production divider uses four cards: `Early Years` (combining Daycare
    and Preschool), `Kindergarten`, `Grade 1`, and `Grade 2`.
14. Figma's card colors, left-positioned icons, stitched borders, shadows, and
    stitched buttons are required, not optional reinterpretations.
15. Remove invented copy and nested card-within-card treatments from the lower
    homepage; reproduce the flat Figma Browse by Subject structure.
16. The confirmed top-of-home order is compact Figma header, four-card dark
    selector band, then the Figma hero/introduction. The selector band itself
    is the divider.

## Provisional choices requiring visible confirmation

- Combining Daycare and Preschool into one `Early Years` selector remains the
  confirmed content decision. The earlier three-card prototype was incomplete
  because Kindergarten must be restored as the fourth-card replacement.
- Handoff worker statuses and file lists are agent-reported snapshots until
  reverified in the current chat.

## Required reading

- [Agent rules](../AGENTS.md)
- [Project checklist](PROJECT_CHECKLIST.md)
- [Team workflow](TEAM_WORKFLOW.md)
- [Project-lead skill](../.agents/skills/old-macdonald-project-lead/SKILL.md)
- [Next development loop](../.agents/skills/next-dev-loop/SKILL.md)
- [Publishing workflow](publishing-workflow.md)
- [Video audit queue](video-audit-queue.md)

## Protected references

See `docs/PROJECT_CHECKLIST.md` for the supplied screenshot paths and `src/` for the durable Figma implementation. Temporary screenshots may disappear; never invent a substitute when an approved reference is missing.

## Next lead actions

1. Receive Herschel's clean dependency/runtime recovery and repaired 8-check Playwright result.
2. Re-capture desktop, mobile, and the full protected feature/footer without a Next overlay.
3. Return only any remaining evidence-backed visual mismatch to the Terra implementation lane; do not create baselines while the batch fails.
4. If `APPROVED`, promote the rendered captures to baselines and assign the Git steward for the reviewed integration commit.
5. Reassign the About/portfolio lane with a disjoint write set.

## Decision log

- 2026-08-04 — Established Figma as visual truth and the archive website as content-only.
- 2026-08-04 — Simplified architecture to a Markdown/MDX teacher blog with no SQLite.
- 2026-08-04 — Added independent Figma review and centralized Git-steward gates.
- 2026-08-04 — Created the project-lead handoff skill and living state record for context-safe continuation.
- 2026-08-04 — Fresh-context Luna validation passed; it reconstructed the source hierarchy, lanes, blockers, Git state, and next action without conversation history.
- 2026-08-05 — Made the handoff skill optional and explicitly provisional; it no longer auto-applies to every chat.
- 2026-08-05 — Required rendered image prototypes for visual departures and recorded the exact Figma grade-selector target.
- 2026-08-05 — User approved `early-years-grouped-prototype.png` for the homepage grade-selection section only; header changes are explicitly out of scope.
- 2026-08-05 — User rejected the live grouped-card implementation and superseded it with the newest exact Figma screenshots: four colored cards in the below-hero divider, flat Browse by Subject layout, and stitched CTA treatment. Header remains out of scope.
- 2026-08-05 — User then supplied the exact Figma top composition and moved the hero below the selector band. Header scope reopened only to match that Figma reference and grouped navigation.
- 2026-08-05 — Established the professional QA loop: Playwright/next-dev-loop captures and compares matching viewports; raw Figma screenshots remain human specifications; approved rendered captures become automated baselines only after review.

## Handoff-skill validation

- Skill: `.agents/skills/old-macdonald-project-lead/SKILL.md`
- Test definitions: `.agents/skills/old-macdonald-project-lead/evals/evals.json`
- Latest result: `.agents/skills/old-macdonald-project-lead/evals/VALIDATION.md`
- Snapshot script: verified working when launched with `powershell -ExecutionPolicy Bypass -File`.
