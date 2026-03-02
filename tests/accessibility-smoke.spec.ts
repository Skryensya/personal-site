import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/proyectos',
  '/declaracion-de-accesibilidad',
  '/sistema-de-diseno'
];

test.describe('Accessibility smoke checks', () => {
  for (const path of pages) {
    test(`has no critical WCAG issues on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const criticalOnly = accessibilityScanResults.violations.filter(
        (violation) => violation.impact === 'critical'
      );

      expect(
        criticalOnly,
        criticalOnly
          .map((v) => `${v.id} (${v.impact}) -> ${v.help}`)
          .join('\n')
      ).toEqual([]);
    });
  }
});
