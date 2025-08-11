import * as React from 'react';
import { animateSmoothRandomColors, animateToTargetColor, hexToHSL } from '../utils/colorAnimation';

const { useEffect, useRef } = React;

interface AnimatedColorPreviewProps {
    targetColor?: string;
    isSelected?: boolean;
    isHovered?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    speed?: number;
    changeInterval?: number;
}

export default function AnimatedColorPreview({
    targetColor,
    isSelected = false,
    isHovered = false,
    className = "",
    size = 'md',
    speed = 0.02,
    changeInterval = 2000
}: AnimatedColorPreviewProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        if (isHovered && targetColor) {
            // Animate to target color when hovered
            const targetHSL = hexToHSL(targetColor);
            animateToTargetColor(element, targetHSL, 0.08);
        } else if (isSelected && targetColor) {
            // Keep selected color
            element.style.backgroundColor = targetColor;
        } else {
            // Random animation when not hovered/selected
            animateSmoothRandomColors(element, changeInterval, speed);
        }
    }, [targetColor, isSelected, isHovered, speed, changeInterval]);

    return (
        <div
            ref={elementRef}
            className={`border-2 border-main ${sizeClasses[size]} ${className}`}
            style={isSelected && targetColor ? { backgroundColor: targetColor } : undefined}
        />
    );
}