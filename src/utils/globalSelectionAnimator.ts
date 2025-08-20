let isAnimating = false;
let startTime = 0;
let intervalId: number | null = null;

export function startGlobalSelectionAnimation() {
  if (isAnimating) return; // Prevent multiple animations
  isAnimating = true;
  startTime = performance.now();
  
  function tick() {
    if (!isAnimating) return; // Allow stopping the animation
    
    const elapsed = (performance.now() - startTime) * 0.001; // Convert to seconds
    
    // Continuously cycle through hue based on time (full cycle every 32 seconds)
    const h = (elapsed * 11.25) % 360; // 11.25 degrees per second = full cycle in 32 seconds
    
    // Vary saturation and lightness with sine waves for smooth animation
    const s = 75 + Math.sin(elapsed * 0.175) * 20; // 55-95% range (4x slower)
    const l = 50 + Math.sin(elapsed * 0.125) * 12; // 38-62% range (4x slower)

    // Update CSS custom property with calculated HSL values
    const hslColor = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    document.documentElement.style.setProperty('--selection-color', hslColor);
  }

  // Update every 250ms instead of every frame (much less CPU intensive)
  intervalId = window.setInterval(tick, 250);
}

export function stopGlobalSelectionAnimation() {
  isAnimating = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Auto-start when module is loaded
if (typeof window !== 'undefined') {
  // Start after a small delay to ensure DOM is ready
  setTimeout(startGlobalSelectionAnimation, 100);
}