#!/usr/bin/env python3
"""
Extract avatar hat/face overlay tiles from source PNGs.

Pipeline improvements:
- explicit transparent pixels instead of an implicit white tile background
- slot-level cutouts are true transparency holes
- hat overlays stay isolated from subject/face animation underneath
"""
from pathlib import Path

from PIL import Image
import numpy as np

from avatar_tile_pipeline import (
    DEFAULT_GEOMETRY,
    TRANSPARENT,
    WHITE,
    build_art,
    blank_svg,
    extract_tile,
    project_root,
    slot_to_grid,
    tile_to_svg,
)

ROOT = project_root(__file__)
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/hats'

HAT_SLOTS = list(range(24))
SLOT_TO_GRID = slot_to_grid(HAT_SLOTS)

USED_SLOTS = {
    'winter-hat': {2, 3, 7, 8, 9, 10, 13, 16, 20, 21},
    'straw-hat': {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23},
}

PURPLE_KEY = np.array([180, 0, 180], dtype=np.float32)
PURPLE_DISTANCE_THRESHOLD = 120.0

SOURCES = {
    'winter-hat': ROOT / 'src/assets/avatar/outfits/winter-suit.png',
    'straw-hat': ROOT / 'src/assets/avatar/outfits/straw-hat.png',
}

SLOT_CUTOUTS = {
    20: [(7, 9, 25, 25)],
    21: [(0, 9, 18, 25)],
}

TRANSPARENT_SLOTS = {
    'winter-hat': {20, 21},
    'straw-hat': {14, 15, 20, 21},
}

EMPTY_SLOTS = {
    'straw-hat': {14, 15},
}


def find_luma_valleys(img: Image.Image) -> tuple[int, int]:
    small = img.resize((DEFAULT_GEOMETRY.art_size, DEFAULT_GEOMETRY.art_size), Image.Resampling.NEAREST)
    arr = np.array(small)
    lumas: list[float] = []
    for pixel in arr.reshape(-1, arr.shape[-1]):
        if len(pixel) == 4 and pixel[3] < 16:
            continue
        lumas.append(0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2])
    if not lumas:
        return 90, 180
    hist, _ = np.histogram(lumas, bins=255, range=(0, 255))
    v1 = int(np.argmin(hist[50:130])) + 50
    v2 = int(np.argmin(hist[170:230])) + 170
    return v1, v2


def is_purple_key(pixel: np.ndarray) -> bool:
    rgb = pixel[:3].astype(np.float32)
    if rgb[0] > 150 and rgb[2] > 150 and rgb[1] < 110:
        return True
    return float(np.linalg.norm(rgb - PURPLE_KEY)) <= PURPLE_DISTANCE_THRESHOLD


def snap_pixel(pixel: np.ndarray, v1: int, v2: int) -> str:
    if len(pixel) == 4 and pixel[3] < 16:
        return TRANSPARENT
    if is_purple_key(pixel):
        return TRANSPARENT
    luma = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2]
    if luma < v1:
        return 'black'
    if luma > v2:
        return WHITE
    return 'gray'


def build_hat_art(img: Image.Image, v1: int, v2: int) -> list[list[str]]:
    return build_art(img, pixel_mapper=lambda pixel: snap_pixel(pixel, v1, v2))


def apply_cutouts(tile: list[list[str]], slot: int) -> None:
    for x1, y1, x2, y2 in SLOT_CUTOUTS.get(slot, []):
        for y in range(max(0, y1), min(DEFAULT_GEOMETRY.tile_size, y2)):
            for x in range(max(0, x1), min(DEFAULT_GEOMETRY.tile_size, x2)):
                tile[y][x] = TRANSPARENT


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, img_path in SOURCES.items():
        for stale_path in OUTPUT_DIR.glob(f'{name}-slot-*.svg'):
            stale_path.unlink()

        img = Image.open(img_path).convert('RGBA')
        v1, v2 = find_luma_valleys(img)
        art = build_hat_art(img, v1, v2)
        print(f'{name}: luma valleys black<{v1} gray {v1}-{v2} white>{v2}')

        transparent_slots = TRANSPARENT_SLOTS.get(name, set())
        empty_slots = EMPTY_SLOTS.get(name, set())
        used_slots = USED_SLOTS.get(name, set())

        for slot in sorted(used_slots):
            col, row = SLOT_TO_GRID[slot]
            out = OUTPUT_DIR / f'{name}-slot-{slot:02d}.svg'
            if slot in empty_slots:
                out.write_text(blank_svg())
                print(out.relative_to(ROOT))
                continue

            outside_fill = TRANSPARENT
            tile = extract_tile(art, col, row, outside_fill=outside_fill)
            apply_cutouts(tile, slot)
            out.write_text(tile_to_svg(tile))
            print(out.relative_to(ROOT))


if __name__ == '__main__':
    main()
