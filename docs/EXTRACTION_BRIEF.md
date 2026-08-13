# Brief: Extract Songs from Historical PDFs

## What to do
Open each PDF listed below. Look at every page and transcribe any children's songs, rhymes, fingerplays, or action songs you find. Skip tables of contents, indexes, copyright pages, and non-song content.

## Priority — 14 historical songbooks
All at `C:\old-macdonald-had-a-school\docs\early-years-music-resources\XX-category\pdf\`:

1. `wier-songs-children-love-to-sing-1916.pdf` (18 MB)
2. `mother-gooses-nursery-rhymes-1900.pdf` (18 MB)
3. `dann-first-year-music-rote-songs-1914.pdf` (12 MB)
4. `victor-music-appreciation-little-children-1920.pdf` (11 MB)
5. `moses-rhythmic-action-plays-dances-1915.pdf` (10 MB)
6. `moore-childs-song-and-game-book-1899.pdf` (9 MB)
7. `arnold-child-life-in-music-1912.pdf` (9 MB)
8. `songs-every-child-should-know-1906.pdf` (8 MB)
9. `bell-singing-circle-action-songs-1911.pdf` (6 MB)
10. `moffat-little-songs-of-long-ago-1912.pdf` (6 MB)
11. `porter-negro-folk-singing-games-1914.pdf` (5 MB)
12. `newbery-original-mother-gooses-melody-1889.pdf` (4 MB)
13. `westman-lessons-kindergarten-music-1902.pdf` (4 MB)
14. `parsons-rhyme-road-to-music-land-1911.pdf` (3 MB)

## Return format — one JSON file per PDF

```json
{
  "source_file": "wier-songs-children-love-to-sing-1916.pdf",
  "songs": [
    {
      "title": "Canonical Song Title",
      "type": "Song",
      "page_number": 42,
      "sections": [
        {
          "name": "Verse 1",
          "lyrics": "Full lyric text for this section.\nSecond line.\n\nBlank line between verses.",
          "actions": "What children do during this section."
        },
        {
          "name": "Chorus",
          "lyrics": "Chorus lyrics here.",
          "actions": "Chorus actions here."
        }
      ],
      "recordings": [
        {
          "artist": "Performer or Composer",
          "album": "Album Name (if listed)",
          "year": 1914,
          "key": "C major",
          "notes": "Listed as 'Traditional' in source"
        }
      ],
      "language": "English",
      "arrangement_notes": "Sheet music included with melody line"
    }
  ]
}
```

## Field rules

| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Clean title, no numbering |
| `type` | ✅ | One of: Song, Movement, Fingerplay, Bounce, Story, Poem, Lullaby, Game |
| `page_number` | ✅ | PDF page number where found |
| `sections[].lyrics` | ✅ | Full lyrics for this section. One verse per line, blank line between stanzas |
| `sections[].actions` | ⬜ | Only if the PDF shows action instructions |
| `recordings[].artist` | ⬜ | Only if the PDF credits a specific performer/composer |
| `language` | ⬜ | Default "English" |

## Critical rules
1. **Never invent lyrics or actions.** Transcribe exactly what you see. If you can't read it, skip it.
2. **Lyrics and actions are separate.** If the PDF has inline action notes like `(clap hands)`, put them in `actions`, not `lyrics`.
3. If a song has a tune instruction ("sung to the tune of London Bridge"), add `"tune_of": "London Bridge"` to the song object.
4. If the same song appears in multiple PDFs, include it each time.
5. If the PDF shows sheet music (staves, notes), set `"arrangement_notes": "Sheet music included"` — don't try to transcribe pitches.
6. If a song has multiple named sections (verse, chorus, bridge), split them into separate `sections` entries. If it's just one block of lyrics, use one section with `"name": "Full song"`.

## What happens after
I'll take the JSON, run duplicate detection against the existing 1,789-song database, import genuinely new songs into `song_recordings` and `song_sections`, and link them to curriculum topics.
