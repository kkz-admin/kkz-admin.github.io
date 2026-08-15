import { describe, expect, it } from "vitest";
import { matchesPost } from "../../src/lib/search";

const item = {
  title: "AI 项目实施",
  description: "需求与交付",
  category: "行业观察",
  tags: ["售前工程师"],
};

describe("matchesPost", () => {
  it("matches title, description, and tags case-insensitively", () => {
    expect(matchesPost(item, "售前", "全部")).toBe(true);
    expect(matchesPost(item, "交付", "全部")).toBe(true);
    expect(matchesPost(item, "ai", "全部")).toBe(true);
  });

  it("honors the selected category", () => {
    expect(matchesPost(item, "", "行业观察")).toBe(true);
    expect(matchesPost(item, "", "项目复盘")).toBe(false);
  });
});
