# Workflow handover (2026-08-13)

You asked for a clear handoff checkpoint and agent ownership. This is the current one.

- External diagram source: the authoritative workflow diagram is currently on the shared FigJam board (not checked into this repo), so it does not appear in `rg --files`. If we need an in-repo canonical copy, we should regenerate it here in `docs/` as a local image/markdown snapshot.
- Active in-repo plan references:
  - `docs/HANDOVER_DEV_TEAM_2026-08-11.md`
  - `docs/TEAM_WORKFLOW.md`
  - `scripts/db/schema-manifest.json`
  - `.agents/skills/sql-expert/SKILL.md`
  - `.agents/skills/early-years-music-expert/SKILL.md`

## Who is handling what now

- **Team lead / primary implementation + UX loop:** `Codex`
  - Owns import pacing, route/UX corrections, verification checks, and next actions.
- **Schema + DB write lead:** `sql-expert`
  - Governs `data/omhas.db` changes, migrations, FK/integrity checks, and recovery artifacts (schema manifests, check scripts).
  - Required pre-write step: run schema check (`python scripts/db/check_schema.py`) for relevant tables before writing.
- **Curriculum/sources educational interpretation:** `early-years-music-expert`
  - Sources + evidence extraction, actions/chords provenance, curriculum tags/taxonomy proposals.
  - Works with `sql-expert` for the write.
- **Low-cost mechanical preprocessing:** (configured as needed)
  - `Python` scripts for inventory/normalization/dedupe candidates.
  - `Ollama` for local extraction/classification where possible.
  - `Hermes` for long-context database-oriented processing and enrichment.
- **UI/runtime verification (as available):**
  - `agent-browser` or local browser checks for `/search` and `/songs/[id]`.

## Model-routing contract (token-efficient mode)

- `Hermes` is the execution persona for `sql-expert` and all long-context SQL/data enrichment work.
- `OpenAI/Codex` owns orchestration, concise approvals, and verification surfaces only (`/search`, `/songs/[id]` sampling), not bulk import logic.
- `Python` + `Ollama` handle deterministic preparation: inventory, normalization, duplicate candidates, and low-cost classification.

## Current source of truth

- `data/omhas.db` is the single managed dataset.
- We use:
  - strict evidence-backed imports (not synthetic source data),
  - `research_wip` for unresolved material,
  - one-to-many relations for songs/topics/resources,
  - inherited taxonomy in `tags`.

## Practical check list (for every batch)

- [x] Verify schema fingerprint before writes (`check_schema.py`).
- [x] Process in batches; quarantine failures, keep the flow moving on other files.
- [x] Rebuild/check search and retrieval evidence for representative queries:
  - `circle time animal songs with bunnies`
  - `fingerplays with ponies`
  - `animals with ponies`
- [x] Post results to `/search` and touched `/songs/[id]` links.
- [ ] Add local handoff snapshot file for the latest diagram state after this pass.
