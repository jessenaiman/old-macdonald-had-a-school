# Old MacDonald Had a School

A conventional Next.js App Router site. Routes live in `app/`, reusable UI lives in `components/`, published lesson content lives in `content/`, and browser-served assets live in `public/`.

## Package manager

Use **npm**. `package-lock.json` is the only dependency lockfile.

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
```

## Grade templates

Each grade has an explicit, independently editable template:

```text
components/grades/
  daycare/
  preschool/
  kindergarten/
  grade-one/
  grade-two/
```

Every folder owns its grade identity and a local CSS module. Shared layout mechanics remain in `components/builder/CurriculumTemplates.tsx`; grade-specific visual changes belong in the appropriate grade folder.

## Content

Published lessons are Markdown or MDX files in `content/lessons/`. Routes and page components must not assume a future spreadsheet's exact columns. Content metadata is normalized at the content boundary in `lib/content.ts`, with filename- and folder-based defaults when optional metadata is absent.

Static design and character assets stay in `public/`. Research, source data, and design references are not application routes.
