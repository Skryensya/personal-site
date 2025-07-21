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

### Visual Design System

**Design Philosophy**: Minimalist brutalist aesthetic inspired by stripe.dev - tech-oriented, clean, and functional.

**Core Principles**:
- **Brutalist minimalism**: Bold typography, stark contrasts, geometric layouts
- **Tech-focused**: Code-like aesthetics, monospace fonts for technical elements
- **stripe.dev inspiration**: Clean information hierarchy, subtle interactions
- **Functionality over decoration**: Every element serves a purpose

**Typography**:
- **Primary**: Space Grotesk (sans-serif) for UI, headings, and body text  
- **Code/Technical**: JetBrains Mono and IBM Plex Mono for technical content and code blocks
- **Bold hierarchy**: Strong font weights (600) for headings and emphasis
- **Limited font sizes**: Consistent type scale with clear hierarchy
- **OpenType features**: Font feature settings enabled for better rendering
- **Tabular numbers**: Numeric alignment for technical data

**Color Palette**:
- **Bi-color system**: Only two colors throughout the entire site
- **High contrast pair**: Pure black (#000000) and pure white (#FFFFFF)
- **Background/Foreground**: One color for background, the other for all text and UI elements
- **No gray tones**: Eliminate all intermediate grays - strict black/white only
- **Theme switching**: Dark mode (black bg/white text) and light mode (white bg/black text)
- **No accent colors**: Remove all other colors (greens, reds, blues) for pure minimalism

**Layout & Spacing**:
- **Grid-based**: Strict geometric layouts
- **Generous whitespace**: Breathing room between sections
- **Sharp edges**: Minimal border radius, prefer rectangles
- **Technical spacing**: Consistent spacing scale (8px, 16px, 24px, 32px, etc.)

**Interactive Elements**:
- **Minimal hover states**: Subtle color changes or underlines
- **No fancy animations**: Simple, fast transitions
- **Focus on usability**: Clear click targets and feedback
- **Technical aesthetics**: Button styles that feel like UI elements

**Components Style**:
- **Cards**: Simple borders, no shadows, clean rectangles
- **Buttons**: Minimal styling, clear hierarchy (primary/secondary)
- **Navigation**: Clean, horizontal layout inspired by developer tools
- **Code blocks**: Terminal-like appearance with proper syntax highlighting

### Key Components

- **`BaseLayout.astro`** - Main layout wrapper with SEO
- **`Header.astro`** / **`Nav.astro`** - Responsive navigation with mobile menu
- **`ThemeToggle.astro`** - Dark/light mode switcher
- **`PostPreview.astro`** / **`ProjectPreview.astro`** - Content previews
- **`Pagination.astro`** - Collection pagination

### Routing Structure

- **`/`** - Homepage with bio and featured projects
- **`/projects/`** - Project listings and individual project pages
- **`/[...slug].astro`** - Dynamic routing for all content collections
- **`/_blog/`** - Blog posts and listings
- **`/_tags/`** - Tag-based filtering
- **`/rss.xml.js`** - RSS feed generation

### Astro Configuration

- **Site URL**: `https://example.com` (placeholder)
- **Integrations**: MDX, Sitemap, Tailwind (with `applyBaseStyles: false`)
- **Vite alias**: `@components` → `/src/components`

### Styling

- **Global styles** in `src/styles/global.css` with CSS custom properties
- **Tailwind customization** in `tailwind.config.cjs` with custom colors and animations
- **Typography plugin** with custom "dante" prose styles and tech fonts
- **Tech font stack** with Space Grotesk, JetBrains Mono, and IBM Plex Mono
- **OpenType features** enabled for enhanced typography rendering
- **Mobile-first responsive design**

### Content Management

- Content files use **Markdown (.md)** and **MDX (.mdx)**
- **Multilingual**: Site content is in Spanish
- **SEO optimized** with meta tags, sitemaps, and RSS feeds
- **Featured content system** for homepage curation

### Utilities

- **`src/utils/data-utils.ts`** - Content sorting, filtering, and tag management
- **`src/utils/common-utils.ts`** - General utilities (slugify, etc.)

## Important Notes

- **No linting/testing commands** configured - only core Astro scripts available
- **Prettier** is configured with Tailwind plugin for code formatting  
- **Site is in early development** (version 0.0.1)
- **Content is bilingual** (Spanish UI, potentially English content)
- **Professional focus** on web development and accessibility projects