---
version: "alpha"
name: Old MacDonald Had a School
description: A bright handmade workshop where a teacher assembles a real lesson and prints it.

colors:
  navy: "#1e2a38"
  paper: "#fefce8"
  paper-warm: "#fdf8e3"
  ink: "#1a2a2e"
  wood: "#c4a07a"
  gold: "#d4a82a"
  rose: "#d47a8a"
  staff-old-macdonald: "#A66A32"
  staff-miss-puddles: "#F6AF32"
  staff-mr-rusty: "#267CBA"
  staff-miss-hayley: "#D95C86"
  staff-mr-sam: "#1D8787"
  staff-mr-maisy: "#D81D24"
  staff-mr-puddles: "#5367B5"
  staff-miss-maisy: "#5D8164"

typography:
  display:
    fontFamily: "Boogaloo, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 400
  section:
    fontFamily: "Lilita One, sans-serif"
    fontSize: "26px"
    fontWeight: 400
  heading:
    fontFamily: "Boogaloo, sans-serif"
    fontSize: "20px"
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
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  3xl: "1.375rem"
  4xl: "1.625rem"

components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "44px"
  paper-card:
    backgroundColor: "{colors.paper-warm}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
  pinned-note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.hand-note}"
    rounded: "{rounded.sm}"
  grade-chip:
    backgroundColor: "{colors.staff-miss-puddles}"
    textColor: "{colors.navy}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    height: "44px"
  search-input:
    backgroundColor: "{colors.paper-warm}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "44px"

omitted:
  - spacing
---

# Design System: Old MacDonald Had a School

## Overview

**Creative North Star: "Old MacDonald's Workshop"** `TODO (owner confirm title)`

**The test:** every page reads as a bright handmade workshop where a real lesson is being assembled for children — never a classroom, never a dashboard.

### Core values

Five values carry this design. Feel them; never show or say them plainly. Each is a concept, not a picture — the notations are notation, and the design carries the idea.

Look is the first one: give attention when someone is talking to you.

| Concept | Beginning | Result | Meaning |
| --- | --- | --- | --- |
| Look | 👀 | ✨ | When we listen and respect attention, we can reach the stars. |
| Care | ❤️ | 👐 | When we care, everyone is held and welcomed. |
| Inclusion | 🤝 | 🎉 | When everyone joins in, we can celebrate and have fun. |
| Growth | 🌱 | 🌳 | These actions help children and grown-ups grow. |
| Music and peace | 🎶 | 🕊️ | When we sing together, we make room for peace. |

Each pair runs one way only — show one and the other must connect to it visually, so a non-verbal child can follow. Source: `[[Projects/Endless Measures/Old MacDonald/Mission Statement/Old MacDonald Had a School|Mission Statement — Core Values]]`.

The notations are not the web icon set: icons are drawn, from a real library or authored SVG, in one consistent stroke and weight.

## Colors

Eight colours are reserved: the eight staff. A student never adds a reserved colour — the student hue is the staff hue through one universal shift, defined once in this file and bound once in CSS, applied to any student, so the reserved set stays at eight. The staff-to-student link exists only to halve the reserved palette; it carries no other meaning.

The theme is bright primary and secondary: a Sesame Street workshop behind the scenes — the planning board where the work is made, not the show. Saturation and clarity are wanted; muted neutrals are not the theme.

### Foundation roles

Structural navy carries the shared header, footer, controls and focus. Paper carries readable work. Warm wood is joinery and border. Gold marks focus and highlight. Rose marks the destructive state.

`TODO (owner): assign the bright primary and secondary colours.`

### Ownership

Grade colour inherits the owning teacher's colour; a grade never originates one. Subject colour and icon carry curriculum meaning. Character colour belongs to that character alone. Generic navigation and controls use the structural roles, never character felt.

**The One Owner Rule.** A colour has exactly one owner, and no value moves between owners.

### Change authority

Change order runs one direction: update this file, bind it once in `app/globals.css`, bind artwork roles in `app/brand-assets.css`, store unchanged artwork in `public/`, then verify. No other file originates a colour.

### Character identity

Sixteen identities: eight staff, eight students. Every reference presents the academic lead and grade or scope before the character name. Never derive, recolor, optimize, or substitute these values.

#### Staff

