import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => new URL(`../../${path}`, import.meta.url);

describe("Pages workflow package manager contract", () => {
  it("pins the exact package pnpm version in both GitHub Actions workflows", async () => {
    const packageJson = JSON.parse(
      await readFile(projectFile("package.json"), "utf8"),
    ) as { packageManager?: string };
    const workflows = await Promise.all(
      ["ci.yml", "pages.yml"].map(async (name) => ({
        name,
        source: await readFile(
          projectFile(`.github/workflows/${name}`),
          "utf8",
        ),
      })),
    );
    const packageManagerVersion = packageJson.packageManager?.replace(
      /^pnpm@/,
      "",
    );

    expect(packageJson.packageManager).toBe("pnpm@10.34.5");
    for (const { name, source } of workflows) {
      const workflowVersion = source.match(
        /pnpm\/action-setup@v4[\s\S]*?version:\s*([^\s]+)/,
      )?.[1];
      expect(workflowVersion, name).toBe(packageManagerVersion);
      expect(source, name).toContain("node-version: 22.12.0");
    }
    expect(workflows[1].source).toContain("uses: withastro/action@v3");
  });

  it("sets explicit read-only contents permission for ordinary CI", async () => {
    const workflow = await readFile(
      projectFile(".github/workflows/ci.yml"),
      "utf8",
    );
    const globalPermissions = workflow.match(
      /^permissions:\r?\n((?: {2}.+\r?\n)+)/m,
    )?.[1];

    expect(globalPermissions?.trim()).toBe("contents: read");
  });

  it("grants deployment credentials only to the deploy job", async () => {
    const workflow = await readFile(
      projectFile(".github/workflows/pages.yml"),
      "utf8",
    );
    const globalPermissions = workflow.match(
      /^permissions:\r?\n((?: {2}.+\r?\n)+)/m,
    )?.[1];
    const deployJob = workflow.match(/^  deploy:\r?\n([\s\S]+)$/m)?.[1];

    expect(globalPermissions?.trim()).toBe("contents: read");
    expect(deployJob).toMatch(
      /permissions:\r?\n\s+pages: write\r?\n\s+id-token: write/,
    );
  });
});
