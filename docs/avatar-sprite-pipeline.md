# Avatar sprite pipeline

## Qué genera

El build step del avatar toma todos los tiles SVG separados desde:

- `src/assets/avatar/tiles/`

Y genera estos archivos en:

- `src/generated/avatar/sprite.svg` → sprite SVG consolidado que consume el sitio
- `src/generated/avatar/sprite-grayscale.svg` → sprite equivalente en grayscale para inspección técnica (defs/symbols)
- `src/generated/avatar/tileset-grayscale.svg` → tileset visible en grayscale para preview directa
- `src/generated/avatar/manifest.json` → inventario de tiles incluidos
- `src/generated/avatar/preview.svg` → hoja visual en grayscale con labels para inspección rápida
- `public/images/avatar/avatar-sprite-preview.png` → preview rasterizado para revisar sin abrir el SVG

## Script principal

- `scripts/avatar/generate-sprite-sheet.mjs`

## Configuración extensible

- `scripts/avatar/sprite-bundles.config.mjs`

Ahí puedes agregar más bundles si en el futuro quieres generar otros sprites además del avatar.

Ejemplo:

```js
export const spriteBundles = [
  {
    name: 'avatar',
    symbolPrefix: 'avatar-sprite',
    sourceDir: path.join(projectRoot, 'src/assets/avatar/tiles'),
    outputDir: path.join(projectRoot, 'src/generated/avatar'),
    tileSize: 25,
    previewColumns: 6,
  },
];
```

## Cómo replicar el proceso

### Regenerar el sprite

```bash
npm run avatar:sprite
```

### Qué hace ese comando

1. Lee todos los `*.svg` dentro de `src/assets/avatar/tiles/`
2. Valida que no existan nombres duplicados
3. Reemplaza colores base por variables del tema para el runtime
4. Genera una versión grayscale fija para preview
5. Construye un sprite SVG único con todos los symbols
6. Genera un manifest JSON
7. Genera un preview SVG ordenado en grilla

### Rasterizar el preview a PNG

Si quieres volver a generar la versión rasterizada:

1. levanta el proyecto o sirve el archivo localmente
2. abre `src/generated/avatar/preview.svg`
3. si quieres inspeccionar el tileset visible en grayscale, usa `src/generated/avatar/tileset-grayscale.svg`
4. si quieres inspeccionar la versión técnica consolidada con symbols, usa `src/generated/avatar/sprite-grayscale.svg`
5. exporta o captura a PNG en:
   - `public/images/avatar/avatar-sprite-preview.png`

En este repo la fuente de verdad sigue siendo el SVG generado. El PNG existe solo para inspección visual rápida.

## Flujo recomendado para agregar tiles

1. agrega el nuevo tile en `src/assets/avatar/tiles/...`
2. ejecuta `npm run avatar:sprite`
3. revisa:
   - `src/generated/avatar/manifest.json`
   - `src/generated/avatar/preview.svg`
   - `public/images/avatar/avatar-sprite-preview.png`
4. usa el tile nuevo desde el avatar

## Nota

El runtime sigue usando SVG porque permite mantener el theming dinámico por CSS variables. El PNG es solo una referencia visual rasterizada.
