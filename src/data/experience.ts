import type { CapabilityKey, DomainKey } from "./taxonomy";
import { teaching, type TeachingProgram } from "./offerings";

export interface Outcome {
  value: string;
  label: string;
}

export interface EnterpriseProject {
  id: string;
  title: string;
  role: string;
  summary: string;
  problem: string;
  built: string[];
  outcomes: Outcome[];
  stack: string[];
  domains: DomainKey[];
  capabilities: CapabilityKey[];
  featured?: boolean;
}

export interface Role {
  id: string;
  org: string;
  title: string;
  location: string;
  period: string;
  summary: string;
  highlights?: string[];
  projects?: EnterpriseProject[];
  /** The organization's public website. */
  website?: string;
  /** Delivery partner, shown under the organization. */
  partner?: string;
  /** Programs taught in this role; each renders as a card on the Experience page. */
  programs?: TeachingProgram[];
}

/**
 * Enterprise work at H-E-B, at the level already public on the résumé. Each project has its own
 * page at /work/enterprise/<id>/ and is also published in the assistant corpus. Leave out
 * projections, unreleased roadmap items and findings that read as criticism of the employer.
 */
export const hebProjects: EnterpriseProject[] = [
  {
    id: "work-order-intelligence",
    title: "Work Order Intelligence Platform",
    role: "AI Solution Architect & Lead AI Engineer",
    summary:
      "Agentic workflows that turn unstructured HVAC and refrigeration work orders into structured diagnostics, cost buckets and asset matches.",
    problem:
      "Maintenance work orders arrive as free text. Diagnostics, asset details and costs were buried in prose and typed in by hand, so nobody could trust or analyze them at scale.",
    built: [
      "Architected LangGraph agentic workflows that extract Problem–Cause–Remedy diagnostics from HVAC and refrigeration work orders, with agentic RAG over BigQuery vector search to match assets and components to the asset taxonomy and spec sheets.",
      "Built an LLM-as-judge evaluation pipeline that surfaced upstream data-quality issues and drove data-capture fixes at the source.",
      "Classified every work order into category-specific cost buckets: a JEV model (Typesafe AI) as the primary classifier, an LLM fallback below 0.9 probability, and a five-criteria evaluation step that ships, reviews or rejects each result.",
      "Designed a proof of concept for a multimodal (text and image) intake agent that replaces form-based requests: it gathers missing details, triages, and hands off each request with similar past incidents, likely duplicates and repair documents.",
    ],
    outcomes: [
      { value: "98%", label: "cost-bucket accuracy" },
      { value: "−99%", label: "manual data entry" },
    ],
    stack: [
      "LangGraph",
      "Agentic RAG",
      "BigQuery vector search",
      "LLM-as-judge",
      "Multimodal LLMs",
    ],
    domains: ["retail", "operations"],
    capabilities: ["agents", "rag", "evaluation"],
    featured: true,
  },
  {
    id: "expense-classification",
    title: "Corporate-Card Expense Classification",
    role: "AI Solution Architect & Lead AI Engineer",
    summary:
      "A LangGraph agentic workflow that replaced manual expense coding on regulated PII data and discovered a governed taxonomy along the way.",
    problem:
      "Corporate-card transactions were coded by hand against an inconsistent category list, on data containing regulated personal information.",
    built: [
      "Architected and led a LangGraph agentic workflow on Vertex AI that discovered a governed 44-category taxonomy and then classified every transaction against it.",
      "Designed for regulated data from day one: governed categories, confidence scoring, and automatic OpenAI-to-Gemini failover so the pipeline keeps running when a provider does not.",
    ],
    outcomes: [
      { value: "99.76%", label: "classified at high confidence" },
      { value: "51,518", label: "transactions" },
      { value: "98.4%", label: "resolved in a single LLM pass" },
      { value: "44", label: "governed categories discovered" },
    ],
    stack: ["LangGraph", "Vertex AI", "OpenAI", "Gemini", "Provider failover"],
    domains: ["finance", "retail"],
    capabilities: ["agents", "evaluation"],
    featured: true,
  },
  {
    id: "retail-demand-forecasting",
    title: "Retail Demand Forecasting Platform",
    role: "Lead Data Scientist",
    summary:
      "A 22-repository GCP platform forecasting SKU-store sales and promotional redemption for ~350 stores over an 89-week horizon.",
    problem:
      "Planners needed SKU-by-store forecasts for regular and promoted items far enough ahead to plan buys and promotions, and the legacy model was both less accurate and slow.",
    built: [
      "Led a cross-functional team of data scientists and engineers, setting technical direction and MLOps standards across 22 repositories.",
      "Built the production models: LightGBM for weekly SKU-store sales and promotional redemption (benchmarked against XGBoost and a Temporal Fusion Transformer) and ARIMA+ for daily demand, trained on Ray in Vertex AI, served via BigQuery ML and fed by Dataform feature pipelines.",
      "Designed the evaluation and explainability layer — leakage-audited backtests by category, promotion and horizon week, plus SHAP dashboards for planners — and an experimentation platform.",
      "Delivered an on-demand Cloud Run forecasting API returning per-promotion forecasts in about 25–30 seconds.",
      "Earlier, led modeling for the legacy promotional forecasting platform this replaced, and helped refactor it from R and Scala to PySpark on AWS, cutting its runtime by nearly 70%.",
    ],
    outcomes: [
      { value: "~50%", label: "lower WMAPE vs. legacy" },
      { value: "−72%", label: "pipeline runtime" },
      { value: "~350", label: "stores, 89-week horizon" },
      { value: "25–30 s", label: "on-demand promo forecast" },
    ],
    stack: [
      "LightGBM",
      "ARIMA+",
      "Ray",
      "Vertex AI",
      "BigQuery ML",
      "Dataform",
      "Cloud Run",
      "SHAP",
    ],
    domains: ["retail"],
    capabilities: ["forecasting", "mlops", "ml"],
    featured: true,
  },
  {
    id: "markdown-optimization",
    title: "Markdown Optimization",
    role: "Lead Data Scientist / Technical Lead",
    summary:
      "Price-elasticity forecasting and a constrained optimizer that recommends multi-week discount schedules merchants adopt as-is.",
    problem:
      "Markdowns are a trade-off between revenue, shrink and empty shelves, and they were set by rule of thumb across three retail channels.",
    built: [
      "Led the price-elasticity component on Databricks/PySpark: an ensemble of XGBoost, LightGBM and AdaBoost with monotonic constraints, trained on four years of store-SKU POS history to produce 38-week demand curves.",
      "Led the optimization engine: a pruned combinatorial search over multi-week discount schedules that balances revenue against shrink and empty-shelf cost, with channel-specific weights, hard inventory caps and merchant guardrails.",
      "Delivered weekly recommendations that merchants typically adopt as-is, with overrides in the UI.",
    ],
    outcomes: [
      { value: "+11%", label: "markdown revenue (latest benchmark)" },
      { value: "38-week", label: "demand curves" },
      { value: "3", label: "retail channels" },
    ],
    stack: [
      "Databricks",
      "PySpark",
      "XGBoost",
      "LightGBM",
      "AdaBoost",
      "Combinatorial optimization",
    ],
    domains: ["retail"],
    capabilities: ["optimization", "forecasting", "ml"],
    featured: true,
  },
  {
    id: "assortment-space-optimization",
    title: "Assortment Space Optimization",
    role: "Lead Data Scientist & MLOps",
    summary:
      "Response-curve forecasting plus mixed-integer optimization that decides how much shelf each product section gets in every store.",
    problem:
      "Every store has a fixed amount of aisle space. Deciding how wide each product section should be — including widths a store has never tried — is a forecasting and an optimization problem at once.",
    built: [
      "Led a two-stage hierarchical XGBoost model (segment to store, monotonic constraints) that forecasts response curves for every candidate width.",
      "Formulated a PuLP mixed-integer optimizer that reallocates each store's space to the highest-return sections under merchandising constraints, solved in parallel across stores on Databricks/Spark.",
      "Delivered it through a self-service Streamlit dashboard, and rebuilt the preprocessing, feature engineering and compute layers.",
    ],
    outcomes: [
      { value: "−86%", label: "runtime (9 h → 75 min)" },
      { value: "−90%", label: "compute cost (approx.)" },
    ],
    stack: ["XGBoost", "PuLP (MIP)", "Databricks", "Spark", "Streamlit"],
    domains: ["retail"],
    capabilities: ["optimization", "ml", "mlops"],
  },
  {
    id: "efc-forecasting",
    title: "Electronic Fulfillment Center Forecasting",
    role: "Architect & Lead Data Scientist",
    summary:
      "A 21-day, hourly forecast of orders and units for every fulfillment-center and store pair, feeding staffing and capacity planning.",
    problem:
      "Fulfillment centers need to know, hour by hour and weeks ahead, how many orders and units each store pairing will generate in order to staff and plan capacity.",
    built: [
      "Architected a 21-day multi-horizon forecast of hourly orders and units for every EFC–store pair (9 EFCs, 73 stores), ensembling an ARIMA baseline, global LightGBM models and a Temporal Fusion Transformer.",
      "Engineered the MLOps pipeline on Databricks (AWS): MLflow-tracked experimentation and model selection, weekly retraining and daily inference via model serving.",
      "Feeds EFC staffing and capacity planning, with staff allocation partly live.",
    ],
    outcomes: [
      { value: "~14%", label: "WMAPE in staging" },
      { value: "9 × 73", label: "EFCs × stores" },
      { value: "Hourly", label: "21-day horizon" },
    ],
    stack: [
      "LightGBM",
      "Temporal Fusion Transformer",
      "ARIMA",
      "Databricks",
      "MLflow",
      "Model Serving",
    ],
    domains: ["retail"],
    capabilities: ["forecasting", "mlops"],
  },
  {
    id: "warehouse-forecasting",
    title: "Warehouse Forecasting",
    role: "Solution Architect & MLOps",
    summary:
      "Forecasts of outbound and pallet selection for 12 distribution centers, used to plan labor and transportation a month ahead.",
    problem:
      "Distribution centers plan labor and trucks weeks in advance; forecasts had to be accurate across the full horizon and monitored continuously.",
    built: [
      "Architected and productionized a Databricks/Spark system on AWS forecasting outbound and pallet selection for 12 distribution centers over a 28-day horizon, with per-series XGBoost models, MLflow tracking, weekly retraining and daily scoring.",
      "Built Spark-native accuracy monitoring over 2.2 million forecast–actual pairs, and shipped v2 as a zero-downtime shadow deployment.",
    ],
    outcomes: [
      { value: "9.05%", label: "WMAPE, flat across 28 days" },
      { value: "12", label: "distribution centers" },
      { value: "2.2M", label: "forecast–actual pairs monitored" },
    ],
    stack: ["Databricks", "Spark", "XGBoost", "MLflow", "AWS", "Shadow deployment"],
    domains: ["retail"],
    capabilities: ["forecasting", "mlops"],
  },
];

