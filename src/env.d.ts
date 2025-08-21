/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Web Audio API types
interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}
