# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds Astro pages, React components, content collections, translations, and global styles (`components/`, `pages/`, `content/`, `i18n/`, `styles/`).
- `public/` serves static assets; reference them with `/...` paths.
- `tests/` stores Playwright specs such as `theme-toggle.spec.ts`; mirror this naming when adding scenarios.
- `astro.config.mjs`, `tsconfig.json`, and `playwright*.config.ts` are single sources for build, typing, and test options.

## Build, Test, and Development Commands
- `npm install` restores dependencies.
- `npm run dev` (alias `npm start`) boots the dev server at `http://localhost:4321`.
- `npm run build` compiles the production bundle; follow with `npm run preview` to smoke-test the output.
- `npm run astro check` runs the Astro+TypeScript analyzer used in CI.
- `npm run unlighthouse` profiles accessibility and performance; attach the report when requesting review.

## Coding Style & Naming Conventions
- Use 2-space indentation and TypeScript everywhere.
- Format code with Prettier + Tailwind plugin: `npx prettier --write "src/**/*.{astro,ts,tsx}"`.
- Components stay PascalCase (`HeroSection.astro`), utilities camelCase (`useLocale.ts`), and markdown/mdx slugs kebab-case.
- Tailwind utilities drive layout; reuse tokens from `styles/global.css` and honor the two-color palette in `STYLE_GUIDE.md`.

## Testing Guidelines
- Write end-to-end tests with Playwright under `tests/` using `*.spec.ts` filenames grouped by feature.
- Run `npm run test` before opening a PR; use `npm run test:ui` for debugging and `npm run test:cross-browser` ahead of releases.
- Set up data via Playwright fixtures; keep assertions friendly to light/dark theme toggles.

## Commit & Pull Request Guidelines
- Follow the short, imperative history style (`fix mobile`, `change fonts`); limit subjects to 50 chars and skip period endings.
- Bundle related changes per commit and include assets, i18n strings, and tests.
- Pull requests need a concise summary, linked issue or context, and before/after screenshots for UI-visible changes.
- Document new configuration or environment expectations in the PR and update relevant markdown.

## Internationalization & Content Updates
- Update all locales in `src/i18n/ui.ts` when adding strings; ship Spanish, English, and Norwegian together.
- Store structured content in `src/content/`; align frontmatter across locales and prefer MDX when React components are required.
- Place referenced assets in `public/` and link using absolute paths (`/images/...`).
