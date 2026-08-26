---
name: deploy-old-mac-dev
description: Connect and deploy this repository's read-only Next.js site to its separate Vercel dev project and custom hostname. Use for Vercel setup, branch previews, build checks, DNS, or dev deployment; never switch or deploy the main production site.
---

# Deploy Old Mac Dev

Use separate Vercel project:

- Project: `old-macdonald-had-a-school-dev`
- Team: `jesses-projects-0cec385d`
- Dev hostname: `dev.old-macdonald-had-a-school`
- Working branch: current feature branch, currently `feature-test-branch`; never assume `main`.
- Database: read-only SQLite at `data/omhas.db`.

## Requirements

- Vercel CLI installed and authenticated.
- Repository linked to correct team/project; `.vercel/project.json` must contain project link.
- Current branch identified with `git branch --show-current`.
- `data/omhas.db` included in upload.
- `data/brand/cast-registry.ts` and `data/brand/image-registry.ts` included in upload.
- Research files stay available locally for development but stay out of Vercel upload: `data/*.xlsx`, `data/*.md`.
- `public/` must not be excluded.
- No production/main promotion without explicit approval.

## Connect

```powershell
vercel project add old-macdonald-had-a-school-dev --scope jesses-projects-0cec385d
vercel link --yes --project old-macdonald-had-a-school-dev --scope jesses-projects-0cec385d
vercel domains add dev.old-macdonald-had-a-school old-macdonald-had-a-school-dev --scope jesses-projects-0cec385d
vercel domains inspect dev.old-macdonald-had-a-school --scope jesses-projects-0cec385d
```

If project already exists, skip `project add`. Add DNS records shown by `domains inspect` at domain provider, then run:

```powershell
vercel domains verify dev.old-macdonald-had-a-school --scope jesses-projects-0cec385d
```

## Build and deploy

Run from current branch:

```powershell
npm run typecheck
npm run build
vercel deploy --yes --scope jesses-projects-0cec385d --target preview
```

Clean Vercel build is required; cached local `.next` success is not proof. Inspect failed deployment logs before retrying.

Only after preview passes and user approves dev-site publish:

```powershell
vercel --prod --scope jesses-projects-0cec385d
```

This publishes only separate `old-macdonald-had-a-school-dev` project. Never use `vercel promote`, `vercel --prod`, or Git integration against the main production project without explicit confirmation.

## `.vercelignore` invariant

Keep runtime files included. Exclude development-only research only:

```text
data/*.xlsx
data/*.md
```

Do not add `public/`, `data/*`, or broad asset exclusions; they can remove runtime modules/assets and break clean Vercel builds.

## Stop conditions

Stop and report if authentication, project ownership, DNS ownership, required files, environment variables, or clean remote build is missing. Never commit secrets or `.env.local`.
