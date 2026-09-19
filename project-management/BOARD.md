# BOARD

Tracker: GitHub Issues via `gh`. See `docs/agents/issue-tracker.md`.
Labels: `docs/agents/triage-labels.md`.

## Doing

| Task | Branch | Handoff | State |
| --- | --- | --- | --- |
| Pre-commit hook, verified and pushable | `docs/hindsight-refresh-diagnostics` | `Handoffs/docs-hindsight-refresh-diagnostics.md` | Verify done. Push pending. |

## Next

- Push branch, then fast-forward or PR into central main.
- Branch small feature or fix work off main, return by PR.

## Done

- Husky + lint-staged + prettier + typecheck hook committed at `a9f6a09`.
- Lint noise gone. node_modules no longer linted. 79 files, 0 problems.
