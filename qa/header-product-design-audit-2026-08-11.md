# Homepage Header Product Design Audit

Date: 2026-08-11

## Audit scope

Combined UX and screenshot-based accessibility audit of the two desktop homepage header states supplied in the conversation. The intended result is the quiet navigation structure shown in screenshot 1, using the canonical tree-and-music-note emblem shown in screenshot 2 and stored at `public/brand-emblem.png`.

## User goal and accessibility target

Help teachers recognize the school, reach the four primary destinations, search, and access teacher grade links without competing controls or unnecessary vertical space. The header should retain clear focus order, readable contrast, labelled controls, and an appropriate desktop/mobile breakpoint.

## Step 1 — Intended menu structure

Health: Good foundation; one blocking brand mismatch.

Strengths:

- Strong left-to-right order: brand, primary navigation, then search.
- Plain text links establish one calm navigation level and fit the stitched-paper visual language.
- The compact height preserves the homepage content hierarchy.
- The navy, cream, and gold palette is coherent and gives the header a clear edge without turning every item into an object.

Risks:

- The displayed schoolhouse mark is not the canonical project emblem. The header should use `public/brand-emblem.png`, the approved tree-and-music-note embroidered emblem.
- Search is icon-only, so its accessible name and focus treatment must be confirmed in the rendered implementation.
- The closed `For Teachers` state does not prove the dropdown's keyboard behavior or focus management.

## Step 2 — Rejected button-and-grade-rail state

Health: Critical redesign required.

UX risks:

1. Every navigation item is styled as a primary button. Lessons, Subjects, For Teachers, About, theme controls, and Menu all demand equal attention, so nothing reads as navigation hierarchy.
2. Desktop navigation and a large Menu control are shown simultaneously. These are two competing navigation models in the same state.
3. Two nearly identical sun controls appear side by side without visible differentiation. Their purpose and current state are unclear.
4. The grade rail duplicates destinations that belong under `For Teachers` and consumes almost as much height as the main header.
5. Heavy outlines, shadows, gold borders, felt fills, and saturated grade colours create too many material layers. The stitched brand language becomes visual noise.
6. The oversized italic wordmark, tight navigation buttons, and second rail produce an uneven baseline and make the header feel crowded despite its width.

Accessibility risks visible in the screenshot:

- Icon-only search and sun controls may lack sufficiently clear accessible names; this cannot be proven from the screenshot.
- The two sun controls are visually indistinguishable, creating a recognition and state-communication problem even if labels exist for assistive technology.
- Dense adjacent controls increase mis-targeting risk, particularly near the two sun controls and Menu.
- Focus order may include both desktop and mobile navigation controls if CSS only hides them visually. DOM and keyboard testing are required.
- The grade rail's white-on-colour text appears readable at this scale, but contrast needs measurement against the textured fills.

## Opportunity areas

- Keep screenshot 1's single-row desktop structure.
- Replace only its mark with the canonical tree emblem; do not import screenshot 2's wordmark treatment or button chrome.
- Keep Lessons, Subjects, For Teachers, and About as plain text links, with search as the final utility.
- Use one compact theme control.
- Show Menu only below the mobile breakpoint, never beside the full desktop navigation.
- Keep grade destinations inside the `For Teachers` disclosure; do not render a permanent global grade rail.
- Retain one outer stitched boundary and remove nested button borders and shadows.

## Evidence limits and verification gaps

The two supplied desktop screenshots support this visual and hierarchy audit. They do not prove hover, focus, dropdown, theme, keyboard, screen-reader, zoom, or mobile behavior. Those require browser verification after the corrected state is implemented.

## Recommendation

Treat screenshot 1 as the locked header layout and `public/brand-emblem.png` as the locked logo asset. Remove the global grade rail and the always-visible mobile actions from the desktop cascade before any further homepage polish.
