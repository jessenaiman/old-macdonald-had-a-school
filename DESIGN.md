---
name: Old MacDonald Had a School
description: A living classroom working wall for educator-facing curriculum planning and real learning experiences.
colors:
  canvas-cream: "#fefce8"
  readable-paper: "#fdf8e3"
  readable-paper-muted: "#5B5144"
  primary-ink: "#1a2a2e"
  structural-navy: "#1e2a38"
  character-foreground-light: "#FEFCE8"
  character-foreground-dark: "#1E2A38"
  character-foreground-maximum: "#000000"
  joinery-wood: "#c4a07a"
  focus-gold: "#d4a82a"
  destructive-rose: "#d47a8a"
  identity-old-macdonald: "#A66A32"
  identity-miss-puddles: "#F6AF32"
  identity-mr-rusty: "#267CBA"
  identity-miss-hayley: "#D95C86"
  identity-mr-sam: "#1D8787"
  identity-mr-maisy: "#D81D24"
  identity-mr-puddles: "#5367B5"
  identity-miss-maisy: "#5D8164"
  identity-hopper: "#E66C71"
  identity-whiskers: "#E695B0"
  identity-scout: "#C59E7A"
  identity-penny: "#F9CB7A"
  identity-maisy: "#96AD9A"
  identity-puddles: "#8F9CCF"
  identity-sam: "#6CB1B1"
  identity-rusty: "#72AAD2"
  grade-early-years-routing: "#5D8164"
  grade-daycare-routing: "#F6AF32"
  grade-preschool-routing: "#5D8164"
  grade-kindergarten-routing: "#267CBA"
  grade-one-routing: "#D95C86"
  grade-two-routing: "#D81D24"
  subject-music-routing: "#267CBA"
  subject-math-routing: "#1D8787"
  subject-science-routing: "#5D8164"
  subject-language-routing: "#D95C86"
  subject-arts-routing: "#5367B5"
  subject-health-routing: "#D81D24"
  subject-early-learning-routing: "#F6AF32"
typography:
  display:
    fontFamily: "Boogaloo, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 2.75rem)"
    fontWeight: 400
  section:
    fontFamily: "Lilita One, sans-serif"
    fontSize: "26px"
    fontWeight: 400
  heading:
    fontFamily: "Boogaloo, sans-serif"
    fontSize: "20px"
    fontWeight: 700
  title:
    fontFamily: "Boogaloo, sans-serif"
    fontSize: "18px"
    fontWeight: 700
  card-title:
    fontFamily: "Boogaloo, sans-serif"
    fontSize: "15px"
    fontWeight: 700
  body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  small:
    fontFamily: "Nunito, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "Nunito, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  caption:
    fontFamily: "Nunito, sans-serif"
    fontSize: "11px"
    fontWeight: 700
  hand:
    fontFamily: "Caveat, cursive"
    fontSize: "21px"
  hand-note:
    fontFamily: "Caveat, cursive"
    fontSize: "22px"
  brand:
    fontFamily: "Playfair Display, serif"
    fontWeight: 700
rounded:
  sm: "calc(0.625rem * 0.6)"
  md: "calc(0.625rem * 0.8)"
  lg: "0.625rem"
  xl: "calc(0.625rem * 1.4)"
  2xl: "calc(0.625rem * 1.8)"
  3xl: "calc(0.625rem * 2.2)"
  4xl: "calc(0.625rem * 2.6)"
components:
  button-primary:
    backgroundColor: "{colors.structural-navy}"
    textColor: "{colors.canvas-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "44px"
  paper-card:
    backgroundColor: "{colors.readable-paper}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
  grade-surface-chip-daycare:
    backgroundColor: "{colors.grade-daycare-routing}"
    textColor: "{colors.structural-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    height: "44px"
  search-input:
    backgroundColor: "{colors.readable-paper}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "44px"
  character-badge-mr-rusty:
    backgroundColor: "{colors.identity-mr-rusty}"
    textColor: "{colors.character-foreground-maximum}"
    rounded: "{rounded.4xl}"
    size: "44px"
---

# Old MacDonald Had a School Design System

## Overview

**Creative North Star: "Living Classroom Working Wall"**

This system translates the official character record into a framework-neutral contract for websites, presentations, printable resources, editorial pages, and other generated artifacts.

It serves an educator-facing curriculum product. Its job is to make a specific learning purpose and the practical material needed to lead it easy to understand at a glance. The visual world is not children’s entertainment and not a generic dashboard: it is a welcoming, capable working environment for planning and leading real learning experiences.

**DESIGN.md and PRODUCT.md are the only design sources of truth.** This file carries the complete character, grade, and subject design records — colors, foregrounds, curriculum relationships, icon bindings, and canonical artwork paths. `content/pages/branding/characters.mdx` is retired and pending owner deletion; do not consume or update it. `app/globals.css` and `app/brand-assets.css` are implementation bindings. `public/` is storage, not authority. Do not infer design rules from route copy, filenames, code comments, contact sheets, or available-but-unregistered assets.

When sources conflict:

1. Preserve the exact record documented in this file.
2. Use CSS only to bind those rules to current values and files.
3. Stop for approval rather than inventing, optimizing, excluding, or silently substituting.

**Key Characteristics:**
- Academic meaning first.
- Developmentally appropriate material.
- One semantic owner.
- Readable work on paper.
- Real artifacts, live content.
- Warm, capable, specific.

### Identity relationship contract

This diagram defines the design relationship; the tables below carry the exact values.

```mermaid
flowchart TD
  D["DESIGN.md<br/>complete approved records"] --> C["16 character identities<br/>color · foreground · text · role · artwork"]
  C --> G["Grade relationships<br/>five grades · grade icons"]
  C --> S["Subject relationships<br/>approved color + icon assets"]
  C --> P["Teacher / learner hue families<br/>visual pairing only · not a tier"]
  E["Early Years<br/>Daycare + Preschool grouping<br/>no independent color"] --> G
  G -->|"constrains; never becomes palette"| T["OMHAS semantic theme palette<br/>canvas · paper · ink · structure · focus"]
  S -->|"constrains; never becomes palette"| T
  P -->|"constrains; never becomes palette"| T
  T --> V["Light / dark variants<br/>identity values never change"]
  T --> U["shadcn controls<br/>semantic tokens"]
  T --> L["Tailwind CSS v4<br/>layout + responsive composition"]
  N["Next.js<br/>routes · fonts · images · global CSS"] --> L
```

