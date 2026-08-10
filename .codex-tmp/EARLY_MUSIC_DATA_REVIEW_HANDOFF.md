# Early Music Data Review and North American Curriculum Handoff

## Mission

Improve the existing canonical database, `data/omhas.db`, systematically and row by row. Reconcile the early-music evidence in `C:\Users\jesse\OneDrive\Documents\New project\resources` with existing records, then add official North American curriculum framework releases with provenance. Do not create a replacement database and do not encode or re-encode vectors until reviewed relational records have been promoted.

The finished database must let a teacher search a curriculum topic or an exact state/province standard and see trustworthy, source-linked materials: songs, rhymes, fingerplays, stories/books, activities, movement, sensory experiences, crafts, videos, printables, and other teaching resources. A song is one possible teaching material, not the assumed center of every lesson.

## Correct interpretation of the resource folder

This is primarily a **reconciliation and research-closure project**, not a bulk import.

- All 1,642 rows in `songs\MANIFEST.yaml` have database IDs that exist in the current `SONGS` table, and all 1,642 titles exactly match their mapped database rows after normalization.
- The 1,642 manifest rows resolve to 1,636 unique database IDs. Investigate the six repeated mappings as possible repeated source rows or versions.
- Of 1,182 canonical catalog rows, 1,160 have one exact existing song-title match, 15 have multiple same-title candidates, and only 7 lack an exact title match.
- Of 1,182 captured Markdown files, 1,175 have a title already represented in `SONGS`.
- Therefore, never treat the master workbook, manifest, catalog, or captured folder as thousands of new songs. Most rows are evidence for improving existing records, attaching provenance, separating source versions, or closing duplicate research.

The immediate deliverable is a **closure ledger** assigning every in-scope source row/file one disposition:

- `already_complete`
- `existing_needs_fields`
- `existing_needs_source_version`
- `ambiguous_match`
- `new_entity_candidate`
- `research_only`
- `duplicate_snapshot`
- `rejected`
- `archivable_after_promotion`

No source directory is archived until every in-scope file has a checksum and disposition and every promoted fact can be traced back to it.

## Non-negotiable operating rules

- Work only in the OneDrive repository: `C:\Users\jesse\OneDrive\Documents\Endless Measures\Curriculum\old-macdonald-had-a-school`.
- Treat `data\omhas.db` as the one canonical database. Never create a replacement database.
- Never move, delete, overwrite, or copy database/vector files.
- Preserve every pre-existing worktree change. Begin each session with `git status --short`.
- Inspect first. No import, schema change, or vector change during the inventory phase.
- Write a migration and dry-run validator before changing `omhas.db`. Check in only the intentional migration/importer code before applying the migration.
- Apply each approved batch in one SQLite transaction with foreign keys enabled. Roll back on any validation failure.
- Never import a comma-separated tag, curriculum link, source, or material list into a final denormalized field when a relational table exists.
- Never invent lyrics, actions, standards, age suitability, teaching steps, citations, or alignments.
- A standards import does not prove a topic alignment. Topic-standard and topic-material relationships require separate evidence/review states.
- Do not encode staging candidates. Embed only promoted, reviewed search text; encode each incoming search query at runtime and cache repeated queries.
- Do not push, deploy, or touch Vercel during this data project.

## Verified starting state

### Canonical database

- `SONGS`: 1,767 rows; all currently unverified.
- `RESOURCES`: 40 rows; all currently unverified.
- `ACTIVITIES`: 0 rows.
- `BOOK_SUGGESTIONS`: 0 rows.
- `SOURCES`: 0 rows, while `source_documents` has 1,411 rows. Resolve this provenance duplication before adding another source table.
- `TOPICS`: 439; `TOPIC_GRADES`: 470; `STANDARDS`: 750; `TOPIC_STANDARDS`: 729.
- `TOPIC_MATERIALS`: 4,442, but previous audit found broad heuristic fan-out. Treat these links as unreviewed suggestions, not trusted teacher-facing assignments.
- `search_chunks`: 1,429. Every stored embedding is recoverable as a normalized 384-dimensional vector, although it was serialized incorrectly as an array of characters.
- `sqlite_mcp_server.db` inside the resource folder is zero bytes and contains no tables. Exclude it.

### Resource-folder inventory

