export type PublicationTopic =
  "Cybersecurity" | "Manufacturing systems" | "Optimization" | "Biomechanics";

export interface Publication {
  authors: string;
  year: number;
  title: string;
  venue: string;
  details?: string;
  doi?: string;
  topic: PublicationTopic;
  status: "published" | "manuscript";
  featured?: boolean;
}

/** DOIs verified against Crossref (2026-11). Manuscripts are listed with their last known status. */
export const publications: Publication[] = [
  {
    authors: "Zarreh, A., Zarreh, M., Saygin, C., & Wan, H.",
    year: 2025,
    title:
      "Optimizing cybersecurity in cyber-physical manufacturing systems: A game-theoretic approach and quantal response equilibrium study",
    venue: "Journal of Future Sustainability",
    details: "5, 179–194",
    doi: "10.5267/j.jfs.2025.9.002",
    topic: "Cybersecurity",
    status: "published",
    featured: true,
  },
  {
    authors: "Jadidi, M., Razian, S. A., Zarreh, A., Shahbad, R., & Kamenskiy, A.",
    year: 2025,
    title:
      "Differential effects of demographics and risk factors on the nonlinear orthotropic mechanical properties of human femoropopliteal arteries",
    venue: "Biomechanics and Modeling in Mechanobiology",
    details: "24(5), 1565–1589",
    doi: "10.1007/s10237-025-01981-4",
    topic: "Biomechanics",
    status: "published",
    featured: true,
  },
  {
    authors: "Bracho Avila, A., Zarreh, A., Saygin, C., Wan, H., & Lee, Y.",
    year: 2021,
    title:
      "Evaluation of dynamic scheduling policies against cyber-attacks on an open-shop manufacturing system using simulation",
    venue: "International Journal of Multidisciplinary and Current Research",
    details: "9, 395–404",
    doi: "10.14741/ijmcr/v.9.4.6",
    topic: "Cybersecurity",
    status: "published",
  },
  {
    authors: "Zarreh, A., Lee, Y., Al Janahi, R., Wan, H., & Saygin, C.",
    year: 2020,
    title: "Cyber-physical security evaluation in manufacturing systems with a Bayesian game model",
    venue: "Procedia Manufacturing",
    details: "51, 1158–1165",
    doi: "10.1016/j.promfg.2020.10.163",
    topic: "Cybersecurity",
    status: "published",
    featured: true,
  },
  {
    authors: "Al Janahi, R., Lee, Y., Zarreh, A., & Wan, H.",
    year: 2020,
    title: "Effectiveness and fitness of production line to meet customers' demand",
    venue: "Procedia Manufacturing",
    details: "51, 1348–1354",
    doi: "10.1016/j.promfg.2020.10.188",
    topic: "Manufacturing systems",
    status: "published",
  },
  {
    authors: "Zarreh, A., Wan, H., Lee, Y., Saygin, C., & Al Janahi, R.",
    year: 2019,
    title: "Cybersecurity concerns for total productive maintenance in smart manufacturing systems",
    venue: "Procedia Manufacturing",
    details: "38, 532–539",
    doi: "10.1016/j.promfg.2020.01.067",
    topic: "Cybersecurity",
    status: "published",
  },
  {
    authors: "Zarreh, A., Wan, H., Lee, Y., Saygin, C., & Al Janahi, R.",
    year: 2019,
    title: "Risk assessment for cyber security of manufacturing systems: A game theory approach",
    venue: "Procedia Manufacturing",
    details: "38, 605–612",
    doi: "10.1016/j.promfg.2020.01.077",
    topic: "Cybersecurity",
    status: "published",
  },
  {
    authors: "Al Janahi, R., Wan, H., & Zarreh, A.",
    year: 2019,
    title: "Implementing Kaizen through a Lean RACE model: A case study",
    venue: "Proceedings of the IISE Annual Conference, Orlando, Florida",
    doi: "10.31224/osf.io/8sxh9",
    topic: "Manufacturing systems",
    status: "published",
  },
  {
    authors: "Zarreh, A., Saygin, C., Wan, H., Lee, Y., & Bracho, A.",
    year: 2018,
    title: "A game theory based cybersecurity assessment model for advanced manufacturing systems",
    venue: "Procedia Manufacturing",
    details: "26, 1255–1264",
    doi: "10.1016/j.promfg.2018.07.162",
    topic: "Cybersecurity",
    status: "published",
    featured: true,
  },
  {
    authors: "Zarreh, A., Saygin, C., Wan, H., Lee, Y., & Bracho, A.",
    year: 2018,
    title:
      "Cybersecurity analysis of smart manufacturing system using game theory approach and quantal response equilibrium",
    venue: "Procedia Manufacturing",
    details: "17, 1001–1008",
    doi: "10.1016/j.promfg.2018.10.087",
    topic: "Cybersecurity",
    status: "published",
  },
  {
    authors: "Bracho, A., Saygin, C., Wan, H., Lee, Y., & Zarreh, A.",
    year: 2018,
    title:
      "A simulation-based platform for assessing the impact of cyber-threats on smart manufacturing systems",
    venue: "Procedia Manufacturing",
    details: "26, 1116–1127",
    doi: "10.1016/j.promfg.2018.07.148",
    topic: "Cybersecurity",
    status: "published",
  },
  {
    authors: "Zarreh, A., Lee, Y., Al Janahi, R., Wan, H., & Saygin, C.",
    year: 2021,
    title:
      "Cybersecurity risk management framework in cyber-physical manufacturing systems using failure mode and effects analysis (FMEA) and game theory",
    venue: "Manuscript (submitted to Risk Analysis)",
    topic: "Cybersecurity",
    status: "manuscript",
  },
  {
    authors: "Nie, L., Zarreh, A., & Wan, H.",
    year: 2020,
    title:
      "A game-theory approach for optimizing shop floor scheduling in a virtual manufacturing network",
    venue: "Manuscript (submitted to Journal of Scheduling)",
    topic: "Optimization",
    status: "manuscript",
  },
];

export const researchThemes = [
  {
    title: "Game-theoretic cybersecurity",
    body: "Modeling attackers and defenders of cyber-physical manufacturing systems as strategic players — Nash, Bayesian and quantal-response equilibria — to quantify risk and decide where security spending pays off.",
  },
  {
    title: "Risk quantification",
    body: "Monte Carlo simulation, FMEA and loss distributions that turn security and reliability questions into numbers a leadership team can act on.",
  },
  {
    title: "Operations & manufacturing",
    body: "Scheduling under attack, lean improvement, and production-line fitness — the operations-research roots of my later forecasting and optimization work.",
  },
] as const;
