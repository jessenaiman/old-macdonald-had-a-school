# Check-in Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce a branch-and-PR workflow whose commits run all repository gates locally before push.

**Architecture:** Keep the human and agent policy in one canonical workflow document, point always-loaded project instructions to it, and enforce the mechanical local gate with Husky. GitHub remains confirmation and integration protection, not the first routine test runner.

**Tech Stack:** Git, Husky 9, lint-staged 17, Prettier 3, npm, Next.js repository scripts.

**Spec:** `docs/superpowers/check-in-workflow.md`

## Global Constraints

- Every coding task uses one short-lived branch and pull request.
- A push occurs only after local typecheck, lint, build, and task-specific checks pass.
- Existing unrelated working-tree changes are preserved and excluded.
- Merging requires green GitHub checks and explicit owner approval.

---

### Task 1: Install the local commit gate

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `.husky/pre-commit`
- Create: `.lintstagedrc`
- Create: `.prettierrc`

**Interfaces:**

- Consumes: existing npm scripts `typecheck`, `lint`, and `build`.
- Produces: a Git pre-commit gate that exits non-zero when any required command fails.

- [ ] **Step 1: Install pinned package-compatible tooling**

```powershell
npm install --save-dev husky lint-staged prettier
npx husky init
```

- [ ] **Step 2: Configure staged formatting and full gates**

`.husky/pre-commit`:

```sh
npx lint-staged
npm run typecheck
npm run lint
npm run build
```

`.lintstagedrc`:

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

- [ ] **Step 3: Verify configuration**

```powershell
npx lint-staged
npm run typecheck
npm run lint
npm run build
```

Expected: every command exits 0; npm audit warnings are reported without unrelated automatic upgrades.

### Task 2: Publish the operating contract

**Files:**

- Modify: `.gitignore`
- Modify: `AGENTS.md`
- Modify: `README.md`
- Create: `docs/superpowers/check-in-workflow.md`
- Create: `docs/superpowers/research/check-in-workflow-evidence.md`

**Interfaces:**

- Consumes: primary-source evidence from GitHub, Google Engineering Practices, and DORA.
- Produces: one canonical workflow reached by concise pointers in agent and human entry points.

- [ ] **Step 1: Ignore task worktrees**

Add `.worktrees/` to `.gitignore` so isolated worktrees cannot be staged.

- [ ] **Step 2: Add concise context pointers**

Point `AGENTS.md` and `README.md` to `docs/superpowers/check-in-workflow.md`; keep detailed process in the canonical document rather than duplicating it.

- [ ] **Step 3: Validate documentation**

```powershell
git diff --check
```

Expected: exit 0 with no whitespace errors.

### Task 3: Prove the gate and open the PR

**Files:**

- No new files.

**Interfaces:**

- Consumes: Tasks 1 and 2.
- Produces: one locally green commit and one PR against `main`.

- [ ] **Step 1: Stage only workflow-task files**

```powershell
git add .gitignore .husky/pre-commit .lintstagedrc .prettierrc package.json package-lock.json AGENTS.md README.md docs/superpowers/check-in-workflow.md docs/superpowers/research/check-in-workflow-evidence.md docs/superpowers/plans/2026-09-04-check-in-workflow.md
```

- [ ] **Step 2: Commit and observe the hook**

```powershell
git commit -m "chore: enforce local check-in gates"
```

Expected: lint-staged, typecheck, lint, and build all run and exit 0 before Git records the commit.

- [ ] **Step 3: Review and push**

```powershell
git show --stat --oneline HEAD
git push -u origin workflow/check-in-rules-demo
```

Expected: only workflow-task files are present; push succeeds after local proof.

- [ ] **Step 4: Open the PR without merging**

```powershell
gh pr create --base main --head workflow/check-in-rules-demo --title "chore: enforce local check-in gates" --body-file <prepared-pr-body>
```

Expected: PR URL returned; merge remains pending owner approval and required GitHub checks.