- Identity colors are locked requirements, not the interface palette.
- Grade color stays on grade-owned navigation, rails, edges, and artifacts.
- Subject color/icon represents curriculum meaning; never infer it from a nearby character.
- Character color/felt appears only with that character's owned identity.
- Shared controls use OMHAS semantic tokens.
- Missing or conflicting relationships stop for approval.

### Design thesis

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

### Experience principles

#### Academic meaning first

Lead with academic field or learning action before character name. Character identity supports the learning context; it does not replace it.

Lead a teaching resource with its lesson purpose and learner group as well. A song, story, video, activity, or printable must look connected to the learning it serves, rather than presented as free-floating content.

#### Developmentally appropriate material

The design must match the teaching format to the learners. Early-years resources prioritize instructor-led songs, stories, sensory play, movement, visual cues, and observation. Daycare and Preschool materials remain highly visual and group-oriented. Worksheets, written responses, and formal-looking practice are reserved for a specific Kindergarten-to-Grade-2 learning purpose; they are never the default visual language for younger children.

#### One semantic owner

Character color and felt belong only to that character. Grade color belongs to that grade. Subject color and icon belong to curriculum meaning. Generic navigation and controls use shared semantic UI roles, never character texture.

#### Readable work on paper

Paragraphs, instructions, form labels, tables, learner work, and dense teacher information use paper. Fabric is an attached identity specimen or owned object, never the default reading surface.

#### Real artifacts, live content

Text remains live and editable. Use repeating paper surfaces behind live content. Never bake an entire responsive card, paragraph, or control into a raster image.

#### Warm, capable, specific

Tone feels welcoming, handmade, organized, and teacher-useful. Avoid childish clutter, sterile enterprise dashboards, decorative randomness, and nostalgia without educational function.

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

### Change authority

Change order runs in one direction: update this file, bind the exact color in `app/globals.css` (`--characters-*-color`, `--grade-*-color`, `--subject-*-color`), bind artwork roles in `app/brand-assets.css`, store unchanged artwork in `public/`, consume `data-character` plus the asset-role class, then verify subject, grade or scope, role, paths, token, contrast, and crop. No other file may originate a character, grade, or subject color.

Binding tables are normative implementation syntax. Renaming a class, data key, registry key, or canonical asset updates this file in the same change.

### Implementation bindings (CSS syntax)

The 16 character keys are `old-macdonald`, `miss-puddles`, `mr-rusty`, `miss-hayley`, `mr-sam`, `mr-maisy`, `mr-puddles`, `miss-maisy`, `hopper`, `whiskers`, `scout`, `penny`, `maisy`, `puddles`, `sam`, and `rusty`: eight staff followed by eight learners. Components provide meaning through `data-character="<key>"`; asset CSS owns URLs.

| Artwork or surface role | Normative binding | Source owner |
| --- | --- | --- |
| Full-body portrait | `BRAND_IMAGE_ASSETS.portraits[key]` | `data/brand/image-registry.ts` |
| Transparent face patch | `.character-face-patch` via `class="brand-asset character-face-patch <size-role>" data-character="<key>"` → `--character-face-patch` | `app/brand-assets.css` |
| Embroidered badge | `class="brand-asset character-embroidered-badge <size-role>" data-character="<key>"` → `--character-embroidered-badge` | `app/brand-assets.css` |
| Owned character surface | `.characters-surface` via `class="characters-surface characters-<key>"` on the same element → `--characters-<key>-color`, `--characters-<key>-foreground`, and texture | `app/globals.css` + `app/brand-assets.css` |

The approved asset-size roles are `.icon-micro` = 1rem, `.icon-small` = 2rem, `.icon-control` = 3rem, `.icon-medium` = 4.25rem, and `.icon-large` = 7rem.

| Grade | Surface selector | Signal selector |
| --- | --- | --- |
| Daycare | `[data-grade='daycare']` | `.grade-icon[data-grade-icon='daycare']` |
| Preschool | `[data-grade='pre-school']` | `.grade-icon[data-grade-icon='pre-school']` |
| Kindergarten | `[data-grade='kindergarten']` | `.grade-icon[data-grade-icon='kindergarten']` |
| Grade 1 | `[data-grade='grade-one']` | `.grade-icon[data-grade-icon='grade-one']` |
| Grade 2 | `[data-grade='grade-two']` | `.grade-icon[data-grade-icon='grade-two']` |

All five render in the shared site navigation, and homepage lesson rows may carry compact grade tags. The homepage does not repeat them in a separate grade rail. `[data-grade-group='early-years']` is the Daycare + Preschool grouping available elsewhere; it is not a sixth grade.

Subject paper binds through `[data-subject='<key>']`—for example `[data-subject='math']`—to `--subject-note-paper`. Current keys are `language`, `math`, `science`, `music`, `arts`, `health`, `sel`, and `fine-motor`. A fastener uses `class="brand-asset fastener-<name> <size-role>"` inside the artifact it visibly attaches.

### Color dosage (normative)

Identity, grade, and subject colors may own an entire component surface: character rails, all five grade chips, subject note paper, grade workspace rails, and structurally appropriate header or footer bands. Color is not restricted to a 1 px accent. The One Semantic Owner Rule governs **who owns a color**, never how much of an owned surface may use it.

Never invent a value to increase dosage. Never recolor one owner with another owner's value. Readable information still uses the approved foreground and paper hierarchy.

Light learner surfaces always pair with structural navy `#1E2A38`:

| Penny | Scout | Maisy | Required ink |
| --- | --- | --- | --- |
| <span aria-label="Penny swatch F9CB7A" style="display:inline-block;width:4rem;height:1.5rem;background:#F9CB7A;border:1px solid #1E2A38"></span> `#F9CB7A` | <span aria-label="Scout swatch C59E7A" style="display:inline-block;width:4rem;height:1.5rem;background:#C59E7A;border:1px solid #1E2A38"></span> `#C59E7A` | <span aria-label="Maisy swatch 96AD9A" style="display:inline-block;width:4rem;height:1.5rem;background:#96AD9A;border:1px solid #1E2A38"></span> `#96AD9A` | <span aria-label="Structural navy swatch 1E2A38" style="display:inline-block;width:4rem;height:1.5rem;background:#1E2A38;border:1px solid #1E2A38"></span> `#1E2A38` |

