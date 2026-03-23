import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projectRoot, spriteBundles } from './sprite-bundles.config.mjs';

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) return walk(entryPath);
            return entry.isFile() ? [entryPath] : [];
        })
    );

    return files.flat();
}

function keepsWhiteFill(name) {
    return name.includes('eye') || name.startsWith('smile-');
}

function runtimeSvg(raw, name, whiteColor = 'var(--avatar-white)') {
    const whiteFill = keepsWhiteFill(name) ? whiteColor : 'none';

    return raw
        .replaceAll('fill="#ffffff"', `fill="${whiteFill}"`)
        .replaceAll('fill="#fefefe"', 'fill="var(--avatar-black)"')
        .replaceAll('fill="#808080"', 'fill="var(--avatar-gray)"')
        .replaceAll('fill="#000000"', 'fill="var(--avatar-black)"');
}

function previewSvg(raw, name) {
    const whiteFill = keepsWhiteFill(name) ? '#f2f2f2' : 'none';

    return raw
        .replaceAll('fill="#ffffff"', `fill="${whiteFill}"`)
        .replaceAll('fill="#fefefe"', 'fill="#111111"')
        .replaceAll('fill="#808080"', 'fill="#8d8d8d"')
        .replaceAll('fill="#000000"', 'fill="#111111"');
}

function getViewBox(raw) {
    const match = raw.match(/viewBox="([^"]+)"/i);
    return match?.[1] ?? '0 0 25 25';
}

function svgInner(raw, name, transform) {
    return transform(raw, name)
        .replace(/^<svg[^>]*>/i, '')
        .replace(/<\/svg>\s*$/i, '')
        .replace(/>\s+</g, '><')
        .trim();
}

function buildManifest(bundle, tiles, width, height, previewLayout) {
    return {
        name: bundle.name,
        symbolPrefix: bundle.symbolPrefix,
        generatedAt: new Date().toISOString(),
        tileCount: tiles.length,
        sourceDir: path.relative(projectRoot, bundle.sourceDir),
        outputDir: path.relative(projectRoot, bundle.outputDir),
        width,
        height,
        columns: previewLayout.columns,
        rows: previewLayout.rows,
        squareSide: previewLayout.squareSide,
        tileSize: bundle.tileSize,
        padding: bundle.padding,
        tiles: tiles.map(({ name, source, viewBox }) => ({
            name,
            source: path.relative(projectRoot, source),
            viewBox
        }))
    };
}

function getPreviewTileGroup(name) {
    if (name.includes('eye')) return 0;
    if (name.includes('mouth') || name.includes('neutral-') || name.includes('closed-') || name.includes('smile-') || /^[aeiou]-/.test(name)) return 1;
    if (
        name.startsWith('base-tile-00') ||
        name.startsWith('base-tile-01') ||
        name.startsWith('base-tile-02') ||
        name.startsWith('base-tile-03') ||
        name.startsWith('base-tile-04') ||
        name.startsWith('base-tile-05') ||
        name.startsWith('base-tile-06') ||
        name.startsWith('base-tile-07') ||
        name.startsWith('base-tile-08') ||
        name.startsWith('base-tile-09') ||
        name.startsWith('base-tile-10')
    )
        return 2;
    if (
        name.includes('sweater-alt') ||
        name.startsWith('base-tile-11') ||
        name.startsWith('base-tile-12') ||
        name.startsWith('base-tile-13') ||
        name.startsWith('base-tile-14') ||
        name.startsWith('base-tile-15') ||
        name.startsWith('base-tile-16') ||
        name.startsWith('base-tile-17') ||
        name.startsWith('base-tile-18') ||
        name.startsWith('base-tile-19') ||
        name.startsWith('base-tile-20') ||
        name.startsWith('base-tile-21') ||
        name.startsWith('base-tile-22')
    )
        return 3;
    return 4;
}

function getSquarePreviewLayout(tileCount) {
    if (tileCount <= 0) {
        return { columns: 1, rows: 1, squareSide: 1 };
    }

    const squareSide = Math.max(1, Math.ceil(Math.sqrt(tileCount)));
    const columns = squareSide;
    const rows = Math.max(1, Math.ceil(tileCount / columns));

    return { columns, rows, squareSide };
}

const subtileViewBoxes = [
    { suffix: 'q0', viewBox: '0 0 12.5 12.5' },
    { suffix: 'q1', viewBox: '12.5 0 12.5 12.5' },
    { suffix: 'q2', viewBox: '0 12.5 12.5 12.5' },
    { suffix: 'q3', viewBox: '12.5 12.5 12.5 12.5' }
];

function buildSubtileSymbols(bundle, tile) {
    return subtileViewBoxes
        .map(
            ({ suffix, viewBox }) =>
                `<symbol id="${bundle.symbolPrefix}-${tile.name}--${suffix}" viewBox="${viewBox}" overflow="hidden">${tile.themedInner}</symbol>`
        )
        .join('');
}

