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
    
    // Debug: Log state changes
    useEffect(() => {
        console.log('Menu state changed to:', isOpen);
    }, [isOpen]);

    // Listen for menu button click
    useEffect(() => {
        const handleMenuOpen = () => {
            console.log('Mobile menu open event received');
            setIsOpen(true);
        };
        
        // Make toggleMenu function globally available
        (window as any).toggleMobileMenu = () => {
            console.log('Global toggleMobileMenu called');
            setIsOpen(prev => !prev);
        };
        
        console.log('MobileMenu component mounted, adding event listener');
        window.addEventListener('mobile-menu-open', handleMenuOpen);
        return () => {
            console.log('MobileMenu component unmounting, removing event listener');
            window.removeEventListener('mobile-menu-open', handleMenuOpen);
            delete (window as any).toggleMobileMenu;
        };
    }, []);

    // Close menu handlers
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const menuContent = target.closest('.menu-content');
            const menuTrigger = target.closest('#mobile-menu-trigger');
            
            // Don't close if clicking on menu trigger or menu content
            if (!menuContent && !menuTrigger) {
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
            className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
                isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
            style={{
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
            <div className="menu-content flex flex-col items-end gap-3 pt-20 px-8 w-full max-w-sm ml-auto mr-8 overflow-hidden">
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