# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Allison Peña's Personal Portfolio** - A modern, multilingual portfolio website built with Astro.js and React, featuring a retro minimalist brutalist design aesthetic with full internationalization support.

### Tech Stack
- **Framework**: Astro.js 5.12.3 (Static Site Generation)
- **UI Library**: React 18.3.1 (Interactive components only)
- **Styling**: Tailwind CSS 4.1.11 (Utility-first CSS)
- **Internationalization**: Custom i18n system with Astro's built-in i18n routing
- **Content Management**: Astro Content Collections with Zod validation
- **Deployment**: Static build optimized for CDN deployment

## Development Commands

```bash
# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Astro CLI commands
npm run astro -- <command>

# Performance analysis
npm run unlighthouse
```

## Project Architecture

### Core Philosophy: Retro Minimalist Brutalism

This portfolio follows a strict design system that prioritizes:
- **Functionality over decoration**
- **Sharp geometric aesthetics**
- **High contrast typography**
- **Instant state changes (no animations)**
- **Accessible and performant experiences**

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── sections/        # Page section components
│   ├── ui/              # Basic UI elements
│   └── *.astro          # Static Astro components
├── content/             # Content collections
│   ├── blog/           # Blog posts (.md/.mdx)
│   ├── projects/       # Portfolio projects
│   └── pages/          # Static pages
├── i18n/               # Internationalization system
│   ├── ui.ts           # Translation dictionaries
│   ├── utils.ts        # i18n utility functions
│   └── *.ts            # Legacy text functions (deprecated)
├── layouts/            # Page layouts
├── pages/              # Route components
│   ├── [...lang]/      # Localized pages
│   └── api/            # API endpoints
├── styles/             # Global styles
└── utils/              # Utility functions
```

## Internationalization System

### Supported Languages
- **Spanish (es)**: Default language, no URL prefix
- **English (en)**: URL prefix `/en/`
- **Norwegian (no)**: URL prefix `/no/`

### Configuration

**Astro Config** (`astro.config.mjs`):
```javascript
i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'no'],
    routing: {
        prefixDefaultLocale: false  // Spanish has no prefix
    }
}
```

### Translation System

**Structure** (`src/i18n/ui.ts`):
```typescript
export const ui = {
  es: {
    'nav.home': 'Inicio',
    'hero.heading': 'Hola, soy Allison...',
    // Hierarchical key structure
  },
  en: { /* English translations */ },
  no: { /* Norwegian translations */ }
} as const;
```

**Usage in Astro Components**:
```astro
---
import { useTranslations } from '@/i18n/utils';
import { defaultLang, type Language } from '@/i18n/ui';

interface Props {
    lang?: Language;
}

const { lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
---

<h1>{t('hero.heading')}</h1>
```

**Usage in React Components**:
```tsx
import { useClientTranslations } from '@/i18n/utils';

export function MyComponent() {
    const t = useClientTranslations();
    return <h1>{t('hero.heading')}</h1>;
}
```

### Routing Strategy

- **Default language (Spanish)**: No prefix (`/`, `/projects/`)
- **Other languages**: Prefixed (`/en/`, `/no/projects/`)
- **Automatic detection**: Based on URL pathname
- **Fallback behavior**: Graceful degradation to default language

## Component Architecture

### Astro vs React Separation

**Astro Components** (.astro):
- Static content rendering
- Server-side logic
- Layout components
- SEO and metadata
- No client-side interactivity

**React Components** (.tsx):
- Interactive UI elements
- State management
- Event handlers
- Real-time updates
- Client-side functionality

### Component Categories

#### 1. Section Components
Self-contained page sections with full logic:
- `HeroSection.astro` - Landing area with introduction
- `TechnologiesSection.astro` - Scrolling tech stack
- `AboutSection.astro` - Personal information and CTA
- `ProjectsSection.astro` - Featured portfolio projects

#### 2. UI Components
Reusable interface elements:
- `Button.astro` - Styled button with sound effects
- `BigSectionContainer.astro` - Section wrapper with title
- `DitheredImageReact.tsx` - Theme-aware image processing

#### 3. Interactive Components
React components for dynamic functionality:
- `HeaderControls.tsx` - Theme and language switching
- `DropdownButton.tsx` - Reusable dropdown interface
- `MarqueeSection.tsx` - Infinite scrolling technology list
- `GithubGrid.tsx` - Git contribution visualization

### Props and Type Safety

**Astro Component Interface**:
```astro
---
interface Props {
    lang?: Language;
    title?: string;
    class?: string;
}

const { 
    lang = defaultLang,
    title,
    class: className 
} = Astro.props;
---
```

**React Component Interface**:
```tsx
interface ComponentProps {
    lang?: Language;
    children?: React.ReactNode;
    className?: string;
}

export function Component({ lang = 'es', children, className }: ComponentProps) {
    // Component logic
}
```

## Design System

### Color Philosophy
**STRICT TWO-COLOR SYSTEM**:
- `--color-main`: Text and borders
- `--color-secondary`: Backgrounds and alternate text
- **Theme inversion**: Colors swap between light/dark modes
- **NO exceptions**: No grays, accents, or additional colors

### Typography Hierarchy
- **Primary**: Space Grotesk (UI elements, headings, body text)
- **Technical**: JetBrains Mono, IBM Plex Mono (code, technical content)
- **Monospace aesthetic**: `font-mono` for technical feel throughout

### Layout Principles
- **8px grid system**: Consistent spacing (`px-2`, `py-2`, `gap-4`)
- **Sharp edges**: No rounded corners except functional elements
- **High contrast borders**: Always `border-main`
- **Geometric shapes**: Clean rectangles and squares

### Interactive Elements
**Button Patterns**:
```html
<!-- Standard button -->
<button class="bg-secondary border border-main hover:bg-main hover:text-secondary">

<!-- Split button with dropdown -->
<div class="flex">
    <button class="bg-secondary border-r-0">Main Action</button>
    <button class="bg-secondary border">▼</button>
</div>
```

**NO ANIMATIONS POLICY**:
- No `transition-*`, `duration-*`, or `ease-*` classes
- Instant state changes only
- No loading spinners or fade effects
- Exception: Functional floating UI elements only

## Content Management

### Content Collections

**Blog Posts** (`src/content/blog/`):
```yaml
---
title: "Post Title"
publishDate: 2024-01-01
tags: ['react', 'typescript']
isFeatured: false
seo:
  title: "Custom SEO Title"
  description: "Custom description"
---
```

**Projects** (`src/content/projects/`):
```yaml
---
title: "Project Name"
description: "Brief description"
publishDate: 2024-01-01
isFeatured: true
color: "#FF5733"
tags: ['astro', 'react']
---
```

### SEO Strategy
- **Automated sitemap generation**
- **RSS feed for blog content**
- **Multi-language meta tags**
- **Structured data markup**
- **Performance-optimized images**

## Performance Optimization

### Astro Optimizations
- **Static Site Generation**: Pre-rendered at build time
- **Component Islands**: Selective hydration for React components
- **Image optimization**: Built-in processing and lazy loading
- **Code splitting**: Automatic bundle optimization

### React Optimization Patterns
```tsx
// Lazy imports for client components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Proper client directives
<ReactComponent client:idle />      // Non-critical
<ReactComponent client:load />      // Critical
<ReactComponent client:visible />   // Below fold
```

### Bundle Analysis
- **Client bundle**: < 150kb gzipped
- **Critical CSS**: Inlined for above-fold content
- **Font optimization**: Preloaded and self-hosted
- **Asset optimization**: WebP images, compressed static assets

## Development Guidelines

### Code Style
- **TypeScript strict mode**: Full type safety
- **Tailwind only**: No custom CSS except global styles
- **Component composition**: Prefer small, focused components
- **Props interfaces**: Always define component props

### File Naming
- **Astro components**: PascalCase.astro
- **React components**: PascalCase.tsx
- **Utilities**: camelCase.ts
- **Content files**: kebab-case.md

### Import Patterns
```typescript
// Astro components
import Layout from '@/layouts/Layout.astro';
import { useTranslations } from '@/i18n/utils';

// React components  
import * as React from 'react';
const { useState, useEffect } = React;
```

### Testing Strategy
- **Build verification**: `npm run build` for syntax checking
- **Performance testing**: Lighthouse CI integration
- **Accessibility testing**: Built-in Astro checks
- **Cross-browser compatibility**: Modern evergreen browsers

## Deployment Configuration

### Build Output
- **Static files**: Generated in `dist/` directory
- **Asset optimization**: Automatic compression and optimization
- **Route pre-rendering**: All pages generated at build time

### Environment Variables
```bash
# Production URL (required for sitemaps)
PUBLIC_SITE_URL=https://your-domain.com

# Analytics (optional)
PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Hosting Requirements
- **Static hosting**: CDN-optimized (Vercel, Netlify, Cloudflare Pages)
- **Redirect rules**: Handle language routing
- **Gzip compression**: Server-level compression enabled
- **Cache headers**: Long-term caching for static assets

## Maintenance Guidelines

### Content Updates
1. Add new content to appropriate collection (`blog/`, `projects/`)
2. Update featured flags for homepage display
3. Verify build passes: `npm run build`
4. Check all language versions display correctly

### Design System Updates
1. **NEVER** add new colors or break two-color system
2. Test theme switching functionality
3. Verify mobile responsiveness
4. Maintain brutalist aesthetic principles

### Performance Monitoring
- **Bundle size**: Monitor JavaScript payload
- **Core Web Vitals**: Track loading performance
- **Accessibility scores**: Maintain WCAG compliance
- **Multi-language performance**: Test all locales

## Migration Notes

### Legacy Systems
- **Old text functions**: Being phased out for unified i18n system
- **Inline translations**: Moving to centralized dictionary
- **Mixed component patterns**: Standardizing Astro/React separation

### Future Improvements
- **Content Management**: Potential headless CMS integration
- **Advanced i18n**: Date/number formatting localization
- **Performance**: Further bundle optimization opportunities
- **Accessibility**: Enhanced screen reader optimizations

---

## Quick Reference

### Essential Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run astro add    # Add integrations
```

### Key File Locations
- **Translations**: `src/i18n/ui.ts`
- **Config**: `astro.config.mjs`
- **Styles**: `src/styles/global.css`
- **Content**: `src/content/{blog,projects}/`

### Component Patterns
- **Astro**: Static rendering, no client JS
- **React**: Interactive elements with client directives
- **Sections**: Self-contained page regions
- **UI**: Reusable interface components

Remember: Maintain the brutalist aesthetic, two-color system, and performance-first approach in all modifications.