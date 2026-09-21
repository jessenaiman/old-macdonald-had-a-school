# Old MacDonald Had a School

- Read the @shadcn rules before even suggesting or thinking about helping
- Read the user instructions before considering your response to the user

Serverless deploys must include `data/*.db` plus the `models/` weight directory (~55MB total); semantic search loads MiniLM from disk and never fetches remote models.

## Check-in

Work directly on `main`. The pre-commit hook (`.husky/pre-commit`) runs Prettier on staged files then `npm run typecheck` — that is the whole local gate. Open a PR into `main` only when asked. There is no CI; there is no `test` script.

Details in [`docs/superpowers/check-in-workflow.md`](docs/superpowers/check-in-workflow.md).
