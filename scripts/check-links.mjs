import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { check } from "linkinator";

export const LINK_CHECK_PORT = 4321;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeBasePath(basePath) {
  const normalized = basePath.trim().replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "";
}

function createUrlRewriteExpressions({ port, basePath, site }) {
  const staticOrigin = `http://127.0.0.1:${port}`;
  const base = normalizeBasePath(basePath);
  const origins = new Set([
    staticOrigin,
    "http://localhost:4321",
    new URL(site).origin,
  ]);

  return [...origins].map((origin) => ({
    pattern: new RegExp(
      `^${escapeRegExp(origin)}${escapeRegExp(base)}(?=/|\\?|#|$)`,
    ),
    replacement: staticOrigin,
  }));
}

export async function checkStaticLinks({
  root = resolve(process.cwd(), "dist"),
  port = LINK_CHECK_PORT,
  basePath = process.env.BASE_PATH ?? "/",
  site = process.env.SITE_URL ?? "http://localhost:4321",
} = {}) {
  return check({
    path: "/",
    serverRoot: root,
    port,
    recurse: true,
    linksToSkip: ["^mailto:"],
    urlRewriteExpressions: createUrlRewriteExpressions({
      port,
      basePath,
      site,
    }),
  });
}

async function main() {
  const result = await checkStaticLinks();
  const brokenLinks = result.links.filter((link) => link.state === "BROKEN");

  for (const link of brokenLinks) {
    console.error(`Broken link: ${link.url}`);
  }

  console.log(`Checked ${result.links.length} links.`);

  if (!result.passed) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  await main();
}
