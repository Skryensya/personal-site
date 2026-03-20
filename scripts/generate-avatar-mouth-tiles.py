#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print('Pillow is required. Install it with: python3 -m pip install pillow', file=sys.stderr)
    raise

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / 'src/assets/avatar/mouth'
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/mouth/expressions'
MANIFEST_PATH = OUTPUT_DIR / 'manifest.json'

AVATAR_ART_SIZE = 128
AVATAR_CANVAS_SIZE = 150
AVATAR_TILE_SIZE = 25
AVATAR_ART_OFFSET_X = 11
AVATAR_ART_OFFSET_Y = 10
MOUTH_ROW = 3
MOUTH_LEFT_COL = 2
MOUTH_RIGHT_COL = 3

PALETTE = [
    (255, 255, 255, 255),
    (128, 128, 128, 255),
    (0, 0, 0, 255),
]
PALETTE_TO_HEX = {
    (255, 255, 255, 255): '#ffffff',
    (128, 128, 128, 255): '#808080',
    (0, 0, 0, 255): '#000000',
}
FOREGROUND_WHITE_HEX = '#fefefe'
DRAW_COLORS = [
    (128, 128, 128, 255),
    (0, 0, 0, 255),
]


def nearest_palette_color(pixel: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    if pixel[3] == 0:
        return PALETTE[0]

    best_color = PALETTE[0]
    best_distance = None
    for color in PALETTE:
        distance = sum((pixel[i] - color[i]) ** 2 for i in range(3))
        if best_distance is None or distance < best_distance:
            best_distance = distance
            best_color = color
    return best_color


def normalize_source(image: Image.Image) -> Image.Image:
    resized = image.convert('RGBA').resize((AVATAR_ART_SIZE, AVATAR_ART_SIZE), Image.Resampling.NEAREST)
    normalized = Image.new('RGBA', resized.size, PALETTE[0])

    for y in range(resized.height):
        for x in range(resized.width):
            normalized.putpixel((x, y), nearest_palette_color(resized.getpixel((x, y))))

    return normalized


def place_on_avatar_canvas(image: Image.Image) -> Image.Image:
    canvas = Image.new('RGBA', (AVATAR_CANVAS_SIZE, AVATAR_CANVAS_SIZE), PALETTE[0])
    canvas.alpha_composite(image, (AVATAR_ART_OFFSET_X, AVATAR_ART_OFFSET_Y))
    return canvas


def crop_tile(canvas: Image.Image, col: int, row: int) -> Image.Image:
    left = col * AVATAR_TILE_SIZE
    top = row * AVATAR_TILE_SIZE
    return canvas.crop((left, top, left + AVATAR_TILE_SIZE, top + AVATAR_TILE_SIZE))


def _edge_connected_white_pixels(image: Image.Image) -> set[tuple[int, int]]:
    width, height = image.size
    white = PALETTE[0]
    stack: list[tuple[int, int]] = []
    visited: set[tuple[int, int]] = set()

    for x in range(width):
        stack.append((x, 0))
        stack.append((x, height - 1))
    for y in range(height):
        stack.append((0, y))
        stack.append((width - 1, y))

    while stack:
        x, y = stack.pop()
        if (x, y) in visited:
            continue
        if x < 0 or x >= width or y < 0 or y >= height:
            continue
        if image.getpixel((x, y)) != white:
            continue

        visited.add((x, y))
        stack.extend([
            (x - 1, y),
            (x + 1, y),
            (x, y - 1),
            (x, y + 1),
        ])

    return visited


def foreground_white_masks_for_mouth_pair(canvas: Image.Image) -> tuple[set[tuple[int, int]], set[tuple[int, int]]]:
    left = MOUTH_LEFT_COL * AVATAR_TILE_SIZE
    top = MOUTH_ROW * AVATAR_TILE_SIZE
    pair = canvas.crop((left, top, left + AVATAR_TILE_SIZE * 2, top + AVATAR_TILE_SIZE))
    edge_white = _edge_connected_white_pixels(pair)

    left_mask: set[tuple[int, int]] = set()
    right_mask: set[tuple[int, int]] = set()

    for y in range(pair.height):
        for x in range(pair.width):
            if pair.getpixel((x, y)) != PALETTE[0] or (x, y) in edge_white:
                continue

            if x < AVATAR_TILE_SIZE:
                left_mask.add((x, y))
            else:
                right_mask.add((x - AVATAR_TILE_SIZE, y))

    return left_mask, right_mask


def tile_to_svg(tile: Image.Image, foreground_white_mask: set[tuple[int, int]] | None = None) -> str:
    width, height = tile.size
    paths: dict[tuple[int, int, int, int], list[str]] = {color: [] for color in DRAW_COLORS}
    foreground_white_paths: list[str] = []
    foreground_white_mask = foreground_white_mask or set()

    for y in range(height):
        x = 0
        while x < width:
            color = tile.getpixel((x, y))

            if color == PALETTE[0] and (x, y) in foreground_white_mask:
                start = x
                while x < width and tile.getpixel((x, y)) == PALETTE[0] and (x, y) in foreground_white_mask:
                    x += 1
                foreground_white_paths.append(f'M{start} {y}h{x - start}v1H{start}z')
                continue

            if color not in paths:
                x += 1
                continue

            start = x
            while x < width and tile.getpixel((x, y)) == color:
                x += 1
            paths[color].append(f'M{start} {y}h{x - start}v1H{start}z')

    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" shape-rendering="crispEdges" aria-hidden="true">',
        f'  <rect width="{width}" height="{height}" fill="#ffffff"/>',
    ]

    if foreground_white_paths:
        lines.append(f'  <path fill="{FOREGROUND_WHITE_HEX}" d="{" ".join(foreground_white_paths)}"/>')

    for color in DRAW_COLORS:
        segments = ' '.join(paths[color])
        if segments:
            lines.append(f'  <path fill="{PALETTE_TO_HEX[color]}" d="{segments}"/>')

    lines.append('</svg>')
    lines.append('')
    return '\n'.join(lines)


