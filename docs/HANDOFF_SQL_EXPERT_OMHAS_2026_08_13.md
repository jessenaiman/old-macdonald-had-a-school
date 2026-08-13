# Handoff: `sql-expert` takeover instructions (OMHAS 2026-08-13)

## Objective
Take over deterministic DB ownership for `data/omhas.db` and continue the import/curation pipeline while preserving low-token workflow:

- bulk extraction and tagging support from Python/Ollama/Hermes,
- authoritative writes by SQL expert only,
- non-blocking quarantines so one bad source does not stop the run.

`data/omhas.db` is the single managed dataset.

---

## 0) Non-negotiables (must follow every run)

1. Use schema fingerprint pre-check before each write:
   - `python scripts/db/check_schema.py --tables <relevant tables>`
   - Proceed only if status is `schema unchanged`.
   - If `schema changed` or `schema check failed`, STOP data writes and run `python scripts/db/inspect_schema.py`.
   - For schema changes: inspect complete schema, update `src/db/schema-sqlite.ts`, add migration in `src/db/migrations-sqlite`, regenerate `scripts/db/schema-manifest.json`.
2. Scope: `data/omhas.db` only.
3. Source-first, review-safe:
   - Do not invent lyrics/actions/chords/curriculum links.
   - Unknowns stay as `research_wip`/uncertainty fields, never fabricated.
4. No extra DB copies on every insertion. Git commits are rollback points.
5. Keep imports idempotent. If re-run, do not create duplicates.
6. Always log batch results with row deltas + validation status.

---

## 1) Start-of-shift intake checklist

Run in project root:

```bash
python scripts/db/check_schema.py
python scripts/resources/validate_resource_workflow.py
python scripts/resources/resource_completion_report.py
python scripts/resources/run_resource_pipeline.py --limit 10
```

Then continue only if:

- `integrity_ok` is true
- `foreign_key_violations == 0`
- `fts_parity == true`

(Pending files are normal; we continue in batch mode.)

---

## 2) Data ownership split

- `resource_file_inventory` + `resource_file_dispositions` define lifecycle.
- `research_wip` stores unverified evidence and is not user-facing.
- `songs` / `song_sections` / `song_actions` / `song_chord_guides` / `song_sources` / `topic_materials` contain verified surfaced records.
- `topic_materials` is the main lesson-curriculum bridge for `/songs` rendering.
- `age_range` is supplemental context; `grades` + `topic_grades` are primary curriculum organization.
- Inheritance is stored in `tags.parent_tag_id` (no active `tag_hierarchy` table currently).
- Use legacy `curriculum_topics` only as supplemental legacy mirror; prefer canonical `topics`, `topic_materials`, `topic_grades`, `song_curriculum_links`.

---

## 3) Processing contract per batch

A batch may be:

- File parsing batch (manifest JSON / text packet)
- Song import batch (lyrics/sections/actions/chords)
- Enrichment batch (curriculum/topic links)

### Pre-write required per batch

Before every write:

```bash
python scripts/db/check_schema.py --tables resource_file_inventory resource_file_dispositions songs song_sections song_actions song_chord_guides song_sources source_documents song_curriculum_links tags topic_tags material_tags topic_materials topic_grades curriculum_topics curriculum_topic_songs topics
```

If any table is unknown, STOP and fix this handoff.

### Run/validate loop

For each batch:

1. Process prepared payload.
2. Apply in a transaction.
3. Run:
   - `PRAGMA foreign_key_check`
   - `PRAGMA integrity_check`
   - search parity check between `search_chunks` and `search_chunks_fts`
4. Disposition all source files in batch: `processed`, `research_wip`, `quarantined`, `unsupported`, `intentionally_excluded`.
5. Report row deltas:
   - songs inserted/updated
   - sources attached
   - sections/actions/chords attached
   - curriculum/link rows inserted
   - unresolved count

---

## 4) Exact extraction handling

- Exact title/lyrics matches from prepared manifest:
  - attach as additional source links to canonical songs.
  - Do not modify canonical lyrics/sections for duplicate/same-version sources.
- Materially different variants:
  - preserve separately (distinct `song_sources` + provenance evidence).
- Chords:
  - preserve source precision levels only: line / section / song-level progression.
  - Mark provenance: documented vs suggested.
- Actions:
  - align at lyric-line only when explicit alignment exists.
  - align at section when explicitly stated.
  - default to song-level action notes when only general guidance exists.

---

## 5) Curriculum and tag enrichment protocol

For each song batch:

