import { describe, expect, it } from "vitest";

describe("estimateReadingMinutes", () => {
  it("counts Chinese characters at 300 characters per minute", async () => {
    const { estimateReadingMinutes } =
      await import("../../src/lib/reading-time");

    expect(estimateReadingMinutes("项".repeat(301))).toBe(2);
  });

  it("counts Latin words at 200 words per minute", async () => {
    const { estimateReadingMinutes } =
      await import("../../src/lib/reading-time");

    expect(
      estimateReadingMinutes(
        Array.from({ length: 201 }, () => "delivery").join(" "),
      ),
    ).toBe(2);
  });

  it("combines Chinese and Latin reading durations deterministically", async () => {
    const { estimateReadingMinutes } =
      await import("../../src/lib/reading-time");

    expect(
      estimateReadingMinutes(
        `${"项".repeat(180)} ${Array.from({ length: 100 }, () => "AI").join(" ")}`,
      ),
    ).toBe(2);
  });
});
