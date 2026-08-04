# Seed batch 01 audit

## Scope and decision

This is a read-only audit of the canonical source project at
`C:\Users\jesse\OneDrive\Documents\New project` and the target Markdown
content in this project. No lesson files were created or changed.

The recommended first batch is seven pages. Four already have canonical
Markdown content and should be treated as existing seed pages to review and
publish carefully. Three additional music-first pages have the strongest
combination of structured teaching data, age guidance, actions, source
provenance, and source-marked video links.

The source database itself is present at
`New project\data\curriculum.db`, but the OneDrive-backed SQLite file could
not be opened by the read-only sandbox driver. I therefore used the canonical
workbooks, CSV mapping batches, SQL assembly/review definitions, source lesson
MDX, and exported song data. I have not guessed database primary keys that are
not present in those exports. Workbook row numbers, `DB_ID` values, and `CU#`
values below are preserved exactly as source identifiers.

## Important publication rule

“Verified” below means **marked verified by the canonical source data**, not
that I independently re-tested the destination during this audit. Before a
page is marked ready for teachers, check the link, destination type, classroom
fit, and rights/linking mode. A direct link can be published without granting
permission to copy the linked material.

## Recommended candidates

### 1. Addition & Subtraction Word Problems

- **Target slug/status:** `addition-subtraction-word-problems`; canonical MDX
  exists in both source and target.
- **Exact source rows/IDs:** `New project\db\Curriculum_Tracker.xlsx`, sheet
  `Grade 1-2 Combined`, workbook rows **3** and **9**. Grade 1 sequence **1.0**;
  Grade 2 sequence **7.0**. No separate curriculum DB ID is asserted because
  the export used for this audit does not expose it.
- **Grade/topic:** Grade 1 and Grade 2; Mathematics; Operations & Algebraic
  Thinking.
- **Curriculum wording/codes:**
  - Grade 1: “Represent and solve addition & subtraction word problems within
    20”; US source row says `1.OA.A` and notes the exact citation should be
    `1.OA.A.1`; Ontario `B2`.
  - Grade 2: “Use addition & subtraction within 100 to solve one- and two-step
    word problems”; US `2.OA.A.1`; Ontario alignment is described in the notes,
    not given as a code.
- **Provenance:** Workbook rows and notes; canonical source lesson explicitly
  separates workbook truth from its editorial four-step routine. The source
  notes say the Grade 2 Ontario core range should be reduced to **within 50**.
- **Suggested template:** `video` / resource-first. The practical starting
  point is the Number Frames or Number Pieces workspace, followed by Try,
  Practice, Check, and Extend. Do not label the app as a video.
- **Available resources and state:**
  - Math Learning Center Number Frames:
    `https://www.mathlearningcenter.org/apps/number-frames` — source-linked;
    canonical page marks it ready for modelling.
  - Math Learning Center Number Pieces:
    `https://www.mathlearningcenter.org/apps/number-pieces` — source-linked;
    canonical page marks it ready for Grade 2 modelling.
  - K5 Grade 1 direct PDF:
    `https://www.k5learning.com/worksheets/math/grade-1-addition-subtraction-word-problems-single-digits-1.pdf`
    — canonical page says direct PDF verified; use as a link until rights and
    current access are checked.
  - K5 Grade 2 direct PDF:
    `https://www.k5learning.com/worksheets/math/grade-2-word-problems-mixed-add-subtract-d.pdf`
    — canonical page says direct PDF verified; it stays within 20 and is
    narrower than the Ontario Grade 2 core range.
- **Rights caveats:** Link to the Math Learning Center and K5 destinations;
  do not mirror their apps, worksheets, answer pages, or branding without
  permission.
- **Editorial still required:** Keep Grade 1 and Grade 2 visibly distinct;
  correct the US cluster citation for Grade 1; state the Grade 2 Ontario range
  adjustment; verify every destination; write a teacher-print layout; and
  label the four-part sequence as editorial site content.

### 2. Apply Properties of Operations

- **Target slug/status:** `properties-of-operations`; canonical MDX exists in
  both source and target.
- **Exact source row/IDs:** `New project\db\Curriculum_Tracker.xlsx`, sheet
  `Grade 1-2 Combined`, workbook row **4**, sequence **2.0**. No separate
  curriculum DB ID is asserted.
- **Grade/topic:** Grade 1; Mathematics; Operations & Algebraic Thinking.
- **Curriculum wording/codes:** “Apply properties of operations
  (commutative, associative) to add/subtract”; US `1.OA.B.3`; Ontario `B2.1`.
- **Provenance:** Workbook row and scope note; canonical MDX adds the concrete
  “flip the addends” routine and correctly says formal terminology should be
  secondary.
