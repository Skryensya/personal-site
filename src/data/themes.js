// Optimized theme configuration - Limited to 5 beautiful, carefully curated themes
// CSS implementation is in /src/styles/themes.css
// This file only contains metadata for UI generation

export const themes = [
  {
    id: 'void',
    name: 'VOID',
    description: 'Pure minimalist contrast',
    colorful: '#f8fafc',  // Softer white with subtle warmth
    contrasty: '#0f172a'  // Rich slate black for better readability
  },
  {
    id: 'phantom',
    name: 'PHANTOM', 
    description: 'Classic terminal green',
    colorful: '#22c55e',  // Softer matrix green - easier on eyes
    contrasty: '#0f1419'  // Warmer dark green base
  },
  {
    id: 'azure',
    name: 'AZURE',
    description: 'Calm ocean depths',
    colorful: '#3b82f6',  // Softer blue - more readable
    contrasty: '#1e293b'  // Deeper slate blue for contrast
  },
  {
    id: 'ember',
    name: 'EMBER',
    description: 'Warm coding comfort',
    colorful: '#f97316',  // Softer orange - less harsh
    contrasty: '#1c1917'  // Warm dark stone
  },
  {
    id: 'violet',
    name: 'VIOLET',
    description: 'Creative inspiration',
    colorful: '#8b5cf6',  // Softer purple - more refined
    contrasty: '#1e1b3a'  // Deep violet base for elegance
  },
  {
    id: 'custom',
    name: 'CUSTOM',
    description: 'Your personalized colors',
    colorful: '#3b82f6',  // Default blue (will be overridden)
    contrasty: '#1e293b'  // Default dark (will be overridden)
  }
];

export const themeKeys = themes.map(theme => theme.id);

// Enhanced theme management with localStorage optimization
export function applyTheme(themeId, isDark = false, customColors = null) {
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.classList.toggle('dark', isDark);
  
  // Apply custom colors if provided
  if (themeId === 'custom' && customColors) {
    document.documentElement.style.setProperty('--theme-colorful', customColors.colorful);
    document.documentElement.style.setProperty('--theme-contrasty', customColors.contrasty);
  }
  
  // Persist to localStorage with error handling
  try {
    localStorage.setItem('theme-id', themeId);
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    
    // Save custom colors only if it's a custom theme
    if (themeId === 'custom' && customColors) {
      localStorage.setItem('custom-theme-colors', JSON.stringify(customColors));
    }
  } catch (e) {
    console.warn('Failed to save theme to localStorage:', e);
  }
}

// Get theme by id with fallback
export function getThemeById(id) {
  return themes.find(theme => theme.id === id) || themes[0];
}

// Parse theme from URL parameters
export function parseThemeFromURL() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    
    if (themeParam) {
      const themeData = JSON.parse(atob(themeParam));
      if (themeData.name && themeData.colorful && themeData.contrasty) {
        return {
          name: themeData.name,
          colorful: themeData.colorful,
          contrasty: themeData.contrasty
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse theme from URL:', e);
  }
  return null;
}

// Load theme from localStorage with validation
export function loadThemeFromStorage() {
  try {
    // First check if there's a theme in the URL
    const urlTheme = parseThemeFromURL();
    if (urlTheme) {
      // Apply URL theme and switch to custom theme
      saveCustomColors(urlTheme.colorful, urlTheme.contrasty, urlTheme.name);
      localStorage.setItem('theme-id', 'custom');
      return { themeId: 'custom', isDark: false, customColors: urlTheme };
    }

    const savedThemeId = localStorage.getItem('theme-id');
    const savedMode = localStorage.getItem('theme-mode');
    
    // Validate saved theme exists in current theme list
    const theme = savedThemeId && themes.find(t => t.id === savedThemeId) 
      ? savedThemeId 
      : themes[0].id;
    
    const isDark = savedMode === 'dark';
    
    // Load custom colors if it's a custom theme
    let customColors = null;
    if (theme === 'custom') {
      try {
        const savedColors = localStorage.getItem('custom-theme-colors');
        customColors = savedColors ? JSON.parse(savedColors) : null;
      } catch (e) {
        console.warn('Failed to parse custom theme colors:', e);
      }
    }
    
    return { themeId: theme, isDark, customColors };
  } catch (e) {
    console.warn('Failed to load theme from localStorage:', e);
    return { themeId: themes[0].id, isDark: false, customColors: null };
  }
}

// Get custom colors from localStorage
export function getCustomColors() {
  try {
    const savedColors = localStorage.getItem('custom-theme-colors');
    return savedColors ? JSON.parse(savedColors) : { colorful: '#3b82f6', contrasty: '#1e293b', name: 'CUSTOM' };
  } catch (e) {
    console.warn('Failed to get custom colors:', e);
    return { colorful: '#3b82f6', contrasty: '#1e293b', name: 'CUSTOM' };
  }
}

// Save custom colors to localStorage
export function saveCustomColors(colorful, contrasty, name = 'CUSTOM') {
  try {
    const customColors = { colorful, contrasty, name };
    localStorage.setItem('custom-theme-colors', JSON.stringify(customColors));
    return customColors;
  } catch (e) {
    console.warn('Failed to save custom colors:', e);
    return null;
  }
}

// Initialize theme on page load
export function initializeTheme() {
  const { themeId, isDark, customColors } = loadThemeFromStorage();
  applyTheme(themeId, isDark, customColors);
  return { themeId, isDark, customColors };
}