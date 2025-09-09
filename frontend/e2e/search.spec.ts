import { test, expect } from '@playwright/test';

test.describe('Search functionality', () => {
  test('should filter companies by search term', async ({ page }) => {
    await page.goto('/search');
    
    // Initially should show all companies
    const initialCards = await page.locator('.company-card').count();
    expect(initialCards).toBeGreaterThan(0);
    
    // Search for specific company
    await page.fill('input[placeholder*="Search"]', 'Very Cool');
    
    // Should show filtered results
    await expect(page.locator('.company-card')).toHaveCount(1);
    await expect(page.locator('text=Very Cool Company')).toBeVisible();
    
    // Search for non-existent term
    await page.fill('input[placeholder*="Search"]', 'NonExistent');
    await expect(page.locator('text=No companies found')).toBeVisible();
  });

  test('should search by tags', async ({ page }) => {
    await page.goto('/search');
    
    // Search by technology tag
    await page.fill('input[placeholder*="Search"]', 'AI');
    
    // Should show companies with AI tag
    await expect(page.locator('.company-card')).toHaveCount(1);
    await expect(page.locator('text=Very Cool Company')).toBeVisible();
  });
});