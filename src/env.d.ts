/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Web Audio API types
interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

interface ImportMetaEnv {
  readonly CLOUDFLARE_WORKER_URL: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly WORKER_AUTH_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
