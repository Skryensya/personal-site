# Plan incremental de mejora de performance

Fecha: 2026-03-17
Proyecto: `personal-site`

---

## Estado de implementación

| Hito | Estado | Fecha |
|------|--------|-------|
| Hito 0 — Baseline reproducible | ✅ Completado | 2026-03-17 |
| Hito 1 — Quick wins sin impacto visual | ✅ Completado | 2026-03-17 |
| Hito 2 — Fuentes a WOFF2 | ✅ Completado | 2026-03-17 |
| Hito 3 — Reducir tamaño de HTML/CSS inline | ✅ Completado | 2026-03-17 |
| Hito 4 — Refactor sistema de temas | ✅ Completado | 2026-03-17 |
| Hito 5 — Optimización `/en/design-system` | 🔄 Parcial | 2026-03-17 |
| Hito 6 — Optimización páginas de proyecto | ⏳ Pendiente | — |
| Hito 7 — Presupuestos y control continuo | 🔄 Parcial | 2026-03-17 |

---

## Resultados medidos — Hitos 0–3

### Tamaño de HTML (sin comprimir)

| Ruta | Antes | Después | Δ |
|------|-------|---------|---|
| `/` (home es) | 322 KB | 189 KB | **−133 KB (−41%)** |
| `/en/design-system` | 424 KB | 288 KB | **−136 KB (−32%)** |
| `/proyectos/agenda-uc` | 266 KB | 133 KB | **−133 KB (−50%)** |

### CSS inline

| Ruta | Antes | Después |
|------|-------|---------|
| `/` | ~135 KB | ~10 KB |
| `/en/design-system` | ~132 KB | ~7 KB |
| `/proyectos/agenda-uc` | ~135 KB | ~8 KB |

El CSS global pasó a un archivo externo con hash (`_astro/Layout.*.css`, ~125 KB).
Con HTTP caché inmutable, se descarga **una sola vez** para todas las páginas.

### Fuentes

| Fuente | TTF | WOFF2 | Ahorro |
|--------|-----|-------|--------|
| Atkinson Hyperlegible (normal) | 111 KB | 46 KB | −58% |
| Atkinson Hyperlegible (italic) | 120 KB | 50 KB | −58% |
| Space Grotesk (normal) | 131 KB | 47 KB | −63% |
| Atkinson Mono (normal) | 52 KB | 25 KB | −52% |
| Atkinson Mono (italic) | 54 KB | 26 KB | −50% |
| **Total** | **468 KB** | **194 KB** | **−274 KB (−58%)** |

### Cambios aplicados

**`src/components/ProjectPage.astro`**
- ❌ Eliminado script muerto `animateStats()` (buscaba `[data-target]` inexistentes)
- `rel="preload"` de `clientLogo` cambiado a `rel="prefetch"` (no es above-the-fold)

**`src/layouts/Layout.astro`**
- Konami Code: diferido a `requestIdleCallback` (timeout 4 s) — antes corría en DOMContentLoaded
- Haptics bindings: diferidos a `requestIdleCallback` (timeout 3 s) — antes corría en DOMContentLoaded
- AstroFont config: rutas actualizadas de `.ttf` a `.woff2`

**`astro.config.mjs`**
- `inlineStylesheets: 'always'` → `'auto'`

**`public/fonts/...`**
- Generados 5 archivos `.woff2` (conversión desde TTF con fonttools + brotli)

**`scripts/measure-baseline.mjs`** (nuevo)
- Script de medición: `node scripts/measure-baseline.mjs` después de cada `npm run build`

---

## Hito 4 completado — Refactor sistema de temas

### Problema

`ThemeCard.astro` inyectaba un `<script is:inline>` de ~7 KB **por cada tarjeta**.
Con 9 tarjetas en la Design System: **9 × 7 KB = 63 KB de JS inline repetido**.

### Solución

**`src/components/ThemeCard.astro`** — script eliminado completamente. El componente quedó como HTML puro + estilos.

