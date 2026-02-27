import React, { useEffect, useRef } from 'react';

type SimplePixelBlastProps = {
  className?: string;
  pixelSize?: number;
  density?: number;
  color?: string;
  speed?: number;
  decay?: number;
  maxCells?: number;
  threshold?: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  strength: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hexToRgb(hex: string) {
  const match = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

const SimplePixelBlast: React.FC<SimplePixelBlastProps> = ({
  className,
  pixelSize = 8,
  density = 0.06,
  color = '#000000',
  speed = 0.09,
  decay = 0.93,
  maxCells = 6000,
  threshold = 0.075,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);

    let raf = 0;
    let running = true;
    let inView = true;

    let cols = 0;
    let rows = 0;
    let cell = pixelSize;

    let energy = new Float32Array(0);
    let imageData: ImageData | null = null;
    const ripples: Ripple[] = [];

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { alpha: true });
    if (!offCtx) return;

    const rgb = hexToRgb(color);

    const index = (x: number, y: number) => y * cols + x;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false;

      const area = rect.width * rect.height;
      const idealCells = area / (pixelSize * pixelSize);
      const scaleUp = idealCells > maxCells ? Math.sqrt(idealCells / maxCells) : 1;
      cell = Math.max(4, Math.round(pixelSize * scaleUp));

      cols = Math.max(1, Math.ceil(rect.width / cell));
      rows = Math.max(1, Math.ceil(rect.height / cell));

      energy = new Float32Array(cols * rows);
      imageData = new ImageData(cols, rows);
      offscreen.width = cols;
      offscreen.height = rows;
    };

    const seedBurst = (normX: number, normY: number, amount = 0.9) => {
      const cx = Math.floor(normX * cols);
      const cy = Math.floor(normY * rows);
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
          const dist = Math.hypot(dx, dy);
          const gain = amount * Math.max(0, 1 - dist / 3);
          const i = index(x, y);
          energy[i] = Math.max(energy[i], gain);
        }
      }
    };

    const render = () => {
      if (!imageData) return;

      const data = imageData.data;
      let ptr = 0;

      for (let i = 0; i < energy.length; i++) {
        const next = energy[i] * decay;
        energy[i] = next;

        if (next > threshold) {
          const a = clamp(next, 0, 1);
          data[ptr] = rgb.r;
          data[ptr + 1] = rgb.g;
          data[ptr + 2] = rgb.b;
          data[ptr + 3] = Math.floor(a * 255);
        } else {
          data[ptr] = 0;
          data[ptr + 1] = 0;
          data[ptr + 2] = 0;
          data[ptr + 3] = 0;
        }
        ptr += 4;
      }

      offCtx.putImageData(imageData, 0, 0);
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(offscreen, 0, 0, cols, rows, 0, 0, rect.width, rect.height);
    };

    const updateRipples = () => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 0.2;
        ripple.strength *= 0.94;

        if (ripple.strength < 0.06 || ripple.radius > Math.max(cols, rows)) {
          ripples.splice(i, 1);
          continue;
        }

        const minX = Math.max(0, Math.floor(ripple.x - ripple.radius - 1));
        const maxX = Math.min(cols - 1, Math.ceil(ripple.x + ripple.radius + 1));
        const minY = Math.max(0, Math.floor(ripple.y - ripple.radius - 1));
        const maxY = Math.min(rows - 1, Math.ceil(ripple.y + ripple.radius + 1));

        const rMin = ripple.radius - 0.9;
        const rMax = ripple.radius + 0.9;

        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            const dist = Math.hypot(x - ripple.x, y - ripple.y);
            if (dist >= rMin && dist <= rMax) {
              const iCell = index(x, y);
              energy[iCell] = Math.max(energy[iCell], ripple.strength);
            }
          }
        }
      }
    };

    const tick = () => {
      if (!running) return;

      if (!inView) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!reducedMotion && Math.random() < speed) {
        seedBurst(Math.random(), Math.random(), density);
      }

      if (!reducedMotion) {
        updateRipples();
      }

      render();
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      seedBurst(x, y, 0.85);
    };

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      seedBurst(x, y, 1);
      ripples.push({ x: x * cols, y: y * rows, radius: 0.3, strength: 1 });
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(canvas);

    resize();
    seedBurst(0.5, 0.5, 0.9);

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [pixelSize, density, color, speed, decay, maxCells, threshold]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default SimplePixelBlast;