- Connect songs to existing `curriculum_topics` and `topic_materials` when source has explicit pedagogical context.
- Connect to `topic_grades` and `topics` where available.
- Add tags only from documented sources or clearly evidenced inference.
- Maintain inherited tags with `tags.parent_tag_id` recursion (legacy `tag_hierarchy` references are stale).
- Candidate queue is preferred over direct creation for uncertain new tags.

---

## 6) What to return in handoff messages

Each run message should include:

- Batch id and source file ids processed.
- `status`: completed / partial / quarantined.
- `schema`: fingerprint unchanged + migration state.
- `rows`: counts changed by table.
- `integrity`: FK + integrity + FTS parity results.
- `retrieval`: one sample `/search` and one `/songs/<id>` URL that changed/validated.
- `exceptions`: unresolved/quarantined files and reasons.

---

## 7) Quick status script

Use this exact snapshot:

```bash
powershell -ExecutionPolicy Bypass -File scripts/resources/monitor-workflow.ps1
```

It prints:
- completion/disposition percentages
- validation checks
- next 10 pending files
- helper-process health

---

## 7b) Mandatory per-batch run loop (dispatch + validate + report)

Use this exact loop and send progress after each cycle:

```powershell
$sourceRoot = "docs/early-years-music-resources/song_versions"
$batchSize = 10
$offset = 0
$batch = 1

while ($true) {
  $batchId = ("sql-expert-batch-{0:d3}" -f $batch)

  # 1) Apply one exact-match batch
  python scripts/resources/process_song_exact_batch.py `
    --source-directory $sourceRoot `
    --offset $offset `
    --batch-size $batchSize `
    --batch-id $batchId `
    --apply
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Batch ended/failed: exit $LASTEXITCODE (exit 1 likely means no more source files)."
    break
  }

  # 2) Validate schema contract (targeted tables)
  python scripts/db/check_schema.py --tables `
    resource_file_inventory resource_file_dispositions songs song_sections song_actions song_chord_guides song_sources source_documents song_curriculum_links tags topic_tags material_tags topic_materials topic_grades curriculum_topics curriculum_topic_songs topics
  if ($LASTEXITCODE -ne 0) { Write-Host "Schema check failed; stop and fix contract."; break }

  # 3) Validate integrity + report
  python scripts/resources/validate_resource_workflow.py
  $validateCode = $LASTEXITCODE
  python scripts/resources/resource_completion_report.py
  if ($validateCode -ne 0) { Write-Host "Validation failed this batch; continue next batch if errors are quarantinable." }

  # 4) Advance
  $offset += $batchSize
  $batch += 1
}
```

Notes:
- `process_song_exact_batch.py` is intentionally narrow and only exact-match source attachment.
- For broader review (variation/new song insertion), run reviewed-source flow separately (`scripts/songbook/plan_song_import.py`, `scripts/songbook/prepare_song_evidence.py`, then manual review).

---

## 8) Minimal “open handoff” command string (send to sql-expert)

```text
You are taking over OMHAS imports as sql-expert. Use this mode:
1) run schema check pre-write: `python scripts/db/check_schema.py --tables resource_file_inventory resource_file_dispositions songs song_sections song_actions song_chord_guides song_sources source_documents song_curriculum_links tags topic_tags material_tags topic_materials topic_grades curriculum_topics curriculum_topic_songs topics`
2) if changed, stop and run full schema inspect.
3) process pending files in batches of up to 10 using worker packets.
4) quarantine unresolved files; never block the full run on one row.
5) after each batch: FK + integrity + FTS parity.
6) enrich songs with curriculum/tags only from source/verified evidence.
7) publish batch summary + retrieval sample links.

Hard rule: never use legacy/nonexistent targets: no `tag_hierarchy`, `song_chords`, `songs_tags`, `song_tags`, `tag_hierachy`.

Reference: `.agents/skills/sql-expert/SKILL.md`, `scripts/db/check_schema.py`, `scripts/resources/monitor-workflow.ps1`.
```

---

## 9) Suggested immediate next 3 batches

- Batch A: remaining major songbooks in `docs/early-years-music-resources` that are pending.
- Batch B: unresolved exact-match links and duplicate candidates.
- Batch C: non-song resource types (stories/books/resources) to complete resource file lifecycle.

---

## 10) Gatekeeper

Only stop-and-escalate for:

- schema fingerprint mismatch before writes,
- unexpected data-model constraint failures,
- script/runtime errors not limited to one source row,
- destructive risk to existing verified rows.

Everything else continues in batch mode with quarantines.
