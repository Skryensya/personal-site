import { useEffect, useRef } from 'react';
import { useFavicon } from '@/hooks/useFavicon';

// Default themes that have custom favicons
const DEFAULT_THEMES_WITH_FAVICON = {
  banana: 'favicon-banana',
  gameboy: 'favicon-gameboy',
  dos: 'favicon-dos',
  commodore64: 'favicon-commodore64',
  kurumi: 'favicon-kuromi' // Note: kurumi theme uses kuromi favicon
} as const;

type DefaultThemeId = keyof typeof DEFAULT_THEMES_WITH_FAVICON;

/**
 * Component that manages dynamic favicon changes based on current theme and mode
 */
export function FaviconManager() {
  const { setFavicon } = useFavicon();
  const lastThemeRef = useRef<string>('');
  const lastModeRef = useRef<boolean>(false);

  const updateFavicon = (themeId: string, isDark: boolean, force = false) => {
    // Skip if nothing changed (prevents constant updates)
    if (!force && lastThemeRef.current === themeId && lastModeRef.current === isDark) {
      return;
    }

    // Update refs
    lastThemeRef.current = themeId;
    lastModeRef.current = isDark;

    const mappedThemeId = DEFAULT_THEMES_WITH_FAVICON[themeId as DefaultThemeId];

    // If theme is not a default theme (company or special), use dos-dark
    if (!mappedThemeId) {
      setFavicon('/img/favicon/favicon-dos-dark.ico');
      return;
    }

    // Default themes get their specific favicon
    const darkSuffix = isDark ? '-dark' : '';
    const faviconPath = `/img/favicon/${mappedThemeId}${darkSuffix}.ico`;
    setFavicon(faviconPath);
  };

  const getCurrentThemeAndMode = () => {
    try {
      const themeId = localStorage.getItem('theme-id') || 'dos';
      const themeMode = localStorage.getItem('theme-mode') || 'system';

      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        // System mode - check system preference
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      return { themeId, isDark };
    } catch (error) {
      return { themeId: 'dos', isDark: false };
    }
  };

  useEffect(() => {
    // Update favicon on initial load
    const { themeId, isDark } = getCurrentThemeAndMode();
    updateFavicon(themeId, isDark, true);

    // Listen for localStorage changes (theme/mode updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme-id' || e.key === 'theme-mode') {
        const { themeId, isDark } = getCurrentThemeAndMode();
        updateFavicon(themeId, isDark);
      }
    };

    // Listen for system theme changes when in system mode
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const themeMode = localStorage.getItem('theme-mode') || 'system';
      if (themeMode === 'system') {
        const { themeId } = getCurrentThemeAndMode();
        updateFavicon(themeId, e.matches);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [setFavicon]);

  // This component doesn't render anything
  return null;
}

export default FaviconManager;