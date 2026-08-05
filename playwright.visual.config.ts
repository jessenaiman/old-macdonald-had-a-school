import { defineConfig, devices } from "@playwright/test";

/**
 * Visual QA runs against the already-running Next.js dev server.
 * Keep server startup outside this config so reviewers test the exact live
 * checkout at port 8443 and never compare against a different process.
 */
export default defineConfig({
  testDir: "./tests/visual",
  testMatch: "**/*.visual.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: "./test-results/visual",
  reporter: [["list"], ["html", { open: "never", outputFolder: "./playwright-report/visual" }]],
  snapshotDir: "./tests/visual/__screenshots__",
  snapshotPathTemplate: "{snapshotDir}/{testFilePath}/{projectName}/{arg}{ext}",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:8443",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    locale: "en-US",
    timezoneId: "America/Toronto",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      threshold: 0.1,
      maxDiffPixels: 250,
      maxDiffPixelRatio: 0.0005,
    },
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1543, height: 900 },
        deviceScaleFactor: 1,
        isMobile: false,
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
        isMobile: true,
      },
    },
  ],
});