- 1,274 files, about 12.4 MB.
- 1,236 Markdown files, 18 JSON, 4 XLSX, 2 CSV, 1 YAML, plus scripts/design prototypes and an empty DB.
- 1,222 files live under `resources\songs`; 1,202 of those are Markdown.
- Nearly all files are byte-unique relative to the website `docs` tree. This folder is not the previously audited `New project\docs` corpus.
- `Master_Song_Curriculum_Sheet.xlsx` and `Master_Song_Curriculum_Sheet-2.xlsx` are byte-identical. Use one as evidence; do not import both.
- The master song workbook has 1,642 data rows and denormalized curriculum/tag fields.
- `song_catalog_canonical.xlsx` has 1,182 data rows with source file/title, age, domain, language, culture, lyric/action presence, and classroom role.
- `songs\MANIFEST.yaml` maps 1,642 master rows to database IDs and claims 507 updates plus 1,135 inserts. Treat this as reconciliation evidence, not proof that each resulting row is correct.
- The early-years tracker contains 107 apparent Daycare/Preschool goal rows, 31 Music/Arts development rows, and one substantive starter record in each of five unit tabs. Header/note/placeholder rows must not be imported.
- `FACT_CHECK_REPORT.md` explicitly records hallucinated claims and dead links. Any implicated record begins as `rejected` or `needs_reverification`, never `verified`.

## Required schema decision before import

Create a migration proposal and get it reviewed before running it. Prefer extending the current schema over inventing a parallel platform.

1. **Canonical provenance**
   - Audit every current reference to `SOURCES` and `source_documents`.
   - Select one canonical provenance table; `source_documents` is the leading candidate because it already has 1,411 rows and search-chunk links.
   - Required source fields: stable ID, source kind, authority/creator, title, path or URL, retrieved date, checksum, license/access note, review state, and source locator such as page/timestamp/row.

2. **Song work versus sourced version**
   - Keep one canonical song/work identity.
   - Add or approve a source-version table for distinct lyric/action versions. Minimum fields: song ID, source-document ID, title as printed, lyrics, actions, language, age evidence, source locator, checksum, copyright/access note, and review state.
   - Never silently merge conflicting lyrics. Preserve variants and choose a classroom version explicitly.

3. **General teaching materials**
   - Confirm how the existing `SONGS`, `RESOURCES`, `ACTIVITIES`, and `BOOK_SUGGESTIONS` tables participate in `TOPIC_MATERIALS`.
   - Enforce a controlled material-kind vocabulary supporting at least song, rhyme/fingerplay, story/book, activity, movement, sensory, craft, video, printable, game, app, and reference.
   - Require role (`primary`, `supporting`, `alternative`), review state, provenance, and teacher rationale on promoted topic-material relationships.

4. **Framework releases and jurisdictions**
   - Add a framework-release entity rather than overloading the current `STANDARDS.framework` text.
   - Minimum fields: country, state/province/territory, authority, framework title, subject/domain, version, effective dates, language, source URL, retrieval method, license/access note, checksum, imported date, and review state.
   - Each standard node must retain framework release, external ID/code, full text, parent, grade/age bounds, source locator, and status.

5. **Review staging**
   - Add one small `import_review_queue` table or equivalent staging mechanism. Required states: `new`, `matched`, `needs_review`, `approved_insert`, `approved_update`, `approved_version`, `rejected`, `superseded`, `promoted`.
   - A queue record must preserve source checksum, source path, row/file locator, entity kind, proposed canonical ID, proposed field changes, detected issues, decision, reviewer, and timestamps.
   - Staging JSON is acceptable for proposed values; final promoted entities must be relational and constrained.

## Row-by-row workflow

Process deterministic batches of 25 records. Do not start the next batch until the current batch passes all gates.

### How embeddings participate

Embeddings are a candidate generator, not an import mechanism.

1. If a source row/file already maps to a `search_chunk`, reuse its existing stored vector.
2. If it does not, encode the candidate text once with the same model and cache that staging vector for reconciliation.
3. Compare against existing vectors to produce the nearest 5-10 possible matches.
4. Confirm identity using DB ID, source locator, checksum, normalized title, creator, source title, language, and version evidence.
5. Never promote or merge solely because cosine similarity is high.
6. A search query is encoded in memory for comparison; it does not update the model or write the row into the database.

This workflow avoids repeatedly reading every database row while preserving rigorous duplicate decisions.

### A. Extract one candidate

- Identify it by source checksum plus row number, filename, or stable external ID.
- Preserve raw text and source locator.
- Determine entity kind before matching: song work, song version, activity, book/story, video, printable, curriculum standard, topic, or research-only evidence.

