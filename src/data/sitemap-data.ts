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
          title: 'API Agenda UC',
          url: '/proyectos/api-agenda-uc/'
        },
        {
          title: 'Barrancas',
          url: '/proyectos/barrancas/'
        },
        {
          title: 'Ecosistema UC',
          url: '/proyectos/ecosistema-uc/'
        },
        {
          title: 'Kit Digital UC',
          url: '/proyectos/kit-digital-uc/'
        },
        {
          title: 'Kit Digital USS',
          url: '/proyectos/kit-digital-uss/'
        },
        {
          title: 'Portal UC',
          url: '/proyectos/portal-uc/'
        }
      ]
    },
    {
      title: 'Currículum',
      url: '/curriculum/'
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
          title: 'API Agenda UC',
          url: '/en/projects/api-agenda-uc/'
        },
        {
          title: 'Barrancas',
          url: '/en/projects/barrancas/'
        },
        {
          title: 'Ecosistema UC',
          url: '/en/projects/ecosistema-uc/'
        },
        {
          title: 'Kit Digital UC',
          url: '/en/projects/kit-digital-uc/'
        },
        {
          title: 'Kit Digital USS',
          url: '/en/projects/kit-digital-uss/'
        },
        {
          title: 'Portal UC',
          url: '/en/projects/portal-uc/'
        }
      ]
    },
    {
      title: 'Resume',
      url: '/en/resume/'
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
          title: 'API Agenda UC',
          url: '/no/prosjekter/api-agenda-uc/'
        },
        {
          title: 'Barrancas',
          url: '/no/prosjekter/barrancas/'
        },
        {
          title: 'Ecosistema UC',
          url: '/no/prosjekter/ecosistema-uc/'
        },
        {
          title: 'Kit Digital UC',
          url: '/no/prosjekter/kit-digital-uc/'
        },
        {
          title: 'Kit Digital USS',
          url: '/no/prosjekter/kit-digital-uss/'
        },
        {
          title: 'Portal UC',
          url: '/no/prosjekter/portal-uc/'
        }
      ]
    },
    {
      title: 'CV',
      url: '/no/cv/'
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