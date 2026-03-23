#!/usr/bin/env python3
"""
Extract alternate hair tiles from source PNGs.

Pipeline improvements:
1. Resize source 2048x2048 → 128x128 with NEAREST
2. Snap each pixel to explicit states: white / gray / black
3. Slice only the hair/head slots
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
    slot_to_grid,
    tile_to_svg,
)

ROOT = project_root(__file__)
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/hair'
SOURCE = ROOT / 'src/assets/avatar/outfits/winter-sweater.png'
NAME = 'wavy-hair'

# Only slots that are pure hair/head silhouette and do not overlap animated eyes or mouth.
HAIR_SLOTS = [2, 3, 7, 8, 9, 10, 13, 16]
SLOT_TO_GRID = slot_to_grid(HAIR_SLOTS)


def build_hair_art(img_path: Path) -> list[list[str]]:
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

    art = build_hair_art(SOURCE)

    for slot, (col, row) in SLOT_TO_GRID.items():
        tile = extract_tile(art, col, row, outside_fill=TRANSPARENT)
        out_path = OUTPUT_DIR / f'{NAME}-slot-{slot:02d}.svg'
        out_path.write_text(tile_to_svg(tile, tile_size=DEFAULT_GEOMETRY.tile_size))
        print(out_path.relative_to(ROOT))


if __name__ == '__main__':
    main()
