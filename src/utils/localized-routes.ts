import { type Language } from '@/i18n/ui';

// Map of localized route names
export const localizedRoutes = {
  projects: {
    es: 'proyectos',
    en: 'projects', 
    no: 'prosjekter'
  },
  resume: {
    es: 'curriculum',
    en: 'resume',
    no: 'cv'
  }
} as const;

// Complete pages dictionary for language switching
export const pagesDictionary = {
  // Home page
  '/': {
    es: '/es/',
    en: '/',
    no: '/no/'
  },
  '/es/': {
    es: '/es/',
    en: '/',
    no: '/no/'
  },
  '/no/': {
    es: '/es/',
    en: '/',
    no: '/no/'
  },
  // CV/Resume pages
  '/es/curriculum': {
    es: '/es/curriculum',
    en: '/resume',
    no: '/no/cv'
  },
  '/resume': {
    es: '/es/curriculum',
    en: '/resume', 
    no: '/no/cv'
  },
  '/no/cv': {
    es: '/es/curriculum',
    en: '/resume',
    no: '/no/cv'
  },
  // Projects pages (dynamic routes will be handled separately)
  '/es/proyectos': {
    es: '/es/proyectos',
    en: '/projects',
    no: '/no/prosjekter'
  },
  '/projects': {
    es: '/es/proyectos',
    en: '/projects',
    no: '/no/prosjekter'
  },
  '/no/prosjekter': {
    es: '/es/proyectos',
    en: '/projects',
    no: '/no/prosjekter'
  },
  // Individual project pages - these share the same slugs across languages
  '/es/proyectos/00-kit-digital-uc': {
    es: '/es/proyectos/00-kit-digital-uc',
    en: '/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/projects/00-kit-digital-uc': {
    es: '/es/proyectos/00-kit-digital-uc',
    en: '/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/no/prosjekter/00-kit-digital-uc': {
    es: '/es/proyectos/00-kit-digital-uc',
    en: '/projects/00-kit-digital-uc',
    no: '/no/prosjekter/00-kit-digital-uc'
  },
  '/es/proyectos/01-portal-uc': {
    es: '/es/proyectos/01-portal-uc',
    en: '/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/projects/01-portal-uc': {
    es: '/es/proyectos/01-portal-uc',
    en: '/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/no/prosjekter/01-portal-uc': {
    es: '/es/proyectos/01-portal-uc',
    en: '/projects/01-portal-uc',
    no: '/no/prosjekter/01-portal-uc'
  },
  '/es/proyectos/02-agenda-uc': {
    es: '/es/proyectos/02-agenda-uc',
    en: '/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/projects/02-agenda-uc': {
    es: '/es/proyectos/02-agenda-uc',
    en: '/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/no/prosjekter/02-agenda-uc': {
    es: '/es/proyectos/02-agenda-uc',
    en: '/projects/02-agenda-uc',
    no: '/no/prosjekter/02-agenda-uc'
  },
  '/es/proyectos/03-barrancas': {
    es: '/es/proyectos/03-barrancas',
    en: '/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  },
  '/projects/03-barrancas': {
    es: '/es/proyectos/03-barrancas',
    en: '/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  },
  '/no/prosjekter/03-barrancas': {
    es: '/es/proyectos/03-barrancas',
    en: '/projects/03-barrancas',
    no: '/no/prosjekter/03-barrancas'
  }
} as const;

// Helper function to get localized URL
export function getLocalizedUrl(lang: Language, route: keyof typeof localizedRoutes, slug?: string): string {
  const localizedRoute = localizedRoutes[route][lang];
  let basePath: string;
  
  if (lang === 'en') {
    basePath = `/${localizedRoute}`;
  } else {
    basePath = `/${lang}/${localizedRoute}`;
  }
  
  return slug ? `${basePath}/${slug}` : basePath;
}

// Helper function to get home URL
export function getHomeUrl(lang: Language): string {
  if (lang === 'en') {
    return '/';
  }
  return `/${lang}/`;
}

// Helper function to find the equivalent page in a target language
export function getEquivalentPage(currentPath: string, targetLang: Language): string {
  // Normalize path by removing trailing slash (except for root)
  const normalizedPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');
  
  // Check if the current path exists in our dictionary
  if (pagesDictionary[normalizedPath as keyof typeof pagesDictionary]) {
    return pagesDictionary[normalizedPath as keyof typeof pagesDictionary][targetLang];
  }
  
  // Handle dynamic routes (projects with slugs)
  if (normalizedPath.includes('/proyectos/') || normalizedPath.includes('/projects/') || normalizedPath.includes('/prosjekter/')) {
    const pathParts = normalizedPath.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    // Return the equivalent projects page with the same slug
    return getLocalizedUrl(targetLang, 'projects', slug);
  }
  
  // Handle blog routes (if they exist in the future)
  if (normalizedPath.includes('/blog/')) {
    const pathParts = normalizedPath.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    // Return the equivalent blog page with the same slug
    // This assumes blog routes follow the pattern: /lang/blog/slug
    return `/${targetLang}/blog/${slug}`;
  }
  
  // Handle pagination routes for projects
  if (normalizedPath.match(/\/(proyectos|projects|prosjekter)\/\d+$/)) {
    const pathParts = normalizedPath.split('/');
    const pageNumber = pathParts[pathParts.length - 1];
    
    // Return the equivalent projects pagination page
    return getLocalizedUrl(targetLang, 'projects') + '/' + pageNumber;
  }
  
  // If no specific mapping found, try to get the language-appropriate home page
  return getHomeUrl(targetLang);
}