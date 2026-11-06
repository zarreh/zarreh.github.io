export const domains = {
  finance: "Finance",
  healthcare: "Healthcare",
  insurance: "Insurance",
  retail: "Retail & supply chain",
  legal: "Legal",
  telecom: "Telecom",
  operations: "IT operations",
  careers: "Careers",
  "developer-tools": "Developer tools",
} as const;

export const capabilities = {
  agents: "Agentic AI",
  rag: "RAG & retrieval",
  evaluation: "Evaluation & guardrails",
  fairness: "Fairness & explainability",
  forecasting: "Forecasting",
  optimization: "Optimization",
  ml: "Machine learning",
  mlops: "MLOps & platforms",
} as const;

export const statuses = {
  live: "Live demo",
  "open-source": "Open source",
  enterprise: "Enterprise",
  teaching: "Teaching",
  advisory: "Advisory",
  lab: "In the lab",
} as const;

export type DomainKey = keyof typeof domains;
export type CapabilityKey = keyof typeof capabilities;
export type StatusKey = keyof typeof statuses;

export const domainKeys = Object.keys(domains) as [DomainKey, ...DomainKey[]];
export const capabilityKeys = Object.keys(capabilities) as [CapabilityKey, ...CapabilityKey[]];
export const statusKeys = Object.keys(statuses) as [StatusKey, ...StatusKey[]];
