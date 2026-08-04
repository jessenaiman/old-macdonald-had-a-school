# Research corpus map

## Scope and corpus shape

This map covers the two requested corpora plus the project guidance and analysis files. It is a handoff map, not a publication-ready catalog.

- `New project/resources` is a mixed research archive: 561-row Kathy Reid-Naiman track inventory, album/track/URL JSON, curriculum/resource batches, 33 Markdown research/review files, a CSV, a SQLite archive, and an early-years curriculum workbook attachment.
- `early-years-music-resources` is a source-and-extraction archive: 262 manifest entries (208 original files, 41 web snapshots, 13 OCR sidecars), 1,405 normalized `song_versions` Markdown records, 192 PDFs, 38 HTML captures, DOCX/text material, metadata, OCR, and unresolved-source logs. The source folders cover libraries/agencies, educators/publishers, performers/programs, historical/public-domain material, and deeper follow-up passes.
- The inspected curriculum workbooks are snapshots, not one consistent schema: the full-database export has 561 song rows and 107 early-years topic rows; the project notes describe 264 curriculum topics and 129 early-years topics. Preserve the snapshot/import context instead of treating these counts as contradictions to overwrite.

## Product model

### Educational model

Old MacDonald Had a School is a participatory, play-based music-and-learning model for birth through Grade 3. A song is an entry point into movement, language, early mathematics, science/nature, social-emotional learning, routines, and creative expression. The early-years material emphasizes lap/bounce songs, fingerplays, call-and-response, singing games, imitation, sensory play, instruments, stories, and observation rather than worksheets or tests. The school-age layer adds Ontario/US expectations, pacing, standards codes, lesson sequences, assessment prompts, and printable supports.

### Users and teacher jobs-to-be-done

Primary users are daycare/preschool educators, kindergarten and Grades 1–3 teachers, music/movement specialists, and library/storytime leaders. Caregivers and families are a secondary audience because many sources are designed for shared adult-child use.

The site should help a teacher:

1. Find a song or activity that fits an age, group, theme, skill, or curriculum expectation.
2. Decide quickly whether it is usable: duration, materials, movement demands, language, access, and safety.
3. Lead it: lyrics or a permitted excerpt, actions, setup, teacher cues, child response, transitions, and alternatives.
4. Explain the learning: developmental skill, observable evidence, and curriculum/framework connection.
5. Adapt it for different learners, sensory needs, motor abilities, languages, and group sizes.
6. Extend it with a book, prop, printable, craft, sensory activity, instrument exploration, or related song.
7. Trust the link and attribution, or see clearly when verification is still needed.

### Differentiators and likely marketing promise

The differentiator is the combination of a substantial early-childhood song catalog, historical and practitioner sources, movement-first pedagogy, developmental and curriculum crosswalks, character-guided lesson framing, and source/verification intent. The project is positioned as a teacher resource app rather than a passive playlist or generic lesson generator.

Likely promise (editorial inference): **“Find a song that fits your learners, then get a ready-to-start, developmentally appropriate lesson with practical steps, curriculum connections, safe resource links, and meaningful ways to observe learning.”** This should remain a marketing hypothesis until tested with teachers.

## Evidence and data inventory

The corpora contain these kinds of evidence; individual files should remain discoverable through provenance rather than being copied into the website narrative.

| Evidence class | Present data | Reliability/use |
|---|---|---|
| Primary/near-primary source material | Government/library/agency documents, educator handouts, publisher and performer resources, historical books, public-domain text, HTML snapshots, PDFs, DOCX, OCR sidecars | Best evidence for what a source actually says; retain title, creator, date, URL/file hash, and page/section locator. |
| Music catalog and media metadata | Kathy track/album/artist/record IDs, official track URLs, some structured `MusicRecording` snippets with duration/album/date, lyrics and actions where available, YouTube/Spotify/Apple/site links | Useful for works and recordings, but a URL or catalog row does not prove authorship, lyrics, or classroom rights. |
| Extracted content | Song/rhyme/activity title, source title, creator, age range, evidence quote, actions/materials, educational domain, skill objective, source file, OCR quality | Valuable staging data; many fields are generated or weakly normalized and need claim-level review. |
| Pedagogical research and curation | Age-band recommendations, developmental skills, movement types, circle-time routines, music-education frameworks, research citations, thematic song lists, teacher reviews | Supports editorial interpretation and search facets; do not present every pedagogical claim as a source fact without checking the citation. |
| Curriculum and standards | ELOF/early-years goals, Ontario HDLH lens, Ontario codes and wording, US Common Core/NGSS-style references, Grade 1–3 pacing/topic rows, subject strands, primary/secondary song links | The spreadsheet is a curriculum reference and alignment aid, not automatically a complete lesson. Jurisdiction, grade, code, wording, and scope must travel together. |
| Lesson-authoring and presentation data | Unit templates, lesson blueprints/steps, materials, differentiation, assessment/observation prompts, cross-curricular connections, staff/student characters, resource states | Mostly editorial or generated content; useful for the site, but it must not be misrepresented as quoted source guidance. |
| Operations and QA | Manifest status, duplicate/rejected rows, unresolved-source lists, OCR results, URL/access notes, `pending_qc`, confidence fields, QA batches, database gap summaries | Internal workflow evidence. Keep it queryable, but do not expose raw confidence scores as teacher-facing truth. |
| Rights/access signals | Public-domain folders, official links, stream-only/login/email-gated/paywalled notes, downloadable printables, copyrighted lyrics and scans | Incomplete rights evidence. “Free to access” is not the same as licensed to reproduce. |

