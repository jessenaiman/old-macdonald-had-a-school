# Theme Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Make all normal text on character and paper surfaces meet WCAG 2.2 AA while preserving every approved character background color.

**Architecture:** `DESIGN.md` remains the design authority. A dependency-free Node checker locks character backgrounds, validates DESIGN/CSS foreground alignment, computes WCAG contrast, and requires the shared textured-surface halo; `app/globals.css` only binds those approved theme decisions.

**Tech Stack:** Next.js 16.3, Tailwind CSS v4, CSS custom properties, Node.js 24, Impeccable audit, agent-browser.

**Spec:** `DESIGN.md`

## Global Constraints

- Preserve all sixteen character background colors exactly.
- Update `DESIGN.md` before `app/globals.css`.
- No component-level contrast patches.
- Normal text contrast is at least 4.5:1.
- The halo is theme-owned, subtle, and scoped to textured character surfaces.
- Validate desktop 1280 and mobile 375 in light and dark themes.
- Perform an actual visual design review before requesting owner review.

---

### Task 1: Add executable contrast regression proof

**Files:**

- Create: `scripts/verify-theme-contrast.mjs`
- Modify: `package.json`

**Interfaces:**

- Consumes: `DESIGN.md` character tables and `app/globals.css` character custom properties.
- Produces: `npm run test:theme-contrast`, exiting non-zero for changed backgrounds, DESIGN/CSS drift, ratios below 4.5, or a missing shared character halo.

- [x] **Step 1: Add the checker**

Create a dependency-free script with the immutable background map:

```js
const backgrounds = {
  "old-macdonald": "#a66a32",
  "miss-puddles": "#f6af32",
  "mr-rusty": "#267cba",
  "miss-hayley": "#d95c86",
  "mr-sam": "#1d8787",
  "mr-maisy": "#d81d24",
  "mr-puddles": "#5367b5",
  "miss-maisy": "#5d8164",
  hopper: "#e66c71",
  whiskers: "#e695b0",
  scout: "#c59e7a",
  penny: "#f9cb7a",
  maisy: "#96ad9a",
  puddles: "#8f9ccf",
  sam: "#6cb1b1",
  rusty: "#72aad2",
};
```

Parse CSS tokens, resolve simple `var(--token)` references, calculate WCAG relative luminance, and report every failing character. Require `--character-contrast-halo: var(--character-color)` and a `.character-surface, .characters-surface` text-shadow using that token.

- [x] **Step 2: Register the checker**

Add to `package.json`:

```json
"test:theme-contrast": "node scripts/verify-theme-contrast.mjs"
```

- [x] **Step 3: Verify RED**

Run:

```powershell
npm run test:theme-contrast
```

Expected: non-zero with current sub-4.5 foreground pairs and missing halo evidence.

### Task 2: Correct the design authority

**Files:**

- Modify: `DESIGN.md`

**Interfaces:**

- Consumes: immutable character colors and WCAG 2.2 4.5:1 target.
- Produces: exact foreground assignments and the theme-owned textured-surface halo rule.

- [x] **Step 1: Add shared contrast roles**

Add `character-foreground-light: "#FEFCE8"`, `character-foreground-dark: "#1E2A38"`, and `character-foreground-maximum: "#000000"` to the authoritative color record. State that a thin halo matching the owned character background shades texture immediately around glyphs.

- [x] **Step 2: Update exact foreground records**

Use maximum black for Old MacDonald, Mr Rusty, Miss Hayley, Mr Sam, and Miss Maisy; warm cream for Mr Maisy and Mr Puddles; structural navy for the other nine characters. Preserve every background hex exactly.

- [x] **Step 3: Confirm authority changed first**

Run:

```powershell
git diff -- DESIGN.md app/globals.css
```

Expected: only `DESIGN.md` has production design changes at this checkpoint.

### Task 3: Bind shared theme tokens

**Files:**

- Modify: `app/globals.css`

**Interfaces:**

- Consumes: shared contrast roles and per-character foreground assignments from `DESIGN.md`.
- Produces: CSS variables consumed by all character surfaces without component edits.

- [x] **Step 1: Add shared foreground tokens**

Add:

```css
--character-foreground-light: #fefce8;
--character-foreground-dark: #1e2a38;
--character-foreground-maximum: #000000;
```

- [x] **Step 2: Remap character foregrounds**

Bind each `--characters-*-foreground` to one shared role. Do not modify any `--characters-*-color` value.

- [x] **Step 3: Add the textured-surface halo**

Inside `.character-surface, .characters-surface`, add the halo and full-opacity secondary-text token; bind the existing reduced-opacity utility only within the shared character surface:

