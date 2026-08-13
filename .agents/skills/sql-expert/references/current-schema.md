# Current teacher-resource database map

Inspect `data/omhas.db` before mutation; this map identifies the relationships that matter to teacher search as of migration `0013`.

## Curriculum and teacher resources

- `grades`, `subjects`, `topics`, `topic_grades`, `topic_standards`, `topic_tags`, `weekly_pacing`: normalized curriculum. Grade is the primary organizing field.
- `topic_materials`: connects a topic to a polymorphic material (`song`, `resource`, etc.) with role, teaching phase/routine, and teacher rationale.
- `resources`, `activities`, `book_suggestions`, `lesson_assets`: teacher-use material records. `material_tags` and `material_relations` add discovery links.
- `curriculum_topics` and `curriculum_topic_songs`: legacy/FTS-facing topic records and links. Do not confuse `curriculum_topic_id` with `topics.id`; use `topic_id` where the normalized relationship is known.

## Songbook and provenance

- `songs` is the canonical song record. `lyrics` is legacy text; presentation quality comes from ordered `song_sections` and their real LF line breaks.
- `song_sections` stores verse/chorus/refrain order. `song_actions` can link to a song, section, and exact line; its provenance is source-documented, expert-suggested, or community-legacy.
- `song_chord_guides` supports `song`, `section`, and `line` scope. Never represent rough whole-song chords as line-aligned.
- `source_documents` + `song_sources` preserve file checksum, review state, original locator, and relationship (`primary`, `transcription`, `arrangement`, `teaching-guidance`). Keep materially different sourced versions separate.
- `song_curriculum_links` provides subject/relevance/link-type teaching links.

## Search and evaluation

- `search_chunks` is the searchable content record; `search_chunks_fts` is its FTS5 external-content index. `search_chunk_sources` records source evidence.
- `song_action_chunks` and `curriculum_topic_songs` connect search records to actions and lesson topics.
- `retrieval_evaluation_queries`, `retrieval_evaluation_runs`, and `retrieval_evaluation_results` measure real teacher queries. FTS5 is keyword retrieval; embeddings alone do not prove semantic search quality.

## Guardrails

- `age_range` is source/developmental context, not a curriculum grade.
- Do not use source text to invent searchable tags or teacher rationales.
- Use `PRAGMA foreign_key_check`, `PRAGMA integrity_check`, FTS parity, and retrieval evaluations after every committed import batch.