- **Suggested template:** `video` / resource-first only after correcting the
  resource type. The current “Watch” entry points to the Number Frames app,
  not a verified video.
- **Available resources and state:**
  - Number Frames:
    `https://www.mathlearningcenter.org/apps/number-frames` — source-linked
    app; not a video.
  - K5 Learning general math page:
    `https://www.k5learning.com/free-math-worksheets` — workbook-recommended
    practice destination; not a specific verified worksheet for this lesson.
  - “Commutative Match Cards”, “Number-Sentence Strips”, and “Part–Part–Whole
    Mat” are described in the MDX as PDFs, but no actual verified PDF files or
    source URLs are supplied. They must not be presented as available
    downloads yet.
- **Rights caveats:** Link to Number Frames and K5. The described cards and
  mats are editorial plans, not cleared assets. Do not expose the scene image
  paths as downloadable PDFs.
- **Editorial still required:** Replace the false video framing with “Open
  modelling tool” or supply a genuinely verified video; create or attach real
  printables; keep the Grade 1 concrete scope; and decide whether
  “associative” belongs in the teacher note rather than the child-facing title.

### 3. Distinguish Long from Short Vowel Sounds — Oral

- **Target slug/status:** `distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral`;
  canonical MDX exists in both source and target.
- **Exact source row/IDs:** `New project\db\Curriculum_Tracker.xlsx`, sheet
  `Grade 1-2 Combined`, workbook row **43**, Grade 1 sequence **1.0**. No
  separate curriculum DB ID is asserted.
- **Grade/topic:** Grade 1; Literacy & Phonics; Phonological Awareness (oral,
  no print).
- **Curriculum wording/codes:** “Distinguish long from short vowel sounds in
  spoken single-syllable words (oral)”; US `RF.1.2.a`; Ontario `B2` alignment
  note.
- **Provenance:** Workbook row and UFLI Foundations recommendation. The
  canonical MDX explicitly labels the oral-only routine as editorial and says
  not to introduce print during the activity.
- **Suggested template:** `video` / teacher-preview-first, but the current
  source is a toolbox reference rather than a saved video.
- **Available resources and state:**
  - UFLI Foundations Toolbox:
    `https://ufli.education.ufl.edu/foundations/toolbox/` — source-linked
    teacher reference; no specific video is supplied.
  - UFLI printable-resources landing page:
    `https://ufli.education.ufl.edu/foundations/printable-resources` — source
    link; this page’s practice is oral and does not require a printable.
- **Rights caveats:** Link to UFLI. Do not copy UFLI slides, word lists, or
  printable materials into the site without permission.
- **Editorial still required:** Keep the “no print” constraint prominent;
  supply a real video only if a suitable UFLI or authorized teacher model is
  found; define the oral response cards as teacher-made/editorial if retained;
  and identify the five-word quick check as site-authored.

### 4. Distinguish Long and Short Vowels in Print — VCe Review

- **Target slug/status:** `distinguish-long-and-short-vowels-when-reading-one-syllable-words-review-apply-a-u`;
  canonical MDX exists in both source and target.
- **Exact source row/IDs:** `New project\db\Curriculum_Tracker.xlsx`, sheet
  `Grade 1-2 Combined`, workbook row **64**, Grade 2 sequence **17.0**. No
  separate curriculum DB ID is asserted.
- **Grade/topic:** Grade 2; Literacy & Phonics; Phonics & Word Recognition.
- **Curriculum wording/codes:** “Distinguish long and short vowels when
  reading one-syllable words (review/apply, a-u)”; US `RF.2.3.a`; Ontario `B2`.
- **Provenance:** Workbook row, UFLI recommendation, and the source project’s
  `CONTENT_REVIEW.md`, which specifically verifies the Lesson 59 slide deck
  and home-practice PDF while limiting the claim to VCe patterns.
- **Suggested template:** `video` / preview-and-print-first. This is the
  strongest current video/resource candidate because it has a named deck and
  a direct printable PDF.
- **Available resources and state:**
  - UFLI Lesson 59 slide deck:
    `https://ufli.education.ufl.edu/wp-content/uploads/2022/08/59_Slides_UFLIFoundations.pptx`
    — canonical source marks verified; supports the VCe subset only.
  - UFLI Lesson 59 home practice PDF:
    `https://ufli.education.ufl.edu/wp-content/uploads/2022/08/59_HomePractice_UFLI-Foundations.pdf`
    — canonical source marks direct printable verified; supports the VCe
    subset only.
  - UFLI toolbox:
    `https://ufli.education.ufl.edu/foundations/toolbox/` — source-linked
    reference.
- **Rights caveats:** Link to UFLI’s authorized files; do not rehost or
  incorporate the slide deck/PDF into the site until permission is known.
