---
name: omhas-harness
description: >
  Verified operating contract for the OMHAS repo under the Oh My Pi (omp) harness: how to start the dev
  server, drive the browser tools, call the Next.js devtools MCP, use agent-browser, resolve skills, and
  what is known broken. Every claim here was executed in this repo; re-verify cheap checks instead of
  trusting this file when behavior looks off. Use for ANY browser, dev-server, MCP, or skills task in
  this repository.
---

# OMHAS harness operations (verified 2026-08-27, omp 18.0.7)

## First rule: read docs before trying tools

- Bundled omp docs: `read omp://` indexes 130 pages; tool docs are `omp://tools/<name>.md`.
  Cite the exact page used. Never operate a tool from memory or trial-and-error.
- `https://omp.sh/docs/*` pages are client-rendered: `read <url>` returns only the marketing shell
  (empty content). The documented remedy (omp.sh "Web & browser" guide, "A URL is empty or missing
  content"): render it in the browser tool, or use the bundled `omp://` equivalent.
- If a tool behaves unlike its docs, file the mismatch (`write xd://report_issue`), tell the user,
  and stop. No silent workarounds, no invented fixes.

## Dev server (hub `web`)

- `next dev` is served on port 3000 and stays up via hub. Start with:
  `hub op=start name=web application=cmd.exe args=["/c","npm run dev"] ready={port:3000}`.
  `npm`/`npm.cmd` directly FAIL as spawn targets on this Windows host (os error 193 / batch-file
  rejection). Turbopack readiness ~1s is normal.
- Ownership proof before trusting any 200: `Get-NetTCPConnection -LocalPort 3000 -State Listen` →
  OwningProcess, then walk `wmic process where ProcessId=<pid> get ParentProcessId` up the tree to
  the hub-reported pid. A stale server from a previous terminal can hold :3000.
- `.next/dev/lock` holds PID/port/URL of the running dev server (Next.js 16.3; per nextjs.org
  ai-agents guide). A second `next dev` prints the URL + PID to kill instead of starting a duplicate.

## Browser

Two documented, working paths. Pick deliberately:

1. **omp `browser` tool (`xd://browser` or `browser`)** — per `omp://tools/browser.md`.
   `open` (accepts `viewport {width,height,scale}`, `url`, `app.relay`), `run` (JS with `page`,
   `tab.*` helpers, `assert`, `wait`), `close`. Verified working: open :3000,
   `tab.evaluate(() => [innerWidth, innerHeight])`, `tab.screenshot({silent:true})` (webp into OS
   temp; `read <path>` confirms bytes/dimensions), exactly one `main` landmark at 375×812 and
   1280×900. Headless default viewport is 1365×768; pass `viewport` on `open` to control launch-time
   size; `page.setViewport` + reload works for in-session resizes.
2. **`agent-browser` CLI (0.34.0, global)** — required by the `next-dev-loop` skill.
   - Version-matched docs ship with the CLI: `agent-browser skills get core [--full]`. Read it
     before guessing subcommands.
   - Session discipline (hard requirement in its docs):
     `SESSION="$(agent-browser session id --scope worktree --prefix next-dev-loop)"`, then export
     `AGENT_BROWSER_SESSION` and `AGENT_BROWSER_RESTORE`.
   - React commands require the flag AT LAUNCH: `open --enable react-devtools <url>` must be the
     first command of a FRESH browser; a reused daemon ignores it. Check
     `session info --json` (`"reused": true` means the flag did not apply).
   - Observed defect (reported): plain `react tree` prints only `✓ Done`; `react tree --json`
     returns the full tree. `react suspense`, `react renders start/stop --json` work normally.
     Use `--json` for any `react *` call until fixed.

- `inspect_image` is disabled (`internal.inspect_image.enabled=false`) AND the configured vision
  model rejects image input. Screenshot verification = `read` the file for metadata + DOM checks in
  the browser; do not attempt visual model analysis.

## Next.js devtools MCP (`/_next/mcp`)

- The xd bridge works for **zero-arg** tools ONLY: call
  `xd://mcp__next_devtools_nextjs_call` with `port` + `toolName` and OMIT `args` entirely.
  Passing `args` (object or JSON string) is rejected by a bridge/schema bug
  ("expected object, received string") — reported 2026-08-27.
- Verified clean on a healthy tree: `get_compilation_issues` → `{"issues":[]}`;
  `get_errors` → `{"configErrors":[],"sessionErrors":[]}`; `get_routes` (routerType omitted) → full
  app-router map; `nextjs_index` lists all 9 tools.
- Do NOT bypass the bridge with raw curl POSTs to `/_next/mcp` unless the user explicitly
  approves that transport as the solution (the next-dev-loop skill documents the SSE `data:`-line
  reading quirk, but it is not an omp-documented tool path).

## Skills

- Canonical omp location: `.agents/skills/<name>/SKILL.md` (`skills.enableAgentsProject=true`).
  Discovery happens at SESSION START — a freshly installed skill will NOT resolve via `skill://`
  until the next omp session. `read .agents/skills/<name>/SKILL.md` works immediately.
- Duplicates: the `skills` CLI mirrors installs into `.claude/skills/` (project) and sometimes
  `~/.claude/skills/` / `~/.agents/skills/` (user). omp dedups by name with provider precedence
  (claude 80 > agents 70, per `omp://skills.md`); identical copies are harmless.
- Install quirk: `npx skills add <owner>/<repo>` consults the skills.sh registry index, which can be
  stale. If "No matching skills found" lists names that don't match the repo's dirs, install from
  the git URL instead: `npx skills add https://github.com/<owner>/<repo>.git --skill <name> --copy -y`.
- Provenance (verified against upstream 2026-08-27):
  - `next-dev-loop` → new home `vercel/next.js/skills/` (moved out of `vercel-labs/next-skills`,
    which is now a redirect stub).
  - `web-design-guidelines`, `vercel-react-best-practices` → `vercel-labs/agent-skills`.
  - `next-best-practices` is RETIRED upstream ("no longer a skill"; knowledge ships in
    `node_modules/next/dist/docs/` + `next dev`-generated `AGENTS.md` managed block — both present
    in this repo at Next 16.3.0). Owner decision pending whether to remove the local copy.
  - `vercel-react-best-practices` is installed at USER level only (`~/.agents/skills/`), not project.
- `bash.patterns` (DB guardrails) live in `.omp/config.yml`; deny rules are absolute and match any
  compound segment. They load at session start: commands executed in the session that added the
  patterns are NOT gated until the next session. `npm run db:migrate` (committed migrations) is the
  only sanctioned write path; `db:push`/`drizzle-kit push` and ad-hoc INSERT/DELETE/DROP/ALTER are
  policy-denied.

## Agents & models

- Agent files: `.omp/agents/*.md`. Model roles resolve from GLOBAL
  `~/.omp/agent/config.yml` (`modelRoleStorage=global`): default/vision/plan/commit/task/advisor
  exist; project `.omp/config.yml` adds curator + builder. An agent naming an undefined role falls
  back to the parent session's model (`omp://task-agent-discovery.md`) — check `omp config list`
  `internal.modelRoles` + `task.agentModelOverrides` before adding aliases.
- Subagents are headless: `ask` is unavailable in them (`omp://tools/ask.md`). Human-in-the-loop is
  an OUTPUT contract (verdict file + parent-session ask), never an in-agent prompt.
- `learn` is available to a subagent only when its frontmatter `tools:` lists it, and only does
  anything when `autolearn.enabled=true` + memory backend (currently disabled: `false`, backend
  `mnemopi`). A memory-write failure must never fail a task.
- Plan mode: on by default (`plan.enabled=true`); toggle `Alt+Shift+P` (`app.plan.toggle`,
  `omp://keybindings.md`); under plan mode subagents are restricted to read/grep/glob/web_search;
  headless batch: `omp --plan-yolo`.

## Citation discipline (all agents, all answers)

Every factual claim about a framework or the harness cites the exact source READ THIS SESSION:
an `omp://` page, a `node_modules/next/dist/docs/<page>` path, a `skill://<name>` page, an upstream
URL, or a repo `file:line`. Not read this session = say "not verified". Never paste doc content into
agents or skills as a substitute for reading it.
