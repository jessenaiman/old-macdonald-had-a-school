---
name: next-best-practices
description: Next.js architecture and correctness for App Router file conventions, Server Components, async APIs, routing, metadata, and route handlers. Use for implementation and correctness reviews; use vercel-react-best-practices only for explicit performance work.
user-invocable: false
---

# Next.js Architecture and Correctness

Apply to Next.js architecture and correctness. Before writing code, read the installed Next.js guide under `node_modules/next/dist/docs/` as required by the repository instructions.

## Scope

Use this skill for:

- App Router file conventions and route structure.
- Server and Client Component boundaries, serializable props, and directives.
- Async `params`, `searchParams`, `cookies()`, and `headers()` APIs.
- Metadata, route handlers, redirects, errors, not-found, and Suspense boundaries.
- Correct data access patterns, runtime selection, and navigation APIs.

Read the linked reference file only for the relevant topic: `file-conventions.md`, `rsc-boundaries.md`, `async-patterns.md`, `data-patterns.md`, `route-handlers.md`, `metadata.md`, `error-handling.md`, or `suspense-boundaries.md`.

## Boundary with performance

Do not load Vercel performance rules for ordinary routing or correctness work. Use `vercel-react-best-practices` only when the request names waterfalls, bundle size, caching, render cost, Core Web Vitals, load time, or performance refactoring.

## Verification

Run the narrowest relevant typecheck, lint, build, or route check. Runtime/API success is not a substitute for visible browser proof when the task changes an interactive route.