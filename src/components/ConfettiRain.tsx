import React from "react";

export type ConfettiRainProps = {
  color?: string;            // default: currentColor o --confetti-color
  count?: number;            // piezas totales
  duration?: number;         // duración base (s)
  stagger?: number;          // desfase entre piezas (s)
  size?: number;             // tamaño base (px)
  spreadX?: number;          // amplitud horizontal (% del ancho)
  loop?: boolean;            // anima en bucle
  paused?: boolean;          // pausa animación
  className?: string;        // clases extra en el wrapper
  style?: React.CSSProperties;
};

const DEFAULTS = {
  count: 80,
  duration: 6,
  stagger: 0.02,
  size: 6,
  spreadX: 100,
  loop: true,
  paused: false,
} as const;

// PRNG simple, determinista por índice (SSR-safe)
function prng(i: number) {
  let x = (i + 1) * 1664525 + 1013904223;
  x = x % 0xffffffff;
  return x / 0xffffffff;
}

const ConfettiRain: React.FC<ConfettiRainProps> = ({
  color,
  count = DEFAULTS.count,
  duration = DEFAULTS.duration,
  stagger = DEFAULTS.stagger,
  size = DEFAULTS.size,
  spreadX = DEFAULTS.spreadX,
  loop = DEFAULTS.loop,
  paused = DEFAULTS.paused,
  className,
  style,
}) => {
  const iterationCount = loop ? "infinite" : "1";

  const wrapperStyle: React.CSSProperties = {
    ["--confetti-color" as any]: color ?? "currentColor",
    ["--confetti-size" as any]: `${size}px`,
    ["--confetti-duration" as any]: `${duration}s`,
    ["--confetti-stagger" as any]: `${stagger}s`,
    ["--confetti-spread-x" as any]: `${spreadX}%`,
    ["--confetti-iteration-count" as any]: iterationCount,
    ...style,
  };

  return (
    <div
      className={["confetti-wrapper", className].filter(Boolean).join(" ")}
      style={wrapperStyle}
      aria-hidden="true"
      role="presentation"
      data-paused={paused ? "true" : "false"}
    >
      {Array.from({ length: Math.max(0, Math.floor(count)) }).map((_, i) => {
        const r1 = prng(i);
        const r2 = prng(i * 7 + 3);
        const r3 = prng(i * 13 + 11);
        const r4 = prng(i * 17 + 5);

        const startXPercent = (r1 - 0.5) * spreadX;
        const swayFactor = 0.2 + r2 * 0.4; // 0.2–0.6
        const swayPercent = swayFactor * spreadX * (r3 > 0.5 ? 1 : -1);
        const spinTurns = 1 + r3 * 1.25;
        const spinDir = r4 > 0.5 ? 1 : -1;
        const durJitter = 1 + (r2 - 0.5) * 0.2;

        const w = size * (0.5 + r1);        // 0.5x–1.5x
        const h = size * (0.8 + r2 * 1.2);  // 0.8x–2.0x
        const delay = i * stagger + (r4 - 0.5) * stagger;

        const itemStyle: React.CSSProperties = {
          ["--i" as any]: i,
          ["--delay" as any]: `${delay}s`,
          ["--start-x" as any]: `${startXPercent}%`,
          ["--sway-x" as any]: `${swayPercent}%`,
          ["--spin-turns" as any]: spinTurns,
          ["--spin-dir" as any]: spinDir,
          ["--piece-w" as any]: `${w}px`,
          ["--piece-h" as any]: `${h}px`,
          ["--piece-duration" as any]: `calc(var(--confetti-duration) * ${durJitter})`,
        };

        return (
          <div key={i} className="confetti-item" style={itemStyle}>
            <div className="confetti-inner" />
          </div>
        );
      })}

      {/* styled-jsx: todo el CSS vive aquí */}
      <style >{`
        .confetti-wrapper {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          background: transparent;
          contain: layout style paint;
        }

        .confetti-wrapper[data-paused="true"] .confetti-item,
        .confetti-wrapper[data-paused="true"] .confetti-inner {
          animation-play-state: paused;
        }

        /* Defaults (puedes sobreescribir vía style/vars) */
        :global(:root) {
          --confetti-color: currentColor;
          --confetti-size: 6px;
          --confetti-duration: 6s;
          --confetti-stagger: 0.02s;
          --confetti-spread-x: 100%;
          --confetti-iteration-count: infinite;
        }

        .confetti-item {
          position: absolute;
          top: -10%;
          left: 50%;
          width: var(--piece-w, var(--confetti-size));
          height: var(--piece-h, calc(var(--confetti-size) * 1.6));
          background: var(--confetti-color);
          border-radius: 2px;
          will-change: transform, opacity;

          animation-name: confetti-fall;
          animation-duration: var(--piece-duration, var(--confetti-duration));
          animation-delay: var(--delay, 0s);
          animation-iteration-count: var(--confetti-iteration-count);
          animation-timing-function: linear;
          animation-fill-mode: both;
        }

        .confetti-inner {
          width: 100%;
          height: 100%;
          will-change: transform, opacity;

          animation-name: confetti-spin;
          animation-duration: var(--piece-duration, var(--confetti-duration));
          animation-delay: var(--delay, 0s);
          animation-iteration-count: var(--confetti-iteration-count);
          animation-timing-function: linear;
          animation-fill-mode: both;
        }

        @keyframes confetti-fall {
          0% {
            transform: translate3d(calc(var(--start-x, 0%)), -10%, 0);
            opacity: 0;
          }
          5% { opacity: 1; }
          50% {
            transform: translate3d(
              calc(var(--start-x, 0%) + (var(--sway-x, 0%) * 0.5)),
              50%,
              0
            );
            opacity: 1;
          }
          100% {
            transform: translate3d(
              calc(var(--start-x, 0%) + var(--sway-x, 0%)),
              110%,
              0
            );
            opacity: 0.9;
          }
        }

        @keyframes confetti-spin {
          0%   { transform: rotate3d(0.2, 0.8, 0.1, 0turn); }
          100% {
            transform: rotate3d(
              0.2, 0.8, 0.1,
              calc(var(--spin-turns, 1) * var(--spin-dir, 1) * 1turn)
            );
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .confetti-item,
          .confetti-inner {
            animation: none !important;
          }
          .confetti-item {
            transform: translate3d(calc(var(--start-x, 0%)), 0%, 0);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfettiRain;
