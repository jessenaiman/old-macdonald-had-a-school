import { expect, test } from "@playwright/test";

const routes = [
  ["home", "/"],
  ["daycare", "/grade/daycare"],
  ["pre-school", "/grade/pre-school"],
  ["kindergarten", "/grade/kindergarten"],
  ["grade-one", "/grade/grade-one"],
  ["grade-two", "/grade/grade-two"],
] as const;

for (const viewport of [
  { name: "desktop", width: 1543, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const) {
  test(`${viewport.name} design review captures every grade family`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const [name, route] of routes) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page).not.toHaveTitle(/Application error|Internal server error/i);

      const overflow = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(overflow.scroll, `${route} overflows horizontally at ${viewport.width}px`).toBeLessThanOrEqual(overflow.client);

      if (name !== "home") {
        await expect(page.locator(`[data-grade-template="${name}"]`).first()).toBeVisible();
      }

      await page.screenshot({
        path: `test-results/design-review/${viewport.name}/${name}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
  });
}