### B. Match without changing data

Match in this order:

1. Existing explicit `db_id` or authoritative external ID.
2. Source document plus source locator.
3. Normalized title plus creator/authority and source title.
4. Reviewed alias/version relationship.
5. Otherwise propose an insert.

Never match on title alone when two versions, languages, creators, or source documents differ.

### C. Review every field

- Canonical title and alternate title.
- Material kind and subtype.
- Creator/artist/authority.
- Age band and grade suitability, preserving whether it was stated or inferred.
- Domain and classroom role.
- Lyrics and actions as separate fields with line breaks preserved.
- Materials/preparation.
- Language and cultural/traditional attribution.
- URL/path, source title, source locator, checksum, access/copyright note.
- Normalized tags as individual relations. Do not preserve `animals, ponies` as one tag.
- Verification state and exact reason.
- Relationships to topics/standards/resources, each with rationale and evidence state.

### D. Decide

- `approved_update`: same canonical identity; improves fields.
- `approved_version`: same work, different sourced lyrics/actions/translation/arrangement.
- `approved_insert`: genuinely new canonical entity.
- `rejected`: hallucinated, unusable, corrupt, or irrelevant.
- `superseded`: duplicate snapshot retained for provenance but not promoted twice.
- `needs_review`: ambiguity remains; do not guess.

### E. Promote transactionally

- Run the batch in one transaction with `PRAGMA foreign_keys = ON`.
- Abort on duplicate source locator, orphan FK, invalid status/kind, missing provenance, malformed URL, or unexpected count.
- Record batch ID, migration ID, source checksum, inserted/updated/versioned/rejected counts, and validation results.

### F. Verify after every batch

- Re-run row counts, `PRAGMA foreign_key_check`, uniqueness checks, and source coverage.
- Diff every changed canonical row and relation.
- Run the fixed search regression set and record ordered top-10 results:
  - `ponies lap rhymes`
  - `fingerplays with ponies`
  - `farm animal movement`
  - `baby calming bedtime`
  - `preschool weather story`
  - `kindergarten counting activity`
  - `daycare sensory music`
  - `cleanup transition song`
  - exact standard code and exact standard wording for every framework batch
- Search quality must not regress while data coverage improves.

## Resource-folder processing order

### Phase 0: closure ledger before schema or import

- Generate one row per source artifact/row with checksum, locator, current DB match candidates, deterministic evidence, semantic candidates when needed, missing fields, and disposition.
- Start with the 1,642 manifest mappings because they already provide exact database IDs.
- Review the six repeated manifest mappings, the 15 ambiguous catalog titles, and the 7 unmatched catalog titles first. These are the smallest high-information exception sets.
- Compare the remaining 1,160 exact catalog matches field by field; do not inspect them as open-ended searches.
- Compare the 1,175 title-matched Markdown captures to the matched song/source-version record and identify missing lyrics, actions, age evidence, source locator, language, cultural attribution, or provenance.
- Only after the exception sets and a representative 25-row exact-match batch are understood should the schema migration be finalized.

### Phase 1: trusted reconciliation spine

- `songs\MANIFEST.yaml`
- one copy of `Master_Song_Curriculum_Sheet.xlsx`
- `songs\song_catalog_canonical.xlsx` / CSV
- `songs\FORMAT_SPEC.md`

Goal: establish source-to-database identity and a work/version model. Do not import denormalized curriculum links or tags yet.

### Phase 2: sourced song/rhyme evidence

- `songs\captured\*.md`
- `songs\extracted\*.pdf.json`
- the small `resources\songs\md-*.md` pilot files
- `track_data.json`, album metadata, and track URL JSON files

Goal: populate reviewed source versions, lyrics/actions, age evidence, language, sources, and source locators. Use the fact-check report to quarantine known bad claims.

### Phase 3: early-years goals and non-song lesson materials

- `ECE_Early_Years_Curriculum_Tracker_3.xlsx`
- five starter unit tabs: song-led, story-led, movement-led, sensory-led, craft-led
- `circle_time_songs_reference.md`, `kathy_teaching_guide.md`, and relevant early-music research files

Goal: crosswalk real goals to current topics; populate activities/books/resources where evidence exists; preserve research prompts as queue items, never as completed resources.

### Phase 4: secondary research and public links

- subject resource Markdown files and top-level research drafts
- `FACT_CHECK_REPORT.md`

