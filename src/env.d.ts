/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Web Audio API types
interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
  __THEME_ID__?: string;
  __THEME_MODE__?: string;
  __THEME_READY__?: boolean;
  __THEME_NAMES__?: Record<string, string>;
  __THEME_MESSAGES__?: {
    unlocked: string;
    locked: string;
    company: string;
    companyHidden: string;
  };
  __ASTRO_I18N__?: Record<string, unknown>;
  __APPLY_THEME_INSTANTLY__?: () => void;
  nextTheme?: (options?: unknown) => void;
  themeControl?: {
    currentTheme?: unknown;
    updateDisplay?: () => void;
    prevTheme?: (options?: unknown) => void;
    nextTheme?: (options?: unknown) => void;
    [key: string]: unknown;
  };
}

interface ImportMetaEnv {
  readonly PUBLIC_ENABLE_PROJECT_PAGES?: string;
  readonly PUBLIC_DEBUG_LOGS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
