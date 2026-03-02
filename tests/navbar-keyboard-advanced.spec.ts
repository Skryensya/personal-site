import { test, expect } from '@playwright/test';

async function activeText(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return {
      id: el?.id ?? '',
      text: (el?.textContent ?? '').trim(),
      tag: el?.tagName?.toLowerCase() ?? ''
    };
  });
}

test.describe('Navbar advanced keyboard behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('tab order starts at skip link then moves into primary nav', async ({ page }) => {
    await page.keyboard.press('Tab');
    let current = await activeText(page);
    expect(current.id).toBe('skip-to-content-desktop');

    await page.keyboard.press('Tab');
    current = await activeText(page);
    expect(current.text.length).toBeGreaterThan(0);
    expect(current.text).toMatch(/Allison Peña/i);
  });

  test('dropdown trigger opens with Enter and Space', async ({ page }) => {
    const modeTrigger = page.locator('#dropdown-button-mode-control');
    const modeMenu = page.locator('#dropdown-menu-mode-control');

    await modeTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(modeMenu).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modeMenu).toBeHidden();

    await modeTrigger.focus();
    await page.keyboard.press(' ');
    await expect(modeMenu).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modeMenu).toBeHidden();
  });

  test('dropdown supports Home/End navigation', async ({ page }) => {
    const modeTrigger = page.locator('#dropdown-button-mode-control');
    const modeMenu = page.locator('#dropdown-menu-mode-control');

    await modeTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(modeMenu).toBeVisible();

    await page.keyboard.press('End');
    let activeItem = modeMenu.locator('[role="menuitem"][data-active="true"]');
    await expect(activeItem).toHaveCount(1);

    await page.keyboard.press('Home');
    activeItem = modeMenu.locator('[role="menuitem"][data-active="true"]');
    await expect(activeItem).toHaveCount(1);

    const firstText = ((await activeItem.first().textContent()) ?? '').trim();
    expect(firstText.length).toBeGreaterThan(0);
  });

  test('language dropdown supports typeahead', async ({ page }) => {
    const langTrigger = page.locator('#dropdown-button-language-control');
    const langMenu = page.locator('#dropdown-menu-language-control');

    await langTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(langMenu).toBeVisible();

    await page.keyboard.press('n');

    const activeItem = langMenu.locator('[role="menuitem"][data-active="true"]');
    await expect(activeItem).toHaveCount(1);

    const text = ((await activeItem.first().textContent()) ?? '').toLowerCase();
    expect(text).toContain('n');
  });

  test('dropdown does not trap focus: Shift+Tab closes and returns focus to trigger', async ({ page }) => {
    const modeTrigger = page.locator('#dropdown-button-mode-control');
    const modeMenu = page.locator('#dropdown-menu-mode-control');

    await modeTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(modeMenu).toBeVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(modeMenu).toBeHidden();
    await expect(modeTrigger).toBeFocused();
  });
});
