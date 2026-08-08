import { expect, test } from "@playwright/test";

const lessonRoute = "/grade/grade-one/properties-of-operations";
const gradeLessons = [
  ["daycare", "/grade/daycare/clap-your-hands", "Daycare lesson sections"],
  ["pre-school", "/grade/pre-school/clap-your-hands-2", "Pre-School lesson sections"],
  ["kindergarten", "/grade/kindergarten/barnyard-count-along", "Kindergarten lesson sections"],
  ["grade-one", lessonRoute, "Grade 1 lesson sections"],
  ["grade-two", "/grade/grade-two/distinguish-long-and-short-vowels-when-reading-one-syllable-words-review-apply-a-u", "Grade 2 lesson sections"],
] as const;

test("desktop navigation uses locked grade patches and the grade lesson uses its workroom", async ({ page }) => {
  await page.setViewportSize({ width: 1543, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const desktopNav = page.locator(".site-nav-desktop");
  await expect(desktopNav.locator(".site-nav-grade")).toHaveCount(5);
  await expect(desktopNav.locator(".site-nav-patch-base")).toHaveCount(5);
  await expect(desktopNav.locator(".site-nav-patch-person")).toHaveCount(5);
  await expect(desktopNav.getByRole("link", { name: "About", exact: true })).toBeVisible();
  await expect(desktopNav.getByRole("link", { name: "Cast Guide", exact: true })).toHaveCount(0);
  await expect(page.locator(".grade-ribbon")).toHaveCount(0);
  await expect(page.locator(".subject-bulletin")).toBeVisible();
  await expect(page.locator(".subject-bulletin .subject-fastener")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Language & Communication" })).toBeInViewport({ ratio: 0.15 });
  for (const patch of await desktopNav.locator(".site-nav-grade").all()) {
    const box = await patch.boundingBox();
    expect(box?.width).toBeGreaterThan(85);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(await patch.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain("felt-");
  }
  await page.screenshot({ path: "test-results/design-fixes/desktop-home-navigation-board.png", fullPage: true });

  await page.goto(lessonRoute, { waitUntil: "networkidle" });
  await expect(page.locator('[data-grade-template="grade-one"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Apply properties of operations");
  await expect(page.getByRole("complementary", { name: "Grade 1 lesson sections" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Print lesson" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open teaching resource" })).toHaveAttribute("href", /^https:\/\//);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: "test-results/design-fixes/desktop-grade-one-lesson.png", fullPage: true });

  await desktopNav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await page.screenshot({ path: "test-results/design-fixes/desktop-about.png", fullPage: true });
});

test("mobile menu, theme, lesson anchors, and About navigation work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(lessonRoute, { waitUntil: "networkidle" });

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Apply properties of operations");
  await page.screenshot({ path: "test-results/design-fixes/mobile-grade-one-lesson.png", fullPage: true });

  await page.getByRole("link", { name: "Teacher notes" }).click();
  await expect(page).toHaveURL(/#lesson-notes$/);
  await expect(page.getByRole("region", { name: "Teacher planning notes" })).toBeVisible();

  const themeButton = page.locator(".site-mobile-actions .theme-button");
  const initialThemeImage = await themeButton.locator("img").getAttribute("src");
  await themeButton.click();
  await expect.poll(() => themeButton.locator("img").getAttribute("src")).not.toBe(initialThemeImage);

  await page.getByRole("button", { name: "Menu" }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.locator(".site-nav-patch-base")).toHaveCount(5);
  await expect(mobileNav.locator(".site-nav-patch-person")).toHaveCount(5);
  await page.screenshot({ path: "test-results/design-fixes/mobile-menu.png" });

  await mobileNav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(mobileNav).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: "test-results/design-fixes/mobile-about.png", fullPage: true });

  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".grade-ribbon")).toHaveCount(0);
  await expect(page.locator(".subject-bulletin .subject-fastener")).toHaveCount(4);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: "test-results/design-fixes/mobile-home-navigation-board.png", fullPage: true });
});

test("every grade lesson renders its own workroom identity", async ({ page }) => {
  const railColours = new Set<string>();
  for (const [grade, route, railName] of gradeLessons) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator(`[data-grade-template="${grade}"]`)).toBeVisible();
    const rail = page.getByRole("complementary", { name: railName });
    await expect(rail).toBeVisible();
    railColours.add(await rail.evaluate((element) => getComputedStyle(element).backgroundColor));
  }
  expect(railColours.size).toBe(gradeLessons.length);
});

test("Cast Guide uses the approved staff artwork without broken images", async ({ page }) => {
  await page.goto("/cast", { waitUntil: "networkidle" });

  const castImages = page.locator(".cast-page img");
  await expect(castImages).toHaveCount(17);

  for (const image of await castImages.all()) {
    await expect(image).toHaveAttribute("src", /icons%2Fstaff|icons\/staff/);
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});
