// Theme configuration with color abstraction
// For each theme: 
//   - colorful: The vibrant/brand color (e.g., #00ff41 for Matrix, #1da1f2 for Twitter)
//   - contrasty: The neutral/contrasting color (e.g., #000000 for black, #ffffff for white)
// 
// Light mode: colorful text on contrasty background (dark vivid on light neutral)
// Dark mode: contrasty text on colorful background (light neutral on dark vivid)
//
// This makes it easier to decide which color should be prominent in each mode

export const themes = {
  void: {
    name: 'VOID',
    colorful: '#f8f9fa',  // Subtle off-white
    contrasty: '#0d1117'  // GitHub dark
  },
  phantom: {
    name: 'PHANTOM',
    colorful: '#39ff14',  // Matrix green (INTENSE)
    contrasty: '#0a1a0a'  // Very dark green
  },
  bloom: {
    name: 'BLOOM',
    colorful: '#ff6b9d',  // Cherry blossom pink
    contrasty: '#2d1b20'  // Dark rose
  },
  crimson: {
    name: 'CRIMSON',
    colorful: '#ff073a',  // Blood red (INTENSE)
    contrasty: '#220a0a'  // Very dark red
  },
  azure: {
    name: 'AZURE',
    colorful: '#007fff',  // Azure blue
    contrasty: '#0a1a2e'  // Dark navy
  },
  volt: {
    name: 'VOLT',
    colorful: '#ffff00',  // Electric yellow (INTENSE)
    contrasty: '#2e2e0a'  // Dark olive
  },
  forest: {
    name: 'FOREST',
    colorful: '#228b22',  // Forest green
    contrasty: '#0f1f0f'  // Dark forest
  },
  ember: {
    name: 'EMBER',
    colorful: '#ff6347',  // Tomato ember
    contrasty: '#2e1a0f'  // Dark ember
  },
  flame: {
    name: 'FLAME',
    colorful: '#ff4500',  // Orange flame
    contrasty: '#2e1500'  // Dark flame
  },
  violet: {
    name: 'VIOLET',
    colorful: '#9932cc',  // Dark orchid
    contrasty: '#1a0f2e'  // Dark purple
  },
  plasma: {
    name: 'PLASMA',
    colorful: '#00ffff',  // Electric cyan (INTENSE)
    contrasty: '#0a2e2e'  // Dark teal
  },
  solar: {
    name: 'SOLAR',
    colorful: '#ffa500',  // Golden orange
    contrasty: '#2e1f0a'  // Dark gold
  },
  frost: {
    name: 'FROST',
    colorful: '#4fbdba',  // Ice blue
    contrasty: '#0f2e2d'  // Dark frost
  },
  neon: {
    name: 'NEON',
    colorful: '#ff00ff',  // Pure magenta (INTENSE)
    contrasty: '#2e0a2e'  // Dark magenta
  },
  pulse: {
    name: 'PULSE',
    colorful: '#ff1493',  // Deep pink
    contrasty: '#2e0f1f'  // Dark pink
  },
  prism: {
    name: 'PRISM',
    colorful: 'var(--user-selection-color)',  // Dynamic user selection color
    contrasty: '#1a1a1a'  // Dark gray
  }
};

export const themeKeys = Object.keys(themes);