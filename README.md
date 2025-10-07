# Allison Peña - Personal Site

A multilingual portfolio for product designer and creative technologist Allison Peña. The site curates projects, writing, and an interactive CV with a brutalist-inspired visual system. It is built with Astro for hybrid rendering, React for dynamic components, and Tailwind for consistent styling.

## Highlights
- Three fully localized experiences (Spanish default, English, Norwegian) delivered with Astro content collections and shared layouts.
- Interactive project browsing (table, carousel, tags) powered by React components and MDX-driven content.
- Printable curriculum, accessibility statement, and design system pages generated from the same content pipeline.
- Image optimization, favicon management, and caching tuned for Vercel via `vercel.json`.

## Tech Stack
- Astro 5 with MDX for hybrid static/server rendering
- React 18 and TanStack Table for rich UI patterns
- Tailwind CSS 4 + custom design tokens defined in `src/styles`
- TypeScript end-to-end with `astro check` type safety
- Playwright for cross-browser end-to-end tests

## Getting Started
```bash
# prerequisites
node --version  # >= 18

# install dependencies
npm install

# start local development
npm run dev
# open http://localhost:4321
```

## Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Astro dev server with hot module reload. |
| `npm run build` | Generate the production build in `dist/`. |
| `npm run preview` | Serve the built output locally for QA. |
| `npm run astro check` | Run Astro + TypeScript diagnostics used in CI. |
| `npm run test` | Execute Playwright specs headless. |
| `npm run test:ui` | Launch the Playwright UI runner for debugging. |
| `npm run test:cross-browser` | Validate against Chromium, Firefox, and WebKit configs. |
| `npm run unlighthouse` | Audit performance and accessibility; share the generated report. |

## Project Structure
```text
src/
  components/        # Shared Astro/React UI, including design system and CV modules
  content/           # MDX collections for projects, blog entries, and metadata
  i18n/              # Locale dictionaries and utilities used across pages
  layouts/           # Base layouts that orchestrate page shells and partials
  pages/             # Astro routes for localized pages and API endpoints
  styles/            # Global CSS, tokens, and Tailwind configuration helpers
public/              # Static assets (fonts, images, PDFs) served as-is
tests/               # Playwright E2E suites grouped by feature
```

## Content & Internationalization
- Add or update strings in `src/i18n/ui.ts` and ship translations for `es`, `en`, and `no` together.
- MDX content lives in `src/content`; align frontmatter across locales and leverage React components when needed.
- Store public-facing assets in `public/` and reference them with absolute paths such as `/img/...`.

## Testing
- Playwright specs reside in `tests/`. Mirror existing naming (`theme-toggle.spec.ts`, `company-themes.spec.ts`) when adding coverage.
- Use `npm run test:ui` to debug scenarios that depend on theme toggles or locale switching.
- Prefer fixtures and network mocking over relying on external services to keep runs deterministic.

## Deployment
- The project is optimized for Vercel. `vercel.json` controls long-term caching for Astro assets, fonts, media, and PDFs.
- Build outputs are static; ensure environment secrets (if introduced) are defined through Vercel project settings.

## Documentation & Contributing
- Contributor workflows, commands, and expectations are documented in [`AGENTS.md`](AGENTS.md).
- Visual design language and component rules live in [`STYLE_GUIDE.md`](STYLE_GUIDE.md).
- When opening a PR, include screenshots or recordings for UI changes in at least two locales and link relevant issues.
