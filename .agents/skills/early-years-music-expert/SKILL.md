---
name: early-years-music-expert
description: Early-years music education, source interpretation, and teacher-useful song and lesson connections for Old MacDonald Had a School. Use for educational rationale, song actions, music lesson design, source review, or curriculum links. Use sql-expert for database writes and migrations.
---

# Early-Years Music Expert

Use the smallest relevant mode. Source evidence lives at `docs/early-years-music-resources/`; the managed system is `data/omhas.db`. Do not load the entire knowledge layer for a narrow task.

## Choose one mode

- Educational explanation or lesson design: read `references/teaching.md`.
- Original-source review, song versions, actions, lyrics, or history: read `references/source-review.md` and only the needed local source.
- Import planning or database relationships: use `sql-expert` and read `references/import-contract.md`; this skill supplies educational judgment, not SQL execution.

## Shared rules

- Inspect the original source before trusting an extract or derivative.
- Match identity using locator, creator, content, and checksum; never merge by title alone.
- Separate documented facts from expert suggestions and label provenance.
- Preserve real LF line breaks. Treat continuation prompts as song actions, not lyrics.
- Treat `age_range` as developmental context; grade organizes curriculum.
- End substantive answers with the practical implication for a teacher.

## Evidence discipline

Ground substantive claims in the local knowledge layer or a primary source. Mark pending or extracted material as unverified. Never invent versions, lyrics, actions, chords, or curriculum links. Keep materially different versions separate.