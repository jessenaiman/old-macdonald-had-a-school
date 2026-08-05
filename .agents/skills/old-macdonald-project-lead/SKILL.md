---
name: old-macdonald-project-lead
description: >
  Optional recovery and handoff aid for the Old MacDonald Had a School
  repository. Use only when the user explicitly requests a handoff/status
  reconstruction or when context loss makes project alignment impossible.
  Rebuilds a provisional view of objectives, worker lanes, blockers, Git state,
  and relevant files; it must verify every material detail against the current
  user instructions and repository before treating it as confirmed.
compatibility: Local repository access, Git, PowerShell, and optional multi-agent tools.
---

# Old MacDonald Project Lead

Use this skill as an optional recovery aid, not automatic project policy.
Conversation memory is temporary, but handoff documents can also become stale.
Current user instructions and observable repository/runtime evidence are stronger.

## Explicit handoff or recovery alignment

When the user explicitly asks for a handoff/status reconstruction, or context
loss makes safe continuation impossible:

1. Resolve the repository root with `git rev-parse --show-toplevel`.
2. Run `powershell -ExecutionPolicy Bypass -File .agents/skills/old-macdonald-project-lead/scripts/snapshot-project.ps1` to capture current Git and runtime facts without changing the machine policy.
3. Read these files completely, in order:
   - `AGENTS.md`
   - `docs/PROJECT_STATE.md`
   - `docs/PROJECT_CHECKLIST.md`
   - `docs/TEAM_WORKFLOW.md`
4. Read `.agents/skills/next-dev-loop/SKILL.md` before any Next.js work.
5. Inspect only the source files and visual references relevant to the active lane.
6. Compare the living state document with actual Git and agent state. Treat every unverified detail as provisional and correct stale facts before assigning new work.
7. Begin the first project update with a short alignment statement: current goal, active lanes, principal blocker, and next review gate.

Do not turn a prior proposal into a requirement merely because it appears in a
handoff document. Record whether each material detail is `user-confirmed`,
`evidence-verified`, `agent-reported`, or `provisional`.

## Source hierarchy

Keep this distinction explicit in every design or content brief:

- **Visual truth:** preserved Figma implementation in `src/`, `src/assets/`, durable project assets, and user-approved screenshots.
- **Content truth:** the archive project at `C:\Users\jesse\OneDrive\Documents\New project`, including canonical cast, roles, biography, curriculum wording, and promotional writing.
- The archive website is not a visual source. Its header, navigation, spacing, templates, and styling must not migrate into this site.

## Living state record

Maintain `docs/PROJECT_STATE.md` whenever any of these change:

- the lead's current objective or immediate next action;
- an agent is created, resumed, promoted, completed, stopped, or blocked;
- a worker's model, lane, write set, or reviewer changes;
- the user makes a durable product or design decision;
- a route, component, content collection, dependency, or Git checkpoint changes;
- a review returns `APPROVED` or `CHANGES REQUIRED`;
- a blocker appears or is cleared.

Never hard-lock an unresolved design or product choice. Keep alternatives and
uncertain language explicit until the user confirms one visible target.

For each worker, record:

- nickname and agent ID when available;
- model and escalation state;
- role and exact write set;
- status: `queued`, `active`, `review`, `changes-required`, `approved`, `blocked`, `completed`, or `stopped`;
- changed files and evidence when reported;
- the next handoff recipient.

Agent IDs are session-scoped. A fresh chat must verify whether listed workers are still callable before messaging or waiting on them.

## Delegation protocol

Before dispatching a worker:

1. Identify the immediate critical-path task that remains with the lead.
2. Give the worker one bounded lane and a disjoint write set.
3. Attach the relevant skills and visual/file references.
4. Tell the worker to read `AGENTS.md`, `PROJECT_STATE.md`, `PROJECT_CHECKLIST.md`, and `TEAM_WORKFLOW.md`.
5. Record the assignment in `PROJECT_STATE.md` before or immediately after dispatch.
6. Use Luna by default. Promote to Terra when Luna stalls, misreads the visual/content hierarchy, cannot complete the runtime loop, or fails review.

The team lead reviews and coordinates. Do not silently absorb an implementation lane that belongs to a worker.

## Review and Git gate

Follow `docs/TEAM_WORKFLOW.md`:

- Implementers cannot approve their own work.
- The independent Figma reviewer compares matching-viewport reference and implementation screenshots after every visual batch.
- A visual batch needs an explicit `APPROVED` verdict before check-in.
- Runtime approval requires the installed `/next-dev-loop`; screenshots alone are insufficient.
- Shared-checkout workers report changed files but do not commit or push.
- The Git steward stages only approved files, creates a scoped milestone commit, pushes an integration branch, and opens or updates a draft pull request.
- Keep `main` as the last reviewed checkpoint.

Record the commit, branch, PR, checks, and reviewer verdict in `PROJECT_STATE.md` and update matching checklist items.

## User-facing status format

When asked for status, lead with outcomes and use this compact structure:

```markdown
Current objective: ...

Active lanes:
- Worker — responsibility — status

Needs review:
- ...

Blocked:
- ...

Next lead action: ...
```

Never claim work is active, approved, pushed, or complete without current evidence.

## End-of-turn handoff

Before ending a materially changed project-lead turn:

1. Update `docs/PROJECT_STATE.md`.
2. Update only the affected items in `docs/PROJECT_CHECKLIST.md`.
3. Ensure new durable decisions are recorded under the decision log.
4. List uncommitted coordination documents in the state record.
5. Leave one concrete next lead action that a fresh chat can execute immediately.

## Resources

- `references/reading-map.md` explains what each durable source is for.
- `evals/evals.json` contains fresh-chat alignment scenarios for validating this skill.
- `scripts/snapshot-project.ps1` prints current repository/runtime facts without modifying files.
