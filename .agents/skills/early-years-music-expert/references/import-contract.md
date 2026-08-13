# Import contract

Use alongside `sql-expert` when the database lead needs educational review.

- Python/Ollama may normalize text, identify duplicate candidates, and propose tags. They must not write SQLite or decide source boundaries.
- The reviewer supplies source path, checksum, page locator, title, ordered lyrics/sections, documented actions/chords, and evidence notes.
- The database lead writes one transaction and verifies foreign keys, integrity, source links, line breaks, search-index parity, and retrieval tests.
- Exact duplicates may attach transcription and primary-source references without altering the canonical song. Variants remain separate until reviewed.
- Search-facing records should connect songs to topics, curriculum links, tags, actions, or search chunks when the source or expert rationale supports the connection.