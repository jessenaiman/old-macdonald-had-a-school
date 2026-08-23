# Evidence and authority

Status: working source record. This file records provenance; it does not create brand authority.

## Authority order

1. `content/pages/branding/*.mdx` — sole official branding and design authority.
2. `content/pages/branding/characters.mdx` — controlling source for cast identity, exact character colors, curriculum roles, permitted actions, and canonical character assets.
3. `app/globals.css` — implementation evidence for approved palette bindings, typography bindings, semantic UI tokens, and physical-material colors.
4. `app/brand-assets.css` — implementation evidence for semantic asset aliases and file paths.
5. `public/` — asset storage. File presence proves availability, not meaning, approval, or exclusion.

Other Markdown files, code comments, route copy, component examples outside the branding directory, and invented theme names are not design authority.

## Provisional operational bindings

Open Design's shared token contract requires several implementation values not specified as brand decisions in the MDX: motion timing, easing, container maximum, responsive gutters, and generic status roles. `tokens.css` supplies conservative working bindings so the package is testable. They are adapters, not new branding authority, and remain reviewable before finalization.

## User-confirmed interpretations

- Core composition rule: foreground objects appear physically pinned, clipped, or taped to a supporting background.
- Cork is one available supporting surface, not the design's central metaphor.
- A fastener must cross the edge of the object it holds and visually meet the supporting surface.
- All images must remain accounted for. No exclusion, substitution, rename, deletion, or non-production classification without explicit approval.
- Do not duplicate Tailwind v4. Open Design owns its normalized token contract; the web implementation may derive a Tailwind adapter.

## Asset audit snapshot

Read-only audit date: 2026-08-22.

- `public/`: 553 files; 542 images and 11 ancillary files.
- Branding MDX: 64 unique image references; all resolve.
- CSS before repair: 248 unique image paths; 141 resolved and 107 were broken.
- 58 high-confidence CSS paths were remapped to existing canonical files.
- CSS after repair: 248 unique image paths; 199 resolve and 49 remain broken.
- The 49 unresolved sources are 48 blank felt patch files and 1 thread overlay file that do not exist in the repository.
- Files not directly referenced by the audited CSS remain inventory findings only. None are excluded.

Final reusable-package status remains blocked until the 49 absent sources are recovered or their treatment is explicitly approved.
