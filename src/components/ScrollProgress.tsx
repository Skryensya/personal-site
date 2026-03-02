import * as React from 'react';

/**
 * ScrollProgress - fixed top reading progress line
 * Plain DOM updates for reliability across Astro transitions.
 */
export default function ScrollProgress() {
  const fillRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let raf = 0;

    const compute = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScrollable));

      // Keep a tiny visible cap so users can always locate the indicator.
      const width = Math.max(progress * 100, 0.6);
      fill.style.width = `${width.toFixed(2)}%`;
      fill.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };

    compute();

    window.addEventListener('scroll', schedule, { passive: true } as EventListenerOptions);
    window.addEventListener('resize', schedule, { passive: true } as EventListenerOptions);
    document.addEventListener('astro:page-load', schedule as EventListener);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule as EventListener);
      window.removeEventListener('resize', schedule as EventListener);
      document.removeEventListener('astro:page-load', schedule as EventListener);
    };
  }, []);

  return (
    <div
      className="print:hidden pointer-events-none fixed left-0 right-0 top-0 h-[2px] z-[12000]"
      aria-hidden="true"
    >
      <div
        ref={fillRef}
        className="h-full w-[0.6%] bg-main/65 transition-[width] duration-100 ease-linear"
      />
    </div>
  );
}
