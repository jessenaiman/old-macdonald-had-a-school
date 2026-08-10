# Knowledge Layer — Early-Years Music Research Collection

This folder is the **synthesized knowledge layer** over the raw research
collection in `docs/early-years-music-resources/` (228+ freely shared
song-teaching sources: public-library handouts, educator/performer materials,
historical public-domain songbooks 1843–1929, plus 1,405 extracted song
versions in `song_versions/`).

The raw collection answers "what did we collect?"; this folder answers
"what does it mean and where do I find it again?" — for humans and for AI
agents alike.

## Files

| File | What it is | When to read |
|---|---|---|
| `core-lessons.md` | The five durable lessons of early-years music education, each with mechanism, evidence locators, and design implications. | To gain expertise quickly; to justify a design decision. |
| `history-fingerplays.md` | The history of fingerplays (folk origins → Froebel 1844 → kindergarten movement → Poulsson 1893 → folklorists → modern storytime), with timeline and traceable lineages. | Any question about song/fingerplay history. |
| `retrieval-guide.md` | Topic → source map with concrete locators (sections, pages, line numbers) and lookup workflows. | To answer a specific question with primary evidence. |
| `knowledge-index.json` | Flat machine-readable index: one entry per retrievable fact (id, topics, fact, source, locator, optional quote). | Fast grep-style lookup by topic; feed to scripts or agents. |

## Conventions

- **Paths** in all knowledge files are relative to
  `docs/early-years-music-resources/`.
- **Citations**: creator + year + local filename (e.g. *Poulsson 1893,
  `poulsson-finger-plays-nursery-kindergarten-1893.pdf`*).
- **Quotes** were verified against the source files on 2026-08-07. Re-verify
  before publishing; scanned historical PDFs have no text layer — use
  read_file with a page range, not grep.
- **Quality flags**: most `song_versions/*.md` entries carry
  `review_status: pending_qc` — treat extracted lyrics/actions as leads, not
  verified text.
- Raw collection metadata access date: 2026-08-04.

## For AI agents

The companion skill `.agents/skills/early-years-music-expert/SKILL.md` loads
this knowledge layer and encodes retrieval + citation rules. If you are not
running that skill, start here: read `core-lessons.md`, then use
`retrieval-guide.md` / `knowledge-index.json` to pull primary evidence for
whatever you claim.

## Maintenance

When new synthesis happens (a new lesson, a new historical deep-dive), add it
here as its own markdown file, add entries to `knowledge-index.json`, and add
a row to `retrieval-guide.md`. Keep facts in the JSON, narrative in the
markdown — do not duplicate long prose between files.
