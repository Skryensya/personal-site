import * as React from 'react';
import { type Locale } from '@/utils/i18n';
import { createText } from '@/i18n/universal-text';

const { useEffect, useState } = React;

interface AboutStatsProps {
    initialLocale?: Locale;
}

export default function AboutStats({ initialLocale }: AboutStatsProps) {
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
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-32 border-2 border-main bg-main p-4">
                    <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2">Experiencia</div>
                    <div className="font-mono text-xl font-bold text-secondary">3 años</div>
                </div>
                <div className="flex-1 min-w-32 border-2 border-main bg-main p-4">
                    <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2">Ubicación</div>
                    <div className="font-mono text-sm font-bold text-secondary">Santiago, Chile</div>
                </div>
                <div className="flex-1 min-w-40 border-2 border-main bg-main p-4">
                    <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2">Estado</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-mono text-sm font-bold text-secondary">Disponible</span>
                    </div>
                </div>
            </div>
        );
    }

    const text = createText(currentLocale);
    
    return (
        <div className="flex flex-wrap gap-4 mb-4" style={{ viewTransitionName: 'stats-row' }}>
            <div className="flex-1 min-w-32 border-2 border-main bg-main p-4" style={{ viewTransitionName: 'stat-experience' }}>
                <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2">{text.statsExperience()}</div>
                <div className="font-mono text-xl font-bold text-secondary">{text.statsYears()}</div>
            </div>
            <div className="flex-1 min-w-32 border-2 border-main bg-main p-4" style={{ viewTransitionName: 'stat-location' }}>
                <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2">{text.statsLocation()}</div>
                <div className="font-mono text-sm font-bold text-secondary">Santiago, Chile</div>
            </div>
            <div className="flex-1 min-w-40 border-2 border-main bg-main p-4" style={{ viewTransitionName: 'stat-status' }}>
                <div className="font-mono text-xs font-bold text-secondary uppercase tracking-wider mb-2">{text.statsStatus()}</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-mono text-sm font-bold text-secondary">{text.statsAvailable()}</span>
                </div>
            </div>
        </div>
    );
}