# Next-Chat Operator Runbook (2026-08-13)

This runbook is the single execution contract for the next chat instance.

## Table of contents

- [Core principle](#core-principle)
- [Operating order](#operating-order)
- [Script contracts](#script-contracts)
- [Safe batch command templates](#safe-batch-command-templates)
- [Validation and handoff checks](#validation-and-handoff-checks)
- [Monitoring and emergency stop](#monitoring-and-emergency-stop)
- [Notes for sql-expert handoff](#notes-for-sql-expert-handoff)

## Core principle

- `data/omhas.db` is the only managed source.
- For writes, use `--tables`-targeted schema checks; do not read full schema every time.
- Treat this as a queue flow:
  1. inspect discovery state,
  2. prepare evidence,
  3. apply only the safe/write steps,
  4. validate,
  5. verify teacher-facing UI.
- Every automation run must finish with a validation pass and at least one `/search` + `/songs/[id]` proof link.

## Operating order

Use this order for each file batch unless blocked:

1. **Schema check gate (always before data writes)**

```bash
python scripts/db/check_schema.py --tables songs song_sources source_documents song_curriculum_links topic_materials
```

Interpretation:

- `status: "schema unchanged"` → continue.
- `status: "schema changed"` or `status: "schema check failed"` → run a full inspect and stop for review.

2. **Resource inventory and disposition control**

```bash
python scripts/resources/inventory_resources.py --apply --root docs --root data
python scripts/resources/validate_resource_workflow.py
python scripts/resources/resource_completion_report.py
```

3. **Song evidence preparation**

Create bounded, local-only manifests (no SQLite writes):

```bash
python scripts/songbook/prepare_song_evidence.py \
  --source-directory docs/early-years-music-resources \
  --limit 100 --format jsonl \
  --max-runtime-seconds 180 \
  > scripts/resources/batch_XX_prepared.jsonl
```

4. **Exact reviewed-source attachment pass (if safe)**

Only use this when manifests show safe reviewed attachments.

```bash
python scripts/songbook/plan_song_import.py \
  --source-directory docs/early-years-music-resources \
  --format summary --max-runtime-seconds 180

python scripts/songbook/plan_song_import.py \
  --source-directory docs/early-years-music-resources \
  --apply-exact-sources --max-runtime-seconds 180
```

5. **Mechanical exact transcription attachment (research_wip references)**

```bash
python scripts/songbook/process_song_exact_batch.py \
  --source-directory scripts/resources/batch_02_src \
  --batch-id mech-exact-2026-08-13-a \
  --batch-size 25 --offset 0 \
  --max-runtime-seconds 60

python scripts/songbook/apply_exact_transcription_links.py \
  scripts/resources/batch_02_exact.jsonl \
  --batch-id mech-exact-apply-2026-08-13-a --apply \
  --max-runtime-seconds 180
```

6. **Curriculum linkage passes**

Conservative deterministic enrich:

```bash
python scripts/songbook/enrich_song_curriculum_links.py \
  --offset 0 --limit 250 --dry-run --max-runtime-seconds 300
python scripts/songbook/enrich_song_curriculum_links.py \
  --offset 0 --limit 250 --max-runtime-seconds 300
```

LLM-assisted link pass:

```bash
python scripts/songbook/link_songs_to_curriculum.py \
  --offset 0 --limit 25 --dry-run --max-runtime-seconds 300
python scripts/songbook/link_songs_to_curriculum.py \
  --offset 0 --limit 25 --max-runtime-seconds 300
```

7. **Post-write checks + proof**

```bash
python scripts/resources/validate_resource_workflow.py
python scripts/db/check_schema.py --tables songs topic_materials search_chunks_fts search_chunks
curl "http://localhost:3000/api/search?q=circle%20time%20animal%20songs%20with%20ponies"
curl "http://localhost:3000/api/search?q=fingerplays%20with%20ponies"
```

Then open:

- `http://localhost:3000/search?q=circle%20time%20animal%20songs%20with%20ponies`
- A matching `http://localhost:3000/songs/[id]` route

## Script contracts

Each script is run with the runtime guard and safe args by default.

- `scripts/db/check_schema.py`: gate for writes; accepts `--tables`.
- `scripts/db/inspect_schema.py`: full schema capture for schema drift.
- `scripts/resources/inventory_resources.py`: discovers files and writes dispositions.
- `scripts/resources/run_resource_pipeline.py`: dispatch packet builder for pending files.
- `scripts/songbook/prepare_song_evidence.py`: local-only structured extraction (optional Ollama proposals).
- `scripts/songbook/plan_song_import.py`: plan + optional exact reviewed attachments.
- `scripts/resources/process_song_exact_batch.py`: writes only source references for exact mechanical candidates.
- `scripts/songbook/apply_exact_transcription_links.py`: deterministic manifest-to-DB importer for exact unreviewed transcription links.
- `scripts/songbook/enrich_song_curriculum_links.py`: conservative keyword/topic enrichment from song text.
- `scripts/songbook/link_songs_to_curriculum.py`: broader song-topic linking + updates to `songs`.
- `scripts/songbook/enrich_song_curriculum_links.py` and `scripts/songbook/link_songs_to_curriculum.py` are mutually useful; run both in sequence when possible.
- `scripts/resources/validate_resource_workflow.py`: integrity/fk/ftsm parity and unresolved checks.
- `scripts/resources/resource_completion_report.py`: quick progress snapshot.
- `scripts/resources/resolve_taxonomy.py`: validate inherited tag ancestry for a proposed term.

## Safe batch command templates

- Standard song window:
  - `--offset 0 --limit 25` (or 50 after steady state).
- Runtime caps:
  - `prepare_song_evidence.py`: 180 sec
  - `plan_song_import.py`: 180 sec
  - `process_song_exact_batch.py`: 60 sec
  - `apply_exact_transcription_links.py`: 180 sec
  - `enrich_song_curriculum_links.py`: 300 sec
  - `link_songs_to_curriculum.py`: 300 sec
  - `run_resource_pipeline.py`: none (set when needed)
- Always pass `--max-runtime-seconds` for long loops.
- Always use `--apply` only after dry-run review (or explicit reviewed decision for that batch).

## Validation and handoff checks

Per batch, capture these outputs and include in handoff:

- `python scripts/resources/validate_resource_workflow.py`
- `python scripts/resources/resource_completion_report.py`
- `python scripts/db/check_schema.py --tables ...` used for that write
- one sample from `/search`
- one sample from `/songs/[id]`
- `git status --short` + commit message

If any check fails, quarantine unresolved rows in DB and continue with next batch.

## Monitoring and emergency stop

To spot runaway processes after reboot/check:

```powershell
Get-Process node,python,ollama -ErrorAction SilentlyContinue |
  Where-Object { $_.StartTime -lt (Get-Date).AddMinutes(-15) } |
  Sort-Object StartTime |
  Select-Object Id, ProcessName, StartTime, CPU
```

Stop only by process if needed:

```powershell
Stop-Process -Id <pid> -Force
```

`--max-runtime-seconds` was added to the hot loops specifically to avoid this.

## Notes for sql-expert handoff

1. Only target actual tables and contracts for real inserts/updates (not full-schema dumps): pass `--tables ...` first for every write.
2. Use minimal provenance payloads: source locator, relationship, review state, checksum, and batch id.
3. Keep curriculum/tag updates on `topic_materials`, `song_curriculum_links`, and `curriculum_topic_songs` where relevant.
4. Preserve unresolved and contested records in `research_wip` with quarantine/retry metadata; do not auto-resolve ambiguity.
5. Send local-safe summary + schema fingerprint result to downstream agents as a small status blob (no extra strategy text).

This satisfies the operating rule: target real tables, keep the pipeline bounded, and minimize token waste on repeated schema review. :codex-annotation{index="1"}
