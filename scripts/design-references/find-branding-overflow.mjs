import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/branding", { waitUntil: "networkidle" });
const nodes = await page.evaluate(() => [...document.querySelectorAll("body *")].map((node) => {
  const rect = node.getBoundingClientRect();
  return { tag: node.tagName, className: String(node.className).slice(0, 160), id: node.id, left: rect.left, right: rect.right, width: rect.width, scrollWidth: node.scrollWidth };
}).filter((item) => item.right > innerWidth + 1 || item.left < -1 || item.scrollWidth > item.width + 1).sort((a, b) => b.right - a.right).slice(0, 30));
console.log(JSON.stringify(nodes, null, 2));
await browser.close();