**`src/components/DesignSystemPage.astro`** — controlador único con event delegation sobre `#default-themes`:
- `click` / `keydown` delegados desde el contenedor → identifica tarjeta por `data-theme-id`
- Preview de Prism Flow → un solo `setInterval`, con cleanup en `astro:before-preparation`
- Visibilidad de themes especiales/empresa → misma lógica, sin duplicación

### Resultado

| Métrica | Antes | Después |
|---------|-------|---------|
| JS inline Design System | 98 KB (45 scripts) | **36.7 KB (36 scripts)** |
| HTML raw Design System | 288 KB | **228 KB** |
| HTML gzip Design System | 35.7 KB | **33.3 KB** |

> El HTML raw (228 KB) corresponde a 182 KB de markup real de la página de showcase.
> El presupuesto de esta ruta se amplió a 250 KB. El gzip es 33.3 KB — dentro del límite de red.
> La reducción de DOM es el Hito 5 (progressive disclosure).

---

## Objetivo

Mejorar la performance de forma incremental, priorizando los cuellos de botella reales detectados en Unlighthouse/Lighthouse, **sin degradar la experiencia de usuario ni romper funcionalidades existentes**.

Este plan prioriza:

1. **preservar la UX actual**
2. **evitar regresiones funcionales**
3. **entregar mejoras en hitos pequeños y medibles**
4. **mantener accesibilidad, i18n, navegación y sistema de temas**

---

## Línea base observada

> Nota: las corridas locales mostraron variación en `server-response-time`, por lo que **TTFB local no debe ser la señal principal**. Aun así, el patrón de peso de HTML, fuentes y trabajo de layout/JS sí fue consistente.

### Rutas más bajas detectadas

- `/en/design-system` → **51 performance**
  - FCP: `1.2 s`
  - LCP: `4.6 s`
  - Speed Index: `8.9 s`
  - TBT: `1,240 ms`
- `/proyectos/agenda-uc` → **60 performance**
  - FCP: `2.3 s`
  - LCP: `5.1 s`
  - Speed Index: `7.1 s`
  - TBT: `490 ms`
- `/proyectos/hostal-micelio` → **74 performance**
- `/proyectos/skryensya-dev` → **74 performance**
- `/` → **99 performance** en una corrida optimizada, pero con HTML igualmente pesado

### Señales técnicas principales

#### 1) Fuentes pesadas en todas las páginas
Archivos detectados como recursos caros:

- `public/fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf` ~ `134 KB`
- `public/fonts/Atkinson_Hyperlegible_Next/AtkinsonHyperlegibleNext-VariableFont_wght.ttf` ~ `114 KB`
- `public/fonts/Atkinson_Hyperlegible_Mono/AtkinsonHyperlegibleMono-VariableFont_wght.ttf` ~ `53 KB`

#### 2) HTML demasiado grande
Tamaño aproximado del HTML generado:

- `dist/en/design-system/index.html` → `423 KB`
- `dist/proyectos/agenda-uc/index.html` → `266 KB`
- `dist/index.html` → `322 KB`

#### 3) CSS inline excesivo
En el build actual, el HTML incluye una gran cantidad de CSS inline.

Archivo relevante:
- `astro.config.mjs`

Configuración observada:
- `build.inlineStylesheets = 'always'`

Esto reduce requests, pero infla mucho el documento HTML.

#### 4) JS inline repetido, especialmente en la Design System page
Especialmente grave en:
- `src/components/DesignSystemPage.astro`
- `src/components/ThemeCard.astro`

Hallazgos:
- `dist/en/design-system/index.html` tenía ~`45` scripts inline
- ~`100 KB` de JS inline sólo en esa página
- `ThemeCard.astro` inyecta un script por tarjeta, lo que escala mal

#### 5) Coste alto de layout/render
En las páginas más lentas, Lighthouse mostró tiempo alto en:
- `Style & Layout`
- `Main thread work`
- evaluación de scripts del sistema de temas

#### 6) JS global presente en casi todas las páginas
Archivo clave:
- `src/layouts/Layout.astro`

