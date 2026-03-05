export type HapticType = 'default' | 'mode' | 'confirm' | 'easterEgg';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  // Keep the default pulse almost imperceptible.
  default: 8,
  // Theme mode changes should feel very light.
  mode: 6,
  // Confirmation actions can be slightly stronger.
  confirm: 10,
  // Short celebratory pulse pattern for easter eggs.
  easterEgg: [10, 24, 14]
};

const MIN_HAPTIC_INTERVAL_MS = 180;
let lastHapticAt = 0;

export function canUseHaptics(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}

export function haptic(type: HapticType = 'default'): boolean {
  if (!canUseHaptics()) return false;

  const now = performance.now();
  if (now - lastHapticAt < MIN_HAPTIC_INTERVAL_MS) return false;

  lastHapticAt = now;

  try {
    return navigator.vibrate(HAPTIC_PATTERNS[type]);
  } catch {
    return false;
  }
}

export function isExplicitPointerClick(event: Event): boolean {
  if (!(event instanceof MouseEvent)) return false;
  // detail === 0 usually means keyboard-triggered click
  return event.button === 0 && event.detail > 0;
}

export function bindHapticActions(root: ParentNode = document): void {
  const nodes = root.querySelectorAll<HTMLElement>('[data-haptic]');

  nodes.forEach((node) => {
    if (node.dataset.hapticBound === 'true') return;
    node.dataset.hapticBound = 'true';

    node.addEventListener('click', (event) => {
      if (!isExplicitPointerClick(event)) return;

      const requestedType = (node.dataset.haptic || 'default') as HapticType;
      const type: HapticType = requestedType in HAPTIC_PATTERNS ? requestedType : 'default';
      haptic(type);
    });
  });
}
