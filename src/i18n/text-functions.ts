import { type Locale } from '@/utils/i18n';

// Navigation text functions
export function getNavHome(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Inicio';
        case 'en': return 'Home';
        case 'no': return 'Hjem';
        default: return 'Inicio';
    }
}

export function getNavProjects(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Proyectos';
        case 'en': return 'Projects';
        case 'no': return 'Prosjekter';
        default: return 'Proyectos';
    }
}

export function getNavBlog(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Blog';
        case 'en': return 'Blog';
        case 'no': return 'Blogg';
        default: return 'Blog';
    }
}

export function getNavAbout(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Acerca';
        case 'en': return 'About';
        case 'no': return 'Om';
        default: return 'Acerca';
    }
}

export function getNavContact(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Contacto';
        case 'en': return 'Contact';
        case 'no': return 'Kontakt';
        default: return 'Contacto';
    }
}

// Home page section titles
export function getTechnologiesTitle(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Tecnologías';
        case 'en': return 'Technologies';
        case 'no': return 'Teknologier';
        default: return 'Tecnologías';
    }
}

export function getAboutTitle(locale: Locale): string {
    switch (locale) {
        case 'es': return 'About';
        case 'en': return 'About';
        case 'no': return 'Om';
        default: return 'About';
    }
}

export function getFeaturedProjectsTitle(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Proyectos Destacados';
        case 'en': return 'Featured Projects';
        case 'no': return 'Utvalgte Prosjekter';
        default: return 'Proyectos Destacados';
    }
}

// Home page bio content
export function getBioGreeting(locale: Locale): string {
    switch (locale) {
        case 'es': return '¡Hola!';
        case 'en': return 'Hello!';
        case 'no': return 'Hei!';
        default: return '¡Hola!';
    }
}

export function getBioIntro(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Soy Allison, full-stack developer apasionada por crear experiencias web brutalmente simples pero funcionalmente complejas. Me encanta resolver problemas técnicos complejos y convertir ideas en productos digitales que realmente funcionen.';
        case 'en': return 'I\'m Allison, a full-stack developer passionate about creating brutally simple yet functionally complex web experiences. I love solving complex technical problems and turning ideas into digital products that actually work.';
        case 'no': return 'Jeg er Allison, en fullstack-utvikler som brenner for å skape brutalt enkle, men funksjonelt komplekse webopplevelser. Jeg elsker å løse komplekse tekniske problemer og gjøre ideer om til digitale produkter som faktisk fungerer.';
        default: return 'Soy Allison, full-stack developer apasionada por crear experiencias web brutalmente simples pero funcionalmente complejas. Me encanta resolver problemas técnicos complejos y convertir ideas en productos digitales que realmente funcionen.';
    }
}

export function getBioExperience(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Con 3 años de experiencia en desarrollo web, me especializo en accessibility, performance, developer experience y UI/UX. Actualmente disponible para nuevos proyectos y colaboraciones desde Santiago, Chile.';
        case 'en': return 'With 3 years of experience in web development, I specialize in accessibility, performance, developer experience, and UI/UX. Currently available for new projects and collaborations from Santiago, Chile.';
        case 'no': return 'Med 3 års erfaring innen webutvikling spesialiserer jeg meg på tilgjengelighet, ytelse, utvikleropplevelse og UI/UX. For tiden tilgjengelig for nye prosjekter og samarbeid fra Santiago, Chile.';
        default: return 'Con 3 años de experiencia en desarrollo web, me especializo en accessibility, performance, developer experience y UI/UX. Actualmente disponible para nuevos proyectos y colaboraciones desde Santiago, Chile.';
    }
}

// Badge text functions
export function getBadgeProblemSolver(locale: Locale): string {
    switch (locale) {
        case 'es': return 'PROBLEM SOLVER';
        case 'en': return 'PROBLEM SOLVER';
        case 'no': return 'PROBLEMLØSER';
        default: return 'PROBLEM SOLVER';
    }
}

export function getBadgeCleanCode(locale: Locale): string {
    switch (locale) {
        case 'es': return 'CLEAN CODE';
        case 'en': return 'CLEAN CODE';
        case 'no': return 'REN KODE';
        default: return 'CLEAN CODE';
    }
}

export function getBadgeUserFocused(locale: Locale): string {
    switch (locale) {
        case 'es': return 'USER FOCUSED';
        case 'en': return 'USER FOCUSED';
        case 'no': return 'BRUKERFOKUSERT';
        default: return 'USER FOCUSED';
    }
}

