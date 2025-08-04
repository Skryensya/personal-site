# Allison Peña - Portfolio Personal

Un portafolio moderno y multilingüe construido con Astro.js y React, que presenta un diseño estético brutalista minimalista retro con soporte completo de internacionalización.

## 🚀 Características

### Tecnologías Principales
- **Astro.js 5.12.3** - Generación de sitios estáticos con renderizado híbrido
- **React 18.3.1** - Componentes interactivos con hidratación selectiva
- **Tailwind CSS 4.1.11** - Sistema de diseño utility-first
- **TypeScript** - Tipado estático completo
- **MDX** - Contenido con componentes React

### Internacionalización
- **3 idiomas soportados**: Español (predeterminado), Inglés, Noruego
- **Enrutamiento automático**: `/`, `/en/`, `/no/`
- **Sistema de traducciones centralizado**
- **SEO optimizado por idioma**

### Diseño y UX
- **Estética brutalista**: Colores contrastantes, formas geométricas nítidas
- **Sistema de dos colores**: Inversión automática entre temas claro y oscuro
- **Sin animaciones**: Cambios de estado instantáneos
- **Responsivo**: Optimizado para dispositivos móviles y escritorio
- **Accesible**: Cumple estándares WCAG

## 🛠️ Instalación y Desarrollo

### Requisitos Previos
- Node.js 18.0+ 
- npm o yarn

### Configuración Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd personal-site

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot-reload
npm start            # Alias para npm run dev

# Producción
npm run build        # Generar build de producción
npm run preview      # Previsualizar build de producción

# Utilidades
npm run astro        # Comandos CLI de Astro
npm run unlighthouse # Análisis de rendimiento
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── sections/           # Componentes de sección de página
│   │   ├── AboutSection.astro
│   │   ├── TechnologiesSection.astro
│   │   └── ProjectsSection.astro
│   ├── ui/                 # Elementos de interfaz reutilizables
│   │   ├── Button.astro
│   │   └── DropdownButton.tsx
│   └── *.astro            # Componentes estáticos
├── content/
│   ├── blog/              # Posts del blog (.md/.mdx)
│   ├── projects/          # Proyectos del portafolio
│   └── config.ts          # Configuración de colecciones
├── i18n/
│   ├── ui.ts              # Diccionarios de traducción
│   ├── utils.ts           # Utilidades de i18n
│   └── *.ts               # Funciones de texto (legacy)
├── layouts/
│   └── Layout.astro       # Layout principal
├── pages/
│   ├── [...lang]/         # Páginas localizadas
│   ├── api/               # Endpoints de API
│   └── *.astro            # Rutas estáticas
└── styles/
    └── global.css         # Estilos globales
```

## 🌍 Sistema de Internacionalización

### Idiomas Soportados

| Idioma | Código | URL | Estado |
|--------|--------|-----|--------|
| Español | `es` | `/` | Predeterminado |
| English | `en` | `/en/` | Completo |
| Norsk | `no` | `/no/` | Completo |

### Agregar Traducciones

1. **Actualizar diccionario** (`src/i18n/ui.ts`):
```typescript
export const ui = {
  es: {
    'nueva.clave': 'Texto en español',
  },
  en: {
    'nueva.clave': 'Text in English',
  },
  no: {
    'nueva.clave': 'Tekst på norsk',
  },
} as const;
```

2. **Usar en componentes Astro**:
```astro
---
import { useTranslations } from '@/i18n/utils';
const t = useTranslations(lang);
---
<h1>{t('nueva.clave')}</h1>
```

3. **Usar en componentes React**:
```tsx
import { useClientTranslations } from '@/i18n/utils';

export function MyComponent() {
  const t = useClientTranslations();
  return <h1>{t('nueva.clave')}</h1>;
}
```

## 🎨 Sistema de Diseño

### Filosofía Visual
- **Brutalismo Minimalista**: Funcionalidad sobre decoración
- **Alto Contraste**: Legibilidad máxima
- **Geometría Nítida**: Formas rectangulares y bordes definidos
- **Tipografía Técnica**: Fuentes monoespaciadas para estética técnica

### Paleta de Colores
```css
/* Solo dos colores que se invierten entre temas */
--color-main: #000000 / #ffffff;        /* Texto y bordes */
--color-secondary: #ffffff / #000000;   /* Fondos y texto alternativo */
```

### Componentes de UI

#### Botón Estándar
```astro
<Button href="/link" size="md" filled={false}>
  Texto del botón