- **Editorial still required:** Make the VCe limitation visible above the
  fold; do not claim coverage of all long-vowel spellings; verify current URLs;
  and keep the site’s sorting routine marked editorial.

### 5. I Went Down into the Barnyard

- **Target status:** New music-first Markdown seed candidate; no lesson file
  should be created from this report alone.
- **Exact source rows/IDs:** Song catalog `DB_ID **167**`, full catalog
  workbook row **231**, and recent prompt workbook row **2** in
  `New project\data\kathy_reid_naiman_full_561_songs.xlsx` and
  `kathy_reid_naiman_recent_28_prompt_dataset.xlsx`. Curriculum mappings are
  in `song_mapping_batch_B_CLEAN.csv`, file rows **191–192**:
  `CU#226` (secondary) and `CU#248` (primary).
- **Grade/age/topic:** Source age **Ages 1–3**; primary mapping is Grade 1
  Science & Nature, theme Animals.
- **Curriculum wording/code:** Primary mapping `CU#248`: “Plant/animal
  structures that help survival (Gr 1)”. Secondary mapping `CU#226`:
  “Describe people, places, things, events with relevant details (Gr 1)”.
  These are internal `CU#` mapping IDs, not verified Ontario code fields.
- **Provenance:** Kathy Reid-Naiman, *Reaching for the Stars*, track 14;
  source dataset records DB ID 167 and marks the YouTube link verified. The
  dataset provides animal-sound actions, learning goals, staff lead Miss
  Puddles, student Maisy, and a worksheet brief.
- **Suggested template:** `music`; the song and call-and-response are the core
  experience, with optional matching/drawing after the music.
- **Available media/resources and state:**
  - YouTube: `https://www.youtube.com/watch?v=HIPiJHj6wKw` — source dataset
    marks verified; not independently rechecked here.
  - Official lyrics/action reference:
    `kathyreidnaiman.com/track/i-went-down-into-the-barnyard` — source dataset
    reference; access state not independently checked.
  - Local videos listed by the dataset: `barnyard-animals.mp4` and
    `Down In the Barnyard/i-went-down-into-the-barnyard.mp4` — local asset
    presence/rights not established by this audit.
- **Rights caveats:** Treat the recording and lyrics as copyrighted. Prefer a
  link/embed to the authorized destination; do not publish local MP4s or
  reproduce lyrics until rights are documented. The source-to-`CU#248` animal
  structures connection is an editorial mapping, not evidence that the song
  itself teaches survival structures.
- **Editorial still required:** Choose the pedagogically honest primary goal
  (animal sounds/vocabulary is directly supported; animal survival is a
  cross-curricular extension); write the teacher sequence, check, and
  accessibility alternatives; and confirm the official URL/rights before
  marking ready.

### 6. Dig a Little Hole

- **Target status:** New music-first Markdown seed candidate; no lesson file
  should be created from this report alone.
- **Exact source rows/IDs:** Song catalog `DB_ID **389**`, full catalog
  workbook row **411**, and recent prompt workbook row **3** in the canonical
  561-song export and recent prompt dataset. Curriculum mappings are in
  `song_mapping_batch_B_CLEAN.csv`, file rows **722–725**:
  `CU#248`, `CU#251`, `CU#252`, and `CU#253`.
- **Grade/age/topic:** Source age **Ages 2–4**; primary mapping is Grade 2
  Science & Nature, theme Nature & Plants, topic seeds.
- **Curriculum wording/code:** Primary mapping `CU#251`: “Environmental Plant
  Needs (Gr 2)”. Secondary mappings: `CU#248` “Plant/animal structures that
  help survival (Gr 1)”; `CU#252` “Seed Dispersal and Pollination (Gr 2)”; and
  `CU#253` “Habitats and Biodiversity (Gr 2)”. These are internal mapping IDs,
  not verified Ontario code fields.
- **Provenance:** Kathy Reid-Naiman, *Spring is Coming*, track 7; source
  dataset records DB ID 389, actions (dig, plant, cover, water), a four-step
  sequence brief, staff lead Mr Sam, student Whiskers, and source-marked
  verified YouTube links.
- **Suggested template:** `music`; actions and the song’s pacing are the core,
  followed by an optional sequencing printable or planting activity.
- **Available media/resources and state:**
  - YouTube: `https://www.youtube.com/watch?v=ZZ1CpsJw4qg` and
    `https://www.youtube.com/watch?v=qrMbXZSoSmk` — source dataset marks both
    verified; not independently rechecked here.
  - Official lyrics/action reference:
    `kathyreidnaiman.com/track/dig-a-little-hole` — source dataset reference;
    access state not independently checked.
  - Local videos listed by the dataset: `a-little-garden.mp4` and
    `planting-seeds-with-care.mp4` — local asset presence/rights not
    established by this audit.
