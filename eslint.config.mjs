
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".codex-tmp/**",
    ".agents/**",
    ".dsh-study/**",
    ".figma/**",
    ".github/skills/**",
    ".tmp-clean-room/**",
    ".worktrees/**",
    "assets/**",
    "coding-standards/**",
    "data/**",
    "design-proof/**",
    "docs/**",
    "dogfood-output/**",
    "out/**",
    "build/**",
    "figma-copy-design/**",
    "obsidian-project-management/**",
    "output/**",
    "playwright-report/**",
    "public/**",
    "qa/**",
    "scripts/**",
    "skills/**",
    "test-results/**",
    "texture-assets/**",
    "vite.config.ts",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
