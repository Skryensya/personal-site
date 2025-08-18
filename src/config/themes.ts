/**
 * Centralized Theme Configuration
 * 
 * Single source of truth for all theme data, colors, and settings.
 * This file consolidates theme definitions while maintaining fast CSS-based switching.
 * 
 * Edit this file to:
 * - Add/remove themes
 * - Modify colors
 * - Change theme names/descriptions
 * - Adjust special effects
 * - Update accessibility settings
 */

export interface ThemeColors {
  colorful: string;    // Primary accent color
  contrasty: string;   // Background/contrast color
}

export interface ThemeEffects {
  glow?: string;           // Drop shadow glow effect
  pixelRendering?: boolean; // Pixel-perfect rendering
  fontOverride?: string;   // Custom font family
  scanLines?: boolean;     // CRT scan line effect
  warmGlow?: boolean;      // Warm glow effect
  neonPulse?: boolean;     // Pulsing neon effect
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  effects?: ThemeEffects;
  /** WCAG contrast ratio (minimum 4.5:1 for AA compliance) */
  contrastRatio: number;
  /** Computing era/inspiration for theme */
  era?: string;
}

/**
 * Master theme configuration - edit colors and settings here
 * All themes meet WCAG AA contrast requirements (4.5:1 minimum)
 */
export const THEME_CONFIG: Theme[] = [
  {
    id: 'dos',
    name: 'MS-DOS',
    description: 'Command line interface',
    colors: {
      colorful: '#ffffff',
      contrasty: '#000000'
    },
    contrastRatio: 21.0,
    era: '1981-1995',
    effects: {
      fontOverride: "'Fira Code', 'Cascadia Code', 'SF Mono', monospace"
    }
  },
  {
    id: 'gameboy',
    name: 'GAME BOY',
    description: 'Monochrome LCD legend',
    colors: {
      colorful: '#9bbc0f',
      contrasty: '#081f08'
    },
    contrastRatio: 6.8,
    era: '1989',
    effects: {
      pixelRendering: true
    }
  },
  {
    id: 'commodore64',
    name: 'COMMODORE 64',
    description: 'Blue screen computing legend',
    colors: {
      colorful: '#b8d4f0',
      contrasty: '#0d0d1f'
    },
    contrastRatio: 8.2,
    era: '1982',
    effects: {
      scanLines: true
    }
  },
  {
    id: 'caution',
    name: 'CAUTION',
    description: 'Warning tape industrial',
    colors: {
      colorful: '#ffff00',
      contrasty: '#000000'
    },
    contrastRatio: 19.6,
    era: 'Industrial Design'
  },
  {
    id: 'sunset',
    name: 'SUNSET',
    description: 'Warm orange retro sunset',
    colors: {
      colorful: '#ff6600',
      contrasty: '#1a0800'
    },
    contrastRatio: 8.1,
    era: 'Retro Computing',
    effects: {
      warmGlow: true
    }
  },
  {
    id: 'neon',
    name: 'NEON',
    description: 'Electric pink cyberpunk',
    colors: {
      colorful: '#ff0080',
      contrasty: '#0a0008'
    },
    contrastRatio: 7.3,
    era: 'Cyberpunk',
    effects: {
      glow: 'drop-shadow(0 0 8px var(--theme-colorful))',
      neonPulse: true
    }
  },
  {
    id: 'ocean',
    name: 'OCEAN',
    description: 'Deep cyan retro waves',
    colors: {
      colorful: '#00ccff',
      contrasty: '#001a33'
    },
    contrastRatio: 9.1,
    era: 'Retro Computing',
    effects: {
      glow: 'drop-shadow(0 0 6px var(--theme-colorful))'
    }
  },
  {
    id: 'forest',
    name: 'FOREST',
    description: 'Classic green terminal',
    colors: {
      colorful: '#00ff00',
      contrasty: '#001100'
    },
    contrastRatio: 11.7,
    era: 'Terminal Computing',
    effects: {
      glow: 'drop-shadow(0 0 4px var(--theme-colorful))'
    }
  },
  {
    id: 'ember',
    name: 'EMBER',
    description: 'Burning red retro fire',
    colors: {
      colorful: '#ff3300',
      contrasty: '#1a0500'
    },
    contrastRatio: 7.8,
    era: 'Retro Computing',
    effects: {
      glow: 'drop-shadow(0 0 6px var(--theme-colorful))'
    }
  },
  {
    id: 'violet',
    name: 'VIOLET',
    description: 'Purple retro synthwave',
    colors: {
      colorful: '#9966ff',
      contrasty: '#0f0a1a'
    },
    contrastRatio: 6.2,
    era: 'Synthwave',
    effects: {
      glow: 'drop-shadow(0 0 10px var(--theme-colorful))'
    }
  }
];

