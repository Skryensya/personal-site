/**
 * DEPRECATED: This file is maintained for backward compatibility only.
 * 
 * NEW CENTRALIZED CONFIGURATION: /src/config/themes.ts
 * 
 * Please use the new centralized theme configuration for all new code:
 * import { THEME_CONFIG, applyTheme, getThemeById } from '@/config/themes';
 * 
 * This file re-exports the new configuration to maintain API compatibility.
 */

// Re-export centralized theme configuration for backward compatibility
export {
  themes,
  themeKeys,
  applyTheme,
  getThemeById,
  loadThemeFromStorage,
  initializeTheme
} from '@/config/themes';
