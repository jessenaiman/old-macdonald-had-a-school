# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Teachers and caregivers of children 0–7 (daycare through grade 2). Their job is lesson planning: song lyrics and activities, each one linked to a valid academic reason to use it. In early-years practice the caregiver is the real student — programmes teach through children to adults — so every material carries the "why" next to the "what".

Not for: lesson-plan generation, curriculum authorship, or anyone looking for a full syllabus.

## Product Purpose

Save a teacher time finding folk education materials, and link each one to a valid academic subject. It is not a lesson planner and it adds no work for the teacher. A teacher otherwise googles and reviews resources one by one; this brings them together in one place and lets the teacher print what they need, keeping their own workflow — no logic on our end.

## Positioning

Sits between full lesson curricula and bare lyrics sites: trusted songs treated as versions, organised by what each grade is teaching. Underneath, it is a marketing engine — the "Old MacDonald Had a ____" search pattern brings traffic, and each newly released video compounds it. The time saved is the trade: a teacher who saves time is more inclined to spend some of it listening to the music or watching the videos.

## Operating Context

- Early-years music sessions are ritualised: hello and goodbye songs, small repertoires repeated deeply, transitions with their own songs.
- A song is a score for physical action: lap bounces, fingerplays, clapping games, circle games. The caregiver's lap and hands are the equipment.
- Singing is pre-reading instruction: singing slows language down for the ear, and rhyme builds phonological awareness (ALA's Read, Talk, Sing, Write, Play practices).
- Songs are versions, not fixed texts: names, letters, sizes, and purposes get swapped freely — 1843's "mark it with T for Tommy" and 2022's "change Baby to Mama" are the same folk process.
- Participation is graduated: listen → move → gesture → hum → sing → invent.
- Teachers print grade and lesson pages nearly as-is; the blank pinned sheets are intentional write-in surfaces for the teacher's own notes.
- Music is meant to be shared. When technology shifted, it took the physical media out of the classroom; it did not take the value away.

## Capabilities and Constraints

- Grade-scoped hubs (daycare, preschool, kindergarten, grade 1, grade 2); curriculum topics linked to standards; a 240-song practical songbook with teaching sheets (lyrics, documented actions, chords where present, source citations); search across everything.
- Links and downloads for the owner's worksheets plus approved worksheets sourced online.
- The home page surfaces the owner's educational music videos. YouTube links are central to the product, not quiet; support routes to Ko-fi.
- Does not author full lesson curricula — it organises, links, prints, and points.
- The database (`data/omhas.db`) is read-only source truth; markdown lesson files are examples until validated.
- Immediate requirement: the front page also delivers as a marketing vehicle. The site may eventually look like the reference images; that is not the current requirement.

## Brand Commitments

- The 16 characters and their written personalities. The complete identity record lives in `DESIGN.md`; bound in `app/globals.css` and `app/brand-assets.css`; never recoloured or derived in code. Academic lead and grade/scope always read before character name.
- Eight reserved staff colours, held as visual references and relationships to the subject matter. A student's colour is the staff colour through one universal shift and adds no reserved colour.
- Felt and paper are the material world: felt carries the patches, paper carries readable work.
- Art references and YouTube links grow as videos are released; the art evolves and gets hand-drawn over time.
- The design is playful and inviting like Sesame Street: a teacher works in a space that puts them in their students' mindset.
- Learning is fun, but challenging and honest.
- **The owner is the product.** `Old MacDonald Had a School` is the owner's creative vision and the educational videos are the owner's idea; the About page sells the owner as a developer, not the fictional school.
- **Child-first mindset.** The product does not get pulled into political or adult issues, and it does not spend a teacher's attention on them. It exists for the people it is made for — the children — and the mindset of the people the owner works with is part of that promise.
- The five core values — Look, Care, Inclusion, Growth, Music and peace — from the mission statement. A designer carries at least two of them in every creative work, felt rather than shown. Recorded in `DESIGN.md`. Source: `[[Projects/Endless Measures/Old MacDonald/Mission Statement/Old MacDonald Had a School|Mission Statement — Core Values]]`.

## Evidence on Hand

- `docs/early-years-music-resources/` — 228+ sources (public-library handouts, educator/performer materials, historical songbooks 1843–1929), 1,405 extracted song versions, and the synthesised findings in `knowledge/core-lessons.md` (five durable lessons with citations).
- `DESIGN.md` — the complete character, grade, and subject design record.
- `.dsh-study/character-deck/deck.txt` — the character deck: identity lock, personality, friends, on-screen use, wardrobe and props per character.
- `data/omhas.db` — 388 curriculum topics with standards joins, songs, resources, tags.
- Owner's music video, first reference: `https://www.youtube.com/watch?v=HIPiJHj6wKw`.

## Product Principles

1. Save the teacher time: grade-first, find it in seconds, print-and-go.
2. Never author lessons. Link verified sources, each with its academic reason.
3. Add no work for the user: no accounts, no extra buttons, no logic on our end.
4. Music is meant to be shared; technology took the physical media, not the value.
5. Traffic compounds with each released video — the site is a marketing engine as well as a resource.

## Accessibility & Inclusion

Inclusion by design: a music activity that excludes a non-verbal or motor-diverse child is a design failure, not a child failure. Graduated participation is the product's inclusion mechanism. Maintain accessible interaction and readable presentation per `DESIGN.md`.
