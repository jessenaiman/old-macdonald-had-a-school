import { expect, test, type Page, type TestInfo } from "@playwright/test";

const HOME_ROUTE = "/";
const MUSIC_ROUTE = "/lessons/clap-your-hands";
const VIDEO_ROUTE = "/lessons/properties-of-operations";

const RESPONSIVE_ROUTES = [HOME_ROUTE, VIDEO_ROUTE] as const;
const RESPONSIVE_WIDTHS = [1440, 1024, 768, 390] as const;

function markRoute(testInfo: TestInfo, route: string) {
  testInfo.annotations.push({ type: "route", description: route });
  return route;
}

async function openRoute(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page).not.toHaveTitle(/Application error|Internal server error/i);
}

async function expectNoHorizontalOverflow(page: Page, route: string) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));

  expect(
    dimensions.documentWidth,
    `Route ${route}: document scroll width exceeds the viewport (${dimensions.documentWidth}px > ${dimensions.clientWidth}px)`,
  ).toBeLessThanOrEqual(dimensions.clientWidth);
  expect(
    dimensions.bodyWidth,
    `Route ${route}: body scroll width exceeds the viewport (${dimensions.bodyWidth}px > ${dimensions.clientWidth}px)`,
  ).toBeLessThanOrEqual(dimensions.clientWidth);
}

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) return;

  const route = testInfo.annotations.find((annotation) => annotation.type === "route")?.description;
  const currentRoute = (() => {
    try {
      return new URL(page.url()).pathname || page.url();
    } catch {
      return page.url() || "unknown";
    }
  })();
  const failureRoute = route || currentRoute;
  const message = `[Playwright QA FAILURE] route=${failureRoute} current=${currentRoute} test=${testInfo.title}`;
  console.error(message);
  await testInfo.attach("failure-route", {
    body: Buffer.from(`${message}\n`, "utf8"),
    contentType: "text/plain",
  });
});

test.describe("navigation", () => {
  test("home and lesson index navigation works", async ({ page }, testInfo) => {
    markRoute(testInfo, HOME_ROUTE);
    await openRoute(page, HOME_ROUTE);
    await expect(page.getByRole("heading", { name: /A better place to begin/i })).toBeVisible();

    await page.getByRole("link", { name: "Music lessons", exact: true }).first().click();
    await expect(page).toHaveURL(/\/lessons\/?$/);
    await expect(page.getByRole("heading", { name: "Lessons", exact: true })).toBeVisible();
    await expect(page.getByText("music lesson", { exact: true })).toBeVisible();
    await expect(page.getByText("video lesson", { exact: true }).first()).toBeVisible();

    await page.getByRole("link", { name: "Clap Your Hands", exact: true }).click();
    await expect(page).toHaveURL(/\/lessons\/clap-your-hands\/?$/);
    await expect(page.getByRole("heading", { name: "Clap Your Hands", exact: true })).toBeVisible();
  });
});

test.describe("lesson templates", () => {
  test("music-first lesson presents the song as the core resource", async ({ page }, testInfo) => {
    const route = markRoute(testInfo, MUSIC_ROUTE);
    await openRoute(page, route);

    await expect(page.getByRole("heading", { name: "Clap Your Hands", exact: true })).toBeVisible();
    await expect(page.getByText("Music lesson", { exact: true })).toBeVisible();
    await expect(page.getByText("Core song", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Song", exact: true })).toBeVisible();
    await expect(page.getByLabel("Music lesson supports")).toBeVisible();
  });

  test("video-first lesson exposes its external starting resource", async ({ page }, testInfo) => {
    const route = markRoute(testInfo, VIDEO_ROUTE);
    await openRoute(page, route);

    await expect(page.getByRole("heading", { name: /Apply properties of operations/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Watch", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /sheets to preview & print/i })).toBeVisible();

    const openForClass = page.getByRole("link", { name: /Open for class/i }).first();
    await expect(openForClass).toBeVisible();
    await expect(openForClass).toHaveAttribute("href", /^https?:\/\//);
    await expect(openForClass).toHaveAttribute("target", "_blank");
  });
});

test.describe("teacher preparation controls", () => {
  test("printable preview, open/print, download, and lesson-plan print affordances work", async ({ page }, testInfo) => {
    const route = markRoute(testInfo, VIDEO_ROUTE);
    await openRoute(page, route);

    const previewButton = page.getByRole("button", { name: "Preview Commutative Match Cards", exact: true });
    await expect(previewButton).toBeVisible();
    await previewButton.click();

    const dialog = page.getByRole("dialog", { name: "Preview: Commutative Match Cards", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: /Download/i })).toHaveAttribute("href", /\/scenes\/clap-your-hands\.png$/);
    await expect(dialog.getByRole("link", { name: /Open \/ Print/i })).toHaveAttribute("target", "_blank");
    await expect(dialog.getByRole("link", { name: /Open \/ Print/i })).toHaveAttribute("href", /\/scenes\/clap-your-hands\.png$/);

    await page.getByRole("button", { name: "Close preview", exact: true }).click();
    await expect(dialog).toBeHidden();

    await page.evaluate(() => {
      window.print = () => document.documentElement.setAttribute("data-qa-print-called", "true");
    });
    await page.getByRole("button", { name: /Print lesson plan/i }).click();
    expect(
      await page.evaluate(() => document.documentElement.getAttribute("data-qa-print-called")),
      `Route ${route}: clicking Print lesson plan did not call window.print()`,
    ).toBe("true");
  });

  test("keyboard focus makes an interactive lesson control visibly identifiable", async ({ page }, testInfo) => {
    const route = markRoute(testInfo, VIDEO_ROUTE);
    await openRoute(page, route);

    const printButton = page.getByRole("button", { name: /Print lesson plan/i });
    await printButton.focus();
    await expect(printButton).toBeFocused();

    const focusState = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return null;
      const style = window.getComputedStyle(active);
      return {
        focusVisible: active.matches(":focus-visible"),
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
        outlineColor: style.outlineColor,
      };
    });

    expect(focusState, `Route ${route}: no active element after focusing the print control`).not.toBeNull();
    expect(focusState?.focusVisible, `Route ${route}: print control is not in :focus-visible state`).toBe(true);
    expect(focusState?.outlineWidth, `Route ${route}: print control has no visible focus outline`).not.toBe("0px");
    expect(focusState?.outlineStyle, `Route ${route}: print control has no visible focus outline`).not.toBe("none");
  });
});

test.describe("responsive layout", () => {
  for (const width of RESPONSIVE_WIDTHS) {
    for (const route of RESPONSIVE_ROUTES) {
      test(`${route} has no horizontal overflow at ${width}px`, async ({ page }, testInfo) => {
        markRoute(testInfo, route);
        await page.setViewportSize({ width, height: 900 });
        await openRoute(page, route);
        await expectNoHorizontalOverflow(page, route);
      });
    }
  }
});

test.describe("print media", () => {
  test("print media hides site chrome and exposes the printable lesson plan", async ({ page }, testInfo) => {
    const route = markRoute(testInfo, VIDEO_ROUTE);
    await openRoute(page, route);
    await page.emulateMedia({ media: "print" });

    await expect(page.getByRole("banner")).toBeHidden();
    await expect(page.getByRole("contentinfo")).toBeHidden();
    await expect(page.getByRole("region", { name: "Printable lesson plan" })).toBeVisible();
  });
});
