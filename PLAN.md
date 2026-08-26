# Launch Plan — September Curriculum Site

Reconstructed 2026-08-25 after a session derailed into harness reconfiguration. This file is the
durable plan of record; update item status here instead of leaving state only in session context.

## Status snapshot (at commit `1a07422`, branch `feature-test-branch`)

- [x] Author 17 September launch lessons (`4582bbc`) — committed with `validated:false pending approval`
- [x] Design audit P1–P3 fixes: contrast, landmarks, touch targets, per-grade metadata (`e8cf9e4`)
- [x] Unify all five grade hubs through shared `GradeHub` (`1a07422`)
- [x] Purge storybook remnants / dead deps; lint baseline (`12ecc4e`)
- [ ] **Lesson approval & validation** — flip `validated:false → true` for approved lessons via db-curator flow; this was the next planned step
- [ ] Search working-wall redesign follow-ups (WIP thread from `68846ca`)

## Debris resolution (2026-08-25)

All seven derailed-session files were swept into
`stash@{0}: derailed-session-debris-2025-08-25` (name predates the date fix): the malformed
agent definitions with injected consultation blocks, the config.yml role additions, and the
removed `hasKeywordAnchor` filter in `app/api/search/route.ts`. Recover with
`git stash pop`; discard permanently with `git stash drop` once confirmed unwanted.
Working tree resumed clean at `1a07422`.

Design implementation (2026-08-26, two delegated builders + main-thread fixes, commit `9d40290`):
working-wall grammar live on grade workspace (denim hard-board support per owner correction,
paper-ruled artifacts with fasteners crossing edges, sticky-note rail, academic-lead-first,
full brand name "Old MacDonald Had a School" — no "Farm School"); P1/P2 a11y fixes sitewide
(skip link, 44px targets, H1s, branded 404, contrast zero-axe, reflow 1265<=1280). Gates:
lint 0 errors, typecheck clean, browser-verified at 1280+375 via tool-operator Chrome recipe.
Design detector hook enabled (`.impeccable/config.json`). Mock (`public/grades-design.png`)
is directional only — standard Tailwind breakpoints, no invented ones. Reference set:
`output/pdf/omhas-character-curriculum-style-guide-applied-design.pdf` (+ sibling guide PDF,
`output/powerpoint/omhas-character-curriculum-style-guide-ponytail.pptx`); root Color_Map
pdf/png deleted by owner (superseded). Branch `autoresearch/session-20260826` pushed; PR
into `origin/main` (24 commits, fast-forwardable) pending owner merge.

## Rules for future sessions

1. Do site work or harness work — never both in one uncommitted tree.
2. Commit (or revert) experimental code changes before ending a task; never leave silent
   behavior changes behind.
3. New `.omp/` agent files must be validated (frontmatter parses, role resolves) before other
   agents are told to depend on them.
4. Keep this file current; it is the anti-drift contract.
