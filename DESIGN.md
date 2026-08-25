# Old MacDonald Had a School Design System

## Overview

This system translates the official branding pages into a framework-neutral contract for websites, presentations, printable resources, editorial pages, and other generated artifacts.

It serves an educator-facing curriculum product. Its job is to make a specific learning purpose and the practical material needed to lead it easy to understand at a glance. The visual world is not children’s entertainment and not a generic dashboard: it is a welcoming, capable working environment for planning and leading real learning experiences.

Only `content/pages/branding/*.mdx` defines official branding or design. `characters.mdx` controls cast identity. `app/globals.css` and `app/brand-assets.css` are implementation evidence. `public/` is storage, not automatic authority. Do not infer design rules from other Markdown files, route copy, filenames, code comments, contact sheets, or available-but-unregistered assets.

When sources conflict:

1. Preserve exact cast identity, curriculum role, color, and canonical artwork from `characters.mdx`.
2. Preserve explicit composition and usage rules from the other branding MDX pages.
3. Use CSS only to bind those rules to current values and files.
4. Stop for approval rather than inventing, optimizing, excluding, or silently substituting.

## Design thesis

Create a living classroom working wall, not a generic dashboard and not a cork-themed interface.

The working wall supports preparation. A teacher should be able to find the lesson purpose, the next useful action, and the material they need before noticing decorative detail. Character art and mixed-media texture make the work inviting and memorable, but they never displace instructional clarity or turn an age-appropriate activity into a worksheet-shaped page.

Foreground information behaves like a real teaching artifact: paper, note, badge, portrait, textile patch, or clipped workspace. It sits on a supporting surface and looks installed there. Cork is one valid support. Dark leather, denim, paper, card, and other approved materials can also support a composition when their documented role fits.

The attachment relationship is the signature move:

- A fastener crosses the foreground object's edge.
- The same fastener visibly meets the supporting surface.
- Shadows, overlap, slight offset, and restrained rotation clarify depth.
- A floating fastener, decorative fastener inside an object, or fastener with no supporting surface is invalid.
- Not every object needs a fastener. Use one only when attachment is structurally credible.

Educational meaning leads decoration. Choose curriculum, grade, character, material, and icon because each has a documented job.

## Experience principles

### Academic meaning first

Lead with academic field or learning action before character name. Character identity supports the learning context; it does not replace it.

Lead a teaching resource with its lesson purpose and learner group as well. A song, story, video, activity, or printable must look connected to the learning it serves, rather than presented as free-floating content.

### Developmentally appropriate material

The design must match the teaching format to the learners. Early-years resources prioritize instructor-led songs, stories, sensory play, movement, visual cues, and observation. Daycare and Preschool materials remain highly visual and group-oriented. Worksheets, written responses, and formal-looking practice are reserved for a specific Kindergarten-to-Grade-2 learning purpose; they are never the default visual language for younger children.

### One semantic owner

Character color and felt belong only to that character. Grade color belongs to that grade. Subject color and icon belong to curriculum meaning. Generic navigation and controls use shared semantic UI roles, never cast texture.

### Readable work on paper

Paragraphs, instructions, form labels, tables, learner work, and dense teacher information use paper. Fabric is an attached identity specimen or owned object, never the default reading surface.

### Real artifacts, live content

Text remains live and editable. Use repeating paper surfaces behind live content. Never bake an entire responsive card, paragraph, or control into a raster image.

### Warm, capable, specific

Tone feels welcoming, handmade, organized, and teacher-useful. Avoid childish clutter, sterile enterprise dashboards, decorative randomness, and nostalgia without educational function.

## Composition grammar

Build compositions in four layers:

1. **Environment** — page, slide, or sheet canvas.
2. **Support** — leather, denim, cork, paper, card, or another approved structural surface.
3. **Artifact** — readable paper, character-owned patch, badge, curriculum card, photograph, or illustration.
4. **Attachment** — paperclip, masking tape, binder clip, push pin, or another approved fastener crossing artifact and support.

At least one composition in a branded artifact should demonstrate the support–artifact relationship. Do not cover every surface with texture. Give readable artifacts calm space.

