import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const output = resolve("qa/homepage-runtime-2026-08-11");
const baseUrl = process.env.HOMEPAGE_BASE_URL ?? "http://127.0.0.1:3000";
const viewports = [
  ["desktop-1440x900", 1440, 900],
  ["tablet-768x1024", 768, 1024],
  ["mobile-390x844", 390, 844],
  ["mobile-320x800", 320, 800],
];

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const [name, width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${message.text()} [${message.location().url}]`);
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(750);
  await page.screenshot({ path: resolve(output, `${name}.png`), fullPage: true });

  const snapshot = await page.evaluate(() => ({
    bodyTextLength: document.body.innerText.trim().length,
    documentWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    gradePatches: document.querySelectorAll('[class*="gradePatch"]').length,
    staffFaces: document.querySelectorAll('[class*="gradeStaffPortrait"]').length,
    subjectCards: document.querySelectorAll('[class*="subjectCard"]').length,
    folkCards: document.querySelectorAll('[class*="folkCard"]').length,
    subjectExpanded: document.querySelector('[class*="subjectBoardOpen"]') !== null,
    mobileMediaMatches: window.matchMedia("(max-width: 560px)").matches,
    subjectControlText: document.querySelector('[class*="subjectBoardHeader"] button')?.textContent,
  }));

  if (name.startsWith("mobile-")) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: resolve(output, `${name}-menu-open.png`), fullPage: false });
    snapshot.menuOpen = await page.getByRole("dialog").isVisible();
    snapshot.menuGradeLinks = await page.getByRole("dialog").locator('a[class*="site-nav-grade-"]').count();
    await page.getByRole("button", { name: "Close navigation menu" }).click();
    snapshot.menuClosed = !(await page.getByRole("dialog").isVisible());
  }

  results.push({ name, width, height, errors, ...snapshot });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
