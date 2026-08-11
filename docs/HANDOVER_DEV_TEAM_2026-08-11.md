# Handover — Database, Standards, Search & Lesson Data (2026-08-11)

**To:** Dev team
**From:** Database/curriculum work session
**Status:** ✅ Committed (`49151f9` + later merges) except `app/api/search/route.ts` fix (⚠️ uncommitted — see §5)

---

## 1. TL;DR

The database was restructured from two parallel, half-fabricated systems into **one verified, relationally clean curriculum model**. All standards text is now sourced from official documents (no fabricated codes). Search is hybrid keyword + semantic and was just fixed to match the renamed schema. The lesson page now renders **directly from curriculum data** via a read-only query layer.

---

## 2. Schema state (live: `data/omhas.db`)

All tables are **lowercase** (migration 0002). Key renames:

| Old | New |
|---|---|
| `TOPICS` | `topics` |
| `TOPICS.lesson_topic` | `topics.topic` |
| `TOPICS.skill_statement` | `topics.skill` |
| `TOPICS.seq_num` | `topics.sequence` |
| `TOPICS.merged_into_topic_id` | `topics.merged_into` |
| `TOPICS.circle_time_slot` | `topics.circle_time` |
| `SONGS` / `SONGS.song_name` | `songs` / `songs.title` |
| `SUBJECTS, GRADES, STANDARDS, TAGS, RESOURCES, MATERIAL_TAGS, MATERIAL_RELATIONS, TOPIC_GRADES, TOPIC_MATERIALS, TOPIC_STANDARDS, TOPIC_TAGS, WEEKLY_PACING, SOURCES, ACTIVITIES, BOOK_SUGGESTIONS` | same names, lowercase |
| `STANDARDS` (+) | `standards.frames` column added (migration 0005 — OKP frame membership BC/SRWB/DLMB/PSI) |

**Deleted (empty/boilerplate):** `lesson_blueprints`, `lesson_materials`, `lesson_resource_guidance`, `lesson_review`, `lesson_search_prompts`, `lesson_song_guidance`, `lesson_steps`, `worksheet_briefs` (migration 0001). **7,634 boilerplate rows removed.** The "lesson" is now the curriculum topic + MDX files, NOT a DB table.

**`lesson_assets` now links to curriculum:** `topic_id → topics.id`, not a lesson table.

**New tables:** `song_curriculum_links` (5,021 parsed rows), plus filled `material_tags` (+4,019), `topic_standards`/`topic_tags`/`topic_materials` denormalized from raw text.

**Authoritative extra:** official PDFs preserved in `docs/curriculum-sources/` (Kindergarten Program 2016, NGSS DCI 2013, Common Core ELA 2023). **Do not delete** — they're the re-audit source. They're large; consider `.gitignore` if the team prefers not to version them.

---

## 3. Standards — now 100% verified text

Every framework's `full_text` is populated and sourced from official documents. Fabricated rows found & replaced:

