import React from 'react';
import { TocClerkProvider, TocClerkItems, type TOCItemType } from '@/components/TocClerk';
import { getClientTranslationsForComponents } from '@/i18n/utils';
import { applyHeadingSlugs } from '@/utils/heading-slugs';

export default function TocClerkAuto({ contentId }: { contentId: string }) {
  const [toc, setToc] = React.useState<TOCItemType[]>([]);
  const t = getClientTranslationsForComponents();
  const startTitle: string = t('nav.home');

  React.useEffect(() => {
    const buildToc = () => {
      const root = document.getElementById(contentId);
      if (!root) {
        setToc([]);
        return;
      }

      const slugResults = applyHeadingSlugs(root, {
        selector: 'h2, h3, h4',
        filter: (heading) => !heading.closest('header'),
      });

      const items: TOCItemType[] = slugResults.map(({ id, text, level }) => ({
        url: `#${id}`,
        title: text,
        depth: level,
      }));

      if (items.length === 0) {
        setToc([]);
        return;
      }

      const withStart: TOCItemType[] = [
        { url: '#inicio', title: startTitle, depth: 1 },
        ...items,
      ];

      setToc(withStart);
    };

    const scheduleBuild = () => {
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(buildToc);
      } else {
        window.setTimeout(buildToc, 0);
      }
    };

    scheduleBuild();
    document.addEventListener('astro:page-load', scheduleBuild);

    return () => {
      document.removeEventListener('astro:page-load', scheduleBuild);
    };
  }, [contentId, startTitle]);

  return (
    <nav>
      <div className="mb-3">
        <div className="text-xs font-mono font-medium text-main uppercase tracking-wide">{t('sidebar.toc')}</div>
      </div>
      {toc.length === 0 ? (
        <div className="rounded border bg-secondary/10 p-3 text-xs text-main/70">No headings</div>
      ) : (
        <TocClerkProvider toc={toc}>
          <TocClerkItems />
        </TocClerkProvider>
      )}
    </nav>
  );
}
