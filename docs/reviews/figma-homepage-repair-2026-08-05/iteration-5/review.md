# Independent Figma visual review — iteration 5

## Verdict

**CHANGES REQUIRED**

The desktop selector/hero composition is materially closer and the requested compact blue hero is restored, but the mobile selector still misses the supplied 273×486 Figma target and two newly requested asset/stitch requirements are not present.

## Evidence

- Desktop comparison, reference left / implementation right: `comparison-desktop-reference-left-actual-right.png`
- Mobile comparison, reference left / implementation right: `comparison-mobile-reference-left-actual-right.png`
- Exact Playwright render measurements: `measurements.json`
- Full-page preservation check: `actual-full-page-desktop.png`
- Top-of-page Playwright captures: `actual-desktop-1440x584.png`, `actual-mobile-273x486.png`

## Required changes

1. **The 273×486 selector does not fit the Figma composition.** The Figma reference shows all four cards fully inside 486 px. The implementation's selector band is 536 px high; each card is 118 px high and the fourth card ends at selector-local y=519, so roughly 33 px of Grade 2 falls below the reference viewport. The reference cards are approximately 109 px high with tighter vertical rhythm.
2. **Mobile card geometry is too narrow and oversized internally.** At 273 px the implementation cards are 245 px wide with 14 px side gutters, versus approximately 258 px wide with about 11 px gutters in the reference. The implementation portraits are 56 px rather than the reference's roughly 47–48 px, while headings/subtitles and card padding are visibly larger. Together these changes make the stack taller and less compact than Figma.
3. **Mobile border and shadow treatment is not yet faithful.** The reference has a clear light outer card edge, a finer inset stitched line, and a consistent dark lower/right shadow. The implementation relies on a clean CSS dashed inset plus larger hue-specific colored shadow blocks, especially visible on the purple and orange cards.
4. **The newer homepage-link asset request is not satisfied.** The rendered Browse by Subject panels still use emoji for cluster and lesson-row icons, and the homepage code contains no reference to `public/staff_and_students/*-transparent-circle.png`.
5. **The newer stitch request is not satisfied.** Stitches are still represented by uniform CSS dashed borders on cards, avatars, and lesson-count buttons; they are not the more realistic stitch treatment requested for the Figma-indicated stitched elements.
6. **Destination note:** the four labels and identities are correct, but the Early Years card still links to `/daycare` rather than a grouped Early Years destination.

## Confirmed passes

- Exact card identities are correct: Early Years / Miss Puddles, Kindergarten / Miss Maisy, Grade 1 / Mr Rusty, Grade 2 / Mr Sam, using the confirmed `src/imports` images.
- The restored blue hero sits directly below the selector, preserves the headline and supporting treatment, and uses `public/scenes/old-mac-and-barnyard-music-circle.png`.
- At 1440×584 the hero image renders about 354×205 and the hero ends at y≈545, exposing the start of Browse by Subject in the initial viewport as requested.
- Browse by Subject, A Barn Band Day, and the footer remain present in the full-page Playwright capture.
- Next.js MCP reported no compilation issues and no runtime/session errors.

No application code, visual baseline, staging state, commit, or push was changed by this reviewer.
