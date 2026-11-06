/** Copy for Advisory & consulting, teaching (Experience, Students) and bios. */
import type { CapabilityKey } from "./taxonomy";

export const services = [
  {
    id: "assessment",
    title: "AI strategy & readiness assessment",
    lead: "Where should AI actually go in your business — and where should it not?",
    body: "A fixed-scope review of your use cases, data and platform. You get a ranked opportunity portfolio, the risks and governance gaps for each, a build/buy/partner view, and a roadmap your team can execute.",
    deliverables: [
      "Ranked use-case portfolio with value and feasibility",
      "Data, platform and team readiness",
      "Risk, governance and evaluation gaps",
      "Build / buy / partner recommendation and roadmap",
    ],
    format: "Fixed scope",
  },
  {
    id: "agentic",
    title: "Agentic AI: from prototype to production",
    lead: "Turn a promising demo into a system you can operate, audit and afford.",
    body: "Design and build agentic workflows with the parts most pilots skip: evaluation from day one, guardrails in the graph rather than in the prompt, human review where the stakes are high, cost and latency budgets, and observability.",
    deliverables: [
      "Architecture and decision log",
      "Working workflow with evals, guardrails and human review",
      "Cost, latency and quality dashboards",
      "Runbook and hand-over to your team",
    ],
    format: "Build engagement",
  },
  {
    id: "forecasting",
    title: "Forecasting & optimization",
    lead: "Predictions are only useful when they turn into decisions people adopt.",
    body: "Demand, labor, capacity, pricing, markdown and space problems — machine-learning forecasts paired with mathematical optimization, built on the same patterns that run planning across hundreds of stores.",
    deliverables: [
      "Backtested, leakage-audited forecasts",
      "Optimization model with business guardrails",
      "Explainability for planners and merchants",
      "MLOps pipeline on your cloud (GCP, AWS, Databricks)",
    ],
    format: "Build engagement",
  },
  {
    id: "review",
    title: "AI evaluation & guardrails review",
    lead: "An independent look at an LLM or agent system before it — or your customers — find the failure modes.",
    body: "A structured review of an existing system: evaluation design, grounding and citation checks, prompt-injection and data-leak exposure, human-oversight points, monitoring and regulatory exposure. You get prioritized findings and fixes.",
    deliverables: [
      "Failure-mode and risk assessment",
      "Evaluation set and metrics you can keep running",
      "Red-team findings with severity",
      "Prioritized remediation plan",
    ],
    format: "Fixed scope",
  },
  {
    id: "enablement",
    title: "Team enablement & workshops",
    lead: "Hands-on generative and agentic AI for engineers, and clear-eyed briefings for leaders.",
    body: "Workshops shaped by teaching hundreds of practitioners in Johns Hopkins University and UT Austin programs: retrieval, multi-agent systems, MCP, evaluation and guardrails — on your use cases, not toy examples.",
    deliverables: [
      "Workshop tailored to your stack and use cases",
      "Exercises and reference implementations",
      "Executive briefing option",
    ],
    format: "Workshop",
  },
] as const;

export const process = [
  {
    title: "Intro call",
    body: "Thirty minutes to understand the decision you are trying to improve and whether I am the right fit.",
  },
  {
    title: "Scoping note",
    body: "A short written scope: the problem, how success is measured, the risks, and what I need from your team.",
  },
  {
    title: "Build in the open",
    body: "Regular working demos and evaluation results from the first iteration — no big reveal at the end.",
  },
  {
    title: "Hand-over",
    body: "Documentation, runbooks and a trained team, so the system keeps working after the engagement ends.",
  },
] as const;

export const faqs = [
  {
    q: "How do you take on engagements?",
    a: "Selectively. I take a small number of advisory and project engagements that do not conflict with my current role, and I am upfront about capacity from the first conversation.",
  },
  {
    q: "Which industries do you work with?",
    a: "Mostly regulated or high-stakes settings: retail and supply chain, financial services, insurance and healthcare. The common thread is decisions that need to be explainable and auditable.",
  },
  {
    q: "Do you work remotely?",
    a: "Yes. I am based in San Antonio, Texas, and work remotely across US time zones. Workshops and kick-offs can be on-site.",
  },
  {
    q: "Will you sign an NDA?",
    a: "Yes. Anything you share during scoping stays confidential, and I never use client material in public work.",
  },
  {
    q: "What do you need from us?",
    a: "A problem owner, access to the relevant data and people, and an agreed measure of success. Everything else we can work out together.",
  },
] as const;

