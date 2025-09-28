export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
    download?: boolean;
    target?: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
    defaultLocale?: string;
    supportedLocales?: string[];
};

const siteConfig: SiteConfig = {
    title: 'Allison Peña',
    subtitle: 'Full-stack web developer',
    description: 'Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Inicio',
            href: '/'
        },
        {
            text: 'Proyectos',
            href: '/projects'
        }
    ],
    footerNavLinks: [
        {
            text: 'Inicio',
            href: '/'
        },
        {
            text: 'Proyectos',
            href: '/projects'
        }
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://linkedin.com/in/skryensya'
        },
        {
            text: 'GitHub',
            href: 'https://github.com/Skryensya'
        },
        {
            text: 'Lichess',
            href: 'https://lichess.org/@/Skryensya'
        },
        {
            text: 'Email',
            href: 'mailto:allison.jpb@gmail.com'
        }
    ],

    postsPerPage: 5,
    projectsPerPage: 5,
    defaultLocale: 'es',
    supportedLocales: ['es', 'en', 'no']
};

export default siteConfig;
