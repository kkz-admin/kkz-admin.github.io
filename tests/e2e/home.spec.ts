import { expect, test } from "@playwright/test";

test("renders the approved A1 hierarchy", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "让复杂工作，成为可交付、可复用的系统。",
  );
  await expect(page.getByRole("heading", { name: "本期精选" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "代表项目" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "最近文章" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "关于我" })).toBeVisible();

  const hero = page.locator(".moon-hero");
  await expect(hero.getByText("项目管理")).toBeVisible();
  await expect(hero.getByText("售前协同")).toBeVisible();
});
