import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, type RefObject } from 'react';
import { cn } from '@/lib/utils';

export type TOCItemType = { url: string; title: string; depth: number };

type Ctx = { toc: TOCItemType[]; activeIds: string[]; topOffset: number };
const TocCtx = createContext<Ctx | null>(null);

export function useTocCtx() {
  const v = useContext(TocCtx);
  if (!v) throw new Error('TocClerkProvider required');
  return v;
}

export function TocClerkProvider({ toc, topOffset = 112, children }: { toc: TOCItemType[]; topOffset?: number; children: React.ReactNode }) {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const ids = useMemo(() => toc.map(i => (i.url.startsWith('#') ? i.url.slice(1) : i.url)), [toc]);
  const hasInicio = useMemo(() => ids.includes('inicio'), [ids]);

  const recomputeFromDOM = useCallback(() => {
    const sy = window.scrollY || window.pageYOffset;

    if (hasInicio && sy <= Math.max(20, topOffset * 0.35)) {
      setActiveIds((prev) => (prev.length === 1 && prev[0] === 'inicio' ? prev : ['inicio']));
      return;
    }

    const entries = ids
      .filter((id) => id !== 'inicio')
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + sy;
        return { id, top: absoluteTop, distance: absoluteTop - (sy + topOffset) };
      })
      .filter(Boolean) as { id: string; top: number; distance: number }[];

    if (!entries.length) {
      setActiveIds((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    // Prefer the last heading that has reached the sticky line.
    const above = entries.filter((e) => e.distance <= 8);
    if (above.length) {
      const winner = above.reduce((a, b) => (a.top > b.top ? a : b));
      setActiveIds((prev) => (prev.length === 1 && prev[0] === winner.id ? prev : [winner.id]));
      return;
    }

    // Otherwise, choose the nearest heading below the line.
    const below = entries.filter((e) => e.distance > 8);
    const winner = below.reduce((a, b) => (a.top < b.top ? a : b));
    setActiveIds((prev) => (prev.length === 1 && prev[0] === winner.id ? prev : [winner.id]));
  }, [ids, topOffset, hasInicio]);

  useEffect(() => {
    if (!ids.length) {
      setActiveIds([]);
      return;
    }

    const applyHashActive = () => {
      const raw = (window.location.hash || '').replace(/^#/, '');
      const hashId = raw ? decodeURIComponent(raw) : '';
      if (!hashId || !ids.includes(hashId)) return false;
      setActiveIds((prev) => (prev.length === 1 && prev[0] === hashId ? prev : [hashId]));
      return true;
    };

    let preferHashUntil = 0;

    const scheduleRecompute = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        // Honor explicit hash briefly after navigation, then resume scroll-based active state.
        if (Date.now() < preferHashUntil && applyHashActive()) {
          return;
        }
        recomputeFromDOM();
      });
    };

    let raf = 0;
    if (window.location.hash) {
      preferHashUntil = Date.now() + 1000;
    }
    scheduleRecompute();

    const onHashChange = () => {
      preferHashUntil = Date.now() + 1200;
      scheduleRecompute();
    };

    window.addEventListener('scroll', scheduleRecompute, { passive: true } as any);
    window.addEventListener('resize', scheduleRecompute, { passive: true } as any);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scheduleRecompute as any);
      window.removeEventListener('resize', scheduleRecompute as any);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [ids, recomputeFromDOM]);

  const value = useMemo<Ctx>(() => ({ toc, activeIds, topOffset }), [toc, activeIds, topOffset]);
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
          className="absolute left-0 top-0 pointer-events-none"
          style={{ width: svg.width, height: svg.height, maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${svg.width} ${svg.height}\"><path d=\"${svg.path}\" stroke=\"black\" stroke-width=\"2\" fill=\"none\" /></svg>`)}")` }}
        >
          <TocThumb containerRef={containerRef} className="mt-[var(--fd-top)] h-[var(--fd-height)] bg-main/90 transition-[margin,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
        </div>
      ) : null}
      {toc.map((item, i) => (
        <TocClerkItem key={item.url} item={item} upper={toc[i-1]?.depth} lower={toc[i+1]?.depth} />
      ))}
    </div>
  );
}

function TocClerkItem({ item, upper = item.depth, lower = item.depth }: { item: TOCItemType; upper?: number; lower?: number }) {
  const { activeIds } = useTocCtx();
  const slug = item.url.startsWith('#') ? item.url.slice(1) : item.url;
  const padding = item.depth <= 2 ? 'ps-3' : item.depth === 3 ? 'ps-6' : 'ps-8';
  const isActive = activeIds.includes(slug);
  const offset = lineOffset(item.depth);
  const upperOffset = lineOffset(upper);
  const lowerOffset = lineOffset(lower);
  const highlightLeft = offset + 4;

  return (
    <a
      href={item.url}
      data-active={isActive}
      className={cn(
        'prose relative py-1.5 pe-2 text-sm text-main/70 hover:text-main transition-all duration-300 [overflow-wrap:anywhere] first:pt-0 last:pb-0',
        isActive && 'text-main font-semibold bg-main/10 border-l-2 border-main',
        padding,
      )}
      onClick={(e) => {
        if (slug === 'inicio') {
          e.preventDefault();
          window.history.pushState(null, '', '#inicio');
          window.dispatchEvent(new Event('hashchange'));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      {isActive ? (
        <div
          className="absolute inset-y-0 rounded-sm bg-main/10 transition-all duration-300"
          style={{ left: highlightLeft }}
          aria-hidden
        />
      ) : null}

      {offset !== upperOffset ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="absolute -top-1.5 left-0 size-4 z-10">
          <line x1={upperOffset} y1="0" x2={offset} y2="12" className="stroke-main/10" strokeWidth="1" />
        </svg>
      ) : null}
      <div
        className={cn(
          'absolute inset-y-0 w-px transition-colors duration-300 z-10',
          isActive ? 'bg-main/35' : 'bg-main/10',
          offset !== upperOffset && 'top-1.5',
          offset !== lowerOffset && 'bottom-1.5',
        )}
        style={{ left: offset }}
        aria-hidden
      />
      {isActive ? (
        <div
          className={cn(
            'absolute inset-y-0 w-[2px] bg-main transition-all duration-300 z-20',
            offset !== upperOffset && 'top-1.5',
            offset !== lowerOffset && 'bottom-1.5',
          )}
          style={{ left: offset }}
          aria-hidden
        />
      ) : null}

      <span className="relative z-10">{item.title}</span>
    </a>
  );
}

function TocThumb({ containerRef, className }: { containerRef: RefObject<HTMLDivElement | null>; className?: string }) {
  const { activeIds } = useTocCtx();
  const ref = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    if (!containerRef.current || !ref.current) return;
    const container = containerRef.current;
    const activeAnchors = activeIds
      .filter((id) => id !== 'inicio')
      .map((id) => container.querySelector<HTMLElement>(`a[href="#${id}"]`))
      .filter(Boolean) as HTMLElement[];

    if (!activeAnchors.length) {
      ref.current.style.setProperty('--fd-top', '0px');
      ref.current.style.setProperty('--fd-height', '0px');
      return;
    }

    const bounds = activeAnchors.map((a) => {
      const styles = getComputedStyle(a);
      const top = a.offsetTop + parseFloat(styles.paddingTop);
      const bottom = a.offsetTop + a.clientHeight - parseFloat(styles.paddingBottom);
      return { top, bottom };
    });

    const top = Math.min(...bounds.map((b) => b.top));
    const bottom = Math.max(...bounds.map((b) => b.bottom));
    const height = Math.max(20, bottom - top);

    ref.current.style.setProperty('--fd-top', `${Math.max(0, top)}px`);
    ref.current.style.setProperty('--fd-height', `${height}px`);
  }, [containerRef, activeIds]);

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
