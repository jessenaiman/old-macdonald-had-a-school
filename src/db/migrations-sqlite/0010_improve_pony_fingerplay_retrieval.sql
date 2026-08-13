PRAGMA foreign_keys = ON;

UPDATE search_chunks
SET chunk_text = 'Pony Boy

Pony boy, pony boy
Won’t you be my pony boy?
Here we go,
Don’t go slow,
Giddy-up, giddy-up, giddy-up
Whoa!

Printed variant instruction: Repeat with pony girl.

Material type: fingerplay and lap rhyme. Search concepts: fingerplays with ponies, pony rhyme, horse rhyme.

Teacher use: a brief pony-themed participation rhyme supporting animal vocabulary, rhyme recognition, and movement to a steady pulse.',
    updated_at = CURRENT_TIMESTAMP
WHERE source_path = 'docs/early-years-music-resources/song_versions/pony-boy-pierce-county-library-wiggles-tickles-rhymes.md';
