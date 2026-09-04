# Homepage Restoration and Theme Contract Plan

**Goal:** Restore the approved pre-grade-rail homepage and full grade menu while preserving all character colors and repairing theme ownership at shared semantic surfaces.

**Authority:** `DESIGN.md`

## Constraints

- Keep all sixteen character backgrounds unchanged and normal text at WCAG AA.
- Keep the documented `next-themes` class/system provider contract.
- Keep later accessibility, registry-asset, and Next Image improvements.
- Theme/material surfaces own semantic variables; descendants do not use color `!important` patches.
- No new dependency or one-use wrapper.
- Push one green branch and open an unmerged PR; owner alone approves merge.

## Work

- [x] Recover and visually confirm the `cdb3a02` homepage composition.
- [x] Update `DESIGN.md` before production CSS.
- [x] Add RED checks for homepage, desktop/mobile grade navigation, provider wiring, semantic paper/grade scopes, character colors, and contrast.
- [x] Restore the paper-first homepage and grade-tagged lesson rows.
- [x] Restore all five grade links in desktop and mobile navigation.
- [x] Remove the homepage grade rail and unused navigation wrapper.
- [x] Replace paper and grade descendant overrides with local semantic bindings.
- [x] Verify desktop/mobile light/dark pixels, Impeccable, Next runtime MCP, and production gates.
- [ ] Clear final Ponytail and correctness re-reviews.
- [ ] Commit through the local gate, push, and open the PR without merging.
