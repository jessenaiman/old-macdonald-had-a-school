# Team Workflow

Every worker reads `AGENTS.md`, `docs/PROJECT_CHECKLIST.md`, and this file before changing the project.

## Roles

- **Implementation worker:** edits only its assigned write set and cannot approve its own work.
- **Figma reviewer:** never authors the visual surface it reviews. It compares the running implementation against the approved Figma reference after every visual batch.
- **Runtime/QA reviewer:** checks `/next-dev-loop`, responsive behavior, accessibility, links, printing, and automated tests.
- **Git steward:** stages only reviewed files, creates the milestone commit/branch, pushes it, and opens or updates the draft pull request.
- **Team lead:** defines acceptance criteria, resolves reviewer findings, and gives final approval.

## Required visual loop

1. Start from an exact approved Figma/screenshot target and implement it
   directly. If any visual departure, reinterpretation, or new design choice is
   proposed, create a rendered image prototype and get user approval first; do
   not seek approval through prose alone. Post-implementation screenshots are
   QA evidence, not a pre-approval gate for faithful spec work.
2. The implementation worker names the routes, components, and visible states changed.
3. The worker runs the installed `/next-dev-loop` and reports runtime evidence.
4. The independent Figma reviewer captures the running page at the same viewport and state as the approved reference.
5. The reviewer places the reference and implementation together, then records visible differences in hierarchy, spacing, type, palette, icons, imagery, borders, cropping, responsiveness, and interaction states.
6. The reviewer returns one verdict: `APPROVED` or `CHANGES REQUIRED`.
7. `CHANGES REQUIRED` returns to the implementation worker. Repeat until approved.
8. Screenshot review does not replace keyboard, link, print, accessibility, or runtime checks.

## Check-in and review gate

Workers in the shared checkout do **not** commit or push independently while other workers are editing. They report their exact changed files to the team lead.

After a batch is approved:

1. The Git steward reviews `git status` and the scoped diff.
2. The Git steward stages only the files belonging to the approved batch.
3. The commit message names the lane and outcome, for example `homepage: align navigation with Figma`.
4. The steward pushes an integration branch and opens or updates a draft pull request against `main`.
5. The pull request records:
   - scope and changed routes;
   - Figma references and matching-viewport screenshots;
   - `/next-dev-loop` evidence;
   - automated checks;
   - reviewer verdict and unresolved risks.
6. An author cannot approve its own batch. The team lead accepts the independent review before merge.
7. `main` remains the last reviewed checkpoint. Do not push unreviewed implementation directly to `main`.

When a worker has an isolated Git worktree, it may use its own `agent/<lane>` branch and draft pull request. Shared-checkout workers follow the centralized Git-steward flow above to prevent branch and staging conflicts.

## Active-QA progress checkpoints

The team lead may create a local `wip:` checkpoint while visual or runtime QA is
still underway, so a context handoff can recover the exact files and evidence.
These commits must state `QA IN PROGRESS` and must never be described as an
approved milestone or pushed to `main`. The Git steward creates the reviewed
integration commit only after the independent visual verdict and runtime gates
pass.

## Model use

- Start implementation and review lanes on Luna.
- Escalate an implementation worker to Terra if it stalls or fails the design/runtime gate.
- A reviewer may be escalated to Terra when the comparison requires stronger visual or architectural judgment.
