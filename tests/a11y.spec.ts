import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/work/",
  "/work/clinical-care-navigator/",
  "/work/enterprise/retail-demand-forecasting/",
  "/experience/",
  "/advisory/",
  "/students/",
  "/students/login/",
  "/contact/",
  "/writing/",
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`accessibility (${theme})`, () => {
    for (const path of pages) {
      test(`${path} has no serious axe violations`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const serious = results.violations.filter((v) =>
          ["serious", "critical"].includes(v.impact ?? ""),
        );
        expect(
          serious.map(
            (v) =>
              `${v.id}: ${v.nodes
                .map((n) => n.target.join(" "))
                .slice(0, 3)
                .join(", ")}`,
          ),
        ).toEqual([]);
      });
    }
  });
}
