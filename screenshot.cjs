const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: '/c/old-macdonald-had-a-school/homepage.png', fullPage: true });
  console.log('Screenshot saved');
  
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  await browser.close();
})();
