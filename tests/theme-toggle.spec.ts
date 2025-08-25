import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load and theme system to initialize
    await page.waitForLoadState('networkidle');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Wait for the theme control to be ready
    await page.waitForFunction(() => window.__THEME_MODE__ !== undefined, { timeout: 10000 });
    
    // Find the theme toggle button - it's the main button in the DropdownButton (left side)
    const themeToggle = page.locator('button').filter({ hasText: /LIGHT|DARK|SYSTEM/i }).first();
    
    // Wait for the button to be visible
    await expect(themeToggle).toBeVisible();
    
    // Get initial theme state
    const initialHtmlClass = await page.locator('html').getAttribute('class');
    const initialDataTheme = await page.locator('html').getAttribute('data-theme');
    
    console.log('Initial state:', { initialHtmlClass, initialDataTheme });
    
    // Click the theme toggle
    await themeToggle.click();
    
    // Wait for theme change to apply
    await page.waitForTimeout(100);
    
    // Get new theme state
    const newHtmlClass = await page.locator('html').getAttribute('class');
    const newDataTheme = await page.locator('html').getAttribute('data-theme');
    
    console.log('After toggle:', { newHtmlClass, newDataTheme });
    
    // Check that the theme has changed
    // The theme system toggles the 'dark' class on the html element
    const initialIsDark = initialHtmlClass?.includes('dark') || false;
    const newIsDark = newHtmlClass?.includes('dark') || false;
    
    expect(initialIsDark).not.toBe(newIsDark);
    
    // Click again to toggle back
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const finalHtmlClass = await page.locator('html').getAttribute('class');
    const finalIsDark = finalHtmlClass?.includes('dark') || false;
    
    // Should be back to original state after two clicks
    expect(finalIsDark).toBe(initialIsDark);
  });

  test('should persist theme preference across page reloads', async ({ page }) => {
    // Wait for the theme control to be ready
    await page.waitForFunction(() => window.__THEME_MODE__ !== undefined, { timeout: 10000 });
    
    // Find the theme toggle button
    const themeToggle = page.locator('button').filter({ hasText: /LIGHT|DARK|SYSTEM/i }).first();
    await expect(themeToggle).toBeVisible();
    
    // Get initial state
    const initialHtmlClass = await page.locator('html').getAttribute('class');
    const initialIsDark = initialHtmlClass?.includes('dark') || false;
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Verify theme changed
    const toggledHtmlClass = await page.locator('html').getAttribute('class');
    const toggledIsDark = toggledHtmlClass?.includes('dark') || false;
    expect(toggledIsDark).not.toBe(initialIsDark);
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that theme preference persisted
    const reloadedHtmlClass = await page.locator('html').getAttribute('class');
    const reloadedIsDark = reloadedHtmlClass?.includes('dark') || false;
    
    expect(reloadedIsDark).toBe(toggledIsDark);
  });

  test('should apply correct CSS custom properties for theme colors', async ({ page }) => {
    // Check that CSS custom properties are set correctly
    const mainColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim();
    });
    
    const secondaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();
    });
    
    // Should have valid color values
    expect(mainColor).toBeTruthy();
    expect(secondaryColor).toBeTruthy();
    expect(mainColor).not.toBe(secondaryColor);
    
    // Find the theme toggle and click it
    const themeToggle = page.locator('button').filter({ hasText: /LIGHT|DARK|SYSTEM/i }).first();
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Check that colors changed after toggle
    const newMainColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim();
    });
    
    const newSecondaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();
    });
    
    // Colors should be swapped after theme toggle
    expect(newMainColor).toBe(secondaryColor);
    expect(newSecondaryColor).toBe(mainColor);
  });

  test('should update localStorage with theme preferences', async ({ page }) => {
    // Get initial localStorage values
    const initialThemeMode = await page.evaluate(() => localStorage.getItem('theme-mode'));
    
    // Find and click theme toggle
    const themeToggle = page.locator('button').filter({ hasText: /LIGHT|DARK|SYSTEM/i }).first();
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Check that localStorage was updated
    const newThemeMode = await page.evaluate(() => localStorage.getItem('theme-mode'));
    
    expect(newThemeMode).toBeTruthy();
    expect(newThemeMode).not.toBe(initialThemeMode);
    
    // Should be either 'light' or 'dark'
    expect(['light', 'dark']).toContain(newThemeMode);
  });

  test('should have accessible theme toggle button', async ({ page }) => {
    // Wait for the theme control to be ready
    await page.waitForFunction(() => window.__THEME_MODE__ !== undefined, { timeout: 10000 });
    
    // Find the theme toggle button
    const themeToggle = page.locator('button').filter({ hasText: /LIGHT|DARK|SYSTEM/i }).first();
    
    // Should be visible and focusable
    await expect(themeToggle).toBeVisible();
    await themeToggle.focus();
    await expect(themeToggle).toBeFocused();
    
    // Should be clickable
    await expect(themeToggle).toBeEnabled();
    
    // Should have some form of accessible text/label
    const buttonText = await themeToggle.textContent();
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    const title = await themeToggle.getAttribute('title');
    
    // Should have at least one form of accessible text
    expect(buttonText || ariaLabel || title).toBeTruthy();
  });
});