| Character | Species · role | Grade or scope | Academic lead | Colour token |
| --- | --- | --- | --- | --- |
| Old MacDonald | Human · principal, music teacher, band leader | Whole school | Music · Community · Literacy | `{colors.staff-old-macdonald}` |
| Miss Puddles | Duck · daycare teacher | Daycare | Early Learning · Movement · SEL | `{colors.staff-miss-puddles}` |
| Mr Rusty | Horse · dance teacher | Kindergarten | Music · Rhythm · Counting | `{colors.staff-mr-rusty}` |
| Miss Hayley | Human · music, singing and drama teacher | Grade 1 | Literacy · Music · Drama | `{colors.staff-miss-hayley}` |
| Mr Sam | Pig · math, science and building teacher | Whole school | Mathematics · Science · Engineering | `{colors.staff-mr-sam}` |
| Mr Maisy | Cow · physical education and health teacher | Grade 2 | Physical Education · Health | `{colors.staff-mr-maisy}` |
| Mr Puddles | Duck · art and photography teacher | Whole school | Science · Visual Arts · Communication | `{colors.staff-mr-puddles}` |
| Miss Maisy | Cow · secretary, gardening and cooking teacher | Preschool | Community · Science · Food & Health | `{colors.staff-miss-maisy}` |

#### Students

Students carry learning actions and personality instead of a teaching role, and never take a staff grade label. A student's colour is not reserved: it is the staff colour through the universal shift. The student list is the paired hue, not a second palette.

| Student | Species | Learning actions | Personality |
| --- | --- | --- | --- |
| Maisy | Cow | Music and rhythm: clap and sing. Listen and model an action. | Warm, confident and encouraging. |
| Penny | Chick | Music: sing and play a small instrument. Stand and step. Listen. | Young, earnest and growing in confidence. |
| Rusty | Horse | Music: play an instrument. Walk and gallop. Listen and help. | Calm, reliable and quietly courageous. |
| Whiskers | Cat | Inquiry: tilt the head and inspect. Listen, sit and participate. | Curious, gentle and thoughtful. |
| Sam | Pig | Mathematics and STEM: examine, count and build. Listen and explain. | Thoughtful, inventive and cheerful. |
| Hopper | Rabbit | Physical development: hop, walk and sit. Listen, imitate and join in. | Energetic, optimistic and ready to join. |
| Puddles | Duck | Music and rhythm: sing and join rhythm play. Waddle and gesture. Listen. | Expressive, sociable and enthusiastic. |
| Scout | Dog | Inquiry and discovery: lead, observe and point. Listen and help a classmate. | Adventurous, observant and dependable. |

Family note: Mr Maisy and Miss Maisy are Maisy's parents. Staff roster contains exactly eight.

#### Canonical artwork

Each identity owns three artwork roles. Full-body portraits resolve through `BRAND_IMAGE_ASSETS.portraits`; face patches and embroidered badges resolve in `app/brand-assets.css` from `data-character` plus an asset-role class. Components never carry these URLs. Pixels are never recolored.

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
| Maisy | `/characters/full-body-transparent/maisy-fullbody.webp` | `/characters/face-patch-transparent/maisy.webp` | `/characters/high-res-cloth/13-maisy-badge.webp` |
| Penny | `/characters/full-body-transparent/penny-fullbody.webp` | `/characters/face-patch-transparent/penny.webp` | `/characters/high-res-cloth/12-penny-badge.webp` |
| Rusty | `/characters/full-body-transparent/rusty-fullbody.webp` | `/characters/face-patch-transparent/rusty.webp` | `/characters/high-res-cloth/16-rusty-badge.webp` |
| Whiskers | `/characters/full-body-transparent/whiskers-fullbody.webp` | `/characters/face-patch-transparent/whiskers.webp` | `/characters/high-res-cloth/10-whiskers-badge.webp` |
| Sam | `/characters/full-body-transparent/sam-fullbody.webp` | `/characters/face-patch-transparent/sam.webp` | `/characters/high-res-cloth/15-sam-badge.webp` |
| Hopper | `/characters/full-body-transparent/hopper-fullbody.webp` | `/characters/face-patch-transparent/hopper.webp` | `/characters/high-res-cloth/09-hopper-badge.webp` |
| Puddles | `/characters/full-body-transparent/puddles-fullbody.webp` | `/characters/face-patch-transparent/puddles.webp` | `/characters/high-res-cloth/14-puddles-badge.webp` |
| Scout | `/characters/full-body-transparent/scout-fullbody.webp` | `/characters/face-patch-transparent/scout.webp` | `/characters/high-res-cloth/11-scout-badge.webp` |

