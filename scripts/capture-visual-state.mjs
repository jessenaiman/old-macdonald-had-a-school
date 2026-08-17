import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'C:/old-macdonald-had-a-school/qa/hemes-visual-checks/current-state';
const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-375', width: 375, height: 812 },
];

async function snap(page, pageName, label) {
  const file = path.join(OUT, `${pageName}-${label}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`SAVED ${pageName}-${label}.png`);
}

const browser = await chromium.launch({ headless: true });
const pages = [
  { name: 'home', route: '/' },
  { name: 'grade-one', route: '/grade/grade-one' },
];

try {
  await mkdir(OUT, { recursive: true });
  for (const p of pages) {
    for (const v of viewports) {
      const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(`http://localhost:3000${p.route}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(1500);
      await snap(page, p.name, v.name);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log('DONE');