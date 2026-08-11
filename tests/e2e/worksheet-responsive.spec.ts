import { expect, test } from "@playwright/test";

const route = "/grade/pre-school/worksheet-example";
const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`worksheet is usable at ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "A Barn Band Day" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Teaching workflow" })).toBeVisible();
    await expect(page.getByText("Prepare the invitation", { exact: true })).toBeVisible();
    await expect(page.getByText("Curriculum alignment & source notes", { exact: true })).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")),
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    expect(dimensions.overlay).toBe(false);
    expect(consoleErrors).toEqual([]);

    await page.screenshot({
      path: `qa/worksheet-${viewport.name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}
