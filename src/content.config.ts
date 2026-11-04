import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { capabilityKeys, domainKeys } from "./data/taxonomy";

const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/work" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      headline: z.string(),
      summary: z.string().max(320),
      domains: z.array(z.enum(domainKeys)).min(1),
      capabilities: z.array(z.enum(capabilityKeys)).min(1),
      status: z.enum(["live", "open-source"]),
      featured: z.boolean().default(false),
      order: z.number(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      links: z
        .object({
          demo: z.string().url().optional(),
          docs: z.string().url().optional(),
          repo: z.string().url().optional(),
        })
        .default({}),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      stack: z.array(z.string()).default([]),
      scopeNote: z.string().optional(),
      legacy: z.string().optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(260),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    canonical: z.string().url().optional(),
    related: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, posts };
