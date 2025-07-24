import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Rnd } from 'react-rnd';

interface FloatingWindowProps {
    children: React.ReactNode;
    title?: string;
    defaultPosition?: { x: number; y: number };
    defaultSize?: { width: number; height: number };
    isOpen?: boolean;
    onClose?: () => void;
    resizable?: boolean;
}

const FloatingWindow = React.memo(function FloatingWindow({
    children,
    title = 'Window',
    defaultPosition = { x: 100, y: 100 },
    defaultSize = { width: 400, height: 300 },
    isOpen = true,
    onClose,
    resizable = true
}: FloatingWindowProps) {
    const [open, setOpen] = useState(isOpen);

    // Sincronizar con prop externa isOpen
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setOpen(false);
        // Dar tiempo para animaciones si las hay, luego limpiar completamente
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 0);
    }, [onClose]);

    // Manejar tecla Escape para cerrar
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [open, handleClose]);

    // Si está cerrada, no renderizar nada (desmonta completamente)
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{
                width: '100dvw',
                height: '100dvh',
                zIndex: 9999
            }}
        >
            <Rnd
                default={{
                    x: defaultPosition.x,
                    y: defaultPosition.y,
                    width: defaultSize.width,
                    height: defaultSize.height
                }}
                minWidth={resizable ? 200 : defaultSize.width}
                minHeight={resizable ? 150 : defaultSize.height}
                maxWidth={resizable ? undefined : defaultSize.width}
                maxHeight={resizable ? undefined : defaultSize.height}
                disableDragging={false}
                enableResizing={resizable}
                bounds="parent"
                dragHandleClassName="floating-window-header"
                className="floating-window pointer-events-auto"
                style={{ zIndex: 1 }}
            >
                <div className="h-full flex flex-col border-2 border-main bg-secondary">
                    {/* Header */}
                    <div className="floating-window-header flex items-center justify-between bg-secondary text-main border-b border-main h-8  cursor-grab active:cursor-grabbing select-none diagonal-stripe">
                        <span className="text-xs font-mono font-semibold truncate ml-1 px-1 bg-secondary border">{title}</span>
                        <button
                            onClick={handleClose}
                            className=" flex items-center justify-center bg-main text-secondary aspect-square h-full  text-xs font-bold border-l border-main"
                            aria-label="Close window"
                        >
                            <X className="font-secondary" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-0.5">{children}</div>
                </div>
            </Rnd>
        </div>
    );
});

export default FloatingWindow;
