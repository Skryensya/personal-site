import { slugify } from '@/utils/common-utils';

const DEFAULT_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const GLOBAL_HANDLER_KEY = '__headingSlugHandlers__';

export interface HeadingSlugOptions {
    selector?: string;
    filter?: (heading: HTMLElement) => boolean;
    seen?: Set<string>;
}

export interface HeadingSlugResult {
    element: HTMLElement;
    id: string;
    text: string;
    level: number;
}

function ensureUniqueSlug(baseSlug: string, heading: HTMLElement, seen: Set<string>): string {
    const ownerDocument = heading.ownerDocument || document;
    const fallbackBase = baseSlug || slugify(heading.id) || 'heading';
    let candidate = heading.dataset.slugBase === baseSlug && heading.id ? heading.id : baseSlug || heading.id;

    if (!candidate) {
        candidate = fallbackBase;
    }

    if (!candidate) {
        candidate = 'heading';
    }

    // Ensure uniqueness across headings
    let suffix = 2;
    while ((candidate && seen.has(candidate) && heading.id !== candidate) ||
        (candidate && ownerDocument.getElementById(candidate) && ownerDocument.getElementById(candidate) !== heading)) {
        candidate = `${fallbackBase}-${suffix++}`;
    }

    heading.id = candidate;
    heading.dataset.slugBase = baseSlug;
    heading.dataset.slugGenerated = 'true';
    seen.add(candidate);

    return candidate;
}

export function applyHeadingSlugs(root: Element | Document, options: HeadingSlugOptions = {}): HeadingSlugResult[] {
    if (!root) {
        return [];
    }

    const selector = options.selector ?? DEFAULT_SELECTOR;
    const filter = options.filter ?? (() => true);
    const seen = options.seen ?? new Set<string>();
    const headings = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const results: HeadingSlugResult[] = [];

    headings.forEach((heading) => {
        if (!filter(heading)) {
            if (heading.id) {
                seen.add(heading.id);
            }
            return;
        }

        const text = heading.textContent?.trim() ?? '';
        if (!text) {
            if (heading.id) {
                seen.add(heading.id);
            }
            return;
        }

        const baseSlug = slugify(text) || 'heading';
        const id = ensureUniqueSlug(baseSlug, heading, seen);
        const level = Number.parseInt(heading.tagName.substring(1), 10) || 1;

        results.push({ element: heading, id, text, level });
    });

    return results;
}

export function initializeHeadingSlugs(rootId?: string | string[], options: HeadingSlugOptions = {}): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const ids = Array.isArray(rootId) ? rootId : rootId ? [rootId] : [];
    const handlerKey = ids.length > 0 ? ids.slice().sort().join('|') : 'default';
    const win = window as typeof window & {
        [GLOBAL_HANDLER_KEY]?: Map<string, () => void>;
    };

    const run = () => {
        const seen = new Set<string>();

        if (ids.length > 0) {
            ids.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    applyHeadingSlugs(element, { ...options, seen });
                }
            });
        } else {
            const containers = document.querySelectorAll<HTMLElement>('[data-heading-slug-root]');
            containers.forEach((container) => {
                applyHeadingSlugs(container, { ...options, seen });
            });
        }
    };

    const schedule = () => {
        if (typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(run);
        } else {
            window.setTimeout(run, 0);
        }
    };

    if (!win[GLOBAL_HANDLER_KEY]) {
        win[GLOBAL_HANDLER_KEY] = new Map();
    } else if (win[GLOBAL_HANDLER_KEY]!.has(handlerKey)) {
        const previousHandler = win[GLOBAL_HANDLER_KEY]!.get(handlerKey);
        if (previousHandler) {
            document.removeEventListener('astro:page-load', previousHandler);
        }
    }

    document.addEventListener('astro:page-load', schedule);
    win[GLOBAL_HANDLER_KEY]!.set(handlerKey, schedule);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule, { once: true });
    } else {
        schedule();
    }
}
