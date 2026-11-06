import { getCollection, type CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;
export type PostEntry = CollectionEntry<"posts">;

const showDrafts = import.meta.env.DEV;

export async function getWork(): Promise<WorkEntry[]> {
  const entries = await getCollection("work", ({ data }) => showDrafts || !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getPosts(): Promise<PostEntry[]> {
  const entries = await getCollection("posts", ({ data }) => showDrafts || !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const workUrl = (entry: WorkEntry) => `/work/${entry.id}/`;
export const enterpriseUrl = (id: string) => `/work/enterprise/${id}/`;
export const postUrl = (entry: PostEntry) => `/writing/${entry.id}/`;

export function formatDate(date: Date, style: "long" | "short" = "long") {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function readingTime(body: string | undefined) {
  const words = (body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
