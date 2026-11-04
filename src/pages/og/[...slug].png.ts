import type { APIRoute, GetStaticPaths } from "astro";
import { renderOgImage, type OgInput } from "@/lib/og";
import { getPosts, getWork } from "@/lib/content";
import { capabilities, domains } from "@/data/taxonomy";
import { profile } from "@/data/profile";

export const getStaticPaths: GetStaticPaths = async () => {
  const work = await getWork();
  const posts = await getPosts();
  const pages: { slug: string; card: OgInput }[] = [
    {
      slug: "default",
      card: {
        eyebrow: profile.roles.join(" · "),
        title: profile.headline,
        subtitle: profile.positioning,
        chips: ["Agentic AI", "Evaluation & guardrails", "Forecasting", "Optimization"],
      },
    },
    ...work.map((w) => ({
      slug: `work/${w.id}`,
      card: {
        eyebrow: `Case study · ${w.data.domains.map((d) => domains[d]).join(" · ")}`,
        title: w.data.title,
        subtitle: w.data.headline,
        chips: w.data.capabilities.slice(0, 3).map((c) => capabilities[c]),
      },
    })),
    ...posts.map((p) => ({
      slug: `writing/${p.id}`,
      card: { eyebrow: "Writing", title: p.data.title, chips: p.data.tags.slice(0, 3) },
    })),
  ];
  return pages.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props.card as OgInput);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
