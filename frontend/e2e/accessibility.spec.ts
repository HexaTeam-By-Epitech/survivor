import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have skip link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to skip link
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('.skip-link:focus');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toContainText('Skip to main content');
  });

  test('should have proper headings hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading structure
    const h1 = page.locator('h1');
    const h2 = page.locator('h2').first();
    const h3 = page.locator('h3').first();
    
    await expect(h2).toBeVisible();
    
    // Navigate to discover page to check h1
    await page.click('text=Discover');
    await expect(page.locator('h1')).toContainText('Companies');
  });

  test('should have aria-current on active navigation', async ({ page }) => {
    await page.goto('/');
    
    const activeNav = page.locator('[aria-current="page"]');
    await expect(activeNav).toBeVisible();
    
    // Navigate and check aria-current updates
    await page.click('text=Discover');
    const newActiveNav = page.locator('[aria-current="page"]');
    await expect(newActiveNav).toHaveAttribute('href', '/discover');
  });
});