// Iconic theme configuration - 8 nostalgic and wow-factor themes with excellent contrast
// CSS implementation is in /src/styles/themes.css
// This file only contains metadata for UI generation
// All themes meet WCAG AA contrast requirements (4.5:1 minimum)
// Inspired by iconic computing eras, retro tech, and nostalgic digital aesthetics

// Function to get CSS variable value
function getCSSVariable(variableName) {
    if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    }
    return '';
}

export const themes = [
    {
        id: 'dos',
        name: 'MS-DOS',
        description: 'Command line interface',
        get colorful() {
            return getCSSVariable('--dos-colorful') || '#ffffff';
        },
        get contrasty() {
            return getCSSVariable('--dos-contrasty') || '#000000';
        }
    },
    {
        id: 'gameboy',
        name: 'GAME BOY',
        description: 'Monochrome LCD legend',
        get colorful() {
            return getCSSVariable('--gameboy-colorful') || '#9bbc0f';
        },
        get contrasty() {
            return getCSSVariable('--gameboy-contrasty') || '#081f08';
        }
    },
    {
        id: 'commodore64',
        name: 'COMMODORE 64',
        description: 'Blue screen computing legend',
        get colorful() {
            return getCSSVariable('--commodore64-colorful') || '#b8d4f0';
        },
        get contrasty() {
            return getCSSVariable('--commodore64-contrasty') || '#0d0d1f';
        }
    },
    {
        id: 'caution',
        name: 'CAUTION',
        description: 'Warning tape industrial',
        get colorful() {
            return getCSSVariable('--caution-colorful') || '#ffff00';
        },
        get contrasty() {
            return getCSSVariable('--caution-contrasty') || '#000000';
        }
    },
    {
        id: 'sunset',
        name: 'SUNSET',
        description: 'Warm orange retro sunset',
        get colorful() {
            return getCSSVariable('--sunset-colorful') || '#ff6600';
        },
        get contrasty() {
            return getCSSVariable('--sunset-contrasty') || '#1a0800';
        }
    },
    {
        id: 'neon',
        name: 'NEON',
        description: 'Electric pink cyberpunk',
        get colorful() {
            return getCSSVariable('--neon-colorful') || '#ff0080';
        },
        get contrasty() {
            return getCSSVariable('--neon-contrasty') || '#0a0008';
        }
    },
    {
        id: 'ocean',
        name: 'OCEAN',
        description: 'Deep cyan retro waves',
        get colorful() {
            return getCSSVariable('--ocean-colorful') || '#00ccff';
        },
        get contrasty() {
            return getCSSVariable('--ocean-contrasty') || '#001a33';
        }
    },
    {
        id: 'forest',
        name: 'FOREST',
        description: 'Classic green terminal',
        get colorful() {
            return getCSSVariable('--forest-colorful') || '#00ff00';
        },
        get contrasty() {
            return getCSSVariable('--forest-contrasty') || '#001100';
        }
    },
    {
        id: 'ember',
        name: 'EMBER',
        description: 'Burning red retro fire',
        get colorful() {
            return getCSSVariable('--ember-colorful') || '#ff3300';
        },
        get contrasty() {
            return getCSSVariable('--ember-contrasty') || '#1a0500';
        }
    },
    {
        id: 'violet',
        name: 'VIOLET',
        description: 'Purple retro synthwave',
        get colorful() {
            return getCSSVariable('--violet-colorful') || '#9966ff';
        },
        get contrasty() {
            return getCSSVariable('--violet-contrasty') || '#0f0a1a';
        }
    }
];

export const themeKeys = themes.map((theme) => theme.id);

// Simple theme management with localStorage optimization
export function applyTheme(themeId, isDark = false, mode = null) {
    const root = document.documentElement;
    
    // Set theme data attribute
    root.setAttribute('data-theme', themeId);
    
    // Get theme colors
    const theme = themes.find(t => t.id === themeId) || themes[0];
    
    // Apply dark class
    root.classList.toggle('dark', isDark);
    
    // Set CSS custom properties - the CSS file handles the rest via :root[data-theme] and html.dark selectors
    root.style.setProperty('--theme-colorful', theme.colorful);
    root.style.setProperty('--theme-contrasty', theme.contrasty);
    
    // Theme applied successfully

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
    return themes.find((theme) => theme.id === id) || themes[0];
}

// Load theme from localStorage with validation
export function loadThemeFromStorage() {
    try {
        const savedThemeId = localStorage.getItem('theme-id');
        const savedMode = localStorage.getItem('theme-mode');

        // Validate saved theme exists in current theme list
        const theme = savedThemeId && themes.find((t) => t.id === savedThemeId) ? savedThemeId : themes[0].id;

        const isDark = savedMode === 'dark';
        const mode = isDark ? 'dark' : 'light';

        return { themeId: theme, isDark, mode };
    } catch (e) {
        console.warn('Failed to load theme from localStorage:', e);
        return { themeId: 'dos', isDark: false, mode: 'light' };
    }
}

// Initialize theme on page load
export function initializeTheme() {
    const { themeId, isDark } = loadThemeFromStorage();
    applyTheme(themeId, isDark);
    return { themeId, isDark };
}