## Proposed data domains

Use stable IDs and many-to-many joins. Do not make a song title, filename, or spreadsheet row the primary key.

| Domain | Core fields | Key relationships |
|---|---|---|
| Song work | `song_work_id`, canonical/display title, normalized sort title, type (`song`, `rhyme`, `fingerplay`, `bounce`, `chant`, `movement`, `activity`), language, origin/tradition, creator/composer/adapter/performer roles, themes/tags, lyric availability | One work has many variants, recordings, source claims, actions, skills, expectations, lessons, and resources. |
| Song/version | `version_id`, `song_work_id`, title as printed, wording/lyric excerpt, translation, arrangement, action pattern, source-specific notes, version status | Preserve traditional, artist, album, classroom, and translated versions separately; link them to the canonical work. |
| Recording/video | `recording_id`, work/version ID, artist, album/program, track number, duration, provider, URL/embed, media type, access mode, last checked, availability | A work may have many recordings; a recording may have a rights/access record and a source claim. |
| Source/provenance | `source_id`, source kind, title, creator/org, publication date/year, URL or relative asset path, file hash, capture date, page/section/line locator, source role, import batch | Every imported claim and extracted field points to a source and locator; preserve raw source rows/files. |
| Curriculum expectation | `expectation_id`, framework, jurisdiction, age/grade, subject/strand, code, exact wording, scope note, source URL/document, status | Link through `song_expectations`, `lesson_expectations`, and `resource_expectations`; store primary/secondary fit and rationale. |
| Developmental skill/framework | `skill_id`, framework, domain/subdomain, skill statement, stage, min/max months, observable indicators, source | Link songs, actions, lessons, and expectations; distinguish ELOF/HDLH/Gordon/Kodály/Orff/editorial skill tags. |
| Age/grade/audience | `audience_id`, normalized min/max months, band label, grade, setting, group size, developmental qualifiers, cautions | Many-to-many with works, variants, lessons, resources, and characters. Avoid one free-text `age_range` as the only value. |
| Actions/movement | `action_id`, type, body part, verb sequence, tempo/dynamics, posture/motor demand, setup/safety, associated lyric/step, source/editorial flag | Link to a version and to ordered lesson steps; allow alternatives for seated, supported, visual, or low-sensory participation. |
| Lesson/lesson step | `lesson_id`, title, purpose, duration, materials, sequence, facilitator cue, child action, differentiation, assessment/observation, character moment, editorial/generated status | Lessons assemble works, recordings, resources, expectations, skills, printables, and characters through join tables; steps need stable order IDs. |
| Resource/printable | `resource_id`, type (video, worksheet, poster, flashcard, coloring, guide, book, craft, activity), title, description, URL/file, provider, access, resource state (`ready`, `missing`, `none`), fit notes, last checked | Link to sources, lessons, works, expectations, and printables; keep a resource distinct from the song it accompanies. |
| Characters/roles | `character_id`, name, species, staff/student role, subject/grade band, signature color, shown-doing/props, canonical source | Link to lesson/unit/step presentation only. Do not treat a character assignment as curriculum evidence. |
| Rights/licensing | `rights_id`, object type/ID, rights holder, work status, license, territory, expiry, permitted use (`link`, `stream`, `excerpt`, `reproduce`), restrictions, reviewed date | Gate lyrics, scans, images, audio/video embeds, and printables separately; link-only is a valid outcome. |
| Verification/claim | `claim_id`, object/field, value or assertion, status (`verified`, `probable`, `uncertain`, `rejected`, `conflicting`), method, verifier, date, evidence source/locator, notes | Verification belongs to a claim, not the whole song. A title can be verified while its album, lyrics, attribution, or rights remain uncertain. |

## Source facts, editorial judgments, and generated content

| Layer | Examples | Required treatment |
|---|---|---|
| Source fact | Exact title/wording in a source, quoted lyric excerpt, printed creator/performer, album/track metadata, publication date, standard code/text, source-provided age or activity direction | Store verbatim plus source and locator. Preserve uncertainty in the source rather than silently correcting it. |
| Editorial judgment | Canonical-title merge, normalized age band, educational domain, theme/tag, developmental interpretation, primary/secondary curriculum fit, recommended character, related book/craft, “best for” language | Store as a separate assertion with editor/date/rationale. It may be revised without rewriting the source record. |
| Generated lesson content | Skill objective, duration estimate, materials synthesis, step sequence, differentiation, assessment prompt, cross-curricular connection, character dialogue/moment, worksheet brief | Label as authored/generated, record prompt/model/version and reviewer, and never imply it came from the workbook or source document. |

## Duplicates, conflicts, low confidence, and rights flags

