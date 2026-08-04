# Old MacDonald Had a School — Project Checklist

This is the durable handoff record for the project. Every agent should read this file and `AGENTS.md` before working. Update task status and evidence as work is reviewed.

## Product direction

- Build a highly efficient teacher blog under the hood: Markdown/MDX content, reusable Next.js templates, static routes, and simple build-time validation.
- Use the Figma implementation as the visible design source for layout, typography, palette, spacing, icons, and page rhythm.
- Optimize for teachers preparing between lessons: quickly preview and print resources, or find and save videos for classroom playback.
- Maintain two lesson patterns: music-led and video-led.
- Keep curriculum content out of SQLite. The archive site and spreadsheets remain the research/data-collection system.

## Source hierarchy

1. **Visual design:** the Figma implementation, this repository's preserved `src/` and `src/assets/`, and approved Figma screenshots. The header and top of every page must be based on Figma.
2. **Content only:** canonical brand facts, cast identities/roles, biography, and project wording from `C:\Users\jesse\OneDrive\Documents\New project`.
3. The other website must never be copied as the visual design system; it is an archive/content source the new design is intended to replace.

## Active checklist

- [ ] Upgrade to Next.js 16.3+ and verify Turbopack.
- [ ] Verify `agent-browser` 0.31.1+ and complete the installed `/next-dev-loop` preflight.
- [ ] Add the `/next-dev-loop` requirement and this checklist to `AGENTS.md`.
- [ ] Keep the compact approved homepage hero: eyebrow, headline, italic promise, and smaller framed image only.
- [ ] Professionally tighten homepage hierarchy and wording without changing its fonts or palette.
- [ ] Make the age-band section efficient teacher navigation with consistent metadata and explicit linked destinations.
- [ ] Rebuild Browse by Subject as the dense Figma 2×2 cluster pattern with correct real icons, useful lesson rows, age/grade labels, Ready states, and more links.
- [ ] Remove the cast presentation from the homepage and all curriculum-planning sections.
- [ ] Build a polished standalone `/cast` page from canonical cast data and transparent assets.
- [ ] Fix the shared top-of-page layout on every route: one compact header row, consistent content offset, no collisions, and no oversized blank band.
- [ ] Group curriculum navigation into `Early Years` and `Primary Grades` menus.
- [ ] Replace the text theme selector with an accessible real icon button.
- [ ] Preserve the bottom `A Barn Band Day` feature panel's layout, exact text, and real resource image.
- [ ] Preserve the navy/gold footer's structure, logo/credit, navigation, Cast Guide link, and closing statement.
- [ ] Verify bottom-panel and footer colors against the original Figma source/tokens; do not assume screenshot colors are authoritative.
- [ ] Migrate Jesse's About page from the source website.
- [ ] Create Markdown/MDX files and direct shareable routes for cover letters, bios, and personal promotional profiles.
- [ ] Preserve source wording and flag claims that require Jesse's verification.
- [ ] Review desktop and mobile screenshots against references at matching viewport sizes.
- [ ] Run independent runtime, accessibility, link, print, content, and Playwright checks.
- [ ] Add regression coverage ensuring the protected bottom feature and footer remain present.
- [ ] Create verified Git checkpoints and publish to GitHub after review approval.

## Protected visual references

- Compact hero scope: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-af870afc-d26a-4839-aa0e-c6b5a8182e81.png`
- Browse by Subject: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-697ed39e-b5db-4525-81cb-17d23bb3ca4d.png`
- Homepage hierarchy/age bands: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-7ac4671c-46c1-48ab-a574-636da0118afe.png`
- Protected bottom feature and footer: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-af5830df-b640-4e46-9527-2f4b58fb1e5e.png`
- Compact header reference: `C:\Users\jesse\AppData\Local\Temp\codex-clipboard-bae8f311-8e3b-4353-ae42-c93ee9e0bc20.png`

## Current agent lanes

- **Team lead:** review, acceptance criteria, coordination, visual comparison, and approval. No application-code implementation.
- **Parfit (Luna):** dependency/runtime upgrade and `/next-dev-loop` preflight only.
- **Carver (Luna):** shared header/top-of-page layout, homepage, Browse by Subject, protected footer/feature, and standalone cast page.
- **Descartes (Luna):** About migration and Markdown portfolio library.
- **Independent reviewer:** to be assigned after implementation lanes finish; must not author the surfaces being reviewed.

## Review gate

No item is complete merely because it compiles. Completion requires the running app, the installed `/next-dev-loop`, matching-viewport visual comparison, working links and controls, responsive review, and independent QA evidence.
