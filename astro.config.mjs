// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

export default defineConfig({
  site: "https://zarreh.ai",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  integrations: [
    mdx(),
    icon(),
    sitemap({
      filter: (page) =>
        !/\.html$/.test(page) && !page.includes("/404") && !page.includes("/students/login"),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
