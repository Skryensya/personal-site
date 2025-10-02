# CardSwap Astro Implementation

Esta es la versión nativa de Astro del componente CardSwap, sin dependencias de React.

## Archivos creados

- `CardSwapAstro.astro` - Componente principal de animación de cartas
- `HeroCardsAstro.astro` - Implementación específica para las cartas del hero
- `CARDSWAP_ASTRO_USAGE.md` - Esta documentación

## Uso básico

### Reemplazar en Hero.astro

Para usar la versión Astro en lugar de React, simplemente cambia:

```astro
<!-- ANTES: Versión React -->
<HeroCards
  cardDistance={50}
  verticalDistance={50}
  delay={6000}
  pauseOnHover={false}
  width={400}
  height={300}
  frontendTitle={t('hero.cards.frontend.title')}
  frontendDescription={t('hero.cards.frontend.description')}
  backendTitle={t('hero.cards.backend.title')}
  backendDescription={t('hero.cards.backend.description')}
  designTitle={t('hero.cards.design.title')}
  designDescription={t('hero.cards.design.description')}
  client:load
/>

<!-- DESPUÉS: Versión Astro -->
<HeroCardsAstro
  cardDistance={50}
  verticalDistance={50}
  delay={6000}
  pauseOnHover={false}
  width={400}
  height={300}
  frontendTitle={t('hero.cards.frontend.title')}
  frontendDescription={t('hero.cards.frontend.description')}
  backendTitle={t('hero.cards.backend.title')}
  backendDescription={t('hero.cards.backend.description')}
  designTitle={t('hero.cards.design.title')}
  designDescription={t('hero.cards.design.description')}
/>
```

### Importar el componente

```astro
---
import HeroCardsAstro from '../HeroCardsAstro.astro';
---
```

## Componente CardSwapAstro independiente

También puedes usar `CardSwapAstro` directamente con contenido personalizado:

```astro
---
import CardSwapAstro from './CardSwapAstro.astro';
---

<CardSwapAstro
  width={400}
  height={300}
  cardDistance={50}
  verticalDistance={50}
  delay={6000}
  pauseOnHover={true}
  easing="elastic"
>
  <div class="card-swap-card absolute top-1/2 left-1/2 border-2 border-main bg-secondary">
    <!-- Contenido de la primera carta -->
  </div>
  <div class="card-swap-card absolute top-1/2 left-1/2 border-2 border-main bg-secondary">
    <!-- Contenido de la segunda carta -->
  </div>
  <div class="card-swap-card absolute top-1/2 left-1/2 border-2 border-main bg-secondary">
    <!-- Contenido de la tercera carta -->
  </div>
</CardSwapAstro>
```

## Propiedades

### CardSwapAstro Props

| Propiedad | Tipo | Defecto | Descripción |
|-----------|------|---------|-------------|
| `width` | `number \| string` | `500` | Ancho del contenedor |
| `height` | `number \| string` | `400` | Alto del contenedor |
| `cardDistance` | `number` | `60` | Distancia horizontal entre cartas |
| `verticalDistance` | `number` | `70` | Distancia vertical entre cartas |
| `delay` | `number` | `5000` | Retraso entre animaciones (ms) |
| `pauseOnHover` | `boolean` | `false` | Pausar animación al hacer hover |
| `skewAmount` | `number` | `6` | Cantidad de inclinación en grados |
| `easing` | `'linear' \| 'elastic'` | `'elastic'` | Tipo de animación |
| `class` | `string` | `''` | Clases CSS adicionales |

### HeroCardsAstro Props

Incluye todas las props de `CardSwapAstro` más:

| Propiedad | Tipo | Defecto | Descripción |
|-----------|------|---------|-------------|
| `frontendTitle` | `string` | `'Frontend'` | Título de la carta frontend |
| `frontendDescription` | `string` | `'React, TypeScript, Astro'` | Descripción frontend |
| `backendTitle` | `string` | `'Backend'` | Título de la carta backend |
| `backendDescription` | `string` | `'Node.js, Python, APIs'` | Descripción backend |
| `designTitle` | `string` | `'Design'` | Título de la carta diseño |
| `designDescription` | `string` | `'UI/UX, Figma, Prototyping'` | Descripción diseño |
| `forceOS` | `'macos' \| 'windows' \| null` | `null` | Forzar estilo de OS |

## Dependencias

- **GSAP**: Se carga automáticamente desde CDN si no está disponible
- **Tailwind CSS**: Para estilos (ya incluido en el proyecto)

## Características mantenidas

✅ **Animaciones 3D con GSAP**: Mismas animaciones que la versión React  
✅ **Efecto elástico**: Configuración de easing flexible  
✅ **Pausa en hover**: Funcionalidad opcional de pausa  
✅ **Detección de OS**: Para estilos de ventana macOS/Windows  
✅ **Responsive**: Escalado automático para móviles  
✅ **Internacionalización**: Soporte completo para i18n  
✅ **Transiciones de Astro**: Compatible con navegación SPA  

## Diferencias con la versión React

- **Sin hidratación**: No requiere `client:load`
- **Menor bundle**: Sin React en el cliente para este componente
- **SSR nativo**: Renderizado completo en el servidor
- **GSAP CDN**: Se carga desde CDN en lugar de bundle
- **Clases estáticas**: Estructura HTML más predecible

## Compatibilidad

- ✅ **Astro 4.x+**
- ✅ **Navegadores modernos** (soporte para CSS transforms 3D)
- ✅ **GSAP 3.x**
- ✅ **Tailwind CSS 3.x+**

## Notas de implementación

1. **GSAP Loading**: El componente maneja automáticamente la carga de GSAP desde CDN
2. **Fallback**: Si GSAP no está disponible, se aplican transformaciones básicas
3. **OS Detection**: Detecta automáticamente macOS vs Windows para estilos de ventana
4. **Debug Mode**: Soporta `localStorage.setItem('debug-os', 'macos')` para debugging
5. **Performance**: Las animaciones usan `force3D: true` para aceleración de hardware

## Migración

Para migrar completamente del React al Astro:

1. Cambia la importación en `Hero.astro`
2. Remueve `client:load` 
3. Opcionalmente, remueve las dependencias React del componente
4. Testa que las animaciones funcionen correctamente

La implementación mantiene 100% de compatibilidad con la API existente.