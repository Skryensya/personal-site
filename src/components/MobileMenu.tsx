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
    const [headerHeight, setHeaderHeight] = useState(80);
    
    // Track header height
    useEffect(() => {
        const updateHeaderHeight = () => {
            const navbar = document.querySelector('nav');
            if (navbar) {
                setHeaderHeight(navbar.getBoundingClientRect().height);
            }
        };
        
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    // Make toggle function globally available
    useEffect(() => {
        (window as any).toggleMobileMenu = () => {
            setIsOpen(prev => !prev);
        };
        
        return () => {
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
            const menuContent = target.closest('.mobile-menu-content');
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
            className={`fixed left-0 right-0 z-40 transition-all duration-200 ease-out ${
                isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
            style={{
                top: `${headerHeight}px`,
                background: `var(--color-secondary)`,
                borderBottom: '1px solid var(--color-main)'
            }}
        >
            {/* Menu Content */}
            <div className="mobile-menu-content flex flex-row items-center justify-between px-4 py-2 w-full">
                {/* Navigation Items */}
                <div className="flex flex-row gap-2 flex-1">
                    {navItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="inline-flex items-center px-2 py-1 bg-secondary border border-main text-xs font-semibold text-main no-underline hover:bg-main hover:text-secondary active:bg-main active:text-secondary whitespace-nowrap"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Settings Controls */}
                <div className="flex flex-row gap-2 items-center">
                    <div className="inline-flex">
                        <HeaderControls themes={themes} />
                    </div>
                    <div className="inline-flex">
                        <LanguageSwitcher initialLocale={currentLocale as any} />
                    </div>
                </div>
            </div>
        </div>
    );
}