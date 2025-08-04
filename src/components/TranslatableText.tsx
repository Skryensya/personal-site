import * as React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { type TranslationKey } from '@/i18n/translations';
import { type Locale, getLocaleFromUrl } from '@/utils/i18n';

const { useEffect, useState } = React;

interface TranslatableTextProps {
    translationKey: TranslationKey;
    initialLocale?: Locale;
    fallback?: string;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
}

export default function TranslatableText({ 
    translationKey, 
    initialLocale, 
    fallback = '', 
    as: Component = 'span',
    className,
    children
}: TranslatableTextProps) {
    const { t, locale } = useTranslation(initialLocale);
    const [text, setText] = useState(() => {
        // Initialize with server-side locale if available
        if (typeof window === 'undefined' && initialLocale) {
            return t(translationKey);
        }
        return fallback || translationKey;
    });

    useEffect(() => {
        setText(t(translationKey));
    }, [translationKey, t, locale]);

    return (
        <Component className={className}>
            {text}
            {children}
        </Component>
    );
}