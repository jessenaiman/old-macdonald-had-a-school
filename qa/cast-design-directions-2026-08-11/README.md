# Cast page design directions — 2026-08-11

Presentation-only mockups for a future `/cast` implementation. These PNGs are visual direction boards, not flattened production UI. Any selected direction should be rebuilt with semantic React/HTML inside the existing `SiteShell`, using responsive components and canonical assets.

## Shared source contract

- Identity, role, grade/level, activities, personality, scene actions, and exact colours: `public/CAST_AND_ROLES.md`.
- Portraits: unchanged `public/staff_and_students/*-transparent-circle.png` files.
- Materials: authored tiles in `public/design-assets/web-material-library-v1/`.
- Attachment cues: `public/design-assets/classroom-fasteners-v1/individual-icons/`.
- Curriculum symbols: `public/brand-kit-icon-sheets/individual-icons/`.
- Existing shared menu/footer is represented as blue felt chrome and is not redesigned.
- The documented Preschool reference conflict is not resolved here. Current `CAST_AND_ROLES.md` remains the authority.

## Direction 01 — The Ensemble Wall

**Visual philosophy: Relational Patchwork.** Knowledge feels collected rather than catalogued: portraits gather as a generous classroom ensemble, each signature colour becoming an immediately readable identity key. Warm ivory cardboard makes room for breathing, while tactile felt bands and physical fasteners suggest a wall lovingly built over time. Scale and rhythm alternate between a joyful group introduction and disciplined reference cards. The craft should feel meticulous, with every overlap, margin, and colour relationship calibrated by hand.

The quiet conceptual thread is the class photograph becoming a living system map. Text remains concise and subordinate to faces, but every card exposes enough plain language for quick scanning. The final execution should feel masterfully assembled rather than scrapbook-random: playful irregularity held inside a rigorous grid.

Best for: emotional warmth, employer-facing character showcase, and a memorable first encounter with the whole cast.

## Direction 02 — The Role Studio Index

**Visual philosophy: Workshop Taxonomy.** A crisp editorial index treats the brand as a serious creative system while keeping the tactile source materials visible. Colour is functional metadata; portraits become specimens; role, level, and permissible action are aligned into repeatable reading lanes. The composition borrows the precision of a museum archive and the warmth of a teacher's preparation table. Every rule is surfaced with painstaking clarity.

The subtle reference is a prop department's working bible: beautiful enough to exhibit, exact enough to hand to another maker. Typography, rules, labels, and whitespace carry most of the hierarchy. Materials appear only when they explain their permitted purpose. This direction should look like countless hours of expert refinement, especially in alignment and density.

Best for: LLM-facing guidance, fastest scanning, and strongest “this is a governed design system” portfolio signal.

## Direction 03 — The Farm-School Constellation

**Visual philosophy: Playful Cartography.** Characters inhabit a navigable relational map rather than a list. Thread paths connect teaching domains, grade ownership, and classroom participation; authored textures define territories without becoming decorative noise. The visual field feels exploratory, but facts remain anchored in plain-text stations with consistent labels. Every route and cluster is painstakingly placed to reward both a quick glance and a closer read.

The subtle reference is a school day drawn as a transit map: adults are teaching stations, students are ways of joining, and the brand rules are the map legend. The result should feel inventive and charming without sacrificing semantic clarity. Master-level restraint keeps the constellation from tipping into clutter.

Best for: the most distinctive portfolio moment, brand storytelling, and showing how the cast can generate future compositions.

## Shared implementation lesson

All three directions teach the same machine- and human-readable rule: pair the unchanged canonical portrait with the exact signature colour and canonical facts; use authored texture/fastener/icon assets by purpose; never recolour portraits, invent roles, use emoji/generic substitutes, or flatten the page into a production screenshot.
