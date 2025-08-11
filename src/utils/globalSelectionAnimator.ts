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

let isAnimating = false;

export function startGlobalSelectionAnimation() {
  if (isAnimating) return; // Prevent multiple animations
  isAnimating = true;

  let current: HSL = {
    h: Math.random() * 360,
    s: Math.random() * 60 + 40,
    l: Math.random() * 30 + 35
  };
  
  let target: HSL = randomTarget(current);
  let lastTargetChange = performance.now();
  
  function tick(now: number) {
    if (!isAnimating) return; // Allow stopping the animation
    
    // Change target every 3 seconds
    if (now - lastTargetChange > 3000) {
      target = randomTarget(current);
      lastTargetChange = now;
    }

    // Interpolate colors
    current.h = (current.h + shortestHueDistance(current.h, target.h) * 0.015 + 360) % 360;
    current.s = lerp(current.s, target.s, 0.015);
    current.l = lerp(current.l, target.l, 0.015);

    // Update CSS custom property
    const hslColor = `hsl(${current.h.toFixed(1)}, ${current.s.toFixed(1)}%, ${current.l.toFixed(1)}%)`;
    document.documentElement.style.setProperty('--selection-color', hslColor);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

export function stopGlobalSelectionAnimation() {
  isAnimating = false;
}

// Auto-start when module is loaded
if (typeof window !== 'undefined') {
  // Start after a small delay to ensure DOM is ready
  setTimeout(startGlobalSelectionAnimation, 100);
}