</Button>
```

#### Sección de Contenido
```astro
<BigSectionContainer title="Título" id="seccion">
  <!-- Contenido -->
</BigSectionContainer>
```

## 📝 Gestión de Contenido

### Colecciones de Contenido

#### Blog Posts (`src/content/blog/`)
```yaml
---
title: "Título del Post"
publishDate: 2024-01-01
tags: ['react', 'typescript']
isFeatured: false
seo:
  title: "Título SEO personalizado"
  description: "Descripción personalizada"
---

Contenido del post en Markdown o MDX...
```

#### Proyectos (`src/content/projects/`)
```yaml
---
title: "Nombre del Proyecto"
description: "Descripción breve"
publishDate: 2024-01-01
isFeatured: true
color: "#FF5733"
tags: ['astro', 'react']
---

Descripción detallada del proyecto...
```

### Agregar Nuevo Contenido

1. **Crear archivo** en la colección correspondiente
2. **Definir frontmatter** con campos requeridos
3. **Escribir contenido** en Markdown/MDX
4. **Verificar build**: `npm run build`

## 🚀 Optimización y Rendimiento

### Estrategias de Rendimiento
- **Generación Estática**: Todas las páginas pre-renderizadas
- **Hidratación Selectiva**: Solo componentes interactivos se hidratan
- **Optimización de Imágenes**: Procesamiento automático y lazy loading
- **División de Código**: Bundles optimizados automáticamente

### Métricas Objetivo
- **Bundle JS**: < 150kb gzipped
- **First Paint**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **Lighthouse Score**: > 95

## 🔧 Configuración de Despliegue

### Variables de Entorno
```bash
# URL del sitio (requerida para sitemaps)
PUBLIC_SITE_URL=https://tu-dominio.com

# Analytics (opcional)
PUBLIC_ANALYTICS_ID=tu-analytics-id
```

### Plataformas Recomendadas
- **Vercel**: Configuración automática con preview deployments
- **Netlify**: Build automático con formularios
- **Cloudflare Pages**: CDN global optimizado

### Configuración de Build
```bash
# Comando de build
npm run build

# Directorio de salida
dist/

# Configuración de redirects (ejemplo para Vercel)
{
  "redirects": [
    {
      "source": "/blog/:path*",
      "destination": "/:path*",
      "permanent": false
    }
  ]
}
```

## 🧪 Testing y Calidad

### Verificación de Build
```bash
# Verificar que el build funciona correctamente
npm run build

# Previsualizar localmente
npm run preview
```

### Análisis de Rendimiento
```bash
# Análisis completo de Lighthouse
npm run unlighthouse
```

### Checklist de Calidad
- [ ] Build exitoso sin errores
- [ ] Todas las traducciones funcionan
- [ ] Responsive en móvil y escritorio
- [ ] Accesibilidad verificada
- [ ] Rendimiento optimizado
- [ ] SEO configurado correctamente

## 🤝 Contribución

### Guidelines de Desarrollo
1. **Mantener la estética brutalista**: Sin colores adicionales o animaciones
2. **Separación Astro/React**: Componentes estáticos vs interactivos
3. **TypeScript estricto**: Tipado completo
4. **Solo Tailwind**: No CSS personalizado excepto global
5. **Rendimiento primero**: Optimizar bundle size

### Estructura de Commits
```
tipo(ámbito): descripción breve

Descripción más detallada si es necesario.

- Cambio específico 1
- Cambio específico 2
```

## 📚 Recursos Adicionales

### Documentación
- [Astro.js Docs](https://docs.astro.build/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Herramientas Útiles
- [Astro DevTools](https://github.com/astro-devtools)
- [Tailwind IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [TypeScript Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## 📄 Licencia

Este proyecto es el portafolio personal de Allison Peña. Todos los derechos reservados.

---

## 📞 Contacto

- **Portfolio**: [Tu URL aquí]
- **LinkedIn**: [linkedin.com/in/skryensya](https://linkedin.com/in/skryensya)
- **GitHub**: [github.com/skryensya](https://github.com/skryensya)
- **Email**: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

*Construido con ❤️ en Santiago, Chile usando Astro.js y React*