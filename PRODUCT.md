# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Teachers and caregivers of children ages 0–7 (daycare through grade 2) preparing music and early-childhood experiences. In early-years practice the caregiver is the real student: programs teach through children to adults, so every material must carry the "why" next to the "what".

## Product Purpose

Old MacDonald Had a School is a planning and resource-gathering website for music and early-childhood education. It does not create lessons; it helps a teacher walk into the room already knowing what they will sing, why it works, and what to watch for. Success is teacher time saved — grade-first mindset, find-it-in-seconds, print-and-go — and more music actually happening in more rooms.

## Positioning

A grade-first planning companion. The teacher picks the grade they teach and lands in the right mindset and material set: curriculum-linked topics, teaching sheets with lyrics, actions, and source provenance, and printable planning sheets they write on by hand. Neighboring products are either full lesson curricula or bare lyrics sites; this one sits between — trusted songs treated as versions, organized by what each grade level is teaching.

## Operating Context

- Early-years music sessions are ritualized: hello and goodbye songs, small repertoires repeated deeply, transitions with their own songs.
- A song is a score for physical action: lap bounces, fingerplays, clapping games, circle games. The caregiver's lap and hands are the equipment.
- Singing is pre-reading instruction: singing slows language down for the ear, and rhyme builds phonological awareness (ALA's Read, Talk, Sing, Write, Play practices).
- Songs are versions, not fixed texts: names, letters, sizes, and purposes get swapped freely — 1843's "mark it with T for Tommy" and 2022's "change Baby to Mama" are the same folk process.
- Participation is graduated: listen → move → gesture → hum → sing → invent.
- Teachers print grade and lesson pages nearly as-is; the blank pinned sheets are intentional write-in surfaces for the teacher's own notes.

## Capabilities and Constraints

- Grade-scoped hubs (daycare, preschool, kindergarten, grade 1, grade 2); curriculum topics linked to standards; a 240-song practical songbook with teaching sheets (lyrics, documented actions, chords where present, source citations); search across everything.
- Links and downloads for the owner's worksheets plus approved worksheets sourced online.
- Music discovery quietly routes to the owner's YouTube channel and Spotify; support routes to Ko-fi. Present, never loud.
- Does not author full lesson curricula — it organizes, links, prints, and points.
- The database (`data/omhas.db`) is read-only source truth; markdown lesson files are examples until validated.

## Brand Commitments

- The 16-character cast (8 staff, 8 learners) with exact colors, curriculum contributions, icon pairings, and four artwork roles each — bound in `content/pages/branding/characters.mdx`, never recolored or derived in code. Academic lead and grade/scope always read before character name.
- The applied design guide's cast record contract and color scheme (see DESIGN.md, "Cast record contract").
- The existing logo family and the material system (paper, cork, felt, fabric, leather, denim) as selectable backgrounds — cork is a choice, not the identity.

## Evidence on Hand

- `docs/early-years-music-resources/` — 228+ sources (public-library handouts, educator/performer materials, historical songbooks 1843–1929), 1,405 extracted song versions, and the synthesized findings in `knowledge/core-lessons.md` (five durable lessons with citations).
- `content/pages/branding/characters.mdx` — cast and teaching-role authority.
- `data/omhas.db` — 388 curriculum topics with standards joins, songs, resources, tags.
- The applied design guide PDF — color scheme, cast record structure, implementation order.

## Product Principles

1. Repetition is the feature: small repertoires, deeply repeated, ritualized.
2. The body is the first instrument: every song carries its action; the lap and hands are equipment.
3. Songs are versions: invite swapping names, letters, sizes, and purposes.
4. Teach through children to adults: print the why beside the what.
5. Every child participates: graduated entry points — humming counts, moving counts, watching counts.
6. Save the teacher time: grade-first mindset, find-it-in-seconds, print-and-go.

## Accessibility & Inclusion

Inclusion by design: a music activity that excludes a non-verbal or motor-diverse child is a design failure, not a child failure. Graduated participation is the product's inclusion mechanism. Maintain accessible interaction and readable presentation per DESIGN.md.