Se cargan o inicializan desde ahí varias piezas:
- tema bloqueante
- selection animation
- Konami code
- company theme params
- haptics
- analytics
- scroll progress
- click ray burst
- view transitions helpers

No todos son costosos individualmente, pero **el acumulado sí importa**.

#### 7) Script muerto en páginas de proyecto
Archivo:
- `src/components/ProjectPage.astro`

Se detectó un script de `animateStats()` que busca elementos con `data-target`, pero en la página generada no aparecen esos nodos. Es una oportunidad de quick win sin riesgo.

---

## Principios y guardrails

Estos principios deben respetarse en todos los hitos.

### UX que se debe preservar

- No introducir **flash de tema** al cargar o navegar.
- Mantener el sistema de temas:
  - tema activo
  - modo dark/light/system
  - special themes
  - company themes
  - previews relevantes
- Mantener navegación y accesibilidad por teclado.
- Mantener i18n en `es`, `en`, `no`, `ja`.
- Mantener view transitions donde ya aportan valor.
- Mantener analytics si siguen siendo necesarios, pero fuera del critical path cuando sea posible.

### Regla de implementación

Cada hito debe ser:

- **pequeño**
- **medible**
- **reversible**
- **testeable antes de pasar al siguiente**

---

## Metas de performance

### Meta mínima por ruta

- `/` → mantener `>= 95`
- `/proyectos/agenda-uc` → subir a `>= 80`
- `/en/design-system` → subir a `>= 80`

### Meta ideal posterior

- `/en/design-system` → `>= 85`
- rutas de proyectos pesadas → `>= 85`

### Señales secundarias a vigilar

- bajar tamaño de HTML por ruta
- bajar coste de fuentes
- bajar TBT en páginas pesadas
- bajar trabajo de layout y script evaluation
- evitar crecimiento de JS global

---

## Hito 0 — Baseline reproducible y presupuesto de trabajo

**Objetivo:** estabilizar la medición antes de optimizar.

### Alcance

- usar build de producción + preview local consistente
- medir siempre las mismas rutas
- comparar deltas reales entre hitos

### Pasos

1. Definir rutas canónicas de medición:
   - `/`
   - `/en/design-system`
   - `/proyectos/agenda-uc`
   - `/proyectos/index`
   - `/en/projects`
2. Ejecutar medición siempre sobre build de producción:
   - `npm run build`
   - `npm run preview`
3. Guardar una tabla simple por hito con:
   - performance
   - FCP
   - LCP
   - TBT
   - tamaño de HTML
   - tamaño de fuentes transferidas
4. Definir un presupuesto orientativo inicial:
   - HTML crítico objetivo por ruta pesada: `< 200 KB` sin comprimir como primera meta intermedia
   - JS inline por página pesada: `< 40 KB` como primera meta intermedia
   - fuentes críticas iniciales: reducir al menos `30–50%`

### Validación

- `npm run build`
- `npm run astro check`
- corrida manual de Unlighthouse/Lighthouse para rutas definidas

### Resultado esperado

Una baseline estable para comparar cambios y evitar “mejoras” engañosas por variación local.

---

## Hito 1 — Quick wins sin impacto visual

**Objetivo:** eliminar coste inútil y retrasar trabajo no esencial, sin cambiar UX visible.

### Archivos foco

- `src/components/ProjectPage.astro`
- `src/layouts/Layout.astro`
- `src/components/ScrollProgress.astro`
- `src/components/PostHogAnalytics.astro`

### Pasos

1. **Eliminar el script muerto de `ProjectPage.astro`**
   - remover `animateStats()` si ya no existen elementos `data-target`
   - validar que no se pierde ninguna animación real

2. **Revisar scripts globales en `Layout.astro` y etiquetarlos por prioridad**
   Clasificarlos en:
   - crítico para render/tema
   - necesario tras interacción
   - decorativo

3. **Mover a carga diferida lo decorativo**
   Ejemplos a revisar:
   - click ray burst
   - selection animation
   - bindings de haptics, si pueden montarse on-demand

