import path from 'node:path';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  // Vitest's browser runtime only supplies CommonJS named-export interop after
  // Vite pre-bundles the dependency. These are the CommonJS dependencies that
  // Storybook's generated matcher setup imports in the browser.
  optimizeDeps: {
    include: [
      '@adobe/css-tools',
      'aria-query',
      'css.escape',
      'dom-accessibility-api',
      'lz-string',
      'picocolors',
      'pretty-format',
      'redent',
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
