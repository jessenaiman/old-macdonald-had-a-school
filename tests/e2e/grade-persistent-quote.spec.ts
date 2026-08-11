import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`Pre-School teacher prompt persists across grade tabs on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/grade/pre-school");

    const quote = page.getByRole("complementary", { name: "A note from Miss Maisy" });
    await expect(quote).toContainText("What can they choose, try, and tell us about?");

    const widths: number[] = [];
    for (const label of ["Today", "Curriculum", "Planner", "Resources"]) {
      await page.getByRole("tab", { name: new RegExp(label) }).click();
      await expect(quote).toBeVisible();
      widths.push(await page.locator("main").last().evaluate((element) => Math.round(element.getBoundingClientRect().width)));
    }

    expect(new Set(widths).size).toBe(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
    await page.screenshot({ path: `qa/grade-persistent-quote-${viewport.name}.png`, fullPage: true });
  });
}
