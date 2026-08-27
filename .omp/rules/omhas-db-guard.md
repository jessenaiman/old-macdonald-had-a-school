---
description: Catch ad-hoc SQLite DML/DDL or drizzle push attempted through bash or eval
condition:
  - '(?i)(INSERT\s+INTO|DELETE\s+FROM|DROP\s+TABLE|ALTER\s+TABLE|TRUNCATE\s+TABLE)'
  - '(?i)drizzle-kit\s+push|run\s+db:push'
  - '\.prepare\([^)]*(INSERT|UPDATE|DELETE)'
  - 'PRAGMA\s+writable_schema'
scope:
  - tool:bash
  - tool:eval
---

This OMHAS repo treats `data/omhas.db` as read-only source truth. Do not execute the matched command. If the data is needed: query with a read-only open (`readonly: true` / `mode=ro`). If a change is needed: draft the migration (`npm run db:generate`) plus a SELECT preview, a rollback, and the provenance chain, then stop for the owner's per-change approval — schema writes apply only via `npm run db:migrate`. See `.agents/skills/omhas-db/SKILL.md` for the full contract.
