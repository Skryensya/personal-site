// 20 truly unique theme configuration with distinctive and creative color palettes
// For each theme: main = foreground color, secondary = background color  
// Dark mode simply swaps main and secondary

export const themes = {
  classic: {
    name: 'CLASSIC',
    light: { main: '#000000', secondary: '#ffffff' },
    dark: { main: '#ffffff', secondary: '#000000' }
  },
  matrix: {
    name: 'MATRIX', 
    light: { main: '#00ff41', secondary: '#000000' },
    dark: { main: '#000000', secondary: '#00ff41' }
  },
  cyberpunk: {
    name: 'CYBERPUNK',
    light: { main: '#ff00ff', secondary: '#0a0015' },
    dark: { main: '#0a0015', secondary: '#ff00ff' }
  },
  lava: {
    name: 'LAVA',
    light: { main: '#ff4500', secondary: '#1a0000' },
    dark: { main: '#1a0000', secondary: '#ff4500' }
  },
  arctic: {
    name: 'ARCTIC',
    light: { main: '#00ffff', secondary: '#f0f8ff' },
    dark: { main: '#f0f8ff', secondary: '#00ffff' }
  },
  void: {
    name: 'VOID',
    light: { main: '#9400d3', secondary: '#000000' },
    dark: { main: '#000000', secondary: '#9400d3' }
  },
  neon: {
    name: 'NEON',
    light: { main: '#39ff14', secondary: '#110011' },
    dark: { main: '#110011', secondary: '#39ff14' }
  },
  sepia: {
    name: 'SEPIA',
    light: { main: '#8b4513', secondary: '#f4f0e6' },
    dark: { main: '#f4f0e6', secondary: '#8b4513' }
  },
  electric: {
    name: 'ELECTRIC',
    light: { main: '#1e90ff', secondary: '#000022' },
    dark: { main: '#000022', secondary: '#1e90ff' }
  },
  toxic: {
    name: 'TOXIC',
    light: { main: '#adff2f', secondary: '#0d1900' },
    dark: { main: '#0d1900', secondary: '#adff2f' }
  },
  blood: {
    name: 'BLOOD',
    light: { main: '#8b0000', secondary: '#fffafa' },
    dark: { main: '#fffafa', secondary: '#8b0000' }
  },
  ghost: {
    name: 'GHOST',
    light: { main: '#f8f8ff', secondary: '#2f2f2f' },
    dark: { main: '#2f2f2f', secondary: '#f8f8ff' }
  },
  uranium: {
    name: 'URANIUM',
    light: { main: '#ffff00', secondary: '#1a1a00' },
    dark: { main: '#1a1a00', secondary: '#ffff00' }
  },
  ocean: {
    name: 'OCEAN',
    light: { main: '#008b8b', secondary: '#f0ffff' },
    dark: { main: '#f0ffff', secondary: '#008b8b' }
  },
  sunset: {
    name: 'SUNSET',
    light: { main: '#ff6347', secondary: '#fff8dc' },
    dark: { main: '#fff8dc', secondary: '#ff6347' }
  },
  copper: {
    name: 'COPPER',
    light: { main: '#b87333', secondary: '#fdf5e6' },
    dark: { main: '#fdf5e6', secondary: '#b87333' }
  },
  forest: {
    name: 'FOREST',
    light: { main: '#228b22', secondary: '#f0fff0' },
    dark: { main: '#f0fff0', secondary: '#228b22' }
  },
  royal: {
    name: 'ROYAL',
    light: { main: '#4169e1', secondary: '#f0f8ff' },
    dark: { main: '#f0f8ff', secondary: '#4169e1' }
  },
  midnight: {
    name: 'MIDNIGHT',
    light: { main: '#191970', secondary: '#f5f5f5' },
    dark: { main: '#f5f5f5', secondary: '#191970' }
  },
  rainbow: {
    name: 'RAINBOW',
    light: { main: 'hsl(var(--main-hue), 90%, 45%)', secondary: '#fafafa' },
    dark: { main: 'hsl(var(--main-hue), 85%, 75%)', secondary: '#0f0f0f' }
  }
};

export const themeKeys = Object.keys(themes);