export const advisoryAreas = [
  {
    title: "AI strategy & roadmap",
    body: "Separate defensible value from demo-ware, and sequence AI investments against the business plan.",
  },
  {
    title: "Architecture & build-vs-buy",
    body: "Pressure-test platform choices, vendor claims and the true cost of operating models in production.",
  },
  {
    title: "AI risk & governance",
    body: "Evaluation, human oversight, auditability and model-risk practices that hold up to customers, regulators and frameworks such as the NIST AI RMF.",
  },
  {
    title: "Technical due diligence",
    body: "An independent read on an AI product or team for investors and acquirers: what is real, what is fragile, what it will take.",
  },
  {
    title: "Data & platform strategy",
    body: "The data foundations, MLOps and cloud choices that decide whether AI scales past the first use case.",
  },
  {
    title: "Team building",
    body: "Hiring senior AI talent, structuring data-science teams and mentoring technical leaders.",
  },
] as const;

export const advisoryFormats = [
  {
    title: "Advisory board seat",
    body: "Ongoing strategic counsel to founders and boards on AI and technology.",
  },
  {
    title: "Fractional AI advisor",
    body: "Regular working sessions with the leadership team, plus on-call review of key decisions.",
  },
  {
    title: "Executive & board briefing",
    body: "A focused session that gives directors a clear, hype-free picture of AI opportunity and risk.",
  },
  {
    title: "Technical due diligence",
    body: "A scoped assessment of an AI product, platform or team ahead of an investment decision.",
  },
] as const;

export const principles = [
  {
    title: "Start with the decision, not the model",
    body: "Every system I build begins with the decision it improves and the person who owns it.",
  },
  {
    title: "Evidence before scale",
    body: "Evaluation, backtests and baselines come first, so we know it works before we bet on it.",
  },
  {
    title: "Humans own high-stakes calls",
    body: "AI assembles evidence and drafts; accountable people decide where the stakes demand it.",
  },
  {
    title: "Auditable by default",
    body: "Every number, claim and citation can be traced back to its source and checked by code.",
  },
  {
    title: "Honest limits",
    body: "I publish where a system falls short. Knowing the failure modes is what makes it safe to use.",
  },
] as const;

export interface TeachingProgram {
  /** Anchor id for the program card on the Experience page. */
  id: string;
  title: string;
  org: string;
  /** Short institution name for tiles. */
  institution: string;
  body: string;
  /** Public program page. Use the clean URL, without tracking fragments. */
  href?: string;
  capabilities?: CapabilityKey[];
  /** Main topics I teach in the program, drafted from the public curriculum. */
  topics?: string[];
  /** Skills, techniques and tools learners practice. */
  skills?: string[];
}

