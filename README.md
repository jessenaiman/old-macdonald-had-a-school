# Old MacDonald Had a School

- Read the @shadcn rules before even suggesting or thinking about helping
- Read the user instructions before considering your response to the user

Serverless deploys must include `data/*.db` plus the `models/` weight directory (~55MB total); semantic search loads MiniLM from disk and never fetches remote models.

## Check-in / merge workflow

Every coding task uses its own short-lived branch and pull request. The commit must pass local formatting, typecheck, lint, build, and task-specific verification before push; GitHub CI confirms an already-green change. Merging requires green required checks and explicit owner approval.

The canonical sequence, recovery rules, evidence, and emergency path are documented in [`docs/superpowers/check-in-workflow.md`](docs/superpowers/check-in-workflow.md).