Use overlap to show construction, not to hide information. Keep text, controls, faces, icons, and focus indicators clear of fasteners. Small rotations may suggest a placed object; they must never reduce alignment, legibility, or apparent quality.

### Depth

- Support surfaces sit at the lowest content plane.
- Paper and textile artifacts lift one plane with border and restrained shadow.
- Fasteners sit above the artifact edge.
- Dialogs, menus, and focus indicators remain functionally above decorative layers.
- Do not use glossy glassmorphism, neon glow, or deep synthetic 3D effects.

## Materials

### Paper

Default readable surface. Cardboard paper supports cards and work stages. Ruled paper supports prose aligned to its repeating rule. Grid paper supports diagrams, number work, and planning. Repeats extend as content grows.

For ruled paper on web, current implementation evidence uses a 28 px mobile rule interval and 32 px from the existing small-screen layout threshold. Other media should preserve line-to-text alignment rather than copy those pixel values blindly.

### Cork

Working board holding attached paper, fabric, and fasteners. Use semantic repeating texture for responsive surfaces. Fixed-composition board exports are review references, not stretchable page backgrounds.

### Leather

Dark structural surface for shared header, footer, attached edge treatments, and the homepage base. Paper headings and lesson lists may be clipped or taped to it.

### Denim

Presentation-board textile behind installed workspaces. It is a support, not a generic content card.

### Felt and woven cloth

Felt requires a semantic owner. Character felt uses that character's approved identity. Grade patches use the documented grade mapping. Neutral woven cloth is an attached textile object, never the wall behind pinned notes. Never use a character texture for unrelated subjects, navigation, or generic controls.

### Asset boundaries

Asset paths stay behind semantic names. Do not paste file URLs into components or generation prompts when a semantic asset role exists. Contact sheets and composites are references, not production surfaces. Availability does not grant permission to invent a role. No asset may be excluded, substituted, renamed, deleted, or classified as non-production without explicit approval.

## Colors

Semantic roles come before raw color values.


### Foundation roles

- Canvas: warm cream.
- Readable surface: warm paper.
- Primary ink: very dark blue-green.
- Structural dark: deep navy.
- Border and joinery: warm wood.
- Focus and highlight: curriculum gold.
- Destructive state: warm rose.

Physical-material colors remain stable across themes. A dark display mode may change surrounding UI roles, but paper remains paper, navy remains navy, and character identity colors remain exact.

### Character identity: validated web binding

`characters.mdx` is the authority. The values below are also present unchanged as `--cast-*-color` bindings in `app/globals.css`. Every reference should present the academic lead and grade or scope before the less-prominent character name, then show the exact CSS token, value, and canonical artwork.

| Grade or scope | Academic lead | Character | CSS token | Color |
| --- | --- | --- | --- | --- |
| Kindergarten | Music · Community · Literacy | Old MacDonald | `--cast-old-macdonald-color` | `#B87A4A` |
| Daycare | Early Learning · Movement · SEL | Miss Puddles | `--cast-miss-puddles-color` | `#F6AF32` |
| Kindergarten | Music · Rhythm · Counting | Mr Rusty | `--cast-mr-rusty-color` | `#3589C4` |
| Grade 1 | Literacy · Music · Drama | Miss Hayley | `--cast-miss-hayley-color` | `#D95C86` |
| Whole school | Mathematics · Science · Engineering | Mr Sam | `--cast-mr-sam-color` | `#2A9A9A` |
| Grade 2 | Physical Education · Health | Mr Maisy | `--cast-mr-maisy-color` | `#C45D62` |
| Whole school | Science · Visual Arts · Communication | Mr Puddles | `--cast-mr-puddles-color` | `#5367B5` |
| Preschool | Community · Science · Food & Health | Miss Maisy | `--cast-miss-maisy-color` | `#6B9A7A` |
| No grade assigned | Physical Education · Health | Hopper | `--cast-hopper-color` | `#E66C71` |
| No grade assigned | Literacy · Music · Drama | Whiskers | `--cast-whiskers-color` | `#E695B0` |
| No grade assigned | Community · Science · Food & Health | Scout | `--cast-scout-color` | `#8DC4A8` |
| No grade assigned | Early Learning · Movement · SEL | Penny | `--cast-penny-color` | `#F9CB7A` |
| No grade assigned | Music · Community · Literacy | Maisy | `--cast-maisy-color` | `#E8C8A0` |
| No grade assigned | Science · Visual Arts · Communication | Puddles | `--cast-puddles-color` | `#8F9CCF` |
| No grade assigned | Mathematics · Science · Engineering | Sam | `--cast-sam-color` | `#6CB1B1` |
| No grade assigned | Music · Rhythm · Counting | Rusty | `--cast-rusty-color` | `#72AAD2` |

