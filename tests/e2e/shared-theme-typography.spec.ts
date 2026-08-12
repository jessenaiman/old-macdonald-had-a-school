import { expect, test } from "@playwright/test";

const routes = [
  ["home", "/"],
  ["kindergarten", "/grade/kindergarten"],
  ["pre-school", "/grade/pre-school"],
  ["about", "/about"],
  ["branding", "/branding"],
] as const;

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
] as const;

for (const [viewportName, viewport] of viewports) {
  for (const theme of ["light", "dark"] as const) {
    test.describe(`${viewportName} ${theme}`, () => {
      test.use({ viewport });

      for (const [routeName, route] of routes) {
        test(`${routeName} keeps readable shared type and layout`, async ({ page }) => {
          await page.addInitScript((selectedTheme) => {
            window.localStorage.setItem("theme", selectedTheme);
          }, theme);
          await page.goto(route);
          await expect(page.locator("html")).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`));
          await expect(page.locator(".site-footer")).toBeVisible();

          const measurements = await page.evaluate(() => {
            const footerLink = document.querySelector<HTMLElement>(".site-footer-nav a");
            const footerHeading = document.querySelector<HTMLElement>(".site-footer-nav strong");
            return {
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
              footerLinkSize: footerLink ? Number.parseFloat(getComputedStyle(footerLink).fontSize) : 0,
              footerHeadingSize: footerHeading ? Number.parseFloat(getComputedStyle(footerHeading).fontSize) : 0,
              overlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")),
            };
          });

          expect(measurements.overflow).toBeLessThanOrEqual(1);
          expect(measurements.footerLinkSize).toBeGreaterThanOrEqual(14);
          expect(measurements.footerHeadingSize).toBeGreaterThanOrEqual(18);
          expect(measurements.overlay).toBe(false);

          if (routeName === "kindergarten") {
            const gradeHeading = page.locator('[data-grade-template="kindergarten"] h1').first();
            await expect(gradeHeading).toBeVisible();
            await expect(gradeHeading).toHaveCSS("color", "rgb(23, 53, 82)");
          }

          await page.screenshot({
            path: `qa/theme-${routeName}-${viewportName}-${theme}.png`,
            fullPage: routeName === "kindergarten" || routeName === "pre-school",
          });
        });
      }
    });
  }
}
