#!/usr/bin/env python3
"""
Extract bottom two avatar outfit rows from source PNGs and convert them to SVG.
Uses the same coordinate system and SVG format as the runtime avatar tiles.
"""
from pathlib import Path

from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/outfits'

# Avatar grid constants (from avatarSprite.ts)
GRID_SIZE = 6
TILE_SIZE = 25
ART_OFFSET_X = 11
ART_OFFSET_Y = 10
ART_SIZE = 128
IMG_SIZE = 2048
SCALE = IMG_SIZE // ART_SIZE  # 16

# Outfit sources
OUTFITS = {
    'shirt': ROOT / 'src/assets/avatar/outfits/summer-shirt.png',
    'sweater': ROOT / 'src/assets/avatar/outfits/sweater.png',
    'sweater-alt': ROOT / 'src/assets/avatar/outfits/sweater-alt.png',
    'batman': ROOT / 'src/assets/avatar/outfits/batman.png',
}

# Reuse the base tile when the generated outfit tile is visually identical.
REUSED_BASE_TILES = {
    'shirt': {16},
    'sweater-alt': {16},
}

# Bottom 2 rows: row indices 4 and 5
# These correspond to base-tile-11..16 (row 4) and base-tile-17..22 (row 5)
BOTTOM_ROWS = [4, 5]
TILE_INDEX_START = {4: 11, 5: 17}  # row -> starting tile index


PALETTE = {
    'black': np.array([0, 0, 0], dtype=np.float32),
    'gray': np.array([85, 85, 85], dtype=np.float32),
    'white': np.array([255, 255, 255], dtype=np.float32),
}


def get_art_pixel_rgb(arr, ax, ay):
    """Sample the center of the 16x16 block for art pixel (ax, ay)."""
    ix = ax * SCALE + SCALE // 2
    iy = ay * SCALE + SCALE // 2
    if 0 <= ix < arr.shape[1] and 0 <= iy < arr.shape[0]:
        pixel = arr[iy, ix]
        if len(pixel) == 4 and pixel[3] < 16:
            return np.array([255, 255, 255], dtype=np.float32)
        return pixel[:3].astype(np.float32)
    return np.array([255, 255, 255], dtype=np.float32)


def quantize(rgb):
    """Map source pixels to the closest avatar palette color instead of coarse thresholds."""
    distances = {
        name: float(np.sum((rgb - color) ** 2))
        for name, color in PALETTE.items()
    }
    return min(distances, key=distances.get)


def extract_tile(arr, col, row):
    """Extract a 25x25 tile grid of quantized colors."""
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
    return tile


def tile_to_svg(tile):
    """Convert a 25x25 color grid to SVG markup matching existing tile format."""
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

    paths = []
    if gray_rects:
        paths.append(f'  <path fill="#808080" d="{" ".join(gray_rects)}"/>')
    if black_rects:
        paths.append(f'  <path fill="#000000" d="{" ".join(black_rects)}"/>')

    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25" height="25" shape-rendering="crispEdges" aria-hidden="true">',
        '  <rect width="25" height="25" fill="#ffffff"/>',
    ] + paths + ['</svg>', '']

    return '\n'.join(lines)


def clear_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for path in OUTPUT_DIR.glob('*.svg'):
        path.unlink()


def main():
    clear_output_dir()

    for outfit_name, img_path in OUTFITS.items():
        print(f'\n=== {outfit_name} ===')
        img = Image.open(img_path)
        arr = np.array(img)

        for row in BOTTOM_ROWS:
            tile_start = TILE_INDEX_START[row]
            for col in range(GRID_SIZE):
                tile_idx = tile_start + col
                tile_name = f'{outfit_name}-tile-{tile_idx:02d}'

                if tile_idx in REUSED_BASE_TILES.get(outfit_name, set()):
                    print(f'- reusing base-tile-{tile_idx:02d} for {tile_name}')
                    continue

                tile = extract_tile(arr, col, row)
                svg = tile_to_svg(tile)
                out_path = OUTPUT_DIR / f'{tile_name}.svg'
                out_path.write_text(svg)

                preview = ''
                for ty in range(TILE_SIZE):
                    for tx in range(TILE_SIZE):
                        color = tile[ty][tx]
                        preview += '█' if color == 'black' else '▒' if color == 'gray' else '·'
                    preview += '\n'
                print(f'\n{tile_name}:')
                print(preview[:200] + '...')

    print(f'\nDone! Tiles saved to {OUTPUT_DIR.relative_to(ROOT)}/')
    print(f'Total files: {len(list(OUTPUT_DIR.glob("*.svg")))}')


if __name__ == '__main__':
    main()