Never derive, recolor, optimize, or substitute these values. Scout and Sam remain distinct. A learner may share an academic lead with staff but never inherits that staff member's grade.

### Cast record contract (applied design guide binding)

Every cast reference is a complete record, presented in this order: academic lead and grade or scope first, then species and teaching role, then curriculum contributions, then the binding pair (`data-character` + asset-role class), the exact token, and the canonical asset paths. One approved identity supports three live shapes — circle, square, rectangle. Use the geometry the layout requires; never recolor the transparent artwork, never substitute a baked portrait background, and never sample color from portrait pixels.

Staff curriculum contributions are part of identity and travel with the record:

| Character | Curriculum contributions | Bound icon |
| --- | --- | --- |
| Old MacDonald | Community: gatherings, processions, assembly. Literacy: storytime. Music: whole-school singing, banjo and guitar. | `music-icon` |
| Miss Puddles | Early learning: circle time and fingerplay songs. Visual arts: art table. Physical development: movement games and swimming. SEL: sharing and turn-taking. | `early-learning-icon` |
| Mr Rusty | Music: fiddle, steady beat and rhythm games. Early numeracy: counting the beat. Dance: barn-dance circle and transitions. | `music-fiddle` |
| Miss Hayley | Literacy: storytime. Music: songs and singing. Drama: imagination games and class adventures. Creative movement. | `drama-storytelling-icon` |
| Mr Sam | Mathematics: counting, measuring, sorting, patterns. Science and engineering: investigation and building. | `math-building-icon` |
| Mr Maisy | Physical education: outdoor games, movement warm-ups, gross-motor play. Health: healthy eating and body positivity. | `physical-education-icon` |
| Mr Puddles | Science and nature: bird studies. Visual arts: painting and photography. Communication: exhibitions and sharing work. | `art-photography-icon` |
| Miss Maisy | Community: family welcome and office support. Science and nature: gardening and seasonal displays. Food and health: preparation and healthy habits. | `gardening-health-icon` |

Learners (Hopper, Whiskers, Scout, Penny, Maisy, Puddles, Sam, Rusty) carry the same record shape with learning actions and personality instead of a role, pair to the same icon as their subject lead, and never take a staff grade label. Each of the 16 records owns four canonical artwork roles: full-body portrait, transparent face patch, background-backed face bust, and embroidered badge — paths live in `characters.mdx` and resolve through `app/brand-assets.css`.

Change authority runs in one order: update the approved record in `characters.mdx`, bind the exact color in `app/globals.css`, bind artwork roles in `app/brand-assets.css`, store unchanged artwork in the approved folder, consume `data-character` plus the asset-role class, then verify subject, grade or scope, role, paths, token, contrast, and crop.

### Academic-label clarity

- Preserve each approved academic lead exactly, but do not imply that every term has the same curriculum status. Mathematics, science, music, literacy, visual arts, drama, physical education, and health read as subject areas; rhythm, counting, movement, communication, community, engineering, food, and social-emotional learning may also describe strands, contexts, or cross-curricular links.
- Expand `SEL` as “social-emotional learning (SEL)” on first teacher-facing use.
- Treat “Whole school” as reach or scope, never as a grade. Treat “No grade assigned” as an explicit learner state, never as missing content.
- Use `Preschool` as the display label. Keep `pre-school` only where the implementation key is required.
- When a source record provides a teacher title or official curriculum reference, show those beside the approved academic lead rather than guessing a standard or level of coverage.

