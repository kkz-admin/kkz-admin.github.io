import fs from "node:fs/promises";
import pdf from "pdf-parse/lib/pdf-parse.js";

const resumePath = new URL(
  "../public/resume/yin-yuhao-resume.pdf",
  import.meta.url,
);
const buffer = await fs.readFile(resumePath);
const { text } = await pdf(buffer);

if (/1[3-9]\d{9}/.test(text)) {
  throw new Error("Public resume still contains the private phone number");
}
if (!text.includes("kkz2799020912@gmail.com")) {
  throw new Error("Public resume must retain the recruitment email");
}
console.log("Public resume privacy check passed");
