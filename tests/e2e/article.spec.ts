import { expect, test } from "@playwright/test";

test("renders article metadata, contents, and related reading", async ({
  page,
}) => {
  await page.goto("/blog/1500-works-delivery/");
  await expect(page).toHaveTitle(/· 尹禹皓$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("1500+");
  await expect(
    page.getByRole("navigation", { name: "文章目录" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "相关阅读" })).toBeVisible();
  await expect(page.locator("article > header > .eyebrow")).toHaveText(
    "项目复盘",
  );
});