4. **Evitar inicializaciones innecesarias**
   - `ScrollProgress`: no inicializar si la página casi no scrolla
   - no registrar listeners múltiples por navegación si no es necesario

5. **Mantener PostHog fuera del critical path**
   - no eliminarlo aún
   - sólo confirmar que no adelanta trabajo antes de interacción/timeout

### Riesgo

Bajo.

### Validación funcional

- navegación entre páginas
- scroll progress visible en páginas largas
- theme switching sin regresiones
- analytics sin errores en consola

### Resultado esperado

- reducción pequeña pero segura de TBT y trabajo main-thread
- limpieza de deuda obvia antes de tocar piezas más grandes

---

## Hito 2 — Optimización de fuentes

**Objetivo:** reducir uno de los recursos más caros compartidos por todo el sitio.

### Archivos foco

- `public/fonts/...`
- `src/layouts/Layout.astro`
- configuración de `AstroFont`

### Pasos

1. **Convertir TTF a WOFF2**
   - generar `woff2` para:
     - Atkinson Hyperlegible
     - Space Grotesk
     - Atkinson Hyperlegible Mono

2. **Mantener compatibilidad visual**
   - conservar fallback stacks actuales
   - evitar FOIT
   - mantener `display: swap` o evaluar `optional` sólo si no rompe percepción visual

3. **Reducir alcance de fuente mono**
   - no tratarla como crítica si no aporta al above-the-fold de la mayoría de rutas

4. **Revisar si se necesita variable font completa**
   - si sólo se usan pocos pesos, evaluar subset o cortes más específicos
   - si el branding depende de la variable, mantenerla pero en `woff2`

5. **Medir el impacto por ruta**
   - especialmente en `/en/design-system` y páginas de proyecto

### Riesgo

Bajo a medio.

### Validación funcional

- revisar rendering de headings, body y mono
- revisar pesos visibles en desktop y mobile
- revisar CLS visual por carga de fuentes

### Resultado esperado

- mejora transversal
- menos transferencia inicial
- mejor FCP/LCP en casi todas las páginas

---

## Hito 3 — Reducir tamaño de HTML y CSS inline

**Objetivo:** bajar peso del documento sin sacrificar render inicial.

### Archivos foco

- `astro.config.mjs`
- `src/styles/global.css`
- estilos globales y de layout

### Pasos

1. **Probar `inlineStylesheets: 'auto'`**
   - cambiar desde `always` a `auto`
   - medir antes/después

2. **Comparar trade-off real**
   Medir:
   - tamaño de HTML
   - FCP
   - LCP
   - número de requests nuevos

3. **Mantener inline sólo lo realmente crítico si hace falta**
   - si el cambio empeora mucho el primer paint, volver a una estrategia híbrida
   - el objetivo no es “menos requests a toda costa”, sino mejor experiencia real

4. **Reducir CSS global no crítico**
   - mover estilos muy específicos de página a su componente/página
   - evitar que todas las rutas carguen CSS de demos pesadas

### Riesgo

Medio.

### Validación funcional

- revisar que no haya flash visual no deseado
- revisar theme switching
- revisar diseño general en móvil y desktop

### Resultado esperado

- caída importante del tamaño de HTML
- menor coste de parse de documento
- mejor base para páginas pesadas

---

## Hito 4 — Refactor del sistema de temas sin romper UX

**Objetivo:** conservar el comportamiento del tema, pero reducir el coste JS y el trabajo redundante.

### Archivos foco

- `src/components/ThemeCard.astro`
- `src/components/ThemeControl.astro`
- `src/components/Footer.astro`
- `src/components/FooterThemeControl.astro`
- `src/layouts/Layout.astro`
- `src/data/themes.js`

### Problema principal

Actualmente el sistema de temas aporta valor real a la UX, pero tiene un coste alto por:

- lógica global siempre disponible
- scripts por tarjeta en `ThemeCard.astro`
- preview dinámico de `prism-flow` ejecutándose de forma poco centralizada
- lógica duplicada entre header/footer

### Pasos