def expression_label(name: str) -> str:
    return name.replace('-', ' ')


def generate() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for path in OUTPUT_DIR.glob('*.svg'):
        path.unlink()
    if MANIFEST_PATH.exists():
        MANIFEST_PATH.unlink()

    manifest: list[dict[str, object]] = []

    source_paths = [
        path for path in sorted(SOURCE_DIR.glob('*.png')) if not path.stem.startswith('improved-') and not path.stem.startswith('_')
    ]

    for source_path in source_paths:
        expression = source_path.stem
        source = Image.open(source_path)
        normalized = normalize_source(source)
        canvas = place_on_avatar_canvas(normalized)
        left_tile = crop_tile(canvas, MOUTH_LEFT_COL, MOUTH_ROW)
        right_tile = crop_tile(canvas, MOUTH_RIGHT_COL, MOUTH_ROW)
        left_white_mask, right_white_mask = foreground_white_masks_for_mouth_pair(canvas)

        left_output = OUTPUT_DIR / f'{expression}-left.svg'
        right_output = OUTPUT_DIR / f'{expression}-right.svg'

        left_output.write_text(tile_to_svg(left_tile, left_white_mask))
        right_output.write_text(tile_to_svg(right_tile, right_white_mask))

        manifest.append(
            {
                'id': expression,
                'label': expression_label(expression),
                'source': str(source_path.relative_to(ROOT)),
                'tiles': {
                    'left': str(left_output.relative_to(ROOT)),
                    'right': str(right_output.relative_to(ROOT)),
                },
            }
        )

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Generated {len(manifest)} mouth expressions in {OUTPUT_DIR.relative_to(ROOT)}')


if __name__ == '__main__':
    generate()
