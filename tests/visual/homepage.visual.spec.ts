import { expect, test, type Page } from "@playwright/test";

type RuntimeErrors = {
  console: string[];
  page: string[];
};

const APP_READY_TIMEOUT = 10_000;

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
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/Teacher Resources/i);
  const homepageHeading = page.getByRole("heading", {
    name: "A better place to begin tomorrow’s lesson.",
    exact: true,
  });
  await expect(homepageHeading).toBeVisible({ timeout: APP_READY_TIMEOUT });

  await page.waitForFunction(
    () => {
      const fontsReady = document.fonts.status === "loaded";
      const visibleImages = Array.from(document.images).filter((image) => {
        const rect = image.getBoundingClientRect();
        const style = window.getComputedStyle(image);

        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth
        );
      });

      return (
        fontsReady &&
        visibleImages.every((image) => image.complete && image.naturalWidth > 0)
      );
    },
    undefined,
    { timeout: APP_READY_TIMEOUT },
  );

  // Let layout and image decoding settle without depending on background
  // requests made by the Next.js development runtime.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );

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
