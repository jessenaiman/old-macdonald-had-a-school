# Check-in Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce a branch-and-PR workflow whose commits run all repository gates locally before push.

**Architecture:** Keep the human and agent policy in one canonical workflow document, point always-loaded project instructions to it, and enforce the mechanical local gate with Husky. GitHub remains confirmation and integration protection, not the first routine test runner.

**Tech Stack:** Git, Husky 9, lint-staged 17, Prettier 3, npm, Next.js repository scripts.

**Spec:** `docs/superpowers/check-in-workflow.md`

## Global Constraints

- Every coding task uses one short-lived branch and pull request based on updated `main`; stacked task branches require explicit owner approval.
- A push occurs only after local typecheck, lint, build, and task-specific checks pass.
- Existing unrelated working-tree changes are preserved and excluded.
- Merging requires green GitHub checks and explicit owner approval.

---

### Task 1: Install the local commit gate

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitattributes`
- Create: `.husky/pre-commit`
- Create: `.husky/install.mjs`
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
if ! git diff --quiet --ignore-submodules --; then
  echo "Commit blocked: unstaged tracked changes exist. Use a clean task worktree." >&2
  exit 1
fi

untracked="$(git ls-files --others --exclude-standard)"
if [ -n "$untracked" ]; then
  echo "Commit blocked: untracked files exist. Stage them, ignore them, or use a clean task worktree." >&2
  printf '%s\n' "$untracked" >&2
  exit 1
fi

npx lint-staged
npx next typegen
npm run typecheck
npm run lint
npm run build
```

`.lintstagedrc`:

```json
{
  "*": "prettier --ignore-unknown --check"
}
```

Set `.husky/* text eol=lf` in `.gitattributes`. Route `prepare` through `.husky/install.mjs`, which exits cleanly for production, CI, or `HUSKY=0` before importing Husky.

- [ ] **Step 3: Verify configuration**

```powershell
npx prettier --check .gitattributes .husky/pre-commit .husky/install.mjs .lintstagedrc .prettierrc package.json docs/superpowers/check-in-workflow.md
npx next typegen
npm run typecheck
npm run lint
npm run build
```

Expected: every command exits 0; npm audit warnings are reported without unrelated automatic upgrades.

### Task 2: Publish the operating contract

**Files:**

- Modify: `.gitignore`
- Remove from Git tracking: `next-env.d.ts` (Next.js regenerates it locally)
- Modify: `AGENTS.md`
- Modify: `README.md`
- Create: `docs/superpowers/check-in-workflow.md`
- Create: `docs/superpowers/research/check-in-workflow-evidence.md`

**Interfaces:**

- Consumes: primary-source evidence from GitHub, Google Engineering Practices, and DORA.
- Produces: one canonical workflow reached by concise pointers in agent and human entry points.

- [ ] **Step 1: Ignore generated workspace state**

Add `.worktrees/` and `next-env.d.ts` to `.gitignore`, then remove the generated declaration file from Git tracking without deleting the local file:

```powershell
git rm --cached next-env.d.ts
```

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
git add .gitattributes .gitignore .husky/pre-commit .husky/install.mjs .lintstagedrc .prettierrc package.json package-lock.json AGENTS.md README.md docs/superpowers/check-in-workflow.md docs/superpowers/research/check-in-workflow-evidence.md docs/superpowers/plans/2026-09-04-check-in-workflow.md
```

- [ ] **Step 2: Commit and observe the hook**

```powershell
git commit -m "chore: enforce local check-in gates"
```

Expected: lint-staged, typecheck, lint, and build all run and exit 0 before Git records the commit.

- [ ] **Step 3: Review and push**

```powershell
git show --stat --oneline HEAD
git push -u origin workflow/check-in-rules-final
```

Expected: only workflow-task files are present; push succeeds after local proof.

- [ ] **Step 4: Open the PR without merging**

```powershell
@"
## Summary
- enforce local formatting, typecheck, lint, and build before commit
- document the branch-and-PR workflow and its primary-source evidence
- ignore Next.js-generated `next-env.d.ts` so gates leave the tree clean

## Local verification
- pre-commit hook: passed
- `npm run typecheck`: passed
- `npm run lint`: passed with documented pre-existing warnings
- `npm run build`: passed
"@ | Set-Content .tmp-pr-body.md
gh pr create --base main --head workflow/check-in-rules-final --title "chore: enforce local check-in gates" --body-file .tmp-pr-body.md
Remove-Item .tmp-pr-body.md
```

Expected: PR URL returned; merge remains pending owner approval and required GitHub checks.
