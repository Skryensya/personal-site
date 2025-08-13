import * as React from 'react';
import { animateSmoothRandomColors, animateToTargetColor, hexToHSL } from '../utils/colorAnimation';
import { themes } from '../data/themes.js';
import { type Theme } from '../types/theme';

const { useEffect, useRef, useState } = React;

interface AnimatedThemeSelectorProps {
    currentTheme: Theme;
    onThemeSelect: (theme: Theme) => void;
    className?: string;
}

export default function AnimatedThemeSelector({ 
    currentTheme, 
    onThemeSelect, 
    className = "" 
}: AnimatedThemeSelectorProps) {
    const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    // Find current theme index
    useEffect(() => {
        const index = themes.findIndex(theme => theme.id === currentTheme.id);
        setSelectedIndex(index !== -1 ? index : 0);
    }, [currentTheme.id, themes]);

    // Initialize animations for each theme
    useEffect(() => {
        animationRefs.current.forEach((ref, index) => {
            if (ref) {
                // Start with smooth random colors
                animateSmoothRandomColors(ref, 3000, 0.015);
            }
        });
    }, []);

    const handleThemeHover = (index: number) => {
        setHoveredIndex(index);
        const ref = animationRefs.current[index];
        const theme = themes[index];
        
        if (ref && theme) {
            // Stop random animation and animate to theme color
            const targetHSL = hexToHSL(theme.colorful);
            animateToTargetColor(ref, targetHSL, 0.08);
        }
    };

    const handleThemeLeave = (index: number) => {
        setHoveredIndex(null);
        const ref = animationRefs.current[index];
        
        if (ref && index !== selectedIndex) {
            // Resume random animation
            animateSmoothRandomColors(ref, 2000, 0.02);
        }
    };

    const handleThemeSelect = (theme: Theme, index: number) => {
        setSelectedIndex(index);
        onThemeSelect(theme);
        
        // Animate selected theme to its color and keep it there
        const ref = animationRefs.current[index];
        if (ref) {
            const targetHSL = hexToHSL(theme.colorful);
            animateToTargetColor(ref, targetHSL, 0.1, () => {
                // Keep the selected theme at its target color
                ref.style.backgroundColor = theme.colorful;
            });
        }

        // Resume random animations for other themes
        animationRefs.current.forEach((otherRef, otherIndex) => {
            if (otherRef && otherIndex !== index && hoveredIndex !== otherIndex) {
                animateSmoothRandomColors(otherRef, 2000, 0.02);
            }
        });
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {themes.map((theme, index) => {
                const isSelected = selectedIndex === index;
                const isHovered = hoveredIndex === index;
                
                return (
                    <button
                        key={theme.id}
                        className={`relative group transition-transform hover:scale-105 ${
                            isSelected ? 'ring-2 ring-main ring-offset-2 ring-offset-secondary' : ''
                        }`}
                        onMouseEnter={() => handleThemeHover(index)}
                        onMouseLeave={() => handleThemeLeave(index)}
                        onClick={() => handleThemeSelect(theme, index)}
                        aria-label={`Select ${theme.name} theme`}
                    >
                        {/* Animated background */}
                        <div
                            ref={el => animationRefs.current[index] = el}
                            className="w-12 h-12 border-2 border-main relative overflow-hidden"
                            style={{
                                background: isSelected ? theme.colorful : undefined
                            }}
                        >
                            {/* Theme preview overlay */}
                            <div 
                                className="absolute inset-1 opacity-30"
                                style={{ 
                                    background: `linear-gradient(135deg, ${theme.colorful} 50%, ${theme.contrasty} 50%)` 
                                }}
                            />
                        </div>
                        
                        {/* Theme name tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-main text-secondary text-xs font-mono font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                            {theme.name}
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-main text-secondary flex items-center justify-center text-xs">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}