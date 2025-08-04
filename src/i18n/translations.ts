export type TranslationKey = 
    | 'nav.home'
    | 'nav.projects'
    | 'nav.blog'
    | 'nav.about'
    | 'nav.contact'
    | 'home.technologies'
    | 'home.about'
    | 'home.hello'
    | 'home.bio.intro'
    | 'home.bio.experience'
    | 'home.badge.problemSolver'
    | 'home.badge.cleanCode'
    | 'home.badge.userFocused'
    | 'home.seeMore'
    | 'home.featuredProjects'
    | 'home.stats.experience'
    | 'home.stats.years'
    | 'home.stats.location'
    | 'home.stats.status'
    | 'home.stats.available'
    | 'home.specialties'
    | 'home.specialties.accessibility'
    | 'home.specialties.performance'
    | 'home.specialties.dx'
    | 'home.specialties.uiux'
    | 'site.title'
    | 'site.subtitle'
    | 'site.description';

export const translations = {
    es: {
        'nav.home': 'Inicio',
        'nav.projects': 'Proyectos',
        'nav.blog': 'Blog',
        'nav.about': 'Acerca',
        'nav.contact': 'Contacto',
        'home.technologies': 'Tecnologías',
        'home.about': 'About',
        'home.hello': '¡Hola!',
        'home.bio.intro': 'Soy Allison, full-stack developer apasionada por crear experiencias web brutalmente simples pero funcionalmente complejas. Me encanta resolver problemas técnicos complejos y convertir ideas en productos digitales que realmente funcionen.',
        'home.bio.experience': 'Con 3 años de experiencia en desarrollo web, me especializo en accessibility, performance, developer experience y UI/UX. Actualmente disponible para nuevos proyectos y colaboraciones desde Santiago, Chile.',
        'home.badge.problemSolver': 'PROBLEM SOLVER',
        'home.badge.cleanCode': 'CLEAN CODE',
        'home.badge.userFocused': 'USER FOCUSED',
        'home.seeMore': 'VER MÁS SOBRE MÍ →',
        'home.featuredProjects': 'Proyectos Destacados',
        'home.stats.experience': 'Experiencia',
        'home.stats.years': '3 años',
        'home.stats.location': 'Ubicación',
        'home.stats.status': 'Estado',
        'home.stats.available': 'Disponible',
        'home.specialties': 'Especialidades',
        'home.specialties.accessibility': 'Accessibility',
        'home.specialties.performance': 'Performance',
        'home.specialties.dx': 'Developer Experience',
        'home.specialties.uiux': 'UI/UX Design',
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com'
    },
    en: {
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.blog': 'Blog',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'home.technologies': 'Technologies',
        'home.about': 'About',
        'home.hello': 'Hello!',
        'home.bio.intro': 'I\'m Allison, a full-stack developer passionate about creating brutally simple yet functionally complex web experiences. I love solving complex technical problems and turning ideas into digital products that actually work.',
        'home.bio.experience': 'With 3 years of experience in web development, I specialize in accessibility, performance, developer experience, and UI/UX. Currently available for new projects and collaborations from Santiago, Chile.',
        'home.badge.problemSolver': 'PROBLEM SOLVER',
        'home.badge.cleanCode': 'CLEAN CODE',
        'home.badge.userFocused': 'USER FOCUSED',
        'home.seeMore': 'SEE MORE ABOUT ME →',
        'home.featuredProjects': 'Featured Projects',
        'home.stats.experience': 'Experience',
        'home.stats.years': '3 years',
        'home.stats.location': 'Location',
        'home.stats.status': 'Status',
        'home.stats.available': 'Available',
        'home.specialties': 'Specialties',
        'home.specialties.accessibility': 'Accessibility',
        'home.specialties.performance': 'Performance',
        'home.specialties.dx': 'Developer Experience',
        'home.specialties.uiux': 'UI/UX Design',
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com'
    },
    no: {
        'nav.home': 'Hjem',
        'nav.projects': 'Prosjekter',
        'nav.blog': 'Blogg',
        'nav.about': 'Om',
        'nav.contact': 'Kontakt',
        'home.technologies': 'Teknologier',
        'home.about': 'Om',
        'home.hello': 'Hei!',
        'home.bio.intro': 'Jeg er Allison, en fullstack-utvikler som brenner for å skape brutalt enkle, men funksjonelt komplekse webopplevelser. Jeg elsker å løse komplekse tekniske problemer og gjøre ideer om til digitale produkter som faktisk fungerer.',
        'home.bio.experience': 'Med 3 års erfaring innen webutvikling spesialiserer jeg meg på tilgjengelighet, ytelse, utvikleropplevelse og UI/UX. For tiden tilgjengelig for nye prosjekter og samarbeid fra Santiago, Chile.',
        'home.badge.problemSolver': 'PROBLEMLØSER',
        'home.badge.cleanCode': 'REN KODE',
        'home.badge.userFocused': 'BRUKERFOKUSERT',
        'home.seeMore': 'SE MER OM MEG →',
        'home.featuredProjects': 'Utvalgte Prosjekter',
        'home.stats.experience': 'Erfaring',
        'home.stats.years': '3 år',
        'home.stats.location': 'Lokasjon',
        'home.stats.status': 'Status',
        'home.stats.available': 'Tilgjengelig',
        'home.specialties': 'Spesialiteter',
        'home.specialties.accessibility': 'Tilgjengelighet',
        'home.specialties.performance': 'Ytelse',
        'home.specialties.dx': 'Utvikleropplevelse',
        'home.specialties.uiux': 'UI/UX Design',
        'site.title': 'Allison Peña',
        'site.subtitle': 'Fullstack webutvikler',
        'site.description': 'Astro.js og Tailwind CSS tema for blogg og portefølje av justgoodui.com'
    }
} as const;

export function t(key: TranslationKey, locale: string = 'es'): string {
    const validLocale = locale in translations ? locale as keyof typeof translations : 'es';
    return translations[validLocale][key] || translations.es[key];
}