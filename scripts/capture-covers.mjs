// Captures consistent 16:9 cover screenshots of the live demo apps.
// Usage: npm run capture:covers            (all)
//        npm run capture:covers -- rxflow  (one)
import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "src/assets/images/work");

const targets = [
  {
    key: "rxflow",
    url: "https://rxflow.zarreh.ai/",
    file: "rxflow_pharmacy_assistant.png",
    wait: 9000,
  },
  {
    key: "claim",
    url: "https://claim-agent.zarreh.ai/",
    file: "claim_processing_agent.png",
    wait: 9000,
  },
  {
    key: "duallens",
    url: "https://duallens.zarreh.ai/",
    file: "duallens_analytics.png",
    wait: 45000,
  },
  { key: "credit", url: "https://credit.zarreh.ai/", file: "credit_decisioning.png", wait: 4000 },
  { key: "cohort", url: "https://cohort-risk.zarreh.ai/", file: "cohort_risk_lab.png", wait: 4000 },
  {
    key: "clinical",
    url: "https://clinical-care.zarreh.ai/",
    file: "clinical_care_navigator.png",
    wait: 4000,
  },
  {
    key: "surveillance",
    url: "https://surveillance.zarreh.ai/",
    file: "trade_surveillance_agent.png",
    wait: 4000,
  },
];

const only = process.argv.slice(2);
const selected = only.length ? targets.filter((t) => only.includes(t.key)) : targets.slice(0, 3);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 810 },
  deviceScaleFactor: 1,
  colorScheme: "light",
});

for (const target of selected) {
  const page = await context.newPage();
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 60000 });
  } catch {
    // Streamlit keeps a websocket open, so "networkidle" may never fire.
  }
  await page.waitForTimeout(target.wait);
  const file = path.join(outDir, target.file);
  await page.screenshot({ path: file });
  console.log(`captured ${target.key} -> ${path.relative(root, file)}`);
  await page.close();
}

await browser.close();
