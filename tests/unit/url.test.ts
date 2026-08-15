import { describe, expect, it } from "vitest";
import { withBase } from "../../src/lib/url";

describe("withBase", () => {
  it("keeps root deployment paths clean", () => {
    expect(withBase("/blog/", "/")).toBe("/blog/");
  });

  it("prefixes project-page deployments once", () => {
    expect(withBase("/blog/", "/personal-blog/")).toBe("/personal-blog/blog/");
  });
});
