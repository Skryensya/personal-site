import * as React from 'react';

const { useState, useEffect, useCallback } = React;

interface CursorTrailProps {
    enabled?: boolean;
    debug?: boolean;
}

type CursorState = 'normal' | 'pointer' | 'drag' | 'text' | 'grabbing' | 'resize';

const CursorTrail: React.FC<CursorTrailProps> = ({ enabled = true, debug = false }) => {
    const [positions, setPositions] = useState([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ]);
    const [cursorState, setCursorState] = useState<CursorState>('normal');
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const animationRef = React.useRef<number>();

    const targetPosition = React.useRef({ x: 0, y: 0 });

    const updatePosition = useCallback(
        (e: MouseEvent) => {
            targetPosition.current = {
                x: e.clientX + 20, // Increased offset to bottom right
                y: e.clientY + 20
            };
            if (!isVisible) setIsVisible(true);
        },
        [isVisible]
    );

    const animatePosition = useCallback(() => {
        setPositions(prev => {
            const newPositions = [...prev];
            
            // First circle follows cursor directly with interpolation
            const dx0 = targetPosition.current.x - newPositions[0].x;
            const dy0 = targetPosition.current.y - newPositions[0].y;
            newPositions[0] = {
                x: newPositions[0].x + dx0 * 0.25,
                y: newPositions[0].y + dy0 * 0.25
            };
            
            // Second circle follows first circle closely
            const dx1 = newPositions[0].x - newPositions[1].x;
            const dy1 = newPositions[0].y - newPositions[1].y;
            newPositions[1] = {
                x: newPositions[1].x + dx1 * 0.22,
                y: newPositions[1].y + dy1 * 0.22
            };
            
            // Third circle follows second circle closely
            const dx2 = newPositions[1].x - newPositions[2].x;
            const dy2 = newPositions[1].y - newPositions[2].y;
            newPositions[2] = {
                x: newPositions[2].x + dx2 * 0.18,
                y: newPositions[2].y + dy2 * 0.18
            };
            
            return newPositions;
        });
        
        animationRef.current = requestAnimationFrame(animatePosition);
    }, []);

    const detectCursorState = useCallback(
        (target: Element): CursorState => {
            if (isDragging) return 'grabbing';

            const computedStyle = window.getComputedStyle(target);
            const cursor = computedStyle.cursor;

            // Fast path for explicit cursor styles
            switch (cursor) {
                case 'pointer': return 'pointer';
                case 'text': return 'text';
                case 'grab': return 'drag';
                case 'grabbing': return 'grabbing';
                case 'resize':
                case 'n-resize':
                case 's-resize':
                case 'e-resize':
                case 'w-resize':
                case 'ne-resize':
                case 'nw-resize':
                case 'se-resize':
                case 'sw-resize':
                    return 'resize';
                case 'auto':
                    // Check for text inputs only when cursor is auto
                    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable) {
                        return 'text';
                    }
                    break;
            }

            // Check for clickable elements (only if not already handled)
            if (cursor !== 'default' && cursor !== 'auto') return 'normal';
            
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                (target as any).onclick ||
                target.getAttribute('role') === 'button' ||
                target.classList.contains('cursor-pointer')
            ) {
                return 'pointer';
            }

            return 'normal';
        },
        [isDragging]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            updatePosition(e);

            const target = e.target as Element;
            if (target) {
                const newState = detectCursorState(target);
                setCursorState(newState);
            }
        },
        [updatePosition, detectCursorState]
    );

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        // Start animation loop
        animationRef.current = requestAnimationFrame(animatePosition);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            
            // Cancel animation
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [enabled, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter, animatePosition]);

    if (!enabled) return null;

    const renderCircles = () => {
        const sizes = ['w-4 h-4', 'w-3 h-3', 'w-2 h-2']; // Decreasing sizes
        const opacities = ['opacity-100', 'opacity-75', 'opacity-50']; // Decreasing opacity
        
        return positions.map((pos, index) => (
            <div
                key={index}
                className={`fixed pointer-events-none ${sizes[index]} bg-secondary border border-main ${opacities[index]} rounded-full`}
                style={{
                    left: pos.x,
                    top: pos.y,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999999 - index
                }}
            />
        ));
    };

    return (
        <div className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            {renderCircles()}
            {debug && (
                <div 
                    className="fixed bg-main text-secondary px-2 py-1 text-xs font-mono whitespace-nowrap"
                    style={{
                        left: positions[0].x + 20,
                        top: positions[0].y + 20,
                        zIndex: 9999999
                    }}
                >
                    State: {cursorState} | X: {Math.round(positions[0].x)} | Y: {Math.round(positions[0].y)}
                </div>
            )}
        </div>
    );
};

export default CursorTrail;
