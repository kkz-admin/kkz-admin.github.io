import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

describe("public resume verification", () => {
  it("detects a mainland mobile number split by spaces or hyphens", async () => {
    const verifier = await import("../../scripts/verify-public-resume.mjs");
    const formattedMobile = ["18", "8-", "000", "0 ", "00", "00"].join("");

    expect(
      verifier.containsMainlandMobile(`联系电话：${formattedMobile}`),
    ).toBe(true);
  });

  it("rejects content that does not match the reviewed SHA-256", async () => {
    const verifier = await import("../../scripts/verify-public-resume.mjs");
    const reviewed = Buffer.from("reviewed public resume");
    const expectedHash = createHash("sha256")
      .update(reviewed)
      .digest("hex")
      .toUpperCase();

    expect(() =>
      verifier.assertReviewedResumeHash(
        Buffer.from("unreviewed replacement"),
        expectedHash,
      ),
    ).toThrow(/reviewed SHA-256/);
  });
});
