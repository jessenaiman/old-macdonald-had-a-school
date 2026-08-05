import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const outputDir = new URL("./", import.meta.url);
const browser = await chromium.launch({ headless: true });

async function openPage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:8443/", { waitUntil: "networkidle" });
  await page.locator(".band-ribbon").waitFor({ state: "visible" });
  return page;
}

async function capture(viewport, name, fullPage = false) {
  const page = await openPage(viewport);
  await page.screenshot({ path: fileURLToPath(new URL(name, outputDir)), fullPage });
  await page.close();
}

async function measure(viewport) {
  const page = await openPage(viewport);
  const result = await page.evaluate(() => {
    const box = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentHeight: document.documentElement.scrollHeight,
      header: box(".site-header"),
      selectorBand: box(".band-ribbon"),
      cards: [...document.querySelectorAll(".band-card")].map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          label: card.querySelector("h3")?.textContent?.trim(),
          href: card.getAttribute("href"),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
        };
      }),
      hero: box(".home-hero-board"),
      heroImage: box(".home-hero-image-wrap"),
      browseHeading: box("#discover-title"),
      barnBand: box(".feature-resource"),
      footer: box(".site-footer"),
      subjectIcons: document.querySelectorAll(".subject-icon").length,
      staffRowImages: document.querySelectorAll(".subject-row-icon img").length,
      staffRowImageSources: [...document.querySelectorAll(".subject-row-icon img")].map((image) => image.getAttribute("src")),
    };
  });
  await page.close();
  return result;
}

await capture({ width: 1440, height: 584 }, "actual-page-top-desktop-1440x584.png");
await capture({ width: 273, height: 486 }, "actual-page-top-mobile-273x486.png");
await capture({ width: 1440, height: 584 }, "actual-full-page-desktop.png", true);
await capture({ width: 273, height: 486 }, "actual-full-page-mobile.png", true);

const measurements = {
  desktop: await measure({ width: 1440, height: 584 }),
  mobile: await measure({ width: 273, height: 486 }),
};
await writeFile(fileURLToPath(new URL("measurements.json", outputDir)), `${JSON.stringify(measurements, null, 2)}\n`);

await browser.close();
