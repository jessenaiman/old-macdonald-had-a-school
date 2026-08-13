import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const routes = ["daycare", "pre-school", "kindergarten", "grade-one", "grade-two"];
const views = [["desktop", 1440, 900], ["mobile", 390, 844], ["small-mobile", 320, 844]];
const output = path.resolve("qa/grade-route-verification/2026-08-13");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const results = [];

try {
  for (const route of routes) for (const [view, width, height] of views) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`http://localhost:3000/grade/${route}`, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => {
      const shell = document.querySelector(".grade-route-layout");
      const board = document.querySelector('[data-style-scope="grade-interaction-lane"]');
      const footer = document.querySelector("footer");
      const boardRect = board?.getBoundingClientRect();
      const shellRect = shell?.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        shellHeight: Math.round(shellRect?.height ?? 0),
        boardHeight: Math.round(boardRect?.height ?? 0),
        unusedShellSpace: Math.round((shellRect?.height ?? 0) - (boardRect?.height ?? 0)),
        boardBottom: Math.round(boardRect?.bottom ?? 0),
        footerTop: Math.round(footer?.getBoundingClientRect().top ?? 0),
      };
    });
    results.push({ route, view, width, height, ...result });
    await page.screenshot({ path: path.join(output, `${route}-${view}.png`), fullPage: true });
    await page.close();
  }
} finally { await browser.close(); }

await fs.writeFile(path.join(output, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
