import { es } from './locales/es';
import { en } from './locales/en';
import { no } from './locales/no';

export const languages = {
    es: 'Español',
    en: 'English',
    no: 'Norsk'
} as const;

export const defaultLang = 'es' as const;
export const supportedLanguages = Object.keys(languages) as Array<keyof typeof languages>;

export const ui = {
    es,
    en,
    no
} as const;

export type UIKeys = keyof (typeof ui)[typeof defaultLang];
export type Language = keyof typeof ui;
