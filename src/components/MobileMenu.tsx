import * as React from 'react';
import HeaderControls from './HeaderControls';
import LanguageSwitcher from './LanguageSwitcher';

interface Theme {
    id: string;
    name: string;
    description: string;
    colorful: string;
    contrasty: string;
}

interface MobileMenuProps {
    navItems: Array<{
        label: string;
        href: string;
        hotkey: string | null;
    }>;
    themes: Theme[];
    currentLocale: string;
}

export default function MobileMenu({ navItems, themes, currentLocale }: MobileMenuProps) {
    const { useState, useEffect } = React;
    const [isOpen, setIsOpen] = useState(false);

    // Listen for menu button click
    useEffect(() => {
        const handleMenuOpen = () => setIsOpen(true);
        window.addEventListener('mobile-menu-open', handleMenuOpen);
        return () => window.removeEventListener('mobile-menu-open', handleMenuOpen);
    }, []);

    // Close menu handlers
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#mobile-menu-dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // Always render the dropdown for animation

    return (
        <div 
            id="mobile-menu-dropdown"
            className={`absolute left-0 right-0 z-40 border-b border-main transition-all duration-300 ease-out ${
                isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
            style={{
                top: '100%',
                height: '400px',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: '32px',
                background: `
                    radial-gradient(circle at 100% 0%, var(--color-main) 0%, var(--color-secondary) 70.7%, transparent 100%),
                    repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        rgba(255,255,255,0.1) 2px,
                        rgba(255,255,255,0.1) 4px
                    ),
                    repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.1) 2px,
                        rgba(0,0,0,0.1) 4px
                    )
                `,
                backgroundBlendMode: 'multiply, overlay, normal'
            }}
        >
            {/* All Items in Column */}
            <div className="flex flex-col items-end gap-3 pt-6 px-8 w-full max-w-sm ml-auto mr-8 overflow-hidden">
                {/* Navigation Items */}
                {navItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className="inline-flex items-center px-3 py-2 bg-secondary border border-main font-grotesk text-sm font-semibold text-main no-underline hover:bg-main hover:text-secondary active:bg-main active:text-secondary"
                        onClick={() => setIsOpen(false)}
                    >
                        {item.label}
                    </a>
                ))}

                {/* Settings Controls */}
                <div className="inline-flex">
                    <HeaderControls themes={themes} />
                </div>
                <div className="inline-flex">
                    <LanguageSwitcher initialLocale={currentLocale as any} />
                </div>
            </div>
        </div>
    );
}