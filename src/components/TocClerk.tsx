import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, type RefObject } from 'react';
import { cn } from '@/lib/utils';

export type TOCItemType = { url: string; title: string; depth: number };

type Ctx = { toc: TOCItemType[]; active: string | null; topOffset: number };
const TocCtx = createContext<Ctx | null>(null);

export function useTocCtx() {
  const v = useContext(TocCtx);
  if (!v) throw new Error('TocClerkProvider required');
  return v;
}

export function TocClerkProvider({ toc, topOffset = 112, children }: { toc: TOCItemType[]; topOffset?: number; children: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);

  const ids = useMemo(() => toc.map(i => (i.url.startsWith('#') ? i.url.slice(1) : i.url)), [toc]);

  const recompute = useCallback(() => {
    const sy = window.scrollY || window.pageYOffset;
    const line = sy + topOffset;
    let winner: { id: string; top: number } | null = null;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + sy;
      if (top <= line && (!winner || top > winner.top)) winner = { id, top };
    }
    if (!winner) {
      // pick first existing heading
      for (const id of ids) {
        if (document.getElementById(id)) { setActive(id); return; }
      }
      setActive(null);
      return;
    }
    setActive(winner.id);
  }, [ids, topOffset]);

  useEffect(() => {
    recompute();
    const onScroll = () => recompute();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    window.addEventListener('resize', onScroll, { passive: true } as any);
    return () => {
      window.removeEventListener('scroll', onScroll as any);
      window.removeEventListener('resize', onScroll as any);
    };
  }, [recompute]);

  const value = useMemo<Ctx>(() => ({ toc, active, topOffset }), [toc, active, topOffset]);
  return <TocCtx.Provider value={value}>{children}</TocCtx.Provider>;
}

export function TocClerkItems({ className, ...props }: ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toc } = useTocCtx();
  const [svg, setSvg] = useState<{ path: string; width: number; height: number }>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const compute = () => {
      if (container.clientHeight === 0) return;
      let w = 0, h = 0;
      const d: string[] = [];
      for (let i = 0; i < toc.length; i++) {
        const slug = toc[i].url.startsWith('#') ? toc[i].url.slice(1) : toc[i].url;
        const a = container.querySelector<HTMLElement>(`a[href="#${slug}"]`);
        if (!a) continue;
        const styles = getComputedStyle(a);
        const offset = lineOffset(toc[i].depth) + 1;
        const top = a.offsetTop + parseFloat(styles.paddingTop);
        const bottom = a.offsetTop + a.clientHeight - parseFloat(styles.paddingBottom);
        w = Math.max(w, offset);
        h = Math.max(h, bottom);
        d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }
      setSvg({ path: d.join(' '), width: w + 1, height: h });
    };

    const ro = new ResizeObserver(compute);
    compute();
    ro.observe(container);
    return () => ro.disconnect();
  }, [toc]);

  return (
    <div ref={containerRef} className={cn('relative flex flex-col', className)} {...props}>
      {svg ? (
        <div
          className="absolute left-0 top-0"
          style={{ width: svg.width, height: svg.height, maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${svg.width} ${svg.height}\"><path d=\"${svg.path}\" stroke=\"black\" stroke-width=\"2\" fill=\"none\" /></svg>`)}")` }}
        >
          <TocThumb containerRef={containerRef} className="mt-[var(--fd-top)] h-[var(--fd-height)] bg-main transition-all" />
        </div>
      ) : null}
      {toc.map((item, i) => (
        <TocClerkItem key={item.url} item={item} upper={toc[i-1]?.depth} lower={toc[i+1]?.depth} />
      ))}
    </div>
  );
}

function TocClerkItem({ item, upper = item.depth, lower = item.depth }: { item: TOCItemType; upper?: number; lower?: number }) {
  const { active } = useTocCtx();
  const slug = item.url.startsWith('#') ? item.url.slice(1) : item.url;
  const padding = item.depth <= 2 ? 'ps-3' : item.depth === 3 ? 'ps-6' : 'ps-8';
  const isActive = active === slug;
  const offset = lineOffset(item.depth);
  const upperOffset = lineOffset(upper);
  const lowerOffset = lineOffset(lower);

  return (
    <a
      href={item.url}
      data-active={isActive}
      className={cn(
        'prose relative py-1.5 text-sm text-main/70 hover:text-main transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0',
        isActive && 'text-main',
        padding,
      )}
      onClick={(e) => {
        if (slug === 'inicio') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(slug);
        if (el) {
          e.preventDefault();
          const top = el.getBoundingClientRect().top + window.scrollY - (useTocCtx().topOffset);
          window.history.pushState(null, '', `#${slug}`);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }}
    >
      {offset !== upperOffset ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="absolute -top-1.5 left-0 size-4">
          <line x1={upperOffset} y1="0" x2={offset} y2="12" className="stroke-main/10" strokeWidth="1" />
        </svg>
      ) : null}
      <div
        className={cn(
          'absolute inset-y-0 w-px bg-main/10',
          offset !== upperOffset && 'top-1.5',
          offset !== lowerOffset && 'bottom-1.5',
        )}
        style={{ left: offset }}
        aria-hidden
      />
      {item.title}
    </a>
  );
}

function TocThumb({ containerRef, className }: { containerRef: RefObject<HTMLDivElement | null>; className?: string }) {
  const { toc, active } = useTocCtx();
  const ref = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    if (!containerRef.current || !ref.current) return;
    const container = containerRef.current;
    if (!active) { ref.current.style.setProperty('--fd-top', '0px'); ref.current.style.setProperty('--fd-height', '0px'); return; }
    const a = container.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!a) { ref.current.style.setProperty('--fd-top', '0px'); ref.current.style.setProperty('--fd-height', '0px'); return; }
    const styles = getComputedStyle(a);
    const top = a.offsetTop + parseFloat(styles.paddingTop);
    const bottom = a.offsetTop + a.clientHeight - parseFloat(styles.paddingBottom);
    const center = (top + bottom) / 2;
    const stripe = 20; // 20px stripe height
    ref.current.style.setProperty('--fd-top', `${Math.max(0, center - stripe / 2)}px`);
    ref.current.style.setProperty('--fd-height', `${stripe}px`);
  }, [containerRef, active]);

  useEffect(() => { update(); }, [update]);
  useEffect(() => {
    const onScroll = () => update();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    const c = containerRef.current; if (c) c.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => { window.removeEventListener('scroll', onScroll as any); if (c) c.removeEventListener('scroll', onScroll as any); };
  }, [update, containerRef]);

  return <div ref={ref} className={className} aria-hidden />;
}

function lineOffset(depth: number) { return depth >= 3 ? 10 : 0; }
