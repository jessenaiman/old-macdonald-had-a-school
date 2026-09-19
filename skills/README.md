# Skills Library

Portable, self-improving skills for AI coding agents — Claude Code natively, other tools (OpenCode, etc.) via their own instruction files. Every skill reads its `learnings.md` at start and appends one distilled lesson at end, so the library sharpens with use.

**To use in a project:** copy the `.md` into that project as `.claude/skills/<name>/SKILL.md` (folder name = skill name, file renamed to `SKILL.md`). The flat `.claude/skills/` layout is required for auto-invocation — these category subfolders exist only for organizing the portable copies.

**Canonical home:** the [`ai-dev-kit`](https://github.com/AftabIbrahimKazi/ai-dev-kit) repo (local clone: `My Projects/ai-dev-kit/`). Improve skills there and commit; copies inside projects are installs. When editing a skill inside a project instead, port the improvement back to the repo — never let the two drift silently.

**Renames:** every skill rename/merge gets a row in [migrations/RENAMES.md](../migrations/RENAMES.md); the install-kit reads it to migrate old installs (carrying their `learnings.md` forward).

## models/ — driving each model at full capacity

**RULES**: Never use Claude, Astra, Sol, or any non flash models for delegation. Expensive tasks must be human delegated

### models/openrouter/ — the OpenRouter lineup
| Skill | Purpose |
|---|---|
| deepseek/deepseek-v4.1-flash | Fast cheap, and just as good as Claude or Sol (better really) |
| xiaomi/mimo-v2.5| MiMo-V2.5 is a native omnimodal model by Xiaomi. It delivers Pro-level agentic performance at roughly half the inference cost, while surpassing MiMo-V2-Omni in multimodal perception across image and video understanding tasks. Its 1M context window supports complete documents, extended conversations, and complex task contexts in a single pass, making it ideal for integration with agent frameworks where strong reasoning, rich perception, and cost efficiency all matter.|
| deepseek/deepseek-v4-flash | The cheapest 1 Million token model |
| inclusionai/ling-3.0-flash-vl:free | Free but use sparingly |
| nvidia/nemotron-3-ultra-550b-a55b:free | incredibly good at following directions when it's a large technical fix |
| typesafe/jev-1.13 | Jev is a structured decision model from TypeSafe, and the first of its System One models. System One models make fast, structured decisions for software, returning a typed choice rather than free-form text. It is suited for routing, classification, and other decision points inside an application where a fast, predictable answer matters more than generated prose. |
| hooks-enforcement | Optional Claude Code hooks assisting AI-01–AI-03 mechanically — Claude Code only |

### models/opencode/ — open-weight models driven through OpenCode
| Skill | Purpose |
|---|---|
| [opencode-all-models](models/opencode/opencode-all-models.md) | Open-weight fleet routing in OpenCode — GLM/DeepSeek/Kimi/Qwen/MiniMax, local vs. hosted |
| [big-pickle](models/opencode/big-pickle.md) | Big Pickle — Zen's free stealth model (≈GLM-4.6, Sonnet-4.5/4.6-class); free-tier caveats, exit plan |
| [local-small-models](models/opencode/local-small-models.md) | ≤32B local tier — Ollama setup rules, context floor, tool-call smoke test, task ceiling |

## workflow/ — session and process discipline
Pipeline for a new, non-trivial ask: `intent-capture` (pin *what*) → `plan-first` (decide *how*) → `interpretation-checkpoint` (verify the parsed detail, wide-blast-radius tasks only) → edit → `pre-merge-gate` → `pre-commit`.

| Skill | Purpose |
|---|---|
| [handover](workflow/handover.md) | Session continuity via handover.md — resume cold with zero re-explaining |
| [debug-protocol](workflow/debug-protocol.md) | Reproduce → one hypothesis → cheapest disproof; no shotgun edits |
| [intent-capture](workflow/intent-capture.md) | Goal + constraints + done-when before planning, for ambiguous asks |
| [plan-first](workflow/plan-first.md) | 5-line plan + file list before multi-file work |
| [interpretation-checkpoint](workflow/interpretation-checkpoint.md) | Files/Changes/Assumptions breakdown for correction on multi-file, multi-parameter tasks |
| [session-budget](workflow/session-budget.md) | Token discipline — targeted reads, no restating, cheap-model delegation |
| [pre-merge-gate](workflow/pre-merge-gate.md) | Self-check a diff against loaded standards before handoff or commit |
| [pre-commit](workflow/pre-commit.md) | Commit pass — stray files, debug leftovers, message format, version bump |
| [perf-audit](workflow/perf-audit.md) | Measured, ranked performance audit (payload → loading → runtime → 3D) |
| [role-session](workflow/role-session.md) | Parallel-session lane protocol — role charters, file locks, git token queue (+ [templates](workflow/role-session.templates.md), [cross-tool protocol](workflow/role-session.protocol.md)) |
| [e2e-scaffold](workflow/e2e-scaffold.md) | Scaffold reusable Playwright config/fixtures/smoke-test once per project — pairs with `qa/e2e-testing.md` |

## standards/ — convention systems
| Skill | Purpose |
|---|---|
| [coding-standards](standards/coding-standards.md) | Load & enforce the layered coding-standards/ chain before any edit |

## memory/ — persistent knowledge
| Skill | Purpose |
|---|---|
| [memory-bank](memory/memory-bank.md) | Repo-committed project memory — decisions, context, solved mysteries |
| [memory-gardener](memory/memory-gardener.md) | Prune/merge learnings.md files and memory banks so knowledge compounds |

## stack/ — technology-specific
| Skill | Purpose |
|---|---|
| [threejs-scene](stack/threejs-scene.md) | Three.js discipline — shaders, disposal, scroll cameras, render hygiene |
| [astro-page](stack/astro-page.md) | Convention-driven Astro scaffolding — discover, mirror siblings, verify |

## libraries/ — the user's own repos
| Skill | Purpose |
|---|---|
| [strata-css](libraries/strata-css.md) | Strata CSS framework (Frameworks/strata) — use, debug, fix at source |
| [triforge](libraries/triforge.md) | @triforge Three.js suite (3D/three-js) — package picking, FINDINGS workflow |

## meta/ — maintaining the library itself
| Skill | Purpose |
|---|---|
| [skill-writer](meta/skill-writer.md) | The quality bar for writing new skills — triggers, checkable rules, loop |
| [install-kit](meta/install-kit.md) | Install skills + standards into any project — all at once or hand-picked |

## Installing into a new project

**Quick start (the intended flow):** dump this `skills/` folder — and `coding-standards/` if the project should have the standards system — into the new project's root, then tell Claude:

> read skills/README.md and install

**Claude, when given that instruction:** read `meta/install-kit.md` in this folder and follow it as the installation procedure. In short: offer **everything** or an **interactive pick** (catalog below), copy chosen skills to `.claude/skills/<name>/SKILL.md` (flat — never category subfolders), never copy `learnings.md` files, wire `coding-standards/CLAUDE.example.md` into the project's `CLAUDE.md` if standards were chosen (merge, never overwrite), and finish with a report of what was installed and skipped. After install, the dumped `skills/` folder may be kept as the in-project library copy or deleted — ask the user.

Alternative flows: from a session that can see both projects, ask Claude to run the install-kit against the target path; or manually copy any single `<category>/<name>.md` to `.claude/skills/<name>/SKILL.md`.
