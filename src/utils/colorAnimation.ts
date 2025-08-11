type HSL = { h: number; s: number; l: number };

function randomTarget(prev: HSL): HSL {
  const hueSkip = (Math.random() * 150 + 30) * (Math.random() > 0.5 ? 1 : -1);
  const h = (prev.h + hueSkip + 360) % 360;
  const s = Math.random() * 60 + 40; // 40–100%
  const l = Math.random() * 30 + 35; // 35–65%
  return { h, s, l };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function shortestHueDistance(from: number, to: number): number {
  let diff = (to - from + 360) % 360;
  if (diff > 180) diff -= 360;
  return diff;
}

export function animateSmoothRandomColors(
  element: HTMLElement,
  targetChangeInterval: number = 2000,
  speed: number = 0.02 // smaller is slower
) {
  let current: HSL = {
    h: Math.random() * 360,
    s: Math.random() * 60 + 40,
    l: Math.random() * 30 + 35
  };
  let target: HSL = randomTarget(current);
  let lastTargetChange = performance.now();

  function tick(now: number) {
    // Change target periodically
    if (now - lastTargetChange > targetChangeInterval) {
      target = randomTarget(current);
      lastTargetChange = now;
    }

    // Interpolate hue correctly over circular range
    current.h = (current.h + shortestHueDistance(current.h, target.h) * speed + 360) % 360;
    current.s = lerp(current.s, target.s, speed);
    current.l = lerp(current.l, target.l, speed);

    element.style.backgroundColor = `hsl(${current.h.toFixed(1)}, ${current.s.toFixed(1)}%, ${current.l.toFixed(1)}%)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Enhanced version that animates to a specific target color
export function animateToTargetColor(
  element: HTMLElement,
  targetHSL: HSL,
  speed: number = 0.05,
  onComplete?: () => void
) {
  let current: HSL = {
    h: Math.random() * 360,
    s: Math.random() * 60 + 40,
    l: Math.random() * 30 + 35
  };

  function tick() {
    // Interpolate to target
    current.h = (current.h + shortestHueDistance(current.h, targetHSL.h) * speed + 360) % 360;
    current.s = lerp(current.s, targetHSL.s, speed);
    current.l = lerp(current.l, targetHSL.l, speed);

    element.style.backgroundColor = `hsl(${current.h.toFixed(1)}, ${current.s.toFixed(1)}%, ${current.l.toFixed(1)}%)`;

    // Check if we're close enough to the target
    const hueDistance = Math.abs(shortestHueDistance(current.h, targetHSL.h));
    const sDistance = Math.abs(current.s - targetHSL.s);
    const lDistance = Math.abs(current.l - targetHSL.l);

    if (hueDistance < 1 && sDistance < 1 && lDistance < 1) {
      // Animation complete
      element.style.backgroundColor = `hsl(${targetHSL.h}, ${targetHSL.s}%, ${targetHSL.l}%)`;
      onComplete?.();
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Convert hex to HSL
export function hexToHSL(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const add = max + min;
  const l = add * 0.5;

  let s = 0;
  let h = 0;

  if (diff !== 0) {
    s = l < 0.5 ? diff / add : diff / (2 - add);

    switch (max) {
      case r:
        h = ((g - b) / diff) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}