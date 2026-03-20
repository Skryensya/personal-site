#!/usr/bin/env python3
"""
Extract avatar hat/face overlay tiles from source PNGs.
White pixels become transparent so eyes/mouth underneath can keep animating.
"""
from pathlib import Path

from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/hats'

GRID_SIZE = 6
TILE_SIZE = 25
ART_OFFSET_X = 11
ART_OFFSET_Y = 10
ART_SIZE = 128
IMG_SIZE = 2048
SCALE = IMG_SIZE // ART_SIZE

HAT_SLOTS = [2, 3, 7, 8, 9, 10, 13, 14, 15, 16, 19, 20, 21, 22]
SLOT_TO_GRID = {slot: ((slot % GRID_SIZE), (slot // GRID_SIZE)) for slot in HAT_SLOTS}

PALETTE = {
    'black': np.array([0, 0, 0], dtype=np.float32),
    'gray': np.array([85, 85, 85], dtype=np.float32),
    'white': np.array([255, 255, 255], dtype=np.float32),
}

SOURCES = {
    'batman-mask': ROOT / 'src/assets/avatar/outfits/batman.png',
}

SLOT_CUTOUTS = {
    14: [
        (12, 10, 16, 11),
        (10, 11, 17, 12),
        (9, 12, 18, 13),
        (10, 13, 17, 14),
        (12, 14, 15, 15),
    ],
    15: [
        (9, 10, 13, 11),
        (8, 11, 15, 12),
        (7, 12, 16, 13),
        (8, 13, 15, 14),
        (10, 14, 13, 15),
    ],
    20: [(7, 9, 25, 25)],
    21: [(0, 9, 18, 25)],
}


def get_art_pixel_rgb(arr, ax, ay):
    ix = ax * SCALE + SCALE // 2
    iy = ay * SCALE + SCALE // 2
    if 0 <= ix < arr.shape[1] and 0 <= iy < arr.shape[0]:
        pixel = arr[iy, ix]
        if len(pixel) == 4 and pixel[3] < 16:
            return np.array([255, 255, 255], dtype=np.float32)
        return pixel[:3].astype(np.float32)
    return np.array([255, 255, 255], dtype=np.float32)


def quantize(rgb):
    distances = {
        name: float(np.sum((rgb - color) ** 2))
        for name, color in PALETTE.items()
    }
    return min(distances, key=distances.get)


def extract_tile(arr, col, row, slot=None):
    tile = []
    for ty in range(TILE_SIZE):
        row_data = []
        for tx in range(TILE_SIZE):
            ax = col * TILE_SIZE + tx - ART_OFFSET_X
            ay = row * TILE_SIZE + ty - ART_OFFSET_Y
            if 0 <= ax < ART_SIZE and 0 <= ay < ART_SIZE:
                rgb = get_art_pixel_rgb(arr, ax, ay)
                row_data.append(quantize(rgb))
            else:
                row_data.append('white')
        tile.append(row_data)

    for x1, y1, x2, y2 in SLOT_CUTOUTS.get(slot, []):
        for y in range(max(0, y1), min(TILE_SIZE, y2)):
            for x in range(max(0, x1), min(TILE_SIZE, x2)):
                tile[y][x] = 'white'

    return tile


def tile_to_svg(tile, transparent_white=False):
    gray_rects = []
    black_rects = []

    for y in range(TILE_SIZE):
        x = 0
        while x < TILE_SIZE:
            if tile[y][x] == 'gray':
                w = 1
                while x + w < TILE_SIZE and tile[y][x + w] == 'gray':
                    w += 1
                gray_rects.append(f'M{x} {y}h{w}v1H{x}z')
                x += w
            else:
                x += 1

        x = 0
        while x < TILE_SIZE:
            if tile[y][x] == 'black':
                w = 1
                while x + w < TILE_SIZE and tile[y][x + w] == 'black':
                    w += 1
                black_rects.append(f'M{x} {y}h{w}v1H{x}z')
                x += w
            else:
                x += 1

    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25" height="25" shape-rendering="crispEdges" aria-hidden="true">',
    ]
    if not transparent_white:
        lines.append('  <rect width="25" height="25" fill="#ffffff"/>')
    if gray_rects:
        lines.append(f'  <path fill="#808080" d="{" ".join(gray_rects)}"/>')
    if black_rects:
        lines.append(f'  <path fill="#000000" d="{" ".join(black_rects)}"/>')
    lines += ['</svg>', '']
    return '\n'.join(lines)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, img_path in SOURCES.items():
        arr = np.array(Image.open(img_path).convert('RGBA'))
        for slot, (col, row) in SLOT_TO_GRID.items():
            tile = extract_tile(arr, col, row, slot=slot)
            out = OUTPUT_DIR / f'{name}-slot-{slot:02d}.svg'
            transparent_white = slot in {14, 15, 20, 21}
            out.write_text(tile_to_svg(tile, transparent_white=transparent_white))
            print(out.relative_to(ROOT))


if __name__ == '__main__':
    main()
