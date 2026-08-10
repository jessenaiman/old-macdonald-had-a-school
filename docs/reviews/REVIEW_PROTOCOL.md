# Independent Figma Review Protocol

This protocol applies to every visual batch from the lead.

1. Read the batch scope and changed routes/states from the lead. Use the supplied Figma screenshots, preserved `src/`, approved assets, and project tokens as the visual authority. Never use the archive website as a visual reference.
2. Confirm the running route in the in-app browser. If it is unavailable, record the exact URL, browser error, and runtime limitation; do not substitute source-only review.
3. Capture the implementation at the same viewport dimensions and scroll/interaction state as each supplied reference. Keep the capture state explicit in the report.
4. Save the exact implementation screenshot under `docs/reviews/YYYY-MM-DD/<batch>/` and copy only the relevant supplied references into a `references/` sibling folder.
5. Inspect each saved screenshot before accepting it. Reject blank, loading, blocked, wrong-state, or cropped evidence unless the crop is the intended reference state.
6. Compare reference and implementation together for hierarchy, spacing, typography, palette, icons, assets, borders, image cropping, responsive reflow, keyboard-visible states, and the protected bottom feature/footer.
7. Run the available `next-dev-loop` runtime checks. Record version, `/_next/mcp` status, compilation/runtime errors, and any missing tooling. Do not claim the preflight passed when one of its required views is unavailable.
8. Return exactly one visual verdict: `APPROVED` only when the visible differences are within the approved source; otherwise `CHANGES REQUIRED` with numbered, concrete differences tied to evidence states.
9. Include evidence limits: screenshots do not prove full accessibility compliance, semantic reading order, focus-ring quality, or assistive-technology behavior.
10. Do not edit application code, commit, or push from the reviewer lane. Only evidence reports and captured review artifacts belong in `docs/reviews/`.

## Evidence naming

Use stable, ordered names such as:

- `01-header-implementation.png`
- `02-mobile-hero-implementation.png`
- `03-subject-implementation.png`
- `04-bottom-feature-footer-implementation.png`
- `05-keyboard-focus-implementation.png`
- `homepage-baseline-review.md`

## Required report fields

- verdict
- route and requested visual batch
- reference/implementation viewport and state for every screenshot
- paired reference and implementation evidence
- numbered visible differences
- runtime/preflight status
- accessibility and keyboard evidence limits
- exact evidence folder and report path

