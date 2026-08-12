import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "narrow", width: 480, height: 900 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 760 },
]) {
  test(`Pre-School teacher prompt persists across grade tabs on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/grade/pre-school");

    const quote = page.getByRole("complementary", { name: "A note from Miss Maisy" });
    await expect(quote).toContainText("What can they choose, try, and tell us about?");

    const portrait = quote.locator("img");
    const [quoteBox, portraitBox] = await Promise.all([quote.boundingBox(), portrait.boundingBox()]);
    expect(quoteBox).not.toBeNull();
    expect(portraitBox).not.toBeNull();
    expect(portraitBox!.y).toBeGreaterThanOrEqual(quoteBox!.y - 1);
    expect(portraitBox!.y + portraitBox!.height).toBeLessThanOrEqual(quoteBox!.y + quoteBox!.height + 1);

    const widths: number[] = [];
    for (const label of ["Today", "Curriculum", "Planner", "Resources"]) {
      await page.getByRole("tab", { name: new RegExp(label) }).click();
      await expect(quote).toBeVisible();
      widths.push(await page.locator("main").last().evaluate((element) => Math.round(element.getBoundingClientRect().width)));
    }

    expect(new Set(widths).size).toBe(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.locator("header.site-header")).toHaveCount(1);
    await expect(page.locator("footer.site-footer")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Search lessons" })).toHaveCount(2);
    const footerBackground = await page.locator("footer.site-footer").evaluate((element) => getComputedStyle(element).backgroundImage);
    expect(footerBackground).toContain("03-mr-rusty-leather-tile-v01.png");
    await expect(page.locator(".site-footer-fastener img").first()).toHaveAttribute("src", /17-brass-rivet-top-v01/);
    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
    await page.screenshot({ path: `qa/grade-persistent-quote-${viewport.name}.png`, fullPage: true });
  });
}
