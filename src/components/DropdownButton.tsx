import * as React from 'react';
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

const { useState } = React;

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

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(2),
            flip({
                fallbackPlacements: ['top-start', 'bottom-end', 'top-end']
            }),
            shift({
                padding: 8
            })
        ],
        whileElementsMounted: autoUpdate,
        placement: 'bottom-end'
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    const handleMainClick = () => {
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
                    className="flex items-center justify-center px-3 py-2 bg-secondary border border-main hover:bg-main group   disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {children}
                </button>

                {/* Botón dropdown (lado derecho) */}
                <button
                    ref={refs.setReference}
                    type="button"
                    onClick={handleDropdownClick}
                    disabled={disabled}
                    className="hidden md:flex items-center justify-center w-8 bg-secondary border border-main border-l-0 hover:bg-main group   disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    {...getReferenceProps()}
                >
                    {/* Icono de flecha */}
                    <svg className={`w-4 h-4   ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Dropdown content */}
            {isOpen && (
                <FloatingPortal>
                    <FloatingFocusManager context={context} modal={false}>
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            className={`z-[101] bg-secondary border border-main shadow-lg backdrop-blur-sm rounded-none min-w-[120px] max-w-[250px] overflow-y-auto whitespace-nowrap ${dropdownClassName}`}
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
    ...props
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    [key: string]: any;
}) {
    return (
        <button
            type="button"
            className={`w-full px-3 py-2 text-left hover:bg-main hover:text-secondary   focus:bg-main focus:text-secondary focus:outline-none whitespace-nowrap ${className}`}
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
