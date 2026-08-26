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

## Uncommitted debris pending user decision (as of 2026-08-25)

| Change | Verdict |
|---|---|
| `.omp/agents/omp-operator.md` (untracked) | Malformed single-line file; frontmatter cannot parse. Recommend delete. |
| "OMP consultation required" sections in all 5 `.omp/agents/*.md` | Gate every subagent on an advisor that cannot register. Recommend revert. |
| `.omp/config.yml` model-role additions | Revert with the above unless roles are wanted. |
| `app/api/search/route.ts:567` removed `hasKeywordAnchor` filter | Silent search-recall behavior change; function still used at line 534. Restore unless intentionally experimenting. |

Use `git stash -u` before cleanup if ownership is uncertain. If all four changes are confirmed unwanted, restore the stash only if needed, then remove them deliberately.

## Rules for future sessions

1. Do site work or harness work — never both in one uncommitted tree.
2. Commit (or revert) experimental code changes before ending a task; never leave silent
   behavior changes behind.
3. New `.omp/` agent files must be validated (frontmatter parses, role resolves) before other
   agents are told to depend on them.
4. Keep this file current; it is the anti-drift contract.
