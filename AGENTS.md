<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant documentation in
`node_modules/next/dist/docs/`. Training data is not the source of truth; the
installed, version-matched documentation is.

# Project coordination: read and update the durable checklist first

Before beginning any task, read `docs/PROJECT_CHECKLIST.md`. Update the
relevant task status and evidence in that file when work is completed or
blocked. Keep the checklist and this file current for the next agent.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:next-dev-loop-agent-rules -->

# Next.js: use the installed next-dev-loop for every web code change

Before changing Next.js or web application code, load and follow the
repository skill at `.agents/skills/next-dev-loop/SKILL.md`. It requires
Next.js 16.3+ with Turbopack and `agent-browser` 0.31.1+; run its preflight
against the running dev server and verify both `/_next/mcp` and the browser
after each focused change. Keep the session scoped to this worktree.

<!-- END:next-dev-loop-agent-rules -->

# Old MacDonald Had a School

This repository is a Next.js App Router website for teachers, migrated from a
Figma Make prototype.

## Source hierarchy

1. **Visual design:** the preserved Figma implementation in this repository,
   including `src/`, `src/assets/`, Figma assets, and the approved screenshots.
   The shared header, page chrome, top spacing, hero, palette, typography,
   icons, and page rhythm must be derived from these sources.
2. **Content only:** the canonical brand facts, cast, roles, character
   identities, biography, curriculum wording, and project information from
   `C:\Users\jesse\OneDrive\Documents\New project`.
3. The other website is an archive/content source. Do not copy its header,
   navigation, top spacing, visual styling, or page templates into this site.
4. `public/CAST_AND_ROLES.md` and
   `public/Old_MacDonalds_Farm_School_Character_Deck_v2.pdf` in that project
   are the character content source of truth.

## Product rules

- Preserve the approved navy homepage hero.
- Lessons are MDX-authored, blog-like pages with static routes and metadata.
- `template: music` means the song is the core presentation.
- `template: video` means the video is the starting resource followed by
  Try, Practice, Check, and Extend.
- Never invent, rename, recolour, or reassign a canonical character.
- Do not use emoji, placeholder art, handcrafted SVGs, or generic replacement
  visuals. Use supplied assets and a real icon library.
- Keep semantic links, keyboard access, reduced motion, responsive layouts,
  metadata, and useful alt text at the quality floor.
- Preserve `src/` as a visual reference until the Next.js migration passes
  design QA.

## Collaboration rules

- Stay inside the write set assigned to your task.
- Do not overwrite another worker's changes or perform broad rewrites.
- Report changed files, checks run, risks, and unfinished work.
