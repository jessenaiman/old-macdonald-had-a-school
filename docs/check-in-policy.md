# Check-in policy

## Pre-commit (husky, runs on `git commit`)

1. `npx lint-staged` runs `eslint --max-warnings 0 --fix` on staged TS/TSX/JS/JSX files.
2. If ESLint fails the commit aborts. Bypass with `git commit --no-verify` only when the commit body explains why.

## Commit body format

Every commit body MUST contain a one-line check-in audit in this exact shape:

```
audit: ponytail <verdict> <separator> impeccable <verdict>
```

`<verdict>` is 2-3 words. `<separator>` is middle dot `·`, hyphen `-`, or pipe `|`.
Multiple separators are accepted because the middle dot is fragile inside Windows
MSYS grep char classes; pick whichever you typed fastest.

Examples:

- `audit: ponytail clean · impeccable clean`
- `audit: ponytail yagni found | impeccable 1 anti-pattern`
- `audit: ponytail not run - impeccable not run`

The audit is the last line of the body. The `commit-msg` husky hook **enforces**
this and aborts the commit otherwise. Bypass with `git commit --no-verify` and
explain the bypass in the commit body.

## Per-branch rule

- Each branch checks in to its own branch first. Do not push to `main` directly.
- Branch names use Conventional Commits prefixes (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `ci/`).
- Push to a feature branch, wait for CI green, then PR into `main`.

## CI (`.github/workflows/ci.yml`, runs on push + PR to main)

1. `npm ci` — clean install, no `npm install` drift
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`

If any step fails the PR is not mergeable. Concurrency cancels duplicate runs on the same branch.

## Tooling on the local machine

- `caveman run hermes` for token-aware compression during long sessions
- `/ponytail` mode before writing code (YAGNI ladder)
- `npx impeccable detect --json src/` before commit for UI changes
