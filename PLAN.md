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

Live-site design audit (2026-08-25, delegated design-auditor): P1 = home mobile overflow
(404px vs 375px), home subject-card contrast (axe serious ×10), missing skip-link;
P2 = sub-44px targets site-wide vs DESIGN.md contract, missing H1s on song detail + search,
daycare age contradiction, default Next 404; P3 = duplicate generic titles, g1/g2 title
pattern. Fixes await user authorization.

## Rules for future sessions

1. Do site work or harness work — never both in one uncommitted tree.
2. Commit (or revert) experimental code changes before ending a task; never leave silent
   behavior changes behind.
3. New `.omp/` agent files must be validated (frontmatter parses, role resolves) before other
   agents are told to depend on them.
4. Keep this file current; it is the anti-drift contract.
