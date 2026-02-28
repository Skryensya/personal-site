import { useEffect } from 'react';
import { useFavicon } from '@/hooks/useFavicon';

const BLACK_FAVICON = '/img/favicon/favicon-dos-dark.ico';

/**
 * Keeps a single black favicon regardless of theme/mode.
 */
export function FaviconManager() {
  const { setFavicon } = useFavicon();

  useEffect(() => {
    setFavicon(BLACK_FAVICON);
  }, [setFavicon]);

  return null;
}

export default FaviconManager;
