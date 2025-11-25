
import { test, expect } from '@playwright/test';

test('homepage smoke test', async ({ page }) => {
  await page.goto('/');

  // Wait for the loading overlay to disappear
  const loadingOverlay = page.getByRole('dialog', { name: 'Processing your request...' });
  await expect(loadingOverlay).toBeHidden({ timeout: 10000 }); // Increased timeout for safety

  // Now, assert that the main heading is visible
  const heading = page.getByRole('heading', { name: 'The Ultimate PDF Power Toolbox' });
  await expect(heading).toBeVisible();
});
