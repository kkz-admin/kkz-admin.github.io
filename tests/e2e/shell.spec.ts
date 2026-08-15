import { expect, test } from "@playwright/test";

test("renders the accessible three-item navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/尹禹皓/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  const navigation = page.getByRole("navigation", { name: "主导航" });
  await expect(navigation.getByRole("link")).toHaveCount(3);
  await expect(navigation.getByRole("link", { name: "首页" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "博客" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "关于" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "留言" })).toHaveCount(0);
  await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1);
  await expect(navigation.getByRole("link", { name: "首页" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("keeps a keyboard-visible skip link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "跳到正文" })).toBeFocused();
});
