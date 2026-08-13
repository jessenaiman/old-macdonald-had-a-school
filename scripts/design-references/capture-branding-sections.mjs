import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const output = path.resolve("qa/branding-verification/2026-08-13/sections");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
try {
  for (const [name, width, height] of [["desktop", 1440, 1000], ["tablet", 768, 1024], ["mobile-390", 390, 844], ["mobile-320", 320, 844]]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.goto("http://localhost:3000/branding", { waitUntil: "networkidle" });
      for (const section of ["palette", "cast", "grades"]) {
        const locator = page.locator(`#${section}`).first();
        await locator.scrollIntoViewIfNeeded();
        await locator.screenshot({ path: path.join(output, `${section}-${theme}-${name}.png`) });
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
