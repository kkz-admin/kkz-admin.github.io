import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const fixtures: string[] = [];

afterEach(async () => {
  await Promise.all(
    fixtures.splice(0).map((fixture) => rm(fixture, { recursive: true })),
  );
});

describe("checkStaticLinks", () => {
  it("fails when a root-relative local link is missing", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "yin-yuhao-links-"));
    fixtures.push(fixture);
    await writeFile(
      join(fixture, "index.html"),
      '<!doctype html><a href="/missing/">Missing local page</a>',
      "utf8",
    );

    const { checkStaticLinks } = await import("../../scripts/check-links.mjs");
    const result = await checkStaticLinks({ root: fixture, port: 4323 });

    expect(result.passed).toBe(false);
    expect(result.links.some((link) => link.state === "BROKEN")).toBe(true);
  });
});
