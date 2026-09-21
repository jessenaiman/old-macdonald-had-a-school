# Check-in workflow

## The whole flow

- All work happens on `main` (one branch at a time). Open a PR into `main` only when the user asks.
- Commit and let the pre-commit hook gate it. `.husky/pre-commit` runs `npx lint-staged` (Prettier on staged files) then `npm run typecheck`. There is no `test` script; the only standalone check is `npm run test:theme-contrast`.
- Do not run the gate manually before committing — the hook runs it for you. Re-run it only when the hook fails, and fix the root cause rather than bypassing the hook.
- If a branch needs a PR, push it from a short-lived `<type>/<slug>` branch off `main`; never push `main` directly.

## Recovery

- Every feature branch ever created still exists on `origin` (the archive). Deleted local branches and worktrees are recoverable: `git fetch origin && git checkout -b <name> origin/<name>`.

## Evidence basis

Sources that shaped this policy: [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow), [Google Engineering Practices: Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), and [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/). Historical research and planning for a previous Lefthook-based gate live in `docs/superpowers/research/` and `docs/superpowers/plans/`; they no longer describe the active gate.