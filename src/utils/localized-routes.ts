import { type Language } from '@/i18n/ui';

export const localizedRoutes = {
    projects: {
        es: 'proyectos',
        en: 'projects',
        no: 'prosjekter',
        ja: 'projects'
    },
    resume: {
        es: 'curriculum',
        en: 'resume',
        no: 'cv',
        ja: 'resume'
    },
    accessibility: {
        es: 'declaracion-de-accesibilidad',
        en: 'accessibility-statement',
        no: 'tilgjengelighetserklaering',
        ja: 'accessibility-statement'
    },
    designSystem: {
        es: 'sistema-de-diseno',
        en: 'design-system',
        no: 'designsystem',
        ja: 'design-system'
    },
    contentTree: {
        es: 'arbol-de-contenido',
        en: 'content-tree',
        no: 'innholdstre',
        ja: 'content-tree'
    }
} as const;

type LocalizedRouteKey = keyof typeof localizedRoutes;

const legacyRouteAliases: Record<string, LocalizedRouteKey> = {
    '/en/accessibility': 'accessibility',
    '/no/accessibility': 'accessibility',
    '/ja/accessibility': 'accessibility',
    '/ja/designsystem': 'designSystem'
};

function normalizePath(inputPath: string): string {
    const [withoutHash] = inputPath.split('#');
    const [withoutQuery] = withoutHash.split('?');

    if (!withoutQuery || withoutQuery === '/') return '/';

    const normalized = withoutQuery.replace(/\/+$/, '');
    return normalized || '/';
}

function getLanguageFromPath(pathname: string): Language {
    if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
    if (pathname === '/no' || pathname.startsWith('/no/')) return 'no';
    if (pathname === '/ja' || pathname.startsWith('/ja/')) return 'ja';
    return 'es';
}

function stripLanguagePrefix(pathname: string, lang: Language): string {
    if (lang === 'es') {
        return pathname === '/' ? '' : pathname.replace(/^\//, '');
    }

    if (pathname === `/${lang}`) return '';
    return pathname.replace(new RegExp(`^/${lang}/?`), '');
}

function isKnownRouteSegment(route: LocalizedRouteKey, segment: string): boolean {
    return Object.values(localizedRoutes[route]).includes(segment as (typeof localizedRoutes)[LocalizedRouteKey][Language]);
}

export function getLocalizedUrl(lang: Language, route: LocalizedRouteKey, slug?: string): string {
    if (route === 'projects' && import.meta.env.PUBLIC_ENABLE_PROJECT_PAGES !== 'true' && !slug) {
        const anchor = lang === 'es' ? 'proyectos' : lang === 'no' ? 'prosjekter' : 'projects';
        return lang === 'es' ? `/#${anchor}` : `/${lang}/#${anchor}`;
    }

    const segment = localizedRoutes[route][lang];
    const basePath = lang === 'es' ? `/${segment}` : `/${lang}/${segment}`;
    return slug ? `${basePath}/${slug}` : basePath;
}

export function getHomeUrl(lang: Language): string {
    return lang === 'es' ? '/' : `/${lang}/`;
}

export function getEquivalentPage(currentPath: string, targetLang: Language): string {
    const normalizedPath = normalizePath(currentPath);

    if (normalizedPath in legacyRouteAliases) {
        return getLocalizedUrl(targetLang, legacyRouteAliases[normalizedPath]);
    }

    if (normalizedPath === '/' || normalizedPath === '/en' || normalizedPath === '/no' || normalizedPath === '/ja') {
        return getHomeUrl(targetLang);
    }

    const sourceLang = getLanguageFromPath(normalizedPath);
    const pathWithoutLang = stripLanguagePrefix(normalizedPath, sourceLang);

    if (!pathWithoutLang) {
        return getHomeUrl(targetLang);
    }

    const sourceProjectsSegment = localizedRoutes.projects[sourceLang];
    if (pathWithoutLang === sourceProjectsSegment) {
        return getLocalizedUrl(targetLang, 'projects');
    }

    if (pathWithoutLang.startsWith(`${sourceProjectsSegment}/`)) {
        const slug = pathWithoutLang.slice(sourceProjectsSegment.length + 1);
        return slug ? getLocalizedUrl(targetLang, 'projects', slug) : getLocalizedUrl(targetLang, 'projects');
    }

    const staticRoutes: LocalizedRouteKey[] = ['resume', 'accessibility', 'designSystem', 'contentTree'];

    for (const route of staticRoutes) {
        if (pathWithoutLang === localizedRoutes[route][sourceLang]) {
            return getLocalizedUrl(targetLang, route);
        }

        if (isKnownRouteSegment(route, pathWithoutLang)) {
            return getLocalizedUrl(targetLang, route);
        }
    }

    if (isKnownRouteSegment('projects', pathWithoutLang)) {
        return getLocalizedUrl(targetLang, 'projects');
    }

    for (const projectSegment of Object.values(localizedRoutes.projects)) {
        if (pathWithoutLang.startsWith(`${projectSegment}/`)) {
            const slug = pathWithoutLang.slice(projectSegment.length + 1);
            return slug ? getLocalizedUrl(targetLang, 'projects', slug) : getLocalizedUrl(targetLang, 'projects');
        }
    }

    return getHomeUrl(targetLang);
}
