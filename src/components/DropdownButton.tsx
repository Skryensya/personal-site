import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useListNavigation,
    useInteractions,
    FloatingPortal,
    FloatingFocusManager
} from '@floating-ui/react';

interface DropdownButtonProps {
    // Contenido del botón principal (lado izquierdo)
    children: React.ReactNode;
    // Contenido del dropdown
    dropdownContent: React.ReactNode;
    // Props opcionales
    className?: string;
    dropdownClassName?: string;
    // Función que se ejecuta cuando se hace clic en el botón principal
    onMainClick?: () => void;
    // Si está deshabilitado
    disabled?: boolean;
    // Índice del elemento inicial seleccionado (opcional)
    initialSelectedIndex?: number;
}

export default function DropdownButton({
    children,
    dropdownContent,
    className = '',
    dropdownClassName = '',
    onMainClick,
    disabled = false,
    initialSelectedIndex = 0
}: DropdownButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<Array<HTMLElement | null>>([]);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(4),
            flip({
                fallbackPlacements: ['top-end', 'bottom-start', 'top-start']
            }),
            shift({
                padding: 8
            })
        ],
        whileElementsMounted: autoUpdate,
        placement: 'bottom-end',
        strategy: 'fixed'
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'menu' });
    // Disable Floating UI's list navigation - we'll handle it manually
    const listNavigation = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
        enabled: false // Disable Floating UI navigation completely
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role, listNavigation]);

    // Store item click handlers for auto-selection
    const itemClickHandlers = useRef<Array<(() => void) | null>>([]);

    // Get all dropdown items for keyboard navigation
    const getDropdownItems = useCallback(() => {
        if (!dropdownRef.current) return [];
        return Array.from(dropdownRef.current.querySelectorAll('[role="menuitem"]:not([disabled])'));
    }, []);

    // Simple keyboard navigation - handle everything manually
    const handleCustomKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (!isOpen || disabled) return;

        const items = getDropdownItems();
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                event.stopPropagation();
                const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
                setActiveIndex(nextIndex);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
                setActiveIndex(prevIndex);
                break;
                
            case 'Enter':
            case ' ':
                event.preventDefault();
                event.stopPropagation();
                console.log('🔥 Enter/Space pressed!', { activeIndex, isOpen, itemsLength: items.length });
                
                if (activeIndex >= 0 && activeIndex < items.length) {
                    const activeItem = items[activeIndex] as HTMLElement;
                    console.log('🎯 Clicking item at index:', activeIndex, activeItem);
                    if (activeItem) {
                        activeItem.click();
                    }
                }
                
                // Close dropdown after selection
                setIsOpen(false);
                setActiveIndex(-1);
                buttonRef.current?.focus();
                break;
                
            case 'Escape':
                event.preventDefault();
                setIsOpen(false);
                setActiveIndex(-1);
                buttonRef.current?.focus();
                break;
        }
    }, [isOpen, disabled, activeIndex, getDropdownItems]);

    // Handle keyboard navigation for button
    const handleButtonKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    // activeIndex will be set by useEffect
                }
                break;

            case 'Enter':
            case ' ':
                if (!isOpen) {
                    event.preventDefault();
                    setIsOpen(true);
                    // activeIndex will be set by useEffect
                }
                break;

            case 'Escape':
                event.preventDefault();
                setIsOpen(false);
                setActiveIndex(-1);
                break;
        }
    }, [isOpen, disabled]);


    // Reset active index when dropdown closes, set initial when opens
    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(-1);
        } else {
            // Ensure we start with a valid index
            const validIndex = Math.max(0, initialSelectedIndex || 0);
            console.log('🚀 Setting activeIndex to:', validIndex);
            setActiveIndex(validIndex);
        }
    }, [isOpen, initialSelectedIndex]);

    // Handle item focus for screen readers and keyboard navigation
    useEffect(() => {
        if (isOpen && activeIndex >= 0) {
            const items = getDropdownItems();
            
            // Update all items' active state
            items.forEach((item, index) => {
                const element = item as HTMLElement;
                if (element) {
                    // Update data attribute for CSS styling
                    element.setAttribute('data-active', index === activeIndex ? 'true' : 'false');
                }
            });
            
            // DON'T focus individual items - keep focus on container
            // The container stays focused and shows native outline
            // Items only change visually via data-active
        }
    }, [activeIndex, isOpen, getDropdownItems]);

    // Auto-focus dropdown container when it opens
    useEffect(() => {
        if (isOpen) {
            // Use setTimeout to ensure DOM is updated
            const timer = setTimeout(() => {
                if (dropdownRef.current) {
                    dropdownRef.current.focus();
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleMainClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (onMainClick && !disabled) {
            onMainClick();
        }
    };

    const handleDropdownClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setActiveIndex(initialSelectedIndex);
            }
        }
    };

    // Handle dropdown item click - close dropdown after selection (for mouse clicks)
    const handleItemClick = useCallback((originalOnClick?: () => void) => {
        return () => {
            if (originalOnClick) {
                originalOnClick();
            }
            // Close dropdown after selection
            setIsOpen(false);
            setActiveIndex(-1);
            // Return focus to button
            setTimeout(() => {
                buttonRef.current?.focus();
            }, 0);
        };
    }, []);

    // Handle item selection without closing (for arrow navigation)
    const handleItemSelection = useCallback((originalOnClick?: () => void) => {
        return () => {
            if (originalOnClick) {
                originalOnClick();
            }
            // Don't close dropdown - just select the item
        };
    }, []);

    return (
        <>
            {/* Botón dividido */}
            <div className={`inline-flex ${className}`}>
                {/* Botón principal (lado izquierdo) */}
                <button
                    type="button"
                    onClick={handleMainClick}
                    disabled={disabled}
                    className="flex items-center justify-center px-3 h-8 bg-secondary border-double border-2 border-main border-r-0 hover:bg-main hover:text-secondary focus:bg-main focus:text-secondary group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold tracking-wide shadow-[inset_0_0_0_2px_var(--color-secondary)] pt-0 focus:z-[9999]"
                    style={{
                        outlineWidth: '1px',
                        outlineOffset: '1px'
                    }}
                >
                    {children}
                </button>

                {/* Botón dropdown (lado derecho) */}
                <button
                    ref={(node) => {
                        refs.setReference(node);
                        buttonRef.current = node;
                    }}
                    type="button"
                    onClick={handleDropdownClick}
                    onKeyDown={handleButtonKeyDown}
                    disabled={disabled}
                    className="flex items-center justify-center min-w-8 w-8 h-8 bg-secondary border-double border-2 border-main hover:bg-main hover:text-secondary focus:bg-main focus:text-secondary group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold tracking-wide shadow-[inset_0_0_0_2px_var(--color-secondary)] focus:z-[9999]"
                    style={{
                        outlineWidth: '1px',
                        outlineOffset: '1px'
                    }}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? 'dropdown-menu' : undefined}
                    id="dropdown-button"
                    {...getReferenceProps()}
                >
                    {/* Icono de flecha */}
                    <svg
                        className="w-4 h-4 text-main group-hover:text-secondary group-focus:text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                            transform: isMounted && isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Dropdown content */}
            {isMounted && isOpen && (
                <FloatingPortal>
                    <FloatingFocusManager context={context} modal={false}>
                        <div
                            ref={(node) => {
                                refs.setFloating(node);
                                dropdownRef.current = node;
                            }}
                            style={{
                                ...floatingStyles,
                                overflow: 'visible'
                            }}
                            className={`fixed z-[350] bg-secondary border-double border-2 border-main rounded-none min-w-[120px] max-w-[250px] ${dropdownClassName}`}
                            role="menu"
                            id="dropdown-menu"
                            aria-labelledby="dropdown-button"
                            tabIndex={0}
                            onKeyDown={handleCustomKeyDown}
                        >
                            {React.isValidElement(dropdownContent) && React.cloneElement(dropdownContent as React.ReactElement, { 
                                isDropdownOpen: isOpen,
                                handleItemClick: handleItemClick,
                                handleItemSelection: handleItemSelection,
                                listRef: listRef,
                                activeIndex: activeIndex,
                                itemClickHandlers: itemClickHandlers
                            })}
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </>
    );
}

// Componente wrapper para contenido del dropdown
export function DropdownContent({ 
    children, 
    isDropdownOpen = true, 
    handleItemClick,
    handleItemSelection,
    listRef,
    activeIndex,
    itemClickHandlers 
}: { 
    children: React.ReactNode; 
    isDropdownOpen?: boolean;
    handleItemClick?: (originalOnClick?: () => void) => () => void;
    handleItemSelection?: (originalOnClick?: () => void) => () => void;
    listRef?: React.MutableRefObject<Array<HTMLElement | null>>;
    activeIndex?: number;
    itemClickHandlers?: React.MutableRefObject<Array<(() => void) | null>>;
}) {
    return (
        <div role="none">
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === 'button') {
                    const originalOnClick = child.props.onClick;
                    const originalOnKeyDown = child.props.onKeyDown;
                    
                    // Store the selection handler (without closing dropdown) for arrow navigation
                    if (itemClickHandlers && originalOnClick && handleItemSelection) {
                        itemClickHandlers.current[index] = handleItemSelection(originalOnClick);
                    }
                    
                    const isActive = activeIndex === index;
                    // Remove any existing background/text classes from child to avoid conflicts
                    const cleanedClassName = (child.props.className || '')
                        .replace(/bg-\w+/g, '')
                        .replace(/text-\w+/g, '')
                        .replace(/hover:bg-\w+/g, '')
                        .replace(/hover:text-\w+/g, '');
                    
                    const baseClasses = `${cleanedClassName} w-full px-2 py-1 text-left block transition-all duration-150 border-2 border-transparent`;
                    // Active state (focused) always gets filled background, regardless of selected state
                    const stateClasses = isActive 
                        ? 'bg-main text-secondary hover:bg-main hover:text-secondary' 
                        : 'bg-secondary text-main hover:bg-main hover:text-secondary';
                    
                    return React.cloneElement(child as React.ReactElement<any>, {
                        role: 'menuitem',
                        // Explicitly remove any tabIndex - items are not reachable with Tab
                        tabIndex: -1,
                        'aria-hidden': !isDropdownOpen,
                        'data-dropdown-item': true,
                        'data-active': isActive ? 'true' : 'false',
                        className: `${baseClasses} ${stateClasses}`,
                        onClick: handleItemClick ? handleItemClick(originalOnClick) : originalOnClick,
                        ref: (node: HTMLElement | null) => {
                            if (listRef) {
                                listRef.current[index] = node;
                            }
                        },
                        onKeyDown: (event: React.KeyboardEvent) => {
                            // Call original onKeyDown if it exists
                            if (originalOnKeyDown) {
                                originalOnKeyDown(event);
                            }
                        }
                    });
                }
                return child;
            })}
        </div>
    );
}

// Componente helper para items del dropdown
export function DropdownItem({
    children,
    onClick,
    className = '',
    selected = false,
    isDropdownOpen = true,
    ...props
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    selected?: boolean;
    isDropdownOpen?: boolean;
}) {
    const baseClasses = 'w-full px-2 py-1 text-left block transition-all duration-150 bg-secondary text-main hover:bg-main hover:text-secondary focus:bg-main focus:text-secondary border-2 border-transparent';
    // Selected solo afecta el checkmark, no el background
    
    return (
        <button
            type="button"
            role="menuitem"
            // Explicitly remove tabIndex - items are not reachable with Tab key
            tabIndex={-1}
            className={`${baseClasses} ${className}`}
            onClick={onClick}
            aria-hidden={!isDropdownOpen}
            data-dropdown-item="true"
            data-active="false"
            data-selected={selected ? "true" : "false"}
            {...props}
        >
            {children}
        </button>
    );
}

// Componente helper para separadores en el dropdown
export function DropdownSeparator({ className = '' }: { className?: string }) {
    return <hr className={`border-main ${className}`} />;
}

// Remove CSS injection - it's causing conflicts
// Use Tailwind classes directly in components instead
