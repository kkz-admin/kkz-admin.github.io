import type { APIContext } from "astro";

export const prerender = true;

export function GET({ site }: APIContext): Response {
  const baseSite = site ?? new URL("http://localhost:4321");
  const sitemap = new URL(
    `${import.meta.env.BASE_URL}sitemap-index.xml`,
    baseSite,
  );

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