Character-surface foregrounds use only three shared roles: warm cream `#FEFCE8`, structural navy `#1E2A38`, or maximum-contrast black `#000000`. Choose the least severe role that reaches WCAG AA `4.5:1` against the character's locked background; use maximum black only where neither branded foreground reaches AA. Shared character surfaces bind card, card-foreground, and muted-foreground roles to the character tokens so generic component utilities cannot replace the approved pair. All normal character-surface text stays at full opacity so small role labels retain the approved foreground ratio. Textured character surfaces add a thin halo matching the locked character background immediately around live glyphs, shading local texture variation without recoloring the surface or creating a component-level exception. Opaque nested controls reset that inherited halo because their own surface supplies contrast.

### Character identity: complete record

Sixteen identities: eight staff, eight learners. Every reference presents the academic lead and grade or scope before the less-prominent character name, then the exact token, value, and canonical artwork. Never derive, recolor, optimize, or substitute these values. Scout and Sam remain distinct. A learner may share an academic lead with staff but never inherits that staff member's grade.

#### Staff

| Character | Species · role | Grade or scope | Academic lead | Color token | Color | Foreground | Bound subject icon |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Old MacDonald | Human · Principal and music teacher | Kindergarten | Music · Community · Literacy | `--characters-old-macdonald-color` | `#A66A32` | `#000000` | `music-icon` |
| Miss Puddles | Duck · Daycare teacher and swim instructor | Daycare | Early Learning · Movement · SEL | `--characters-miss-puddles-color` | `#F6AF32` | `#1E2A38` | `early-learning-icon` |
| Mr Rusty | Horse · Dance teacher | Kindergarten | Music · Rhythm · Counting | `--characters-mr-rusty-color` | `#267CBA` | `#000000` | `music-fiddle` |
| Miss Hayley | Human · Music, singing and drama teacher | Grade 1 | Literacy · Music · Drama | `--characters-miss-hayley-color` | `#D95C86` | `#000000` | `drama-storytelling-icon` |
| Mr Sam | Pig · Math, science and building teacher | Whole school | Mathematics · Science · Engineering | `--characters-mr-sam-color` | `#1D8787` | `#000000` | `math-building-icon` |
| Mr Maisy | Cow · Physical education and health teacher | Grade 2 | Physical Education · Health | `--characters-mr-maisy-color` | `#D81D24` | `#FEFCE8` | `physical-education-icon` |
| Mr Puddles | Duck · Art and photography teacher | Whole school | Science · Visual Arts · Communication | `--characters-mr-puddles-color` | `#5367B5` | `#FEFCE8` | `art-photography-icon` |
| Miss Maisy | Cow · School secretary, gardening lead and cooking teacher | Preschool | Community · Science · Food & Health | `--characters-miss-maisy-color` | `#5D8164` | `#000000` | `gardening-health-icon` |

Staff curriculum contributions are part of identity and travel with the record:

| Character | Curriculum contributions |
| --- | --- |
| Old MacDonald | Community: gatherings, processions, assembly. Literacy: storytime. Music: whole-school singing, banjo and guitar. |
| Miss Puddles | Early learning: circle time and fingerplay songs. Visual arts: art table. Physical development: movement games and swimming. SEL: sharing and turn-taking. |
| Mr Rusty | Music: fiddle, steady beat and rhythm games. Early numeracy: counting the beat. Dance: barn-dance circle and transitions. |
| Miss Hayley | Literacy: storytime. Music: songs and singing. Drama: imagination games and class adventures. Creative movement. |
| Mr Sam | Mathematics: counting, measuring, sorting, patterns. Science and engineering: investigation and building. |
| Mr Maisy | Physical education: outdoor games, movement warm-ups, gross-motor play. Health: healthy eating and body positivity. |
| Mr Puddles | Science and nature: bird studies. Visual arts: painting and photography. Communication: exhibitions and sharing work. |
| Miss Maisy | Community: family welcome and office support. Science and nature: gardening and seasonal displays. Food and health: preparation and healthy habits. |

#### Learners

Learners carry learning actions and personality instead of a teaching role, pair to the same icon as their subject lead, and never take a staff grade label. The teacher/learner pairing on the revision board is a visual hue-family marker only — it is not a tier, a role, or a source of meaning. The meaning is subject + grade + color + character.

| Character | Species | Academic lead | Color token | Color | Foreground | Bound subject icon |
| --- | --- | --- | --- | --- | --- | --- |
| Hopper | Rabbit | Physical Education · Health | `--characters-hopper-color` | `#E66C71` | `#1E2A38` | `physical-education-icon` |
| Whiskers | Cat | Literacy · Music · Drama | `--characters-whiskers-color` | `#E695B0` | `#1E2A38` | `drama-storytelling-icon` |
| Scout | Dog | Community · Science · Food & Health | `--characters-scout-color` | `#C59E7A` | `#1E2A38` | `gardening-health-icon` |
| Penny | Chick | Early Learning · Movement · SEL | `--characters-penny-color` | `#F9CB7A` | `#1E2A38` | `early-learning-icon` |
| Maisy | Cow | Music · Community · Literacy | `--characters-maisy-color` | `#96AD9A` | `#1E2A38` | `music-icon` |
| Puddles | Duck | Science · Visual Arts · Communication | `--characters-puddles-color` | `#8F9CCF` | `#1E2A38` | `art-photography-icon` |
| Sam | Pig | Mathematics · Science · Engineering | `--characters-sam-color` | `#6CB1B1` | `#1E2A38` | `math-building-icon` |
| Rusty | Horse | Music · Rhythm · Counting | `--characters-rusty-color` | `#72AAD2` | `#1E2A38` | `music-fiddle` |