export const roles: Role[] = [
  {
    id: "heb",
    org: "H-E-B",
    title: "Senior Data Scientist",
    location: "San Antonio, Texas",
    period: "Feb 2020 – Present",
    summary:
      "Hands-on technical lead for a portfolio of concurrent ML and generative-AI initiatives, working directly with director and executive leadership and mentoring junior and senior data scientists and interns.",
    highlights: [
      "Built PipeLearner, an internal Spark-distributed training package with Optuna tuning, adopted across data-science teams and cutting model training and deployment time by more than half.",
    ],
    projects: hebProjects,
  },
  {
    id: "syne-life",
    org: "Syne Life",
    title: "Health Tech Board Advisor — AI & Technology",
    location: "Remote · United Kingdom",
    period: "Aug 2026 – Present",
    summary:
      "Serve on the advisory board of a recovery-science wellness startup, advising the founding team on technology strategy, platform architecture and AI/ML strategy across the product.",
    highlights: [
      "Syne pairs a nightly recovery practice with an app that turns a member's own wearable data (Oura, Whoop or Apple Health) into one clear action each evening.",
    ],
    website: "https://syne.life/",
  },
  {
    id: "teaching",
    org: "Johns Hopkins University & UT Austin McCombs",
    partner: "Great Learning",
    title: "AI/ML Instructor (part-time)",
    location: "Remote · United States",
    period: "Nov 2025 – Present",
    summary:
      "Teach three programs — two certificate programs from Johns Hopkins University and a post-graduate program from UT Austin's McCombs School of Business — covering production LLM applications end to end, from prompt optimization and retrieval to multi-agent systems, evaluation and guardrails.",
    highlights: ["250+ students taught to date, with a 4.92 / 5 instructor rating."],
    programs: teaching.programs.filter((p) => p.href),
  },
  {
    id: "utsa",
    org: "University of Texas at San Antonio",
    title: "Research Assistant · Instructor · Teaching Assistant",
    location: "San Antonio, Texas",
    period: "2016 – 2019",
    summary:
      "Doctoral research on the security of cyber-physical manufacturing systems, alongside teaching.",
    highlights: [
      "Developed quantitative risk models using game theory (Nash and quantal-response equilibrium) and Monte Carlo simulation to produce risk scores, loss distributions and control ROI.",
      "Applied optimization to shop-floor scheduling in a virtual manufacturing network, and statistical and ML methods to educational research on student success.",
    ],
  },
  {
    id: "reef",
    org: "Reef Chemical Industries Complex",
    title: "Manufacturing / Enterprise Data Analyst",
    location: "Esfahan, Iran",
    period: "2013 – 2015",
    summary:
      "Developed, validated and deployed an ML-based anomaly-detection system for predictive maintenance using supervised and unsupervised methods.",
    highlights: ["Reduced downtime by 30% and saved more than $200K a year."],
  },
  {
    id: "isfahan-steel",
    org: "Isfahan Steel Complex",
    title: "Data Analyst / Consultant",
    location: "Esfahan, Iran",
    period: "2009 – 2013",
    summary:
      "Led the implementation of an optimized maintenance system, using statistical and ML models to forecast machinery health and reduce unplanned downtime and emergency repairs.",
  },
];

