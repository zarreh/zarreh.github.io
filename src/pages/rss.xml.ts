import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, postUrl } from "@/lib/content";
import { profile } from "@/data/profile";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "Ali Zarreh — Writing",
    description: `Essays on building trustworthy, production AI. ${profile.positioning}`,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
      author: `${profile.email} (${profile.name})`,
    })),
    customData: "<language>en-us</language>",
  });
}
