import React, { useState } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
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
}

export default function DropdownButton({
    children,
    dropdownContent,
    className = '',
    dropdownClassName = '',
    onMainClick,
    disabled = false
}: DropdownButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(4),
            flip({
                fallbackPlacements: ['top-start', 'bottom-end', 'top-end']
            }),
            shift({
                padding: 8
            })
        ],
        whileElementsMounted: autoUpdate,
        placement: 'bottom-start',
        strategy: 'fixed'
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

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
        }
    };

    return (
        <>
            {/* Botón dividido */}
            <div className={`inline-flex ${className}`}>
                {/* Botón principal (lado izquierdo) */}
                <button
                    type="button"
                    onClick={handleMainClick}
                    disabled={disabled}
                    className="flex items-center justify-center px-3 py-2 bg-secondary border-double border-2 border-main border-r-0 hover:bg-main hover:text-secondary group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold tracking-wide shadow-[inset_0_0_0_2px_var(--color-secondary)]"
                >
                    {children}
                </button>

                {/* Botón dropdown (lado derecho) */}
                <button
                    ref={refs.setReference}
                    type="button"
                    onClick={handleDropdownClick}
                    disabled={disabled}
                    className="flex items-center justify-center min-w-8 w-8 h-8 bg-secondary border-double border-2 border-main hover:bg-main hover:text-secondary group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold tracking-wide shadow-[inset_0_0_0_2px_var(--color-secondary)]"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    {...getReferenceProps()}
                >
                    {/* Icono de flecha */}
                    <svg
                        className="w-4 h-4 text-main group-hover:text-secondary"
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
                            ref={refs.setFloating}
                            style={floatingStyles}
                            className={`fixed z-[350] bg-secondary border-double border-2 border-main rounded-none min-w-[120px] max-w-[250px] overflow-y-auto ${dropdownClassName}`}
                            {...getFloatingProps()}
                        >
                            {dropdownContent}
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </>
    );
}

// Componente helper para items del dropdown
export function DropdownItem({
    children,
    onClick,
    className = '',
    selected = false,
    ...props
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    selected?: boolean;
}) {
    return (
        <button
            type="button"
            className={`w-full px-3 py-2 text-left focus:outline-none block ${
                selected ? 'bg-main text-secondary' : 'bg-secondary text-main hover:bg-main hover:text-secondary'
            } ${className}`}
            onClick={onClick}
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
