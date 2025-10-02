import { useEffect } from 'react';
import { useFavicon } from '@/hooks/useFavicon';

// Mapping of theme IDs to favicon file names
const FAVICON_MAP = {
  banana: 'favicon-banana',
  gameboy: 'favicon-gameboy',
  dos: 'favicon-dos',
  commodore64: 'favicon-commodore64',
  kurumi: 'favicon-kuromi', // Note: kurumi theme uses kuromi favicon
  matrix: 'favicon-matrix',
  vaporwave: 'favicon-vaporwave'
} as const;

type ThemeId = keyof typeof FAVICON_MAP;

/**
 * Component that manages dynamic favicon changes based on current theme and mode
 */
export function FaviconManager() {
  const { setFavicon } = useFavicon();

  const updateFavicon = (themeId: string, isDark: boolean) => {
    const mappedThemeId = FAVICON_MAP[themeId as ThemeId];
    if (!mappedThemeId) {
      console.warn(`No favicon mapping found for theme: ${themeId}`);
      return;
    }

    const darkSuffix = isDark ? '-dark' : '';
    const faviconPath = `/img/favicon/${mappedThemeId}${darkSuffix}.ico`;

    console.log(`🔗 Updating favicon to: ${faviconPath}`);
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
      console.warn('Error reading theme from localStorage:', error);
      return { themeId: 'dos', isDark: false };
    }
  };

  useEffect(() => {
    // Update favicon on initial load
    const { themeId, isDark } = getCurrentThemeAndMode();
    updateFavicon(themeId, isDark);

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

    // Listen for custom theme change events from the theme controls
    const handleThemeChangeEvent = () => {
      setTimeout(() => {
        const { themeId, isDark } = getCurrentThemeAndMode();
        updateFavicon(themeId, isDark);
      }, 10); // Small delay to ensure localStorage is updated
    };

    window.addEventListener('storage', handleStorageChange);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Listen for theme control events
    window.addEventListener('theme-control-ready', handleThemeChangeEvent);
    window.addEventListener('mode-control-ready', handleThemeChangeEvent);

    // Also listen for DOM mutations on html[data-theme] for immediate updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
          const { themeId, isDark } = getCurrentThemeAndMode();
          updateFavicon(themeId, isDark);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('theme-control-ready', handleThemeChangeEvent);
      window.removeEventListener('mode-control-ready', handleThemeChangeEvent);
      observer.disconnect();
    };
  }, [setFavicon]);

  // This component doesn't render anything
  return null;
}

export default FaviconManager;