| Character | Learning actions | Personality |
| --- | --- | --- |
| Hopper | Physical development: hop, walk and sit. Behaviours: listen, imitate and join in. | Energetic, optimistic and ready to join. |
| Whiskers | Inquiry: tilt the head and inspect. Behaviours: listen, sit and participate. | Curious, gentle and thoughtful. |
| Scout | Inquiry and discovery: lead, observe and point. SEL: listen and help a classmate. | Adventurous, observant and dependable. |
| Penny | Music: sing and play a small instrument. Physical development: stand and step. Behaviour: listen. | Young, earnest and growing in confidence. |
| Maisy | Music and rhythm: clap and sing. Behaviours: listen and model an action. | Warm, confident and encouraging. |
| Puddles | Music and rhythm: sing and join rhythm play. Physical development: waddle and gesture. Behaviour: listen. | Expressive, sociable and enthusiastic. |
| Sam | Mathematics and STEM: examine, count and build. Communication: listen and explain. | Thoughtful, inventive and cheerful. |
| Rusty | Music: play an instrument. Physical development: walk and gallop. SEL: listen and help. | Calm, reliable and quietly courageous. |

Family note: Mr Maisy and Miss Maisy are Maisy's parents. Sam's Mom is not canonical unless added here. Staff roster contains exactly eight.

#### Canonical artwork (all 16 records)

Each identity owns three artwork roles. Full-body portraits resolve through `BRAND_IMAGE_ASSETS.portraits[key]`; compact face patches and embroidered badges resolve through `app/brand-assets.css` using `data-character` plus an asset-role class. Components never carry these URLs. Pixels are never recolored; never substitute a baked portrait background; never sample color from portrait pixels.

| Character | Full-body portrait | Face patch | Embroidered badge |
| --- | --- | --- | --- |
| Old MacDonald | `/characters/full-body-transparent/old-macdonald-fullbody.webp` | `/characters/face-patch-transparent/old-macdonald.webp` | `/characters/high-res-cloth/01-old-macdonald-badge.webp` |
| Miss Puddles | `/characters/full-body-transparent/miss-puddles-fullbody.webp` | `/characters/face-patch-transparent/miss-puddles.webp` | `/characters/high-res-cloth/02-miss-puddles-badge.webp` |
| Mr Rusty | `/characters/full-body-transparent/mr-rusty-fullbody.webp` | `/characters/face-patch-transparent/mr-rusty.webp` | `/characters/high-res-cloth/03-mr-rusty-badge.webp` |
| Miss Hayley | `/characters/full-body-transparent/miss-hayley-fullbody.webp` | `/characters/face-patch-transparent/miss-hayley.webp` | `/characters/high-res-cloth/04-miss-hayley-badge.webp` |
| Mr Sam | `/characters/full-body-transparent/mr-sam-fullbody.webp` | `/characters/face-patch-transparent/mr-sam.webp` | `/characters/high-res-cloth/05-mr-sam-badge.webp` |
| Mr Maisy | `/characters/full-body-transparent/mr-maisy-fullbody.webp` | `/characters/face-patch-transparent/mr-maisy.webp` | `/characters/high-res-cloth/06-mr-maisy-badge.webp` |
| Mr Puddles | `/characters/full-body-transparent/mr-puddles-fullbody.webp` | `/characters/face-patch-transparent/mr-puddles.webp` | `/characters/high-res-cloth/07-mr-puddles-badge.webp` |
| Miss Maisy | `/characters/full-body-transparent/miss-maisy-fullbody.webp` | `/characters/face-patch-transparent/miss-maisy.webp` | `/characters/high-res-cloth/08-miss-maisy-badge.webp` |
| Hopper | `/characters/full-body-transparent/hopper-fullbody.webp` | `/characters/face-patch-transparent/hopper.webp` | `/characters/high-res-cloth/09-hopper-badge.webp` |
| Whiskers | `/characters/full-body-transparent/whiskers-fullbody.webp` | `/characters/face-patch-transparent/whiskers.webp` | `/characters/high-res-cloth/10-whiskers-badge.webp` |
| Scout | `/characters/full-body-transparent/scout-fullbody.webp` | `/characters/face-patch-transparent/scout.webp` | `/characters/high-res-cloth/11-scout-badge.webp` |
| Penny | `/characters/full-body-transparent/penny-fullbody.webp` | `/characters/face-patch-transparent/penny.webp` | `/characters/high-res-cloth/12-penny-badge.webp` |
| Maisy | `/characters/full-body-transparent/maisy-fullbody.webp` | `/characters/face-patch-transparent/maisy.webp` | `/characters/high-res-cloth/13-maisy-badge.webp` |
| Puddles | `/characters/full-body-transparent/puddles-fullbody.webp` | `/characters/face-patch-transparent/puddles.webp` | `/characters/high-res-cloth/14-puddles-badge.webp` |
| Sam | `/characters/full-body-transparent/sam-fullbody.webp` | `/characters/face-patch-transparent/sam.webp` | `/characters/high-res-cloth/15-sam-badge.webp` |
| Rusty | `/characters/full-body-transparent/rusty-fullbody.webp` | `/characters/face-patch-transparent/rusty.webp` | `/characters/high-res-cloth/16-rusty-badge.webp` |

One approved identity supports three live shapes — circle, square, rectangle. Use the geometry the layout requires. Portrait and embroidered badge pixels remain unchanged. A live circle badge combines an unchanged transparent face or portrait with the character's semantic surface. Do not generate a new colored-circle raster for each theme.

### Grade ownership

Grades inherit their owning teacher's color and own a grade icon asset. Early Years is a Daycare + Preschool grouping with no independent color; `--grade-early-years-color` aliases `var(--grade-pre-school-color)`.

| Grade | Owner | Color token | Color | Grade icon asset |
| --- | --- | --- | --- | --- |
| Early Years | Daycare + Preschool grouping | `--grade-early-years-color` | inherits `var(--grade-pre-school-color)` | — |
| Daycare | Miss Puddles | `--grade-daycare-color` | `#F6AF32` | `/brand-kit-icon-sheets/individual-icons/grade-daycare.webp` |
| Preschool (`pre-school`) | Miss Maisy | `--grade-pre-school-color` | `#5D8164` | `/brand-kit-icon-sheets/grade-variations-v2/individual-icons/02-preschool-apron-crayon-leaf.webp` |
| Kindergarten | Mr Rusty | `--grade-kindergarten-color` | `#267CBA` | `/brand-kit-icon-sheets/individual-icons/grade-kindergarten.webp` |
| Grade 1 | Miss Hayley | `--grade-one-color` | `#D95C86` | `/brand-kit-icon-sheets/individual-icons/grade-1.webp` |
| Grade 2 | Mr Maisy | `--grade-two-color` | `#D81D24` | `/brand-kit-icon-sheets/individual-icons/grade-2.webp` |

