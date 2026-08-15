import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pdf from "pdf-parse/lib/pdf-parse.js";

export const REVIEWED_RESUME_SHA256 =
  "CC3E9278FE66325F1E4A82F7D67AB2E350801E198C77C730130F01D49CF2B4AA";

export function containsMainlandMobile(text) {
  const normalized = text.replace(/(?<=\d)[\s-]+(?=\d)/g, "");
  return /(?:^|\D)1[3-9]\d{9}(?:\D|$)/.test(normalized);
}

export function assertReviewedResumeHash(
  buffer,
  expectedHash = REVIEWED_RESUME_SHA256,
) {
  const actualHash = createHash("sha256")
    .update(buffer)
    .digest("hex")
    .toUpperCase();
  if (actualHash !== expectedHash.toUpperCase()) {
    throw new Error("Public resume does not match the reviewed SHA-256");
  }
}

export function assertPublicResumeText(text) {
  if (containsMainlandMobile(text)) {
    throw new Error("Public resume contains a mainland mobile number");
  }
  if (!text.includes("kkz2799020912@gmail.com")) {
    throw new Error("Public resume must retain the recruitment email");
  }
}

const resumePath = new URL(
  "../public/resume/yin-yuhao-resume.pdf",
  import.meta.url,
);
async function main() {
  const buffer = await fs.readFile(resumePath);
  assertReviewedResumeHash(buffer);
  const { text } = await pdf(buffer);
  assertPublicResumeText(text);
  console.log("Public resume privacy and review check passed");
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  await main();
}
