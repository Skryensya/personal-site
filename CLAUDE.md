# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Astro CLI commands
npm run astro -- <command>
```

## Project Architecture

This is Allison Peña's personal portfolio built with **Astro.js 4.15.9** and **Tailwind CSS 3.4.13**. The site uses Astro's Content Collections for type-safe content management and features a custom theming system.

### Content Collections (`src/content/`)

Three main collections with Zod schema validation:

- **`blog/`** - Blog posts with tags, featured status, and SEO metadata
- **`projects/`** - Portfolio projects with descriptions, colors, and featured status
- **`pages/`** - Static pages

Key schema fields:

- `isFeatured: boolean` - Controls homepage display
- `publishDate: Date` - Required for sorting
- `seo: object` - Optional SEO overrides (title, description, image, pageType)
- `tags: string[]` - For blog categorization
- `color: string` - For project theming

### Site Configuration (`src/data/site-config.ts`)

Centralized configuration including:

- Site metadata (title: "Allison Peña", subtitle: "Full-stack web developer")
- Navigation links (Spanish: "Inicio", "Proyectos")
- Social links (LinkedIn: skryensya)
- Pagination settings (5 items per page)

## Design Philosophy & Strict Guidelines

### **Core Aesthetic: Retro Minimalist Brutalism**

**Color System - STRICT ENFORCEMENT**:
- **ONLY two colors**: `main` and `secondary` (defined by theme)
- **NEVER use gray tones, accent colors, or additional colors**
- **Theme-based inversion**: Colors swap between light/dark modes
- **No gradients except for theme previews**: Only solid colors throughout

**Typography**:
- **Primary**: Space Grotesk (sans-serif) for UI, headings, and body text
- **Code/Technical**: JetBrains Mono and IBM Plex Mono for technical content
- **Monospace for technical elements**: Font-mono class for technical aesthetics
- **Bold hierarchy**: Clear font weight distinctions (normal/semibold/bold)

**Visual Hierarchy**:
- **Sharp geometric shapes**: No rounded corners unless absolutely necessary
- **Technical spacing**: 8px grid system (px-2, py-2, gap-4, etc.)
- **High contrast borders**: Always `border-main` for clear separation
- **No shadows or blur effects**: Except for functional dropdowns

### **Component Architecture Rules**

**React vs Astro - STRICT SEPARATION**:
- **Interactive components**: MUST be React (.tsx) with `client:idle` or `client:load`
- **Static content**: MUST be Astro (.astro) for performance
- **State management**: Only React components can have useState, useEffect, etc.
- **Event handlers**: Only in React components

**React Component Standards**:
- **Import pattern**: `import * as React from 'react';` then `const { useState, useEffect } = React;`
- **Floating UI**: Use `@floating-ui/react` for all floating elements (dropdowns, tooltips)
- **TypeScript interfaces**: Always define props interfaces
- **Client directives**: Use `client:idle` for non-critical, `client:load` for critical

**Astro Component Standards**:
- **No JavaScript interactivity**: Pure HTML/CSS generation
- **Tailwind only**: No `<style>` blocks unless absolutely necessary
- **Props validation**: Use TypeScript interfaces in frontmatter

### **Styling System - MANDATORY PATTERNS**

**Tailwind Classes - REQUIRED**:
- **Colors**: ONLY `bg-main`, `bg-secondary`, `text-main`, `text-secondary`, `border-main`
- **Hover states**: `hover:bg-main hover:text-secondary` pattern
- **Focus states**: `focus:bg-main focus:text-secondary focus:outline-none`
- **Typography**: `font-mono text-xs font-semibold` for technical elements

**NO TRANSITIONS OR ANIMATIONS**:
- **Remove all**: `transition-*`, `duration-*`, `ease-*` classes
- **Instant state changes**: Immediate hover/focus feedback
- **No loading spinners**: Use immediate state indicators
- **No fade effects**: Instant opacity changes only

**Interactive Elements**:
- **Button pattern**: `bg-secondary border border-main hover:bg-main hover:text-secondary`
- **Dropdown pattern**: Split button with main action + dropdown arrow
- **Form elements**: Always `border-main` with `focus:` states
- **Links**: `hover:bg-main hover:text-secondary` for clear feedback

### **Key Components**

**Modern React Components**:
- **`HeaderControls.tsx`** - Theme/mode switching with split buttons
- **`DropdownButton.tsx`** - Reusable split button with Floating UI
- **`DitheredImageReact.tsx`** - Theme-aware image processing
- **`GithubGrid.tsx`** - Interactive git contribution display

**Astro Layout Components**:
- **`Layout.astro`** - Main layout wrapper with SEO
- **`Header.astro`** - Navigation structure (uses React components for interactivity)
- **`BigSectionContainer.astro`** - Content section wrapper
- **`Hero.astro`** - Static hero section

### **Theme System**

**Color Variables**:
- **`--theme-colorful`** and **`--theme-contrasty`** - Theme-specific colors
- **CSS classes**: `.dark` class toggles for mode switching
- **Local storage**: Persist theme-id and mode preferences

**Theme Switching**:
- **Split button pattern**: Main button cycles, dropdown shows all options
- **Mode detection**: Light/dark/system with proper `prefers-color-scheme` support
- **Instant switching**: No transitions on theme changes

**Image Processing**:
- **DitheredImage variants**: Original and theme-swapping versions
- **Color inversion**: `swapOnTheme` prop for dark mode color reversal
- **Theme synchronization**: MutationObserver for instant updates

### **Mobile Responsiveness**

**Desktop-first approach**:
- **Hide secondary actions**: Dropdown arrows hidden on mobile (`hidden md:flex`)
- **Simplified interactions**: Only main button actions on small screens
- **Monospace scaling**: Maintain technical aesthetic across devices

**Responsive Patterns**:
- **Grid layouts**: `grid-cols-1 md:grid-cols-2` for content
- **Text visibility**: `hidden md:block` for secondary text
- **Button sizing**: `w-7 h-7 md:w-auto md:h-8` for adaptive sizing

### **Performance & Efficiency**

**React Optimization**:
- **useCallback**: For functions passed to useEffect dependencies
- **Minimal re-renders**: Careful dependency arrays
- **Client directives**: `client:idle` for non-critical components

**Astro Optimization**:
- **Static generation**: Maximum use of Astro's static capabilities
- **Component islands**: Isolated React components only where needed
- **Asset optimization**: Proper image handling and lazy loading

### **Code Patterns - ENFORCE THESE**

**Forbidden Patterns**:
- ❌ Custom CSS transitions or animations
- ❌ Additional colors beyond main/secondary
- ❌ Rounded corners (`rounded-*`) except for functional needs
- ❌ Box shadows (`shadow-*`) except for floating elements
- ❌ Intermediate gray colors or opacity variations
- ❌ JavaScript in Astro components for interactivity

**Required Patterns**:
- ✅ React for all interactive elements
- ✅ Tailwind classes only: `bg-main`, `text-secondary`, `border-main`
- ✅ Split button pattern for actions with options
- ✅ `font-mono` for technical aesthetics
- ✅ Floating UI for all positioned elements
- ✅ Theme-aware color systems

### **Routing Structure**

- **`/`** - Homepage with bio and featured projects
- **`/projects/`** - Project listings and individual project pages
- **`/[...slug].astro`** - Dynamic routing for all content collections
- **`/_blog/`** - Blog posts and listings
- **`/_tags/`** - Tag-based filtering
- **`/rss.xml.js`** - RSS feed generation

### **Astro Configuration**

- **Site URL**: `https://example.com` (placeholder)
- **Integrations**: MDX, Sitemap, React, Tailwind (with `applyBaseStyles: false`)
- **Vite alias**: `@components` → `/src/components`

### **Content Management**

- Content files use **Markdown (.md)** and **MDX (.mdx)**
- **Multilingual**: Site content is in Spanish
- **SEO optimized** with meta tags, sitemaps, and RSS feeds
- **Featured content system** for homepage curation

### **Development Notes**

- **No linting/testing commands** configured - only core Astro scripts available
- **Prettier** is configured with Tailwind plugin for code formatting
- **Site is in early development** (version 0.0.1)
- **Content is bilingual** (Spanish UI, potentially English content)
- **Professional focus** on web development and accessibility projects

## Memories & Preferences

**Established Patterns**:
- Split button dropdowns with main action + dropdown arrow
- Theme system with instant color swapping
- React components for all interactivity, Astro for static content
- Strict two-color design system
- Technical, monospace typography for UI elements
- No transitions or animations - instant state changes
- Mobile-first responsive hiding of secondary actions