| Framework | Rows | What was fixed |
|---|---|---|
| **Ontario Kindergarten Program** | 157 (31 OE + 126 SE) | **Was 69 fabricated rows** with invented 6-domain structure + OE codes up to 37. Rebuilt from the real 2016 PDF: 4 frames, OE 1–31, proper OE→SE parent links. `frames` column added. |
| **NGSS** | 51 (K-3 PEs) | **Was 21 rows, 3 with text.** Added all K + Gr1-3 performance expectations verbatim from the 2013 PDF. Removed fabricated `3-PS1-3` (doesn't exist in NGSS; remapped topic → `RF.3.3.d` analog handling). |
| **US Common Core** | 437 | Filled 8 empty real codes (RL/RI/W ×1–3) from official PDF; **removed fabricated `RF.3.3.g`** (RF.3.3 has only a–d) and remapped its subject link. |
| **ELECT** | 34 | All descriptions filled (was 0). |
| **ELOF** | 51 | All outcome text filled (was ~25). |
| **CASEL** | 5 | Completed to all 5 competencies (was 3) with official definitions. |
| **SHAPE America** | 5 | Completed to all 5 standards (was 2) with S1–S5 text. |

**Rule going forward:** NEVER fabricate standard codes/text. Verify against `docs/curriculum-sources/*.pdf` — several "plausible" codes in the old import turned out to be invented (OE 32–37 OKP, `RF.3.3.g`, `3-PS1-3`).

**Topic links:** All existing `topic_standards` links were remapped by exact code to the rebuilt standards; unmatched legacy science topics (What Makes Things Move?, Simple Machines, etc.) were mapped to best-fit real expectations (OE 13/14/24).

---

## 4. Search — architecture & the just-applied fix

`app/api/search/route.ts` now runs **hybrid search**:
- **Structured keyword** — weighted scoring over `topics.topic/skill/category/tags/standards` with synonym expansion (`RELATED_TERMS`).
- **FTS5** — `search_chunks_fts` on resource chunks (1,429 chunks, embeddings regenerated as proper 384-dim float arrays in this session).
- **Semantic** — MiniLM (`Xenova/all-MiniLM-L6-v2`, local model cache in `node_modules/@xenova/transformers/.cache`) cosine similarity vs chunk embeddings, blended 50/50 with keyword rank → `searchMode: "hybrid-keyword-semantic"`.
- **Lessons** — searches the **MDX lesson files** in `content/lessons/` (metadata title/subject/grade/summary/focus) — the old `lesson_blueprints` DB query was removed with the table.

**⚠️ CRITICAL — uncommitted fix.** The search route was broken against the renamed schema (`no such column: t.lesson_topic`, and `lesson_blueprints` → missing table). The fix is in the working tree but **not yet committed**:
```
M app/api/search/route.ts
```
Please include it in the next commit. After fixing: `curl "localhost:3000/api/search?q=fingerplay"` returns `searchMode: hybrid-keyword-semantic`, ~45 results.

**Notes:**
- The embedder is lazy-loaded per server process; first request after boot compiles/loads the model (~seconds), later requests are fast. `@xenova/transformers` is a devDependency + the ONNX model (~22 MB) is cached locally.
- If the model cache is missing, the semantic path fails **softly** (falls back to keyword-only; logs a warning). Do not let semantic failure break the route.

---

## 5. Lesson page — data-driven rendering

New standalone route `/topics/[slug]` renders a lesson **directly from curriculum data** (no MDX required; MDX still wins at the grade routes):

- `lib/curriculum-lesson.ts` — read-only query layer assembling: topic + skill + grades(age ranges) + standards (grouped by framework, incl. OKP frames) + tags + materials (focus/supporting, songs w/ lyrics/actions/instructions + resources) + `lesson_assets` printables + weekly pacing. Queries the **renamed** lowercase schema.
- `components/curriculum/CurriculumLessonPage.tsx` — teacher workspace: header w/ grade/age/circle-time/pacing badges, "rapid glance" strip (songs·resources·standards·printables), standards grouped by framework, focus materials ("start here"), supporting bank, printables, teacher planning notes.
- `lib/slug.ts` — slug helpers.
- `app/topics/[slug]/page.tsx` — `generateStaticParams` over `getAllCurriculumLessons()` (387 topics), skips merged topics.

**Watch-outs:**
- `getCurriculumLessonBySlug` is fuzzy (matches first distinct slug word). Exact-match pass runs first; merged topics are excluded.
- `topic_materials.use_in_phase` is **100% NULL** in current data — the page groups by `role` (focus/supporting) only. If you want Watch→Try→Practice→Check phases, that's a data-fill task, not a component change.
- Some compound topics still exist ("Tummy time & reaching") — only "Reaching & grasping" was split (into `Reaching`, `Grasping`, old row marked `merged_into`).

---

## 6. Drizzle / migration workflow (important)

- SQLite migrations live in **`src/db/migrations-sqlite/`** (NOT the old `src/db/migrations/` postgres folder).
- Config: `drizzle.sqlite.config.ts`. Generate: `npx drizzle-kit generate --config=drizzle.sqlite.config.ts --name <name>`.
- Migration history (apply order): `0000 baseline` → `0001 restructure_lesson_assets` → `0002 normalize_table_names` → `0003 normalize_field_names` → `0004 more_field_renames` → `0005 add_frames_column`.
- Baseline `0000` is marked applied (`__drizzle_migrations`) — the DB already reflects all six. **Do not re-run the baseline.**
- **Schema parity:** `src/db/schema-sqlite.ts` was synced to the renamed tables + `frames`. Keep it in sync via drizzle-kit; don't hand-edit the DB schema directly outside migrations.
- **SQLite + Windows gotcha:** ALTER TABLE RENAME on UPPERCASE→lowercase fails with "already exists" because Windows is case-insensitive → two-step rename through a temp name (this is baked into migration 0002).

---

## 7. Scripts (session artifacts, kept for reproducibility)

| Script | Purpose |
|---|---|
| `scripts/regenerate-embeddings.mjs` | Rebuilt all 1,429 chunk embeddings (384-dim float arrays) — fixed prior double-serialization bug. |
| `scripts/rebuild-okp-2016.mjs` | Rebuilt OKP framework from 2016 PDF (delete fabricated + insert 31 OE/126 SE + remap). |
| `scripts/remap-okp-science.mjs` | Best-fit mapping for legacy science topics (OE 32–37 → real OE 13/14/24). |
| `scripts/rebuild-ngss.mjs` | Rebuilt NGSS K-3 (51 PEs) from official PDF; removed fake `3-PS1-3`. |
| `scripts/fix-common-core.mjs` | Filled 8 real CC codes; removed fabricated `RF.3.3.g`. |
| `scripts/fill-casel-shape.mjs` | Completed CASEL 5/5 + SHAPE 5/5 with official text. |
| `scripts/fill-elect-elof.mjs` | Filled ELECT (34) + ELOF (26) descriptions. |
| `scripts/parse-curriculum-topics.mjs` | Parsed `curriculum_topics` raw text fields → relational tables. |
| `scripts/clean-songs-lyrics.mjs` | Extracted `*action*` markers from 31 songs' lyrics → `songs.actions`. |
| `scripts/audit-db-health.mjs` | FK-orphan + naming + duplicate + empty-text audit (run before big changes). |
| `scripts/audit-compound-topics.mjs` | Lists compound topic names for splitting. |
| `scripts/test-lesson-query.mjs` | Smoke-tests the lesson query layer. |

---

## 8. Known issues / debt (for the team)

1. **Pending commit:** `app/api/search/route.ts` search fix (see §4). Everything else in this doc's scope is committed.
2. **`curriculum_topics` (legacy flat table, 470 rows)** still exists, still populated, and `lib/curriculum-db.ts` + some routes still read it. It's the OLD schema mirror; `topics` (normalized) is canonical. Retirement plan: migrate remaining readers, then drop via migration. Its text fields (standards/tags/linked_songs/linked_resources) have been parsed into relations — safe to drop columns once readers are gone.
3. **Duplicate songs:** e.g. "Welcome Summer" ×4 — same song from multiple source PDFs, different `source_title`. Needs dedup with source-trace preserved.
4. **Raw text columns** on `songs` (`curriculum_links`, `early_years_links`, `tags`) and `curriculum_topics` still hold legacy values as audit trail. User decision pending on whether to drop (via drizzle migration).
5. **`topic_materials.use_in_phase`/`routine_slot`** null — data fill opportunity for lesson-phase modeling.
6. **Compound topic splitting** — only one done ("Reaching & grasping"); 200+ topics contain "&"/"and" but most are legitimate single standards. Review before splitting further.
7. **Semantic model is local-only** — works in dev (model cached). If CI/CD builds on another host, either pre-warm the cache or accept keyword-only fallback.

---

## 9. Quick verification commands

```bash
# Search works (after committing the route fix)
curl "http://localhost:3000/api/search?q=fingerplay"

# Standards are fully populated
sqlite3 data/omhas.db "SELECT framework, COUNT(*) FILTER (WHERE full_text != '') || '/' || COUNT(*) FROM standards GROUP BY framework;"

# No orphaned FKs
node scripts/audit-db-health.mjs

# Lesson page data
node scripts/test-lesson-query.mjs
```