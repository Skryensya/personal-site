# Style Guide

This document outlines the design system and coding standards for Allison Peña's portfolio website.

## Design Philosophy

### Brutalist Minimalism
- **Function over form**: Every element serves a purpose
- **Sharp, geometric aesthetics**: No rounded corners except for functional elements
- **High contrast**: Clear distinction between foreground and background
- **Instant feedback**: No loading states or fade animations
- **Accessible by design**: WCAG compliance built-in

## Color System

### Two-Color Palette
The entire design uses a strict two-color system that inverts between light and dark themes:

```css
--color-main: /* Text, borders, primary elements */
--color-secondary: /* Backgrounds, inverted text */
```

**Rules:**
- ❌ No additional colors, grays, or accent colors
- ✅ Colors swap completely between light/dark modes
- ✅ Use opacity variations for subtle effects (`text-main/90`, `bg-secondary/5`)

### Usage Patterns
```html
<!-- Standard text -->
<p class="text-main">Main content</p>

<!-- Backgrounds -->
<div class="bg-secondary">Container</div>

<!-- Inverted elements (highlights) -->
<div class="bg-main text-secondary">Accent block</div>

<!-- Subtle variations -->
<div class="text-main/80">Muted text</div>
<div class="border-main/15">Subtle border</div>
```

## Typography

### Font Stack
- **Primary**: Space Grotesk (headings, UI elements, body text)
- **Monospace**: JetBrains Mono, IBM Plex Mono (code, technical content)

### Hierarchy
```css
/* Headings */
.text-4xl.font-bold     /* Page titles */
.text-2xl.font-bold     /* Section headers */
.text-lg.font-semibold  /* Subsection headers */

/* Body text */
.text-base              /* Standard body text */
.text-sm                /* Secondary text */
.text-xs                /* Captions, metadata */

/* Technical content */
.font-mono              /* Code, labels, technical info */
```

### Spacing & Layout
- **Grid system**: 8px base unit
- **Common spacing**: `gap-2`, `p-4`, `space-y-6`
- **Max width**: `max-w-[850px]` for content areas
- **Paragraph width**: `var(--paragraph-max-width)` for optimal readability

## Component Patterns

### Buttons
```html
<!-- Primary button -->
<button class="bg-main text-secondary border border-main hover:bg-secondary hover:text-main">
  Action
</button>

<!-- Outline button -->
<button class="bg-secondary text-main border border-main hover:bg-main hover:text-secondary">
  Secondary Action
</button>
```

### Cards & Containers
```html
<!-- Standard card -->
<div class="bg-secondary border border-main p-4">
  Card content
</div>

<!-- Accent card -->
<div class="bg-main text-secondary p-4">
  Highlighted content
</div>

<!-- Subtle card -->
<div class="bg-secondary/5 border border-main/15 rounded-xl p-6">
  Modern container
</div>
```

### Interactive Elements
```html
<!-- Hover states -->
<element class="hover:opacity-70 transition-opacity">

<!-- Focus states -->
<element class="focus-visible:ring-2 focus-visible:ring-main/40">

<!-- No animations except functional transitions -->
<element class="transition-transform duration-200">
```

## Layout Principles

### Grid Systems
```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- CSS Grid for complex layouts -->
<div class="grid grid-cols-[minmax(12rem,16rem)_1fr] gap-8">

<!-- Flexbox for simple alignment -->
<div class="flex items-center justify-between gap-4">
```

### Responsive Design
- **Mobile-first**: Start with mobile layout
- **Breakpoints**: `sm:`, `md:`, `lg:`, `xl:`
- **Container queries**: Use when appropriate
- **Flexible units**: `rem`, `vh`, `vw` for scalability

## Animation Guidelines

### Allowed Animations
✅ **Functional transitions only**:
- `transition-opacity` for hover states
- `transition-transform` for button feedback
- `transition-colors` for theme switching
- Icon rotations (`rotate-180`)

### Forbidden Animations
❌ **No decorative animations**:
- Fade-in effects
- Loading spinners
- Slide animations
- Bounce effects
- Parallax scrolling

## Accessibility Standards

