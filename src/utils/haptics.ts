import { WebHaptics } from 'web-haptics';

export type HapticType =
  | 'default'
  | 'mode'
  | 'confirm'
  | 'easterEgg'
  | 'success'
  | 'warning'
  | 'error'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection';

const MIN_HAPTIC_INTERVAL_MS = 160;
let lastHapticAt = 0;

const haptics = new WebHaptics();

// Device compatibility remap:
// On some phones only notification-style presets are reliably perceptible.
// We remap the whole scale to success/warning/error as the new baseline.
const HAPTIC_MAP: Record<HapticType, 'success' | 'warning' | 'error'> = {
  // Legacy aliases used around the app
  default: 'success',
  mode: 'success',
  confirm: 'warning',
  easterEgg: 'error',

  // Native web-haptics types (kept for call-site compatibility)
  success: 'success',
  warning: 'warning',
  error: 'error',
  light: 'success',
  medium: 'warning',
  heavy: 'error',
  selection: 'success'
};

export function canUseHaptics(): boolean {
  return true;
}

export function haptic(type: HapticType = 'default'): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const now = performance.now();
  if (now - lastHapticAt < MIN_HAPTIC_INTERVAL_MS) return false;

  lastHapticAt = now;
  void haptics.trigger(HAPTIC_MAP[type]);
  return true;
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
      const type: HapticType = requestedType in HAPTIC_MAP ? requestedType : 'default';
      haptic(type);
    });
  });
}
