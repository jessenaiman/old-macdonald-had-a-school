# Check-in Workflow Plan

**Goal:** Enforce one-task/one-PR work with deterministic local proof before push.

**Architecture:** DSH Task Board owns task intake and session launch. Git worktrees isolate code. Lefthook owns the local commit gate. GitHub owns review, checks, and owner-approved merge.

**Tech stack:** DSH Task Board, Git worktrees, Lefthook 2.1.12, Prettier 3, npm, Next.js repository scripts.

## Contract

- One Task Board card launches one new coding-task session.
- One short-lived branch and PR starts from updated `main`.
- No stacked task branches without owner approval.
- A commit rejects mixed worktrees and fails unless formatting, generated Next types, typecheck, lint, and build pass.
- Task-specific checks and UI evidence run before commit.
- Push happens only after the commit gate succeeds.
- Merge requires green GitHub checks and explicit owner approval.

## Implementation

- [x] Replace Husky and lint-staged dependencies with pinned Lefthook.
- [x] Consolidate the local gate into `lefthook.yml`.
- [x] Keep Git LFS hook behavior and npm install-script allowlisting.
- [x] Document Task Board as intake/session launch, not PR state.
- [x] Install and validate Lefthook in the task worktree.
- [x] Prove clean-tree rejection and the complete commit gate.
- [x] Run Ponytail and correctness reviews.

## Integration requirements

- Push only the commit that passed the complete local gate.
- Require green PR checks before requesting review.
- Require explicit owner approval before merge.

## Rollback

Revert the workflow commit. The previous Husky files and dependencies remain recoverable from PR #25 history; no project data or application runtime behavior is migrated.
