import React from 'react';
import { getClientTranslationsForComponents } from '@/i18n/utils';
import { applyHeadingSlugs } from '@/utils/heading-slugs';

type TocItem = { id: string; title: string; depth: number };

const TOP_OFFSET = 112;

export default function TocClerkAuto({ contentId }: { contentId: string }) {
  const t = getClientTranslationsForComponents();
  const [items, setItems] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>('inicio');

  React.useEffect(() => {
    const getRoot = () => {
      const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-heading-slug-root]'));
      const exact = roots.find((el) => el.id === contentId);
      if (exact) return exact;
      return document.getElementById(contentId) || roots[roots.length - 1] || document.querySelector('main');
    };

    const build = () => {
      const root = getRoot();
      if (!root) {
        setItems([]);
        return;
      }

      const results = applyHeadingSlugs(root, {
        selector: 'h2, h3, h4',
        filter: (heading) => !heading.closest('header') && !heading.closest('[data-toc-ignore]'),
      });

      const seen = new Set<string>();
      const next: TocItem[] = [{ id: 'inicio', title: t('nav.home'), depth: 1 }];
      seen.add('inicio');

      results.forEach(({ id, text, level }) => {
        if (!id || seen.has(id)) return;
        seen.add(id);
        next.push({ id, title: text.trim(), depth: level });
      });

      setItems(next);
    };

    const scheduleBuild = () => {
      if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(build);
      else window.setTimeout(build, 0);
    };

    scheduleBuild();
    const t1 = window.setTimeout(scheduleBuild, 120);
    const t2 = window.setTimeout(scheduleBuild, 500);

    document.addEventListener('astro:page-load', scheduleBuild);
    window.addEventListener('resize', scheduleBuild);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener('astro:page-load', scheduleBuild);
      window.removeEventListener('resize', scheduleBuild);
    };
  }, [contentId, t]);

  React.useEffect(() => {
    if (!items.length) {
      setActiveId('inicio');
      return;
    }

    const updateActive = () => {
      const sy = window.scrollY || window.pageYOffset;

      const hash = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));
      if (hash && items.some((i) => i.id === hash)) {
        setActiveId(hash);
        return;
      }

      if (sy <= 24) {
        setActiveId('inicio');
        return;
      }

      const headings = items
        .filter((i) => i.id !== 'inicio')
        .map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          return { id: item.id, top: el.getBoundingClientRect().top + sy };
        })
        .filter(Boolean) as { id: string; top: number }[];

      if (!headings.length) {
        setActiveId('inicio');
        return;
      }

      const reached = headings.filter((h) => h.top - TOP_OFFSET <= sy + 2);
      if (reached.length) {
        const current = reached.reduce((a, b) => (a.top > b.top ? a : b));
        setActiveId(current.id);
      } else {
        setActiveId(headings[0].id);
      }
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        updateActive();
      });
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true } as any);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('resize', schedule, { passive: true } as any);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule as any);
      window.removeEventListener('hashchange', schedule);
      window.removeEventListener('resize', schedule as any);
    };
  }, [items]);

  return (
    <nav aria-label={t('sidebar.toc')}>
      <div className="mb-3 text-xs font-mono font-medium text-main uppercase tracking-wide">{t('sidebar.toc')}</div>

      {items.length === 0 ? (
        <div className="rounded border bg-secondary/10 p-3 text-xs text-main/70">No headings</div>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive = item.id === activeId;
            const padding = item.depth <= 2 ? 'ps-2' : item.depth === 3 ? 'ps-5' : 'ps-7';

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  title={item.title}
                  className={[
                    'block py-1.5 pe-2 text-sm leading-snug border-l-2 transition-colors',
                    'max-w-full truncate',
                    padding,
                    isActive
                      ? 'text-main font-semibold bg-main/10 border-main'
                      : 'text-main/70 hover:text-main border-transparent hover:border-main/30',
                  ].join(' ')}
                >
                  {item.depth >= 3 ? <span className="me-1 text-main/50">·</span> : null}
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