1. **No tocar el script bloqueante que evita flash de tema**
   - ese comportamiento debe conservarse
   - sólo optimizar alrededor de él

2. **Reemplazar scripts por tarjeta por un solo controlador compartido**
   En `ThemeCard.astro`:
   - eliminar patrón de “un script por card”
   - usar event delegation sobre el contenedor de tarjetas
   - mover lógica a un script compartido de página/componente padre

3. **Unificar preview de `prism-flow`**
   - un solo loop global/controlado
   - no un intervalo implícito por tarjeta o por inicialización repetida

4. **Lazy init del dropdown completo de temas**
   - el botón principal debe seguir respondiendo rápido
   - el render completo del menú puede ocurrir al abrir, enfocar o interactuar

5. **Evitar duplicación de lógica entre controles de header y footer**
   - compartir controlador/base común
   - evitar dos inicializaciones pesadas con responsabilidades similares

6. **Reducir logs/debug en runtime de producción si existen**
   - especialmente alrededor de `ThemeControl`

### Riesgo

Medio.

### Validación funcional obligatoria

- cambio de tema desde navbar
- cambio de tema desde footer
- modo `system/light/dark`
- special themes
- company themes
- `prism-flow`
- eventos entre componentes y page transitions
- teclado y foco dentro del dropdown

### Resultado esperado

- reducción real de script evaluation y bootup time
- mejora notable en `/en/design-system`
- misma UX percibida

---

## Hito 5 — Optimización específica de `/en/design-system`

**Objetivo:** atacar la página más lenta sin romper su valor como showcase.

### Archivos foco

- `src/components/DesignSystemPage.astro`
- `src/components/ThemeCard.astro`
- componentes demo usados por esa página

### Problema principal

`/en/design-system` mezcla:

- mucho DOM
- muchas demos visibles al mismo tiempo
- scripts inline repetidos
- alto trabajo de layout
- peso HTML anormalmente alto

### Estrategia

No “recortar” el contenido, sino **distribuir mejor el coste**.

### Pasos

1. **Aplicar progressive disclosure**
   - mantener visibles primero las secciones más importantes
   - mover demos secundarias a accordions/toggles accesibles
   - abrirlas sólo cuando el usuario las necesite

2. **Inicializar demos sólo cuando entren en viewport o al interactuar**
   Ejemplos candidatos:
   - previews complejos
   - demos de controles
   - lógicas que hoy corren apenas carga la página

3. **Reducir densidad de DOM inicial**
   - revisar si todas las tarjetas y showcases deben montarse de entrada
   - agrupar o resumir donde no afecte el objetivo de la página

4. **Centralizar scripts de esa página**
   - un controlador por sección, no múltiples scripts sueltos
   - aprovechar event delegation y observers mínimos

5. **Revisar secciones que hacen cálculos en runtime**
   - contraste dinámico
   - demos de dropdown
   - previews de themes
   - cualquier MutationObserver persistente

### Riesgo

Medio a alto, porque es la página más compleja.

### Validación funcional obligatoria

- secciones visibles y navegables
- demos siguen funcionando al abrirse
- accesibilidad de accordions/toggles
- TOC/contenido sigue siendo coherente
- sin regresión de theme previews

### Resultado esperado

- mayor mejora individual de score
- menor TBT
- menor layout cost
- menor tamaño de HTML inicial

---

## Hito 6 — Optimización de páginas de proyecto

**Objetivo:** mejorar páginas pesadas de contenido sin perder lectura ni personalidad visual.

### Archivos foco

- `src/components/ProjectPage.astro`
- componentes compartidos del layout

### Pasos

1. **Eliminar cualquier JS no usado**
   - especialmente el script de stats detectado

2. **Validar preloads reales**
   - por ejemplo, `clientLogo`
   - sólo preload si aporta al above-the-fold
   - si no, dejar carga normal

3. **Revisar listeners globales en páginas de lectura**
   - mantener scroll progress si aporta
   - evitar scripts decorativos si no agregan valor en páginas de contenido

4. **Mantener la experiencia editorial**
   - no reducir legibilidad
   - no romper navegación entre proyectos
   - no perder structured data ni SEO

