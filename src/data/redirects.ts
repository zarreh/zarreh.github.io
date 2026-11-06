/**
 * Every URL the previous site published, mapped to its new home.
 * `src/pages/[legacy].html.ts` turns these into static redirect files so old links and search results keep working.
 */
export const legacyRedirects: Record<string, string> = {
  about: "/about/",
  biography: "/about/",
  experiences: "/experience/",
  research: "/research/",
  contact: "/contact/",
  Old_page: "/",
  projects_credit_decisioning: "/work/credit-decisioning/",
  projects_cohort_risk_lab: "/work/cohort-risk-lab/",
  projects_trade_surveillance_agent: "/work/trade-surveillance-agent/",
  projects_clinical_care_navigator: "/work/clinical-care-navigator/",
  projects_rxflow_pharmacy: "/work/rxflow-pharmacy-assistant/",
  projects_claim_process_agent: "/work/claim-processing-agent/",
  projects_duallens_analytics: "/work/duallens-analytics/",
  projects_genai_docs_helper: "/work/genai-docs-helper/",
  projects_genai_job_finder: "/work/genai-job-finder/",
  projects_car_insurance_telematics: "/work/telematics-risk-assessment/",
  projects_demand_forecast: "/work/enterprise/retail-demand-forecasting/",
  projects_price_optimization: "/work/enterprise/retail-demand-forecasting/",
  projects_pipelearner: "/experience/#heb",
};
