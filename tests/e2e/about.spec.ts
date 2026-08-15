import { expect, test } from '@playwright/test';

test('presents career positioning and a downloadable resume', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1, name: '关于我' })).toBeVisible();
  await expect(page.getByText('售前工程师')).toBeVisible();
  await expect(
    page.getByText('目标岗位：项目助理、实施工程师、项目管理、售前工程师。'),
  ).toBeVisible();
  const resume = page.getByRole('link', { name: '下载公开版简历' });
  await expect(resume).toHaveAttribute('href', /yin-yuhao-resume\.pdf$/);
  await expect(page.locator('body')).not.toContainText(/1[3-9]\d{9}/);
});