### Grade ownership

| Grade | Owner | Color |
| --- | --- | --- |
| Early Years | shared early-years identity | `#6B9A7A` |
| Daycare | Miss Puddles | `#F6AF32` |
| Preschool (`pre-school`) | Miss Maisy | `#6B9A7A` |
| Kindergarten | Mr Rusty | `#3589C4` |
| Grade 1 | Miss Hayley | `#D95C86` |
| Grade 2 | Mr Maisy | `#C45D62` |

## Typography

Use type roles together inside a real composition, not as detached specimens.

- **Display and page headings — Boogaloo.** Friendly, open learning invitations. Responsive size, normal weight, tight leading, balanced lines.
- **Section labels — Lilita One.** Short labels and strong section cues.
- **Body and interface — Nunito.** Paragraphs, instructions, metadata, labels, fields, tables, controls, and actions. Body defaults to 16 px with generous 1.7 line height.
- **Human cue — Caveat.** One short teacher sentence, quote, or reminder. Never use for instructions, labels, controls, or long passages.
- **Brand/editorial accent — Playfair Display bold italic.** Reserve for approved identity or editorial moments; never replace readable body copy.

Uppercase eyebrows may use heavy body weight with approximately `0.13em` tracking. Do not use handwriting as decoration across an entire page.

## Identity and imagery

### Character hierarchy

Academic field appears first. Character name and personality follow. Keep readable text outside portrait silhouettes.

For web implementation, use a semantic selector and artwork role together, for example `data-character="mr-rusty"` with `character-face-bust`. `app/brand-assets.css` resolves that pair to the canonical file declared in `characters.mdx`; consuming components should not carry the URL. A style guide may print the resolved path for verification, but it must also show the actual asset so a missing or incorrect binding is visible.

Canonical character forms:

1. Transparent full portrait for introductions and full character cards.
2. Transparent face patch for compact identity on a live owned surface.
3. Background-backed face bust where that canonical artwork is required.
4. High-resolution embroidered badge for large screen or print artwork.

Portrait and embroidered badge pixels remain unchanged. A live circle badge combines an unchanged transparent face or portrait with the character's semantic surface. Do not generate a new colored-circle raster for each theme.

Staff roster contains exactly eight: Old MacDonald, Miss Puddles, Mr Rusty, Miss Hayley, Mr Sam, Mr Maisy, Mr Puddles, and Miss Maisy. Mr Maisy and Miss Maisy are Maisy's parents. Sam's Mom is not canonical unless added to `characters.mdx`.

### Curriculum icons

Select icons by subject, activity, or learning relationship. Never rotate icons by list position or choose one for visual variety.

- Large: subject introductions, feature cards, empty states.
- Medium: lesson cards, grade pathways, curriculum panels.
- Small: navigation, compact metadata, filters; use the governed flat export.

Use dimensional felt art only at large and medium sizes. Never shrink detailed felt art into compact UI.

### Logo family

Use the compact flat mark at 32 px, navigation mark at 44 px, card mark for grouped teacher actions, and detail mark for editorial or print-scale destinations. Use identity as part of a real composition, not a detached logo specimen.

## Components

### Button

Use one shared button family. Variant communicates behavior and material treatment. Default actions use at least 44 px touch height. Icon-only controls require an accessible name. Character color remains local to character-owned components.

### Card and attached note

Readable card surface is paper. A note on a support surface may use one credible fastener crossing its edge. Live text, separate semantic icon, and independent fastener remain separate layers.

### Character badge

Compose three independent layers: character-owned live surface, unchanged matching portrait or transparent face, and attachment only when physically attached to another surface.

### Grade workspace

Use one shared workroom structure: grade-owned identity/navigation rail beside a readable paper work stage. A working board may sit inside the paper stage and hold attached notes. Supply grade and character identity, not raw color, portrait path, texture, or breakpoint values.

### Subject note

One production unit owns paper silhouette, live text, curriculum icon, fastener, teacher guide, and lesson links. Six subjects may appear together without assigning a character to every subject.

### Controls

