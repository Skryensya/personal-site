export const languages = {
    es: 'Español',
    en: 'English',
    no: 'Norsk'
} as const;

export const defaultLang = 'es' as const;
export const supportedLanguages = Object.keys(languages) as Array<keyof typeof languages>;

export const ui = {
    es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.projects': 'Proyectos',
        'nav.showcase': 'Showcase',
        'nav.cv': 'CV',
        'nav.about': 'Acerca',

        // Home page sections
        'home.technologies': 'Tecnologías',
        'home.about': 'About',
        'home.hello': '¡Hola!',
        'home.featuredProjects': 'Proyectos Destacados',

        // Bio content
        'home.bio.intro':
            'Soy Allison, full-stack developer apasionada por crear experiencias web brutalmente simples pero funcionalmente complejas. Me encanta resolver problemas técnicos complejos y convertir ideas en productos digitales que realmente funcionen.',
        'home.bio.experience':
            'Con 3 años de experiencia en desarrollo web, me especializo en accessibility, performance, developer experience y UI/UX. Actualmente disponible para nuevos proyectos y colaboraciones desde Santiago, Chile.',

        // Badges
        'home.badge.problemSolver': 'PROBLEM SOLVER',
        'home.badge.cleanCode': 'CLEAN CODE',
        'home.badge.userFocused': 'USER FOCUSED',

        // Call to action
        'home.seeMore': 'VER MÁS SOBRE MÍ →',
        'home.heroProjectsButton': 'Ver mis proyectos',
        'home.aboutButton': 'Conoce más sobre mí',
        'home.cvButton': 'Ver mi currículum',

        // Stats
        'home.stats.experience': 'Experiencia',
        'home.stats.years': '3 años',
        'home.stats.location': 'Ubicación',
        'home.stats.status': 'Estado',
        'home.stats.available': 'Disponible',

        // Specialties
        'home.specialties': 'Especialidades',
        'home.specialties.accessibility': 'Accessibility',
        'home.specialties.performance': 'Performance',
        'home.specialties.dx': 'Developer Experience',
        'home.specialties.uiux': 'UI/UX Design',

        // Hero section
        'hero.heading': 'Hola, soy Allison Bienvenido a mi sitio',
        'hero.description': 'Me gusta crear sitios web que funcionen bien y sean fáciles de usar. Trabajo principalmente con React y TypeScript.',

        // About section redesign
        'about.subtitle': 'Desarrolladora full-stack con experiencia en crear productos digitales accesibles y funcionales',
        'about.description':
            'Me apasiona resolver problemas complejos y convertir ideas en experiencias web que realmente funcionen. Con base en Santiago, Chile, trabajo con tecnologías modernas para crear soluciones que priorizan la experiencia del usuario y la accesibilidad.',
        'about.keyFeature1': 'Código limpio y mantenible',
        'about.keyFeature2': 'Experiencias accesibles para todos',
        'about.keyFeature3': 'Performance optimizada',
        'about.tldr.title': 'Resumen Profesional',
        'about.tldr.description': 'Desarrolladora full-stack con 3+ años de experiencia especializada en React, TypeScript y Node.js. Enfocada en crear experiencias web accesibles, optimizadas y funcionalmente complejas. Expertise en performance optimization, developer experience y UI/UX design.',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Portfolio personal de Allison Peña, desarrolladora full-stack especializada en React, TypeScript y experiencias web accesibles.',

        // UI text
        'ui.loading': 'CARGANDO...',
        'ui.print': 'IMPRIMIR',
        'ui.backToHome': 'VOLVER AL INICIO',
        
        // CV page
        'cv.title': 'Currículum Vitae',
        'cv.contact': 'Contacto',
        'cv.email': 'allisonpena@email.com',
        'cv.phone': '+56 9 1234 5678',
        'cv.location': 'Santiago, Chile',
        'cv.website': 'allisonpena.dev',
        'cv.social.linkedin': 'linkedin.com/in/skryensya',
        'cv.social.twitter': '@allisonpena_dev',
        'cv.social.instagram': '@allisonpena',
        'cv.experience.title': 'Experiencia',
        'cv.projects.title': 'Proyectos Destacados',
        'cv.skills.title': 'Habilidades Técnicas',
        'cv.skills.frontend': 'Frontend',
        'cv.skills.backend': 'Backend',
        'cv.skills.tools': 'Herramientas',
        'cv.education.title': 'Educación',
        'cv.languages.title': 'Idiomas',
        'cv.languages.spanish': 'Español (Nativo)',
        'cv.languages.english': 'Inglés (Avanzado)',
        'cv.languages.norwegian': 'Noruego (Intermedio)'
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.showcase': 'Showcase',
        'nav.cv': 'CV',
        'nav.about': 'About',

        // Home page sections
        'home.technologies': 'Technologies',
        'home.about': 'About',
        'home.hello': 'Hello!',
        'home.featuredProjects': 'Featured Projects',

        // Bio content
        'home.bio.intro':
            "I'm Allison, a full-stack developer passionate about creating brutally simple yet functionally complex web experiences. I love solving complex technical problems and turning ideas into digital products that actually work.",
        'home.bio.experience':
            'With 3 years of experience in web development, I specialize in accessibility, performance, developer experience, and UI/UX. Currently available for new projects and collaborations from Santiago, Chile.',

        // Badges
        'home.badge.problemSolver': 'PROBLEM SOLVER',
        'home.badge.cleanCode': 'CLEAN CODE',
        'home.badge.userFocused': 'USER FOCUSED',

        // Call to action
        'home.seeMore': 'SEE MORE ABOUT ME →',
        'home.heroProjectsButton': 'View my projects',
        'home.aboutButton': 'Learn more about me',
        'home.cvButton': 'View my CV',

        // Stats
        'home.stats.experience': 'Experience',
        'home.stats.years': '3 years',
        'home.stats.location': 'Location',
        'home.stats.status': 'Status',
        'home.stats.available': 'Available',

        // Specialties
        'home.specialties': 'Specialties',
        'home.specialties.accessibility': 'Accessibility',
        'home.specialties.performance': 'Performance',
        'home.specialties.dx': 'Developer Experience',
        'home.specialties.uiux': 'UI/UX Design',

        // Hero section
        'hero.heading': "Hello, I'm Allison Welcome to my site",
        'hero.description': 'I love creating websites that work well and are easy to use. I work primarily with React and TypeScript.',

        // About section redesign
        'about.subtitle': 'Full-stack developer with experience creating accessible and functional digital products',
        'about.description':
            "I'm passionate about solving complex problems and turning ideas into web experiences that actually work. Based in Santiago, Chile, I work with modern technologies to create solutions that prioritize user experience and accessibility.",
        'about.keyFeature1': 'Clean and maintainable code',
        'about.keyFeature2': 'Accessible experiences for everyone',
        'about.keyFeature3': 'Optimized performance',
        'about.tldr.title': 'Professional Summary',
        'about.tldr.description': 'Full-stack developer with 3+ years of experience specialized in React, TypeScript and Node.js. Focused on creating accessible, optimized and functionally complex web experiences. Expert in performance optimization, developer experience and UI/UX design.',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Personal portfolio of Allison Peña, full-stack developer specialized in React, TypeScript and accessible web experiences.',

        // UI text
        'ui.loading': 'LOADING...',
        'ui.print': 'PRINT',
        'ui.backToHome': 'BACK TO HOME',
        
        // CV page
        'cv.title': 'Curriculum Vitae',
        'cv.contact': 'Contact',
        'cv.email': 'allisonpena@email.com',
        'cv.phone': '+56 9 1234 5678',
        'cv.location': 'Santiago, Chile',
        'cv.website': 'allisonpena.dev',
        'cv.social.linkedin': 'linkedin.com/in/skryensya',
        'cv.social.twitter': '@allisonpena_dev',
        'cv.social.instagram': '@allisonpena',
        'cv.experience.title': 'Experience',
        'cv.projects.title': 'Featured Projects',
        'cv.skills.title': 'Technical Skills',
        'cv.skills.frontend': 'Frontend',
        'cv.skills.backend': 'Backend',
        'cv.skills.tools': 'Tools',
        'cv.education.title': 'Education',
        'cv.languages.title': 'Languages',
        'cv.languages.spanish': 'Spanish (Native)',
        'cv.languages.english': 'English (Advanced)',
        'cv.languages.norwegian': 'Norwegian (Intermediate)'
    },
    no: {
        // Navigation
        'nav.home': 'Hjem',
        'nav.projects': 'Prosjekter',
        'nav.showcase': 'Showcase',
        'nav.cv': 'CV',
        'nav.about': 'Om',

        // Home page sections
        'home.technologies': 'Teknologier',
        'home.about': 'Om',
        'home.hello': 'Hei!',
        'home.featuredProjects': 'Utvalgte Prosjekter',

        // Bio content
        'home.bio.intro':
            'Jeg er Allison, en fullstack-utvikler som brenner for å skape brutalt enkle, men funksjonelt komplekse webopplevelser. Jeg elsker å løse komplekse tekniske problemer og gjøre ideer om til digitale produkter som faktisk fungerer.',
        'home.bio.experience':
            'Med 3 års erfaring innen webutvikling spesialiserer jeg meg på tilgjengelighet, ytelse, utvikleropplevelse og UI/UX. For tiden tilgjengelig for nye prosjekter og samarbeid fra Santiago, Chile.',

        // Badges
        'home.badge.problemSolver': 'PROBLEMLØSER',
        'home.badge.cleanCode': 'REN KODE',
        'home.badge.userFocused': 'BRUKERFOKUSERT',

        // Call to action
        'home.seeMore': 'SE MER OM MEG →',
        'home.heroProjectsButton': 'Se prosjektene mine',
        'home.aboutButton': 'Lær mer om meg',
        'home.cvButton': 'Se CV-en min',

        // Stats
        'home.stats.experience': 'Erfaring',
        'home.stats.years': '3 år',
        'home.stats.location': 'Lokasjon',
        'home.stats.status': 'Status',
        'home.stats.available': 'Tilgjengelig',

        // Specialties
        'home.specialties': 'Spesialiteter',
        'home.specialties.accessibility': 'Tilgjengelighet',
        'home.specialties.performance': 'Ytelse',
        'home.specialties.dx': 'Utvikleropplevelse',
        'home.specialties.uiux': 'UI/UX Design',

        // Hero section
        'hero.heading': 'Hei, jeg er Allison Velkommen til min nettside',
        'hero.description': 'Jeg elsker å lage nettsteder som fungerer godt og er enkle å bruke. Jeg jobber hovedsakelig med React og TypeScript.',

        // About section redesign
        'about.subtitle': 'Fullstack-utvikler med erfaring i å lage tilgjengelige og funksjonelle digitale produkter',
        'about.description':
            'Jeg brenner for å løse komplekse problemer og gjøre ideer om til webopplevelser som faktisk fungerer. Basert i Santiago, Chile, jobber jeg med moderne teknologier for å skape løsninger som prioriterer brukeropplevelse og tilgjengelighet.',
        'about.keyFeature1': 'Ren og vedlikeholdbar kode',
        'about.keyFeature2': 'Tilgjengelige opplevelser for alle',
        'about.keyFeature3': 'Optimalisert ytelse',
        'about.tldr.title': 'Profesjonelt Sammendrag',
        'about.tldr.description': 'Fullstack-utvikler med 3+ års erfaring spesialisert på React, TypeScript og Node.js. Fokusert på å skape tilgjengelige, optimaliserte og funksjonelt komplekse webopplevelser. Ekspert på ytelsesoptimalisering, utvikleropplevelse og UI/UX design.',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Fullstack webutvikler',
        'site.description': 'Personlig portefølje til Allison Peña, fullstack-utvikler spesialisert på React, TypeScript og tilgjengelige webopplevelser.',

        // UI text
        'ui.loading': 'LASTER...',
        'ui.print': 'SKRIV UT',
        'ui.backToHome': 'TILBAKE TIL HJEMMESIDE',
        
        // CV page
        'cv.title': 'Curriculum Vitae',
        'cv.contact': 'Kontakt',
        'cv.email': 'allisonpena@email.com',
        'cv.phone': '+56 9 1234 5678',
        'cv.location': 'Santiago, Chile',
        'cv.website': 'allisonpena.dev',
        'cv.social.linkedin': 'linkedin.com/in/skryensya',
        'cv.social.twitter': '@allisonpena_dev',
        'cv.social.instagram': '@allisonpena',
        'cv.experience.title': 'Erfaring',
        'cv.projects.title': 'Utvalgte Prosjekter',
        'cv.skills.title': 'Tekniske Ferdigheter',
        'cv.skills.frontend': 'Frontend',
        'cv.skills.backend': 'Backend',
        'cv.skills.tools': 'Verktøy',
        'cv.education.title': 'Utdanning',
        'cv.languages.title': 'Språk',
        'cv.languages.spanish': 'Spansk (Morsmål)',
        'cv.languages.english': 'Engelsk (Avansert)',
        'cv.languages.norwegian': 'Norsk (Middels)'
    }
} as const;

export type UIKeys = keyof (typeof ui)[typeof defaultLang];
export type Language = keyof typeof ui;
