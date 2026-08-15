import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { check } from "linkinator";

export const LINK_CHECK_PORT = 4321;

export async function checkStaticLinks({
  root = resolve(process.cwd(), "dist"),
  port = LINK_CHECK_PORT,
} = {}) {
  return check({
    path: "/",
    serverRoot: root,
    port,
    recurse: true,
    linksToSkip: ["^mailto:"],
    urlRewriteExpressions: [
      {
        pattern: new RegExp(`^http://localhost:${port}(?=/|$)`),
        replacement: `http://127.0.0.1:${port}`,
      },
    ],
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
