// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

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
    ".figma/**",
    "data/**",
    "docker/**",
    "docs/**",
    "out/**",
    "build/**",
    "figma-copy-design/**",
    "playwright-report/**",
    "public/**",
    "qa/**",
    "scripts/**",
    "storybook-static/**",
    "test-results/**",
    "texture-assets/**",
    "vite.config.ts",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
