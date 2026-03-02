import { type Language } from '@/i18n/ui';

// Map of localized route names
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
  }
} as const;

// Complete pages dictionary for language switching
export const pagesDictionary = {
  // Home page
  '/': {
    es: '/',
    en: '/en/',
    no: '/no/'
  },
  '/en/': {
    es: '/',
    en: '/en/',
    no: '/no/'
  },
  '/no/': {
    es: '/',
    en: '/en/',
    no: '/no/'
  },
  '/ja/': {
    es: '/',
    en: '/en/',
    no: '/no/',
    ja: '/ja/'
  },
  // CV/Resume pages
  '/curriculum': {
    es: '/curriculum',
    en: '/en/resume',
    no: '/no/cv'
  },
  '/en/resume': {
    es: '/curriculum',
    en: '/en/resume', 
    no: '/no/cv'
  },
  '/no/cv': {
    es: '/curriculum',
    en: '/en/resume',
    no: '/no/cv'
  },
  // Accessibility pages (old routes for backward compatibility)
  '/accessibility': {
    es: '/declaracion-de-accesibilidad',
    en: '/en/accessibility-statement',
    no: '/no/tilgjengelighetserklaering'
  },
  '/en/accessibility': {
    es: '/declaracion-de-accesibilidad',
    en: '/en/accessibility-statement',
    no: '/no/tilgjengelighetserklaering'
  },
  '/no/accessibility': {
    es: '/declaracion-de-accesibilidad',
    en: '/en/accessibility-statement',
    no: '/no/tilgjengelighetserklaering'
  },
  // New accessibility pages with proper translated names
  '/declaracion-de-accesibilidad': {
    es: '/declaracion-de-accesibilidad',
    en: '/en/accessibility-statement',
    no: '/no/tilgjengelighetserklaering'
  },
  '/declaracion-de-accesibilidad/': {
    es: '/declaracion-de-accesibilidad/',
    en: '/en/accessibility-statement/',
    no: '/no/tilgjengelighetserklaering/'
  },
  '/en/accessibility-statement': {
    es: '/declaracion-de-accesibilidad',
    en: '/en/accessibility-statement',
    no: '/no/tilgjengelighetserklaering'
  },
  '/en/accessibility-statement/': {
    es: '/declaracion-de-accesibilidad/',
    en: '/en/accessibility-statement/',
    no: '/no/tilgjengelighetserklaering/'
  },
  '/no/tilgjengelighetserklaering': {
    es: '/declaracion-de-accesibilidad',
    en: '/en/accessibility-statement',
    no: '/no/tilgjengelighetserklaering'
  },
  '/no/tilgjengelighetserklaering/': {
    es: '/declaracion-de-accesibilidad/',
    en: '/en/accessibility-statement/',
    no: '/no/tilgjengelighetserklaering/'
  },
  // Projects pages (pagination)
  '/projects': {
    es: '/proyectos',
    en: '/en/projects',
    no: '/no/prosjekter'
  },
  '/projects/': {
    es: '/proyectos/',
    en: '/en/projects/',
    no: '/no/prosjekter/'
  },
  '/proyectos': {
    es: '/proyectos',
    en: '/en/projects',
    no: '/no/prosjekter'
  },
  '/proyectos/': {
    es: '/proyectos/',
    en: '/en/projects/',
    no: '/no/prosjekter/'
  },
  '/projects/1': {
    es: '/proyectos/1',
    en: '/en/projects/1',
    no: '/no/prosjekter/1'
  },
  '/proyectos/1': {
    es: '/proyectos/1',
    en: '/en/projects/1',
    no: '/no/prosjekter/1'
  },
  '/en/projects': {
    es: '/proyectos',
    en: '/en/projects',
    no: '/no/prosjekter'
  },
  '/en/projects/': {
    es: '/proyectos/',
    en: '/en/projects/',
    no: '/no/prosjekter/'
  },
  '/en/projects/1': {
    es: '/proyectos/1',
    en: '/en/projects/1',
    no: '/no/prosjekter/1'
  },
  '/no/prosjekter': {
    es: '/proyectos',
    en: '/en/projects',
    no: '/no/prosjekter'
  },
  '/no/prosjekter/': {
    es: '/proyectos/',
    en: '/en/projects/',
    no: '/no/prosjekter/'
  },
  '/no/prosjekter/1': {
    es: '/proyectos/1',
    en: '/en/projects/1',
    no: '/no/prosjekter/1'
  },
  // Individual project pages - these share the same slugs across languages
  '/projects/00-kit-digital-uc': {
    es: '/proyectos/00-kit-digital-uc',
    en: '/en/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/proyectos/00-kit-digital-uc': {
    es: '/proyectos/00-kit-digital-uc',
    en: '/en/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/en/projects/00-kit-digital-uc': {
    es: '/proyectos/00-kit-digital-uc',
    en: '/en/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/no/prosjekter/00-kit-digital-uc': {
    es: '/proyectos/00-kit-digital-uc',
    en: '/en/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/projects/01-portal-uc': {
    es: '/proyectos/01-portal-uc',
    en: '/en/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/proyectos/01-portal-uc': {
    es: '/proyectos/01-portal-uc',
    en: '/en/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/en/projects/01-portal-uc': {
    es: '/proyectos/01-portal-uc',
    en: '/en/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/no/prosjekter/01-portal-uc': {
    es: '/proyectos/01-portal-uc',
    en: '/en/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/projects/02-agenda-uc': {
    es: '/proyectos/02-agenda-uc',
    en: '/en/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/proyectos/02-agenda-uc': {
    es: '/proyectos/02-agenda-uc',
    en: '/en/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/en/projects/02-agenda-uc': {
    es: '/proyectos/02-agenda-uc',
    en: '/en/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/no/prosjekter/02-agenda-uc': {
    es: '/proyectos/02-agenda-uc',
    en: '/en/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/projects/03-barrancas': {
    es: '/proyectos/03-barrancas',
    en: '/en/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  },
  '/proyectos/03-barrancas': {
    es: '/proyectos/03-barrancas',
    en: '/en/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  },
  '/en/projects/03-barrancas': {
    es: '/proyectos/03-barrancas',
    en: '/en/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  },
  '/no/prosjekter/03-barrancas': {
    es: '/proyectos/03-barrancas',
    en: '/en/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  },
  '/projects/skryensya-dev': {
    es: '/proyectos/skryensya-dev',
    en: '/en/projects/skryensya-dev',
    no: '/no/prosjekter/skryensya-dev'
  },
  '/proyectos/skryensya-dev': {
    es: '/proyectos/skryensya-dev',
    en: '/en/projects/skryensya-dev',
    no: '/no/prosjekter/skryensya-dev'
  },
  '/en/projects/skryensya-dev': {
    es: '/proyectos/skryensya-dev',
    en: '/en/projects/skryensya-dev',
    no: '/no/prosjekter/skryensya-dev'
  },
  '/no/prosjekter/skryensya-dev': {
    es: '/proyectos/skryensya-dev',
    en: '/en/projects/skryensya-dev',
    no: '/no/prosjekter/skryensya-dev'
  },
  // Content Tree pages
  '/arbol-de-contenido': {
    es: '/arbol-de-contenido',
    en: '/en/content-tree',
    no: '/no/innholdstre'
  },
  '/arbol-de-contenido/': {
    es: '/arbol-de-contenido/',
    en: '/en/content-tree/',
    no: '/no/innholdstre/'
  },
  '/en/content-tree': {
    es: '/arbol-de-contenido',
    en: '/en/content-tree',
    no: '/no/innholdstre'
  },
  '/en/content-tree/': {
    es: '/arbol-de-contenido/',
    en: '/en/content-tree/',
    no: '/no/innholdstre/'
  },
  '/no/innholdstre': {
    es: '/arbol-de-contenido',
    en: '/en/content-tree',
    no: '/no/innholdstre'
  },
  '/no/innholdstre/': {
    es: '/arbol-de-contenido/',
    en: '/en/content-tree/',
    no: '/no/innholdstre/'
  },
  // Design System pages
  '/sistema-de-diseno': {
    es: '/sistema-de-diseno',
    en: '/en/design-system',
    no: '/no/designsystem'
  },
  '/sistema-de-diseno/': {
    es: '/sistema-de-diseno/',
    en: '/en/design-system/',
    no: '/no/designsystem/'
  },
  '/en/design-system': {
    es: '/sistema-de-diseno',
    en: '/en/design-system',
    no: '/no/designsystem'
  },
  '/en/design-system/': {
    es: '/sistema-de-diseno/',
    en: '/en/design-system/',
    no: '/no/designsystem/'
  },
  '/no/designsystem': {
    es: '/sistema-de-diseno',
    en: '/en/design-system',
    no: '/no/designsystem'
  },
  '/no/designsystem/': {
    es: '/sistema-de-diseno/',
    en: '/en/design-system/',
    no: '/no/designsystem/'
  }
} as const;

// Helper function to get localized URL
export function getLocalizedUrl(lang: Language, route: keyof typeof localizedRoutes, slug?: string): string {
  const localizedRoute = localizedRoutes[route][lang];

  // If project pages are disabled and route is 'projects', return anchor link
  if (route === 'projects' && import.meta.env.PUBLIC_ENABLE_PROJECT_PAGES !== 'true' && !slug) {
    const anchor = lang === 'es' ? 'proyectos' : (lang === 'no' ? 'prosjekter' : 'projects');
    return lang === 'es' ? `/#${anchor}` : `/${lang}/#${anchor}`;
  }

  let basePath: string;

  if (lang === 'es') {
    // Spanish is the default language, no prefix
    basePath = `/${localizedRoute}`;
  } else {
    // Other languages get prefixed
    basePath = `/${lang}/${localizedRoute}`;
  }

  return slug ? `${basePath}/${slug}` : basePath;
}

// Helper function to get home URL
export function getHomeUrl(lang: Language): string {
  if (lang === 'es') {
    // Spanish is the default language, no prefix
    return '/';
  }
  return `/${lang}/`;
}

// Helper function to find the equivalent page in a target language
export function getEquivalentPage(currentPath: string, targetLang: Language): string {
  // Normalize path by removing trailing slash (except for root)
  const normalizedPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');

  // Direct dictionary lookup
  if (pagesDictionary[normalizedPath as keyof typeof pagesDictionary]) {
    const mapping = pagesDictionary[normalizedPath as keyof typeof pagesDictionary] as Record<string, string>;
    if (mapping[targetLang]) return mapping[targetLang];
    if (targetLang !== 'ja') return mapping['es'] || getHomeUrl(targetLang);
  }

  // If on Japanese path and no explicit mapping exists, try English equivalent for lookup
  if (normalizedPath === '/ja') {
    return targetLang === 'ja' ? '/ja/' : getHomeUrl(targetLang);
  }
  if (normalizedPath.startsWith('/ja/')) {
    const enEquivalent = `/en/${normalizedPath.slice(4)}`;
    if (pagesDictionary[enEquivalent as keyof typeof pagesDictionary]) {
      const mapping = pagesDictionary[enEquivalent as keyof typeof pagesDictionary] as Record<string, string>;
      if (mapping[targetLang]) return mapping[targetLang];
      if (targetLang === 'ja') {
        if (enEquivalent.includes('/resume')) return '/ja/resume';
        if (enEquivalent.includes('/design-system')) return '/ja/design-system';
        if (enEquivalent.includes('/accessibility-statement')) return '/ja/accessibility-statement';
        if (enEquivalent.includes('/content-tree')) return '/ja/content-tree';
      }
      return mapping['es'] || getHomeUrl(targetLang);
    }
  }
  
  // Handle dynamic routes (projects with slugs)
  if (normalizedPath.includes('/proyectos/') || normalizedPath.includes('/projects/') || normalizedPath.includes('/prosjekter/')) {
    const pathParts = normalizedPath.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    // Skip if it's just a page number (handled separately)
    if (!/^\d+$/.test(slug) && slug !== 'proyectos' && slug !== 'projects' && slug !== 'prosjekter') {
      // Return the equivalent projects page with the same slug
      return getLocalizedUrl(targetLang, 'projects', slug);
    }
  }
  
  // Handle pagination routes for projects
  if (normalizedPath.match(/\/(proyectos|projects|prosjekter)\/\d+$/)) {
    const pathParts = normalizedPath.split('/');
    const pageNumber = pathParts[pathParts.length - 1];
    
    // Return the equivalent projects pagination page
    return getLocalizedUrl(targetLang, 'projects') + '/' + pageNumber;
  }
  
  // Handle blog routes (if they exist in the future)
  if (normalizedPath.includes('/blog/')) {
    const pathParts = normalizedPath.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    // Return the equivalent blog page with the same slug
    if (targetLang === 'es') {
      return `/blog/${slug}`;
    } else {
      return `/${targetLang}/blog/${slug}`;
    }
  }
  
  // Fallback: try to handle paths with trailing slashes
  const pathWithSlash = normalizedPath + '/';
  if (pagesDictionary[pathWithSlash as keyof typeof pagesDictionary]) {
    const mapping = pagesDictionary[pathWithSlash as keyof typeof pagesDictionary] as Record<string, string>;
    if (mapping[targetLang]) return mapping[targetLang];
    if (targetLang !== 'ja') return mapping['es'] || getHomeUrl(targetLang);
  }
  
  // Handle edge case: direct access to /projects/, /proyectos/, /prosjekter/ base paths
  if (normalizedPath === '/projects' || normalizedPath === '/proyectos' || normalizedPath === '/prosjekter' || normalizedPath === '/ja/projects') {
    return getLocalizedUrl(targetLang, 'projects');
  }
  
  // Handle content tree routes if they don't exist in dictionary
  if (normalizedPath === '/content-tree' || normalizedPath === '/arbol-de-contenido' || normalizedPath === '/innholdstre' || normalizedPath === '/ja/content-tree') {
    if (targetLang === 'es') return '/arbol-de-contenido';
    if (targetLang === 'en') return '/en/content-tree';
    if (targetLang === 'no') return '/no/innholdstre';
    if (targetLang === 'ja') return '/ja/content-tree';
  }

  // Japanese fallbacks for known static routes when dictionary entry has no ja key yet
  if (targetLang === 'ja') {
    if (normalizedPath.includes('/resume') || normalizedPath.includes('/curriculum') || normalizedPath.includes('/cv')) {
      return '/ja/resume';
    }
    if (normalizedPath.includes('/design-system') || normalizedPath.includes('/sistema-de-diseno') || normalizedPath.includes('/designsystem')) {
      return '/ja/design-system';
    }
    if (normalizedPath.includes('/accessibility-statement') || normalizedPath.includes('/declaracion-de-accesibilidad') || normalizedPath.includes('/tilgjengelighetserklaering')) {
      return '/ja/accessibility-statement';
    }
    if (normalizedPath.includes('/projects') || normalizedPath.includes('/proyectos') || normalizedPath.includes('/prosjekter')) {
      return '/ja/projects';
    }
  }
  
  // If no specific mapping found, try to get the language-appropriate home page
  return getHomeUrl(targetLang);
}
