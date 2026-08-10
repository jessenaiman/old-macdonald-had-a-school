# Independent Figma Homepage Review — Iteration 2

**Verdict: CHANGES REQUIRED**

Scope was the repaired homepage composition, including the intentional four-card adaptation (Early Years, Kindergarten, Grade 1, Grade 2), Browse by Subject, CTA treatment, protected feature/footer, desktop at 1543px, and mobile at 390px. No application code was edited, committed, or pushed.

## Evidence

- [Desktop final capture](05-desktop-1543x900-final.png)
- [Desktop lower-section capture](06-desktop-bottom-1543x900-final.png)
- [Mobile final capture](07-mobile-390x844-final.png)
- [Approved top reference](../references/01-top-composition-reference.png)
- [Approved Browse by Subject reference](../references/02-browse-subject-reference.png)
- [Approved stitched CTA reference](../references/03-stitched-cta-reference.png)
- [Protected feature/footer reference](../references/04-protected-feature-footer-reference.png)

## Remaining findings

1. **Release-blocking Next overlay.** The supplied [desktop final capture](05-desktop-1543x900-final.png) visibly shows the red `1 Issue` Next development overlay at the lower left. This is not acceptable in a final visual capture, even when compilation issues are empty.

   The recorded `/ _next/mcp` and browser evidence from the prior recovery identifies the cause as the transient dependency reorganization: `Could not find the Next.js package (next/package.json)`, with Next reporting that `node_modules` was reorganized during a concurrent install. Subsequent recovery returned `get_compilation_issues: {"issues":[]}` and empty runtime errors, but the overlay-bearing final screenshot remains disqualified. During this wrap-up recapture, `http://localhost:8443/` and `/_next/mcp` timed out and no listener was present on port 8443, so a fresh clean overlay status could not be certified.

2. **Browse by Subject typography and text color still diverge.** In the desktop final capture, the section heading and cluster headings use the rounded handwritten treatment, and lesson rows are strongly blue/teal/red/green. The approved Browse reference uses heavier display headings and dark/black lesson-row text with the cluster color reserved for the heading treatment. The row names and density now match the approved set, including the visible `+ 1 more...` treatment; this finding is limited to the visible type weight/color system.

3. **Header navigation labels remain outside the approved Figma header.** The selector’s intentional content adaptation is accepted, but the desktop final header reads `Early Years` and `Kindergarten` where the approved composition reads `Daycare` and `Preschool`. The wordmark is now held on one line, so the prior wrapping issue is not re-raised.

4. **Protected feature/footer cannot be re-certified from the supplied final state.** The [desktop lower-section capture](06-desktop-bottom-1543x900-final.png) ends while the lower feature panel is only beginning; it does not show the protected footer composition. The live endpoint was unavailable for a fresh bottom-state capture. This is a capture blocker, not an assertion that the unseen footer changed.

## Responsive result

The supplied 390×844 capture shows the four cards stacked and filling the available 375px layout width; the previously reported large blank cream strip is not reproduced. No mobile horizontal-overflow mismatch is evidenced by this capture.

## Final status

**CHANGES REQUIRED** because the final desktop evidence contains a visible `1 Issue` overlay, Browse typography/color still differs, and the protected bottom feature/footer has not been freshly verified against the live page.
