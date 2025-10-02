import * as React from 'react';
import DropdownButton, { DropdownContent } from './DropdownButton';
import { applyTheme, themes, getAvailableThemes } from '../data/themes.js';

interface Theme {
    id: string;
    name: string;
    description: string;
    colors: {
        colorful: string;
        contrasty: string;
    };
    colorful: string;
    contrasty: string;
    hidden?: boolean;
}

export default function ThemeControl() {
    // Initialize theme from global state or localStorage immediately
    const [currentTheme, setCurrentTheme] = React.useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            // Check global state first (set by navbar script)
            const globalThemeId = (window as any).__THEME_ID__;
            if (globalThemeId) {
                const globalTheme = themes.find((t) => t.id === globalThemeId);
                if (globalTheme) return globalTheme;
            }
            
            // Fallback to localStorage
            const savedThemeId = localStorage.getItem('theme-id');
            if (savedThemeId) {
                const savedTheme = themes.find((t) => t.id === savedThemeId);
                if (savedTheme) return savedTheme;
            }
            
            // Only set random theme if no theme was previously saved
            if (!(window as any).__THEME_READY__) {
                // Get only available themes (excluding hidden ones that aren't unlocked)
                const availableThemes = getAvailableThemes();
                const availableThemesAsTheme = availableThemes as unknown as Theme[];
                const randomIndex = Math.floor(Math.random() * availableThemesAsTheme.length);
                const randomTheme = availableThemesAsTheme[randomIndex] || themes.find((t) => !t.hidden) || themes[0];

                // Save the random theme immediately
                localStorage.setItem('theme-id', randomTheme.id);
                (window as any).__THEME_ID__ = randomTheme.id;
                (window as any).__THEME_READY__ = true;

                return randomTheme;
            }
        }
        
        return themes[0];
    });
    
    const [isMounted, setIsMounted] = React.useState(false);
    const [availableThemes, setAvailableThemes] = React.useState<Theme[]>([]);

    // Apply theme to document
    const applyThemeToDocument = React.useCallback((theme: Theme) => {
        if (typeof window === 'undefined') return;
        
        // Get current mode from localStorage or global state
        const savedMode = localStorage.getItem('theme-mode') || (window as any).__THEME_MODE__ || 'system';
        
        let resolvedMode = savedMode;
        if (savedMode === 'system') {
            resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        const isDark = resolvedMode === 'dark';
        applyTheme(theme.id, isDark, null);
        
        // Save to localStorage
        localStorage.setItem('theme-id', theme.id);
        
        // Update global state
        (window as any).__THEME_ID__ = theme.id;
        (window as any).__THEME_READY__ = true;
    }, []);

    // Update available themes when component mounts or themes are unlocked
    React.useEffect(() => {
        const updateAvailableThemes = () => {
            if (typeof window !== 'undefined') {
                setAvailableThemes(getAvailableThemes() as unknown as Theme[]);
            }
        };

        updateAvailableThemes();

        // Listen for theme unlock/lock events
        const handleThemeUnlocked = () => {
            updateAvailableThemes();
        };
        
        const handleThemesUnlocked = () => {
            updateAvailableThemes();
        };
        
        const handleThemesLocked = () => {
            updateAvailableThemes();
        };
        
        // Listen for company theme activation
        const handleCompanyThemeActivated = (event: CustomEvent) => {
            const { themeId, theme } = event.detail;
            console.log('🎨 ThemeControl: Company theme activated:', themeId);
            
            // Find the theme in our themes list
            const activatedTheme = themes.find(t => t.id === themeId);
            if (activatedTheme) {
                setCurrentTheme(activatedTheme);
                updateAvailableThemes(); // Refresh available themes list
                console.log('🎨 ThemeControl: Theme state updated to:', activatedTheme.name);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('theme-unlocked', handleThemeUnlocked);
            window.addEventListener('themes-unlocked', handleThemesUnlocked);
            window.addEventListener('themes-locked', handleThemesLocked);
            window.addEventListener('company-theme-activated', handleCompanyThemeActivated as EventListener);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('theme-unlocked', handleThemeUnlocked);
                window.removeEventListener('themes-unlocked', handleThemesUnlocked);
                window.removeEventListener('themes-locked', handleThemesLocked);
                window.removeEventListener('company-theme-activated', handleCompanyThemeActivated as EventListener);
            }
        };
    }, []);

    // Mount immediately and apply theme
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            applyThemeToDocument(currentTheme);
            setIsMounted(true);
            
            // Signal that theme control is ready
            setTimeout(() => {
                const event = new CustomEvent('theme-control-ready', {
                    detail: { themeId: currentTheme.id }
                });
                window.dispatchEvent(event);
            }, 0);
        }
    }, []);

    // Handle theme selection
    const handleThemeSelect = React.useCallback((theme: Theme) => {
        setCurrentTheme(theme);
        applyThemeToDocument(theme);
    }, [applyThemeToDocument]);
    
    // Previous theme handler
    const prevTheme = React.useCallback(() => {
        if (!currentTheme || availableThemes.length === 0) return;
        const currentIndex = availableThemes.findIndex((t) => t.id === currentTheme.id);
        const prevIndex = currentIndex === 0 ? availableThemes.length - 1 : currentIndex - 1;
        const newTheme = availableThemes[prevIndex];
        handleThemeSelect(newTheme);
    }, [currentTheme, handleThemeSelect, availableThemes]);

    // Next theme handler
    const nextTheme = React.useCallback(() => {
        if (!currentTheme || availableThemes.length === 0) return;
        const currentIndex = availableThemes.findIndex((t) => t.id === currentTheme.id);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        const newTheme = availableThemes[nextIndex];
        handleThemeSelect(newTheme);
    }, [currentTheme, handleThemeSelect, availableThemes]);

    // Keyboard shortcuts for theme navigation
    React.useEffect(() => {
        if (!isMounted || typeof window === 'undefined') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Only respond to keyboard shortcuts if no input is focused
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            // Left/Right arrow keys for theme navigation
            if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                prevTheme();
            } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                nextTheme();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [prevTheme, nextTheme, isMounted]);

    // Find the index of the current theme
    const currentThemeIndex = availableThemes.findIndex(theme => theme.id === currentTheme?.id);
    const selectedIndex = currentThemeIndex >= 0 ? currentThemeIndex : 0;
    
    // Don't render until mounted
    if (!isMounted) return null;
    
    return (
        <DropdownButton
            onMainClick={nextTheme}
            disabled={false}
            initialSelectedIndex={selectedIndex}
            dropdownClassName="max-w-[280px] @lg:min-w-[400px] @lg:max-w-[600px]"
            dropdownContent={
                <div>
                    <div className="hidden @lg:flex gap-0 min-w-[400px]">
                        {/* First column */}
                        <div className="flex-1 border-r border-main">
                            {availableThemes.slice(0, Math.ceil(availableThemes.length / 2)).map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => handleThemeSelect(theme)}
                                    className="w-full px-1 py-0.5 text-left block cursor-pointer relative focus-visible:z-[9999]"
                                    data-selected={currentTheme?.id === theme.id ? 'true' : 'false'}
                                    style={{ 
                                        minHeight: '32px',
                                        outlineWidth: '1px',
                                        outlineOffset: '1px'
                                    }}
                                >
                                    <div className="flex items-center gap-2 pointer-events-none">
                                        <div
                                            className="w-5 h-5 aspect-square flex-shrink-0 pointer-events-none"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${theme.colorful || theme.colors?.colorful || '#FF0000'} 50%, ${theme.contrasty || theme.colors?.contrasty || '#000000'} 50%)`,
                                                border: `1px solid ${theme.contrasty || theme.colors?.contrasty || '#000000'}`
                                            }}
                                        />
                                        <span className="flex-1 px-1 py-1 font-grotesk text-base font-semibold pointer-events-none select-none uppercase text-main">{theme.name}</span>
                                        <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                            {currentTheme?.id === theme.id && (
                                                <svg
                                                    className="w-4 h-4 pointer-events-none text-main"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Second column */}
                        <div className="flex-1">
                            {availableThemes.slice(Math.ceil(availableThemes.length / 2)).map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => handleThemeSelect(theme)}
                                    className="w-full px-1 py-0.5 text-left block cursor-pointer relative focus-visible:z-[9999]"
                                    data-selected={currentTheme?.id === theme.id ? 'true' : 'false'}
                                    style={{ 
                                        minHeight: '32px',
                                        outlineWidth: '1px',
                                        outlineOffset: '1px'
                                    }}
                                >
                                    <div className="flex items-center gap-2 pointer-events-none">
                                        <div
                                            className="w-5 h-5 aspect-square flex-shrink-0 pointer-events-none"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${theme.colorful || theme.colors?.colorful || '#FF0000'} 50%, ${theme.contrasty || theme.colors?.contrasty || '#000000'} 50%)`,
                                                border: `1px solid ${theme.contrasty || theme.colors?.contrasty || '#000000'}`
                                            }}
                                        />
                                        <span className="flex-1 px-1 py-1 font-grotesk text-base font-semibold pointer-events-none select-none uppercase text-main">{theme.name}</span>
                                        <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                            {currentTheme?.id === theme.id && (
                                                <svg
                                                    className="w-4 h-4 pointer-events-none text-main"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Mobile/tablet layout - single column */}
                    <div className="@lg:hidden">
                        {availableThemes.map((theme) => (
                            <button
                                key={theme.id}
                                type="button"
                                onClick={() => handleThemeSelect(theme)}
                                className="w-full px-1 py-0.5 text-left block cursor-pointer relative focus-visible:z-[9999]"
                                data-selected={currentTheme?.id === theme.id ? 'true' : 'false'}
                                style={{ 
                                    minHeight: '32px',
                                    outlineWidth: '1px',
                                    outlineOffset: '1px'
                                }}
                            >
                                <div className="flex items-center gap-2 pointer-events-none">
                                    <div
                                        className="w-5 h-5 aspect-square flex-shrink-0 pointer-events-none"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${theme.colorful || theme.colors?.colorful || '#FF0000'} 50%, ${theme.contrasty || theme.colors?.contrasty || '#000000'} 50%)`,
                                            border: `1px solid ${theme.contrasty || theme.colors?.contrasty || '#000000'}`
                                        }}
                                    />
                                    <span className="flex-1 px-1 py-1 font-grotesk text-base font-semibold pointer-events-none select-none uppercase text-main">{theme.name}</span>
                                    <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                        {currentTheme?.id === theme.id && (
                                            <svg
                                                className="w-4 h-4 pointer-events-none text-main"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <polyline points="20,6 9,17 4,12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            }
            className="w-7 h-7 @lg:w-full @lg:h-8"
        >
            <div className="flex items-center gap-2 w-full">
                <div
                    className="w-4 h-4 border border-main theme-preview-current flex-shrink-0"
                    style={{ 
                        background: `linear-gradient(135deg, var(--color-main) 50%, var(--color-secondary) 50%)`
                    }}
                />
                <span className="hidden @lg:block font-grotesk text-sm font-semibold text-main group-hover:text-secondary group-focus-visible:text-secondary truncate uppercase  ">
                    {currentTheme.name}
                </span>
            </div>
        </DropdownButton>
    );
}