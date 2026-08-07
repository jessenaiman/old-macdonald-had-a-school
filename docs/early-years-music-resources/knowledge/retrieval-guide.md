# Retrieval Guide — Topic → Source Map

How to go from a question to the right primary source in the collection, fast.
Path convention: relative to `docs/early-years-music-resources/`.
For machine lookup use `knowledge-index.json` (same locators, flat entries).
For synthesized narratives use `core-lessons.md` and `history-fingerplays.md`.

## How to use

1. Find the topic below; read the listed sources in the order given
   (rationale first, then repertoire/examples).
2. Verify any quote against the file before citing it (scanned PDFs render as
   images via read_file; text captures support grep).
3. Cite as **creator + year + local file**. If a `song_versions/*.md` entry is
   the source, note its frontmatter `review_status` (most are `pending_qc`)
   and `confidence`.

## Topic map

### Why singing supports literacy / phonological awareness
- `01-libraries-agencies/web/evanston-public-library-ecrr-singing.html` — the
  mechanism quote (article body ~line 812): singing slows language down.
- `06-educators-performers-deep/web/headstart-music-in-child-development.md` —
  § Music, Language, and Literacy (teapot rhyme → reading success).
- `01-libraries-agencies/pdf/ohio-ready-to-read-rhyme-with-me.pdf` — rhyme +
  science of reading deck.
- `01-libraries-agencies/pdf/isabella-plains-ecs-50-songs-rhymes-preschool.pdf`
  — 50-song booklet, vocabulary/phonemic-awareness purpose.
- `01-libraries-agencies/pdf/library-toolshed-early-literacy-virtual-storytimes.pdf`
  — six early-literacy skills.
- ECRR five practices: `01-libraries-agencies/pdf/multnomah-county-library-read-talk-sing-write-play.pdf`,
  `01-libraries-agencies/web/chicago-public-library-every-child-ready-to-read.html`.

### Movement, body, steady beat
- `06-educators-performers-deep/web/headstart-music-in-child-development.md` —
  § Music and Movement (gross/fine motor, spatial awareness).
- `09-educators-performers-more/pdf/feierabend-music-movement-early-years-handout.pdf`
  — 8-part curriculum; Laban movement portfolio (p. 8); fingerplays (p. 9);
  beat motion (p. 1–2).
- `09-educators-performers-more/pdf/teachmommyteach-steady-beat-ideas.pdf` —
  steady-beat activities ages 2–7.
- `song_versions/analysis-and-pedagogical-use-oxford-kodaly-in-kindergarten.md`
  — Kodály analysis: tone set, rhythm, melodic form, *game*.
- Lap-bounce choreography: `01-libraries-agencies/pdf/haverhill-public-library-baby-bounce-rhymes.pdf`,
  `01-libraries-agencies/pdf/mid-north-coast-library-baby-bounce-booklet.pdf`,
  `01-libraries-agencies/pdf/demco-lets-make-music-dance.pdf` (movement types
  per rhyme: bounce/lift, hand, hand/movement).

### Self-regulation, emotions, inclusion
- `06-educators-performers-deep/web/headstart-music-in-child-development.md` —
  § Music and Emotional Development; § Music Includes Everyone; § Music Can
  Make Children Feel Special!
- `06-educators-performers-deep/web/pbs-daniel-tiger-strategy-songs-article.html`
  — strategy songs for big feelings.
- `song_versions/itsy-ditsy-spider-the-learning-station-brain-boosting-music.md`
  — a familiar melody repurposed as breathing meditation.

### Child as creator; arioso; invented songs
- Head Start vignettes (Anita's doll song; Diego's garbage-truck song) —
  `headstart-music-in-child-development.md`.
- Feierabend 8-part list, category 4 "Arioso (Spontaneous created songs by the
  child)" — feierabend handout p. 1.

### Caregiver as the real student; storytime as adult training
- `01-libraries-agencies/pdf/ala-alsc-sample-storytime-asides.pdf` — early
  literacy "asides" to adults inside storytime.
- `01-libraries-agencies/pdf/la-county-library-storytime-rhymes.pdf` — parent
  letter urging repetition at home.
- `04-historical-public-domain/pdf/froebel-mother-play-nursery-songs-1906.pdf`
  — "Notes to Mothers" (book p. 159+), the historical original.

