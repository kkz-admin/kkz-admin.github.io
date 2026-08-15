import { expect, test } from "@playwright/test";

test("filters blog posts without navigation", async ({ page }) => {
  await page.goto("/blog/");

  await expect(page).toHaveTitle("博客 · 尹禹皓");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(
    page.getByRole("complementary", { name: "文章归档" }),
  ).toContainText("2026 · 3 篇");

  const categoryLinks = page
    .getByRole("group", { name: "文章分类" })
    .getByRole("link");
  const expectSingleActiveCategory = async (name: string) => {
    const states = await categoryLinks.evaluateAll((links) =>
      links.map((link) => ({
        name: link.textContent?.trim(),
        active: link.getAttribute("data-active"),
        current: link.getAttribute("aria-current"),
        background: getComputedStyle(link).backgroundColor,
      })),
    );
    const active = states.filter(({ active }) => active === "true");

    expect(active.map((item) => item.name)).toEqual([name]);
    expect(
      states
        .filter(({ current }) => current === "page")
        .map((item) => item.name),
    ).toEqual([name]);
    expect(
      states
        .filter(({ background }) => background === active[0].background)
        .map((item) => item.name),
    ).toEqual([name]);
    expect(states.filter(({ active }) => active === "false")).toHaveLength(3);
  };

  await expectSingleActiveCategory("全部");

  const industryCategory = page
    .getByRole("link", { name: "行业观察", exact: true })
    .first();
  await industryCategory.click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(industryCategory).toHaveAttribute("aria-current", "page");
  await expectSingleActiveCategory("行业观察");
  await expect(page.getByRole("article")).toHaveCount(1);

  await page.getByRole("searchbox", { name: "搜索文章" }).fill("Codex");
  await expect(page.getByRole("article")).toHaveCount(0);

  await page.getByRole("button", { name: "#售前工程师" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("follows category and archive browsing paths without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/blog/");
  await page
    .getByRole("link", { name: "行业观察", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/blog\/category\/industry-observation\/$/);
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("article").getByRole("link", { name: /实施工程师/ }),
  ).toBeVisible();

  await page.goto("/blog/");
  await page
    .getByRole("link", { name: "2026 · 3 篇", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/blog\/archive\/2026\/$/);
  await expect(page.getByRole("article")).toHaveCount(3);

  await context.close();
});
