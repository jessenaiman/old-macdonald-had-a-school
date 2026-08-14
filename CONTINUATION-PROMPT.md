# Prompt for the next coding agent

Work in `C:\old-macdonald-had-a-school` and take responsibility for stabilizing the existing site. Read `AGENTS.md` and `HANDOVER-2026-08-14.md` completely before taking any action. Then read `.agents/skills/shadcn/SKILL.md`, the relevant local Next.js 16.3 docs under `node_modules/next/dist/docs/`, the matching branding MDX, and inspect the live routes at `http://localhost:3000`.

Do not delegate work unless I explicitly ask you to. Do not invent new routes, wrappers, registries, databases, or component systems. Do not add a global max-width: grade workspaces must remain full width. Preserve my content, database, semantic search, assets, and existing route behavior.

Your first job is evidence and stabilization, not redesign:

1. Show an ongoing checkmark list in chat.
2. Confirm the checkout, branch, dirty files, port-3000 process, and exact served app.
3. Run typecheck and lint, then restart Next because `next.config.ts` changed.
4. Verify `/lessons/add-drawings-or-other-visual-displays-to-descriptions`: YAML must not render, metadata must be correct, and canonical grade navigation must work.
5. Capture and inspect `/`, `/grade/grade-one`, `/search`, `/songs`, `/topics`, `/about`, and `/branding` at 1440px, 390px, and 320px. Check DOM/computed widths, overflow, assets, keyboard focus, and responsive navigation—not screenshots alone.
6. Report the exact shared-design conflicts before editing. Separate verified bugs from design judgment.

Then proceed foundation-first:

- Establish only three documented page patterns using the existing theme and installed shadcn components: full-width workspace, branded landing/reference, and readable teaching document.
- Make the Home page the accepted reference. It needs a simple two-column hero: title plus reusable “New this week” song list on the left; carousel and relevant teaching/planning links on the right. Keep useful subject links, all five grade links, and the separate Music/Art/Drama/Dancing section. Use existing routes.
- Pinned-note and sewn-patch appearances must be governed variants of properly composed shadcn components, using semantic tokens and registered assets. Do not hand-roll a new styled div for each page.
- Follow every shadcn rule: inspect installed components, fetch component docs before use, use semantic colors and built-in variants, full Card composition, FieldGroup/Field for forms, actual Checkbox/Select components, Badge, Separator, and correct icon handling. `className` is for layout, not overriding component colors or typography.
- Keep character identity theme-driven. Never repeat character hex values or color names in component copy. Changing a character token must propagate across pages.
- Register asset URLs only in `app/brand-assets.css`.

After each small change, show what changed and browser-proof it. Do not claim the site is fixed until typecheck, lint, build, tests, route behavior, desktop/mobile visual inspection, keyboard focus, and overflow checks all pass. If a required service or tool is unavailable, stop and explain the exact blocker instead of inventing a workaround.
