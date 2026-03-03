import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AllowRule = {
  id: string;
  targetIncludes?: string;
};

const deepPages = [
  '/',
  '/proyectos',
  '/proyectos/skryensya-dev',
  '/declaracion-de-accesibilidad',
  '/sistema-de-diseno',
  '/en/',
  '/en/projects',
  '/en/projects/skryensya-dev',
  '/en/accessibility-statement',
  '/no/',
  '/no/prosjekter',
  '/no/prosjekter/skryensya-dev',
  '/no/tilgjengelighetserklaering',
  '/ja/',
  '/ja/projects',
  '/ja/projects/skryensya-dev',
  '/ja/accessibility-statement',
  '/ja/design-system'
];

const allowlistByPath: Record<string, AllowRule[]> = {
  '/sistema-de-diseno': [
    { id: 'nested-interactive', targetIncludes: 'div[data-anchor-id="theme-' }
  ],
  '/ja/design-system': [
    { id: 'nested-interactive', targetIncludes: 'data-theme-id="' }
  ]
};

function isAllowed(path: string, ruleId: string, targets: string[]): boolean {
  const rules = allowlistByPath[path] ?? [];
  return rules.some((rule) => {
    if (rule.id !== ruleId) return false;
    if (!rule.targetIncludes) return true;
    return targets.some((target) => target.includes(rule.targetIncludes!));
  });
}

test.describe('Accessibility deep checks', () => {
  for (const path of deepPages) {
    test(`deep a11y coverage on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Structural sanity checks (quick high-impact guards)
      await expect(page.locator('main')).toHaveCount(1);
      expect(await page.locator('h1').count()).toBeGreaterThan(0);

      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const seriousOrCritical = scan.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical'
      );

      const unexpected = seriousOrCritical
        .map((violation) => {
          const nodes = violation.nodes.filter((node) => !isAllowed(path, violation.id, node.target));
          if (nodes.length === 0) return null;
          return {
            id: violation.id,
            impact: violation.impact,
            help: violation.help,
            nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary }))
          };
        })
        .filter(Boolean);

      expect(unexpected).toEqual([]);
    });
  }
});
