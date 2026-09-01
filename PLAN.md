# Launch Plan — Ponytail · Caveman · Impeccable Workflow

## Tool Installation Status

| Tool | Status | Details |
|------|--------|---------|
| **Caveman** (13 skills) | ✅ Active | `@caveman-ai/cli@1.3.1` global CLI + all skills loaded |
| **Ponytail** (6 skills) | ✅ Installed | Core + review/audit/debt/gain/help — global Hermes skills |
| **Impeccable** (24 commands) | ✅ Installed | Global Hermes skill + project `.impeccable/config.json` |

---

## Startup Procedure

### Step 1 — Init session
```
caveman run hermes               # run Hermes through caveman proxy
/ponytail                        # enable lazy-dev mode (default: full)
/impeccable init                 # sets up project for impeccable design work
```

### Step 2 — Before coding, load relevant tools
```
# Load ponytail for coding discipline
@ponytail                        # YAGNI ladder: stdlib → native → one line → minimum

# Load impeccable for design work
/impeccable                      # 24 design commands: critique, polish, audit, detect, etc.

# Load caveman for terse communication
/caveman full                    # cut filler, keep technical accuracy
```

### Step 3 — Verification cadence
```
npx impeccable detect src/       # anti-pattern scan (exit 0 = clean, 2 = findings)
npx impeccable detect --json .   # CI-friendly JSON output
npm run lint                     # eslint
npm run typecheck                # tsc --noEmit
npm run build                    # next build
```

---

## Anti-Slop Fix Applied (this session)

- [x] **`side-tab`** — `app/songs/[id]/page.tsx` (lines 46, 47, 49)
  - Changed `border-l-4 border-l-primary` → `border-l-2 border-l-primary/40`
  - 3 occurrences fixed. Lint: 0 errors.

---

## Impeccable `detect --json .` Remaining Findings

### Slop (AI-generated UI tells)

- [ ] **`side-tab`** — `docs/design-explorations/teacher-bundle.html` (design exploration, low priority)
- [ ] **`cream-palette`** — `docs/design-explorations/teacher-bundle.html` (beige bg, exploration)
- [ ] **`icon-tile-stack`** — `docs/design-explorations/teacher-home.html` (×2, exploration)

### Quality

- [ ] **`broken-image`** — `components/brand/ResponsiveBrandEmblem.tsx:48` — `<img>` with placeholder src, imported by 3 components
- [ ] **`low-contrast`** — `docs/design-explorations/teacher-home.html` (3 contrast fails, exploration only)

---

## Ponytail Over-Engineering Audit Targets

- [ ] Run `@ponytail-audit` to scan repo for over-engineering (dead code, stdlib replacements, yagni abstractions)
- [ ] Run `@ponytail-debt` to catalog any `ponytail:` comment markers
- [ ] Target high-value areas: shared components, lib/ utils, curriculum-lesson.ts

---

## Caveman Setup

- [ ] Run `caveman-setup` skill to wire this repo through Caveman Cloud gateway
  - Measures every LLM request with no behavior change
  - Labels workflows → spend grouped by workflow
- [ ] Run `caveman-discover` to label LLM workflows (e.g. "search-query", "lesson-gen")
- [ ] Verify with one real request through the gateway

---

## Hermes Update & Skills Audit

- [ ] **Check Hermes version**: v0.21.0 (89 commits behind — `hermes update` available)
- [ ] Review new features from changelog:
  - `hermes logs`, `hermes verify`, `hermes doctor`, `hermes security`
  - New provider/model selection changes
  - MCP server improvements
- [ ] Audit all 126 skills: remove dead/broken ones (bailian-cli link was broken)
- [ ] Update `AGENTS.md` with new tool workflows

---

## Brand Integrity Checks

- [ ] Verify `PRODUCT.md` and `DESIGN.md` reflect current ponytail/caveman/impeccable workflow
- [ ] Check `.impeccable/config.json` is up to date (currently only hook limits, no design system config)
- [ ] Run `impeccable detect --json .` before any release as CI gate

---

## Rules

1. Run `impeccable detect` before and after every design/UI change
2. Run `impeccable detect --json .` before release as CI gate
3. Use ponytail mode for every coding task to prevent over-engineering creep
4. Keep this plan current; it is the anti-drift contract
5. Update `AGENTS.md` when tool workflows change