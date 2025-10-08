import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// useCssVar.ts
import { useEffect, useRef, useState } from "react";

type UseCssVarOptions = {
  root?: HTMLElement | null;  // puede venir null en SSR
  throttleMs?: number;
  enableRafSample?: boolean;
};

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

function readCssVar(name: string, rootEl: HTMLElement | null) {
  if (!isBrowser() || !rootEl) return "";
  const v = getComputedStyle(rootEl).getPropertyValue(name).trim();
  return v || "";
}

export function useCssVar(
  name: string,
  { root = null, throttleMs = 400, enableRafSample = true }: UseCssVarOptions = {}
) {
  const [value, setValue] = useState<string>(""); // ❗️no leer en SSR
  const lastRef = useRef(value);
  const rafRef = useRef<number | null>(null);
  const intRef = useRef<number | null>(null);
  const moRootRef = useRef<MutationObserver | null>(null);
  const moHeadRef = useRef<MutationObserver | null>(null);
  const mqlRef = useRef<MediaQueryList | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isBrowser()) return;

    // Si no pasaron root, usamos <html>
    rootRef.current = root ?? document.documentElement;

    const update = () => {
      const next = readCssVar(name, rootRef.current);
      if (next && next !== lastRef.current) {
        lastRef.current = next;
        setValue(next);
      }
    };

    // 1) Mutaciones en <html>
    moRootRef.current = new MutationObserver(() => {
      if (enableRafSample) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(update);
      } else {
        update();
      }
    });
    moRootRef.current.observe(rootRef.current!, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // 2) Cambios en <head> (estilos/links)
    moHeadRef.current = new MutationObserver(() => {
      if (enableRafSample) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(update);
      } else {
        update();
      }
    });
    moHeadRef.current.observe(document.head, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["media", "disabled", "href"],
    });

    // 3) prefers-color-scheme
    let detachMediaListener: (() => void) | undefined;
    try {
      mqlRef.current = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => update();

      if (typeof mqlRef.current.addEventListener === "function") {
        mqlRef.current.addEventListener("change", handler);
        detachMediaListener = () => mqlRef.current?.removeEventListener?.("change", handler);
      } else {
        const legacyMql = mqlRef.current as unknown as {
          addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
          removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
        };
        legacyMql.addListener?.(handler);
        detachMediaListener = () => legacyMql.removeListener?.(handler);
      }
    } catch {}

    // 4) Polling suave + pausa al ocultarse
    const visibilityHandler = () => {
      if (document.hidden) {
        if (intRef.current) {
          window.clearInterval(intRef.current);
          intRef.current = null;
        }
      } else {
        if (intRef.current == null) {
          intRef.current = window.setInterval(update, throttleMs);
        }
        update();
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    visibilityHandler();

    // 5) Lectura inicial en cliente
    update();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intRef.current) window.clearInterval(intRef.current);
      moRootRef.current?.disconnect();
      moHeadRef.current?.disconnect();
      document.removeEventListener("visibilitychange", visibilityHandler);
      detachMediaListener?.();
    };
  }, [name, root, throttleMs, enableRafSample]);

  return value; // "" en SSR, se llena en cliente
}
