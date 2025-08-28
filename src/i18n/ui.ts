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
        'nav.cv': 'Currículum',
        'nav.about': 'Sobre mí',

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
        'about.tldr.title': 'Sobre mí',
        'about.tldr.description': 'Desarrolladora full-stack con 3+ años de experiencia especializada en React, TypeScript y Node.js. Enfocada en crear experiencias web accesibles, optimizadas y funcionalmente complejas. Expertise en performance optimization, developer experience y UI/UX design.',
        'about.specialties.title': 'ESPECIALIDADES',
        'about.stack.title': 'STACK PRINCIPAL',
        'about.collaboration.title': '¿INTERESADO EN COLABORAR?',
        'about.collaboration.subtitle': 'Disponible para proyectos y oportunidades',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Portfolio personal de Allison Peña, desarrolladora full-stack especializada en React, TypeScript y experiencias web accesibles.',

        // UI text
        'ui.loading': 'Cargando...',
        
        // Theme names (forced Spanish for all languages)
        'theme.gameboy': 'GAME BOY',
        'theme.dos': 'MS-DOS', 
        'theme.c64': 'COMMODORE 64',
        'theme.caution': 'PRECAUCIÓN',
        'theme.windows95': 'Windows 95', 
        'theme.nickelodeon': 'Nickelodeon',
        'theme.msnmessenger': 'MSN Messenger',
        'theme.shrek': 'Shrek',
        'theme.spiderman': 'Spider-Man',
        'theme.matrix': 'Matrix',
        
        // Mode names in Spanish
        'mode.light': 'Claro',
        'mode.dark': 'Oscuro',
        'mode.system': 'Sistema',
        'mode.current': 'Modo actual:',
        'mode.toggle': 'Hacer clic para alternar',
        'ui.print': 'IMPRIMIR',
        'ui.backToHome': 'VOLVER AL INICIO',
        
        // Keyboard shortcuts
        'ui.shortcuts.themePrev': '[ - Tema anterior',
        'ui.shortcuts.themeNext': '] - Tema siguiente',
        
        // 404 page
        '404.title': 'Página No Encontrada - Error 404',
        '404.heading': 'Página no encontrada',
        '404.description': 'Ups, esta página no existe. ¡Pero hay muchas cosas geniales que ver por aquí!',
        '404.home': 'Ir al inicio',
        '404.projects': 'Ver proyectos',
        '404.goBack': 'Volver atrás',
        
        // Showcase page
        'showcase.title': 'Showcase de Componentes',
        'showcase.hero.title': 'Componentes UI',
        'showcase.hero.subtitle': 'Una colección de componentes reutilizables construidos con React y Astro, siguiendo principios de diseño brutalist y accesibilidad.',
        'showcase.available': 'Componentes disponibles',
        'showcase.table.component': 'Componente',
        'showcase.table.technologies': 'Tecnologías',
        'showcase.button.viewComponents': 'Ver componentes',
        'showcase.button.myProjects': 'Mis proyectos',
        'showcase.button.view': 'Ver',
        
        // CV page
        'cv.title': 'Currículum Vitae',
        'cv.contact': 'Contacto',
        'cv.contact.location': 'Ubicación',
        'cv.contact.email': 'Email',
        'cv.contact.phone': 'Teléfono',
        'cv.contact.linkedin': 'LinkedIn',
        'cv.fullName': 'ALLISON JOSUÉ PEÑA BARRIOS',
        'cv.jobTitle': 'Desarrollador Full-Stack',
        'cv.email.value': 'Allison.jpb+cv@gmail.com',
        'cv.phone.value': '+56 9 9812 0052',
        'cv.location.value': 'Santiago, Chile',
        'cv.linkedin.value': '/in/skryensya',
        'cv.website.title': 'Sitio Web',
        'cv.website.value': 'Skryensya.dev',
        'cv.languages.title': 'Idiomas',
        'cv.languages.spanish': 'Español',
        'cv.languages.spanish.level': 'NATIVO',
        'cv.languages.english': 'Inglés',
        'cv.languages.english.level': 'C1 - AVANZADO',
        'cv.languages.norwegian': 'Noruego',
        'cv.languages.norwegian.level': 'A1 - BÁSICO',
        'cv.certificates.title': 'Certificados',
        'cv.references.title': 'Referencias',
        'cv.about.title': 'Acerca de mí',
        'cv.about.content': 'Transformo ideas en experiencias digitales que realmente funcionan. Mi especialidad es crear interfaces accesibles que miles de usuarios utilizan diariamente, aplicando las mejores prácticas de desarrollo frontend con un enfoque obsesivo en la usabilidad.',
        'cv.experience.title': 'EXPERIENCIA PROFESIONAL',
        'cv.experience.company': 'Asimov Consultores',
        'cv.experience.position': 'Desarrollador Full-Stack',
        'cv.experience.period': '2022 - Presente',
        'cv.experience.description': 'Desarrollo soluciones digitales completas, transformando conceptos en código funcional. He sido colaborador clave en proyectos que mejoran la identidad digital y experiencia de usuario de nuestros clientes, implementando interfaces y sistemas backend efectivos en todo el ciclo de desarrollo.',
        'cv.projects.title': 'Proyectos Destacados',
        'cv.references.position': 'Senior Developer',
        'cv.references.jorge.name': 'Jorge Vega',
        'cv.references.jorge.email': 'jorgeivegab+rf@gmail.com',
        'cv.references.elias.name': 'Elias Leyton', 
        'cv.references.elias.email': 'elias.leyton+rf@gmail.com',
        'cv.certificate.wai01x.title': 'WAI0.1x',
        'cv.certificate.wai01x.description': 'Introduction to Web Accessibility',
        
        // Norwegian disclaimer banner
        'disclaimer.norwegian.compact': 'Estoy aprendiendo noruego como objetivo personal, pero para una comunicación más clara, no dudes en contactarme en inglés o español.',
        
        // Sidebar content
        'sidebar.toc': 'Contenido',
        'sidebar.readingGuide.title': 'Guía de lectura',
        'sidebar.readingGuide.activate': 'Activar guía',
        
        // Skip to content
        'nav.skipToContent': 'Saltar al contenido principal',
        'nav.skipToContentShort': 'Saltar a contenido',
        
        // Pagination
        'pagination.page': 'Página',
        'pagination.of': 'de',
        'pagination.previous': 'Anterior',
        'pagination.next': 'Siguiente'
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.showcase': 'Showcase',
        'nav.cv': 'Resume',
        'nav.about': 'About me',

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
        'about.specialties.title': 'SPECIALTIES',
        'about.stack.title': 'MAIN STACK',
        'about.collaboration.title': 'INTERESTED IN COLLABORATING?',
        'about.collaboration.subtitle': 'Available for projects and opportunities',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Personal portfolio of Allison Peña, full-stack developer specialized in React, TypeScript and accessible web experiences.',

        // UI text
        'ui.loading': 'Loading...',
        
        // Theme names (forced Spanish for all languages)
        'theme.gameboy': 'GAME BOY',
        'theme.dos': 'MS-DOS', 
        'theme.c64': 'COMMODORE 64',
        'theme.caution': 'PRECAUCIÓN',
        'theme.windows95': 'Windows 95', 
        'theme.nickelodeon': 'Nickelodeon',
        'theme.msnmessenger': 'MSN Messenger',
        'theme.shrek': 'Shrek',
        'theme.spiderman': 'Spider-Man',
        'theme.matrix': 'Matrix',
        
        // Mode names in English
        'mode.light': 'Light',
        'mode.dark': 'Dark',
        'mode.system': 'System',
        'mode.current': 'Current mode:',
        'mode.toggle': 'Click to toggle',
        'ui.print': 'PRINT',
        'ui.backToHome': 'BACK TO HOME',
        
        // Keyboard shortcuts
        'ui.shortcuts.themePrev': '[ - Previous theme',
        'ui.shortcuts.themeNext': '] - Next theme',
        
        // 404 page
        '404.title': 'Page Not Found - Error 404',
        '404.heading': 'Page not found',
        '404.description': "Oops, this page doesn't exist. But there's plenty of cool stuff to explore around here!",
        '404.home': 'Go to home',
        '404.projects': 'View projects',
        '404.goBack': 'Go back',
        
        // Showcase page
        'showcase.title': 'Component Showcase',
        'showcase.hero.title': 'UI Components',
        'showcase.hero.subtitle': 'A collection of reusable components built with React and Astro, following brutalist design principles and accessibility standards.',
        'showcase.available': 'Available components',
        'showcase.table.component': 'Component',
        'showcase.table.technologies': 'Technologies',
        'showcase.button.viewComponents': 'View components',
        'showcase.button.myProjects': 'My projects',
        'showcase.button.view': 'View',
        
        // CV page
        'cv.title': 'Curriculum Vitae',
        'cv.contact': 'Contact',
        'cv.contact.location': 'Location',
        'cv.contact.email': 'Email',
        'cv.contact.phone': 'Phone',
        'cv.contact.linkedin': 'LinkedIn',
        'cv.fullName': 'ALLISON JOSUÉ PEÑA BARRIOS',
        'cv.jobTitle': 'Full-Stack Developer',
        'cv.email.value': 'Allison.jpb+cv@gmail.com',
        'cv.phone.value': '+56 9 9812 0052',
        'cv.location.value': 'Santiago, Chile',
        'cv.linkedin.value': '/in/skryensya',
        'cv.website.title': 'Website',
        'cv.website.value': 'Skryensya.dev',
        'cv.languages.title': 'Languages',
        'cv.languages.spanish': 'Spanish',
        'cv.languages.spanish.level': 'NATIVE',
        'cv.languages.english': 'English',
        'cv.languages.english.level': 'C1 - ADVANCED',
        'cv.languages.norwegian': 'Norwegian',
        'cv.languages.norwegian.level': 'A1 - BASIC',
        'cv.certificates.title': 'Certificates',
        'cv.references.title': 'References',
        'cv.about.title': 'About me',
        'cv.about.content': 'I transform ideas into digital experiences that actually work. My specialty is creating accessible interfaces that thousands of users interact with daily, applying frontend development best practices with an obsessive focus on usability.',
        'cv.experience.title': 'PROFESSIONAL EXPERIENCE',
        'cv.experience.company': 'Asimov Consultores',
        'cv.experience.position': 'Full-Stack Developer',
        'cv.experience.period': '2022 - Present',
        'cv.experience.description': 'I develop complete digital solutions, transforming concepts into functional code. I have been a key collaborator in projects that improve digital identity and user experience for our clients, implementing interfaces and backend systems effectively throughout the development cycle.',
        'cv.projects.title': 'Featured Projects',
        'cv.references.position': 'Senior Developer',
        'cv.references.jorge.name': 'Jorge Vega',
        'cv.references.jorge.email': 'jorgeivegab+rf@gmail.com',
        'cv.references.elias.name': 'Elias Leyton', 
        'cv.references.elias.email': 'elias.leyton+rf@gmail.com',
        'cv.certificate.wai01x.title': 'WAI0.1x',
        'cv.certificate.wai01x.description': 'Introduction to Web Accessibility',
        
        // Norwegian disclaimer banner
        'disclaimer.norwegian.compact': 'I am learning Norwegian as a personal goal, but for clearer communication, feel free to contact me in English or Spanish.',
        
        // Sidebar content
        'sidebar.toc': 'Contents',
        'sidebar.readingGuide.title': 'Reading guide',
        'sidebar.readingGuide.activate': 'Activate guide',
        
        // Skip to content
        'nav.skipToContent': 'Skip to main content',
        'nav.skipToContentShort': 'Skip to content',
        
        // Pagination
        'pagination.page': 'Page',
        'pagination.of': 'of',
        'pagination.previous': 'Previous',
        'pagination.next': 'Next'
    },
    no: {
        // Navigation
        'nav.home': 'Hjem',
        'nav.projects': 'Prosjekter',
        'nav.showcase': 'Showcase',
        'nav.cv': 'Curriculum Vitae',
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
        'about.specialties.title': 'SPESIALITETER',
        'about.stack.title': 'HOVEDTEKNOLOGIER',
        'about.collaboration.title': 'INTERESSERT I SAMARBEID?',
        'about.collaboration.subtitle': 'Tilgjengelig for prosjekter og muligheter',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Fullstack webutvikler',
        'site.description': 'Personlig portefølje til Allison Peña, fullstack-utvikler spesialisert på React, TypeScript og tilgjengelige webopplevelser.',

        // UI text
        'ui.loading': 'Laster...',
        
        // Theme names (forced Spanish for all languages)
        'theme.gameboy': 'GAME BOY',
        'theme.dos': 'MS-DOS', 
        'theme.c64': 'COMMODORE 64',
        'theme.caution': 'PRECAUCIÓN',
        'theme.windows95': 'Windows 95', 
        'theme.nickelodeon': 'Nickelodeon',
        'theme.msnmessenger': 'MSN Messenger',
        'theme.shrek': 'Shrek',
        'theme.spiderman': 'Spider-Man',
        'theme.matrix': 'Matrix',
        
        // Mode names in Norwegian
        'mode.light': 'Lys',
        'mode.dark': 'Mørk',
        'mode.system': 'System',
        'mode.current': 'Nåværende modus:',
        'mode.toggle': 'Klikk for å veksle',
        'ui.print': 'SKRIV UT',
        'ui.backToHome': 'TILBAKE TIL HJEMMESIDE',
        
        // Keyboard shortcuts
        'ui.shortcuts.themePrev': '[ - Forrige tema',
        'ui.shortcuts.themeNext': '] - Neste tema',
        
        // 404 page
        '404.title': 'Siden ikke funnet - Feil 404',
        '404.heading': 'Siden ikke funnet',
        '404.description': 'Oops, denne siden eksisterer ikke. Men det er masse kult å utforske her!',
        '404.home': 'Gå til hjemmeside',
        '404.projects': 'Se prosjekter',
        '404.goBack': 'Gå tilbake',
        
        // Showcase page
        'showcase.title': 'Komponentutstilling',
        'showcase.hero.title': 'UI-komponenter',
        'showcase.hero.subtitle': 'En samling gjenbrukbare komponenter bygget med React og Astro, som følger brutalistiske designprinsipper og tilgjengelighetsstandarder.',
        'showcase.available': 'Tilgjengelige komponenter',
        'showcase.table.component': 'Komponent',
        'showcase.table.technologies': 'Teknologier',
        'showcase.button.viewComponents': 'Se komponenter',
        'showcase.button.myProjects': 'Mine prosjekter',
        'showcase.button.view': 'Se',
        
        // CV page
        'cv.title': 'Curriculum Vitae',
        'cv.contact': 'Kontakt',
        'cv.contact.location': 'Plassering',
        'cv.contact.email': 'E-post',
        'cv.contact.phone': 'Telefon',
        'cv.contact.linkedin': 'LinkedIn',
        'cv.fullName': 'ALLISON JOSUÉ PEÑA BARRIOS',
        'cv.jobTitle': 'Full-Stack Utvikler',
        'cv.email.value': 'Allison.jpb+cv@gmail.com',
        'cv.phone.value': '+56 9 9812 0052',
        'cv.location.value': 'Santiago, Chile',
        'cv.linkedin.value': '/in/skryensya',
        'cv.website.title': 'Nettsted',
        'cv.website.value': 'Skryensya.dev',
        'cv.languages.title': 'Språk',
        'cv.languages.spanish': 'Spansk',
        'cv.languages.spanish.level': 'MORSMÅL',
        'cv.languages.english': 'Engelsk',
        'cv.languages.english.level': 'C1 - AVANSERT',
        'cv.languages.norwegian': 'Norsk',
        'cv.languages.norwegian.level': 'A1 - GRUNNLEGGENDE',
        'cv.certificates.title': 'Sertifikater',
        'cv.references.title': 'Referanser',
        'cv.about.title': 'Om meg',
        'cv.about.content': 'Jeg transformerer ideer til digitale opplevelser som faktisk fungerer. Min spesialitet er å skape tilgjengelige grensesnitt som tusenvis av brukere samhandler med daglig, og anvender beste praksis for frontend-utvikling med et obsessivt fokus på brukervennlighet.',
        'cv.experience.title': 'PROFESJONELL ERFARING',
        'cv.experience.company': 'Asimov Consultores',
        'cv.experience.position': 'Full-Stack Utvikler',
        'cv.experience.period': '2022 - I dag',
        'cv.experience.description': 'Jeg utvikler komplette digitale løsninger, og transformerer konsepter til funksjonell kode. Jeg har vært en nøkkelsamarbeidspartner i prosjekter som forbedrer digital identitet og brukeropplevelse for våre klienter, implementerer grensesnitt og backend-systemer effektivt gjennom hele utviklingssyklusen.',
        'cv.projects.title': 'Utvalgte Prosjekter',
        'cv.references.position': 'Senior Utvikler',
        'cv.references.jorge.name': 'Jorge Vega',
        'cv.references.jorge.email': 'jorgeivegab+rf@gmail.com',
        'cv.references.elias.name': 'Elias Leyton', 
        'cv.references.elias.email': 'elias.leyton+rf@gmail.com',
        'cv.certificate.wai01x.title': 'WAI0.1x',
        'cv.certificate.wai01x.description': 'Innføring i webtilgjengelighet',
        
        // Norwegian disclaimer banner
        'disclaimer.norwegian.compact': 'Jeg lærer norsk som et personlig mål, men for tydeligere kommunikasjon, kontakt meg gjerne på engelsk eller spansk.',
        
        // Sidebar content
        'sidebar.toc': 'Innhold',
        'sidebar.readingGuide.title': 'Leseguide',
        'sidebar.readingGuide.activate': 'Aktiver guide',
        
        // Skip to content
        'nav.skipToContent': 'Hopp til hovedinnhold',
        'nav.skipToContentShort': 'Hopp til innhold',
        
        // Pagination
        'pagination.page': 'Side',
        'pagination.of': 'av',
        'pagination.previous': 'Forrige',
        'pagination.next': 'Neste'
    }
} as const;

export type UIKeys = keyof (typeof ui)[typeof defaultLang];
export type Language = keyof typeof ui;
