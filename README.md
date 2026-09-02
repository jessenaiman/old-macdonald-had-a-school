# Old MacDonald Had a School

- Read the @shadcn rules before even suggesting or thinking about helping
- Read the user instructions before considering your response to the user

Serverless deploys must include `data/*.db` plus the `models/` weight directory (~55MB total); semantic search loads MiniLM from disk and never fetches remote models.

## Check-in / merge workflow (concise)

- Branch from `main`, scope to one issue, and avoid unrelated local edits.
- Keep CI check before push: `npm run lint && npm run typecheck && npm run build`.
- If UI changes touch branding/media, add: `npx impeccable detect --json app components`.
- Run PR flow on a clean branch; don't stack merge-only branch history.
- Open PR against `main` only when local gates pass and the body is complete.
- Merge only after GitHub checks and Vercel are green in the PR.

3-loop recovery rule:
1) Reproduce failure in a clean worktree (`git worktree add --detach`) with `npm ci` and `npm run build`.
2) Implement the minimal fix and rerun full local gates.
3) Rebase cleanly onto `main`, run gates again, push, and only then merge.