Goal: promote only live, relevant, source-supported resources. Recheck every URL because the report is a dated snapshot. Exclude scripts, caches, design prototypes, and the empty DB.

## Official North American curriculum cycle

Initial scope: all 50 U.S. states plus District of Columbia, all 10 Canadian provinces and 3 territories, and federal Head Start ELOF. Track other U.S. territories, Indigenous/nation-specific frameworks, French-language equivalents, and Mexico as explicit future-scope rows rather than silently omitting them.

### Pilot order

1. **Ontario**
   - How Does Learning Happen for early-years pedagogy.
   - Ontario Kindergarten 2026 as the current incoming release; retain 2016 as a superseded historical release rather than overwriting it.
2. **Head Start ELOF, Birth to Five**
   - Use the official framework and Effective Practice Guides. Keep framework outcomes separate from teaching-practice resources.
3. **British Columbia**
   - Official Arts Education K-3 HTML/DOCX/PDF plus the Early Learning Framework where applicable.
4. **Florida**
   - CPALMS Standards API/CASE pilot. Access requires terms/application; the site must not depend on the API at runtime. Import a versioned snapshot with checksum.

Official starting URLs:

- `https://www.headstart.gov/school-readiness/article/head-start-early-learning-outcomes-framework`
- `https://www.headstart.gov/school-readiness/effective-practice-guides/introduction`
- `https://www.ontario.ca/page/how-does-learning-happen-ontarios-pedagogy-early-years`
- `https://www.ontario.ca/document/kindergarten-program-2016` (historical release page; it states 2026 replacement)
- `https://curriculum.gov.bc.ca/curriculum/arts-education`
- `https://www.cpalms.org/Standards/Standards_API.aspx`

### Jurisdiction registry workflow

For each jurisdiction:

1. Locate only official ministry/department/agency sources.
2. Record whether the source is API, CASE endpoint, HTML, JSON/XML, DOCX, PDF, or manual-only.
3. Record terms, licensing, authentication, rate limits, language, release/version, effective date, and update cadence.
4. Save source metadata/checksum before parsing.
5. Parse into staging and compare a 20-node sample against the official source.
6. Validate hierarchy, codes, grade/age range, subject/domain, and node counts.
7. Promote the framework release only after the sample passes.
8. Create topic-standard alignment candidates separately; never infer approval from keyword similarity.
9. Update a coverage matrix: jurisdiction × framework release × grade/age × subject × import/review state.

No single official API covers the United States and Canada. Build source adapters behind one small normalized framework-release model; do not make the product depend on live third-party APIs.

## Teacher-facing completeness contract

Expose these states in search/results:

- Framework: official current / official superseded / source found not imported / unavailable.
- Standard: imported and source-linked / reviewed / unreviewed.
- Topic alignment: reviewed / suggested / missing.
- Material: reviewed / unverified / rejected.
- Lesson: authored / editorial draft / database-assembled draft.

Never label a jurisdiction, grade, topic, or lesson complete unless the coverage matrix proves it.

## Embedding gate

Only after reviewed batches are promoted:

1. Repair serialization of the existing 1,429 vectors without changing their numeric values.
2. Verify `all-minilm:l6-v2` produces compatible 384-dimensional query vectors against known-neighbor tests.
3. Embed only new/changed promoted canonical search text.
4. Never embed rejected/staging/raw source records.
5. Cache repeated query embeddings.
6. Keep structured keyword and exact-standard retrieval alongside semantic ranking.

## Definition of done for the new agent

- [ ] Read-only closure ledger reconciles every in-scope resource file/row to already complete, needs fields, needs source version, ambiguous, new, research-only, duplicate, rejected, or archivable status.
- [ ] The 6 repeated manifest mappings, 15 ambiguous catalog rows, and 7 unmatched catalog rows have explicit reviewed dispositions.
- [ ] Schema migration and dry-run validator reviewed and committed before application.
- [ ] One 25-row pilot batch is reviewed and promoted transactionally into the existing `omhas.db`.
- [ ] Source/version/tag relationships pass FK and uniqueness checks.
- [ ] No comma-list tags or inferred curriculum alignments are promoted.
- [ ] Search regression report shows before/after top-10 results and exact-standard retrieval.
- [ ] Ontario, Head Start, BC, and Florida framework pilot entries exist in the coverage registry with official source/release/access metadata.
- [ ] Teacher-facing completeness states can be derived directly from stored review/coverage fields.
- [ ] No database copy, vector rebuild, deployment, or unrelated worktree change was made.
