let isAnimating = false;
let startTime = 0;

export function startGlobalSelectionAnimation() {
  if (isAnimating) return; // Prevent multiple animations
  isAnimating = true;
  startTime = performance.now();
  
  function tick(now: number) {
    if (!isAnimating) return; // Allow stopping the animation
    
    const elapsed = (now - startTime) * 0.001; // Convert to seconds
    
    // Continuously cycle through hue based on time (full cycle every 8 seconds)
    const h = (elapsed * 45) % 360; // 45 degrees per second = full cycle in 8 seconds
    
    // Vary saturation and lightness with sine waves for smooth animation
    const s = 75 + Math.sin(elapsed * 0.7) * 20; // 55-95% range
    const l = 50 + Math.sin(elapsed * 0.5) * 12; // 38-62% range

    // Update CSS custom property with calculated HSL values
    const hslColor = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
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