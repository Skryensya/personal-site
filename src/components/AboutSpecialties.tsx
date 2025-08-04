import * as React from 'react';
import { type Language } from '@/i18n/ui';
import { useClientTranslations } from '@/i18n/utils';

const { useEffect, useState } = React;

interface AboutSpecialtiesProps {
    initialLocale?: Language;
}

export default function AboutSpecialties({ initialLocale }: AboutSpecialtiesProps) {
    const [mounted, setMounted] = useState(false);
    const [currentLocale, setCurrentLocale] = useState(initialLocale);

    useEffect(() => {
        setMounted(true);

        // Listen for locale changes
        const handleLocaleChange = (event: CustomEvent<Language>) => {
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

    const t = useClientTranslations();

    return (
        <div className="border-2 border-main bg-secondary p-4 mb-4" style={{ viewTransitionName: 'specialties-section' }}>
            <div className="font-mono text-xs font-bold text-main uppercase tracking-wider mb-3" style={{ viewTransitionName: 'specialties-title' }}>
                {t('home.specialties')}
            </div>
            <div className="flex flex-wrap gap-2" style={{ viewTransitionName: 'specialties-badges' }}>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-1' }}>
                    {t('home.specialties.accessibility')}
                </span>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-2' }}>
                    {t('home.specialties.performance')}
                </span>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-3' }}>
                    {t('home.specialties.dx')}
                </span>
                <span className="bg-main border border-main px-3 py-1 font-mono text-xs font-bold text-secondary" style={{ viewTransitionName: 'specialty-4' }}>
                    {t('home.specialties.uiux')}
                </span>
            </div>
        </div>
    );
}
