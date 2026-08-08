import { expect, test, type Page } from "@playwright/test";

const coreRoutes = [
  "/",
  "/grade/daycare",
  "/grade/pre-school",
  "/grade/kindergarten",
  "/grade/grade-one",
  "/grade/grade-two",
  "/topics",
  "/grade/grade-one/properties-of-operations",
  "/about",
  "/cast",
] as const;

const gradePages = [
  ["/grade/daycare", "Learning paths for Daycare"],
  ["/grade/pre-school", "Learning paths for Pre-School"],
  ["/grade/kindergarten", "Learning paths for Kindergarten"],
  ["/grade/grade-one", "Learning paths for Grade 1"],
  ["/grade/grade-two", "Learning paths for Grade 2"],
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport);
}

test.describe("teacher resources stay usable across responsive widths", () => {
  for (const width of [320, 390, 768]) {
    test(`core pages do not overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      for (const route of coreRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toBeVisible();
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("homepage presents subject resources in the first phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "Browse by Subject" })).toBeInViewport();
    await expect(page.getByRole("link", { name: /Story Time: Board Books/i })).toBeInViewport();
  });

  for (const [route, heading] of gradePages) {
    test(`${heading} is introduced in the first phone viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route, { waitUntil: "networkidle" });

      await expect(page.getByRole("link", { name: "Browse learning paths" })).toBeInViewport();
      const top = await page.getByRole("heading", { name: heading }).evaluate((element) => element.getBoundingClientRect().top);
      expect(top).toBeLessThan(844);
    });
  }

  test("mobile lesson resources and cast details meet touch target sizing", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/grade/grade-one/properties-of-operations", { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "Open teaching resource" })).toHaveCSS("min-height", "44px");

    await page.goto("/cast", { waitUntil: "networkidle" });
    const details = page.locator(".cast-details summary").first();
    await expect(details).toBeVisible();
    expect((await details.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  });
});
