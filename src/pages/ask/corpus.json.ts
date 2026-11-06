import type { APIRoute } from "astro";
import { enterpriseUrl, getPosts, getWork, postUrl, workUrl } from "@/lib/content";
import { education, hebProjects, roles, skills } from "@/data/experience";
import { labItems } from "@/data/lab";
import { publications } from "@/data/publications";
import {
  advisoryAreas,
  advisoryFormats,
  bios,
  faqs,
  principles,
  process,
  services,
  teaching,
} from "@/data/offerings";
import { profile } from "@/data/profile";
import { capabilities, domains } from "@/data/taxonomy";

/**
 * Knowledge base for the "Ask my portfolio" assistant (services/ask-api).
 * Regenerated on every build, so the assistant always answers from the published site.
 */
interface Chunk {
  id: string;
  url: string;
  title: string;
  section: string;
  text: string;
}

/** Turns MDX into plain text: Flow diagrams become a one-line pipeline, other JSX tags are dropped. */
function mdxToText(body: string) {
  return body
    .replace(/<Flow[\s\S]*?\/>/g, (flow) => {
      const labels = [...flow.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
      return labels.length ? `Pipeline: ${labels.join(" → ")}.` : "";
    })
    .replace(/<\/?[A-Z][^>]*>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitSections(body: string) {
  const parts = body.split(/^## +/m);
  const intro = parts.shift()?.trim();
  const sections = parts.map((p) => {
    const [heading, ...rest] = p.split("\n");
    return { heading: heading!.trim(), text: rest.join("\n").trim() };
  });
  return intro ? [{ heading: "Introduction", text: intro }, ...sections] : sections;
}

export const GET: APIRoute = async () => {
  const chunks: Chunk[] = [];
  const add = (c: Omit<Chunk, "id">) => chunks.push({ id: `c${chunks.length + 1}`, ...c });

  add({
    url: "/about/",
    title: "About Ali Zarreh",
    section: "Profile",
    text: `${profile.fullName}. ${profile.role}. ${profile.positioning} ${profile.intro} ${profile.availability} Based in ${profile.location}. Contact: ${profile.email}. ${bios.long}`,
  });

  for (const entry of await getWork()) {
    const d = entry.data;
    const url = workUrl(entry);
    add({
      url,
      title: d.title,
      section: "Overview",
      text: [
        `${d.title}: ${d.headline} ${d.summary}`,
        `Industry: ${d.domains.map((x) => domains[x]).join(", ")}. Capabilities: ${d.capabilities.map((x) => capabilities[x]).join(", ")}.`,
        d.metrics.length
          ? `Key numbers: ${d.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}.`
          : "",
        d.stack.length ? `Stack: ${d.stack.join(", ")}.` : "",
        d.scopeNote ? `Scope: ${d.scopeNote}` : "",
        d.links.demo ? `Live demo: ${d.links.demo}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    for (const section of splitSections(mdxToText(entry.body ?? ""))) {
      add({ url, title: d.title, section: section.heading, text: section.text });
    }
  }

  for (const p of hebProjects) {
    add({
      url: enterpriseUrl(p.id),
      title: `${p.title} (H-E-B)`,
      section: p.role,
      text: [
        p.summary,
        `Problem: ${p.problem}`,
        `What Ali built and led: ${p.built.join(" ")}`,
        `Outcomes: ${p.outcomes.map((o) => `${o.value} ${o.label}`).join("; ")}.`,
        `Stack: ${p.stack.join(", ")}.`,
      ].join("\n"),
    });
  }

  for (const r of roles) {
    add({
      url: `/experience/#${r.id}`,
      title: `${r.title}, ${r.org}`,
      section: r.period,
      text: [
        r.summary,
        ...(r.partner ? [`Delivered with ${r.partner}.`] : []),
        ...(r.highlights ?? []),
      ].join("\n"),
    });
  }

  add({
    url: "/experience/#education",
    title: "Education and skills",
    section: "Education",
    text: [
      ...education.map((e) => `${e.degree}, ${e.school}, ${e.year}.`),
      ...skills.map((s) => `${s.group}: ${s.items.join(", ")}.`),
    ].join("\n"),
  });

  add({
    url: "/advisory/",
    title: "Advisory & consulting",
    section: "Projects & consulting",
    text: services
      .map(
        (s) =>
          `${s.title} (${s.format}): ${s.lead} ${s.body} Deliverables: ${s.deliverables.join("; ")}.`,
      )
      .join("\n"),
  });
  add({
    url: "/advisory/",
    title: "Advisory & consulting",
    section: "How we'd work together and FAQ",
    text: [
      ...process.map((p, i) => `Step ${i + 1} — ${p.title}: ${p.body}`),
      ...faqs.map((f) => `Q: ${f.q} A: ${f.a}`),
    ].join("\n"),
  });
  add({
    url: "/advisory/",
    title: "Advisory & consulting",
    section: "Advisory",
    text: [
      "Current: Health Tech Board Advisor (AI & Technology) at Syne Life since August 2026.",
      ...advisoryAreas.map((a) => `${a.title}: ${a.body}`),
      ...advisoryFormats.map((a) => `${a.title}: ${a.body}`),
      ...principles.map((p) => `Principle — ${p.title}: ${p.body}`),
    ].join("\n"),
  });
  add({
    url: "/experience/#teaching",
    title: "Teaching",
    section: "Programs taught",
    text: [
      ...teaching.stats.map((s) => `${s.value} ${s.label}.`),
      ...teaching.programs.map((p) =>
        [
          `${p.title} — ${p.org}: ${p.body}`,
          p.topics ? `Main topics: ${p.topics.join("; ")}.` : "",
          p.skills ? `Skills taught: ${p.skills.join(", ")}.` : "",
          p.href ? `Program page: ${p.href}` : "",
        ]
          .filter(Boolean)
          .join(" "),
      ),
    ].join("\n"),
  });
  add({
    url: "/students/",
    title: "Students",
    section: "Course materials",
    text: "Students in the programs Ali teaches can sign in to find course materials organized by program and course: slides and session notes, notebooks and code, case studies and project templates, reading lists, session recaps, and announcements and office hours. Student sign-in is being set up; until then, students can request materials through the contact page.",
  });
  add({
    url: "/research/",
    title: "Research & publications",
    section: "Publications",
    text: publications
      .map(
        (p) =>
          `${p.authors} (${p.year}). ${p.title}. ${p.venue}${p.status === "manuscript" ? " (manuscript)" : ""}.`,
      )
      .join("\n"),
  });
  add({
    url: "/work/#lab",
    title: "In the lab",
    section: "Unreleased agents",
    text: labItems.map((l) => `${l.title}: ${l.summary} Repository: ${l.repo}`).join("\n"),
  });

  for (const post of await getPosts()) {
    for (const section of splitSections(mdxToText(post.body ?? ""))) {
      add({
        url: postUrl(post),
        title: post.data.title,
        section: section.heading,
        text: section.text,
      });
    }
  }

  const body = JSON.stringify({
    version: 1,
    site: profile.siteUrl,
    generated: new Date().toISOString(),
    chunks: chunks.filter((c) => c.text.length > 0),
  });
  return new Response(body, { headers: { "Content-Type": "application/json" } });
};
