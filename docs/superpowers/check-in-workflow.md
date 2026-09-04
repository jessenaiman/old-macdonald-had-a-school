# Check-in workflow

## Purpose

Make each change small, reviewable, locally proven, and recoverable before it consumes GitHub CI or reaches `main`.

## Required sequence

1. **Start from project truth.** Read `skills-lock.json`, invoke `using-superpowers`, then invoke `omhas-harness` for browser, dev-server, MCP, or skill work. Read the active plan and todo state before resuming work.
2. **Define one task.** A task is one independently reviewable change. Split larger work into multiple tasks when one reviewer could reasonably approve one part and reject another.
3. **Isolate before mutation.** Create a short-lived branch and, when practical, an ignored worktree before editing. Preserve unrelated working-tree changes.
4. **Design before implementation.** Classify the task, gather evidence, present the intended change, and obtain owner approval. For UI work, use Impeccable context and the applicable playbook before editing.
5. **Prove the failure first.** Bug fixes and behavior changes require a failing regression check before production edits. Configuration changes require an executable verification of the configured behavior.
6. **Implement the minimum approved change.** Keep commits focused and include related tests or checks in the same change.
7. **Verify locally.** The pre-commit hook runs formatting of staged files, typecheck, lint, and production build. Task-specific tests, runtime checks, and UI screenshots run before commit. A failed gate blocks commit; fix the root cause rather than weakening the gate.
8. **Review before push.** Run the applicable review skill and resolve findings. Re-run affected checks after changes.
9. **Push only green work.** Push only after the local commit succeeds with every required gate. GitHub CI confirms the same state; it is not the first place routine failures should be discovered.
10. **Open a PR against `main`.** Include scope, rationale, test evidence, screenshots for UI changes, known warnings, and rollback notes. Never merge without owner approval and green required checks.
11. **Finish cleanly.** After merge, delete the task branch/worktree and confirm `main` is healthy. Use an audited, narrowly authorized break-glass path only for emergencies, followed immediately by review and repair or revert.

## Local commit gate

`.husky/pre-commit` runs, in order:

```sh
npx lint-staged
npm run typecheck
npm run lint
npm run build
```

The repository has no `test` script. Task-specific tests must therefore run explicitly before commit until a canonical test script exists. `next-env.d.ts` remains untracked because Next.js regenerates different references during development and production builds.

## Port ownership

Port 3000 is not assumed available. Inspect listener ownership first, then start OMHAS on a free port and pass that exact URL to agent-browser, Impeccable Live, and Next runtime checks.

## Evidence basis

This is a project governance policy informed by—not mechanically dictated by—the sources below:

- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow): separate branches for unrelated changes and pull-request review.
- [Google Engineering Practices: Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html): one self-contained change with related tests, optimized for review and rollback.
- [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/): few short-lived branches and at least daily integration; slow PR queues are a failure mode.
- [DORA: Working in small batches](https://dora.dev/capabilities/working-in-small-batches/): independently testable work completed in hours to a couple of days.
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): enforce PRs, approvals, resolved conversations, and required status checks on `main`.

Detailed source analysis and caveats live in `docs/superpowers/research/check-in-workflow-evidence.md`.
