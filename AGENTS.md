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

1. The canonical brand, name, cast, roles, character identities, signature
   colours, curriculum content, navy hero, and video-first lesson structure
   come from `C:\Users\jesse\OneDrive\Documents\New project`.
2. `public/CAST_AND_ROLES.md` and
   `public/Old_MacDonalds_Farm_School_Character_Deck_v2.pdf` in that project
   are the character source of truth.
3. This repository's legacy `src/App.tsx`, `src/index.css`, and
   `src/assets/` supply the preferred Figma visual treatment and the
   music-led lesson presentation.

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
