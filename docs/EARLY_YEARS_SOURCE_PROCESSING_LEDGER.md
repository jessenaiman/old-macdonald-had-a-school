# Early-years source processing ledger

Updated: 2026-08-12

## Processing contract

Process one source file at a time.

1. Record the source path, checksum, creator, title, URL, and exact locator.
2. Review the source directly before trusting extracted Markdown or spreadsheet fields.
3. Assign one Terra agent the named source file and the `early-years-music-expert` skill.
4. Separate source-stated facts from expert/editorial lesson suggestions.
5. Match canonical entities by source/version evidence, not title alone.
6. Dry-run each transaction against a copy of `data/omhas.db`.
7. Promote only reviewed facts and rationale-bearing topic links.
8. Run `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, and retrieval regressions.
9. Keep the pre-batch database backup until the reviewed changes are committed and accepted.

## Status vocabulary

- `planning_manifest`: identifies work but contains no importable content rows.
- `duplicate_snapshot`: byte-identical source retained once for provenance.
- `needs_record_repair`: existing row is matched but extracted or normalized incorrectly.
- `needs_source_version`: canonical work exists but this sourced version is not represented correctly.
- `needs_review`: source or identity ambiguity remains.
- `reviewed_promoted`: source was directly checked, independently reviewed, dry-run, and promoted.
- `rejected`: corrupt, hallucinated, unsupported, or irrelevant.

## Completed files

| Source | SHA-256 | Disposition | Database result | Review |
|---|---|---|---|---|
| `data/Early Years Action Song Research Corpus.xlsx` | not recorded | `planning_manifest` | No content rows imported. Its five source records remain source-work items. | Direct workbook inspection and visual review of all five sheets. |
| `docs/early-years-music-resources/song_versions/pony-ride-good-days-with-kids-circle-time-songs-toddlers.md` | `d509e6d70b1adc65c39abd820f41c9544e0bd35d903eeff42a2e0877bef2c0bd` | `reviewed_promoted` | Repaired `songs.id=1341`; removed merged Elevator content; attached PDF and Markdown provenance; added reviewed tags and topic links. | Direct PDF page review plus independent Terra early-years expert review. |

## Duplicate sources

| Canonical source | Duplicate | SHA-256 | Disposition |
|---|---|---|---|
| `docs/early-years-music-resources/01-libraries-agencies/pdf/uark-ecep-favorite-songs-fingerplays.pdf` | `docs/early-years-music-resources/02-educators-publishers/pdf/uark-ecec-favorite-songs-and-fingerplays.pdf` | `eea6691ca65787bdbf7af4890b3a38cd69841910e3c14301ca1ef20d15c4cccc` | Keep one canonical evidence copy; mark the other `duplicate_snapshot`; do not import twice. |

## Next file

`docs/early-years-music-resources/02-educators-publishers/pdf/good-days-with-kids-circle-time-songs-toddlers.pdf`

Process the separate `Elevator` item on PDF page 1 next. First compare it against existing `Elevator Song` and `The Elevator Song` records as a distinct sourced version. Do not append it to Pony Ride and do not merge on title alone.

## Inventory awaiting file-level disposition

- 192 PDFs
- 1,432 Markdown files
- 38 HTML captures
- 29 text files
- 2 workbooks
- stories/books: current `book_suggestions` coverage must be audited
- activities/lesson plans: current `activities` coverage must be audited
- topic-material links: existing heuristic fan-out remains untrusted unless reviewed

The inventory counts are source-file counts, not counts of complete imports.
