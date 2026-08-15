import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const buildCommand = process.platform === "win32" ? "powershell.exe" : "pnpm";
const buildArgs =
  process.platform === "win32"
    ? [
        "-NoProfile",
        "-Command",
        "$env:BASE_PATH = '/personal-blog/'; pnpm build",
      ]
    : ["build"];
const buildEnvironment = { ...process.env };
for (const name of Object.keys(buildEnvironment)) {
  if (name === "BASE_URL" || name.startsWith("VITEST")) {
    delete buildEnvironment[name];
  }
}
delete buildEnvironment.NODE_ENV;
buildEnvironment.CI = "true";

describe("BaseLayout", () => {
  it("emits a base-path-safe default favicon URL", async () => {
    execFileSync(buildCommand!, buildArgs, {
      cwd: projectRoot,
      env: { ...buildEnvironment, BASE_PATH: "/personal-blog/" },
      stdio: "pipe",
    });

    const html = await readFile(`${projectRoot}/dist/index.html`, "utf8");

    expect(html).toContain('rel="icon" href="/personal-blog/favicon.svg"');
  }, 15_000);

  it("keeps 404 recovery links deployable and out of search indexes", async () => {
    const variants = [
      { basePath: "/", homeHref: "/", blogHref: "/blog/" },
      {
        basePath: "/personal-blog/",
        homeHref: "/personal-blog/",
        blogHref: "/personal-blog/blog/",
      },
    ];

    for (const variant of variants) {
      const command = process.platform === "win32" ? "powershell.exe" : "pnpm";
      const args =
        process.platform === "win32"
          ? [
              "-NoProfile",
              "-Command",
              `$env:SITE_URL = 'https://example.com'; $env:BASE_PATH = '${variant.basePath}'; pnpm build`,
            ]
          : ["build"];

      execFileSync(command, args, {
        cwd: projectRoot,
        env: {
          ...buildEnvironment,
          SITE_URL: "https://example.com",
          BASE_PATH: variant.basePath,
        },
        stdio: "pipe",
      });

      const html = await readFile(`${projectRoot}/dist/404.html`, "utf8");

      expect(html).toContain('<meta name="robots" content="noindex"');
      expect(html).not.toContain('rel="canonical"');
      expect(html).toContain(`href="${variant.homeHref}"`);
      expect(html).toContain(`href="${variant.blogHref}"`);
    }
  }, 30_000);
});
