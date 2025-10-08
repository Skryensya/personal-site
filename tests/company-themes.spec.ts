import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    debugThemes?: () => void;
  }
}

test.describe('Company Theme System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to load and theme system to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_READY__ === true, { timeout: 10000 });
  });

  test('should activate company theme via ?theme=chipax URL parameter', async ({ page }) => {
    // Navigate to page with company theme parameter
    await page.goto('/?theme=chipax');
    await page.waitForLoadState('networkidle');
    
    // Wait for theme to be applied
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    // Check that the theme was applied
    const themeId = await page.evaluate(() => window.__THEME_ID__);
    expect(themeId).toBe('chipax');
    
    // Check that the URL parameter was cleaned up
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('theme=chipax');
    
    // Verify theme colors are applied correctly
    const mainColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim();
    });
    
    const secondaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim();
    });
    
    // Chipax theme colors should be applied
    expect(mainColor).toBeTruthy();
    expect(secondaryColor).toBeTruthy();
  });

  test('should activate company theme via legacy ?chipax URL parameter', async ({ page }) => {
    // Navigate to page with legacy company theme parameter
    await page.goto('/?chipax');
    await page.waitForLoadState('networkidle');
    
    // Wait for theme to be applied
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    // Check that the theme was applied
    const themeId = await page.evaluate(() => window.__THEME_ID__);
    expect(themeId).toBe('chipax');
    
    // Check that the URL parameter was cleaned up
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('chipax');
  });

  test('should show company theme first in dropdown when active', async ({ page }) => {
    // Activate chipax theme
    await page.goto('/?theme=chipax');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    // Wait a bit more for company theme event to process
    await page.waitForTimeout(200);
    
    // Debug the current state
    await page.evaluate(() => {
      if (window.debugThemes) {
        window.debugThemes();
      }
    });
    
    // Open theme dropdown
    const themeButton = page.locator('#theme-control button').first();
    await themeButton.click();
    
    // Wait for dropdown to open
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    // Get all theme buttons in order
    const themeButtons = await page.locator('[data-theme-button]').all();
    const themeIds = await Promise.all(
      themeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    console.log('Theme IDs in dropdown:', themeIds);
    
    // Company theme should be FIRST
    expect(themeIds[0]).toBe('chipax');
    
    // Verify it's not appearing anywhere else in the list
    const chipaxOccurrences = themeIds.filter(id => id === 'chipax').length;
    expect(chipaxOccurrences).toBe(1);
    
    // Close dropdown
    await page.keyboard.press('Escape');
    
    // Now test with skyward-ai theme
    await page.goto('/?theme=skyward-ai');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'skyward-ai', { timeout: 5000 });
    
    // Wait for company theme event to process
    await page.waitForTimeout(200);
    
    // Open dropdown again
    await themeButton.click();
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    // Get theme order again
    const newThemeButtons = await page.locator('[data-theme-button]').all();
    const newThemeIds = await Promise.all(
      newThemeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    console.log('New theme IDs in dropdown:', newThemeIds);
    
    // Skyward-ai should now be first, chipax shouldn't be visible
    expect(newThemeIds[0]).toBe('skyward-ai');
    expect(newThemeIds).not.toContain('chipax');
  });

  test('should show only one company theme in dropdown when active', async ({ page }) => {
    // Activate chipax theme
    await page.goto('/?theme=chipax');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    // Open theme dropdown
    const themeButton = page.locator('#theme-control button').first();
    await themeButton.click();
    
    // Wait for dropdown to open
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    // Count company themes in dropdown
    const companyThemes = await page.locator('[data-theme-button]').all();
    const companyThemeIds = await Promise.all(
      companyThemes.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    // Should only show chipax, not skyward-ai
    const chipaxCount = companyThemeIds.filter(id => id === 'chipax').length;
    const skywardCount = companyThemeIds.filter(id => id === 'skyward-ai').length;
    
    expect(chipaxCount).toBe(1);
    expect(skywardCount).toBe(0);
  });

  test('should persist company theme across page navigation', async ({ page }) => {
    // Activate company theme
    await page.goto('/?theme=skyward-ai');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'skyward-ai', { timeout: 5000 });
    
    // Navigate to another page
    await page.goto('/proyectos');
    await page.waitForLoadState('networkidle');
    
    // Wait for theme system to initialize
    await page.waitForFunction(() => window.__THEME_READY__ === true, { timeout: 10000 });
    
    // Check that company theme persisted
    const themeId = await page.evaluate(() => window.__THEME_ID__);
    expect(themeId).toBe('skyward-ai');
    
    // Check localStorage
    const savedThemeId = await page.evaluate(() => localStorage.getItem('theme-id'));
    expect(savedThemeId).toBe('skyward-ai');
  });

  test('should switch between company themes when different URLs are accessed', async ({ page }) => {
    // Start with chipax
    await page.goto('/?theme=chipax');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    let themeId = await page.evaluate(() => window.__THEME_ID__);
    expect(themeId).toBe('chipax');
    
    // Switch to skyward-ai
    await page.goto('/?theme=skyward-ai');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'skyward-ai', { timeout: 5000 });
    
    themeId = await page.evaluate(() => window.__THEME_ID__);
    expect(themeId).toBe('skyward-ai');
  });

  test('should persist special themes visibility after konami code', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_READY__ === true, { timeout: 10000 });
    
    // Verify special themes are not visible initially
    const themeButton = page.locator('#theme-control button').first();
    await themeButton.click();
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    let themeButtons = await page.locator('[data-theme-button]').all();
    let themeIds = await Promise.all(
      themeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    // Special themes should not be visible initially
    const specialThemes = ['matrix', 'vaporwave', 'cyberpunk', 'ocean', 'sage', 'rose'];
    let hasSpecialThemes = specialThemes.some(id => themeIds.includes(id));
    expect(hasSpecialThemes).toBe(false);
    
    // Close dropdown
    await page.keyboard.press('Escape');
    
    // Execute konami code to unlock special themes
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
      await page.waitForTimeout(50);
    }
    
    // Wait for themes to unlock
    await page.waitForTimeout(1000);
    
    // Open dropdown again and verify special themes are now visible
    await themeButton.click();
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    themeButtons = await page.locator('[data-theme-button]').all();
    themeIds = await Promise.all(
      themeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    // Special themes should now be visible
    hasSpecialThemes = specialThemes.some(id => themeIds.includes(id));
    expect(hasSpecialThemes).toBe(true);
    
    // Close dropdown
    await page.keyboard.press('Escape');
    
    // Navigate to another page to test persistence
    await page.goto('/proyectos');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_READY__ === true, { timeout: 10000 });
    
    // Open dropdown and verify special themes are still visible
    const themeButtonProjects = page.locator('#theme-control button').first();
    await themeButtonProjects.click();
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    const persistentThemeButtons = await page.locator('[data-theme-button]').all();
    const persistentThemeIds = await Promise.all(
      persistentThemeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    // Special themes should still be visible after navigation
    const stillHasSpecialThemes = specialThemes.some(id => persistentThemeIds.includes(id));
    expect(stillHasSpecialThemes).toBe(true);
    
    // Close dropdown
    await page.keyboard.press('Escape');
    
    // Execute konami code again to hide special themes
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
      await page.waitForTimeout(50);
    }
    
    // Wait for themes to lock
    await page.waitForTimeout(1000);
    
    // Open dropdown and verify special themes are now hidden
    await themeButtonProjects.click();
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    const hiddenThemeButtons = await page.locator('[data-theme-button]').all();
    const hiddenThemeIds = await Promise.all(
      hiddenThemeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    // Special themes should now be hidden again
    const noSpecialThemes = specialThemes.every(id => !hiddenThemeIds.includes(id));
    expect(noSpecialThemes).toBe(true);
  });

  test('should show themes in correct order: company → normal → special', async ({ page }) => {
    // Activate konami code to unlock special themes
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate konami code sequence
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
      await page.waitForTimeout(50);
    }
    
    // Wait for special themes to unlock
    await page.waitForTimeout(1000);
    
    // Now activate a company theme
    await page.goto('/?theme=chipax');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    // Open theme dropdown
    const themeButton = page.locator('#theme-control button').first();
    await themeButton.click();
    
    // Wait for dropdown to open
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    // Get all theme buttons in order
    const themeButtons = await page.locator('[data-theme-button]').all();
    const themeIds = await Promise.all(
      themeButtons.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    // Verify order: company theme first, then normal themes, then special themes
    expect(themeIds[0]).toBe('chipax'); // Company theme first
    
    // Find where normal themes start (should be after company themes)
    const normalThemes = ['dos', 'banana', 'gameboy', 'commodore64', 'kurumi'];
    const firstNormalIndex = themeIds.findIndex(id => normalThemes.includes(id!));
    expect(firstNormalIndex).toBeGreaterThan(0); // Should come after company theme
    
    // Find where special themes start
    const specialThemes = ['matrix', 'vaporwave', 'cyberpunk', 'ocean', 'sage', 'rose'];
    const firstSpecialIndex = themeIds.findIndex(id => specialThemes.includes(id!));
    expect(firstSpecialIndex).toBeGreaterThan(firstNormalIndex); // Should come after normal themes
  });

  test('should handle invalid company theme parameter gracefully', async ({ page }) => {
    // Try to activate non-existent company theme
    await page.goto('/?theme=nonexistent');
    await page.waitForLoadState('networkidle');
    
    // Should fallback to a valid theme
    await page.waitForFunction(() => window.__THEME_READY__ === true, { timeout: 10000 });
    
    const themeId = await page.evaluate(() => window.__THEME_ID__);
    expect(themeId).not.toBe('nonexistent');
    
    // Should be a valid theme
    const validThemes = ['dos', 'banana', 'gameboy', 'commodore64', 'kurumi'];
    expect(validThemes).toContain(themeId);
  });

  test('should remove company theme exclusivity when switching to normal theme', async ({ page }) => {
    // Start with company theme
    await page.goto('/?theme=chipax');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.__THEME_ID__ === 'chipax', { timeout: 5000 });
    
    // Open dropdown and select a normal theme
    const themeButton = page.locator('#theme-control button').first();
    await themeButton.click();
    
    // Wait for dropdown and click a normal theme
    await page.waitForSelector('[data-theme-button][data-theme-id="dos"]', { state: 'visible' });
    await page.click('[data-theme-button][data-theme-id="dos"]');
    
    // Wait for theme change
    await page.waitForFunction(() => window.__THEME_ID__ === 'dos', { timeout: 5000 });
    
    // Open dropdown again to check available themes
    await themeButton.click();
    await page.waitForSelector('[data-theme-button]', { state: 'visible' });
    
    // Company themes should not be visible anymore (neither chipax nor skyward-ai)
    const companyThemes = await page.locator('[data-theme-button]').all();
    const companyThemeIds = await Promise.all(
      companyThemes.map(theme => theme.getAttribute('data-theme-id'))
    );
    
    expect(companyThemeIds).not.toContain('chipax');
    expect(companyThemeIds).not.toContain('skyward-ai');
  });
});
