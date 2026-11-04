import { profile } from "@/data/profile";
import { roles } from "@/data/experience";

const site = profile.siteUrl;

export const personId = `${site}/#person`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    alternateName: profile.alternateNames,
    honorificSuffix: profile.credentials,
    jobTitle: profile.role,
    description: profile.positioning,
    url: `${site}/`,
    image: `${site}/press/ali-zarreh-headshot.jpg`,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Antonio",
      addressRegion: "TX",
      addressCountry: "US",
    },
    worksFor: { "@type": "Organization", name: roles[0]!.org },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Texas at San Antonio" },
      { "@type": "CollegeOrUniversity", name: "University of Tehran" },
    ],
    knowsAbout: [
      "Agentic AI",
      "Generative AI",
      "Large Language Models",
      "Retrieval-Augmented Generation",
      "AI evaluation and guardrails",
      "Demand forecasting",
      "Mathematical optimization",
      "MLOps",
      "Game theory",
      "Cyber-physical security",
    ],
    sameAs: Object.values(profile.links),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: `${site}/`,
    name: "Ali Zarreh",
    description: profile.positioning,
    publisher: { "@id": personId },
    inLanguage: "en",
  };
}

export function profilePageSchema(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site}${path}`,
    mainEntity: personSchema(),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site}${item.path}`,
    })),
  };
}

export function caseStudySchema(input: {
  title: string;
  description: string;
  path: string;
  date: Date;
  updated?: Date;
  keywords: string[];
  repo?: string;
  demo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    url: `${site}${input.path}`,
    creator: { "@id": personId, "@type": "Person", name: profile.name },
    dateCreated: input.date.toISOString(),
    dateModified: (input.updated ?? input.date).toISOString(),
    keywords: input.keywords,
    ...(input.repo || input.demo ? { sameAs: [input.demo, input.repo].filter(Boolean) } : {}),
  };
}

export function blogPostingSchema(input: {
  title: string;
  description: string;
  path: string;
  date: Date;
  updated?: Date;
  tags: string[];
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: `${site}${input.path}`,
    mainEntityOfPage: `${site}${input.path}`,
    datePublished: input.date.toISOString(),
    dateModified: (input.updated ?? input.date).toISOString(),
    keywords: input.tags,
    image: `${site}${input.image}`,
    author: { "@id": personId, "@type": "Person", name: profile.name, url: `${site}/about/` },
    publisher: { "@id": personId },
  };
}
