# Visual QA workflow

The visual QA suite runs against the live Next.js dev server at
`http://localhost:8443`:

```powershell
pnpm dev --turbopack -p 8443
pnpm qa:visual
```

The dedicated config captures the homepage at the two deterministic review
viewports:

- Desktop: `1543 × 900`
- Mobile: `390 × 844`

Each project checks for horizontal overflow, unexpected browser console/page
errors, and the protected `A Barn Band Day` feature plus footer. Screenshot
comparison uses conservative thresholds (`0.1` colour threshold, `250` max
changed pixels, and `0.05%` max changed-pixel ratio).

Homepage readiness is app-owned and bounded: navigation waits only for
`domcontentloaded`, followed by the stable homepage heading, loaded document
fonts, loaded images visible in the approved viewport, and two animation
frames for layout to settle. The suite never waits for `networkidle`, because
the Next.js development runtime may keep background connections active.

## Baseline policy

Raw Figma screenshots are human comparison specifications. They are not copied
into Playwright's expected-snapshot directory, and content adaptations remain
pending until the team lead reviews them.

Only a rendered page that the user or team lead explicitly approves may be
promoted to a committed automated baseline. Baselines are reviewed as normal
files by the independent Figma reviewer and Git steward.

CI must never update snapshots automatically. A missing or changed baseline is
an intentional failure. After explicit approval, a human may update snapshots
locally with:

```powershell
pnpm exec playwright test --config=playwright.visual.config.ts --update-snapshots
```

The resulting images must be visually inspected, scoped to the approved
viewport, and committed only after the independent review gate. Do not add
`--update-snapshots` to CI commands or scripts.

The suite does not start its own server, so a failed connection means the live
8443 server must be recovered before interpreting visual results.
