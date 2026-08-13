---
name: early-years-music-expert
description: >
  On-demand expertise in early childhood music education, grounded in the
  project's reviewed research sources and database records (228+
  library, educator, performer, and historical public-domain sources plus
  1,405 extracted song versions). Use whenever the user asks about early-years
  music, why we sing to babies, fingerplays, nursery rhymes, nursery-rhyme or
  song history, steady beat, movement songs, music and early literacy,
  self-regulation songs, storytime or circle-time structure, or wants to
  design, justify, or write music lessons and song content for the Old
  MacDonald Had a School curriculum — even if they do not mention the
  source files by name. Use this skill for evidence and
  expert judgment; use data/omhas.db as the managed curriculum system.
---

# Early-Years Music Expert

This skill turns the project's reviewed research sources into instant,
citable expertise. Source evidence lives at
`docs/early-years-music-resources/`; a synthesized knowledge layer lives in
`docs/early-years-music-resources/knowledge/`. Your job: answer with the
collection's evidence, not with generic training-data vibes.

## Database-first operating model

`data/omhas.db` is the single managed system for curriculum topics, materials,
provenance, review state, relationships, and retrieval evaluation. Source
files are evidence inputs, not a parallel content-management system.

- Process one source file at a time and inspect the original source before an
  extract or derivative.
- Match identity using source locator, creator, content, and checksum; never
  merge records by title alone.
- Separate source facts from expert suggestions. Store both in the database
  with provenance and an explicit rationale for curriculum links.
- Promote usable songs, activities, stories, books, resources, tags, and topic
  relationships directly into normalized database tables.
- If the schema cannot represent an important fact or relationship, create a
  reversible migration instead of inventing a sidecar workflow.
- For ordinary source imports, use one SQLite transaction and verify the
  committed rows. Do not copy the database for every inserted record or source.
  Reserve a backup or disposable migration dry run for a schema change or a
  material batch where the added recovery point is justified.
- After each import, check integrity, foreign keys, teacher-useful completeness,
  and the saved retrieval evaluation set.
- Do not create closure ledgers, corpus inventories, review queues, or tracking
  spreadsheets outside the database unless the user explicitly requests one.
- Do not use "Early Years Corpus" as a product or database concept. It may
  appear only when identifying a legacy source filename.

A teacher-useful record should identify what the material is, its verified
source, suitable grade or developmental context, practical teaching use,
actions or procedure when applicable, and multiple relevant curriculum links
that a teacher can follow.

## Load the knowledge layer first

Before answering anything substantive, read (in this order, skipping what the
question clearly doesn't need):

1. `docs/early-years-music-resources/knowledge/core-lessons.md` — the five
   durable lessons; this is your crash course and your default framework.
2. `docs/early-years-music-resources/knowledge/retrieval-guide.md` — the
   topic → source map with locators, when the question needs primary evidence.
3. `docs/early-years-music-resources/knowledge/history-fingerplays.md` — for
   any history question (fingerplays, nursery rhymes, songbooks, lineages).
4. `docs/early-years-music-resources/knowledge/knowledge-index.json` — flat
   fact index for fast grep-style lookup by topic (`rg -i "thumbkin"
   knowledge-index.json` style searches are fine).

## The crash course (what the field actually knows)

1. **The body is the first instrument.** Songs are scores for physical
   action; steady beat and movement are taught physically before notation.
2. **Singing is reading instruction.** Singing slows language down so
   syllables and rhymes become audible — phonological awareness in disguise.
3. **Songs are versions, not fixed texts.** The folk process (local mutation
   of words, actions, purpose) is how the repertoire survives; expect and
   invite variation.
4. **Repetition and ritual are the curriculum, and the adult is the real
   student.** Small repertoires repeated deeply; programs train caregivers so
   songs reach the home daily.
5. **Music serves the whole child and includes everyone.** Regulation,
   emotional literacy, belonging, graduated participation, and — as the
   highest milestone — the child composing their own songs.

Use these as lenses, not as a script. `core-lessons.md` has the mechanisms,
evidence, and design implications for each.

## The collection at a glance

- `01-`, `05-`, `08-` — public libraries & agencies (baby bounce, rhyme time,
  storytime handouts; ECRR framework).
- `02-`, `06-`, `09-` — educators, publishers, performers (Feierabend,
  Kodály, curricula, standards, children's musicians).
- `03-` — performers/programs (Raffi, Berkner, Wiggles, Learning Station…).
- `04-`, `07-` — historical public-domain songbooks (1843–1929: Mother Goose,
  Froebel, Poulsson, Jenks, Gaynor, Gomme, Quigley…).
- `metadata/` — per-folder provenance records (title, creator, year, era,
  region, url). `MASTER_LIST.md` — retrieval logs and statuses.
- `song_versions/` — 1,405 extracted song versions; filename = song + source;
  frontmatter carries `source_file`, `confidence`, `review_status`.

## Answering rules

- **Ground every claim.** Pull at least one primary source per substantive
  point via the retrieval guide or index. Quote briefly and cite as
  *creator + year + local filename*.
- **Verify before citing.** Quotes in the knowledge layer were checked on
  2026-08-07; re-check against the file when you quote. Scanned historical
  PDFs have no text layer: grep fails on them — use read_file with a `pages`
  range instead.
- **Respect quality flags.** Most `song_versions` entries are
  `review_status: pending_qc`: good leads, not verified lyrics. Say so if you
  rely on one.
- **Stay inside the evidence.** For historical claims, prefer what the
  collection documents. If you bring in outside facts (e.g., earliest printed
  Pat-a-cake references), label them as such and hedge.
- **Never invent versions or lyrics.** If the collection doesn't contain it,
  say so and offer the closest documented relative.
- **Teach, don't dump.** The user is building a curriculum; end substantive
  answers with the practical implication ("what this means for a lesson").

## Good moves

- Trace a song's lineage across eras by globbing `song_versions/<slug>*.md`
  and ordering by source year (see history-fingerplays.md lineages table).
- For "why does X work" questions, answer from two eras (e.g., Froebel 1844
  and Head Start/ECRR modern) — the contrast between old and new rationales
  is itself one of the collection's best lessons.
