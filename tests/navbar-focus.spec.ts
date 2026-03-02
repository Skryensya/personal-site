import { test, expect } from '@playwright/test';

test.describe('Navbar focus and keyboard behavior', () => {
  test('desktop: first Tab reaches skip link and Enter moves focus to main content', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');

    const activeId = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.id ?? '');
    expect(activeId).toBe('skip-to-content-desktop');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(350);

    const focusedTarget = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        id: el?.id ?? null,
        hasSkipAttr: !!el?.hasAttribute('data-skip-target')
      };
    });

    expect(focusedTarget.hasSkipAttr).toBeTruthy();
    expect(focusedTarget.id).toBeTruthy();

    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toContain('#');
  });

  test('desktop: mobile trigger is hidden from keyboard/screen readers', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mobileTrigger = page.locator('#mobile-menu-trigger');
    await expect(mobileTrigger).toHaveAttribute('tabindex', '-1');
    await expect(mobileTrigger).toHaveAttribute('aria-hidden', 'true');
  });

  test('mobile: menu items are not focusable while closed, become focusable when opened', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuTrigger = page.locator('#mobile-menu-trigger');
    await expect(menuTrigger).toBeVisible();
    await expect(menuTrigger).not.toHaveAttribute('aria-hidden', 'true');

    const firstMobileProjectLink = page.locator('#mobile-dropdown a[href="/curriculum.pdf"]').first();
    await expect(firstMobileProjectLink).toHaveAttribute('tabindex', '-1');

    await menuTrigger.click();
    await expect(page.locator('#mobile-dropdown')).toHaveCSS('pointer-events', 'auto');
    await expect(firstMobileProjectLink).not.toHaveAttribute('tabindex', '-1');

    await page.locator('#mobile-backdrop').click({ force: true });
    await expect(page.locator('#mobile-dropdown')).toHaveCSS('pointer-events', 'none');
    await expect(firstMobileProjectLink).toHaveAttribute('tabindex', '-1');
  });

  test('navbar keeps one current-page indicator in primary nav on home', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const currentPageLinks = page.locator('div.hidden.lg\\:flex.items-start [aria-current="page"]');
    await expect(currentPageLinks).toHaveCount(1);

    const currentText = (await currentPageLinks.first().innerText()).trim();
    expect(currentText.length).toBeGreaterThan(0);
  });

  test('desktop: keyboard-opened dropdown shows keyboard hint (Up/Down)', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const modeDropdownButton = page.locator('#dropdown-button-mode-control');
    const modeDropdownMenu = page.locator('#dropdown-menu-mode-control');
    const keyboardHint = modeDropdownMenu.locator('.dropdown-keyboard-hint');

    await modeDropdownButton.focus();
    await expect(modeDropdownButton).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(modeDropdownMenu).toBeVisible();
    await expect(keyboardHint).toBeVisible();

    // Ensure hint shows KBD shortcuts for arrow navigation
    await expect(keyboardHint).toContainText(/Navigate|Navegar|Naviger/i);

    await page.keyboard.press('Escape');
    await expect(modeDropdownMenu).toBeHidden();
  });

  test('desktop: pointer-opened dropdown keeps keyboard hint hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const langDropdownButton = page.locator('#dropdown-button-language-control');
    const langDropdownMenu = page.locator('#dropdown-menu-language-control');
    const keyboardHint = langDropdownMenu.locator('.dropdown-keyboard-hint');

    await langDropdownButton.click();
    await expect(langDropdownMenu).toBeVisible();
    await expect(keyboardHint).toBeHidden();

    await page.keyboard.press('Escape');
    await expect(langDropdownMenu).toBeHidden();
  });

  test('mobile: Escape closes menu and returns focus to trigger', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuTrigger = page.locator('#mobile-menu-trigger');
    const mobileDropdown = page.locator('#mobile-dropdown');

    await menuTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(mobileDropdown).toHaveCSS('pointer-events', 'auto');

    await page.keyboard.press('Escape');
    await expect(mobileDropdown).toHaveCSS('pointer-events', 'none');
    await expect(menuTrigger).toBeFocused();
  });
});
