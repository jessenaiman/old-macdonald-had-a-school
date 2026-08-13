import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const version = process.argv[2] ?? "2026-08-13-v1";
const baseUrl = process.env.BRAND_REFERENCE_URL ?? "http://localhost:3000";
const candidateDir = path.resolve("docs/design-references/candidates/branding-overview", version);
const qaDir = path.resolve("qa/design-reference-generation/branding-overview", version);

const views = [
  { key: "desktop", label: "Desktop", width: 1440, height: 1000 },
  { key: "tablet", label: "Tablet", width: 768, height: 1024 },
  { key: "mobile-390", label: "Mobile", width: 390, height: 844 },
  { key: "mobile-320", label: "Small mobile", width: 320, height: 844 },
];

await fs.mkdir(candidateDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
try {
  for (const view of views) {
    const page = await browser.newPage({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: 1 });
    await page.goto(`${baseUrl}/branding`, { waitUntil: "networkidle" });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    const header = page.locator("main header").first();
    await header.waitFor({ state: "visible" });
    await page.screenshot({ path: path.join(qaDir, `${view.key}.png`), fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
}

const canvas = { width: 2400, height: 1600 };
const panelW = 1130;
const panelH = 650;
const positions = [[50, 210], [1220, 210], [50, 900], [1220, 900]];
const composites = [];

for (let i = 0; i < views.length; i += 1) {
  const view = views[i];
  const [left, top] = positions[i];
  const capture = path.join(qaDir, `${view.key}.png`);
  const resized = await sharp(capture)
    .resize({ width: panelW - 36, height: panelH - 105, fit: "contain", background: "#ede6d8" })
    .extend({ top: 0, bottom: 0, left: 0, right: 0, background: "#ede6d8" })
    .png()
    .toBuffer();
  const meta = await sharp(resized).metadata();
  composites.push({ input: resized, left: left + Math.round((panelW - meta.width) / 2), top: top + 82 });
}

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const labels = views.map((view, i) => {
  const [left, top] = positions[i];
  return `<rect x="${left}" y="${top}" width="${panelW}" height="${panelH}" rx="18" fill="#ede6d8" stroke="#8c7654" stroke-width="2"/>
  <text x="${left + 24}" y="${top + 34}" class="panel">${esc(view.label)} · ${view.width} × ${view.height}</text>
  <text x="${left + 24}" y="${top + 61}" class="meta">Light theme · default state · /branding overview</text>`;
}).join("\n");

const overlay = Buffer.from(`<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title{font:700 42px Arial,sans-serif;fill:#f8f2e7}.subtitle{font:20px Arial,sans-serif;fill:#d9cdbb}
    .panel{font:700 22px Arial,sans-serif;fill:#362d22}.meta{font:16px Arial,sans-serif;fill:#665744}
    .footer{font:16px Arial,sans-serif;fill:#d9cdbb}.stamp{font:700 15px Arial,sans-serif;fill:#18281f}
  </style>
  <rect width="2400" height="1600" fill="#20382b"/>
  <text x="50" y="68" class="title">Branding overview · responsive hard-copy reference</text>
  <text x="50" y="106" class="subtitle">One candidate component composition at four controlling viewports</text>
  <rect x="2054" y="42" width="296" height="58" rx="10" fill="#d9ad3d"/>
  <text x="2202" y="67" text-anchor="middle" class="stamp">REVIEW CANDIDATE</text>
  <text x="2202" y="88" text-anchor="middle" class="stamp">${esc(version)}</text>
  ${labels}
  <text x="50" y="1580" class="footer">Source: components/brand/BrandingOverview.tsx · route: /branding · capture date: 2026-08-13 · regenerated QA is not approval</text>
</svg>`);

const sheetPath = path.join(candidateDir, "branding-overview-responsive-reference.png");
await sharp({ create: { width: canvas.width, height: canvas.height, channels: 4, background: "#20382b" } })
  .composite([{ input: overlay, left: 0, top: 0 }, ...composites])
  .png({ compressionLevel: 9 })
  .toFile(sheetPath);

await fs.writeFile(path.join(candidateDir, "reference.json"), JSON.stringify({
  status: "review-candidate",
  immutableVersion: version,
  component: "BrandingOverview",
  source: "components/brand/BrandingOverview.tsx",
  route: "/branding",
  theme: "light",
  state: "default",
  capturedAt: "2026-08-13",
  viewports: views.map(({ label, width, height }) => ({ label, width, height })),
  qaCaptures: path.relative(process.cwd(), qaDir).replaceAll("\\", "/"),
}, null, 2) + "\n");

console.log(sheetPath);
