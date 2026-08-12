import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 760 },
]) {
  test(`shared navigation and footer stay composed on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/grade/kindergarten");

    await expect(page.locator("header.site-header")).toHaveCount(1);
    await expect(page.locator("footer.site-footer")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

    const headerStyle = await page.locator("header.site-header").evaluate((element) => {
      const style = getComputedStyle(element);
      return { color: style.backgroundColor, blend: style.backgroundBlendMode };
    });
    expect(headerStyle.color).toBe("rgb(5, 25, 45)");
    expect(headerStyle.blend).toContain("multiply");

    const brand = page.locator(".site-footer-brand");
    const fastener = page.locator(".site-footer-fastener-left");
    const [brandBox, fastenerBox] = await Promise.all([brand.boundingBox(), fastener.boundingBox()]);
    expect(brandBox).not.toBeNull();
    expect(fastenerBox).not.toBeNull();
    const overlaps = !(fastenerBox!.x + fastenerBox!.width <= brandBox!.x || fastenerBox!.x >= brandBox!.x + brandBox!.width || fastenerBox!.y + fastenerBox!.height <= brandBox!.y || fastenerBox!.y >= brandBox!.y + brandBox!.height);
    expect(overlaps).toBe(false);

    if (viewport.width <= 1000) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      const sheetStyle = await sheet.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.backgroundColor, blend: style.backgroundBlendMode };
      });
      expect(sheetStyle.color).toBe("rgb(5, 25, 45)");
      expect(sheetStyle.blend).toContain("multiply");
      const horizontalEscape = await sheet.evaluate((element) => {
        const sheetRect = element.getBoundingClientRect();
        return Array.from(element.querySelectorAll<HTMLElement>("a, button, h2, [data-slot='sheet-header']"))
          .filter((child) => child.getClientRects().length > 0)
          .reduce((escape, child) => {
            const rect = child.getBoundingClientRect();
            return Math.max(escape, sheetRect.left - rect.left, rect.right - sheetRect.right);
          }, 0);
      });
      expect(horizontalEscape).toBeLessThanOrEqual(1);
    }

    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
    await page.screenshot({ path: `qa/shared-chrome-${viewport.name}.png`, fullPage: true });
  });
}
