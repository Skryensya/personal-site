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

function persistSessionThemeState(colorful: string, contrasty: string, force: boolean = false) {
  const now = performance.now();
  if (!force && now - state.lastPersistAt < 2000) return;

  state.lastPersistAt = now;
  try {
    sessionStorage.setItem(SESSION_HUE_KEY, state.hue.toFixed(2));
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

  // Prism drift: warm-dominant, more vivid, faster cycle
  const cycleDurationSec = 20;
  const cycle = ((elapsed / cycleDurationSec) % 1 + 1) % 1;
  const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

  let baseHue: number;
  const coolSplit = 0.36;
  if (cycle < coolSplit) {
    // Cool pass: cyan -> violet
    const t = ease(cycle / coolSplit);
    baseHue = 196 + (292 - 196) * t;
  } else {
    // Warm-dominant pass: magenta/red -> amber
    const t = ease((cycle - coolSplit) / (1 - coolSplit));
    baseHue = (344 + (46 - 344) * t + 360) % 360;
  }

  state.hue = (
    baseHue + Math.sin(elapsed * 0.58) * 4.4 + Math.sin(elapsed * 0.21 + 1.2) * 2.1 + 360
  ) % 360;

  const refractedHue =
    (state.hue + 196 + Math.sin(elapsed * 0.29 + 0.7) * 9 + 360) % 360;

  const warmPhase = cycle >= coolSplit ? 1 : 0;

  const colorfulSat = clamp(
    (62 + warmPhase * 12) + Math.sin(elapsed * 0.74) * 10 + Math.sin(elapsed * 0.27 + 1.4) * 4,
    50,
    86
  );
  const colorfulLight = clamp(88 + Math.sin(elapsed * 0.41) * 4.2, 80, 94);

  const contrastySat = clamp((50 + warmPhase * 10) + Math.sin(elapsed * 0.59 + 2.0) * 12, 38, 78);
  const contrastyLight = clamp(18 + Math.sin(elapsed * 0.31 + 0.55) * 4.5, 12, 27);

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
  state.intervalId = window.setInterval(updateDynamicThemeColors, 140);
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

  stopInterval();

  if (!state.seededFromSession) {
    const sessionHue = loadSessionHue();
    if (sessionHue !== null) {
      state.hue = sessionHue;
    }
    state.seededFromSession = true;
  }

  state.startTime = performance.now();
  state.pausedAt = null;

  updateDynamicThemeColors();

  if (!document.hidden) {
    startInterval();
  }
}

export function stopDynamicTheme() {
  state.active = false;
  state.pausedAt = null;
  const styles = getComputedStyle(document.documentElement);
  persistSessionThemeState(
    styles.getPropertyValue('--theme-colorful').trim(),
    styles.getPropertyValue('--theme-contrasty').trim(),
    true
  );
  stopInterval();
  unbindVisibilityListener();
}
