# Centralized Theme Configuration

## Overview

This directory contains the centralized theme configuration system for the portfolio website. All theme data, colors, and effects are now managed from a single source of truth.

## Key Files

### `themes.ts` - Single Source of Truth

This is the **only** file you need to edit to modify themes:

- **Add new themes**: Add entries to the `THEME_CONFIG` array
- **Modify colors**: Edit the `colors` property of any theme
- **Change names/descriptions**: Update theme metadata
- **Add effects**: Configure glow, pixel rendering, fonts, etc.
- **Update accessibility**: Adjust contrast ratios

## Making Changes

### Adding a New Theme

```typescript
{
  id: 'myNewTheme',
  name: 'MY NEW THEME',
  description: 'Custom theme description',
  colors: {
    colorful: '#ff00ff',    // Primary accent color
    contrasty: '#000011'    // Background/contrast color
  },
  contrastRatio: 8.5,       // WCAG contrast ratio (min 4.5:1)
  era: 'Custom Era',
  effects: {
    glow: 'drop-shadow(0 0 8px var(--theme-colorful))',
    pixelRendering: true,   // For retro pixel-perfect rendering
    fontOverride: "'Custom Font', monospace"
  }
}
```

### Modifying Existing Colors

Edit the `colors` object in any theme:

```typescript
// Change the DOS theme colors
colors: {
  colorful: '#00ff00',    // New green color
  contrasty: '#001100'    // Dark green background
}
```

## Performance

The centralized system maintains the same **fast CSS-based switching** performance:

1. **CSS Custom Properties**: Colors are applied via CSS variables
2. **No JavaScript Re-rendering**: Themes switch instantly using CSS
3. **Minimal Bundle Impact**: TypeScript config is tree-shaken
4. **Cached Calculations**: Effects are computed once and cached

## Backward Compatibility

- **Legacy imports still work**: Old imports from `/data/themes.js` are redirected
- **Same API**: All existing component interfaces remain unchanged
- **No breaking changes**: Components work exactly the same

## Architecture Benefits

1. **Single Source of Truth**: All theme data in one file
2. **Type Safety**: Full TypeScript support with interfaces
3. **Better Documentation**: Rich comments and examples
4. **Easier Maintenance**: Add/modify themes in one place
5. **Enhanced Metadata**: Contrast ratios, eras, detailed effects

## Usage Examples

### In Components

```typescript
import { THEME_CONFIG, getThemeById } from '@/config/themes';

// Get all themes
const allThemes = THEME_CONFIG;

// Get specific theme
const dosTheme = getThemeById('dos');

// Get themes by criteria
const highContrastThemes = THEME_CONFIG.filter(t => t.contrastRatio >= 10);
```

### Legacy Compatibility

```typescript
// This still works (redirects to new config)
import { themes, applyTheme } from '@/data/themes';
```

## CSS Integration

The CSS file (`/src/styles/themes.css`) works seamlessly with this configuration:

- CSS custom properties are automatically generated
- Theme switching remains instant
- All visual effects are preserved
- No performance impact

## Development Workflow

1. **Edit themes**: Modify `/src/config/themes.ts`
2. **Test locally**: Themes update automatically
3. **No build needed**: Changes are immediate
4. **Fast iteration**: Single file to modify

## Migration Notes

- **Old file**: `/src/data/themes.js` → **New file**: `/src/config/themes.ts`
- **Components updated**: All theme-aware components now use centralized config
- **Performance maintained**: Same fast CSS-based switching
- **API preserved**: No breaking changes to existing code