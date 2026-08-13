---
name: design-taste-frontend
description: Plan or review distinctive marketing, landing, portfolio, and brand-facing interfaces without generic AI patterns. Use for new visual direction or substantial redesigns, not dashboards or ordinary product UI.
---

# Design Taste Frontend

Use only for marketing pages, landing pages, portfolios, or substantial visual redesigns. For ordinary product UI, search, dashboards, and data tables, use the existing project components and the relevant UI skill.

## Preflight

1. State one design read: page kind, audience, tone, and visual direction.
2. Inspect the existing route and `/branding` before proposing layout or assets. Preserve the authored brand system unless a new direction is explicitly requested.
3. Use `old-macdonald-asset-system` for characters, textures, icons, and patches. Do not use reference composites, fake screenshots, or hand-rolled SVG illustrations as substitutes for real assets.
4. Choose one type, color, radius, and theme system. Use existing project primitives before adding dependencies.
5. Keep motion purposeful, isolated in client leaves, and reduced under `prefers-reduced-motion`.

## Quality gates

- Check desktop and narrow/mobile rendering.
- Check keyboard focus, contrast, labels, empty/loading/error states, and readable copy.
- Avoid generic AI defaults: purple glow gradients, three identical feature cards, fake precision, decorative status dots, excessive pills, and filler copy.
- Do not add assets merely to satisfy a rule. Use an approved asset when the composition needs one.
- For redesigns, preserve routes, navigation, legal text, analytics hooks, and accessibility wins unless explicitly authorized.

## Verification

Render the affected route and inspect desktop, narrow/mobile, and print when relevant. Run targeted typecheck/lint. Load `references/patterns.md` only when the brief needs advanced composition or motion.