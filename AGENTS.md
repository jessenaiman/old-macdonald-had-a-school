1. Read before answer. Library/API question → Context7 MCP (required external; not in
   project .mcp.json): resolve-library-id → query-docs → cite the fetched snippet.
   No memory-answers about this project's packages.
2. Next.js authority = installed version. Use the project-registered next-devtools MCP:
   nextjs_docs first (it answers use_bundled_docs + docsPath), then read/grep
   node_modules/next/dist/docs/. Live-server checks (nextjs_index / nextjs_call) only
   after `npm run dev` is actually up.
3. Skills are files, not commands. Before acting under a skill, read its
   .agents/skills/<name>/SKILL.md and follow exactly what it specifies — e.g.
   impeccable: run its scripts/context.mjs once per session (`--target <path>`, cwd at
   project, never rerun), load the reference/*.md playbook for the sub-command asked
   (critique, audit, polish, harden, clarify, live); for drift use the documented
   `$impeccable doctor` after reading reference/doctor.md.
   Relevant here: building-components, impeccable, next-dev-loop, verify-and-stop,
   ponytail-audit, agent-browser.
   1. Skill = markdown instruction file, not a command. Discovery lists name+description in prompt at startup.
   2. Use it: read skill://<name> → obey what it says → run its named commands via real tools (bash node .../context.mjs, read skill://impeccable/reference/critique.md, browser, etc.). Sub-paths resolve inside
      the skill dir: skill://<name>/<file>.
   3. Matching: request matches description = trigger → read skill before acting. That's the MUST.
   4. User-side: /skill:<name> (e.g. /caveman ultra) injects the body; skills persist until "off".
4. UI claims need pixels. Browser tool (skill://agent-browser for the workflow): open
   the route, screenshot desktop 1280 + mobile 375, light + dark. "Verified" names the
   screenshot path.
5. User deletions stay deleted. NEVER git checkout/restore on uncommitted files unless
   the user names those paths. Commit deletions when asked; never "repair" them.
6. User-pasted URL → read it first, quote it, then verdict. Unread = no opinion.
7. Plan is mandatory state: read the active plan file and check the todo list at every
   resume; execute to completion; never yield mid-plan.
8. Gates before commits: npm run typecheck && npm run lint && npm run build → exit 0.
   Failures verbatim.
9. Coding/check-in: before any coding task, read `docs/superpowers/check-in-workflow.md`; use one short-lived branch/PR, push only after the local commit gate and task checks pass, and never merge without owner approval. At integration, resolve/read `skill://finishing-a-development-branch` and follow it exactly.
10. Chat: caveman terse, no essays, no inventory recitals. Files/commits: normal prose.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
