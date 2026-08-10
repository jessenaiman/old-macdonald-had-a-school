import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/visual",
  testMatch: "**/*.visual.spec.ts",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  outputDir: "./test-results/visual",
  reporter: [["list"], ["html", { open: "never", outputFolder: "./playwright-report/visual" }]],
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
  snapshotDir: "./tests/visual/__screenshots__",
  snapshotPathTemplate: "{snapshotDir}/{testFilePath}/{projectName}/{arg}{ext}",
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
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