Grade signal assets are selected separately from grade colour via `.grade-icon[data-grade-icon=…]` in `app/brand-assets.css`; extended grade motifs (stacking blocks, sprout counting, schoolhouse, book-pencil, writing slate, ruler blocks, balance scale, measuring patterns) live there too and are grade-owned, never character-owned.

### Subject ownership

Subject color and icon represent curriculum meaning. The color is the academic lead's identity color; the icon is a governed asset, never chosen for variety.

| Subject area | Academic lead | Color token | Color | Icon class | Icon asset |
| --- | --- | --- | --- | --- | --- |
| Music · Rhythm · Counting | Mr Rusty | `--subject-music-color` | `#267CBA` | `music-icon` (flat) / `music-fiddle` (felt) | `/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/08-music-notes-paired-beam.webp` / `01-instrument-fiddle-bow.webp` |
| Music · Community · Literacy (whole-school singing) | Old MacDonald | identity routing (`--characters-old-macdonald-color`) | `#A66A32` | `music-hand-drum` (felt) / `music-icon` | `/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/06-instrument-hand-drum.webp` |
| Mathematics · Science · Engineering | Mr Sam | `--subject-math-color` | `#1D8787` | `math-building-icon` | `/brand-kit-icon-sheets/individual-icons/subject-math-building.webp` |
| Community · Science · Food & Health | Miss Maisy | `--subject-science-color` | `#5D8164` | `gardening-health-icon` | `/brand-kit-icon-sheets/individual-icons/subject-gardening-health.webp` |
| Literacy · Music · Drama | Miss Hayley | `--subject-language-color` | `#D95C86` | `drama-storytelling-icon` | `/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.webp` |
| Science · Visual Arts · Communication | Mr Puddles | `--subject-arts-color` | `#5367B5` | `art-photography-icon` | `/brand-kit-icon-sheets/individual-icons/subject-art-photography.webp` |
| Physical Education · Health | Mr Maisy | `--subject-health-color` | `#D81D24` | `physical-education-icon` | `/brand-kit-icon-sheets/individual-icons/subject-physical-education.webp` |
| Early Learning · Movement · SEL | Miss Puddles | (grade-daycare routing) | `#F6AF32` | `early-learning-icon` | `/brand-kit-icon-sheets/individual-icons/subject-early-learning.webp` |


Two music strands coexist and must not be merged: Mr Rusty owns rhythm, counting, and fiddle (`--subject-music-color`); Old MacDonald owns whole-school singing, gatherings, and song-led community (his identity color). A surface may show either strand, but each keeps its own owner, color, and icon.
Select icons by subject, activity, or learning relationship. Never rotate icons by list position. Large: subject introductions, feature cards, empty states. Medium: lesson cards, grade pathways, curriculum panels. Small: navigation, compact metadata, filters — use the governed flat export (`-flat` suffix mandatory until approved). Use dimensional felt art only at large and medium sizes; never shrink detailed felt art into compact UI.

### Fastener and material assets

Approved fasteners are bound in `app/brand-assets.css`. Use one inside the component it visually attaches; a fastener must cross artifact and support. The complete asset estate below is show-and-tell authority: paths are real public files, bindings name the existing implementation owner, and unbound library variants never enter a component by raw URL.

#### Construction paper (16)

Character-color construction tiles support occasional cut-paper artifacts. `material-surface material-construction-paper` currently binds the Mr Sam tile through `--asset-construction-mr-sam`; add a governed token/class before using another tile.

![](/design-assets/web-material-library-v1/construction-paper/construction-paper-01-old-macdonald-tile.webp)
![](/design-assets/web-material-library-v1/construction-paper/construction-paper-05-mr-sam-tile.webp)

#### Felt (16)

Felt is the primary character and grade identity material. Use `material-surface material-felt` with a character owner, `characters-surface characters-<key>`, or `grade-surface` with `data-grade`; never assign felt to generic navigation.

![](/design-assets/web-material-library-v1/felt/felt-02-miss-puddles-tile.webp)
![](/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.webp)
![](/design-assets/web-material-library-v1/felt/felt-08-miss-maisy-tile.webp)

#### Cardboard (4)

Cardboard supplies readable ivory paper and kraft support. Use `material-surface material-cardboard-paper` or `material-surface material-cardboard-kraft`; dark-kraft and recycled variants remain library assets until a recipe names them. Muted copy on readable paper, including the shared material `theme-copy` role, uses `#5B5144`, providing a `7.29:1` solid-color reserve so the visible paper grain still clears WCAG AA.

![](/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.webp)
![](/design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.webp)
![](/design-assets/web-material-library-v1/cardboard/cardboard-dark-kraft-tile.webp)
![](/design-assets/web-material-library-v1/cardboard/cardboard-recycled-tile.webp)

#### Denim (1)

Denim is a structural dark work-board material. Use `material-surface material-denim-indigo` or the bound `.grade-workspace-stage .working-wall-board`; never place dense dark-on-dark copy on it.

![](/design-assets/web-material-library-v1/denim/denim-dark-indigo-tile-v01.webp)

#### Woven fabric (16)

Woven tiles are character-owned textile specimens, not reading surfaces. `material-surface material-woven-fabric` currently binds Old MacDonald's tile through `--asset-woven-old-macdonald`; other owners require an explicit governed binding.

![](/design-assets/web-material-library-v1/woven-fabric/woven-fabric-01-old-macdonald-tile.webp)
![](/design-assets/web-material-library-v1/woven-fabric/woven-fabric-02-miss-puddles-tile.webp)

#### Leather (8)

Leather is structural support for staff-owned or dark navigation compositions. Use `material-surface material-leather`, `material-leather-blue`, or `material-leather-indigo` only with their existing tokens. Live text on dark leather inherits the surface's warm-cream foreground; descendants do not override that role or add text outlines.

![](/design-assets/web-material-library-v1/leather/individual-tiles/01-old-macdonald-leather-tile-v01.webp)
![](/design-assets/web-material-library-v1/leather/individual-tiles/03-mr-rusty-leather-tile-v01.webp)
![](/design-assets/web-material-library-v1/leather/individual-tiles/07-mr-puddles-leather-tile-v01.webp)

#### Deployment icon pack (60)

