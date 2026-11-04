import type { APIRoute, GetStaticPaths } from "astro";
import { legacyRedirects } from "@/data/redirects";

// Emits /<legacy>.html files so links and search results pointing at the previous site keep working.
export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(legacyRedirects).map(([legacy, target]) => ({
    params: { legacy },
    props: { target },
  }));

export const GET: APIRoute = ({ props, site }) => {
  const target = new URL(props.target as string, site).toString();
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved — Ali Zarreh</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body>
<p>This page has moved to <a href="${target}">${target}</a>.</p>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
