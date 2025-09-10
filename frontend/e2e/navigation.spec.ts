import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Check home page
    await expect(page.locator('h2')).toContainText('Our mission');
    
    // Navigate to Discover
    await page.click('text=Discover');
    await expect(page.locator('h1')).toContainText('Companies');
    
    // Navigate to Search  
    await page.click('text=Search');
    await expect(page.locator('h1')).toContainText('Search Companies');
    
    // Navigate to Profile
    await page.click('text=Profile');
    await expect(page.locator('h1')).toContainText('John Doe');
  });

  test('should show active navigation state', async ({ page }) => {
    await page.goto('/');
    
    // Check active state on home
    const homeNav = page.locator('a[href="/"]').first();
    await expect(homeNav).toHaveClass(/nav-item--active/);
    
    // Navigate and check active state changes
    await page.click('text=Discover');
    const discoverNav = page.locator('a[href="/discover"]').first();
    await expect(discoverNav).toHaveClass(/nav-item--active/);
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav item
    
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    // Enter should activate navigation
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/');
  });
});