import * as React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { type TranslationKey } from '@/i18n/translations';
import { type Locale } from '@/utils/i18n';

const { useEffect, useState } = React;

interface ClientOnlyContentProps {
    initialLocale?: Locale;
    children: (t: (key: TranslationKey) => string, locale: Locale) => React.ReactNode;
}

export default function ClientOnlyContent({ initialLocale, children }: ClientOnlyContentProps) {
    const { t, locale } = useTranslation(initialLocale);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return empty div or skeleton during SSR/hydration
        return <div style={{ visibility: 'hidden' }} />;
    }

    return <>{children(t, locale)}</>;
}