- **Rights caveats:** Link/embed authorized recordings; do not copy the song
  text or local video. A sequencing worksheet can be authored as original site
  content, but the song’s lyrics/artwork and any downloaded source worksheet
  remain rights-sensitive.
- **Editorial still required:** Select one source-justified learning focus;
  avoid claiming that the song alone teaches pollination or biodiversity;
  create the printable as an original or link to a cleared source; and add
  seated/gesture-only participation options.

### 7. Over in the Meadow

- **Target status:** New music-first Markdown seed candidate; no lesson file
  should be created from this report alone.
- **Exact source rows/IDs:** Song catalog `DB_ID **232**`, full catalog
  workbook row **539**, and recent prompt workbook row **4** in the canonical
  561-song export and recent prompt dataset. Curriculum mappings are in
  `song_mapping_batch_B_CLEAN.csv`, file rows **314–316**, and
  `song_mapping_batch_C_CLEAN.csv`, file rows **333–334**. The mapping IDs are
  `CU#248`, `CU#251`, `CU#253`, `CU#11`, and `CU#24`.
- **Grade/age/topic:** Source age **Ages 2–5**; strongest direct curriculum
  candidate is Grade 1 Math & Numeracy, theme Nature & Plants / Numbers &
  Counting.
- **Curriculum wording/code:** Primary direct math mapping `CU#11`: “Count to
  50 starting at any number; read and write numbers to 50 (Gr 1)”. Secondary
  `CU#24`: “Represent and interpret data with up to 3 categories (Gr 1)”. The
  other mappings connect to Grade 1/2 science topics, but are weaker than the
  song’s directly documented count-to-10 structure. These `CU#` values are
  internal mapping IDs, not verified Ontario code fields.
- **Provenance:** Kathy Reid-Naiman, *Zoom, Zoom Cuddle and Croon*, track 4;
  source dataset records DB ID 232, counting/animal actions, worksheet brief,
  staff lead Mr Sam, student Sam, and a source-marked verified YouTube link.
- **Suggested template:** `music`; counting, repetition, movement, and animal
  naming are the core experience, with a count-and-circle printable as an
  optional extension.
- **Available media/resources and state:**
  - YouTube: `https://www.youtube.com/watch?v=zuVsgsEaZ94` — source dataset
    marks verified; not independently rechecked here.
  - Official lyrics/action reference:
    `kathyreidnaiman.com/track/over-in-the-meadow` — source dataset reference;
    access state not independently checked.
  - Local videos listed by the dataset: three `Over in the Meadow` MP4 paths —
    local asset presence/rights not established by this audit.
- **Rights caveats:** Treat recording and lyrics as copyrighted. Link/embed
  the authorized recording; do not ship the local MP4s or reproduce lyrics
  without rights documentation.
- **Editorial still required:** Cap the first version at the documented
  count-to-10 song experience and make the Grade 1 count-to-50 mapping an
  extension rather than a claim about the song; define a real printable or
  mark it editorial; and check whether the “data categories” connection is
  useful enough to retain.

## Deliberately not in the first batch

- **Clap Your Hands:** The target contains `content/lessons/clap-your-hands.mdx`,
  but its source reference is `lib/early-years.ts`, whose own comment says the
  set is illustrative and stands in for database rows. The song has useful
  mapping records, but this page is not yet a source-backed publishable Markdown seed.
- **Tapping on My Sticks:** The prompt dataset is unusually strong: DB IDs
  **160** and **286**, official artist URL, source-marked verified YouTube,
  actions, age 2–5, and a worksheet brief. However, the curriculum links only
  appear in the unclean `song_mapping_batch_B.csv` file rows **438–440** under
  the title “I’m tapping on my sticks”, while the clean mapping export does
  not retain them. Hold for the next batch until the duplicate/title mapping
  is reconciled.
- **New kindergarten/daycare hub topics:** `lib/early-years.ts` explicitly
  describes these as illustrative stand-ins. Do not present them as verified
  curriculum pages until they are sourced to reviewed archive records.

## Batch acceptance checklist

Before any candidate becomes a visible “ready” page, the database/content
team should record:

1. The immutable workbook/file name, sheet, source row, `DB_ID` or `CU#`, and
   import batch.
2. The exact curriculum wording, jurisdiction, grade/age, and whether the
   connection is source-provided or editorial.
3. A checked destination URL, destination type (video, app, slide deck,
   printable, or landing page), access state, and last-checked date.
4. Rights mode: link only, embed, excerpt, reproduce, or unresolved.
5. Separate editorial fields for teacher steps, observable evidence,
   differentiation, character framing, and printables.
6. A page-level review decision. “Source-marked verified” is not sufficient
   by itself to publish a resource as ready.
