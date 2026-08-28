# omp:// reference index

Pointers to the bundled Oh My Pi documentation pages. The `omp://` protocol resolves only **inside an omp session** (open the page with the `read` tool there); this index carries links only — never copied documentation content.

| Page | Topic |
| --- | --- |
| `omp://settings.md` | Settings keys, layers/precedence, defaults, `omp config set` |
| `omp://models.md` | Model roles and providers |
| `omp://keybindings.md` | Keybindings, incl. `app.plan.toggle` plan-mode toggle |
| `omp://task-agent-discovery.md` | Subagent discovery, model roles, plan-mode subagent restrictions |
| `omp://skills.md` | Skill discovery, layout, `skill://` protocol |
| `omp://memory.md` | Memory system overview |
| `omp://tools/learn.md` | `learn` tool contract (subagent lesson capture) |
| `omp://advisor-watchdog.md` | Advisor pairing / watchdog behavior |
| `omp://mcp-config.md` | MCP server configuration |
| `omp://mcp-runtime-lifecycle.md` | MCP runtime lifecycle |
| `omp://agent-hub.md` | Agent hub messaging/jobs |
| `omp://tools/ask.md` | `ask` tool (interactive sessions only; headless subagents cannot ask) |
| `omp://tools/browser.md` | Browser tool |

Project-local layers that compose with these: `.omp/config.yml` (settings + `bash.patterns`), `.omp/agents/*.md` (role definitions), `.agents/skills/` (project skills).
