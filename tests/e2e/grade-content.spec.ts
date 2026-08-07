import { expect, test } from "@playwright/test";

const gradePages = [
  ["daycare", 6],
  ["pre-school", 5],
  ["kindergarten", 2],
  ["grade-one", 1],
  ["grade-two", 1],
] as const;

const crawlSeeds = ["/", "/lessons", "/topics", "/cast", "/about", ...gradePages.map(([grade]) => `/grade/${grade}`)];

test("every grade landing uses its own template and exposes lesson content", async ({ page }) => {
  for (const [grade, minimumLessonLinks] of gradePages) {
    await page.goto(`/grade/${grade}`, { waitUntil: "networkidle" });
    await expect(page.locator(`[data-grade-template="${grade}"]`).first()).toBeVisible();

    const lessonLinks = await page.locator(`a[href^="/grade/${grade}/"]`).evaluateAll((links) =>
      [...new Set(links.map((link) => (link as HTMLAnchorElement).pathname))],
    );
    expect(lessonLinks.length, `${grade} should expose its lesson pages`).toBeGreaterThanOrEqual(minimumLessonLinks);
  }
});

test("rendered navigation has no dead internal links", async ({ page, request, baseURL }) => {
  const targets = new Set<string>();

  for (const seed of crawlSeeds) {
    await page.goto(seed, { waitUntil: "networkidle" });
    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href),
    );
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin === new URL(baseURL!).origin) targets.add(`${url.pathname}${url.search}`);
    }
  }

  for (const target of targets) {
    const response = await request.get(target);
    expect(response.status(), `${target} returned ${response.status()}`).toBeLessThan(400);
  }
});

test("legacy lesson URLs redirect to canonical grade templates", async ({ page }) => {
  await page.goto("/lessons/properties-of-operations", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/grade\/grade-one\/properties-of-operations\/?$/);
  await expect(page.locator('[data-grade-template="grade-one"]')).toBeVisible();
});
