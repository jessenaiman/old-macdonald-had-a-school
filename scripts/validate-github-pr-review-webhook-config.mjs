import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const configPath = fileURLToPath(
  new URL(
    "../.github/hermes/github-pr-review-webhook.example.yaml",
    import.meta.url
  )
);
const config = await readFile(configPath, "utf8");

const requiredSnippets = [
  "platforms:",
  "webhook:",
  "enabled: true",
  "github-pr-review:",
  "- pull_request",
  "- opened",
  "- synchronize",
  "- reopened",
  "gh pr diff {number} --repo {repository.full_name}",
  "- terminal",
  "- web",
  "- github-pr-review",
  "deliver: github_comment",
  'repo: "{repository.full_name}"',
  'pr_number: "{number}"',
];

const missing = requiredSnippets.filter((snippet) => !config.includes(snippet));
if (missing.length > 0) {
  throw new Error(
    `Missing required route configuration: ${missing.join(", ")}`
  );
}

if (/^\s*secret\s*:/m.test(config) || /INSECURE_NO_AUTH/.test(config)) {
  throw new Error(
    "The repository template must not contain a webhook secret or disable HMAC validation."
  );
}

if (!config.includes("WEBHOOK_SECRET")) {
  throw new Error(
    "The template must document its global WEBHOOK_SECRET dependency."
  );
}

console.log("GitHub PR review webhook template validation passed.");
