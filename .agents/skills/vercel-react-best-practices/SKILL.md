---
name: vercel-react-best-practices
description: Performance-only guidance for React and Next.js: waterfalls, bundle size, caching, render cost, Core Web Vitals, and performance refactoring. Do not use for ordinary Next.js routing or correctness work.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React and Next.js Performance

Use rule files selectively for measurable or explicitly requested performance work. Do not load the full catalog for ordinary UI changes.

## Trigger conditions

Apply when the request names performance, Core Web Vitals, waterfalls, bundle size, caching, render cost, load time, or performance refactoring. For routing, RSC boundaries, async APIs, metadata, and route correctness, use `next-best-practices`.

## Priority order

1. Eliminate waterfalls: `rules/async-*.md`.
2. Reduce bundle cost: `rules/bundle-*.md`.
3. Improve server work and caching: `rules/server-*.md`.
4. Then inspect client fetching, rerenders, rendering, JavaScript, or advanced rules only when evidence points there.

## How to use

Read only the matching rule files. Each contains rationale and incorrect/correct examples. Use `AGENTS.md` only for a broad performance audit. Verify changes with the project's actual build, runtime, or measurement; a checklist is not proof.