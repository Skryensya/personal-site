import { useCallback } from 'react';

/**
 * Hook for dynamically changing the website's favicon
 * Based on react-haiku's useFavicon implementation
 */
export function useFavicon() {
  const setFavicon = useCallback((faviconUrl: string) => {
    // Find existing favicon link or create one
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }

    // Update the favicon href
    favicon.href = faviconUrl;
  }, []);

  return { setFavicon };
}