export const education = [
  {
    degree: "Ph.D., Mechanical & Manufacturing Systems Engineering (Cybersecurity)",
    school: "University of Texas at San Antonio, Klesse College of Engineering",
    year: "2019",
  },
  {
    degree: "M.Sc., Mechanical Engineering (Manufacturing & Mechatronics)",
    school: "University of Tehran, Faculty of Engineering",
    year: "2008",
  },
  {
    degree: "B.Sc., Mechanical Engineering (Manufacturing)",
    school: "Azad University, Najafabad",
    year: "2005",
  },
] as const;

export const skills = [
  {
    group: "Generative AI & agents",
    items: [
      "LangGraph",
      "LangChain",
      "Agentic RAG",
      "Multi-agent workflows",
      "LLM-as-judge evaluation",
      "Guardrails",
      "MCP",
      "OpenAI · Claude · Gemini · Azure OpenAI",
      "Vector search (BigQuery, Qdrant, Chroma, FAISS)",
    ],
  },
  {
    group: "Machine learning & forecasting",
    items: [
      "XGBoost",
      "LightGBM",
      "scikit-learn",
      "PyTorch",
      "TensorFlow",
      "ARIMA+",
      "Temporal Fusion Transformer",
      "Causal inference & A/B testing",
      "SHAP",
    ],
  },
  {
    group: "Optimization & statistics",
    items: [
      "Mixed-integer & linear programming (Pyomo, OR-Tools, PuLP)",
      "Combinatorial optimization",
      "Monte Carlo simulation",
      "Bayesian modeling (PyMC)",
      "Game theory",
    ],
  },
  {
    group: "MLOps & engineering",
    items: [
      "MLflow",
      "Databricks Workflows & Asset Bundles",
      "Vertex AI",
      "BigQuery ML",
      "ONNX",
      "Docker",
      "CI/CD (GitLab, GitHub Actions)",
      "FastAPI",
      "Monitoring & shadow deployments",
    ],
  },
  {
    group: "Data & cloud",
    items: [
      "PySpark",
      "Ray",
      "Dataform",
      "Delta Lake",
      "Unity Catalog",
      "GCP",
      "AWS",
      "Azure",
      "Snowflake",
      "Python · SQL · R · Scala",
    ],
  },
] as const;
