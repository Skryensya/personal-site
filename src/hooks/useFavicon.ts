import { useCallback, useRef } from 'react';

/**
 * Hook for dynamically changing the website's favicon
 * Based on react-haiku's useFavicon implementation
 */
export function useFavicon() {
  const faviconLinkRef = useRef<HTMLLinkElement | null>(null);
  const lastHrefRef = useRef<string>('');

  const setFavicon = useCallback((faviconUrl: string) => {
    if (typeof document === 'undefined') {
      return;
    }

    const normalizedHref = new URL(faviconUrl, window.location.origin).href;

    if (lastHrefRef.current === normalizedHref) {
      return;
    }

    lastHrefRef.current = normalizedHref;

    // Find existing favicon link or create one
    if (!faviconLinkRef.current || !document.head.contains(faviconLinkRef.current)) {
      const existingIcon = document.querySelector('link[rel="icon"][type="image/x-icon"]') as HTMLLinkElement | null;
      const fallbackIcon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;

      faviconLinkRef.current = existingIcon || fallbackIcon;

      if (!faviconLinkRef.current) {
        faviconLinkRef.current = document.createElement('link');
        faviconLinkRef.current.rel = 'icon';
        faviconLinkRef.current.type = 'image/x-icon';
        faviconLinkRef.current.dataset.dynamicFavicon = 'true';
        document.head.appendChild(faviconLinkRef.current);
      }
    }

    const favicon = faviconLinkRef.current;

    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = normalizedHref;

    // Ensure any other rel="icon" entries stay in sync to avoid stale favicons
    const additionalIcons = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]');
    additionalIcons.forEach(link => {
      if (link === favicon) {
        return;
      }
      if (link.href !== normalizedHref) {
        link.href = normalizedHref;
      }
      if (!link.type || link.type === 'image/svg+xml') {
        link.type = 'image/x-icon';
      }
    });
  }, []);

  return { setFavicon };
}
