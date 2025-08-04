import * as React from 'react';
import { type Locale } from '@/utils/i18n';
import { createText } from '@/i18n/universal-text';

const { useEffect, useState } = React;

interface AboutSpecialtiesProps {
    initialLocale?: Locale;
}

export default function AboutSpecialties({ initialLocale }: AboutSpecialtiesProps) {
    const [mounted, setMounted] = useState(false);
    const [currentLocale, setCurrentLocale] = useState(initialLocale);

    useEffect(() => {
        setMounted(true);
        
        // Listen for locale changes
        const handleLocaleChange = (event: CustomEvent<Locale>) => {
            setCurrentLocale(event.detail);
        };

        window.addEventListener('localeChanged', handleLocaleChange as EventListener);
        
        return () => {
            window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
        };
    }, []);

    if (!mounted) {
        return (
            <div className="border-2 border-main bg-secondary p-4 mb-4">
                <div className="font-mono text-xs font-bold text-main uppercase tracking-wider mb-3">Especialidades</div>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary">Accessibility</span>
                    <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary">Performance</span>
                    <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary">Developer Experience</span>
                    <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary">UI/UX Design</span>
                </div>
            </div>
        );
    }

    const text = createText(currentLocale);
    
    return (
        <div className="border-2 border-main bg-secondary p-4 mb-4" style={{ viewTransitionName: 'specialties-section' }}>
            <div className="font-mono text-xs font-bold text-main uppercase tracking-wider mb-3" style={{ viewTransitionName: 'specialties-title' }}>{text.specialtiesTitle()}</div>
            <div className="flex flex-wrap gap-2" style={{ viewTransitionName: 'specialties-badges' }}>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-1' }}>{text.specialtyAccessibility()}</span>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-2' }}>{text.specialtyPerformance()}</span>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-3' }}>{text.specialtyDeveloperExperience()}</span>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-4' }}>{text.specialtyUIUX()}</span>
            </div>
        </div>
    );
}