import * as React from 'react';
const { useState, useEffect } = React;
import { getClientTranslations } from '@/i18n/utils';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rNorm, gNorm, bNorm] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function rgbToHex(rgb: string): string {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return '#000000';

  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export default function AccessibilityIndicators() {
  const t = getClientTranslations();
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [motionReduced, setMotionReduced] = useState<boolean>(false);

  const calculateContrast = () => {
    try {
      const rootStyles = getComputedStyle(document.documentElement);
      let mainColor = rootStyles.getPropertyValue('--color-main').trim();
      let secondaryColor = rootStyles.getPropertyValue('--color-secondary').trim();

      if (!mainColor || !secondaryColor) {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        mainColor = isDarkMode ? '#ffffff' : '#000000';
        secondaryColor = isDarkMode ? '#000000' : '#ffffff';
      }

      if (!mainColor.startsWith('#')) {
        mainColor = mainColor.startsWith('rgb') ? rgbToHex(mainColor) : '#000000';
      }
      if (!secondaryColor.startsWith('#')) {
        secondaryColor = secondaryColor.startsWith('rgb') ? rgbToHex(secondaryColor) : '#ffffff';
      }

      const ratio = getContrastRatio(mainColor, secondaryColor);
      setContrastRatio(ratio);
    } catch (error) {
      console.warn('Failed to calculate contrast ratio:', error);
      setContrastRatio(0);
    }
  };

  const updateMotionPreference = () => {
    setMotionReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  useEffect(() => {
    calculateContrast();
    updateMotionPreference();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
          setTimeout(calculateContrast, 100);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', updateMotionPreference);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  const levels = [
    { name: 'A', requirement: 3, passed: contrastRatio >= 3 },
    { name: 'AA', requirement: 4.5, passed: contrastRatio >= 4.5 },
    { name: 'AAA', requirement: 7, passed: contrastRatio >= 7 }
  ];

  const ratio = contrastRatio > 0 ? contrastRatio.toFixed(1) : '--';

  return (
    <div className="space-y-4">
      <div className="block font-mono text-sm text-secondary pt-4 pb-1">
        <div className="font-bold mb-2 uppercase text-sm">{t('footer.wcag.title')}</div>
        <div className="flex gap-4 items-center">
          <div className="text-sm leading-tight border text-secondary py-1 px-2 font-bold border-main">
            {ratio}:1
          </div>
          <div className="flex gap-1">
            {levels.map(level => (
              <div
                key={level.name}
                className={`bg-secondary text-main px-2 py-1 text-xs font-mono font-bold flex items-center gap-1 border border-main ${level.passed ? 'opacity-100' : 'opacity-30'}`}
              >
                <span className="inline-flex w-3 h-3 items-center justify-center">
                  {level.passed ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  )}
                </span>
                <span>{level.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="block font-mono text-sm text-secondary py-1">
        <div className="font-bold mb-2 uppercase text-sm">{t('footer.motion.label')}</div>
        <div>
          {motionReduced ? t('footer.motion.activated') : t('footer.motion.deactivated')}
        </div>
      </div>
    </div>
  );
}