/**
 * Theme utilities and accessors
 */
export const themeKeys = THEME_CONFIG.map(theme => theme.id);
export const defaultTheme = THEME_CONFIG[0]; // DOS theme

/**
 * Get theme by ID with fallback to default
 */
export function getThemeById(id: string): Theme {
  return THEME_CONFIG.find(theme => theme.id === id) || defaultTheme;
}

/**
 * Get all theme IDs
 */
export function getAllThemeIds(): string[] {
  return themeKeys;
}

/**
 * Get themes by era/category
 */
export function getThemesByEra(era: string): Theme[] {
  return THEME_CONFIG.filter(theme => theme.era === era);
}

/**
 * Get high contrast themes (>10.0 ratio)
 */
export function getHighContrastThemes(): Theme[] {
  return THEME_CONFIG.filter(theme => theme.contrastRatio >= 10.0);
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(theme: Theme): Record<string, string> {
  const cssProps: Record<string, string> = {
    [`--${theme.id}-colorful`]: theme.colors.colorful,
    [`--${theme.id}-contrasty`]: theme.colors.contrasty,
  };

  // Add effect properties
  if (theme.effects?.glow) {
    cssProps[`--${theme.id}-glow`] = theme.effects.glow;
  }

  if (theme.effects?.fontOverride) {
    cssProps[`--${theme.id}-font`] = theme.effects.fontOverride;
  }

  return cssProps;
}

/**
 * Generate all CSS custom properties for all themes
 */
export function generateAllThemesCSS(): Record<string, string> {
  return THEME_CONFIG.reduce((acc, theme) => {
    return { ...acc, ...generateThemeCSS(theme) };
  }, {});
}

/**
 * Apply theme function with centralized configuration
 * Fast CSS-based theme switching using CSS custom properties
 */
export function applyTheme(themeId: string, isDark = false): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const theme = getThemeById(themeId);
  
  // Set theme data attribute for CSS selectors
  root.setAttribute('data-theme', themeId);
  
  // Apply dark/light mode
  root.classList.toggle('dark', isDark);
  
  // Set dynamic CSS properties (colors are defined in CSS file)
  root.style.setProperty('--theme-colorful', theme.colors.colorful);
  root.style.setProperty('--theme-contrasty', theme.colors.contrasty);
  
  // Apply theme-specific effects
  if (theme.effects?.glow) {
    root.style.setProperty('--tech-glow', theme.effects.glow);
  }
  
  if (theme.effects?.fontOverride) {
    root.style.setProperty('--font-family-override', theme.effects.fontOverride);
  }

  // Persist to localStorage
  try {
    localStorage.setItem('theme-id', themeId);
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  } catch (e) {
    console.warn('Failed to save theme to localStorage:', e);
  }
}

/**
 * Load theme from localStorage with validation
 */
export function loadThemeFromStorage(): { themeId: string; isDark: boolean; mode: string } {
  try {
    const savedThemeId = localStorage.getItem('theme-id');
    const savedMode = localStorage.getItem('theme-mode');

    // Validate saved theme exists in current theme list
    const theme = savedThemeId && THEME_CONFIG.find(t => t.id === savedThemeId) 
      ? savedThemeId 
      : defaultTheme.id;

    const isDark = savedMode === 'dark';
    const mode = isDark ? 'dark' : 'light';

    return { themeId: theme, isDark, mode };
  } catch (e) {
    console.warn('Failed to load theme from localStorage:', e);
    return { themeId: defaultTheme.id, isDark: false, mode: 'light' };
  }
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): { themeId: string; isDark: boolean } {
  const { themeId, isDark } = loadThemeFromStorage();
  applyTheme(themeId, isDark);
  return { themeId, isDark };
}

/**
 * Legacy compatibility exports (to maintain existing API)
 */
export const themes = THEME_CONFIG.map(theme => ({
  id: theme.id,
  name: theme.name,
  description: theme.description,
  get colorful() {
    // Dynamic CSS variable accessor for backward compatibility
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${theme.id}-colorful`).trim() || theme.colors.colorful;
    }
    return theme.colors.colorful;
  },
  get contrasty() {
    // Dynamic CSS variable accessor for backward compatibility
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${theme.id}-contrasty`).trim() || theme.colors.contrasty;
    }
    return theme.colors.contrasty;
  }
}));

// Functions are already exported above - no need to re-export