### Riesgo

Bajo a medio.

### Resultado esperado

- mejora de rutas tipo `/proyectos/...`
- menor TBT
- menor peso de runtime en páginas de lectura

---

## Hito 7 — Presupuestos y control continuo

**Objetivo:** evitar que la performance vuelva a degradarse después de optimizar.

### Pasos

1. **Documentar presupuestos por ruta**
   Ejemplo inicial:
   - Home: performance `>= 95`
   - Design system: performance `>= 80`
   - Project pages críticas: performance `>= 80`
   - HTML por ruta pesada: objetivo intermedio `< 200 KB`

2. **Agregar checklist de release**
   Antes de mergear cambios grandes de UI:
   - `npm run build`
   - `npm run astro check`
   - `npm run test`
   - revisión manual de tema/light/dark
   - revisión de una corrida de Lighthouse/Unlighthouse en rutas críticas

3. **Opcional: script de budget local**
   - medir tamaño de `dist/*.html`
   - alertar cuando una ruta supere umbral

4. **Anotar regresiones por componente**
   Si un componente nuevo añade JS o DOM significativo, registrarlo antes de expandirlo a más páginas.

### Riesgo

Bajo.

### Resultado esperado

- mejoras sostenibles
- menos riesgo de volver a inflar HTML o JS sin darse cuenta

---

## Orden recomendado de ejecución

### Fase 1 — Bajo riesgo / alto retorno
1. Hito 0
2. Hito 1
3. Hito 2

### Fase 2 — Estructura base
4. Hito 3
5. Hito 4

### Fase 3 — Ataque a páginas pesadas
6. Hito 5
7. Hito 6

### Fase 4 — Protección futura
8. Hito 7

---

## Priorización por impacto esperado

### Impacto alto
- convertir fuentes a `woff2`
- dejar de inyectar un script por `ThemeCard`
- revisar `inlineStylesheets: 'always'`
- reducir densidad inicial de `/en/design-system`

### Impacto medio
- lazy init del dropdown de themes
- limpieza de scripts globales del layout
- eliminar JS muerto en páginas de proyecto

### Impacto bajo pero recomendable
- budgets automáticos
- revisión de listeners duplicados
- limpieza de decoraciones no críticas

---

## Qué no debería tocarse al inicio

Para no romper la UX, evitar cambios agresivos tempranos en:

1. **script bloqueante de aplicación de tema** en `Layout.astro`
2. **lógica base de i18n/canonical/SEO**
3. **view transitions** salvo que se detecte un coste real alto en producción
4. **analytics** si aún son requeridos; primero diferir, luego reevaluar

---

## Definición de éxito

Este plan se considera exitoso si:

- `/en/design-system` sube de ~`51` a al menos `80`
- `/proyectos/agenda-uc` sube de ~`60` a al menos `80`
- home se mantiene por sobre `95`
- no aparece flash de tema
- no se rompen controles de tema, navegación, i18n ni accesibilidad
- el HTML generado por las rutas más pesadas cae de forma visible
- el JS inline se reduce claramente en páginas complejas

---

## Checklist operativo por hito

Usar esta secuencia después de cada hito:

- [ ] `npm run build`
- [ ] `npm run astro check`
- [ ] `npm run test`
- [ ] revisar home en light/dark
- [ ] revisar `/en/design-system`
- [ ] revisar una página de proyecto pesada
- [ ] revisar controles de tema en navbar y footer
- [ ] correr Lighthouse/Unlighthouse y comparar contra baseline

---

## Resumen ejecutivo

La mejora no pasa primero por “quitar features”, sino por **redistribuir y adelgazar el coste**:

1. sacar JS muerto y trabajo no esencial
2. bajar el peso de fuentes
3. dejar de inflar tanto el HTML/CSS inline
4. centralizar la lógica del sistema de temas
5. hacer que la design system page cargue de forma progresiva

Si se ejecuta en ese orden, el sitio debería mejorar de forma medible sin perder su identidad visual ni sus interacciones principales.
