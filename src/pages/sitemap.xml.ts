import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

type Lang = "es" | "en" | "no";

const LANGS: Lang[] = ["es", "en", "no"];
const STATIC_PAGES: Record<Lang, string[]> = {
  es: ["", "proyectos/", "curriculum/", "declaracion-de-accesibilidad/", "arbol-de-contenido/"],
  en: ["en/", "en/projects/", "en/resume/", "en/accessibility-statement/", "en/content-tree/"],
  no: ["no/", "no/prosjekter/", "no/cv/", "no/tilgjengelighetserklaering/", "no/innholdstre/"],
};

/** Ensures siteUrl ends with '/' and joins paths cleanly */
function joinUrl(base: string, path: string) {
  const b = base.endsWith("/") ? base : base + "/";
  return b + path.replace(/^\/+/, "");
}

/** ISO 8601 without milliseconds for nicer diffs (optional) */
function iso(date: Date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Normalize project slug: remove lang prefix, .md/.mdx and trailing '/index' */
function normalizeSlug(id: string) {
  // remove leading "<lang>/"
  let s = id.replace(/^([a-z]{2})\//, "");
  // remove trailing '/index'
  s = s.replace(/\/index$/i, "");
  // drop file extensions .md or .mdx
  s = s.replace(/\.(md|mdx)$/i, "");
  // trim any accidental leading/trailing slashes
  s = s.replace(/^\/+|\/+$/g, "");
  return s;
}

/** Build a <url> block with optional hreflang alternates */
function buildUrlEntry(
  loc: string,
  lastmod: string,
  alternates?: Array<{ lang: string; href: string }>,
  xDefaultHref?: string
) {
  let entry = `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>`;
  if (alternates && alternates.length) {
    for (const alt of alternates) {
      entry += `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`;
    }
    if (xDefaultHref) {
      entry += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`;
    }
  }
  entry += `\n  </url>`;
  return entry;
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() ?? "https://skryensya.dev").replace(/\/+$/, "/");
  const now = iso(new Date());

  // 1) Carga colecciones por idioma
  const [projectsEs, projectsEn, projectsNo] = await Promise.all([
    getCollection("projects", ({ id }) => id.startsWith("es/")),
    getCollection("projects", ({ id }) => id.startsWith("en/")),
    getCollection("projects", ({ id }) => id.startsWith("no/")),
  ]);

  // 2) Indexa por slug qué idiomas existen
  type Item = { lang: Lang; slug: string; lastmod: string };
  const bySlug = new Map<
    string,
    {
      items: Partial<Record<Lang, Item>>;
    }
  >();

  function addProject(lang: Lang, id: string, publishDate?: Date | string) {
    const slug = normalizeSlug(id);
    const last = publishDate ? iso(new Date(publishDate)) : now;
    if (!bySlug.has(slug)) bySlug.set(slug, { items: {} });
    bySlug.get(slug)!.items[lang] = { lang, slug, lastmod: last };
  }

  projectsEs.forEach((p) => addProject("es", p.id, p.data.publishDate));
  projectsEn.forEach((p) => addProject("en", p.id, p.data.publishDate));
  projectsNo.forEach((p) => addProject("no", p.id, p.data.publishDate));

  // 3) Construye XML
  const entries: string[] = [];
  const seen = new Set<string>(); // evita duplicados exactos

  // 3a) Páginas estáticas con hreflang cruzado (todas existen)
  for (const lang of LANGS) {
    for (const path of STATIC_PAGES[lang]) {
      const loc = joinUrl(siteUrl, path);
      if (seen.has(loc)) continue;
      seen.add(loc);

      // Alternates para la misma ruta conceptual
      function semanticKey(p: string) {
        if (p === "" || p === "en/" || p === "no/") return "root";
        if (/proyectos\/$|en\/projects\/$|no\/prosjekter\/$/.test(p)) return "projects";
        if (/curriculum\/$|en\/resume\/$|no\/cv\/$/.test(p)) return "resume";
        if (/declaracion-de-accesibilidad\/$|en\/accessibility-statement\/$|no\/tilgjengelighetserklaering\/$/.test(p))
          return "accessibility";
        if (/arbol-de-contenido\/$|en\/content-tree\/$|no\/innholdstre\/$/.test(p)) return "content-tree";
        return null;
      }

      const key = semanticKey(path);
      let alternates: Array<{ lang: string; href: string }> = [];
      if (key === "root") {
        alternates = [
          { lang: "es", href: joinUrl(siteUrl, "") },
          { lang: "en", href: joinUrl(siteUrl, "en/") },
          { lang: "no", href: joinUrl(siteUrl, "no/") },
        ];
      } else if (key === "projects") {
        alternates = [
          { lang: "es", href: joinUrl(siteUrl, "proyectos/") },
          { lang: "en", href: joinUrl(siteUrl, "en/projects/") },
          { lang: "no", href: joinUrl(siteUrl, "no/prosjekter/") },
        ];
      } else if (key === "resume") {
        alternates = [
          { lang: "es", href: joinUrl(siteUrl, "curriculum/") },
          { lang: "en", href: joinUrl(siteUrl, "en/resume/") },
          { lang: "no", href: joinUrl(siteUrl, "no/cv/") },
        ];
      } else if (key === "accessibility") {
        alternates = [
          { lang: "es", href: joinUrl(siteUrl, "declaracion-de-accesibilidad/") },
          { lang: "en", href: joinUrl(siteUrl, "en/accessibility-statement/") },
          { lang: "no", href: joinUrl(siteUrl, "no/tilgjengelighetserklaering/") },
        ];
      } else if (key === "content-tree") {
        alternates = [
          { lang: "es", href: joinUrl(siteUrl, "arbol-de-contenido/") },
          { lang: "en", href: joinUrl(siteUrl, "en/content-tree/") },
          { lang: "no", href: joinUrl(siteUrl, "no/innholdstre/") },
        ];
      }

      const xDefault = alternates.length ? alternates.find((a) => a.lang === "es")?.href : undefined;
      entries.push(buildUrlEntry(loc, now, alternates, xDefault));
    }
  }

  // 3b) Páginas de proyectos: agrega sólo los hreflang que EXISTEN para ese slug
  for (const [slug, { items }] of bySlug.entries()) {
    // href por idioma si existe
    const hrefs: Partial<Record<Lang, string>> = {};
    for (const lang of LANGS) {
      if (items[lang]) {
        const segment = lang === "es" ? "proyectos/" : lang === "en" ? "en/projects/" : "no/prosjekter/";
        hrefs[lang] = joinUrl(siteUrl, `${segment}${slug}/`);
      }
    }

    // canonical: ES > EN > NO
    const canonicalLang: Lang | undefined =
      (items.es && "es") || (items.en && "en") || (items.no && "no") || undefined;

    if (!canonicalLang) continue;

    const loc = hrefs[canonicalLang]!;
    if (seen.has(loc)) continue;
    seen.add(loc);

    const lastmod =
      items[canonicalLang]?.lastmod ||
      items.es?.lastmod ||
      items.en?.lastmod ||
      items.no?.lastmod ||
      now;

    const alternates: Array<{ lang: string; href: string }> = [];
    for (const lang of LANGS) {
      const href = hrefs[lang];
      if (href) alternates.push({ lang, href });
    }
    const xDefault = hrefs.es ?? alternates[0]?.href;

    entries.push(buildUrlEntry(loc, lastmod, alternates, xDefault));
  }

  // 4) Orden estable
  entries.sort((a, b) => a.localeCompare(b));

  // 5) Ensambla XML
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=UTF-8" },
  });
};