`/design-assets/icon-pack-v1/` contains app marks, favicons, topic marks, and stickers at deployment sizes. These are shell/deployment assets, not curriculum art; use a registry or a named `brand-assets.css` class before runtime consumption.

![](/design-assets/icon-pack-v1/topic-math-64.webp)
![](/design-assets/icon-pack-v1/topic-music-movement-64.webp)
![](/design-assets/icon-pack-v1/sticker-apple-64.webp)

#### Logo family (16)

Logo marks carry product identity at deliberate sizes. Use `.brand-emblem-flat-micro`, `.brand-emblem-screen-nav`, `.brand-emblem-screen-card`, or `.brand-emblem-detail-media`, or the corresponding `BRAND_IMAGE_ASSETS.emblem` role—never choose a file by dimensions in a component.

![](/design-assets/logo/individual-marks/brand-emblem-micro-16.png)
![](/design-assets/logo/individual-marks/brand-emblem-nav-44.png)
![](/design-assets/logo/individual-marks/brand-emblem-card-128.webp)
![](/design-assets/logo/candidate-detail-marks/brand-emblem-detail-512.webp)

#### Hero scenes (4)

Hero scenes establish the classroom world; they are content images, not textures. Use `BRAND_IMAGE_ASSETS.scenes` for rendered images or the existing `--asset-home-scene-*` variables for CSS-backed compositions.

![](/hero/old-macs-open-circle-gathering.webp)
![](/hero/home-journey-reflect-v1.webp)
![](/hero/oldmac-school.webp)

#### Music and arts felt icons (20)

Dimensional felt icons are production art for medium and large curriculum signals. Bind through classes such as `.music-fiddle`, `.music-hand-drum`, `.acting-theatre-masks`, and `.painting-handprint` with `.brand-asset` and a size role.

![](/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/01-instrument-fiddle-bow.webp)
![](/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/06-instrument-hand-drum.webp)
![](/brand-kit-icon-sheets/music-arts-felt-v2/individual-icons/08-music-notes-paired-beam.webp)

#### Music and arts flat review icons (20)

The compact flat family remains review-only. Its binding classes carry the mandatory `-flat` suffix; do not substitute them for approved felt production icons until the family is explicitly promoted.

![](/brand-kit-icon-sheets/music-arts-flat-v3-small-review/individual-icons/08-music-notes-paired-beam.webp)
![](/brand-kit-icon-sheets/music-arts-flat-v3-small-review/individual-icons/19-acting-spotlight-star.webp)

#### Subject variations (24)

Subject variations extend production vocabulary through classes such as `.community-helping`, `.math-balance-scale`, `.art-camera-brush`, `.physical-ball-rope`, and `.health-gingham-lunch`. Grouping is semantic: language, science, and SEL proxy assets stay in this mixed family until the owner classifies them; never move an icon merely to fill every subject folder.

![](/brand-kit-icon-sheets/subject-variations-v2/individual-icons/02-community-helping-hands-heart.webp)
![](/brand-kit-icon-sheets/subject-variations-v2/individual-icons/14-math-balance-scale.webp)
![](/brand-kit-icon-sheets/subject-variations-v2/individual-icons/16-art-camera-brush.webp)
![](/brand-kit-icon-sheets/subject-variations-v2/individual-icons/24-health-gingham-lunch.webp)

#### Grade variations (15)

Grade variations are grade-owned signals selected through `.grade-icon[data-grade-icon='<key>']`; they never inherit character or subject ownership.

![](/brand-kit-icon-sheets/grade-variations-v2/individual-icons/01-daycare-stacking-blocks.webp)
![](/brand-kit-icon-sheets/grade-variations-v2/individual-icons/12-preschool-sprout-counting-beads.webp)
![](/brand-kit-icon-sheets/grade-variations-v2/individual-icons/13-kindergarten-schoolhouse.webp)
![](/brand-kit-icon-sheets/grade-variations-v2/individual-icons/05-grade-2-ruler-blocks.webp)

#### Core grade and subject icons (12)

The compact production set under `/brand-kit-icon-sheets/individual-icons/` binds through `.math-building-icon`, `.drama-storytelling-icon`, `.art-photography-icon`, `.gardening-health-icon`, `.physical-education-icon`, and `.early-learning-icon`, plus grade selectors. Use the semantic class; never copy its URL into a component.

![](/brand-kit-icon-sheets/individual-icons/subject-math-building.webp)
![](/brand-kit-icon-sheets/individual-icons/subject-art-photography.webp)
![](/brand-kit-icon-sheets/individual-icons/grade-daycare.webp)
![](/brand-kit-icon-sheets/individual-icons/grade-kindergarten.webp)

#### Full-body character portraits (16)

Full-body portraits introduce a character or anchor a large character card. Resolve by character key through `BRAND_IMAGE_ASSETS.portraits[key]`; components never carry these paths.

![](/characters/full-body-transparent/old-macdonald-fullbody.webp)
![](/characters/full-body-transparent/miss-puddles-fullbody.webp)
![](/characters/full-body-transparent/mr-rusty-fullbody.webp)

#### Transparent face patches (16)

Face patches provide compact identity on a live character-owned surface. Use `class="brand-asset character-face-patch <size-role>" data-character="<key>"`.

![](/characters/face-patch-transparent/old-macdonald.webp)
![](/characters/face-patch-transparent/miss-puddles.webp)
![](/characters/face-patch-transparent/mr-rusty.webp)

#### Embroidered badges (16)

High-resolution cloth badges are large-screen or print artwork. Use `.character-embroidered-badge` with `data-character`, or `BRAND_IMAGE_ASSETS.badges[key]` for a content image; do not shrink them into micro controls.

![](/characters/high-res-cloth/01-old-macdonald-badge.webp)
![](/characters/high-res-cloth/02-miss-puddles-badge.webp)
![](/characters/high-res-cloth/03-mr-rusty-badge.webp)

#### Classroom fasteners v1 (17)

V1 supplies conventional classroom attachment hardware. Bind through `.fastener-push-pin`, `.fastener-paperclip`, `.fastener-binder-clip`, `.fastener-masking-tape`, `.fastener-washi-tape`, `.fastener-sewing-button`, or `.fastener-brass-rivet` only when the image crosses artifact and support.

