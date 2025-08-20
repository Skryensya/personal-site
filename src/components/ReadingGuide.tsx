import * as React from 'react';

const { useState, useEffect, useCallback, useRef, useMemo } = React;

interface ReadingGuideProps {
    className?: string;
}

/**
 * ReadingGuide - Componente React optimizado para guía de lectura
 * Usa React hooks para mejor rendimiento y respuesta instantánea
 */
export default function ReadingGuide({ className = '' }: ReadingGuideProps) {
    const [isActive, setIsActive] = useState(false);
    const [revealPosition, setRevealPosition] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [indicatorPositions, setIndicatorPositions] = useState({ left: 50, right: 240 });
    const [showLine, setShowLine] = useState(false);
    const [hoveredIndicator, setHoveredIndicator] = useState<'left' | 'right' | null>(null);
    
    const textElementsRef = useRef<HTMLElement[]>([]);
    const originalContentRef = useRef<Map<HTMLElement, string>>(new Map());
    const elementsRef = useRef<{
        prose: HTMLElement | null;
        header: HTMLElement | null;
        toggle: HTMLElement | null;
    }>({
        prose: null,
        header: null,
        toggle: null
    });

    // Immediate scroll response - CSS class updates
    const updateRevealEffect = useCallback(() => {
        if (!isActive || textElementsRef.current.length === 0) return;

        const viewportHeight = window.innerHeight;
        const revealY = viewportHeight * revealPosition;
        
        // CSS class updates for opacity control
        textElementsRef.current.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + (rect.height / 2);
            const isRevealed = elementTop <= revealY;
            const currentState = element.getAttribute('data-visible');
            
            // Only update if state changed
            if (isRevealed && currentState !== 'true') {
                element.setAttribute('data-visible', 'true');
            } else if (!isRevealed && currentState !== 'false') {
                element.setAttribute('data-visible', 'false');
            }
        });
    }, [isActive, revealPosition]);

    // Process text elements efficiently
    const processTextElements = useCallback(() => {
        const prose = elementsRef.current.prose;
        if (!prose) {
            console.warn('No prose element found for reading guide');
            return;
        }

        console.log('Processing text elements in:', prose.tagName, prose.id || prose.className);
        textElementsRef.current = [];
        originalContentRef.current.clear();

        const containers = [prose];
        if (elementsRef.current.header) containers.push(elementsRef.current.header);

        containers.forEach(container => {
            originalContentRef.current.set(container, container.innerHTML);

            // Process page-specific container elements
            
            // CV/Curriculum specific: metrics containers
            const metricsContainers = container.querySelectorAll('#metrics-container-mobile, #metrics-container-desktop');
            metricsContainers.forEach(element => {
                const htmlElement = element as HTMLElement;
                if (!htmlElement.hasAttribute('data-visible')) {
                    htmlElement.setAttribute('data-visible', 'false');
                    textElementsRef.current.push(htmlElement);
                }
            });

            // CV/Curriculum specific: UI elements (badges, buttons, etc.)
            const cvUiElements = container.querySelectorAll('.bg-secondary.text-main.px-3.py-2.border.border-main, .filled, .bg-main.text-secondary, .border.border-main');
            cvUiElements.forEach(element => {
                const htmlElement = element as HTMLElement;
                // Skip if inside metrics container - let the container handle it
                if (htmlElement.closest('#metrics-container-mobile, #metrics-container-desktop')) {
                    return;
                }
                // Skip if it's a nested container with children text elements
                const hasChildTextElements = htmlElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span').length > 0;
                if (!hasChildTextElements && !htmlElement.hasAttribute('data-visible')) {
                    htmlElement.setAttribute('data-visible', 'false');
                    textElementsRef.current.push(htmlElement);
                }
            });

            // Reading guide specific: process image captions and figure elements
            const figures = container.querySelectorAll('figure, .figure');
            figures.forEach(element => {
                const htmlElement = element as HTMLElement;
                if (!htmlElement.hasAttribute('data-visible')) {
                    htmlElement.setAttribute('data-visible', 'false');
                    textElementsRef.current.push(htmlElement);
                }
            });

            // Reading guide specific: process blockquotes as units
            const blockquotes = container.querySelectorAll('blockquote');
            blockquotes.forEach(element => {
                const htmlElement = element as HTMLElement;
                if (!htmlElement.hasAttribute('data-visible')) {
                    htmlElement.setAttribute('data-visible', 'false');
                    textElementsRef.current.push(htmlElement);
                }
            });

            const textContainers = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, div');
            
            textContainers.forEach(element => {
                const htmlElement = element as HTMLElement;
                
                if (htmlElement.tagName === 'CODE' || htmlElement.tagName === 'PRE' || 
                    htmlElement.hasAttribute('data-visible') || htmlElement.hasAttribute('data-reading-guide')) {
                    return;
                }

                // Skip processing if element is inside a metrics container
                if (htmlElement.closest('#metrics-container-mobile, #metrics-container-desktop')) {
                    return;
                }

                // Skip if element is a UI component that should be treated as a unit
                if (htmlElement.closest('.bg-secondary.text-main.px-3.py-2.border.border-main, .bg-main.text-secondary, figure, blockquote')) {
                    return;
                }

                const hasDirectText = Array.from(htmlElement.childNodes).some(node => 
                    node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
                );

                if (hasDirectText) {
                    processElementText(htmlElement);
                }
            });
        });
    }, []);

    const processElementText = useCallback((element: HTMLElement) => {
        const textContent = element.textContent?.trim();
        if (!textContent) return;

        element.setAttribute('data-reading-guide', '');
        
        // Process all child nodes, preserving semantic elements
        const processNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text || !text.trim()) {
                    // Preserve whitespace as-is
                    return;
                }

                const words = text.split(/(\s+)/);
                const parent = node.parentNode!;
                
                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.textContent = word;
                        span.setAttribute('data-visible', 'false');
                        parent.insertBefore(span, node);
                        textElementsRef.current.push(span);
                    } else if (word) {
                        // Preserve exact whitespace
                        const spaceNode = document.createTextNode(word);
                        parent.insertBefore(spaceNode, node);
                    }
                });
                
                parent.removeChild(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const elem = node as HTMLElement;
                
                // Add semantic elements to tracking for opacity changes
                if (['CODE', 'EM', 'I', 'STRONG', 'B', 'A', 'SPAN', 'MARK', 'SUB', 'SUP'].includes(elem.tagName)) {
                    elem.setAttribute('data-visible', 'false');
                    textElementsRef.current.push(elem);
                    
                    // Don't process children of these elements, keep them intact
                    return;
                } else {
                    // Process children of other elements
                    const children = Array.from(elem.childNodes);
                    children.forEach(child => processNode(child));
                }
            }
        };

        const children = Array.from(element.childNodes);
        children.forEach(child => processNode(child));
    }, []);

    // Update indicator positions
    const updateIndicatorPositions = useCallback(() => {
        const prose = elementsRef.current.prose;
        if (!prose) return;

        const proseRect = prose.getBoundingClientRect();
        const scrollX = window.scrollX;

        // Check if we're in a CV page with constrained width
        const cvPageContainer = prose.closest('.cv-container');
        
        if (cvPageContainer) {
            // For CV pages, find the inner content container with max-w-[210mm]
            const innerContainer = cvPageContainer.querySelector('[class*="max-w-"][class*="210mm"]');
            if (innerContainer) {
                const innerRect = innerContainer.getBoundingClientRect();
                setIndicatorPositions({
                    left: Math.max(20, innerRect.left + scrollX - 50),
                    right: innerRect.right + scrollX + 30
                });
            } else {
                // Fallback to prose element bounds
                setIndicatorPositions({
                    left: Math.max(20, proseRect.left + scrollX - 50),
                    right: proseRect.right + scrollX + 30
                });
            }
        } else {
            // Original behavior for unconstrained content like project pages
            setIndicatorPositions({
                left: Math.max(20, proseRect.left + scrollX - 50),
                right: proseRect.right + scrollX + 30
            });
        }
    }, []);

    // Immediate scroll response - no throttling, no RAF
    useEffect(() => {
        if (!isActive) return;

        const handleScroll = () => {
            updateRevealEffect();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isActive, updateRevealEffect]);

    // Drag handlers
    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        setShowLine(true);
        setHoveredIndicator(null);
        
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const viewportHeight = window.innerHeight;
        const minY = viewportHeight * 0.25;
        const maxY = viewportHeight * 0.75;
        const constrainedY = Math.max(minY, Math.min(maxY, clientY));
        
        setRevealPosition(constrainedY / viewportHeight);
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        
        e.preventDefault();
    }, []);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        setShowLine(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }, []);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const viewportHeight = window.innerHeight;
        const minY = viewportHeight * 0.25;
        const maxY = viewportHeight * 0.75;
        const constrainedY = Math.max(minY, Math.min(maxY, clientY));
        
        setRevealPosition(constrainedY / viewportHeight);
    }, [isDragging]);

    // Global drag listeners
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
        const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
        const handleMouseUp = () => handleDragEnd();
        const handleTouchEnd = () => handleDragEnd();

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Activate/deactivate
    const activate = useCallback(() => {
        console.log('Activating reading guide...');
        setIsActive(true);
        processTextElements();
        updateIndicatorPositions();
        // Immediate effect update
        setTimeout(() => {
            updateRevealEffect();
            console.log('Reading guide activated, elements processed:', textElementsRef.current.length);
        }, 0);
    }, [processTextElements, updateIndicatorPositions, updateRevealEffect]);

    const deactivate = useCallback(() => {
        setIsActive(false);
        
        // Restore original content
        originalContentRef.current.forEach((content, container) => {
            container.innerHTML = content;
        });
        
        textElementsRef.current = [];
        originalContentRef.current.clear();
    }, []);

    const toggle = useCallback(() => {
        const toggleButton = elementsRef.current.toggle;
        const proseElement = elementsRef.current.prose;
        
        console.log('Toggle clicked:', { 
            toggleButton: toggleButton?.id, 
            proseElement: proseElement?.tagName,
            isActive 
        });

        if (!toggleButton) {
            console.warn('Reading guide toggle button not found');
            return;
        }

        if (!proseElement) {
            console.warn('Reading guide content area not found');
            return;
        }

        if (isActive) {
            console.log('Deactivating reading guide');
            deactivate();
            toggleButton.setAttribute('aria-pressed', 'false');
            toggleButton.textContent = 'Activar guía';
        } else {
            console.log('Activating reading guide');
            activate();
            toggleButton.setAttribute('aria-pressed', 'true');
            toggleButton.textContent = 'Desactivar guía';
        }
    }, [isActive, activate, deactivate]);

    // Initialize elements and expose toggle function
    useEffect(() => {
        // Wait a bit for DOM to be ready
        const initElements = () => {
            // Enhanced content detection with priority order
            const contentSelectors = [
                '.prose',           // Blog posts and content pages
                '#cv-content',      // CV/curriculum pages
                '#main-content',    // Generic main content
                'main',             // Fallback to main element
                'article',          // Article pages
                '[role="main"]'     // Accessibility-compliant main content
            ];

            let proseElement = null;
            for (const selector of contentSelectors) {
                proseElement = document.querySelector(selector);
                if (proseElement) break;
            }

            elementsRef.current = {
                prose: proseElement,
                header: document.querySelector('header'),
                toggle: document.getElementById('reading-guide-toggle')
            };

            // Debug log to see what we found
            console.log('ReadingGuide initialized:', {
                prose: elementsRef.current.prose?.tagName,
                proseId: elementsRef.current.prose?.id,
                proseClass: elementsRef.current.prose?.className,
                toggle: elementsRef.current.toggle?.id
            });

            const toggleButton = elementsRef.current.toggle;
            if (toggleButton) {
                toggleButton.addEventListener('click', toggle);
            }

            // Expose globally for external access
            (window as any).toggleReadingGuide = toggle;
            (window as any).getReadingGuidePosition = () => revealPosition;
        };

        // Try immediately and also after a delay
        initElements();
        const timeoutId = setTimeout(initElements, 100);

        // Handle resize
        const handleResize = () => {
            if (isActive) {
                updateIndicatorPositions();
                updateRevealEffect();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            const toggleButton = elementsRef.current.toggle;
            if (toggleButton) {
                toggleButton.removeEventListener('click', toggle);
            }
            window.removeEventListener('resize', handleResize);
            delete (window as any).toggleReadingGuide;
            delete (window as any).getReadingGuidePosition;
        };
    }, [toggle, isActive, updateIndicatorPositions, updateRevealEffect]);

    // Update reveal effect when position changes
    useEffect(() => {
        if (isActive) {
            updateRevealEffect();
        }
    }, [revealPosition, isActive, updateRevealEffect]);

    // Calculate dynamic positions with hover and drag states
    const indicatorStyle = useMemo(() => {
        const shouldExpand = hoveredIndicator !== null || isDragging;
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        const isMediumViewport = viewportWidth >= 1024 && viewportWidth <= 1150;
        
        return {
            left: {
                top: `calc(${revealPosition * 100}vh - 12px)`,
                left: `${indicatorPositions.left}px`,
                opacity: isActive && !isMediumViewport ? 1 : 0,
                pointerEvents: (isActive && !isMediumViewport ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
                transform: shouldExpand ? 'scale(1.33)' : 'scale(1)',
                transformOrigin: 'center',
                transition: 'transform 0.2s ease, opacity 0.3s ease',
                cursor: isDragging ? 'grabbing' : 'grab'
            },
            right: {
                top: `calc(${revealPosition * 100}vh - 12px)`,
                left: `${isMediumViewport ? indicatorPositions.right - 30 : indicatorPositions.right}px`,
                opacity: isActive ? 1 : 0,
                pointerEvents: (isActive ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
                transform: shouldExpand ? 'scale(1.33)' : 'scale(1)',
                transformOrigin: 'center',
                transition: 'transform 0.2s ease, opacity 0.3s ease',
                cursor: isDragging ? 'grabbing' : 'grab'
            }
        };
    }, [revealPosition, indicatorPositions, isActive, hoveredIndicator, isDragging]);

    const lineStyle = useMemo(() => {
        const prose = elementsRef.current.prose;
        if (!prose) return { display: 'none' };

        const proseRect = prose.getBoundingClientRect();
        
        // Check if we're in a CV page with constrained width
        const cvPageContainer = prose.closest('.cv-container');
        
        if (cvPageContainer) {
            // For CV pages, find the inner content container with max-w-[210mm]
            const innerContainer = cvPageContainer.querySelector('[class*="max-w-"][class*="210mm"]');
            if (innerContainer) {
                const innerRect = innerContainer.getBoundingClientRect();
                return {
                    top: `calc(${revealPosition * 100}vh + 3.5px)`,
                    left: `${innerRect.left + window.scrollX}px`,
                    width: `${innerRect.width}px`,
                    height: '1px',
                    opacity: showLine ? 0.5 : 0,
                    pointerEvents: 'none' as const
                };
            } else {
                // Fallback to prose element bounds
                return {
                    top: `calc(${revealPosition * 100}vh + 3.5px)`,
                    left: `${proseRect.left + window.scrollX}px`,
                    width: `${proseRect.width}px`,
                    height: '1px',
                    opacity: showLine ? 0.5 : 0,
                    pointerEvents: 'none' as const
                };
            }
        } else {
            // Original behavior for unconstrained content like project pages
            return {
                top: `calc(${revealPosition * 100}vh + 3.5px)`,
                left: `${proseRect.left + window.scrollX}px`,
                width: `${proseRect.width}px`,
                height: '1px',
                opacity: showLine ? 0.5 : 0,
                pointerEvents: 'none' as const
            };
        }
    }, [revealPosition, showLine]);

    return (
        <div className={className}>
            {/* CSS for reading guide opacity states */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    [data-visible="false"] {
                        opacity: 0.2 !important;
                        transition: none !important;
                    }
                    [data-visible="true"] {
                        opacity: 1 !important;
                        transition: none !important;
                    }
                    span[data-visible] {
                        display: inline;
                    }
                    /* Code styling for both reading guide mode and normal mode */
                    code {
                        display: inline;
                        background-color: var(--color-main);
                        color: var(--color-secondary);
                        padding: 0.125rem 0.25rem;
                        border-radius: 4px;
                        font-family: 'Fira Code', 'Cascadia Code', 'SF Mono', monospace;
                        font-size: 0.875em;
                    }
                    .bg-secondary.text-main.px-3.py-2.border.border-main[data-visible],
                    .filled[data-visible],
                    .bg-main.text-secondary[data-visible],
                    .border.border-main[data-visible] {
                        display: inline-block;
                    }
                    /* CV specific elements */
                    .bg-secondary[data-visible],
                    .border-l-4[data-visible] {
                        display: block;
                    }
                    /* Reading guide specific elements */
                    figure[data-visible],
                    .figure[data-visible],
                    blockquote[data-visible] {
                        display: block;
                    }
                    [data-reading-guide] {
                        /* Container elements that participate in reading guide but don't have visibility state */
                    }
                `
            }} />
            
            {/* Left Reading Guide Indicator */}
            <div 
                className="fixed z-40"
                style={indicatorStyle.left}
            >
                <div 
                    className="text-main p-1 rounded-full transition-all duration-200"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseEnter={() => {
                        if (!isDragging) {
                            setHoveredIndicator('left');
                            setShowLine(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (!isDragging) {
                            setHoveredIndicator(null);
                            setShowLine(false);
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-90 drop-shadow-lg">
                        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
                    </svg>
                </div>
            </div>

            {/* Right Reading Guide Indicator */}
            <div 
                className="fixed z-40"
                style={indicatorStyle.right}
            >
                <div 
                    className="text-main p-1 rounded-full transition-all duration-200"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseEnter={() => {
                        if (!isDragging) {
                            setHoveredIndicator('right');
                            setShowLine(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (!isDragging) {
                            setHoveredIndicator(null);
                            setShowLine(false);
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-90 drop-shadow-lg">
                        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
                    </svg>
                </div>
            </div>

            {/* Reading guide line */}
            <div 
                className="fixed z-30 transition-opacity duration-200 border-t border-dashed border-main"
                style={lineStyle}
            />
        </div>
    );
}