// Call to action text
export function getSeeMoreButton(locale: Locale): string {
    switch (locale) {
        case 'es': return 'VER MÁS SOBRE MÍ →';
        case 'en': return 'SEE MORE ABOUT ME →';
        case 'no': return 'SE MER OM MEG →';
        default: return 'VER MÁS SOBRE MÍ →';
    }
}

// Stats section text functions
export function getStatsExperience(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Experiencia';
        case 'en': return 'Experience';
        case 'no': return 'Erfaring';
        default: return 'Experiencia';
    }
}

export function getStatsYears(locale: Locale): string {
    switch (locale) {
        case 'es': return '3 años';
        case 'en': return '3 years';
        case 'no': return '3 år';
        default: return '3 años';
    }
}

export function getStatsLocation(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Ubicación';
        case 'en': return 'Location';
        case 'no': return 'Lokasjon';
        default: return 'Ubicación';
    }
}

export function getStatsStatus(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Estado';
        case 'en': return 'Status';
        case 'no': return 'Status';
        default: return 'Estado';
    }
}

export function getStatsAvailable(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Disponible';
        case 'en': return 'Available';
        case 'no': return 'Tilgjengelig';
        default: return 'Disponible';
    }
}

// Specialties section text functions
export function getSpecialtiesTitle(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Especialidades';
        case 'en': return 'Specialties';
        case 'no': return 'Spesialiteter';
        default: return 'Especialidades';
    }
}

export function getSpecialtyAccessibility(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Accessibility';
        case 'en': return 'Accessibility';
        case 'no': return 'Tilgjengelighet';
        default: return 'Accessibility';
    }
}

export function getSpecialtyPerformance(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Performance';
        case 'en': return 'Performance';
        case 'no': return 'Ytelse';
        default: return 'Performance';
    }
}

export function getSpecialtyDeveloperExperience(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Developer Experience';
        case 'en': return 'Developer Experience';
        case 'no': return 'Utvikleropplevelse';
        default: return 'Developer Experience';
    }
}

export function getSpecialtyUIUX(locale: Locale): string {
    switch (locale) {
        case 'es': return 'UI/UX Design';
        case 'en': return 'UI/UX Design';
        case 'no': return 'UI/UX Design';
        default: return 'UI/UX Design';
    }
}

// Site metadata functions
export function getSiteTitle(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Allison Peña';
        case 'en': return 'Allison Peña';
        case 'no': return 'Allison Peña';
        default: return 'Allison Peña';
    }
}

export function getSiteSubtitle(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Full-stack web developer';
        case 'en': return 'Full-stack web developer';
        case 'no': return 'Fullstack webutvikler';
        default: return 'Full-stack web developer';
    }
}

export function getSiteDescription(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Portfolio personal de Allison Peña, desarrolladora full-stack especializada en React, TypeScript y experiencias web accesibles.';
        case 'en': return 'Personal portfolio of Allison Peña, full-stack developer specialized in React, TypeScript and accessible web experiences.';
        case 'no': return 'Personlig portefølje til Allison Peña, fullstack-utvikler spesialisert på React, TypeScript og tilgjengelige webopplevelser.';
        default: return 'Portfolio personal de Allison Peña, desarrolladora full-stack especializada en React, TypeScript y experiencias web accesibles.';
    }
}

// Loading text function
export function getLoadingText(locale: Locale): string {
    switch (locale) {
        case 'es': return 'CARGANDO...';
        case 'en': return 'LOADING...';
        case 'no': return 'LASTER...';
        default: return 'CARGANDO...';
    }
}

// Hero section text functions
export function getHeroHeading(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Hola, soy Allison Bienvenido a mi sitio';
        case 'en': return 'Hello, I\'m Allison Welcome to my site';
        case 'no': return 'Hei, jeg er Allison Velkommen til min nettside';
        default: return 'Hola, soy Allison Bienvenido a mi sitio';
    }
}

export function getHeroDescription(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Me gusta crear sitios web que funcionen bien y sean fáciles de usar. Trabajo principalmente con React y TypeScript.';
        case 'en': return 'I love creating websites that work well and are easy to use. I work primarily with React and TypeScript.';
        case 'no': return 'Jeg elsker å lage nettsteder som fungerer godt og er enkle å bruke. Jeg jobber hovedsakelig med React og TypeScript.';
        default: return 'Me gusta crear sitios web que funcionen bien y sean fáciles de usar. Trabajo principalmente con React y TypeScript.';
    }
}

export function getHeroProjectsButton(locale: Locale): string {
    switch (locale) {
        case 'es': return 'Ver mis proyectos';
        case 'en': return 'View my projects';
        case 'no': return 'Se prosjektene mine';
        default: return 'Ver mis proyectos';
    }
}