### Repetition, ritual, routine
- `01-libraries-agencies/pdf/great-scott-county-lle-booklet-0-24mo.pdf` — 12
  weeks, one Song of the Week.
- `01-libraries-agencies/pdf/mid-north-coast-library-baby-bounce-booklet.pdf` —
  Hello/Goodbye songs.
- `06-educators-performers-deep/web/jbrary-welcome-and-hello-songs.html`,
  `06-educators-performers-deep/web/jbrary-toddler-storytime-wiggles-songs.html`.

### The canon / what songs everyone uses
- `metadata/01-libraries-agencies.md` — summary table of 34 library sources;
  the recurring repertoire is visible across rows.
- `01-libraries-agencies/pdf/isabella-plains-ecs-50-songs-rhymes-preschool.pdf`
  — a named 50-song canon.
- `01-libraries-agencies/pdf/health-unit-nursery-rhymes-circle-time-cards.pdf`
  — 58 printable cards of the traditional core.
- `04-historical-public-domain/doc/gutenberg-quigley-index-kindergarten-songs-1914.txt`
  — the 1914 cross-publisher index (Pat-a-cake at ~lines 8999–9005).

### Song versions / the folk process / how a song changed over time
- `RESEARCH_RULES_v2.md` — the "every document is a version" charter;
  year/era/region metadata schema.
- `song_versions/` — 1,405 extracted versions; filename = song + source.
  Frontmatter fields: `source_file`, `source_id`, `confidence`,
  `review_status`, `educational_domain`, `activity_material`, `age_range`.
- Worked examples: `song_versions/twinkle-twinkle-*.md` (7 versions),
  `song_versions/*itsy*.md` (9 versions).
- Historical strata: `04-historical-public-domain/` (1843–1929),
  `07-historical-more/` (more scanned songbooks 1899–1922).

### Fingerplay history
- `knowledge/history-fingerplays.md` — the synthesized narrative (read first).
- Primary: poulsson-1893 (Preface, PDF pp. ~9–14), froebel-1906 (TOC book pp.
  5–6 ≈ PDF pp. 5–6; finger pages 49–77; Notes to Mothers 159),
  jenks-1887 (Walker & Jenks; contents page, PDF pp. ~7–10, FINGER PLAYS
  section), quigley-1914 (~8999–9005), gomme-1894 (hand-games; survival
  claims), 1843 Mother Goose (~1006–1016).

### Provenance of a specific song ("where did our version come from?")
1. Glob `song_versions/<song-slug>*.md`; read frontmatter for `source_file`
   and `source_title`.
2. Cross-reference `MASTER_LIST.md` (retrieval logs, status) and
   `metadata/<folder>.md` (detailed records with url, year, era, region).
3. If the question is "how was it taught in era X", filter `song_versions`
   filenames by source era (e.g. `*-poulsson-*`, `*-gaynor-*`,
   `*-wagga-wagga-*`).

### Curriculum-design precedents (lesson architecture)
- Feierabend 8-part sequence (pitch exploration → fragment singing → simple
  songs → arioso → songtales; movement exploration → form/expression → beat
  motion) — feierabend handout pp. 1–2.
- Library session architecture (opening rhyme → books → rhymes/songs/
  fingerplays → flannel → activity) —
  `01-libraries-agencies/pdf/lvccld-storytime-resources-outline.pdf`.
- State standards: `06-educators-performers-deep/pdf/nevada-prek-music-standards-teacher-guidebook-2020.pdf`,
  `09-educators-performers-more/pdf/georgia-prek-content-standards-music.pdf`.

## Caveats

- Most `song_versions` entries are `review_status: pending_qc` — treat their
  extracted lyrics/actions as good leads, verify against `source_file` before
  publishing.
- Scanned historical PDFs have no text layer; grep fails on them. Use
  read_file with a `pages` range (renders page images).
- `glob` can return false negatives on this drive (OneDrive). A "No files
  found" from glob is not proof of absence — confirm with `list_directory`
  before concluding a path is dead.
- Web snapshots sometimes lack a publication year in metadata; cite them as
  "creator, n.d. (accessed 2026-08-04)".
- Metadata access date for all records: 2026-08-04. Knowledge synthesis date:
  2026-08-07.
