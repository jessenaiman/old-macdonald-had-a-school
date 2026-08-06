import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const baseUrl = "http://localhost:8443/";
const outputDir = new URL("./", import.meta.url);

const browser = await chromium.launch({ headless: true });

async function capture(viewport, filename, fullPage = false) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator(".band-ribbon").waitFor({ state: "visible" });
  if (!fullPage) {
    await page.locator(".band-ribbon").evaluate((element) => {
      window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY);
    });
  }
  await page.screenshot({ path: fileURLToPath(new URL(filename, outputDir)), fullPage });
  await page.close();
}

async function metrics(viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const result = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom };
    };
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentHeight: document.documentElement.scrollHeight,
      header: rect(".site-header"),
      selectorBand: rect(".band-ribbon"),
      cards: [...document.querySelectorAll(".band-card")].map((card) => ({
        label: card.querySelector("h3")?.textContent?.trim(),
        href: card.getAttribute("href"),
        ...(() => {
          const box = card.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom };
        })(),
      })),
      hero: rect(".home-hero-board"),
      heroImage: rect(".home-hero-image-wrap"),
      browse: rect(".subject-index"),
      barnBand: rect(".feature-resource"),
      footer: rect(".site-footer"),
    };
  });
  await page.close();
  return result;
}

await capture({ width: 1440, height: 584 }, "actual-full-page-desktop.png", true);
await capture({ width: 273, height: 486 }, "actual-full-page-mobile.png", true);

const measurements = {
  desktop: await metrics({ width: 1440, height: 584 }),
  mobile: await metrics({ width: 273, height: 486 }),
};
await writeFile(fileURLToPath(new URL("measurements.json", outputDir)), `${JSON.stringify(measurements, null, 2)}\n`);

await browser.close();
