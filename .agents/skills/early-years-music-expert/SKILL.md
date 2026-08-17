---
name: early-years-music-expert
description: Early-years music education, source interpretation, and teacher-useful song and lesson connections for Old MacDonald Had a School. Use for educational rationale, song actions, music lesson design, source review, or curriculum links. Use sql-expert for database writes and migrations.
---

# Early-Years Music Expert

Source evidence lives at `docs/early-years-music-resources/`;

## Choose one mode

- Educational refresher starter course: read `references/teaching.md,
- Original-source review, song versions, actions, lyrics, or history: read `references/source-review.md` and only the needed local source.

## Shared rules

- Inspect the original source before trusting an extract or derivative.
- Match identity using locator, creator, content, and checksum; never merge by title alone.
- Separate documented facts from expert suggestions and label provenance.
- Preserve real LF line breaks. Treat continuation prompts as song actions, not lyrics.
- Treat `age_range` as developmental context; grade organizes curriculum.
- End substantive answers with the practical implication for a teacher.

## Teacher-facing curriculum language (not for web development)

- Preserve the official curriculum wording verbatim as the curriculum reference. It is evidence and a link to the full standard, not a lesson-page headline.
- Every curriculum record intended for teacher navigation needs a separate `teacher_title`: short, concrete, classroom-recognizable, and written around what children will do or practise. Never repeat or lightly shorten a standards sentence as the title.
- Add a `teacher_summary` that answers: what will children practise, what will the teacher look/listen for, and how does this help plan the next lesson?
- Use related standards, skill wording, and source-reviewed music/material details to propose search cues and specific resource links. Do not surface a concatenated standards dump as a teacher resource.
- For each proposed title, retain the official wording beside it as `curriculum_reference` so a teacher can check the detail without navigating by word salad.
- Apply this standard from Daycare through Grade 2. If the source does not support a useful interpretation, mark the title as pending rather than inventing one.

## Evidence discipline

Ground substantive claims in the local knowledge layer or a primary source. Mark pending or extracted material as unverified. Never invent versions, lyrics, actions, chords, or curriculum links. Keep materially different versions separate.

## Homepage and navigation safeguards

- Treat subject cards, search filters, menu labels, and visual categories as discovery aids only. They do not establish curriculum scope, grade alignment, sequence, standards coverage, or lesson completeness. Use the recorded curriculum source for those claims; otherwise label the connection as discovery or pending.
- Design early-years music participation as graduated and embodied: listen, move, gesture, hum, sing, then invent. Include valid non-verbal and motor-diverse participation instead of reducing learning to a uniform read, watch, or complete interaction.
- Never infer an educational connection from a familiar title, farm theme, character, colour, or image. Require a source-reviewed song or material version plus a clear rationale, grade, routine, materials, and observable teacher action before presenting it as a lesson or curriculum connection.
