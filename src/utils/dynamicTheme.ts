type RGB = { r: number; g: number; b: number };

type DynamicThemeState = {
  intervalId: number | null;
  startTime: number;
  pausedAt: number | null;
  hue: number;
  isDark: boolean;
  active: boolean;
  visibilityBound: boolean;
  seededFromSession: boolean;
  lastPersistAt: number;
};

const SESSION_HUE_KEY = 'prism-flow-hue';
const SESSION_ELAPSED_KEY = 'prism-flow-elapsed';
const SESSION_COLORFUL_KEY = 'prism-flow-colorful';
const SESSION_CONTRASTY_KEY = 'prism-flow-contrasty';

const state: DynamicThemeState = {
  intervalId: null,
  startTime: 0,
  pausedAt: null,
  hue: 275,
  isDark: false,
  active: false,
  visibilityBound: false,
  seededFromSession: false,
  lastPersistAt: 0
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function loadSessionHue(): number | null {
  try {
    const raw = sessionStorage.getItem(SESSION_HUE_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return null;
    return ((parsed % 360) + 360) % 360;
  } catch {
    return null;
  }
}

function loadSessionElapsed(): number | null {
  try {
    const raw = sessionStorage.getItem(SESSION_ELAPSED_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    if (Number.isNaN(parsed) || parsed < 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistSessionThemeState(colorful: string, contrasty: string, force: boolean = false) {
  const now = performance.now();
  if (!force && now - state.lastPersistAt < 2000) return;

  state.lastPersistAt = now;
  try {
    sessionStorage.setItem(SESSION_HUE_KEY, state.hue.toFixed(2));
    if (state.startTime > 0) {
      const elapsed = Math.max(0, (performance.now() - state.startTime) / 1000);
      sessionStorage.setItem(SESSION_ELAPSED_KEY, elapsed.toFixed(3));
    }
    sessionStorage.setItem(SESSION_COLORFUL_KEY, colorful);
    sessionStorage.setItem(SESSION_CONTRASTY_KEY, contrasty);
  } catch {
    // ignore storage errors
  }
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hh >= 0 && hh < 1) {
    r1 = c;
    g1 = x;
  } else if (hh < 2) {
    r1 = x;
    g1 = c;
  } else if (hh < 3) {
    g1 = c;
    b1 = x;
  } else if (hh < 4) {
    g1 = x;
    b1 = c;
  } else if (hh < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  const m = light - c / 2;

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255)
  };
}

function relativeLuminance({ r, g, b }: RGB): number {
  const [rn, gn, bn] = [r, g, b].map((c) => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
}

function contrastRatio(a: RGB, b: RGB): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function updateDynamicThemeColors() {
  const root = document.documentElement;
  const now = performance.now();
  const elapsed = (now - state.startTime) / 1000;

  // Smooth prism path through curated hues (cool -> violet -> magenta -> amber)
  const prismAnchors = [196, 228, 272, 318, 18, 52];
  const cycleDurationSec = 36;
  const cycle = ((elapsed / cycleDurationSec) % 1 + 1) % 1;
  const scaled = cycle * prismAnchors.length;
  const fromIndex = Math.floor(scaled) % prismAnchors.length;
  const toIndex = (fromIndex + 1) % prismAnchors.length;
  const localT = scaled - Math.floor(scaled);
  const easedT = localT * localT * (3 - 2 * localT); // smoothstep

  const fromHue = prismAnchors[fromIndex];
  const toHue = prismAnchors[toIndex];
  const shortestDelta = ((toHue - fromHue + 540) % 360) - 180;
  const baseHue = (fromHue + shortestDelta * easedT + 360) % 360;

  // Very subtle shimmer to avoid static feel while staying smooth
  state.hue = (
    baseHue + Math.sin(elapsed * 0.19) * 2.6 + Math.sin(elapsed * 0.07 + 1.1) * 1.4 + 360
  ) % 360;

  const refractedHue =
    (state.hue + 158 + Math.sin(elapsed * 0.11 + 0.6) * 6.5 + 360) % 360;

  // Interesting but controlled ranges: vivid highlights + stable dark counterpart
  const colorfulSat = clamp(
    66 + Math.sin(elapsed * 0.23) * 7 + Math.sin(elapsed * 0.09 + 1.7) * 4,
    56,
    78
  );
  const colorfulLight = clamp(
    83 + Math.sin(elapsed * 0.17 + 0.4) * 3.6 + Math.sin(elapsed * 0.05) * 1.8,
    76,
    88
  );

  const contrastySat = clamp(48 + Math.sin(elapsed * 0.21 + 2.2) * 8, 36, 62);
  const contrastyLight = clamp(20 + Math.sin(elapsed * 0.16 + 0.9) * 3.2, 14, 26);

  const colorful = `hsl(${state.hue.toFixed(1)} ${colorfulSat.toFixed(1)}% ${colorfulLight.toFixed(1)}%)`;
  const contrasty = `hsl(${refractedHue.toFixed(1)} ${contrastySat.toFixed(1)}% ${contrastyLight.toFixed(1)}%)`;

  root.style.setProperty('--theme-colorful', colorful);
  root.style.setProperty('--theme-contrasty', contrasty);
  root.style.setProperty('--color-main', state.isDark ? colorful : contrasty);
  root.style.setProperty('--color-secondary', state.isDark ? contrasty : colorful);

  const ratio = contrastRatio(
    hslToRgb(
      state.isDark ? state.hue : refractedHue,
      state.isDark ? colorfulSat : contrastySat,
      state.isDark ? colorfulLight : contrastyLight
    ),
    hslToRgb(
      state.isDark ? refractedHue : state.hue,
      state.isDark ? contrastySat : colorfulSat,
      state.isDark ? contrastyLight : colorfulLight
    )
  );

  persistSessionThemeState(colorful, contrasty);

  window.dispatchEvent(
    new CustomEvent('dynamic-theme-contrast', {
      detail: { ratio }
    })
  );
}

function startInterval() {
  if (state.intervalId !== null) return;
  state.intervalId = window.setInterval(updateDynamicThemeColors, 180);
}

function stopInterval() {
  if (state.intervalId === null) return;
  clearInterval(state.intervalId);
  state.intervalId = null;
}

function handleVisibilityChange() {
  if (!state.active) return;

  if (document.hidden) {
    state.pausedAt = performance.now();
    const styles = getComputedStyle(document.documentElement);
    persistSessionThemeState(
      styles.getPropertyValue('--theme-colorful').trim(),
      styles.getPropertyValue('--theme-contrasty').trim(),
      true
    );
    stopInterval();
    return;
  }

  if (state.pausedAt !== null) {
    // Preserve continuity of sine phases after pause
    state.startTime += performance.now() - state.pausedAt;
    state.pausedAt = null;
  }

  updateDynamicThemeColors();
  startInterval();
}

function bindVisibilityListener() {
  if (state.visibilityBound) return;
  document.addEventListener('visibilitychange', handleVisibilityChange);
  state.visibilityBound = true;
}

function unbindVisibilityListener() {
  if (!state.visibilityBound) return;
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  state.visibilityBound = false;
}

export function startDynamicTheme(isDark: boolean) {
  state.isDark = isDark;
  state.active = true;
  bindVisibilityListener();

  if (!state.seededFromSession) {
    const sessionHue = loadSessionHue();
    if (sessionHue !== null) {
      state.hue = sessionHue;
    }

    const sessionElapsed = loadSessionElapsed();
    if (sessionElapsed !== null) {
      state.startTime = performance.now() - sessionElapsed * 1000;
    }

    state.seededFromSession = true;
  }

  if (state.startTime <= 0) {
    state.startTime = performance.now();
  }

  if (state.pausedAt !== null) {
    // Preserve continuity when mode/theme toggles restart Prism Flow.
    state.startTime += performance.now() - state.pausedAt;
    state.pausedAt = null;
  }

  updateDynamicThemeColors();

  if (document.hidden) {
    stopInterval();
    return;
  }

  startInterval();
}

export function stopDynamicTheme() {
  state.active = false;
  if (state.pausedAt === null) {
    state.pausedAt = performance.now();
  }

  const styles = getComputedStyle(document.documentElement);
  persistSessionThemeState(
    styles.getPropertyValue('--theme-colorful').trim(),
    styles.getPropertyValue('--theme-contrasty').trim(),
    true
  );
  stopInterval();
  unbindVisibilityListener();
}
