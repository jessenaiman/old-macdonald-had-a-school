# GitHub pull-request review webhook

This repository includes a reviewed template for Hermes' webhook-based PR
review route at
[`.github/hermes/github-pr-review-webhook.example.yaml`](../../.github/hermes/github-pr-review-webhook.example.yaml).
It implements the Hermes webhook and PR-review-agent guides for this repository
without committing gateway credentials.

## What the route does

- Accepts only GitHub `pull_request` webhook events.
- Starts an agent only for `opened`, `synchronize`, and `reopened` actions.
- Grants only the `terminal` and `web` route toolsets so the agent can run
  `gh pr diff` and fetch the real diff; GitHub's webhook payload does not
  contain code changes.
- Loads the repository's `github-pr-review` review guidance, then posts the
  result to the originating pull request through `gh pr comment`.
- Uses GitHub's HMAC validation through the gateway's global `WEBHOOK_SECRET`.
  The template has no route-level secret, and never uses `INSECURE_NO_AUTH`.

PR titles, descriptions, branch names, commits, and diff content are untrusted.
The template explicitly tells the agent not to follow instructions embedded in
those values. Run the public gateway in a sandboxed environment (for example,
a Docker or VM-backed Hermes terminal) rather than granting an internet-exposed
agent unrestricted access to the gateway host.

## Operator setup (outside this repository)

1. On the dedicated Hermes gateway host, install `gh` and authenticate the
   account that should write PR comments. Confirm it can access this repository:

   ```sh
   gh pr list --repo jessenaiman/old-macdonald-had-a-school --state open --limit 3
   ```

2. Install the review skill for the gateway profile. Copy
   `.github/hermes/skills/github-pr-review` from this repository to
   `$HERMES_HOME/skills/github-pr-review`. The route loads only this one skill.

3. Generate a high-entropy webhook secret outside the repository. Store it only
   in `$HERMES_HOME/.env` on the gateway host:

   ```sh
   WEBHOOK_ENABLED=true
   WEBHOOK_PORT=8644
   WEBHOOK_SECRET=<generated-secret>
   ```

   Keep this value out of Git, PR descriptions, logs, and chat. The route
   inherits the global secret, so do not add `secret:` to the tracked template.

4. Merge the contents of
   `.github/hermes/github-pr-review-webhook.example.yaml` into
   `platforms.webhook` in `$HERMES_HOME/config.yaml`. Use `hermes config set`
   or `hermes config edit`; do not overwrite unrelated gateway configuration.
   Keep port `8644`, or use one chosen consistently for the gateway and
   external proxy.

5. Start or restart the gateway and verify the local endpoint:

   ```sh
   hermes gateway
   curl http://localhost:8644/health
   ```

   The health response must be `{"status":"ok","platform":"webhook"}`.

6. Give the gateway a stable public HTTPS URL (a reverse proxy is preferred;
   `ngrok http 8644` is suitable for a temporary local test). In GitHub at
   **Settings → Webhooks → Add webhook**, configure:

   - Payload URL: `https://<public-host>/webhooks/github-pr-review`
   - Content type: `application/json`
   - Secret: the exact `WEBHOOK_SECRET` value
   - Events: **Pull requests** only

   GitHub's initial `ping` is expected to be ignored because this route accepts
   only `pull_request` events.

7. Open or update a test PR. Inspect both the GitHub webhook's **Recent
   Deliveries** and `$HERMES_HOME/logs/gateway.log`; within 30–90 seconds the
   agent should comment on the PR. A duplicate GitHub delivery is deduplicated
   by Hermes when GitHub supplies `X-GitHub-Delivery`.

## Local verification

Before opening a PR for this setup, run:

```sh
npm run validate:github-pr-review-webhook
npx prettier --check \
  .github/hermes/github-pr-review-webhook.example.yaml \
  .github/hermes/skills/github-pr-review/SKILL.md \
  docs/github-pr-review-webhook.md \
  scripts/validate-github-pr-review-webhook-config.mjs
```

The first check verifies the tracked template has the documented event filter,
least-required route toolsets, dynamic PR destination, diff-fetch instruction,
and no route secret or `INSECURE_NO_AUTH` bypass. The second parses/formats the
YAML and Markdown/JavaScript inputs.

## References

- [Hermes: Automated GitHub PR Comments with Webhooks](https://hermes-agent.nousresearch.com/docs/guides/webhook-github-pr-review)
- [Hermes: Build a GitHub PR Review Agent](https://hermes-agent.nousresearch.com/docs/guides/github-pr-review-agent)
- [Hermes webhook reference](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks)
