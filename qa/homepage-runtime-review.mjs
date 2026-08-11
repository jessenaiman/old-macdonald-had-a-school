import { chromium } from "playwright";
import { resolve } from "node:path";

const out = resolve("qa/homepage-design-review-2026-08-10");
const baseUrl = process.env.HOMEPAGE_BASE_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const results = [];
for (const [name, width, height] of [["desktop-1440", 1440, 1066], ["tablet-768", 768, 1100], ["mobile-390", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(out, `${name}.png`), fullPage: true });
  const state = await page.evaluate(() => {
    const subjectGrid = document.querySelector("[class*='subjectGrid']");
    const hero = document.querySelector("[class*='hero']");
    const discovery = document.querySelector("[class*='discovery']");
    const theme = document.querySelector(".theme-switcher");
    return {
      title: document.title,
      bodyLength: document.body.innerText.trim().length,
      overlay: Boolean(document.querySelector("[data-nextjs-dialog]")),
      subjectColumns: subjectGrid ? getComputedStyle(subjectGrid).gridTemplateColumns : null,
      heroColumns: hero ? getComputedStyle(hero).gridTemplateColumns : null,
      discoveryColumns: discovery ? getComputedStyle(discovery).gridTemplateColumns : null,
      themeButtons: document.querySelectorAll(".theme-switcher").length,
      weeklyLists: document.querySelectorAll("[class*='discovery'] [class*='weeklyList']").length,
      subjectCount: document.querySelectorAll("[class*='subjectCard']").length,
      themeSrc: theme?.querySelector("img")?.getAttribute("src") ?? null,
    };
  });
  if (name === "mobile-390") {
    await page.locator(".theme-switcher").click();
    state.themeAfterClick = await page.locator(".theme-switcher img").getAttribute("src");
    await page.locator(".site-mobile-menu-trigger").click();
    state.mobileMenuVisible = await page.locator("#mobile-primary-navigation").isVisible();
    state.earlyYearsGroup = await page.locator(".site-mobile-menu-group").count();
  }
  results.push({ name, errors, ...state });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
