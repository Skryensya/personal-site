/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Web Audio API types
interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

interface ImportMetaEnv {
  readonly PUBLIC_ENABLE_PROJECT_PAGES?: string;
  readonly PUBLIC_DEBUG_LOGS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
