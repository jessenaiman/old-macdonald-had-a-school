# Product

<!-- impeccable:product-schema 1 -->

## Product Principles

1. Education and Music are an important combination when applied to the appropriate academic lessons
2. Students in each grade learn differently at these ages (infants up to grade 2)
3. Songs have lessons within them that are documented by qualified instructors. Your role is never to create new lesson plans.
4. Teachers are exhuasted and lesson planning often does not have time for sourcing quality musical content to match curriculum requirements. This website links resources only, it does not create it's own lesson plans, and it does not write the markdown lesson content
5. Early Years applies to (daycare and preschool)
6. There are 5 grades: Daycare, Preschool, Kindergarten, Grade 1, and Grade 2  
7. Education principles must only be sourced from the academic sources, not from LLM generated markdown
8. Save the teacher time: grade-first mindset, find curriculum, songs, videos, resource printout in seconds, print-and-go. 
9. No added functionality on the website for users, llm integration, printing. The site makes sure to not load the teacher with more buttons and context to remember, putting the focus on getting their lesson planning done quickly so they can spend the extra time polishing it by listening to the songs or videos

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

- The 16-character cast (8 staff, 8 learners) with exact colors, curriculum contributions, icon pairings, and four artwork roles each — recorded completely in DESIGN.md, bound in `app/globals.css` and `app/brand-assets.css`, never recolored or derived in code. Academic lead and grade/scope always read before character name.
- The applied design guide's character record contract and color scheme (see DESIGN.md, "Character record contract").
- The existing logo family and the material system (paper, cork, felt, fabric, leather, denim) as selectable backgrounds — cork is a choice, not the identity.

## Evidence on Hand

- `docs/early-years-music-resources/` — 228+ sources (public-library handouts, educator/performer materials, historical songbooks 1843–1929), 1,405 extracted song versions, and the synthesized findings in `knowledge/core-lessons.md` (five durable lessons with citations).
- `DESIGN.md` — complete character, grade, and subject design authority. `content/pages/branding/characters.mdx` is a retired brand page pending owner deletion.
- `data/omhas.db` — 388 curriculum topics with standards joins, songs, resources, tags.
- The applied design guide PDF — color scheme, character record structure, implementation order.



## Accessibility & Inclusion

Inclusion by design: a music activity that excludes a non-verbal or motor-diverse child is a design failure, not a child failure. Graduated participation is the product's inclusion mechanism. Maintain accessible interaction and readable presentation per DESIGN.md.