Reuse shared accessible primitives for buttons, inputs, tabs, disclosure, navigation, cards, and dialogs. Do not create page-local visual control walls.

## Layout

This contract defines behavior, not a duplicate responsive framework. The target medium selects implementation breakpoints. Tailwind v4 may be generated as a web adapter; do not encode Tailwind utilities or configuration into this source contract.

### Fluid web

- Start with one readable column.
- Add columns only when each artifact preserves useful width and visible attachment logic.
- Stack grade rail above work stage when side-by-side geometry becomes cramped.
- Preserve content order when visual layers collapse.
- Keep fasteners clear of text and touch targets at every width.
- Use live repeating textures; never stretch fixed board art.
- Keep navigation marks at their approved compact or navigation roles.

### Presentation profile

Use a 16:9 canvas. One learning idea per slide. Preserve environment, support, artifact, and attachment hierarchy. Use large/medium curriculum art, short live text, high-resolution character badge or portrait, and generous safe margins. Avoid shrinking a web page into a slide.

### Print profile

Support A4 and US Letter. Keep text and essential imagery inside printer-safe margins. Repeat paper or material textures without visible seams. Fasteners may cross an artifact edge but never cross trim or obscure content. Use canonical high-resolution artwork. Ensure the result remains understandable in grayscale and when printed without background graphics.

### Editorial and social profiles

Preserve academic lead, semantic ownership, readable paper, and installed-object logic. Crop environments before cropping characters or curriculum signals. Do not invent new character poses, colors, or badges to fill an aspect ratio.

## Accessibility

- Maintain readable contrast using the approved foreground paired with each semantic surface.
- Never use character, grade, or subject color as the only carrier of meaning; include text or a semantic icon.
- Keep body text live, selectable, and resizable.
- Provide text alternatives for meaningful portraits, scenes, and curriculum images. Hide purely decorative fasteners from assistive technology.
- Maintain at least 44 px primary touch targets.
- Provide visible keyboard focus above all decorative layers.
- Preserve logical reading order independent of visual overlap.
- Respect reduced-motion preference. Attachment and material identity must not depend on animation.

## Motion

Motion is restrained and functional: focus, disclosure, selection, carousel change, or artifact placement feedback. Do not animate texture continuously. Avoid bounce, wobble, parallax, or novelty motion that competes with teaching content. Reduced-motion mode removes nonessential movement.

## Content voice

Write for teachers and young learners with clarity, warmth, and concrete action. Use active verbs. Name what learners notice, test, make, sing, count, explain, or share. Keep headings inviting and specific. Avoid corporate product language, generic inspiration, and character-first copy that hides the academic purpose.

## Do's and Don'ts

### Do

- Start from curriculum meaning.
- Use exact approved identity colors and canonical art.
- Put readable information on paper.
- Make attachment physically legible.
- Use semantic asset roles.
- Keep content live across media.
- Preserve all assets pending explicit classification.

### Do not

- Treat cork as the whole design concept.
- Use a floating decorative fastener.
- Put paragraphs or controls on fabric.
- Assign character felt to generic navigation or subjects.
- Recolor character artwork.
- Choose icons randomly.
- Shrink dimensional art into compact UI.
- Bake responsive text into images.
- Stretch fixed-composition board exports.
- Duplicate Tailwind's responsive system.
- Infer authority from other Markdown files or file availability.
- Exclude or substitute an image without approval.

## Agent generation contract

Before generating:

1. Identify medium, audience, learning purpose, academic field, grade, and character owner if any.
2. Select semantic surface, artifact, and attachment roles.
3. Select canonical imagery and curriculum icon by meaning.
4. Confirm all asset references resolve.
5. Keep implementation framework outside this contract.

Reject output when:

- Academic purpose is unclear.
- Character or curriculum ownership is invented.
- Color or canonical artwork is altered.
- Foreground artifacts float without credible support.
- Decorative texture reduces readability.
- A fastener does not cross artifact and support.
- A file is missing, silently substituted, or excluded.
- Web-framework syntax leaks into cross-medium source rules.

When a required source is missing, stop and report the exact path. Never conceal the defect with a guessed replacement.
