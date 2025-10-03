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
        'nav.menu': 'Menú',

        // Home page sections
        'home.technologies': 'Tecnologías',
        'home.about': 'About',
        'home.hello': '¡Hola!',
        'home.featuredProjects': 'Proyectos Destacados',

        // Bio content
        'home.bio.intro':
            'Soy Allison, full-stack developer apasionado por crear experiencias web brutalmente simples pero funcionalmente complejas. Me encanta resolver problemas técnicos complejos y convertir ideas en productos digitales que realmente funcionen.',
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
        'hero.cards.frontend.title': 'Frontend',
        'hero.cards.frontend.description': 'React, TypeScript, Astro',
        'hero.cards.backend.title': 'Backend',
        'hero.cards.backend.description': 'Node.js, Python, APIs',
        'hero.cards.design.title': 'Diseño',
        'hero.cards.design.description': 'UI/UX, Figma, Prototipado',

        // About section redesign
        'about.subtitle': 'Desarrollador full-stack con experiencia en crear productos digitales accesibles y funcionales',
        'about.description':
            'Me apasiona resolver problemas complejos y convertir ideas en experiencias web que realmente funcionen. Con base en Santiago, Chile, trabajo con tecnologías modernas para crear soluciones que priorizan la experiencia del usuario y la accesibilidad.',
        'about.keyFeature1': 'Código limpio y mantenible',
        'about.keyFeature2': 'Experiencias accesibles para todos',
        'about.keyFeature3': 'Performance optimizada',
        'about.title': 'Sobre mí',
        'about.tldr': 'Soy Allison, desarrollador frontend enfocado en el detalle, usabilidad y accesibilidad. Construyo experiencias hechas a mano con TypeScript, React y Tailwind, y busco entregar productos que se sientan pulidos, usables y cuidados.',
        'about.expanded': [
            'Durante los últimos tres años, he trabajado en una empresa consultora, contribuyendo a proyectos de gran escala como Kit Digital UC, el sistema de diseño que alimenta más de 100 sitios en la Pontificia Universidad Católica de Chile. Ese trabajo afianzó mis habilidades frontend, me dio experiencia profunda con sistemas de diseño, y me enseñó cómo adaptarme a desafíos diversos.',
            'Ahora, busco mayor responsabilidad: no solo programar, sino influir en la dirección del producto. Me atraen las startups o equipos pequeños donde pueda enfocarme en hacer el mejor producto posible.',
            'Mi enfoque: entender el problema primero. Si ya existe una solución, la adapto; si no, la construyo. Ahí es donde más me divierto. Valoro la precisión de píxeles, la accesibilidad y la discusión abierta, y prospero cuando me desafían.',
            'Me emociona la creciente capacidad de la web para alojar aplicaciones complejas y eficientes que rivalizan con el software de escritorio. Me inspira especialmente el movimiento local-first, que abre la puerta a experiencias más rápidas, resistentes y controladas por el usuario.',
            'Fuera del trabajo, estoy aprendiendo noruego por diversión, me encanta jugar ajedrez y me sumerjo en la exploración musical. Disfruto conectar con personas afines, ya sea para proyectos serios o solo buenas conversaciones.'
        ],
        'about.cta.message': 'Si algo de esto resuena contigo, escríbeme. Me encantaría charlar.',
        'about.cta.button': 'Conversemos',
        'about.specialties.title': 'ESPECIALIDADES',
        'about.stack.title': 'STACK PRINCIPAL',
        'about.collaboration.title': '¿INTERESADO EN COLABORAR?',
        'about.collaboration.subtitle': 'Disponible para proyectos y oportunidades',
        'about.viewMore.open': 'Ver más',
        'about.viewMore.close': 'Ver menos',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Portfolio personal de Allison Peña, desarrollador full-stack especializado en React, TypeScript y experiencias web accesibles.',

        // UI text
        'ui.loading': 'Cargando...',
        
        // Theme toast notifications
        'theme.toast.unlocked': '¡Has desbloqueado {count} temas adicionales!',
        'theme.toast.locked': 'Has ocultado los temas adicionales',
        'theme.toast.company': 'Hola equipo de {company}. He activado su tema para que se sientan como en casa.',
        
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
        
        // Skip to content
        'nav.skipToContent': 'Saltar al contenido principal',
        'nav.skipToContentShort': 'Saltar a contenido',
        
        // Pagination
        'pagination.page': 'Página',
        'pagination.of': 'de',
        'pagination.previous': 'Anterior',
        'pagination.next': 'Siguiente',

        // Footer
        'footer.navigation': 'Navegación',
        'footer.connect': 'Conectar',
        'footer.home': 'Inicio',
        'footer.projects': 'Proyectos',
        'footer.resume': 'Currículum',
        'footer.email': 'Email',
        'footer.accessibility': 'Declaración de Accesibilidad',
        'footer.copyright': 'Todos los derechos reservados',
        'footer.builtWith': 'Construido con',
        'footer.andCode': 'y código',
        'footer.info': 'Información',
        'footer.availableForProjects': 'Disponible para proyectos',
        'footer.sitemap': 'Sitemap',
        'footer.aspectRatio.title': 'Proporción de contraste',
        'footer.motion.label': 'Reducir movimiento',
        'footer.motion.activated': 'Activado',
        'footer.motion.deactivated': 'Desactivado',
        'footer.motion.detecting': 'detectando...',
        'footer.wcag.a.title': 'WCAG A - Mínimo',
        'footer.wcag.a.desc': 'Contraste 3:1 para elementos gráficos, iconos y componentes de interfaz',
        'footer.wcag.aa.title': 'WCAG AA - Estándar',
        'footer.wcag.aa.desc': 'Contraste 4.5:1 para texto normal y cumplimiento legal',
        'footer.wcag.aaa.title': 'WCAG AAA - Superior',
        'footer.wcag.aaa.desc': 'Contraste 7:1 para máxima accesibilidad y legibilidad',

        // Accessibility Statement
        'accessibility.title': 'Declaración de Accesibilidad',
        'accessibility.description': 'Compromiso con la accesibilidad web para todos los usuarios',
        'accessibility.commitment.title': 'Compromiso con la accesibilidad',
        'accessibility.commitment.content': 'Estoy comprometido a que mi sitio personal sea accesible para la mayor cantidad de personas posible, sin importar la tecnología que utilicen o sus capacidades. Mi objetivo es ofrecer una experiencia clara, funcional y disfrutable para todos.',
        'accessibility.standards.title': 'Estándares y guías',
        'accessibility.standards.content': 'Este sitio procura cumplir con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 en nivel AA, que definen cómo hacer que los contenidos digitales sean más accesibles para personas con discapacidad.',
        'accessibility.standards.wcag.text': 'WCAG',
        'accessibility.standards.wcag.url': 'https://www.w3.org/TR/WCAG22/',
        'accessibility.features.title': 'Mejora continua',
        'accessibility.features.items': [
          'La accesibilidad es un proceso en constante evolución. Reviso y actualizo de forma periódica el diseño, el código y los contenidos de este sitio para mantener e incrementar su nivel de accesibilidad.'
        ],
        'accessibility.feedback.title': 'Comentarios y contacto',
        'accessibility.feedback.content': 'Si encuentras alguna barrera de accesibilidad o tienes sugerencias de mejora, agradeceré tu retroalimentación.',
        'accessibility.feedback.contact': 'Puedes escribirme a: ',
        'accessibility.contrast.title': 'Contraste de colores',
        'accessibility.contrast.content': 'Este sitio utiliza un sistema de dos colores que se invierte entre temas claro y oscuro. El contraste se calcula dinámicamente para cumplir con los estándares WCAG.',
        'accessibility.updates.title': 'Actualizaciones',
        'accessibility.updates.content': 'Este sitio se revisa regularmente para mantener y mejorar su accesibilidad. Última actualización: enero 2025.'
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.showcase': 'Showcase',
        'nav.cv': 'Resume',
        'nav.about': 'About me',
        'nav.menu': 'Menu',

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
        'hero.cards.frontend.title': 'Frontend',
        'hero.cards.frontend.description': 'React, TypeScript, Astro',
        'hero.cards.backend.title': 'Backend',
        'hero.cards.backend.description': 'Node.js, Python, APIs',
        'hero.cards.design.title': 'Design',
        'hero.cards.design.description': 'UI/UX, Figma, Prototyping',

        // About section redesign
        'about.subtitle': 'Full-stack developer with experience creating accessible and functional digital products',
        'about.description':
            "I'm passionate about solving complex problems and turning ideas into web experiences that actually work. Based in Santiago, Chile, I work with modern technologies to create solutions that prioritize user experience and accessibility.",
        'about.keyFeature1': 'Clean and maintainable code',
        'about.keyFeature2': 'Accessible experiences for everyone',
        'about.keyFeature3': 'Optimized performance',
        'about.title': 'About Me',
        'about.tldr': 'I\'m Allison, a frontend developer focused on detail, usability, and accessibility. I build hand-crafted experiences with TypeScript, React, and Tailwind, and I aim to deliver products that feel polished, usable, and cared for.',
        'about.expanded': [
            'For the past three years, I\'ve worked at a consulting company, contributing to large-scale projects like Kit Digital UC, the design system powering 100+ sites at Pontificia Universidad Católica de Chile. That work sharpened my frontend skills, gave me deep experience with design systems, and taught me how to adapt to diverse challenges.',
            'Now, I\'m looking for more ownership — not just coding, but influencing product direction. I\'m drawn to startups or small teams where I can focus on making the best product possible.',
            'My approach: understand the problem first. If a solution already exists, I adapt it; if not, I build it — that\'s where I have the most fun. I value pixel precision, accessibility, and open discussion, and I thrive when challenged.',
            'I\'m excited about the web\'s growing ability to host complex, performant apps that rival desktop software. I\'m especially inspired by the local-first movement, which opens the door to faster, more resilient, user-controlled experiences.',
            'Outside of work, I\'m learning Norwegian for fun, love playing chess, and dive into music exploration. I enjoy connecting with like-minded people, whether for serious projects or just good conversations.'
        ],
        'about.cta.message': 'If something here resonates, reach out — I\'d love to chat.',
        'about.cta.button': 'Let\'s talk',
        'about.specialties.title': 'SPECIALTIES',
        'about.stack.title': 'MAIN STACK',
        'about.collaboration.title': 'INTERESTED IN COLLABORATING?',
        'about.collaboration.subtitle': 'Available for projects and opportunities',
        'about.viewMore.open': 'View more',
        'about.viewMore.close': 'View less',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Full-stack web developer',
        'site.description': 'Personal portfolio of Allison Peña, full-stack developer specialized in React, TypeScript and accessible web experiences.',

        // UI text
        'ui.loading': 'Loading...',
        
        // Theme toast notifications
        'theme.toast.unlocked': 'You\'ve unlocked {count} additional themes!',
        'theme.toast.locked': 'You\'ve locked the additional themes until next time!',
        'theme.toast.company': 'Hello {company} team! I\'ve activated your theme to make you feel right at home.',
        
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
        
        // Skip to content
        'nav.skipToContent': 'Skip to main content',
        'nav.skipToContentShort': 'Skip to content',
        
        // Pagination
        'pagination.page': 'Page',
        'pagination.of': 'of',
        'pagination.previous': 'Previous',
        'pagination.next': 'Next',

        // Footer
        'footer.navigation': 'Navigation',
        'footer.connect': 'Connect',
        'footer.home': 'Home',
        'footer.projects': 'Projects',
        'footer.resume': 'Resume',
        'footer.email': 'Email',
        'footer.accessibility': 'Accessibility Statement',
        'footer.copyright': 'All rights reserved',
        'footer.builtWith': 'Built with',
        'footer.andCode': 'and code',
        'footer.info': 'Information',
        'footer.availableForProjects': 'Available for projects',
        'footer.sitemap': 'Sitemap',
        'footer.aspectRatio.title': 'Contrast ratio',
        'footer.motion.label': 'Reduce motion',
        'footer.motion.activated': 'Activated',
        'footer.motion.deactivated': 'Deactivated',
        'footer.motion.detecting': 'detecting...',
        'footer.wcag.a.title': 'WCAG A - Minimum',
        'footer.wcag.a.desc': '3:1 contrast for graphics, icons and UI components',
        'footer.wcag.aa.title': 'WCAG AA - Standard',
        'footer.wcag.aa.desc': '4.5:1 contrast for normal text and legal compliance',
        'footer.wcag.aaa.title': 'WCAG AAA - Enhanced',
        'footer.wcag.aaa.desc': '7:1 contrast for maximum accessibility and readability',

        // Accessibility Statement
        'accessibility.title': 'Accessibility Statement',
        'accessibility.description': 'Commitment to web accessibility for all users',
        'accessibility.commitment.title': 'Accessibility Commitment',
        'accessibility.commitment.content': 'I am committed to making my personal website accessible to as many people as possible, regardless of technology or abilities. My goal is to provide a clear, functional and enjoyable experience for everyone.',
        'accessibility.standards.title': 'Standards and Guidelines',
        'accessibility.standards.content': 'This site aims to comply with the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA, which define how to make digital content more accessible to people with disabilities.',
        'accessibility.standards.wcag.text': 'WCAG',
        'accessibility.standards.wcag.url': 'https://www.w3.org/TR/WCAG22/',
        'accessibility.features.title': 'Continuous Improvement',
        'accessibility.features.items': [
          'Accessibility is a constantly evolving process. I regularly review and update the design, code and content of this site to maintain and increase its accessibility level.'
        ],
        'accessibility.feedback.title': 'Comments and Contact',
        'accessibility.feedback.content': 'If you encounter any accessibility barriers or have suggestions for improvement, I would appreciate your feedback.',
        'accessibility.feedback.contact': 'You can write to me at: ',
        'accessibility.contrast.title': 'Color Contrast',
        'accessibility.contrast.content': 'This site uses a two-color system that inverts between light and dark themes. Contrast is calculated dynamically to meet WCAG standards.',
        'accessibility.updates.title': 'Ongoing Updates',
        'accessibility.updates.content': 'This website is regularly reviewed to maintain and improve its accessibility. Last updated: January 2025.'
    },
    no: {
        // Navigation
        'nav.home': 'Hjem',
        'nav.projects': 'Prosjekter',
        'nav.showcase': 'Showcase',
        'nav.cv': 'Curriculum Vitae',
        'nav.about': 'Om',
        'nav.menu': 'Meny',

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
        'hero.heading': 'Hei, jeg er Allison. Velkommen til nettsiden min',
        'hero.description': 'Jeg elsker å lage nettsteder som fungerer godt og er enkle å bruke. Jeg jobber hovedsakelig med React og TypeScript.',
        'hero.cards.frontend.title': 'Frontend',
        'hero.cards.frontend.description': 'React, TypeScript, Astro',
        'hero.cards.backend.title': 'Backend',
        'hero.cards.backend.description': 'Node.js, Python, APIer',
        'hero.cards.design.title': 'Design',
        'hero.cards.design.description': 'UI/UX, Figma, Prototyping',

        // About section redesign
        'about.subtitle': 'Fullstack-utvikler med erfaring i å lage tilgjengelige og funksjonelle digitale produkter',
        'about.description':
            'Jeg brenner for å løse komplekse problemer og gjøre ideer om til webopplevelser som faktisk fungerer. Basert i Santiago, Chile, jobber jeg med moderne teknologier for å skape løsninger som prioriterer brukeropplevelse og tilgjengelighet.',
        'about.keyFeature1': 'Ren og vedlikeholdbar kode',
        'about.keyFeature2': 'Tilgjengelige opplevelser for alle',
        'about.keyFeature3': 'Optimalisert ytelse',
        'about.title': 'Om Meg',
        'about.tldr': 'Jeg er Allison, en frontend-utvikler fokusert på detaljer, brukervennlighet og tilgjengelighet. Jeg bygger håndlagde opplevelser med TypeScript, React og Tailwind, og sikter på å levere produkter som føles polerte, brukbare og omsorgsfulle.',
        'about.expanded': [
            'De siste tre årene har jeg jobbet i et konsulentselskap og bidratt til store prosjekter som Kit Digital UC, designsystemet som driver 100+ nettsteder ved Pontificia Universidad Católica de Chile. Det arbeidet skjerpet mine frontend-ferdigheter, ga meg dyp erfaring med designsystemer og lærte meg å tilpasse meg ulike utfordringer.',
            'Nå søker jeg mer eierskap — ikke bare koding, men å påvirke produktretningen. Jeg trekkes mot startups eller små team hvor jeg kan fokusere på å lage det beste produktet mulig.',
            'Min tilnærming: forstå problemet først. Hvis en løsning allerede eksisterer, tilpasser jeg den; hvis ikke, bygger jeg den — det er der jeg har mest moro. Jeg verdsetter piksel-presisjon, tilgjengelighet og åpen diskusjon, og trives når jeg blir utfordret.',
            'Jeg er begeistret for webbens voksende evne til å være vert for komplekse, effektive apper som konkurrerer med skrivebordsprogramvare. Jeg er spesielt inspirert av local-first-bevegelsen, som åpner døren for raskere, mer motstandsdyktige, brukerkontrollerte opplevelser.',
            'Utenom jobb lærer jeg norsk for moro skyld, elsker å spille sjakk og dykker ned i musikalsk utforskning. Jeg liker å knytte kontakt med likesinnede, enten for alvorlige prosjekter eller bare gode samtaler.'
        ],
        'about.cta.message': 'Hvis noe av dette resonerer, ta kontakt — jeg vil gjerne prate.',
        'about.cta.button': 'La oss snakkes',
        'about.specialties.title': 'SPESIALITETER',
        'about.stack.title': 'HOVEDTEKNOLOGIER',
        'about.collaboration.title': 'INTERESSERT I SAMARBEID?',
        'about.collaboration.subtitle': 'Tilgjengelig for prosjekter og muligheter',
        'about.viewMore.open': 'Se mer',
        'about.viewMore.close': 'Se mindre',

        // Site metadata
        'site.title': 'Allison Peña',
        'site.subtitle': 'Fullstack webutvikler',
        'site.description': 'Personlig portefølje til Allison Peña, fullstack-utvikler spesialisert på React, TypeScript og tilgjengelige webopplevelser.',

        // UI text
        'ui.loading': 'Laster...',
        
        // Theme toast notifications
        'theme.toast.unlocked': 'Du har låst opp {count} ekstra temaer!',
        'theme.toast.locked': 'Du har låst de ekstra temaene til neste gang!',
        'theme.toast.company': 'Hei {company}-teamet! Jeg har aktivert temaet deres for at dere skal føle dere hjemme.',
        
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
        'cv.experience.period': '2022 - nå',
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
        'disclaimer.norwegian.compact': 'Jeg lærer norsk som et personlig mål, men for tydeligere kommunikasjon kan du gjerne kontakte meg på engelsk eller spansk.',
        
        // Sidebar content
        'sidebar.toc': 'Innhold',
        
        // Skip to content
        'nav.skipToContent': 'Hopp til hovedinnhold',
        'nav.skipToContentShort': 'Hopp til innhold',
        
        // Pagination
        'pagination.page': 'Side',
        'pagination.of': 'av',
        'pagination.previous': 'Forrige',
        'pagination.next': 'Neste',

        // Footer
        'footer.navigation': 'Navigasjon',
        'footer.connect': 'Kontakt',
        'footer.home': 'Hjem',
        'footer.projects': 'Prosjekter',
        'footer.resume': 'CV',
        'footer.email': 'E-post',
        'footer.accessibility': 'Tilgjengelighetserklæring',
        'footer.copyright': 'Alle rettigheter reservert',
        'footer.builtWith': 'Bygget med',
        'footer.andCode': 'og kode',
        'footer.info': 'Informasjon',
        'footer.availableForProjects': 'Tilgjengelig for prosjekter',
        'footer.sitemap': 'Sitemap',
        'footer.aspectRatio.title': 'Kontrastforhold',
        'footer.motion.label': 'Reduser bevegelse',
        'footer.motion.activated': 'Aktivert',
        'footer.motion.deactivated': 'Deaktivert',
        'footer.motion.detecting': 'oppdager...',
        'footer.wcag.a.title': 'WCAG A - Minimum',
        'footer.wcag.a.desc': '3:1 kontrast for grafikk, ikoner og UI-komponenter',
        'footer.wcag.aa.title': 'WCAG AA - Standard',
        'footer.wcag.aa.desc': '4.5:1 kontrast for normal tekst og lovmessig overholdelse',
        'footer.wcag.aaa.title': 'WCAG AAA - Forbedret',
        'footer.wcag.aaa.desc': '7:1 kontrast for maksimal tilgjengelighet og lesbarhet',

        // Accessibility Statement
        'accessibility.title': 'Tilgjengelighetserklæring',
        'accessibility.description': 'Forpliktelse til webtilgjengelighet for alle brukere',
        'accessibility.commitment.title': 'Forpliktelse til tilgjengelighet',
        'accessibility.commitment.content': 'Jeg er forpliktet til å gjøre min personlige nettside tilgjengelig for så mange mennesker som mulig, uavhengig av teknologi eller evner. Målet mitt er å tilby en klar, funksjonell og hyggelig opplevelse for alle.',
        'accessibility.standards.title': 'Standarder og retningslinjer',
        'accessibility.standards.content': 'Denne nettsiden streber etter å oppfylle retningslinjene for tilgjengelig webinnhold (WCAG) 2.2, nivå AA, som definerer hvordan man gjør digitalt innhold mer tilgjengelig for personer med funksjonshemming.',
        'accessibility.standards.wcag.text': 'WCAG',
        'accessibility.standards.wcag.url': 'https://www.w3.org/TR/WCAG22/',
        'accessibility.features.title': 'Kontinuerlig forbedring',
        'accessibility.features.items': [
          'Tilgjengelighet er en prosess i konstant utvikling. Jeg gjennomgår og oppdaterer regelmessig design, kode og innhold på denne nettsiden for å opprettholde og øke tilgjengelighetsnivået.'
        ],
        'accessibility.feedback.title': 'Kommentarer og kontakt',
        'accessibility.feedback.content': 'Hvis du støter på tilgjengelighetsbarrierer eller har forslag til forbedringer, setter jeg pris på tilbakemeldingen din.',
        'accessibility.feedback.contact': 'Du kan skrive til meg på: ',
        'accessibility.contrast.title': 'Fargekontrast',
        'accessibility.contrast.content': 'Dette nettstedet bruker et to-farge system som inverteres mellom lyse og mørke temaer. Kontrast beregnes dynamisk for å oppfylle WCAG-standarder.',
        'accessibility.updates.title': 'Løpende Oppdateringer',
        'accessibility.updates.content': 'Denne nettsiden gjennomgås regelmessig for å opprettholde og forbedre tilgjengeligheten. Sist oppdatert: Januar 2025.'
    }
} as const;

export type UIKeys = keyof (typeof ui)[typeof defaultLang];
export type Language = keyof typeof ui;
