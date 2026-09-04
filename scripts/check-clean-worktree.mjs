import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

if (
  git("diff", "--name-only", "--ignore-submodules") ||
  git("ls-files", "--others", "--exclude-standard")
) {
  console.error("Commit blocked: use a clean task worktree.");
  process.exit(1);
}
