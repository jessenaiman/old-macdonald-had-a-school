import { expect, test } from "@playwright/test";

test.describe("database-backed curriculum search", () => {
  test("API and visible search results agree for a curriculum query", async ({ page, request }) => {
    const response = await request.get("/api/search?q=weather%20seasons");
    expect(response.ok()).toBeTruthy();

    const payload = await response.json() as {
      database?: string;
      searchMode?: string;
      curriculum?: Array<{ lesson_topic: string; subject: string }>;
      results?: Array<{ title: string }>;
    };

    expect(payload.database).toBe("omhas.db");
    expect(payload.searchMode).toMatch(/^(structured-keyword|hybrid-keyword-semantic)$/);
    expect(payload.curriculum?.length).toBeGreaterThan(0);
    expect(payload.curriculum?.some((topic) => /season|weather/i.test(`${topic.lesson_topic} ${topic.subject}`))).toBeTruthy();
    expect(payload.results?.length).toBeGreaterThan(0);

    await page.goto("/search?q=weather%20seasons", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Curriculum workroom" })).toBeVisible();
    await expect(page.getByText(/curriculum database connected/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Seasons & weather observation/i })).toBeVisible();
    await expect(page.getByText(/related resources/i).first()).toBeVisible();

    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(overflow.document).toBeLessThanOrEqual(overflow.viewport);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText(/curriculum database connected/i)).toBeVisible();
    const mobileOverflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(mobileOverflow.document).toBeLessThanOrEqual(mobileOverflow.viewport);
  });
});