const programs: TeachingProgram[] = [
  {
    id: "jhu-agentic-ai",
    title: "Certificate Program in Agentic AI",
    org: "Johns Hopkins University · with Great Learning",
    institution: "Johns Hopkins University",
    body: "Building single- and multi-agent systems in Python, from LLM and retrieval foundations to agents that plan, use tools, coordinate and can be evaluated and governed.",
    href: "https://online.lifelonglearning.jhu.edu/jhu-certificate-program-agentic-ai",
    capabilities: ["agents", "rag", "evaluation"],
    topics: [
      "How LLMs work, prompting techniques and model selection",
      "RAG pipelines: chunking, embeddings, vector stores, hybrid search and reranking",
      "Evaluating GenAI systems and reducing hallucinations",
      "Single-agent systems: ReAct, tools, memory and MCP",
      "Multi-agent architectures and agent-to-agent (A2A) coordination",
      "Agent evaluation: task success, reasoning trajectories and adversarial tests",
      "Responsible AI: guardrails, human-in-the-loop review and audit trails",
    ],
    skills: [
      "LangChain",
      "LangGraph",
      "CrewAI",
      "MCP",
      "A2A",
      "Agentic RAG",
      "RAGAS",
      "DeepEval",
      "LangSmith",
      "LLM-as-a-judge",
    ],
  },
  {
    id: "ut-austin-ai-agents",
    title: "Post Graduate Program in AI Agents for Business Applications",
    org: "UT Austin McCombs School of Business · with Great Learning",
    institution: "UT Austin McCombs",
    body: "AI agents for business teams: designing agents that plan, use tools and remember, applying them across finance, HR, retail, healthcare and customer service, and judging which use cases are worth automating.",
    href: "https://onlineexeced.mccombs.utexas.edu/ai-agents-for-business-applications-online-course",
    capabilities: ["agents", "rag"],
    topics: [
      "Generative AI and LLMs for business, prompt techniques and reusable templates",
      "RAG and agentic RAG for context-aware answers",
      "Agents with tools and short- and long-term memory, via MCP",
      "Planning, reasoning, self-reflection and task decomposition (ReAct)",
      "Designing multi-agent systems",
      "Testing and evaluating agents, with human-in-the-loop review",
      "Securing and deploying agents: privacy, access control and compliance",
    ],
    skills: [
      "LangChain",
      "Agentic RAG",
      "MCP",
      "ReAct",
      "Multi-agent design",
      "Agent testing",
      "Human-in-the-loop",
      "No-code agents (n8n)",
    ],
  },
  {
    id: "jhu-applied-genai",
    title: "Certificate Program in Applied Generative AI and Agentic AI",
    org: "Johns Hopkins University · with Great Learning",
    institution: "Johns Hopkins University",
    body: "Production LLM applications end to end: prompting and its optimization, retrieval, fine-tuning, multi-agent systems, and knowing which approach fits a given problem.",
    href: "https://online.lifelonglearning.jhu.edu/jhu-certificate-program-applied-generative-ai",
    capabilities: ["rag", "agents", "ml"],
    topics: [
      "Prompt engineering: few-shot, chain- and tree-of-thought, self-consistency, ReAct",
      "Prompt stability and programmatic prompt optimization",
      "Evaluation with LLM-as-a-judge and gold-standard datasets",
      "Embeddings, RAG and GraphRAG",
      "Fine-tuning small language models — and when to prefer prompting or RAG",
      "Multi-agent systems and A2A communication",
      "Bias, risk and AI regulation",
    ],
    skills: [
      "DSPy",
      "GEPA",
      "RAG",
      "GraphRAG",
      "Fine-tuning (SLMs)",
      "LLM-as-a-judge",
      "Multi-agent systems",
      "AI-assisted coding",
    ],
  },
  {
    id: "utsa-engineering",
    title: "Engineering instruction",
    org: "University of Texas at San Antonio, 2016 – 2019",
    institution: "UT San Antonio",
    body: "Instructor and teaching assistant in mechanical and manufacturing engineering while completing my Ph.D.",
  },
];

export const teaching = {
  stats: [
    { value: "250+", label: "students taught" },
    { value: "4.92 / 5", label: "instructor rating" },
    { value: "3", label: "university programs" },
  ] as const,
  programs,
};

export const bios = {
  short:
    "Ali Zarreh, Ph.D., is an AI solution architect and senior data scientist who builds trustworthy AI for regulated, high-stakes businesses. He leads agentic-AI and forecasting work at H-E-B, teaches applied generative and agentic AI in Johns Hopkins University and UT Austin programs, and serves as an AI and technology board advisor.",
  medium:
    "Ali Zarreh, Ph.D., is a hands-on AI leader with 18 years of turning machine learning, optimization and generative AI into production systems. At H-E-B he architects agentic workflows on regulated data and leads forecasting and optimization platforms that cut forecast error roughly in half and lifted markdown revenue by 11%. He teaches agentic and generative AI programs offered by Johns Hopkins University and UT Austin, where 250+ students have rated him 4.92 out of 5, and advises the health-tech startup Syne Life on AI and technology strategy. He holds a Ph.D. from the University of Texas at San Antonio, where his research applied game theory to cybersecurity in manufacturing.",
  long: "Ali Zarreh, Ph.D., builds AI that shows its work — systems that cite their evidence, check their own numbers and leave high-stakes calls to accountable people. Over 18 years he has moved from predictive maintenance in steel and chemical plants, to doctoral research on game-theoretic cybersecurity, to leading AI and data science at H-E-B. There he architects LangGraph agentic workflows on regulated data — including one that classified more than 51,000 card transactions at 99.76% high confidence — and leads demand forecasting, markdown and space-optimization platforms that cut forecast error roughly in half, lifted markdown revenue by 11% and reduced compute cost by about 90%. Alongside that work he maintains a public portfolio of AI applications for finance, healthcare and insurance, each built with independent verifiers, guardrails and openly reported limits. Ali teaches agentic and generative AI programs offered by Johns Hopkins University and UT Austin, with 250+ students and a 4.92/5 rating, and serves on the advisory board of the health-tech startup Syne Life. He holds a Ph.D. in Mechanical and Manufacturing Systems Engineering from the University of Texas at San Antonio and an M.Sc. from the University of Tehran, and has published peer-reviewed research on cyber-physical security. Based in San Antonio, Texas, he spends his free time climbing and in the mountains.",
} as const;
