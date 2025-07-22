// Theme metadata configuration
// CSS implementation is in /src/styles/themes.css
// This file only contains metadata for UI generation

export const themes = [
  {
    id: 'void',
    name: 'VOID',
    colorful: '#f5f7fa',  // Pure crisp white with slight blue undertone
    contrasty: '#0a0c10'  // Deep space black with blue hint
  },
  {
    id: 'phantom',
    name: 'PHANTOM',
    colorful: '#00ff41',  // Pure matrix green - iconic and sharp
    contrasty: '#0d1b0f'  // Rich dark green with depth
  },
  {
    id: 'bloom',
    name: 'BLOOM',
    colorful: '#ff4d87',  // Vibrant cherry blossom - more saturated
    contrasty: '#1f0e16'  // Deep burgundy black
  },
  {
    id: 'crimson',
    name: 'CRIMSON',
    colorful: '#dc143c',  // Classic crimson - rich and powerful
    contrasty: '#1a0408'  // Almost black with red undertone
  },
  {
    id: 'azure',
    name: 'AZURE',
    colorful: '#0080ff',  // Perfect azure - bright but not harsh
    contrasty: '#060f1c'  // Deep midnight blue
  },
  {
    id: 'volt',
    name: 'VOLT',
    colorful: '#f0ff00',  // Electric lime - more energetic than pure yellow
    contrasty: '#1c1f06'  // Dark olive with yellow undertone
  },
  {
    id: 'forest',
    name: 'FOREST',
    colorful: '#2d5a2d',  // Rich forest green - more sophisticated
    contrasty: '#0b1a0b'  // Deep forest night
  },
  {
    id: 'ember',
    name: 'EMBER',
    colorful: '#ff5722',  // Perfect ember orange - warm and glowing
    contrasty: '#1a0e06'  // Deep amber black
  },
  {
    id: 'flame',
    name: 'FLAME',
    colorful: '#ff6600',  // Pure flame orange - intense heat
    contrasty: '#1f1100'  // Dark flame base
  },
  {
    id: 'violet',
    name: 'VIOLET',
    colorful: '#8a2be2',  // Blue violet - more refined than orchid
    contrasty: '#14081f'  // Deep violet black
  },
  {
    id: 'plasma',
    name: 'PLASMA',
    colorful: '#00e5ff',  // Electric cyan - bright plasma blue
    contrasty: '#051f1f'  // Deep teal black
  },
  {
    id: 'solar',
    name: 'SOLAR',
    colorful: '#ffb347',  // Warm solar peach - softer than pure orange
    contrasty: '#1f1608'  // Rich golden black
  },
  {
    id: 'frost',
    name: 'FROST',
    colorful: '#87ceeb',  // Sky blue - cooler and more icy
    contrasty: '#0c1b1e'  // Deep frost black
  },
  {
    id: 'neon',
    name: 'NEON',
    colorful: '#ff0080',  // Hot magenta - more electric than pure magenta
    contrasty: '#1f051a'  // Deep magenta black
  },
  {
    id: 'pulse',
    name: 'PULSE',
    colorful: '#ff3366',  // Bright coral pink - more energetic
    contrasty: '#1a0810'  // Deep rose black
  }
];

// Prism theme is special - uses user selection color
export const prismTheme = {
  id: 'prism',
  name: 'PRISM',
  colorful: 'var(--user-selection-color)',  // Dynamic user selection color
  contrasty: '#0f0f0f'  // Pure neutral dark
};

export const themeKeys = themes.map(theme => theme.id);
export const allThemes = [...themes, prismTheme];

// Simple theme application - CSS handles the heavy lifting
export function applyTheme(themeId, isDark = false) {
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.classList.toggle('dark', isDark);
}

// Get theme by id
export function getThemeById(id) {
  if (id === 'prism') return prismTheme;
  return themes.find(theme => theme.id === id) || themes[0];
}