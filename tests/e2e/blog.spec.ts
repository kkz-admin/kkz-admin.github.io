import { expect, test } from "@playwright/test";

test("filters blog posts without navigation", async ({ page }) => {
  await page.goto("/blog/");

  await expect(page).toHaveTitle("博客 · 尹禹皓");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(
    page.getByRole("complementary", { name: "文章归档" }),
  ).toContainText("2026 · 3 篇");

  await page.getByRole("button", { name: "行业观察" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);

  await page.getByRole("searchbox", { name: "搜索文章" }).fill("Codex");
  await expect(page.getByRole("article")).toHaveCount(0);

  await page.getByRole("button", { name: "#售前工程师" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("keeps all article cards and links readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/blog/");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("article").getByRole("link")).toHaveCount(3);

  await context.close();
});
