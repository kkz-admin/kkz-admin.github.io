import { expect, test } from "@playwright/test";

test("presents career positioning and a downloadable resume", async ({
  page,
}) => {
  await page.goto("/about/");
  await expect(
    page.getByRole("heading", { level: 1, name: "关于我" }),
  ).toBeVisible();
  await expect(page.getByText("售前工程师")).toBeVisible();
  await expect(
    page.getByText("目标岗位：项目助理、实施工程师、项目管理、售前工程师。"),
  ).toBeVisible();
  const resume = page.getByRole("link", { name: "下载公开版简历" });
  await expect(resume).toHaveAttribute("href", /yin-yuhao-resume\.pdf$/);
  await expect(page.locator("body")).not.toContainText(/1[3-9]\d{9}/);

  const timelineItems = page.locator(".timeline > li");
  await expect(timelineItems.nth(-2)).toContainText("校园网络中心");
  await expect(timelineItems.nth(-1)).toContainText("北京理工大学珠海学院");
  const resumeSummary = page.locator(".resume-summary");
  await expect(page.getByRole("heading", { name: "简历摘要" })).toBeVisible();
  await expect(
    resumeSummary.getByText("网络工程", { exact: true }),
  ).toBeVisible();
  await expect(
    resumeSummary.getByText("2022.09—2026.06", { exact: true }),
  ).toBeVisible();
});

test("preserves the portrait aspect ratio", async ({ page }) => {
  await page.goto("/about/");
  const ratios = await page.getByAltText("尹禹皓职业照片").evaluate((image) => {
    const portrait = image as HTMLImageElement;
    return {
      displayed: portrait.clientWidth / portrait.clientHeight,
      natural: portrait.naturalWidth / portrait.naturalHeight,
    };
  });

  expect(Math.abs(ratios.displayed - ratios.natural)).toBeLessThan(0.01);
});
