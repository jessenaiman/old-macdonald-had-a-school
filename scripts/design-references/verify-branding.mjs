import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const output = path.resolve("qa/branding-verification/2026-08-13");
const views = [
  ["wide-desktop", 1900, 1000],
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile-390", 390, 844],
  ["mobile-320", 320, 844],
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const results = [];

try {
  for (const theme of ["light", "dark"]) {
    for (const [name, width, height] of views) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.goto("http://localhost:3000/branding", { waitUntil: "networkidle" });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const result = await page.evaluate(() => {
        const controls = [...document.querySelectorAll("button, a")].filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top < innerHeight;
        });
        return {
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          h1: document.querySelectorAll("h1").length,
          width: document.documentElement.scrollWidth,
          viewport: innerWidth,
          shortControls: controls.filter((node) => node.getBoundingClientRect().height < 44).map((node) => node.textContent?.trim()).slice(0, 10),
          mainUtilization: (() => {
            const main = document.querySelector("main > div");
            return main ? Number((main.getBoundingClientRect().width / innerWidth).toFixed(3)) : null;
          })(),
        };
      });
      results.push({ name, width, height, requestedTheme: theme, ...result });
      await page.screenshot({ path: path.join(output, `${theme}-${name}.png`), fullPage: true });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(output, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