Grade icons: `/brand-kit-icon-sheets/individual-icons/grade-daycare.webp`, `grade-kindergarten.webp`, `grade-1.webp`, `grade-2.webp`.

### Grades

Five grades, each routed to its owning teacher's colour: Daycare, Preschool, Kindergarten, Grade 1, Grade 2. Early Years is the Daycare + Preschool grouping and is not a sixth grade.

## Typography

**Display:** Boogaloo. **Section:** Lilita One. **Body and interface:** Nunito. **Human cue:** Caveat. **Brand:** Playfair Display.

Display leads with open learning invitations. Section labels carry strong wayfinding. Body handles paragraphs, instructions, labels, fields and controls. Caveat is one short teacher sentence or reminder, never instructions or long passages. Playfair Display is reserved for the identity wordmark.

Nothing renders below the smallest step in the frontmatter. Display scales responsively; the responsive expression lives in the layout, not in the token.

## Layout

Grade comes first. A teacher lands, sees the grade they teach, and reaches material in seconds.

One readable column by default. Add columns only when each artifact keeps useful width. Grades stay in the shared navigation, never repeated as a second rail. Preserve content order when layers collapse. Keep text clear of fasteners and touch targets at every width.

`TODO (owner): page structure for layout + home, pending shape's brief.`

## Elevation & Depth

Depth is made, not simulated: paper and felt sit above the surface they are attached to, with a restrained shadow and a visible edge. No glass, no glow, no synthetic 3D.

## Shapes

Felt patches and pinned paper. Corners are cut or rounded like cloth and card, not like software.

A pinned sheet stays blank: rule lines and grids are drawn in CSS through the sheet, never baked into the asset, or the aspect ratio breaks.

## Components

### Button

One shared family. Default actions reach at least 44px. Buttons and links read as classroom material — a patch of felt, or a plan note pinned to a surface. Shape, texture and shadow come from that material, not from a generic control style.

### Card and pinned note

Readable surface is paper. A note may be pinned to the surface it belongs to. Live text, separate icon and fastener stay separate layers.

### Character badge

Three independent layers: the character's own surface, the unchanged portrait or face patch, and the attachment when the object is physically attached.

### Grade chip

Carries the grade's owning colour and the grade name. Never used as the only carrier of meaning.

### Controls

Reuse shared accessible primitives. No page-local control walls.

## Do's and Don'ts

### Do

- Do read the block in order: grade first, then colour, then the academic asset.
- Do choose the academic asset by judgement from the full library; vary it rather than reusing the same asset every time.
- Do place the character's colour in the region — border, background, or text colour — when that character has already appeared on the page.
- Do set a transparent character portrait on a background matching that character's colour.
- Do cut an asset that is not a repeating pattern down to its repeating low-bandwidth pixels.
- Do bind the chosen asset through the stylesheet; where that binding does not exist yet, refactor the style to add it properly rather than hard-coding the asset.
- Do carry at least two of the five core values in every creative work, felt rather than shown.
- Do keep readable information on paper and text live.
- Do keep the complete character record in this file only.

### Don't

- Don't put two characters in one block. Two characters on a page is allowed; one per section.
- Don't read a `[data-subject]` binding as the limit of available assets; it is one binding, not the library.
- Don't use lined paper assets.
- Don't recolor character artwork.
- Don't put paragraphs or controls on fabric.
- Don't assign character felt to generic navigation or controls.
- Don't bake responsive text into images.
- Don't stretch fixed-composition board exports.
- Don't maintain colour data in any file other than this one and its CSS bindings.
- Don't show or say the five core values on a page — no label, no line of text, no notation.

`BAN: eyebrow, kicker, or label above a heading`
`BAN: eye imagery — the value is Look, never an eye`
`HIDDEN: five core values and their symbols — felt, never shown, never named on a page`

### Accessibility

- Maintain at least WCAG AA 4.5:1 for normal text against its approved surface.
- Never use colour as the only carrier of meaning; include text or an icon.
- Keep text selectable and resizable.
- Provide text alternatives for meaningful portraits and curriculum images; hide decorative fasteners.
- Keep primary touch targets at least 44px.
- Provide visible keyboard focus.
- Respect reduced-motion.
