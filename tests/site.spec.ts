import { expect, test } from "@playwright/test";
import { legacyRedirects } from "../src/data/redirects";

const pages = [
  "/",
  "/work/",
  "/work/credit-decisioning/",
  "/experience/",
  "/advisory/",
  "/students/",
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

test.describe("homepage", () => {
  test("positions hands-on, customer-facing AI work", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AI Engineer & AI Solution Architect/);
    const hero = page.locator("main > section").first();
    for (const text of ["AI Engineer", "AI Solution Architect", "Data Scientist", "18 years"]) {
      await expect(hero).toContainText(text);
    }
    await expect(hero).toContainText("forward-deployed with customer teams");
  });

  test("leads with public evidence, then three engagement paths", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
    expect(ids.indexOf("featured-work")).toBeGreaterThan(-1);
    expect(ids.indexOf("featured-work")).toBeLessThan(ids.indexOf("paths"));
    const paths = page.locator("#paths");
    for (const href of ["/advisory/#projects", "/advisory/#review", "/advisory/#advisory"]) {
      await expect(paths.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
    await expect(page.locator("#beyond")).toContainText("Medical research & applied AI");
  });

  test("keeps employer specifics, hiring copy and writing off the page", async ({ page }) => {
    await page.goto("/");
    const main = page.locator("main");
    await expect(main).not.toContainText(/markdown|~350|\+11%|99\.76%|hiring manager/i);
    await expect(main.locator('[data-work-card][data-status="enterprise"]')).toHaveCount(0);
    await expect(
      main.locator('a[href^="/experience/#"]:not([href="/experience/#teaching"])'),
    ).toHaveCount(0);
    await expect(main.locator('a[href^="/work/enterprise/"]')).toHaveCount(0);
    await expect(page.locator("#writing")).toHaveCount(0);
  });
});

test.describe("writing (hidden until the first article)", () => {
  test("is not linked from the header or footer", async ({ page }) => {
    await page.goto("/about/");
    await expect(page.locator('header a[href="/writing/"]')).toHaveCount(0);
    await expect(page.locator('footer a[href="/writing/"], footer a[href="/rss.xml"]')).toHaveCount(
      0,
    );
  });

  test("/writing/ still renders its empty state", async ({ page }) => {
    const response = await page.goto("/writing/");
    expect(response?.status()).toBe(200);
    await expect(page.getByText("The first essays are on their way.")).toBeVisible();
  });
});

test.describe("advisory & consulting", () => {
  test("covers projects, advisory and FAQ without a press kit", async ({ page }) => {
    await page.goto("/advisory/");
    await expect(page.locator("h1")).toContainText("AI decisions");
    for (const id of ["projects", "review", "advisory", "process", "faq"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.locator("#press-kit")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/press kit|headshot/i);
  });

  test("speaking and work-with-me pages are gone and unlinked", async ({ page, request }) => {
    for (const path of ["/speaking/", "/work-with-me/"]) {
      expect((await request.get(path)).status()).toBe(404);
    }
    for (const path of ["/", "/advisory/", "/experience/", "/about/"]) {
      await page.goto(path);
      await expect(
        page.locator('a[href^="/speaking/"], a[href^="/work-with-me/"], a[href*="press-kit"]'),
      ).toHaveCount(0);
    }
  });

  test("header offers Contact me", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const link = page.locator("header").getByRole("link", { name: "Contact me" }).last();
    await expect(link).toHaveAttribute("href", "/contact/");
  });
});

