const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-desktop-final.png', fullPage: true });
  console.log('Desktop screenshot saved');
  
  // Tablet
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await tabletPage.waitForTimeout(1000);
  await tabletPage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-tablet-final.png', fullPage: true });
  console.log('Tablet screenshot saved');
  
  // Mobile
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-mobile-final.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  await browser.close();
})();
