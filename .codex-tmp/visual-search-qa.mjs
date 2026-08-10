import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") errors.push(`${message.type()}: ${message.text()}`);
});
const routeChecks = {};
for (const route of ["/", "/about", "/search"]) {
  const response = await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
  routeChecks[route] = { status: response?.status(), title: await page.title() };
}
await page.getByLabel("Search curriculum and teaching resources").fill("ponies lap rhymes");
await page.getByRole("button", { name: "Search" }).click();
await page.waitForSelector("ol");
await page.screenshot({ path: "C:/Users/jesse/.codex/visualizations/2026/08/10/019fecc1-d11b-77c3-9e4d-0e2541d7f514/search-ponies-ranked.png", fullPage: true });
const desktop = await page.evaluate(() => ({
  title: document.querySelector("main h2")?.textContent,
  resultCount: document.querySelectorAll("ol > li").length,
  width: document.documentElement.scrollWidth,
  viewport: document.documentElement.clientWidth,
}));
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "C:/Users/jesse/.codex/visualizations/2026/08/10/019fecc1-d11b-77c3-9e4d-0e2541d7f514/search-ponies-mobile.png", fullPage: true });
const mobile = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
console.log(JSON.stringify({ routeChecks, desktop, mobile, errors }, null, 2));
await browser.close();
