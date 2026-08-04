# Markdown publishing workflow

This website is the reviewed publishing layer. The archive project and its
spreadsheets remain the research and collection layer.

## Source of truth

Each published lesson is one file in `content/lessons`. Its frontmatter stores
the page identity, template, source workbook row, media ownership and credits,
verification state, and review date. Its Markdown body stores the teacher-facing
lesson plan.

No website database is required. The lesson files are indexed at build time,
and Git records every accepted change.

## Page-by-page gate

1. Select a source row from the approved workbook queue.
2. Create or revise one Markdown lesson page.
3. Preserve the exact source workbook, sheet, row, and source identifiers.
4. Distinguish source facts from editorial curriculum connections and lesson steps.
5. Confirm the owned video asset or destination, Kathy Reid-Naiman music credit,
   and project-use permission.
6. Run the content validator and Next.js build.
7. Preview the route, printable state, external actions, and print layout.
8. Change the page to publishable only after those checks pass.
9. Commit that verified page or small batch as a Git checkpoint.

Draft pages may remain in the repository, but the public lesson index should
only include pages whose frontmatter says they are publishable.

## Division of responsibility

- Archive site and spreadsheets: collection, evidence, corrections, and future imports.
- Markdown pages: reviewed website content.
- Next.js templates: consistent music-first and video-first presentation.
- Build checks and Playwright: structural and browser verification.
- Git: publication history, review boundary, and rollback.