![](/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.webp)
![](/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.webp)
![](/design-assets/classroom-fasteners-v1/individual-icons/04-binder-clip.webp)

#### Classroom fasteners v2 (16)

V2 supplies textile and crafted attachment variants. Bind through `.fastener-gingham-tape`, `.fastener-apple-peg`, `.fastener-kraft-pocket`, or `.fastener-quilted-tab`; decorative items with no attachment role stay unused.

![](/design-assets/classroom-fasteners-v2/individual-icons/04-gingham-fabric-tape.webp)
![](/design-assets/classroom-fasteners-v2/individual-icons/06-apple-wood-clothes-peg.webp)
![](/design-assets/classroom-fasteners-v2/individual-icons/11-kraft-corner-pocket.webp)

### Academic-label clarity

- Preserve each approved academic lead exactly, but do not imply that every term has the same curriculum status. Mathematics, science, music, literacy, visual arts, drama, physical education, and health read as subject areas; rhythm, counting, movement, communication, community, engineering, food, and social-emotional learning may also describe strands, contexts, or cross-curricular links.
- Expand `SEL` as “social-emotional learning (SEL)” on first teacher-facing use.
- Treat “Whole school” as reach or scope, never as a grade. Treat “No grade assigned” as an explicit learner state, never as missing content.
- Use `Preschool` as the display label. Keep `pre-school` only where the implementation key is required.
- When a source record provides a teacher title or official curriculum reference, show those beside the approved academic lead rather than guessing a standard or level of coverage.

### Character record contract

Every character reference is a complete record, presented in this order: academic lead and grade or scope first, then species and role, then curriculum contributions or learning actions, then the binding pair (`data-character` + asset-role class), the exact token, and the canonical asset paths from the tables above. The complete record lives in this file; no other file may carry a partial copy that can drift.

## Typography

Use type roles together inside a real composition, not as detached specimens.

- **Display and page headings — Boogaloo.** Friendly, open learning invitations. Responsive size, normal weight, tight leading, balanced lines.
- **Section labels — Lilita One.** Short labels and strong section cues.
- **Body and interface — Nunito.** Paragraphs, instructions, metadata, labels, fields, tables, controls, and actions. Body defaults to 16 px with generous 1.7 line height.
- **Human cue — Caveat.** One short teacher sentence, quote, or reminder. Never use for instructions, labels, controls, or long passages.
- **Brand/editorial accent — Playfair Display bold italic.** Reserve for approved identity or editorial moments; never replace readable body copy.

Uppercase eyebrows may use heavy body weight with approximately `0.13em` tracking. Do not use handwriting as decoration across an entire page.

### Type ramp (observed and now normative)

Body/interface steps: 11, 12, 13, 14, 15 (card titles), 16, 18, 20 px. Section and heading steps: 21, 22, 26 px. Display headings use `clamp(1.9rem, 4vw, 2.75rem)`. Nothing renders below 11 px. Off-ramp legacy values (13.5 px captions, 11.5 px captions) are queued for the next scoped `/impeccable typeset` pass; they are not additions to the ramp.

### Typography utility bindings

The px ramp above remains authoritative; utilities select families and roles, not new sizes.

| Utility | Family | Use |
| --- | --- | --- |
| `font-heading`, `font-display` | Boogaloo | Display and primary heading voice |
| `font-section` | Lilita One | Section labels and strong wayfinding |
| `font-body` | Nunito | Body copy and interface text |
| `font-hand` | Caveat | Short teacher notes and handwritten accents |
| `font-brand` | Playfair Display | Formal brand wordmark or editorial identity only |

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

### Composition grammar

Build compositions in four layers:

1. **Environment** — page, slide, or sheet canvas.
2. **Support** — leather, denim, cork, paper, card, or another approved structural surface.
3. **Artifact** — readable paper, character-owned patch, badge, curriculum card, photograph, or illustration.
4. **Attachment** — paperclip, masking tape, binder clip, push pin, or another approved fastener crossing artifact and support.

At least one composition in a branded artifact should demonstrate the support–artifact relationship. Do not cover every surface with texture. Give readable artifacts calm space.

Use overlap to show construction, not to hide information. Keep text, controls, faces, icons, and focus indicators clear of fasteners. Small rotations may suggest a placed object; they must never reduce alignment, legibility, or apparent quality.

### Homepage presentation

The home page is the working wall's front display, composed with the grammar above. Binding rules:

- Structural chrome (page header and footer) uses the deep navy family. The homepage hero is an open composition on the shared paper canvas: readable lesson information sits on a warm paper artifact, joinery uses the existing wood treatment, and gold marks focus and highlight only.
- Rose, sage, teal, blue, red, amber, and purple remain semantic grade, subject, and character accents. They never become generic decoration.
- Grade navigation stays in the shared header and compact menu. Homepage lesson rows carry their relevant grade tags; the page does not add a second grade rail.
- Subject discovery is one support with attached paper artifacts; song/recent material is one calm ruled-paper area. No nested card maze; no duplicated call-to-action pointing at one destination.
- Responsive intent: wide viewports split the hero into text, lesson artifact, and photograph tracks; tablets reduce the split; mobile stacks the hero and uses the compact menu.

#### Surface recipes

| Role | Required class recipe | Rule |
| --- | --- | --- |
| Working-wall support | `working-wall-stage` | Owns joinery, border, and structural depth; not content typography |
| Dark structural support | `material-surface material-leather-blue` | Optional structural support only; never required around the homepage hero |
| Readable paper card | `card-paper` | Default dense information surface |
| Ruled paper card | `card-paper-ruled` | Notes, recent work, and teacher-write-in rhythm |
| Grade-owned surface | `grade-surface` + `data-grade='<key>'` | Uses grade color, approved grade ink, and felt texture; grade ink outranks generic card foreground utilities |
| Character-owned surface | `characters-surface characters-<key>` | Uses exact character color, foreground, and texture |

The shared navigation renders five separate grade destinations—Daycare, Preschool, Kindergarten, Grade 1, and Grade 2—using the five selectors in the Colors binding table. It never collapses them into Early Years or repeats them as a homepage rail.

`output/daycare-current.png` and `output/style-guide/omhas-character-curriculum-map.png` are directional screenshots, not pixel contracts. The semantic classes and responsive rules in this file remain normative.

## Elevation & Depth

### Depth

