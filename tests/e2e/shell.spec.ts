import { expect, test } from '@playwright/test';

test('renders the Chinese document shell', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/尹禹皓/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('main')).toBeVisible();
});