### Semantic HTML
```html
<!-- Use proper semantic elements -->
<main>, <section>, <article>, <aside>, <nav>
<h1>, <h2>, <h3> (proper hierarchy)
<button>, <a> (proper interactive elements)
```

### ARIA Attributes
```html
<!-- States -->
<button aria-expanded="false" aria-controls="menu">Toggle</button>

<!-- Labels -->
<section aria-labelledby="section-heading">
<h2 id="section-heading">Section Title</h2>

<!-- Live regions -->
<div aria-live="polite">Status updates</div>
```

### Focus Management
```css
/* Visible focus indicators */
.focus-visible:ring-2.ring-main/40

/* Skip links */
.sr-only.focus:not-sr-only
```

## Code Standards

### CSS/Tailwind
```html
<!-- Group related classes -->
<div class="flex items-center gap-2 p-4 bg-secondary border border-main rounded-xl">

<!-- Use semantic class names for complex patterns -->
<div class="hero-card navigation-link form-input">
```

### Component Structure
```astro
---
// TypeScript interface
interface Props {
  className?: string;
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

// Destructure with defaults
const { className = '', variant = 'primary' } = Astro.props;
---

<!-- Component markup -->
<element class={`base-classes ${variant-classes} ${className}`}>
  <slot />
</element>
```

### Performance
- **Static by default**: Use Astro components for static content
- **Interactive islands**: React components only for dynamic functionality
- **Client directives**: `client:load`, `client:idle`, `client:visible`
- **Image optimization**: WebP format, lazy loading, proper sizing

## File Organization

```
src/
├── components/
│   ├── sections/          # Page sections
│   ├── ui/               # Reusable UI components
│   └── *.astro           # Static components
├── layouts/              # Page layouts
├── pages/                # Route components
├── styles/               # Global styles
└── utils/                # Utility functions
```

## Naming Conventions

### Files
- **Components**: `PascalCase.astro` / `PascalCase.tsx`
- **Pages**: `kebab-case.astro`
- **Utilities**: `camelCase.ts`

### CSS Classes
- **Utility-first**: Use Tailwind utilities
- **Custom classes**: `kebab-case` when needed
- **Component classes**: `ComponentName-element`

### Variables
- **TypeScript**: `camelCase`
- **CSS custom properties**: `--kebab-case`

## Content Guidelines

### Writing Style
- **Direct and honest**: No marketing fluff
- **Technical accuracy**: Precise descriptions
- **Personal voice**: Authentic, not corporate
- **Scannable**: Use lists, short paragraphs

### Internationalization
- **Primary language**: Spanish (no URL prefix)
- **Secondary languages**: English (`/en/`), Norwegian (`/no/`)
- **Fallback**: Graceful degradation to Spanish
- **Consistent tone**: Maintain personality across languages

## Testing & Quality

### Browser Support
- **Modern evergreen browsers**: Chrome, Firefox, Safari, Edge
- **Mobile responsiveness**: iOS Safari, Chrome Mobile
- **Accessibility testing**: Screen readers, keyboard navigation

### Performance Targets
- **Bundle size**: < 150kb gzipped
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse score**: > 95 for all categories

## Maintenance

### Regular Tasks
- **Dependency updates**: Monthly security patches
- **Performance audits**: Quarterly reviews
- **Accessibility checks**: Continuous monitoring
- **Content updates**: As needed

### Breaking Changes
- **Color system**: Never add new colors
- **Animation policy**: Maintain strict no-animation rule
- **Typography**: Keep font stack minimal
- **Layout**: Preserve brutalist aesthetic

---

## Quick Reference

### Essential Classes
```css
/* Colors */
.text-main .bg-secondary .border-main

/* Typography */
.font-mono .text-lg .leading-relaxed

/* Layout */
.grid .flex .gap-4 .p-6 .space-y-4

/* Interactive */
.hover:opacity-70 .transition-opacity .cursor-pointer
```

### Forbidden Patterns
```css
/* ❌ Don't use */
.rounded-full .shadow-lg .animate-pulse
.text-gray-500 .bg-blue-100 .border-red-400
.transition-all .duration-500 .ease-in-out
```

Remember: **Functionality over decoration, clarity over cleverness, accessibility over aesthetics.**