```css
.character-surface,
.characters-surface {
  --character-contrast-halo: var(--character-color);
  --character-secondary-text-opacity: 1;
  text-shadow: 0 0 0.04em var(--character-contrast-halo);
}
.characters-surface .opacity-85 {
  opacity: var(--character-secondary-text-opacity) !important;
}
```

- [x] **Step 4: Protect the remaining textured theme surfaces**

Darken shared `--brand-paper-muted` to `#5B5144` for a 7.29:1 solid-paper reserve, ensure `.grade-surface` grade ink outranks generic card foreground utilities, and add a translucent navy wash above the approved `.material-leather-blue` texture:

```css
.material-leather-blue {
  --material-repeat: no-repeat, repeat;
  --material-leather-contrast-wash: color-mix(
    in srgb,
    var(--theme-navy) 72%,
    transparent
  );
  --material-image: linear-gradient(
      var(--material-leather-contrast-wash),
      var(--material-leather-contrast-wash)
    ),
    var(--asset-leather-blue);
  --material-size: auto, 240px;
  --material-accent-foreground: var(--theme-white);
}
.material-leather-blue em {
  color: var(--material-accent-foreground) !important;
}
```

- [x] **Step 5: Verify GREEN**

Run:

```powershell
npm run test:theme-contrast
```

Expected: all sixteen backgrounds unchanged, all ratios at least 4.5:1, DESIGN/CSS alignment passes, and halo ownership passes.

### Task 4: Impeccable and runtime visual proof

**Files:**

- No production files unless the bounded visual review finds a defect within approved scope.
- Evidence: screenshots saved outside the repository or in an ignored evidence path.

**Interfaces:**

- Consumes: locally running Next.js route `/`.
- Produces: desktop/mobile light/dark screenshots, runtime evidence, detector output, and a human-readable design verdict.

- [x] **Step 1: Start the verified dev loop**

Probe port ownership, start `npm run dev` on a free port, then verify Next runtime health before browser assertions.

- [x] **Step 2: Capture four visual states**

Use agent-browser for 1280px desktop and 375px mobile in both light and dark themes. Record exact screenshot paths.

Final screenshot evidence:

- Desktop dark hero/grade: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788555167010.png`
- Desktop dark characters: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788555167368.png`
- Desktop light hero/grade: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788555167742.png`
- Desktop light characters: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788555167958.png`
- Mobile light hero/characters: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788555182095.png`, `screenshot-1788555182264.png`, `screenshot-1788555182429.png`
- Mobile dark hero/characters: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788555182702.png`, `screenshot-1788555182864.png`, `screenshot-1788555183023.png`
- Grade 2 singular character surface after review fix: `C:\Users\jesse\.agent-browser\tmp\screenshots\screenshot-1788556420093.png`

- [x] **Step 3: Perform actual visual review**

Inspect the rendered character wall for readability, halo subtlety, preserved character identity, hierarchy, and absence of heavy outlined text. Apply at most one bounded correction pass, then one confirmation pass.

Verdict: shared ink is readable across both themes and breakpoints; all approved character backgrounds and identities remain intact; the character halo is visually subtle; opaque controls remain unoutlined; the navy leather wash preserves visible grain while stabilizing display-text contrast.

- [x] **Step 4: Run Impeccable detector and contrast proof**

Run the detector once for the final UI state and rerun `npm run test:theme-contrast`. Separate relevant contrast findings from unrelated advisory output.

### Task 5: Check in and submit

**Files:**

- Stage only `DESIGN.md`, `app/globals.css`, `scripts/verify-theme-contrast.mjs`, `package.json`, and this plan.

**Interfaces:**

- Consumes: complete task and visual evidence.
- Produces: one reviewed commit and one unmerged PR from `fix/theme-contrast`.

- [x] **Step 1: Run task and production gates**

```powershell
npm run test:theme-contrast
npm run typecheck
npm run lint
npm run build
```

- [x] **Step 2: Commit with gates triggered by Git**

Use a task-local pre-commit hook when the workflow PR is not yet integrated; it must invoke the contrast checker, typecheck, lint, and build. Commit only after the hook exits zero.

- [x] **Step 3: Request independent review**

Review the exact base-to-head diff only after the todo and visual evidence are complete. Fix all Critical and Important findings, then rerun affected checks.

- [ ] **Step 4: Push and open PR without merging**

Push `fix/theme-contrast` only after local proof. Include concise caveman bullets naming the actual visual changes, exact screenshot paths, contrast ratios, detector result, known failures, and rollback notes.
