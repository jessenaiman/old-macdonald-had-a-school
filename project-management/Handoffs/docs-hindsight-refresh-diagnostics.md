# Handoff: docs/hindsight-refresh-diagnostics

## Task

Husky pre-commit hook set up, verified, and the work made committable and pushable.

## State

- Branch: `docs/hindsight-refresh-diagnostics`
- Tip: `cb7a69f chore(workflow): align pre-commit hook with skill, add status docs`
- Tree clean. Pushed. `origin/main` = 0 behind, 2 ahead.
- Pushed to `origin/docs/hindsight-refresh-diagnostics` only. Main untouched.

## What exists

- devDependencies: `husky ^9.1.7`, `lint-staged ^17.4.1`, `prettier ^3.9.6`.
- `prepare: "husky"`. `core.hooksPath = .husky/_`.
- `.husky/pre-commit`: `npx lint-staged`, then `npm run typecheck`.
- `.lintstagedrc`: `{"*": "prettier --ignore-unknown --write"}`.
- `.prettierrc`: skill defaults, 7 keys.
- `.prettierignore`: `**/*.md`, `**/*.mdx`. Prose stays as written.
- Exec bit on `.husky/pre-commit` is `100644` and that is fine. Husky v9 `_/h` runs `sh -e "$s"`.

## Gates

- `eslint .` = 79 files, 0 problems, 0 under node_modules.
- `tsc --noEmit` = pass.
- No `test` script exists. `test:theme-contrast` exists but hook runs no tests. Skill says omit a missing script and say so. Said.

## Next step

Branch small feature or fix work off main. Return by PR into main.

## Notes

- `globalIgnores()` in `eslint.config.mjs` replaces ESLint's default ignores. node_modules is excluded today, so do not lean on defaults.
- Lefthook leftovers are inert, not wired: `.git/hooks/pre-commit` shim and `node_modules/.bin/lefthook`. `core.hooksPath` points at `.husky/_`, so lefthook never runs. No `lefthook.yml` in repo.
- Hook deliberately does not run `eslint`. Lint stays a manual command.
