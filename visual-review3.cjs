const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-desktop-new.png', fullPage: true });
  console.log('Desktop screenshot saved');
  
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await tabletPage.waitForTimeout(1000);
  await tabletPage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-tablet-new.png', fullPage: true });
  console.log('Tablet screenshot saved');
  
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-mobile-new.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  await browser.close();
})();
