import React from 'react';
import LogoLoop from './LogoLoop';

const technologies = [
    {
        node: (
            <img src="/img/technologies/react.svg" alt="React" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'React',
        ariaLabel: 'React - JavaScript library for building user interfaces'
    },
    {
        node: (
            <img src="/img/technologies/typescript.svg" alt="TypeScript" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'TypeScript',
        ariaLabel: 'TypeScript - JavaScript with syntax for types'
    },
    {
        node: (
            <img src="/img/technologies/nodejs.svg" alt="Node.js" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Node.js',
        ariaLabel: 'Node.js - JavaScript runtime built on Chrome\'s V8 JavaScript engine'
    },
    {
        node: (
            <img src="/img/technologies/astro.svg" alt="Astro" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Astro',
        ariaLabel: 'Astro - The web framework for content-driven websites'
    },
    {
        node: (
            <img src="/img/technologies/postgresql.svg" alt="PostgreSQL" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'PostgreSQL',
        ariaLabel: 'PostgreSQL - Advanced open source relational database'
    },
    {
        node: (
            <img src="/img/technologies/tailwindcss.svg" alt="Tailwind CSS" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Tailwind CSS',
        ariaLabel: 'Tailwind CSS - Utility-first CSS framework'
    },
    {
        node: (
            <img src="/img/technologies/figma.svg" alt="Figma" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Figma',
        ariaLabel: 'Figma - Collaborative interface design tool'
    },
    {
        node: (
            <img src="/img/technologies/docker.svg" alt="Docker" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Docker',
        ariaLabel: 'Docker - Platform for developing, shipping, and running applications'
    },
    {
        node: (
            <img src="/img/technologies/nextjs2.svg" alt="Next.js" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Next.js',
        ariaLabel: 'Next.js - The React framework for production'
    },
    {
        node: (
            <img src="/img/technologies/vitejs.svg" alt="Vite" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Vite',
        ariaLabel: 'Vite - Next generation frontend tooling'
    },
    {
        node: (
            <img src="/img/technologies/js.svg" alt="JavaScript" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'JavaScript',
        ariaLabel: 'JavaScript - Programming language of the web'
    },
    {
        node: (
            <img src="/img/technologies/git.svg" alt="Git" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Git',
        ariaLabel: 'Git - Distributed version control system'
    },
    {
        node: (
            <img src="/img/technologies/sass.svg" alt="Sass" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Sass',
        ariaLabel: 'Sass - CSS with superpowers'
    },
    {
        node: (
            <img src="/img/technologies/php.svg" alt="PHP" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'PHP',
        ariaLabel: 'PHP - Popular general-purpose scripting language'
    },
    {
        node: (
            <img src="/img/technologies/laravel.svg" alt="Laravel" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'Laravel',
        ariaLabel: 'Laravel - The PHP framework for web artisans'
    },
    {
        node: (
            <img src="/img/technologies/mysql.svg" alt="MySQL" className="h-[var(--logoloop-logoHeight)] w-auto select-none pointer-events-none" draggable={false} />
        ),
        href: null,
        title: 'MySQL',
        ariaLabel: 'MySQL - The world\'s most popular open source database'
    }
];

export default function TechLogos() {
    return (
        <LogoLoop
            logos={technologies}
            speed={50}
            logoHeight={40}
            gap={64}
            fadeOut={true}
            fadeOutColor="var(--color-secondary)"
            pauseOnHover={true}
            direction="left"
            ariaLabel="Technologies I work with"
            className="w-full"
        />
    );
}