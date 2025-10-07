import React from 'react';
import { TocClerkProvider, TocClerkItems, type TOCItemType } from '@/components/TocClerk';
import { getClientTranslationsForComponents } from '@/i18n/utils';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function TocClerkAuto({ contentId }: { contentId: string }) {
  const [toc, setToc] = React.useState<TOCItemType[]>([]);
  const t = getClientTranslationsForComponents();

  React.useEffect(() => {
    const root = document.getElementById(contentId);
    if (!root) return;
    const heads = Array.from(root.querySelectorAll('h2, h3, h4')) as HTMLElement[];
    const seen = new Set<string>();
    const items: TOCItemType[] = heads
      .filter(h => !h.closest('header'))
      .map((h, i) => {
        const level = Number(h.tagName.substring(1));
        let id = h.id || slugify(h.textContent || '');
        const base = id; let n = 1;
        while (seen.has(id) || (id && document.getElementById(id) && h.id !== id)) id = `${base}-${n++}`;
        if (!h.id) h.id = id;
        seen.add(id);
        return { url: `#${id}`, title: h.textContent || '', depth: level };
      });
    // Add start anchor as the first item
    const withStart: TOCItemType[] = [
      { url: '#inicio', title: t('nav.home'), depth: 1 },
      ...items,
    ];
    setToc(withStart);
  }, [contentId]);

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
