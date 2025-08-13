import * as React from 'react';
import DropdownButton from './DropdownButton';
import { type Theme } from '../types/theme';

interface ThemeButtonProps {
    currentTheme: Theme;
    themes: Theme[];
    isMounted: boolean;
    onThemeSelect: (theme: Theme) => void;
    onNextTheme: () => void;
    className?: string;
    isMobile?: boolean;
}

// Get theme name in Spanish (forced for all languages)
const getThemeNameInSpanish = (themeId: string): string => {
    // Use same mapping as navbar placeholder to ensure consistency
    const themeNames: { [key: string]: string } = {
        'gameboy': 'GAMEBOY',
        'dos': 'TERMINAL', 
        'commodore64': 'COMMODORE',
        'caution': 'PRECAUCION',
        'sunset': 'ATARDECER',
        'neon': 'NEON',
        'ocean': 'OCEANO',
        'forest': 'BOSQUE',
        'ember': 'BRASA',
        'violet': 'VIOLETA'
    };
    return themeNames[themeId] || themeId.toUpperCase();
};

export default function ThemeButton({
    currentTheme,
    themes,
    isMounted,
    onThemeSelect,
    onNextTheme,
    className = '',
    isMobile = false
}: ThemeButtonProps) {
    // Don't render anything until fully mounted and ready
    if (!isMounted) return null;
    
    const buttonClassName = isMobile 
        ? `w-full h-10 ${className}`
        : `w-7 h-7 @6xl:w-full @6xl:h-8 ${className}`;

    return (
        <DropdownButton
            onMainClick={onNextTheme}
            disabled={false}
            dropdownContent={
                <div>
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            type="button"
                            onClick={() => {
                                onThemeSelect(theme);
                            }}
                            className={`w-full px-2 py-1 text-left focus:outline-none block cursor-pointer relative z-10 ${
                                currentTheme?.id === theme.id ? 'bg-main text-secondary' : 'bg-secondary text-main hover:bg-main hover:text-secondary'
                            }`}
                            style={{ minHeight: '40px' }}
                        >
                            <div className="flex items-center gap-0 pointer-events-none">
                                <div
                                    className="w-6 h-6 aspect-square flex-shrink-0 border border-main pointer-events-none"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${theme.colorful} 50%, ${theme.contrasty} 50%)`,
                                        boxShadow: `inset 0 0 0 1px ${theme.contrasty}`
                                    }}
                                />
                                <span className="flex-1 px-2 py-2 font-mono text-xs font-semibold pointer-events-none select-none">
                                    {getThemeNameInSpanish(theme.id)}
                                </span>
                                <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                    {currentTheme?.id === theme.id && (
                                        <svg
                                            className="w-4 h-4 pointer-events-none"
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
            }
            className={buttonClassName}
        >
            <div className="flex items-center gap-2 w-full">
                <div
                    className="w-4 h-4 border border-main theme-preview-current flex-shrink-0"
                    style={{ 
                        background: `linear-gradient(135deg, var(--color-main) 50%, var(--color-secondary) 50%)`
                    }}
                />
                <span className={`font-mono text-xs font-semibold text-main group-hover:text-secondary truncate ${
                    isMobile ? 'block' : 'hidden @6xl:block'
                }`}>
                    {getThemeNameInSpanish(currentTheme.id)}
                </span>
            </div>
        </DropdownButton>
    );
}