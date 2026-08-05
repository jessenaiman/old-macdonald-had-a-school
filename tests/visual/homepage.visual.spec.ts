import { expect, test, type Page } from "@playwright/test";

type RuntimeErrors = {
  console: string[];
  page: string[];
};

function watchRuntimeErrors(page: Page): RuntimeErrors {
  const errors: RuntimeErrors = { console: [], page: [] };

  page.on("console", (message) => {
    if (message.type() === "error") errors.console.push(message.text());
  });
  page.on("pageerror", (error) => {
    errors.page.push(error.message);
  });

  return errors;
}

async function openHomepage(page: Page) {
  const errors = watchRuntimeErrors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle(/Teacher Resources/i);
  await expect(
    page.getByRole("heading", { name: /A better place to begin tomorrow’s lesson/i }),
  ).toBeVisible();

  return errors;
}

function expectNoRuntimeErrors(errors: RuntimeErrors) {
  expect(errors.console, "Unexpected browser console errors").toEqual([]);
  expect(errors.page, "Unexpected browser page errors").toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test.describe("homepage visual QA", () => {
  test("matches the approved viewport baseline", async ({ page }, testInfo) => {
    const errors = await openHomepage(page);
    await expect(page).toHaveScreenshot(
      testInfo.project.name === "mobile" ? "homepage-mobile.png" : "homepage-desktop.png",
    );
    expectNoRuntimeErrors(errors);
  });

  test("has no horizontal overflow", async ({ page }) => {
    const errors = await openHomepage(page);
    await expectNoHorizontalOverflow(page);
    expectNoRuntimeErrors(errors);
  });

  test("has no unexpected browser console or page errors", async ({ page }) => {
    const errors = await openHomepage(page);
    expectNoRuntimeErrors(errors);
  });

  test("keeps the protected bottom feature and footer present", async ({ page }) => {
    const errors = await openHomepage(page);
    await expect(page.getByRole("heading", { name: "A Barn Band Day", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Footer", exact: true })).toBeVisible();
    expectNoRuntimeErrors(errors);
  });
});
