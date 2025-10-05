import { defaultLang, type Language } from '@/i18n/ui';

export interface SitemapNode {
  title: string;
  url: string;
  children?: SitemapNode[];
}

export interface LanguageSitemap {
  [key: string]: SitemapNode[];
}

// Dynamic sitemap data for each language
export const sitemapData: LanguageSitemap = {
  es: [
    {
      title: 'Inicio',
      url: '/',
      children: [
        {
          title: 'Sobre mí',
          url: '/#about'
        },
        {
          title: 'Tecnologías',
          url: '/#technologies'
        },
        {
          title: 'Proyectos destacados',
          url: '/#projects'
        }
      ]
    },
    {
      title: 'Proyectos',
      url: '/proyectos/',
      children: [
        {
          title: 'Portal UC',
          url: '/proyectos/portal-uc/'
        },
        {
          title: 'Kit Digital UC',
          url: '/proyectos/kit-digital-uc/'
        },
        {
          title: 'API Agenda UC',
          url: '/proyectos/agenda-uc/'
        },
        {
          title: 'Kit Digital USS',
          url: '/proyectos/kit-digital-uss/'
        },
        {
          title: 'Hostal Micelio',
          url: '/proyectos/hostal-micelio/'
        },
        {
          title: 'TTU',
          url: '/proyectos/ttu/'
        },
        {
          title: 'Barrancas',
          url: '/proyectos/barrancas/'
        }
      ]
    },
    {
      title: 'Currículum',
      url: '/curriculum/'
    },
    {
      title: 'Sistema de Diseño',
      url: '/sistema-de-diseno/'
    },
    {
      title: 'Declaración de Accesibilidad',
      url: '/declaracion-de-accesibilidad/'
    }
  ],
  en: [
    {
      title: 'Home',
      url: '/en/',
      children: [
        {
          title: 'About me',
          url: '/en/#about'
        },
        {
          title: 'Technologies',
          url: '/en/#technologies'
        },
        {
          title: 'Featured projects',
          url: '/en/#projects'
        }
      ]
    },
    {
      title: 'Projects',
      url: '/en/projects/',
      children: [
        {
          title: 'Portal UC',
          url: '/en/projects/portal-uc/'
        },
        {
          title: 'Kit Digital UC',
          url: '/en/projects/kit-digital-uc/'
        },
        {
          title: 'API Agenda UC',
          url: '/en/projects/agenda-uc/'
        },
        {
          title: 'Kit Digital USS',
          url: '/en/projects/kit-digital-uss/'
        },
        {
          title: 'Hostal Micelio',
          url: '/en/projects/hostal-micelio/'
        },
        {
          title: 'TTU',
          url: '/en/projects/ttu/'
        },
        {
          title: 'Barrancas',
          url: '/en/projects/barrancas/'
        }
      ]
    },
    {
      title: 'Resume',
      url: '/en/resume/'
    },
    {
      title: 'Design System',
      url: '/en/design-system/'
    },
    {
      title: 'Accessibility Statement',
      url: '/en/accessibility-statement/'
    }
  ],
  no: [
    {
      title: 'Hjem',
      url: '/no/',
      children: [
        {
          title: 'Om meg',
          url: '/no/#about'
        },
        {
          title: 'Teknologier',
          url: '/no/#technologies'
        },
        {
          title: 'Utvalgte prosjekter',
          url: '/no/#projects'
        }
      ]
    },
    {
      title: 'Prosjekter',
      url: '/no/prosjekter/',
      children: [
        {
          title: 'Portal UC',
          url: '/no/prosjekter/portal-uc/'
        },
        {
          title: 'Kit Digital UC',
          url: '/no/prosjekter/kit-digital-uc/'
        },
        {
          title: 'API Agenda UC',
          url: '/no/prosjekter/agenda-uc/'
        },
        {
          title: 'Kit Digital USS',
          url: '/no/prosjekter/kit-digital-uss/'
        },
        {
          title: 'Hostal Micelio',
          url: '/no/prosjekter/hostal-micelio/'
        },
        {
          title: 'TTU',
          url: '/no/prosjekter/ttu/'
        },
        {
          title: 'Barrancas',
          url: '/no/prosjekter/barrancas/'
        }
      ]
    },
    {
      title: 'CV',
      url: '/no/cv/'
    },
    {
      title: 'Designsystem',
      url: '/no/designsystem/'
    },
    {
      title: 'Tilgjengelighetserklæring',
      url: '/no/tilgjengelighetserklaering/'
    }
  ]
};

export function getSitemapForLanguage(lang: Language = defaultLang): SitemapNode[] {
  return sitemapData[lang] || sitemapData[defaultLang];
}