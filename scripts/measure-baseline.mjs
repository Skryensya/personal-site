#!/usr/bin/env node
/**
 * scripts/measure-baseline.mjs
 * Mide tamaño de HTML, JS inline y CSS inline de rutas críticas
 * después de un `npm run build`.
 *
 * Uso: node scripts/measure-baseline.mjs
 */

import fs from 'fs';
import path from 'path';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createReadStream as createRS } from 'fs';
import { Readable } from 'stream';
import zlib from 'zlib';

const ROUTES = [
  { name: 'Home (es)',           file: 'dist/index.html' },
  { name: 'Home (en)',           file: 'dist/en/index.html' },
  { name: 'Design System (en)',  file: 'dist/en/design-system/index.html' },
  { name: 'Design System (es)',  file: 'dist/sistema-de-diseno/index.html' },
  { name: 'Proyectos (es)',      file: 'dist/proyectos/index.html' },
  { name: 'Proyectos (en)',      file: 'dist/en/projects/index.html' },
  { name: 'agenda-uc (es)',      file: 'dist/proyectos/agenda-uc/index.html' },
  { name: 'agenda-uc (en)',      file: 'dist/en/projects/agenda-uc/index.html' },
  { name: 'barrancas (es)',      file: 'dist/proyectos/barrancas/index.html' },
  { name: 'hostal-micelio (es)', file: 'dist/proyectos/hostal-micelio/index.html' },
];

// Presupuestos globales por defecto
const BUDGETS = {
  htmlRaw:    200_000,  // 200 KB sin comprimir
  htmlGzip:   60_000,   // 60 KB comprimido (lo que realmente viaja por red)
  jsInline:   40_000,   // 40 KB JS inline
  cssInline:  80_000,   // 80 KB CSS inline
};

// Overrides por ruta (cuando la página es inherentemente densa en contenido)
// Design System es una página de showcase con cientos de demos — más permisiva en HTML raw,
// pero igualmente estricta en JS inline y CSS inline.
const ROUTE_BUDGETS = {
  'Design System (en)': { htmlRaw: 250_000, htmlGzip: 60_000, jsInline: 40_000, cssInline: 80_000 },
  'Design System (es)': { htmlRaw: 250_000, htmlGzip: 60_000, jsInline: 40_000, cssInline: 80_000 },
};

function gzipSize(content) {
  return Buffer.byteLength(zlib.gzipSync(content));
}

function extractInline(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
  let total = 0;
  let count = 0;
  for (const m of html.matchAll(re)) {
    total += Buffer.byteLength(m[1], 'utf8');
    count++;
  }
  return { total, count };
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

function flag(value, budget) {
  return value > budget ? '⚠️ ' : '✓  ';
}

const rows = [];
let anyBudgetExceeded = false;

for (const route of ROUTES) {
  if (!fs.existsSync(route.file)) {
    rows.push({ name: route.name, missing: true });
    continue;
  }

  const html = fs.readFileSync(route.file, 'utf8');
  const rawBytes  = Buffer.byteLength(html, 'utf8');
  const gzipBytes = gzipSize(html);
  const js  = extractInline(html, 'script');
  const css = extractInline(html, 'style');

  const budget = { ...BUDGETS, ...(ROUTE_BUDGETS[route.name] || {}) };
  const exceeded =
    rawBytes  > budget.htmlRaw  ||
    gzipBytes > budget.htmlGzip ||
    js.total  > budget.jsInline ||
    css.total > budget.cssInline;

  if (exceeded) anyBudgetExceeded = true;

  rows.push({ name: route.name, rawBytes, gzipBytes, js, css, exceeded });
}

// ── Output ────────────────────────────────────────────────────────────────────
const line = '─'.repeat(100);
console.log('\n📊 Baseline de HTML por ruta\n' + line);
console.log(
  'Ruta'.padEnd(28),
  'HTML raw'.padStart(10),
  'HTML gz'.padStart(10),
  'JS inline'.padStart(12),
  'CSS inline'.padStart(12),
  'Presupuesto',
);
console.log(line);

for (const r of rows) {
  if (r.missing) {
    console.log(r.name.padEnd(28), ' (archivo no encontrado — ejecuta npm run build)');
    continue;
  }
  console.log(
    r.name.padEnd(28),
    kb(r.rawBytes).padStart(10),
    kb(r.gzipBytes).padStart(10),
    `${kb(r.js.total)} (${r.js.count})`.padStart(12),
    `${kb(r.css.total)} (${r.css.count})`.padStart(12),
    (r.exceeded ? '⚠️  SUPERA' : '✓  ok'),
  );
}

console.log(line);
console.log(`\nPresupuestos definidos:`);
console.log(`  HTML raw   < ${kb(BUDGETS.htmlRaw)}`);
console.log(`  HTML gz    < ${kb(BUDGETS.htmlGzip)}`);
console.log(`  JS inline  < ${kb(BUDGETS.jsInline)}`);
console.log(`  CSS inline < ${kb(BUDGETS.cssInline)}`);

// ── Font sizes ────────────────────────────────────────────────────────────────
const FONTS = [
  'public/fonts/Atkinson_Hyperlegible_Next/AtkinsonHyperlegibleNext-VariableFont_wght.ttf',
  'public/fonts/Atkinson_Hyperlegible_Next/AtkinsonHyperlegibleNext-VariableFont_wght.woff2',
  'public/fonts/Atkinson_Hyperlegible_Next/AtkinsonHyperlegibleNext-Italic-VariableFont_wght.ttf',
  'public/fonts/Atkinson_Hyperlegible_Next/AtkinsonHyperlegibleNext-Italic-VariableFont_wght.woff2',
  'public/fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf',
  'public/fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.woff2',
  'public/fonts/Atkinson_Hyperlegible_Mono/AtkinsonHyperlegibleMono-VariableFont_wght.ttf',
  'public/fonts/Atkinson_Hyperlegible_Mono/AtkinsonHyperlegibleMono-VariableFont_wght.woff2',
  'public/fonts/Atkinson_Hyperlegible_Mono/AtkinsonHyperlegibleMono-Italic-VariableFont_wght.ttf',
  'public/fonts/Atkinson_Hyperlegible_Mono/AtkinsonHyperlegibleMono-Italic-VariableFont_wght.woff2',
];

console.log('\n📦 Tamaño de fuentes\n' + '─'.repeat(80));
for (const f of FONTS) {
  if (!fs.existsSync(f)) continue;
  const size = fs.statSync(f).size;
  const name = f.split('/').pop();
  console.log(`  ${name.padEnd(58)} ${kb(size).padStart(8)}`);
}

if (anyBudgetExceeded) {
  console.log('\n⚠️  Hay rutas que superan el presupuesto.\n');
  process.exit(1);
} else {
  console.log('\n✓  Todas las rutas dentro del presupuesto.\n');
}
