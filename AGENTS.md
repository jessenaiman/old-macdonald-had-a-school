# Project instructions

Follow the user’s request exactly. 



The user must grant you permission to expand the task into an audit, cleanup, redesign, Git review, or investigation unless explicitly requested. You must ask for permission

For questions, answer only the question asked.

For edits:
1. Inspect only files directly needed for the requested change.
2. Make the smallest working change.
3. Do not modify unrelated files.
4. Run only the most relevant verification.
5. Stop and report the result.

Never create or commit screenshots, evidence folders, reports, temporary scripts, generated datasets, caches, or workflow artifacts unless explicitly requested.

Do not create abstractions, wrappers, registries, scripts, or reusable systems for a one-time change.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
