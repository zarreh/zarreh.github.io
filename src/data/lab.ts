import type { CapabilityKey, DomainKey } from "./taxonomy";

export interface LabItem {
  title: string;
  summary: string;
  repo: string;
  domains: DomainKey[];
  capabilities: CapabilityKey[];
  note?: string;
}

/** Agents and tools that are built and tested but not publicly deployed yet. */
export const labItems: LabItem[] = [
  {
    title: "zarreh-agentkit",
    summary:
      "The shared library behind the portfolio's agent services: guardrails (injection screen, grounding, budgets, least-privilege projection), observability, per-node cost tracking, rate limiting and an eval CLI. Every abstraction had two real consumers before it became one.",
    repo: "https://github.com/zarreh/zarreh_agentkit",
    domains: ["developer-tools"],
    capabilities: ["agents", "evaluation", "mlops"],
    note: "Shared library",
  },
  {
    title: "LexAgent",
    summary:
      "Grounded rental-law reasoning over Texas and California statutes plus a synthetic precedent corpus. It cites, verifies every citation, and refuses questions outside its scope.",
    repo: "https://github.com/zarreh/lexagent",
    domains: ["legal"],
    capabilities: ["agents", "rag", "evaluation"],
  },
  {
    title: "Secure Service Agent",
    summary:
      "Telecom customer support that assumes the user might be hostile: input and output guardrails, an identity gate, redacted memory and specialist agents under a supervisor that checks grounding and scope.",
    repo: "https://github.com/zarreh/secure_service_agent",
    domains: ["telecom"],
    capabilities: ["agents", "evaluation"],
  },
  {
    title: "Shipment Disruption Router",
    summary:
      "Routes logistics exceptions — re-route, expedite, claim, cancel — with every recommendation traceable to a versioned rulebook, and a human review queue for high-stakes or low-confidence decisions.",
    repo: "https://github.com/zarreh/disruption_router",
    domains: ["retail"],
    capabilities: ["agents", "evaluation"],
  },
  {
    title: "Incident Investigation Copilot",
    summary:
      "An on-call assistant that retrieves logs, runs sandboxed diagnostics and drafts incident reports, with an evidence-and-honesty guardrail on every conclusion.",
    repo: "https://github.com/zarreh/incident_copilot",
    domains: ["operations"],
    capabilities: ["agents", "rag", "evaluation"],
  },
  {
    title: "forge",
    summary:
      "A supervised coding-agent orchestrator: a thin supervisor decomposes a task, delegates to a coder model, and gates each change through checks and review before it is pushed.",
    repo: "https://github.com/zarreh/forge",
    domains: ["developer-tools"],
    capabilities: ["agents"],
  },
];

/** Smaller open-source and competition work, linked straight to GitHub. */
export const otherWork = [
  {
    title: "Rohlik Orders Forecasting Challenge",
    summary:
      "Kaggle solution forecasting grocery delivery orders across Rohlik warehouses in Europe, for workforce and logistics planning.",
    repo: "https://github.com/zarreh/rohlik-orders-forecasting-challenge",
  },
  {
    title: "MMA Fighter Analysis & Ranking",
    summary:
      "Scraping, rating and visualizing MMA fighter performance as a ranking tool for fans and analysts.",
    repo: "https://github.com/zarreh/mma_ranking",
  },
] as const;
