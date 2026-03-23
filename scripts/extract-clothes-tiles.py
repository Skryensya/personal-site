#!/usr/bin/env python3
"""
Extract outfit tiles from source PNGs.

Pipeline improvements:
1. Resize source 2048x2048 → 128x128 with NEAREST (no antialiasing)
2. Snap each pixel to explicit states: white / gray / black
3. Slice the avatar body/jaw slots
4. Emit SVGs with explicit paths instead of an implicit full-tile background
"""
from pathlib import Path

from PIL import Image
import numpy as np

from avatar_tile_pipeline import (
    DEFAULT_GEOMETRY,
    TRANSPARENT,
    build_art,
    closest_palette_color,
    extract_tile,
    project_root,
    tile_to_svg,
)

ROOT = project_root(__file__)
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/outfits'

OUTFITS = {
    'shirt': ROOT / 'src/assets/avatar/outfits/summer-shirt.png',
    'sweater-alt': ROOT / 'src/assets/avatar/outfits/sweater-alt.png',
    'winter-sweater': ROOT / 'src/assets/avatar/outfits/winter-sweater.png',
    'winter-suit': ROOT / 'src/assets/avatar/outfits/winter-suit.png',
    'batman': ROOT / 'src/assets/avatar/outfits/batman.png',
}

REUSED_BASE_TILES = {
    'shirt': {9, 10, 16},
    'sweater-alt': {16},
}

OUTFIT_TILE_SPECS = [
    (9, 1, 3),
    (10, 4, 3),
    *[(11 + col, col, 4) for col in range(DEFAULT_GEOMETRY.grid_size)],
    *[(17 + col, col, 5) for col in range(DEFAULT_GEOMETRY.grid_size)],
]


def build_outfit_art(img_path: Path) -> list[list[str]]:
    img = Image.open(img_path).convert('RGBA')

    def pixel_mapper(pixel: np.ndarray) -> str:
        if pixel[3] < 16:
            return TRANSPARENT
        return closest_palette_color(pixel[:3].astype(np.float32))

    return build_art(img, pixel_mapper=pixel_mapper)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for path in OUTPUT_DIR.glob('*.svg'):
        path.unlink()

    for outfit_name, img_path in OUTFITS.items():
        print(f'\n=== {outfit_name} ===')
        art = build_outfit_art(img_path)

        for tile_idx, col, row in OUTFIT_TILE_SPECS:
            tile_name = f'{outfit_name}-tile-{tile_idx:02d}'

            if tile_idx in REUSED_BASE_TILES.get(outfit_name, set()):
                print(f'  reusing base-tile-{tile_idx:02d}')
                continue

            tile = extract_tile(art, col, row, outside_fill=TRANSPARENT)
            out_path = OUTPUT_DIR / f'{tile_name}.svg'
            out_path.write_text(tile_to_svg(tile))
            print(f'  {tile_name}')

    print(f'\nDone! {len(list(OUTPUT_DIR.glob("*.svg")))} tiles')


if __name__ == '__main__':
    main()