function buildTilesetSvg(bundle, tiles) {
    const hiddenPreviewTiles = new Set([
        'shirt-tile-11',
        'shirt-tile-12',
        'shirt-tile-13',
        'shirt-tile-14',
        'shirt-tile-15',
        'shirt-tile-17',
        'shirt-tile-18',
        'shirt-tile-19',
        'shirt-tile-20',
        'shirt-tile-21',
        'shirt-tile-22'
    ]);
    const previewTiles = tiles
        .filter((tile) => !tile.isBlank && !hiddenPreviewTiles.has(tile.name))
        .sort((a, b) => {
            const groupDiff = getPreviewTileGroup(a.name) - getPreviewTileGroup(b.name);
            return groupDiff !== 0 ? groupDiff : a.name.localeCompare(b.name);
        });
    const previewLayout = getSquarePreviewLayout(previewTiles.length);
    const { columns, rows, squareSide } = previewLayout;
    const tileSize = bundle.tileSize ?? 25;
    const padding = bundle.padding ?? 8;
    const cellSize = tileSize + padding * 2;
    const width = squareSide * cellSize;
    const height = squareSide * cellSize;
    const verticalOffset = ((squareSide - rows) * cellSize) / 2;

    const themedSymbols = tiles
        .map(
            (tile) =>
                `<symbol id="${bundle.symbolPrefix}-${tile.name}" viewBox="${tile.viewBox}">${tile.themedInner}</symbol>${buildSubtileSymbols(bundle, tile)}`
        )
        .join('');

    const previewSymbols = tiles
        .map((tile) => `<symbol id="${bundle.symbolPrefix}-preview-${tile.name}" viewBox="${tile.viewBox}">${tile.previewInner}</symbol>`)
        .join('');

    const cells = previewTiles
        .map((tile, index) => {
            const row = Math.floor(index / columns);
            const rowStart = row * columns;
            const rowTileCount = Math.min(columns, previewTiles.length - rowStart);
            const col = index - rowStart;
            const horizontalOffset = ((squareSide - rowTileCount) * cellSize) / 2;
            const x = horizontalOffset + col * cellSize + padding;
            const y = verticalOffset + row * cellSize + padding;
            return `<use href="#${bundle.symbolPrefix}-preview-${tile.name}" x="${x}" y="${y}" width="${tileSize}" height="${tileSize}"/>`;
        })
        .join('\n');

    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
        `  <rect width="${width}" height="${height}" fill="${bundle.background ?? '#f6f6f6'}"/>`,
        `  <defs data-generated-sprite="${bundle.name}">${themedSymbols}${previewSymbols}</defs>`,
        cells,
        '</svg>',
        ''
    ].join('\n');

    return { svg, width, height, previewLayout };
}

async function buildBundle(bundle) {
    const filePaths = (await walk(bundle.sourceDir)).filter((filePath) => filePath.endsWith('.svg')).sort((a, b) => a.localeCompare(b));

    const seenNames = new Map();
    const tiles = [];

    for (const filePath of filePaths) {
        const name = path.basename(filePath, '.svg');
        const existing = seenNames.get(name);
        if (existing) {
            throw new Error(`Duplicate avatar tile name "${name}" in:\n- ${existing}\n- ${filePath}`);
        }

        seenNames.set(name, filePath);

        const raw = await readFile(filePath, 'utf8');
        tiles.push({
            name,
            source: filePath,
            viewBox: getViewBox(raw),
            themedInner: svgInner(raw, name, runtimeSvg),
            previewInner: svgInner(raw, name, previewSvg),
            isBlank: !raw.includes('#000000') && !raw.includes('#808080') && !raw.includes('#fefefe')
        });
    }

    const { svg, width, height, previewLayout } = buildTilesetSvg(bundle, tiles);
    const manifest = buildManifest(bundle, tiles, width, height, previewLayout);

    await mkdir(bundle.outputDir, { recursive: true });

    const tilesetSvgPath = path.join(bundle.outputDir, 'tileset.svg');
    const manifestPath = path.join(bundle.outputDir, 'manifest.json');

    await writeFile(tilesetSvgPath, svg, 'utf8');
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    return {
        ...manifest,
        outputs: {
            tilesetSvg: path.relative(projectRoot, tilesetSvgPath),
            manifest: path.relative(projectRoot, manifestPath)
        }
    };
}

async function cleanupLegacyOutputs() {
    await rm(path.join(projectRoot, 'src/generated/avatar'), { recursive: true, force: true });
    await rm(path.join(projectRoot, 'src/generated/avatar-sprite.svg'), { force: true });
    await rm(path.join(projectRoot, 'src/generated/avatar-sprite-manifest.json'), { force: true });
    await rm(path.join(projectRoot, 'src/assets/avatar/tileset-grayscale.png'), { force: true });
    await rm(path.join(projectRoot, 'public/images/avatar/avatar-sprite-preview.png'), { force: true });
}

async function main() {
    await cleanupLegacyOutputs();

    const results = [];
    for (const bundle of spriteBundles) {
        results.push(await buildBundle(bundle));
    }

    results.forEach((result) => {
        console.log(`Generated ${result.name}: ${result.tileCount} tiles`);
        console.log(`- ${result.outputs.tilesetSvg}`);
        console.log(`- ${result.outputs.manifest}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
