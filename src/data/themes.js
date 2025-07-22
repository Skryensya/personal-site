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
    colorful: '#f5f7fa',  // Pure crisp white with slight blue undertone
    contrasty: '#0a0c10'  // Deep space black with blue hint
  },
  phantom: {
    name: 'PHANTOM',
    colorful: '#00ff41',  // Pure matrix green - iconic and sharp
    contrasty: '#0d1b0f'  // Rich dark green with depth
  },
  bloom: {
    name: 'BLOOM',
    colorful: '#ff4d87',  // Vibrant cherry blossom - more saturated
    contrasty: '#1f0e16'  // Deep burgundy black
  },
  crimson: {
    name: 'CRIMSON',
    colorful: '#dc143c',  // Classic crimson - rich and powerful
    contrasty: '#1a0408'  // Almost black with red undertone
  },
  azure: {
    name: 'AZURE',
    colorful: '#0080ff',  // Perfect azure - bright but not harsh
    contrasty: '#060f1c'  // Deep midnight blue
  },
  volt: {
    name: 'VOLT',
    colorful: '#f0ff00',  // Electric lime - more energetic than pure yellow
    contrasty: '#1c1f06'  // Dark olive with yellow undertone
  },
  forest: {
    name: 'FOREST',
    colorful: '#2d5a2d',  // Rich forest green - more sophisticated
    contrasty: '#0b1a0b'  // Deep forest night
  },
  ember: {
    name: 'EMBER',
    colorful: '#ff5722',  // Perfect ember orange - warm and glowing
    contrasty: '#1a0e06'  // Deep amber black
  },
  flame: {
    name: 'FLAME',
    colorful: '#ff6600',  // Pure flame orange - intense heat
    contrasty: '#1f1100'  // Dark flame base
  },
  violet: {
    name: 'VIOLET',
    colorful: '#8a2be2',  // Blue violet - more refined than orchid
    contrasty: '#14081f'  // Deep violet black
  },
  plasma: {
    name: 'PLASMA',
    colorful: '#00e5ff',  // Electric cyan - bright plasma blue
    contrasty: '#051f1f'  // Deep teal black
  },
  solar: {
    name: 'SOLAR',
    colorful: '#ffb347',  // Warm solar peach - softer than pure orange
    contrasty: '#1f1608'  // Rich golden black
  },
  frost: {
    name: 'FROST',
    colorful: '#87ceeb',  // Sky blue - cooler and more icy
    contrasty: '#0c1b1e'  // Deep frost black
  },
  neon: {
    name: 'NEON',
    colorful: '#ff0080',  // Hot magenta - more electric than pure magenta
    contrasty: '#1f051a'  // Deep magenta black
  },
  pulse: {
    name: 'PULSE',
    colorful: '#ff3366',  // Bright coral pink - more energetic
    contrasty: '#1a0810'  // Deep rose black
  },
  prism: {
    name: 'PRISM',
    colorful: 'var(--user-selection-color)',  // Dynamic user selection color
    contrasty: '#0f0f0f'  // Pure neutral dark
  }
};

export const themeKeys = Object.keys(themes);