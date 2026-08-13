import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const output = path.resolve("public/branding/grade-workspace-reference-v1");
const raw = path.resolve("qa/grade-workspace-reference-v1");
const views = [["desktop", 1440, 900], ["tablet", 768, 1024], ["mobile", 390, 844], ["small-mobile", 320, 844]];
const screens = ["landing", "curriculum", "lesson", "search-results"];
await fs.mkdir(output, { recursive: true });
await fs.mkdir(raw, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });

try {
  for (const screen of screens) {
    const captures = [];
    for (const [label, width, height] of views) {
      const page = await browser.newPage({ viewport: { width, height } });
      const lessonUrl = "/grade/grade-two/distinguish-long-and-short-vowels-when-reading-one-syllable-words-review-apply-a-u";
      await page.goto(`http://localhost:3000${screen === "lesson" ? lessonUrl : "/grade/grade-two"}`, { waitUntil: "networkidle" });
      if (screen === "curriculum") await page.getByRole("tab", { name: "Curriculum" }).click();
      if (screen === "search-results") {
        await page.getByRole("tab", { name: "Search" }).click();
        await page.getByLabel("Search Grade 2").fill("vowels");
        await page.getByRole("button", { name: "Search", exact: true }).click();
        await page.waitForFunction(() => !document.querySelector('[role="status"]')?.textContent?.includes("Searching"), null, { timeout: 60000 });
      }
      const file = path.join(raw, `${screen}-${label}.png`);
      await page.screenshot({ path: file });
      captures.push({ label, width, height, file });
      await page.close();
    }
    const canvasWidth = 2400;
    const canvasHeight = 1600;
    const cellWidth = 1160;
    const cellHeight = 720;
    const composites = [];
    for (let index = 0; index < captures.length; index++) {
      const capture = captures[index];
      const image = await sharp(capture.file).resize(cellWidth, cellHeight - 42, { fit: "contain", background: "#f4ead7" }).png().toBuffer();
      const x = 40 + (index % 2) * 1200;
      const y = 70 + Math.floor(index / 2) * 760;
      composites.push({ input: image, left: x, top: y + 42 });
      composites.push({ input: Buffer.from(`<svg width="${cellWidth}" height="42"><text x="0" y="28" font-family="Arial" font-size="24" font-weight="700" fill="#142d42">${capture.label} · ${capture.width}×${capture.height}</text></svg>`), left: x, top: y });
    }
    await sharp({ create: { width: canvasWidth, height: canvasHeight, channels: 4, background: "#f4ead7" } }).composite(composites).png().toFile(path.join(output, `${screen}-responsive-reference.png`));
  }
} finally { await browser.close(); }
