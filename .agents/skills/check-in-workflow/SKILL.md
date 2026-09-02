# Product-wide check-in workflow

Use this skill for any repository check-in action sequence (code, policy, docs, CI, or process updates).

## One-line diagram

`feature branch -> local gates -> audited commit -> push -> feature-branch CI -> PR -> protected main merge`

## Numbered workflow (single-bullet, command-first, doc-linked)

1. **Prepare branch and scope**: `git switch -c <type>/<short-description>` using Conventional Commits prefixes (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `ci/`) from the check-in policy; verify branch strategy in the docs at https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-branches-and-merges .
2. **Pre-flight clean state**: run `git status --short --branch` and `git fetch --all --prune` before any changes to avoid stale branch assumptions; guidance: https://docs.github.com/en/get-started/using-git/getting-changes-from-a-remote-repository .
3. **Code and lint baseline**: ensure local style gates with `git diff --check && npm run lint && npm run typecheck && npm run build`; repository baseline is documented in `docs/check-in-policy.md` and `package.json` scripts.
4. **Commit message policy**: keep the required audit line as the **last** body line and add `Refs: #N` only for partial/issue-tracked work; syntax and examples are in `docs/check-in-policy.md` and enforced by `.husky/commit-msg`.
5. **Feature-branch delivery**: run `git add -A && git commit` (or `git commit --no-verify` only with explicit bypass rationale in body), then `git push -u origin HEAD`.
6. **CI on branch push**: monitor the push-triggered workflow with `gh run list -L 1 --branch <your-branch>`; if missing/failed, resolve before PR creation (GitHub Actions docs: https://docs.github.com/actions/managing-workflow-runs/using-workflow-runs/using-the-github-cli-for-github-actions ).
7. **Open PR discipline**: create PR using `gh pr create --base main --fill` only after green branch CI, per the project policy (`docs/check-in-policy.md`); PR flow reference: https://docs.github.com/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work/creating-a-pull-request .
8. **Enforce merge gate**: apply or verify branch protection on `main` (required PR reviews, required status checks from `.github/workflows/ci.yml`, and up-to-date branch); API pattern at https://docs.github.com/en/rest/branches/branch-protection .
9. **Finish merge**: merge only when checks and approvals are green (`gh pr merge --auto --merge`) and immediately verify final status with a final `git log --oneline -n 3` and linked PR notes.

## Non-goals

- Adding a pre-push hook yet (deferred until lint baseline is clean and policy gates are stable).
- Replacing this repo's existing agents; this skill is operational guidance only.
