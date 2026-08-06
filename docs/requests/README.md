# Decision and Change-Request Inbox

This is the project's lightweight asynchronous inbox for Jesse. It keeps
questions and change requests out of chat scrollback without stopping unrelated
work.

## How it works

1. Agents add a short entry to `INBOX.md` only when Jesse's answer would improve
   or change the result.
2. Each entry states exactly what work is blocked. `blocking: no` means the team
   continues using the documented default. `blocking: yes` pauses only the named
   task, never the whole project.
3. Jesse writes directly under `Answer from Jesse:` and changes `status: open`
   to `status: answered`.
4. At every review milestone, the team lead checks this inbox, reports newly
   answered items in chat, updates the affected task, and marks the entry
   `status: applied` after the answer is reflected in the project.

Use this inbox for product decisions, content questions, approvals, and change
requests. Use GitHub issues later for public engineering work or external
collaboration; local Markdown is the simpler tool while the project and design
are still changing quickly.

## Entry format

```md
### REQ-000 — Short title

- type: question | decision | change-request
- status: open | answered | applied | closed
- blocking: yes | no
- blocks: exact task or `none`
- default while open: safe action the team may continue with
- asked: YYYY-MM-DD

Question or requested change in one short paragraph.

**Answer from Jesse:**

<!-- Write here, then change status to answered. -->
```
