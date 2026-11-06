import fs from "node:fs";
import path from "node:path";

/**
 * Single source of truth for identity, positioning, links and headline proof points.
 * Every page reads from here, so a title or link change only happens once.
 */
export const profile = {
  name: "Ali Zarreh",
  fullName: "Ali (AliReza) Zarreh, Ph.D.",
  alternateNames: ["AliReza Zarreh", "Alireza Zarreh", "Ali R. Zarreh", "Dr. Ali Zarreh"],
  credentials: "Ph.D.",
  role: "AI Solution Architect & Senior Data Scientist",
  roles: ["AI Engineer", "AI Solution Architect", "Data Scientist"],
  positioning: "Trustworthy AI, built hands-on with the teams who use it.",
  headline: "Hands-on AI leadership, from problem to production.",
  intro:
    "I'm Ali Zarreh, Ph.D. — a hands-on AI engineer and solution architect with 18 years across engineering, data science and AI. I work forward-deployed with customer teams to design, build and ship solutions in any industry, from framing the problem to writing the production code.",
  availability: "Open to consulting, advisory roles and select projects.",
  location: "San Antonio, Texas",
  email: "ali@zarreh.ai",
  siteUrl: "https://zarreh.ai",
  links: {
    linkedin: "https://www.linkedin.com/in/ali-zarreh",
    github: "https://github.com/zarreh",
    scholar: "https://scholar.google.com/citations?hl=en&user=BOhaCCAAAAAJ",
    researchgate: "https://www.researchgate.net/profile/Alireza-Zarreh",
    medium: "https://medium.com/@ali.zarreh",
  },
} as const;

export type SocialKey = keyof typeof profile.links;

export const socialLabels: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  scholar: "Google Scholar",
  researchgate: "ResearchGate",
  medium: "Medium",
};

/** Headline proof points. Each one is sourced from the résumé dated 2026-10-23. */
export const proofPoints = [
  {
    value: "~50%",
    label: "lower forecast error",
    context: "Retail demand forecasting platform, ~350 stores, vs. the legacy model",
  },
  {
    value: "+11%",
    label: "markdown revenue",
    context: "Markdown optimization, most recent benchmark",
  },
  {
    value: "99.76%",
    label: "high-confidence coding",
    context: "51,518 card transactions classified by an agentic workflow on regulated PII",
  },
  {
    value: "−90%",
    label: "compute cost",
    context: "Assortment space optimization rebuild (runtime 9 h → 75 min)",
  },
] as const;

export const credibility = [
  { value: "18", label: "years in engineering, data science & AI" },
  { value: "7", label: "live AI applications you can try" },
  { value: "250+", label: "students taught · 4.92 / 5 rating" },
  { value: "Ph.D.", label: "research-driven engineering" },
] as const;

export const affiliations = [
  "H-E-B",
  "Johns Hopkins University programs",
  "UT Austin programs",
  "Syne Life",
  "UTSA",
] as const;

const RESUME_PUBLIC_PATH = "/resume/Ali-Zarreh-Resume.pdf";

/**
 * The résumé PDF is optional. Drop a phone-number-free version at
 * public/resume/Ali-Zarreh-Resume.pdf to enable the download; otherwise links fall back to LinkedIn.
 */
export function resumeLink(): { href: string; download: boolean; label: string } {
  const file = path.join(process.cwd(), "public", RESUME_PUBLIC_PATH);
  if (fs.existsSync(file)) {
    return { href: RESUME_PUBLIC_PATH, download: true, label: "Download résumé (PDF)" };
  }
  return { href: profile.links.linkedin, download: false, label: "Full history on LinkedIn" };
}

export const env = {
  gaId: (import.meta.env.PUBLIC_GA_ID as string | undefined) || "G-5GB5WB919N",
  bookingUrl: (import.meta.env.PUBLIC_BOOKING_URL as string | undefined) || "",
  web3formsKey: (import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined) || "",
  askApiUrl: (import.meta.env.PUBLIC_ASK_API_URL as string | undefined) || "",
};
