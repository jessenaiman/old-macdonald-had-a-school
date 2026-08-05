# Homepage Baseline Figma Review — 2026-08-04

Verdict: **CHANGES REQUIRED**

Scope: current homepage at `http://localhost:8443/`, compared against the supplied approved Figma screenshots. The archive website was not used as a visual reference. No application code was changed.

## Evidence states

| State | Reference | Implementation |
| --- | --- | --- |
| Compact header, 1544×65 | ![Header reference](references/01-header-reference.png) | ![Header implementation](01-header-implementation.png) |
| Mobile hero, 415×336, hero-aligned scroll state | ![Mobile hero reference](references/02-mobile-hero-reference.png) | ![Mobile hero implementation](02-mobile-hero-implementation.png) |
| Browse by Subject, 1304×649, section-aligned scroll state | ![Subject reference](references/03-subject-reference.png) | ![Subject implementation](03-subject-implementation.png) |
| Protected bottom feature/footer, 991×619, bottom scroll state | ![Bottom reference](references/04-bottom-feature-footer-reference.png) | ![Bottom implementation](04-bottom-feature-footer-implementation.png) |

## Findings

1. **Header hierarchy, palette, and spacing — CHANGES REQUIRED.** The reference is one compact navy row with the circular mark, stacked wordmark, gold baseline, and a short navigation. The implementation is a cream multi-row header with a much larger logo lockup, extra navigation items, theme controls on a second row, and no matching navy/gold chrome.

2. **Mobile hero layout, typography, and cropping — CHANGES REQUIRED.** The reference hero fills the 415px frame with navy, starts directly at the top of the supplied state, and wraps the headline as “A better / place to begin / tomorrow’s / lesson.” The implementation is an inset navy card with a beige border, different line breaks (“place to / begin”), a different visible crop, and the browser-side floating badge overlapping the lower-left content.

3. **Browse by Subject structure and icons — CHANGES REQUIRED.** The reference is a dense 2×2 grid of large gold-outlined clusters with subject-specific icons and compact lesson rows. The implementation is a four-column white-card row inside a paper panel, uses character portraits as cluster icons, has different copy/data density, and does not match the reference’s borders, spacing, or subject iconography.

4. **Protected bottom feature and footer — CHANGES REQUIRED.** The reference shows the complete feature card above the footer, with the feature image and text aligned inside the framed panel. At the bottom scroll state, the implementation crops the top of that feature panel, shifts its content, inserts an extra “Meet the farm-school cast” link, and starts the footer earlier than the reference. The navy footer is directionally present, but its logo, navigation spacing, and vertical rhythm do not match closely enough for acceptance.

5. **Responsive behavior — CHANGES REQUIRED.** The desktop and mobile captures show a layout system that changes structure rather than preserving the approved compact chrome and hero proportions. The mobile state exposes the oversized header before the hero and the hero’s additional inset/border treatment.

6. **Keyboard-visible state — BLOCKED.** The first keyboard-state attempt timed out after the long-page capture session. A fresh in-app tab also timed out navigating, and a direct request to `http://localhost:8443/` then timed out. No keyboard focus verdict is claimed from screenshots alone.

## Runtime evidence and limits

- `package.json` reports Next.js `16.3.0`, satisfying the documented version floor.
- The homepage rendered successfully in the in-app browser for all four accepted visual captures.
- The installed `agent-browser` command was not found, so the documented browser half of `next-dev-loop` could not run.
- `/_next/mcp` returned `406 Not Acceptable` for the direct GET/POST probes; the `text/event-stream` probe returned no data before timeout. The `next-dev-loop` runtime preflight therefore remains incomplete.
- After the accepted captures, the local dev server stopped responding to both the in-app browser and a direct local health check. This is recorded as a blocker, not substituted with source-only review.
- Screenshots establish visible hierarchy, spacing, typography, palette, icon, border, asset, crop, responsiveness, and footer differences. They do not establish full WCAG compliance, semantic correctness, focus-ring quality, or assistive-technology behavior.

## Evidence files

- `01-header-implementation.png`
- `02-mobile-hero-implementation.png`
- `03-subject-implementation.png`
- `04-bottom-feature-footer-implementation.png`
- `05-mobile-keyboard-focus-implementation.png` was not accepted or created because the live app became unavailable during that capture attempt.