- **Duplicates/near-duplicates:** the manifest records three duplicate relationships; the retrieval log includes a rejected duplicate; the extracted corpus repeats common songs across sources and versions. The full-database workbook also contains repeated rows across source sheets. Deduplicate works cautiously while preserving every version and source occurrence.
- **Attribution conflicts:** traditional songs are sometimes presented as artist originals or as belonging to a particular album. Verification reports specifically identify uncertain Kathy Reid-Naiman album/track pairings, artist/source conflations, and several traditional/pop songs mislabelled as folk. Store composer, traditional source, adapter, performer, and classroom source as separate roles.
- **Classification/normalization problems:** the analysis reports roughly 40% educational-domain misclassification, more than 70 free-text age values, generic skill objectives, whole-source “evidence quotes,” and only 46/561 lyrics and 80/561 URLs in the current song export. The extracted frontmatter also repeats `pending_qc`, `unknown` page sections, and AI confidence fields mechanically.
- **Low-confidence/hallucination risk:** audit documents report only about 60% verified in the sampled movement/nature set, with doubtful and hallucinated entries, and a separate artist audit identifies substantial doubtful/fabricated artist, title, and album claims. These are audit findings, not proof that every unverified row is false; they justify a claim-level review queue.
- **Database status conflicts:** the spreadsheet export’s `Verified` field is 0 across inspected song rows while project notes describe verified lyric/URL subsets. Treat the boolean as an unreliable legacy field until its semantics are defined.
- **Rights-sensitive content:** copyrighted lyrics, songbook scans, artist PDFs, OCR text, brand printables, and recordings should default to metadata/linking unless a license permits reproduction. Historical/public-domain status requires jurisdiction/date checking. Login-only, paywalled, email-gated, and stream-only sources must remain access-labelled; “free” does not mean “reusable.”

## Large-spreadsheet extraction recommendation

Treat the spreadsheet as an import source and reporting layer, not the database itself. The inspected master workbook has a 1,642-row song list plus separate daycare, preschool, kindergarten, and Grade 1–3 tabs; the full-database export has 561 songs, topic tabs, unit tabs, and a data-gap summary.

For each workbook/sheet/row, first retain `import_batch_id`, workbook name/version, sheet name, row number, original cell values, and a row hash. Then extract:

1. **Works and versions:** canonical title, raw title, `type`, language, creator/artist roles, album/collection, track number, catalog/source ID, lyrics status, and source-specific wording.
2. **Media:** recording/video URL, provider, duration if present, embed/access mode, and last-checked result. Do not infer a recording from a song title alone.
3. **Teaching metadata:** normalized age months/bands, grade/setting, topic/theme, domain, tags, materials, actions, duration, instructions, safety notes, and observable child response.
4. **Curriculum:** framework, jurisdiction, grade, subject, strand, code, exact expectation, scope/qualification note, primary/secondary relation, and rationale. Split comma-separated or semicolon-separated cells into join rows.
5. **Lesson assembly:** ordered steps, transitions, differentiation, assessment/observation, cross-curricular links, character/teacher role, and printable/resource references. Mark these as editorial or generated unless a source explicitly provides them.
6. **Provenance, QA, and rights:** source document/locator, evidence excerpt, extraction method (text/OCR/manual), review status, reviewer/date, conflicts, duplicate candidate, rights status, license, and permitted use.

Recommended identifiers include `song_work_id`, `version_id`, `recording_id`, `source_id`, `source_claim_id`, `expectation_id`, `skill_id`, `action_id`, `lesson_id`, `lesson_step_id`, `resource_id`, `character_id`, `rights_id`, and `import_batch_id`. Keep legacy `DB_ID`, `Catalog_ID`, `source_id` slugs, filenames, and row numbers as external/source keys, never as the only canonical key.

## Provenance and quality rules

1. Preserve an immutable raw layer and a normalized layer; never overwrite a source row to “fix” it.
2. Attach provenance and verification to each material assertion: title, creator, album, lyrics, action, age, domain, standard alignment, URL, and rights are separate claims.
3. Separate work, recording, performance/arrangement, classroom adaptation, and lesson. This resolves most title/artist/album collisions.
4. Use controlled vocabularies for content type, age/grade, developmental domains, action types, resource states, and access/rights; retain the original free text beside normalized values.
5. Use `verified` only with a method, date, evidence, and scope. Replace bare confidence scores with reviewable statuses; keep workflow fields internal.
6. Treat duplicates as merge candidates, not deletions. Preserve source occurrences, rejected records, and conflict notes.
7. Do not publish a resource as `ready` until title, destination, instructional fit, access, and rights/linking mode have been checked. Use `missing` or `none` honestly.
8. Publish only rights-cleared lyrics, images, scans, audio, and printables; otherwise link to the authorized source and show access restrictions.
9. Label editorial and generated lesson content in storage and UI. Record author/editor, generation date, prompt/model/template version, and review decision.
10. Block automatic publication when creator/album attribution conflicts, evidence is OCR-only and incomplete, source is unresolved, age/standard scope is unclear, or a URL/rights status is stale.

