import { expect, test } from "@playwright/test";
import { legacyRedirects } from "../src/data/redirects";

const pages = [
  "/",
  "/work/",
  "/work/credit-decisioning/",
  "/experience/",
  "/advisory/",
  "/work-with-me/",
  "/speaking/",
  "/writing/",
  "/research/",
  "/about/",
  "/contact/",
];

test.describe("pages", () => {
  for (const path of pages) {
    test(`${path} renders without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        /^https:\/\/zarreh\.ai\//,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\.png$/);
      expect(errors).toEqual([]);
    });
  }

  test("404 page is served for unknown paths", async ({ page }) => {
    const response = await page.goto("/this-does-not-exist/");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("didn't make it");
  });
});

test.describe("navigation & theme", () => {
  test("primary navigation reaches every section", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const nav = page.getByRole("navigation", { name: isMobile ? "Mobile" : "Primary" });
    await nav.getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/\/experience\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("theme toggle persists across pages", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByRole("button", { name: "Switch color theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.goto("/about/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("work library", () => {
  test("filters narrow the case studies and sync to the URL", async ({ page }) => {
    await page.goto("/work/");
    const cards = page.locator("[data-work-card]:visible");
    const total = await cards.count();
    expect(total).toBeGreaterThan(10);
    await page.locator("label.filter-pill", { hasText: "Healthcare" }).click();
    await expect(page).toHaveURL(/domains=healthcare/);
    const healthcare = await cards.count();
    expect(healthcare).toBeGreaterThan(0);
    expect(healthcare).toBeLessThan(total);
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute("data-domains", /healthcare/);
    }
    await page.goto("/work/?status=enterprise");
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute("data-status", "enterprise");
    }
  });
});

test.describe("search", () => {
  test("pagefind returns results", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search the site" }).click();
    const input = page.locator("#pagefind-search input");
    await input.fill("verifier");
    await expect(page.locator(".pagefind-ui__result").first()).toBeVisible();
  });
});

test.describe("contact", () => {
  test("topic is preselected from the query string", async ({ page }) => {
    await page.goto("/contact/?topic=advisory");
    await expect(page.locator("select#topic")).toHaveValue("advisory");
  });
});

test.describe("legacy URLs", () => {
  for (const [legacy, target] of Object.entries(legacyRedirects)) {
    test(`/${legacy}.html → ${target}`, async ({ page }) => {
      await page.goto(`/${legacy}.html`);
      await expect(page).toHaveURL(new RegExp(`${target.replace(/[/#?]/g, (c) => `\\${c}`)}$`));
    });
  }
});

test.describe("machine-readable files", () => {
  for (const path of [
    "/rss.xml",
    "/sitemap-index.xml",
    "/robots.txt",
    "/ask/corpus.json",
    "/og/default.png",
  ]) {
    test(`${path} is served`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
    });
  }

  test("corpus covers every case study", async ({ request }) => {
    const corpus = await (await request.get("/ask/corpus.json")).json();
    const urls = new Set(corpus.chunks.map((c: { url: string }) => c.url));
    expect(urls.has("/work/credit-decisioning/")).toBeTruthy();
    expect(corpus.chunks.length).toBeGreaterThan(50);
  });
});