- Support surfaces sit at the lowest content plane.
- Paper and textile artifacts lift one plane with border and restrained shadow.
- Fasteners sit above the artifact edge.
- Dialogs, menus, and focus indicators remain functionally above decorative layers.
- Do not use glossy glassmorphism, neon glow, or deep synthetic 3D effects.

### Materials

#### Paper

Default readable surface. Cardboard paper supports cards and work stages. Ruled paper supports prose aligned to its repeating rule. Grid paper supports diagrams, number work, and planning. Repeats extend as content grows.

For ruled paper on web, current implementation evidence uses a 28 px mobile rule interval and 32 px from the existing small-screen layout threshold. Other media should preserve line-to-text alignment rather than copy those pixel values blindly.

#### Cork

Working board holding attached paper, fabric, and fasteners. Use semantic repeating texture for responsive surfaces. Fixed-composition board exports are review references, not stretchable page backgrounds.

#### Leather

Dark structural surface for shared header, footer, attached edge treatments, and the homepage base. Paper headings and lesson lists may be clipped or taped to it.

#### Denim

Presentation-board textile behind installed workspaces. It is a support, not a generic content card.

#### Felt and woven cloth

Felt requires a semantic owner. Character felt uses that character's approved identity. Grade patches use the documented grade mapping. Neutral woven cloth is an attached textile object, never the wall behind pinned notes. Never use a character texture for unrelated subjects, navigation, or generic controls.

#### Asset boundaries

Asset paths stay behind semantic names. Do not paste file URLs into components or generation prompts when a semantic asset role exists. Contact sheets and composites are references, not production surfaces. Availability does not grant permission to invent a role. No asset may be excluded, substituted, renamed, deleted, or classified as non-production without explicit approval.

## Shapes

### Identity and imagery

#### Character hierarchy

Academic field appears first. Character name and personality follow. Keep readable text outside portrait silhouettes.

For web implementation, use a semantic selector and artwork role together, for example `data-character="mr-rusty"` with `character-face-patch`. `app/brand-assets.css` resolves that pair to the canonical file recorded in this document; consuming components should not carry the URL. A style guide may print the resolved path for verification, but it must also show the actual asset so a missing or incorrect binding is visible.

Canonical character forms:

1. Transparent full-body portrait for introductions and full character cards.
2. Transparent face patch for compact identity on a live owned surface.
3. High-resolution embroidered badge for large screen or print artwork.

#### Logo family

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

## Do's and Don'ts

### Accessibility

- Maintain at least WCAG AA `4.5:1` contrast for normal text using each semantic surface's approved foreground. Character surfaces use the shared foreground roles recorded above; never substitute cream where the table requires structural navy or maximum black. Textured character surfaces retain a thin character-color halo around live text so local texture variation cannot erase glyph edges.
- Never use character, grade, or subject color as the only carrier of meaning; include text or a semantic icon.
- Keep body text live, selectable, and resizable.
- Provide text alternatives for meaningful portraits, scenes, and curriculum images. Hide purely decorative fasteners from assistive technology.
- Maintain at least 44 px primary touch targets.
- Provide visible keyboard focus above all decorative layers.
- Preserve logical reading order independent of visual overlap.
- Respect reduced-motion preference. Attachment and material identity must not depend on animation.

### Motion

Motion is restrained and functional: focus, disclosure, selection, carousel change, or artifact placement feedback. Do not animate texture continuously. Avoid bounce, wobble, parallax, or novelty motion that competes with teaching content. Reduced-motion mode removes nonessential movement.

### Content voice

Write for teachers and young learners with clarity, warmth, and concrete action. Use active verbs. Name what learners notice, test, make, sing, count, explain, or share. Keep headings inviting and specific. Avoid corporate product language, generic inspiration, and character-first copy that hides the academic purpose.

### Named rules

**The One Semantic Owner Rule.** Character color and felt belong only to that character. Grade color belongs to that grade. Subject color and icon belong to curriculum meaning. Generic navigation and controls use shared semantic UI roles, never character texture.

**The Credible Attachment Rule.** A fastener must cross artifact and support.

### Do

- Do start from curriculum meaning.
- Do use exact approved identity colors and canonical art from this file.
- Do put readable information on paper.
- Do make attachment physically legible.
- Do treat pins, tape, clips, and fasteners as the signature attachment language of the working wall; every pinned artifact should visibly cross artifact and support per the Credible Attachment Rule.
- Do use semantic asset roles.
- Do keep content live across media.
- Do preserve all assets pending explicit classification.
- Do keep the complete character record in this file only; pages render it, they do not redefine it.

### Don't

- Don't treat cork as the whole design concept.
- Don't use a floating decorative fastener.
- Don't put paragraphs or controls on fabric.
- Don't assign character felt to generic navigation or subjects.
- Don't recolor character artwork.
- Don't choose icons randomly.
- Don't shrink dimensional art into compact UI.
- Don't bake responsive text into images.
- Don't stretch fixed-composition board exports.
- Don't duplicate Tailwind's responsive system.
- Don't infer authority from other Markdown files or file availability.
- Don't exclude or substitute an image without approval.
- Don't maintain character, grade, or subject color data in any file other than this one and its two CSS bindings.

### Agent generation contract

Before generating:

1. Identify medium, audience, learning purpose, academic field, grade, and character owner if any.
2. Select semantic surface, artifact, and attachment roles.
3. Select canonical imagery and curriculum icon by meaning from the tables above.
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

### Provenance

- 2026-08-25: colors reconciled against `Old_MacDonalds_School_Learning_Color_Map.pdf` (inspected via PNG twin); nine unchanged identity values still match that document.
- 2026-08-27: owner-approved revision board (Register 02, formerly `docs/design-explorations/character-colour-register/character-colour-register-02-reimagined.png`, deleted by the owner after transcription) supersedes the PDF for seven values: Old MacDonald `#A66A32`, Mr Rusty `#267CBA`, Mr Sam `#1D8787`, Mr Maisy `#D81D24`, Miss Maisy `#5D8164`, Scout `#C59E7A`, Maisy `#96AD9A`. The board's teacher/learner pairing is a hue-family visual marker only; subject + grade + color + character is the system.
- The earlier emoji-marked markdown transcription of the register (mustard/sage/ocean/rose/deep-red/teal/purple values) is superseded and must not be consumed.