test.describe("students", () => {
  test("lists programs and links to sign-in", async ({ page }) => {
    await page.goto("/students/");
    await expect(page.locator("#programs article[id]")).toHaveCount(3);
    await expect(page.locator('main a[href="/students/login/"]').first()).toBeVisible();
  });

  test("sign-in is a placeholder that sends nothing", async ({ page }) => {
    const requests: string[] = [];
    await page.goto("/students/login/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    page.on("request", (r) => requests.push(r.url()));
    await page.getByLabel("Email").fill("student@example.com");
    await page.getByLabel("Password").fill("not-a-real-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("[data-login-status]")).toContainText("isn't open yet");
    await expect(page.getByLabel("Password")).toHaveValue("");
    expect(requests).toEqual([]);
  });

  test("experience links each program to its materials", async ({ page }) => {
    await page.goto("/experience/");
    for (const id of ["jhu-agentic-ai", "ut-austin-ai-agents", "jhu-applied-genai"]) {
      await expect(page.locator(`#${id} a[href="/students/#${id}"]`)).toHaveCount(1);
    }
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

const enterpriseIds = [
  "work-order-intelligence",
  "expense-classification",
  "retail-demand-forecasting",
  "markdown-optimization",
  "assortment-space-optimization",
  "efc-forecasting",
  "warehouse-forecasting",
];

test.describe("enterprise project pages", () => {
  for (const id of enterpriseIds) {
    test(`/work/enterprise/${id}/ renders the full project`, async ({ page }) => {
      const response = await page.goto(`/work/enterprise/${id}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const main = page.locator("main");
      await expect(main.getByRole("heading", { name: "The problem" })).toBeVisible();
      await expect(main.getByRole("heading", { name: "What I built and led" })).toBeVisible();
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        new RegExp(`/og/work/enterprise/${id}\\.png$`),
      );
    });
  }

  test("omit projections and the data-quality gap figure", async ({ page }) => {
    for (const id of [
      "work-order-intelligence",
      "assortment-space-optimization",
      "efc-forecasting",
    ]) {
      await page.goto(`/work/enterprise/${id}/`);
      await expect(page.locator("main")).not.toContainText(/projected|54%|planning next/i);
    }
  });
});

test.describe("experience", () => {
  test("shows full H-E-B cards linking to project pages", async ({ page }) => {
    await page.goto("/experience/");
    const cards = page.locator("#heb article[id]");
    await expect(cards).toHaveCount(enterpriseIds.length);
    for (const card of await cards.all()) {
      await expect(card).toContainText("The problem");
      await expect(card).toContainText("What I built and led");
      const id = await card.getAttribute("id");
      await expect(card.locator(`a[href="/work/enterprise/${id}/"]`)).toHaveCount(1);
    }
    await expect(page.locator("#heb")).not.toContainText(/projected|54%/i);
  });

  test("shows program cards with topics and Syne Life link", async ({ page }) => {
    await page.goto("/experience/");
    const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
    expect(ids.indexOf("teaching")).toBe(ids.indexOf("heb") + 1);
    const programs = page.locator("#teaching article[id]");
    await expect(programs).toHaveCount(3);
    await expect(programs.locator("h3")).toHaveText([
      "Certificate Program in Agentic AI",
      "Post Graduate Program in AI Agents for Business Applications",
      "Certificate Program in Applied Generative AI and Agentic AI",
    ]);
    for (const program of await programs.all()) {
      await expect(program).toContainText("Main topics I teach");
      expect(
        await program.locator('ul[aria-label="Skills and techniques"] li').count(),
      ).toBeGreaterThan(4);
      const link = program.locator('a[target="_blank"]');
      await expect(link).toHaveAttribute("href", /^https:\/\/[^#]+$/);
    }
    await expect(page.locator('#syne-life a[href="https://syne.life/"]')).toHaveCount(1);
    await page.goto("/advisory/");
    await expect(page.locator('a[href="https://syne.life/"]')).toHaveCount(1);
  });
});

test.describe("work library", () => {
  test("enterprise tiles link to project pages", async ({ page }) => {
    await page.goto("/work/?status=enterprise");
    const tiles = page.locator("[data-work-card]:visible");
    await expect(tiles).toHaveCount(enterpriseIds.length);
    for (const tile of await tiles.all()) {
      await expect(tile.locator("h2 a")).toHaveAttribute("href", /^\/work\/enterprise\/[a-z-]+\/$/);
    }
  });

  test("teaching tiles show skills and link to official program pages", async ({ page }) => {
    await page.goto("/work/?status=teaching");
    const tiles = page.locator("[data-work-card]:visible");
    await expect(tiles).toHaveCount(3);
    for (const tile of await tiles.all()) {
      await expect(tile.locator("h2 a")).toHaveAttribute("href", /^https:\/\/[^#]+$/);
      expect(await tile.locator('ul[aria-label="Skills taught"] li').count()).toBeGreaterThan(4);
    }
    await page.goto("/work/?status=advisory");
    const advisory = page.locator("[data-work-card]:visible");
    await expect(advisory).toHaveCount(1);
    await expect(advisory.locator("h2 a")).toHaveAttribute("href", "/advisory/");
  });

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
