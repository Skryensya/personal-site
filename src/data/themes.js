// Sophisticated theme configuration - 8 curated themes with excellent contrast
// CSS implementation is in /src/styles/themes.css
// This file only contains metadata for UI generation
// All themes meet WCAG AA contrast requirements (4.5:1 minimum)
// Inspired by natural materials with muted, sophisticated color palette

// Function to get CSS variable value
function getCSSVariable(variableName) {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  return '';
}

export const themes = [
  {
    id: 'void',
    name: 'VOID',
    description: 'Pure minimalist contrast',
    get colorful() { return getCSSVariable('--void-colorful') || '#ffffff'; },
    get contrasty() { return getCSSVariable('--void-contrasty') || '#000000'; }
  },
  {
    id: 'sage',
    name: 'SAGE', 
    description: 'Muted eucalyptus wisdom',
    get colorful() { return getCSSVariable('--sage-colorful') || '#4a8b5c'; },
    get contrasty() { return getCSSVariable('--sage-contrasty') || '#1a1f1b'; }
  },
  {
    id: 'ink',
    name: 'INK',
    description: 'Stormy slate depths',
    get colorful() { return getCSSVariable('--ink-colorful') || '#3d6b84'; },
    get contrasty() { return getCSSVariable('--ink-contrasty') || '#0f172a'; }
  },
  {
    id: 'terracotta',
    name: 'TERRACOTTA',
    description: 'Earthy clay warmth',
    get colorful() { return getCSSVariable('--terracotta-colorful') || '#c47d47'; },
    get contrasty() { return getCSSVariable('--terracotta-contrasty') || '#2a1f18'; }
  },
  {
    id: 'lavender',
    name: 'LAVENDER',
    description: 'Soft purple haze',
    get colorful() { return getCSSVariable('--lavender-colorful') || '#7b85e6'; },
    get contrasty() { return getCSSVariable('--lavender-contrasty') || '#1a1b2e'; }
  },
  {
    id: 'rust',
    name: 'RUST',
    description: 'Weathered copper patina',
    get colorful() { return getCSSVariable('--rust-colorful') || '#b8653e'; },
    get contrasty() { return getCSSVariable('--rust-contrasty') || '#1f1611'; }
  },
  {
    id: 'moss',
    name: 'MOSS',
    description: 'Forest floor serenity',
    get colorful() { return getCSSVariable('--moss-colorful') || '#5c9b58'; },
    get contrasty() { return getCSSVariable('--moss-contrasty') || '#161a16'; }
  },
  {
    id: 'dusk',
    name: 'DUSK',
    description: 'Twilight sky meditation',
    get colorful() { return getCSSVariable('--dusk-colorful') || '#8a6bb8'; },
    get contrasty() { return getCSSVariable('--dusk-contrasty') || '#1a1724'; }
  }
];

export const themeKeys = themes.map(theme => theme.id);

// Simple theme management with localStorage optimization
export function applyTheme(themeId, isDark = false) {
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.classList.toggle('dark', isDark);
  
  console.log('Applied theme:', themeId, 'isDark:', isDark);
  
  // Persist to localStorage with error handling
  try {
    localStorage.setItem('theme-id', themeId);
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  } catch (e) {
    console.warn('Failed to save theme to localStorage:', e);
  }
}

// Get theme by id with fallback
export function getThemeById(id) {
  return themes.find(theme => theme.id === id) || themes[0];
}

// Load theme from localStorage with validation
export function loadThemeFromStorage() {
  try {
    const savedThemeId = localStorage.getItem('theme-id');
    const savedMode = localStorage.getItem('theme-mode');
    
    // Validate saved theme exists in current theme list
    const theme = savedThemeId && themes.find(t => t.id === savedThemeId) 
      ? savedThemeId 
      : themes[0].id;
    
    const isDark = savedMode === 'dark';
    
    return { themeId: theme, isDark };
  } catch (e) {
    console.warn('Failed to load theme from localStorage:', e);
    return { themeId: themes[0].id, isDark: false };
  }
}

// Initialize theme on page load
export function initializeTheme() {
  const { themeId, isDark } = loadThemeFromStorage();
  applyTheme(themeId, isDark);
  return { themeId, isDark };
}