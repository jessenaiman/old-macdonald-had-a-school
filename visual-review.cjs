const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-desktop.png', fullPage: true });
  console.log('Desktop screenshot saved');
  
  // Get desktop HTML for analysis
  const desktopHTML = await desktopPage.content();
  fs.writeFileSync('/c/old-macdonald-had-a-school/homepage-desktop.html', desktopHTML);
  
  // Mobile
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-mobile.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  // Tablet
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await tabletPage.waitForTimeout(1000);
  await tabletPage.screenshot({ path: '/c/old-macdonald-had-a-school/homepage-tablet.png', fullPage: true });
  console.log('Tablet screenshot saved');
  
  // Extract computed styles for key elements
  const styles = await desktopPage.evaluate(() => {
    const results = {};
    const selectors = [
      'body', 'header', 'main', 'footer',
      '.working-wall-stage', '.working-wall-shell', '.working-wall-board',
      '.working-wall-patch', '.material-surface', '.brand-patch-card',
      '.grade-surface', '.character-surface', '.cast-old-macdonald',
      '.cast-miss-puddles', '.cast-mr-rusty', '.cast-miss-hayley',
      '.cast-mr-sam', '.cast-mr-maisy', '.cast-mr-puddles',
      'button', '.btn', '[data-slot=button]', 'a', 'h1', 'h2', 'h3',
      '.card', '[data-slot=card]', '.carousel', '[data-slot=carousel]'
    ];
    
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        const cs = window.getComputedStyle(el);
        results[sel] = {
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          borderColor: cs.borderColor,
          padding: cs.padding,
          margin: cs.margin,
          gap: cs.gap,
          display: cs.display,
          gridTemplateColumns: cs.gridTemplateColumns
        };
      }
    });
    
    return results;
  });
  
  fs.writeFileSync('/c/old-macdonald-had-a-school/computed-styles.json', JSON.stringify(styles, null, 2));
  console.log('Computed styles saved');
  
  await browser.close();
})();
