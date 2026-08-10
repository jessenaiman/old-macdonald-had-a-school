# Independent Figma Homepage Repair Review — 2026-08-05

Verdict: **CHANGES REQUIRED**

Scope: the rendered homepage at `http://localhost:8443/`, compared only against the supplied exact top composition, Browse by Subject reference, and stitched CTA reference. No application code was edited, committed, or pushed.

The four-card content adaptation is accepted as intentional: Early Years, Kindergarten, Grade 1, and Grade 2. The remaining visual system is judged against Figma.

## Paired evidence

| State | Approved reference | Fresh implementation |
| --- | --- | --- |
| Top composition, CSS viewport 1543×476 | ![Top reference](references/01-top-composition-reference.png) | ![Top implementation](01-desktop-top-implementation.png) |
| Browse by Subject, section crop | ![Browse reference](references/02-browse-subject-reference.png) | ![Browse implementation](02-desktop-browse-subject-implementation.png) |
| Stitched CTA | ![CTA reference](references/03-stitched-cta-reference.png) | ![CTA implementation](06-stitched-cta-implementation.png) |

Additional responsive/runtime evidence:

- [390px mobile implementation](03-mobile-390-implementation.png)
- [Bottom feature/footer implementation](05-desktop-bottom-implementation.png)
- [Transient build-error evidence](04-runtime-build-error.png) — setup-only evidence, not the final page state.

The browser raster excludes the vertical scrollbar gutter: the 1543px CSS viewport saved as 1528px, the 1277px Browse viewport saved as 1262px before the section crop, and the 390px CSS viewport saved as 375px. These dimensions are recorded rather than silently resized.

## Findings

1. **Top order and four-card adaptation — PARTIAL PASS.** The repaired page has the expected order: compact header, dark selector band, gold divider, then beige hero. Four cards are present with the approved adaptation and the intended character assets. The selector group is visibly narrower than the reference: live card geometry is approximately 295.75px wide with x positions 151.5, 461.25, 771, and 1080.75 at the 1543px CSS viewport; the reference cards span closer to 302–303px with a wider overall group. Live cards begin about 4px lower and are a few pixels taller than the reference. This is a visible spacing/geometry mismatch.

2. **Header lockup and navigation — CHANGES REQUIRED.** The reference uses a single-line “Old MacDonald Had a School” lockup with the teacher-resources line below. The implementation wraps the brand name into two lines and changes the lockup’s vertical rhythm. The reference Home control is a dark outlined pill; the implementation is a filled yellow pill. The reference navigation reads Daycare, Preschool, Grade 1, Grade 2, divider, Cast Guide; the implementation reads Early Years, Kindergarten, Grade 1, Grade 2, Cast Guide. The intentional four-card adaptation does not authorize this separate header change.

3. **Hero asset, byline, and vertical placement — CHANGES REQUIRED.** The reference uses the barn/storefront illustration; the implementation uses the farm-school gathering illustration. The live hero image is about 256×196 and sits lower, clipping below the 476px capture, while the reference image is shorter and fully visible at the right. The reference byline is a small light handwritten treatment; the implementation is visibly heavier/bolder. The hero heading, byline, and supporting sentence also sit lower than the reference.

4. **Browse by Subject geometry — CHANGES REQUIRED.** The reference uses two large cards per row with approximately 25px outer margins, 608px card widths, and taller cards. The implementation’s live article geometry is approximately 606px wide at x=0 and x=624, with the first row only 181px tall and no matching outer inset. The crop also reveals the sticky header in the live page context; the comparison image below it is the section-only evidence.

5. **Browse by Subject row content and density — CHANGES REQUIRED.** The reference’s Language and Math cards contain four named lesson rows plus “+ 1 more…”. The implementation has two rows in each and omits the “+ 1 more…” treatment. The live rows are standards-style vowel/addition text rather than the reference’s Story Time, Show & Tell, Phonics, Sensory Tray, Shape Hunt, Nature Journal, and Adding with Equal Groups content. Long rows are ellipsized in the implementation, changing scanability and visible density.

6. **Browse by Subject typography and icons — CHANGES REQUIRED.** The reference uses bold dark/cluster-colored display headings, black lesson text, and small colorful subject/lesson artwork. The implementation uses thinner muted teal/red/green text, outline-style book/calculator/music/leaf icons, and reduced row contrast. This verifies the lead hypothesis about typography, iconography, and row presentation.

7. **Stitched CTA treatment — CHANGES REQUIRED.** The implementation preserves the general gold fill and stitched border idea, but the live CTA is approximately 196×42px versus the 223×50px reference and reads “Open Preschool lessons” with lowercase “lessons” instead of the reference’s title case “Open Preschool Lessons”. The padding and visual weight are therefore visibly smaller.

8. **Lower feature/footer preservation — CHANGES REQUIRED.** At the live bottom scroll state, the protected feature panel is clipped beneath the sticky header and the footer begins earlier than the approved protected composition. The navy footer exists, but the feature-to-footer vertical rhythm and closing-statement placement do not preserve the reference composition.

9. **Mobile responsiveness — P0 hypothesis not reproduced in this capture.** At an explicit 390×844 CSS viewport, the live page reports `innerWidth=390`, `clientWidth=375`, `bodyClientWidth=375`, `scrollWidth=375`, and `bodyScrollWidth=375`. The screenshot content fills the available 375px layout width with four cards stacked vertically; no large blank cream strip or horizontal overflow was visible in the fresh capture. The 15px difference is consistent with the browser scrollbar gutter. The mobile card stack and hero transition are structurally responsive, though the header/hero typography and spacing still inherit the desktop mismatches above.

## Runtime and console evidence

- `/_next/mcp` was reachable at `http://localhost:8443/_next/mcp`.
- `get_compilation_issues` returned `{"issues":[]}` after dependency recovery.
- `get_errors` returned empty `configErrors` and `sessionErrors` after dependency recovery.
- A fresh in-app Playwright tab reported no console errors or warnings after the stable reload.
- A transient Turbopack overlay occurred while `node_modules` was being reorganized; it is preserved as `04-runtime-build-error.png` and explicitly excluded from the final visual state.
- The installed `agent-browser` CLI was not found on this shell’s PATH, so the CLI half of the documented `next-dev-loop` could not be executed. The Next.js MCP half and in-app Playwright view were completed.

## Evidence limits

The screenshots and DOM measurements establish visible hierarchy, spacing, typography, palette, imagery, icons, borders, cropping, responsive reflow, and footer composition. They do not establish full WCAG compliance, print behavior, assistive-technology reading order, or focus-ring quality.

