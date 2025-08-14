import * as React from 'react';

interface Link {
    href: string;
    text: string;
}

interface Props {
    links: Link[];
    title?: string;
}

export default function MarqueeSection({ links }: Props) {
    const { useState, useEffect, useRef, useCallback } = React;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLLIElement[]>([]);

    // Center the selected item in the x-axis
    const centerSelectedItem = useCallback(() => {
        if (!containerRef.current || !contentRef.current || !itemsRef.current[selectedIndex]) return;

        const container = containerRef.current;
        const content = contentRef.current;
        const selectedItem = itemsRef.current[selectedIndex];

        // Get container width
        const containerWidth = container.offsetWidth;
        const containerCenter = containerWidth / 2;

        // Get item position relative to its parent content
        const itemOffsetLeft = selectedItem.offsetLeft;
        const itemWidth = selectedItem.offsetWidth;
        const itemCenter = itemOffsetLeft + itemWidth / 2;

        // Calculate how much to translate to center the item
        const translateX = containerCenter - itemCenter;

        // Apply smooth transform to center the item
        content.style.transition = 'transform 0.3s ease-out';
        content.style.transform = `translateX(${translateX}px)`;

        // Clear transition after animation to avoid interfering with other transforms
        setTimeout(() => {
            if (content.style.transform === `translateX(${translateX}px)`) {
                content.style.transition = '';
            }
        }, 300);
    }, [selectedIndex]);

    // Update selection and center item
    const updateSelection = useCallback(() => {
        // Remove previous selections
        itemsRef.current.forEach((item) => {
            const tagItem = item?.querySelector('.tag-item');
            if (tagItem) {
                tagItem.classList.remove('selected');
            }
        });

        // Add selection to current item and all its duplicates
        const allItems = containerRef.current?.querySelectorAll('li[data-index]');
        allItems?.forEach((item) => {
            const itemIndex = parseInt(item.getAttribute('data-index') || '0') % links.length;
            if (itemIndex === selectedIndex) {
                const tagItem = item.querySelector('.tag-item');
                if (tagItem) {
                    tagItem.classList.add('selected');
                }
            }
        });

        // Center the selected item
        centerSelectedItem();
    }, [selectedIndex, links.length, centerSelectedItem]);

    // Navigation functions - loop back to first when reaching end
    const navigateNext = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % links.length);
    }, [links.length]);

    const navigatePrev = useCallback(() => {
        setSelectedIndex((prev) => (prev === 0 ? links.length - 1 : prev - 1));
    }, [links.length]);

    const visitSelected = useCallback(() => {
        const href = `/tags/${links[selectedIndex].text.toLowerCase().replace(/\s+/g, '-')}`;
        window.location.href = href;
    }, [links, selectedIndex]);

    // Keyboard event handler
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowRight':
                    event.preventDefault();
                    navigateNext();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    navigatePrev();
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    visitSelected();
                    break;
                case 'Home':
                    event.preventDefault();
                    setSelectedIndex(0);
                    break;
                case 'End':
                    event.preventDefault();
                    setSelectedIndex(links.length - 1);
                    break;
            }
        },
        [navigateNext, navigatePrev, visitSelected, links.length]
    );

    // Focus handlers
    const handleFocus = useCallback(() => {
        setIsKeyboardActive(true);
        setSelectedIndex(0);
    }, []);

    const handleBlur = useCallback(() => {
        setIsKeyboardActive(false);
        if (contentRef.current) {
            contentRef.current.style.transition = 'transform 0.3s ease-out';
            contentRef.current.style.transform = '';
            // Clear transition after animation
            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.style.transition = '';
                }
            }, 300);
        }
        // Clear all selections
        itemsRef.current.forEach((item) => {
            const tagItem = item?.querySelector('.tag-item');
            if (tagItem) {
                tagItem.classList.remove('selected');
            }
        });
    }, []);

    // Update selection when selectedIndex changes
    useEffect(() => {
        if (isKeyboardActive) {
            updateSelection();
        }
    }, [selectedIndex, isKeyboardActive, updateSelection]);

    // Store refs for items
    const setItemRef = useCallback((element: HTMLLIElement | null, index: number) => {
        if (element) {
            itemsRef.current[index] = element;
        }
    }, []);

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className={`overflow-hidden relative w-full py-2 flex items-center focus:outline-2 focus:outline-offset-2 focus:outline-main ${isKeyboardActive ? 'has-keyboard-focus' : ''}`}
                tabIndex={0}
                role="region"
                aria-label={
                    isKeyboardActive && links[selectedIndex]
                        ? `Carrusel de tecnologías. Elemento seleccionado: #${links[selectedIndex].text}. Usa las flechas para navegar, Enter para visitar.`
                        : 'Carrusel de tecnologías. Usa las flechas izquierda y derecha para navegar, Enter o Espacio para visitar el enlace seleccionado'
                }
                aria-live="polite"
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <div ref={contentRef} className={`flex w-max ${isKeyboardActive ? 'keyboard-paused' : 'marquee-scroll'}`}>
                    {/* First set of items */}
                    <ul className="flex items-center flex-shrink-0 space-x-2 pr-2">
                        {links.map((link, index) => (
                            <li
                                key={`first-${index}`}
                                ref={(el) => setItemRef(el, index)}
                                data-index={index}
                                data-href={`/tags/${link.text.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                                <span className="relative inline-block bg-secondary text-main px-3 py-1 !text-xs font-mono font-medium border-2 border-main overflow-hidden tag-item">
                                    #{link.text}
                                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-main"></div>
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Second set (duplicate for continuous scroll) - hidden when keyboard focused */}
                    <ul className={`flex items-center flex-shrink-0 space-x-2 pr-2 ${isKeyboardActive ? 'hidden' : ''}`} aria-hidden="true">
                        {links.map((link, index) => (
                            <li key={`second-${index}`} data-index={index + links.length} data-href={`/tags/${link.text.toLowerCase().replace(/\s+/g, '-')}`}>
                                <span className="relative inline-block bg-secondary text-main px-3 py-1 !text-xs font-mono font-medium border-2 border-main overflow-hidden tag-item">
                                    #{link.text}
                                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-main"></div>
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Third set (duplicate for continuous scroll) - hidden when keyboard focused */}
                    <ul className={`flex items-center flex-shrink-0 space-x-2 pr-2 ${isKeyboardActive ? 'hidden' : ''}`} aria-hidden="true">
                        {links.map((link, index) => (
                            <li
                                key={`third-${index}`}
                                data-index={index + links.length * 2}
                                data-href={`/tags/${link.text.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                                <span className="relative inline-block bg-secondary text-main px-3 py-1 !text-xs font-mono font-medium border-2 border-main overflow-hidden tag-item">
                                    #{link.text}
                                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-main"></div>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .marquee-scroll {
          animation: marquee 80s linear infinite;
        }
        
        .keyboard-paused {
          animation-play-state: paused;
        }
        
        .tag-item {
          transition: none;
        }
        
        .tag-item.selected {
          background-color: var(--color-main);
          color: var(--color-secondary);
          border: 4px solid var(--color-main);
          position: relative;
        }
        
        .tag-item.selected::before {
          content: '\\25BA';
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 8px;
          color: var(--color-main);
          background: var(--color-secondary);
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-main);
        }
        
        .tag-item.selected .border-b-main {
          border-bottom-color: var(--color-secondary);
        }
        
        .tag-item:not(.selected):hover {
          background-color: color-mix(in srgb, var(--color-main) 15%, var(--color-secondary));
        }
        
        .has-keyboard-focus .tag-item:not(.selected) {
          opacity: 0.7;
        }
        
        div:focus {
          outline: 3px solid var(--color-main);
          outline-offset: 4px;
        }
        
        /* Container adjusts to content */
        .has-keyboard-focus {
          padding: 8px 0;
        }
        `
            }} />
        </div>
    );
}
