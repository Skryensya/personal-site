import * as React from 'react';
import DropdownButton, { DropdownItem } from './DropdownButton';
import { type Mode } from './useThemeMode';

interface ModeButtonProps {
    currentMode: Mode;
    isMounted: boolean;
    onModeSelect: (mode: Mode) => void;
    onToggleMode: () => void;
    className?: string;
    isMobile?: boolean;
}

// Get mode name in Spanish (forced for all languages)
const getModeNameInSpanish = (mode: Mode): string => {
    // Use same mapping as navbar placeholder to ensure consistency
    const modeNames: { [key: string]: string } = {
        'light': 'CLARO',
        'dark': 'OSCURO',
        'system': 'SISTEMA'
    };
    return modeNames[mode] || mode.toUpperCase();
};

// Get mode icon
const getModeIcon = (mode: Mode, className = 'w-3.5 h-3.5') => {
    switch (mode) {
        case 'light':
            return (
                <svg className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            );
        case 'dark':
            return (
                <svg className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            );
        case 'system':
            return (
                <svg className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
            );
    }
};

export default function ModeButton({
    currentMode,
    isMounted,
    onModeSelect,
    onToggleMode,
    className = '',
    isMobile = false
}: ModeButtonProps) {
    // Don't render anything until fully mounted and ready
    if (!isMounted) return null;
    
    const buttonClassName = isMobile 
        ? `w-full h-10 ${className}`
        : `w-7 h-7 @6xl:w-auto @6xl:h-8 ${className}`;

    return (
        <DropdownButton
            onMainClick={onToggleMode}
            disabled={false}
            dropdownContent={
                <div>
                    {(['light', 'dark', 'system'] as Mode[]).map((mode) => (
                        <DropdownItem
                            key={mode}
                            selected={currentMode === mode}
                            onClick={() => onModeSelect(mode)}
                            className="font-mono text-xs font-semibold uppercase tracking-wider"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(mode, '')}</div>
                                <span>
                                    {getModeNameInSpanish(mode)}
                                </span>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {currentMode === mode && (
                                        <svg
                                            className="w-4 h-4"
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
                        </DropdownItem>
                    ))}
                </div>
            }
            className={buttonClassName}
        >
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(currentMode, '')}</div>
                <span className={`font-mono text-xs font-semibold text-main group-hover:text-secondary ${
                    isMobile ? 'block' : 'hidden @6xl:block'
                }`}>
                    {getModeNameInSpanish(currentMode)}
                </span>
            </div>
        </DropdownButton>
    );
}