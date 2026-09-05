# Check-in workflow

## Purpose

Make each change small, reviewable, locally proven, and recoverable before it consumes GitHub CI or reaches `main`.

## Required sequence

1. **Start from project truth.** Read `skills-lock.json`, invoke `using-superpowers`, then invoke each applicable current skill. Verify live browser, dev-server, and MCP behavior. Read the active plan and todo state before resuming work.
2. **Define one task.** A task is one independently reviewable change. Split larger work into multiple tasks when one reviewer could reasonably approve one part and reject another.
3. **Launch from Task Board.** Create one card per new coding task on the active board, pin the intended workspace, and run it to launch the task session. The board owns intake and execution state only; Git and GitHub own branch, review, and merge state.
4. **Isolate before mutation.** Fetch the remote, update `main`, then create a short-lived branch and ignored worktree from current `main` before editing. Preserve unrelated working-tree changes. Never stack a task branch on an unmerged task unless the owner explicitly approves that dependency.
5. **Design before implementation.** Classify the task, gather evidence, present the intended change, and obtain owner approval. For UI work, use Impeccable context and the applicable playbook before editing.
6. **Prove the failure first.** Bug fixes and behavior changes require a failing regression check before production edits. Configuration changes require an executable verification of the configured behavior.
7. **Implement the minimum approved change.** Keep commits focused and include related tests or checks in the same change.
8. **Verify locally.** Format before task verification. Task-specific tests, runtime checks, and UI screenshots run against the final files before commit. Lefthook rejects unstaged or untracked non-ignored files, checks staged formatting without rewriting it, generates Next.js types, then runs typecheck, lint, and production build. A failed gate blocks commit; fix the root cause rather than weakening the gate.
9. **Review before push.** Run the applicable review skill and resolve findings. Re-run affected checks after changes.
10. **Push only green work.** Push only after the local commit succeeds with every required gate. GitHub CI confirms the same state; it is not the first place routine failures should be discovered.
11. **Open a PR against `main`.** Include scope, rationale, test evidence, screenshots for UI changes, known warnings, and rollback notes. Never merge without owner approval and green required checks.
12. **Finish cleanly.** After merge, delete the task branch/worktree and confirm `main` is healthy. Use an audited, narrowly authorized break-glass path only for emergencies, followed immediately by review and repair or revert.

## Local commit gate

`lefthook.yml` runs these commands sequentially and stops at the first failure:

```sh
node scripts/check-clean-worktree.mjs
npx prettier --ignore-unknown --check <staged files>
npx next typegen
npm run typecheck
npm run lint
npm run build
```

The repository has no `test` script. Task-specific tests must therefore run explicitly before commit until a canonical test script exists. `next-env.d.ts` remains untracked because Next.js regenerates it; `next typegen` creates the required declarations before typecheck. npm's existing `allowScripts` policy approves only the pinned Lefthook installer. Lefthook keeps Git LFS hooks active and reads `lefthook.yml` on every run, so no repository-local hook copies or installer wrapper are required.

## Port ownership

Port 3000 is not assumed available. Inspect listener ownership first, then start OMHAS on a free port and pass that exact URL to agent-browser, Impeccable Live, and Next runtime checks.

## Evidence basis

This is a project governance policy informed by—not mechanically dictated by—the sources below:

- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow): separate branches for unrelated changes and pull-request review.
- [Google Engineering Practices: Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html): one self-contained change with related tests, optimized for review and rollback.
- [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/): few short-lived branches and at least daily integration; slow PR queues are a failure mode.
- [DORA: Working in small batches](https://dora.dev/capabilities/working-in-small-batches/): independently testable work completed in hours to a couple of days.
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): enforce PRs, approvals, resolved conversations, and required status checks on `main`.
- [Lefthook installation](https://lefthook.dev/usage/commands/install/): npm installs the hook manager and configuration changes require no reinstall.
- [Lefthook piped execution](https://lefthook.dev/configuration/piped/): ordered checks stop after the first failure.

Detailed source analysis and caveats live in `docs/superpowers/research/check-in-workflow-evidence.md`.
