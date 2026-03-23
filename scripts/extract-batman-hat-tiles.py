#!/usr/bin/env python3
"""
Extract the Batman mask hat tiles from batman.png.

Pipeline improvements:
- explicit transparency holes for eyes + mouth/jaw cutouts
- no implicit white tile background in the exported SVGs
- cutouts derived from the live animated eye/mouth tiles so the cowl feels like
  a mask sitting on top of the face instead of a manually guessed hole
"""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image
import numpy as np

from avatar_tile_pipeline import (
    WHITE,
    TRANSPARENT,
    build_art,
    extract_tile,
    project_root,
    slot_to_grid,
    tile_to_svg,
)

ROOT = project_root(__file__)
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/hats'
SOURCE = ROOT / 'src/assets/avatar/outfits/batman.png'
NAME = 'batman-mask'

EYES_DIR = ROOT / 'src/assets/avatar/tiles/eyes'
MOUTH_DIR = ROOT / 'src/assets/avatar/tiles/mouth'
MOUTH_EXPRESSIONS_DIR = MOUTH_DIR / 'expressions'

HAT_SLOTS = list(range(24))
SLOT_TO_GRID = slot_to_grid(HAT_SLOTS)
SLOTS_WITH_TRANSPARENT_WHITE = {14, 15, 20, 21}

HEAD_COWL_FILL_RULES: dict[int, tuple[int, int, str]] = {
    2: (0, 24, 'gray'),
    3: (0, 24, 'gray'),
    # Slightly tighter temple fills so the cowl reads cleaner and doesn't overshoot.
    7: (7, 23, 'black'),
    8: (0, 24, 'gray'),
    9: (0, 24, 'gray'),
    10: (1, 17, 'black'),
    13: (15, 23, 'gray'),
    16: (1, 9, 'gray'),
}

HEAD_COWL_REFERENCE_TILE_PATHS = {
    2: ROOT / 'src/assets/avatar/tiles/base/base-tile-01.svg',
    3: ROOT / 'src/assets/avatar/tiles/base/base-tile-02.svg',
    7: ROOT / 'src/assets/avatar/tiles/base/base-tile-03.svg',
    8: ROOT / 'src/assets/avatar/tiles/base/base-tile-04.svg',
    9: ROOT / 'src/assets/avatar/tiles/base/base-tile-05.svg',
    10: ROOT / 'src/assets/avatar/tiles/base/base-tile-06.svg',
    13: ROOT / 'src/assets/avatar/tiles/base/base-tile-07.svg',
    16: ROOT / 'src/assets/avatar/tiles/base/base-tile-08.svg',
}

PALETTE = {
    'black': np.array([0, 0, 0], dtype=np.float32),
    'gray': np.array([85, 85, 85], dtype=np.float32),
    WHITE: np.array([255, 255, 255], dtype=np.float32),
}

PURPLE_KEY = np.array([180, 0, 180], dtype=np.float32)
PURPLE_DISTANCE_THRESHOLD = 120.0
SVG_RUN_RE = re.compile(r'M([0-9]+) ([0-9]+)h([0-9]+)v1H')
COLORFUL = 'colorful'


def is_purple_key(pixel: np.ndarray) -> bool:
    rgb = pixel[:3].astype(np.float32)
    if rgb[0] > 150 and rgb[2] > 150 and rgb[1] < 110:
        return True
    return float(np.linalg.norm(rgb - PURPLE_KEY)) <= PURPLE_DISTANCE_THRESHOLD


def quantize(rgb: np.ndarray) -> str:
    distances = {
        name: float(np.sum((rgb.astype(np.float32) - color) ** 2))
        for name, color in PALETTE.items()
    }
    return min(distances, key=distances.get)


def build_mask_art(img_path: Path) -> list[list[str]]:
    img = Image.open(img_path).convert('RGBA')

    def pixel_mapper(pixel: np.ndarray) -> str:
        if len(pixel) == 4 and pixel[3] < 16:
            return TRANSPARENT
        if is_purple_key(pixel):
            return TRANSPARENT
        return quantize(pixel[:3])

    return build_art(img, pixel_mapper=pixel_mapper)


def keeps_white_fill(name: str) -> bool:
    return 'eye' in name or name.startswith('smile-')


def load_runtime_tile(path: Path) -> list[list[str]]:
    text = path.read_text()
    grid = [[TRANSPARENT for _ in range(25)] for _ in range(25)]
    keep_white = keeps_white_fill(path.stem)

    if keep_white and '<rect width="25" height="25" fill="#ffffff"/>' in text:
        for y in range(25):
            for x in range(25):
                grid[y][x] = WHITE

    for fill, state in (
        ('#808080', 'gray'),
        ('#000000', 'black'),
        ('#ffffff', WHITE),
        ('var(--avatar-colorful-50)', COLORFUL),
    ):
        for match in re.finditer(rf'fill="{re.escape(fill)}" d="([^"]+)"', text):
            d = match.group(1)
            for segment in d.split(' M'):
                segment = segment if segment.startswith('M') else f'M{segment}'
                run = SVG_RUN_RE.match(segment)
                if not run:
                    continue
                x, y, width = map(int, run.groups())
                for xx in range(x, x + width):
                    grid[y][xx] = state

    if not keep_white:
        for y in range(25):
            for x in range(25):
                if grid[y][x] == WHITE:
                    grid[y][x] = TRANSPARENT

    return grid


def derive_variability_mask(paths: list[Path]) -> tuple[list[list[bool]], list[tuple[int, int]]]:
    if not paths:
        raise FileNotFoundError('Missing source SVGs for Batman cutout derivation')

    grids = [load_runtime_tile(path) for path in paths]
    mask = [[False for _ in range(25)] for _ in range(25)]
    white_pixels: list[tuple[int, int]] = []

    for y in range(25):
        for x in range(25):
            values = {grid[y][x] for grid in grids}
            has_white = WHITE in values
            if has_white or len(values) > 1:
                mask[y][x] = True
            if has_white:
                white_pixels.append((x, y))

    return mask, white_pixels


def dilate_mask(mask: list[list[bool]], radius_x: int = 1, radius_y: int = 1) -> list[list[bool]]:
    out = [[False for _ in range(25)] for _ in range(25)]
    for y in range(25):
        for x in range(25):
            if not mask[y][x]:
                continue
            for yy in range(max(0, y - radius_y), min(25, y + radius_y + 1)):
                for xx in range(max(0, x - radius_x), min(25, x + radius_x + 1)):
                    out[yy][xx] = True
    return out


def row_spans(active_columns: list[int]) -> list[tuple[int, int]]:
    if not active_columns:
        return []

    spans: list[tuple[int, int]] = []
    start = active_columns[0]
    prev = active_columns[0]

    for column in active_columns[1:]:
        if column == prev + 1:
            prev = column
            continue
        spans.append((start, prev))
        start = column
        prev = column

    spans.append((start, prev))
    return spans


def choose_span(
    options: list[tuple[int, int]],
    *,
    previous: tuple[int, int] | None,
    center_x: float | None,
    prefer_right: bool,
) -> tuple[int, int]:
    if previous is None:
        if center_x is not None:
            return min(options, key=lambda span: abs(((span[0] + span[1]) / 2) - center_x))
        return max(options, key=lambda span: span[1]) if prefer_right else min(options, key=lambda span: span[0])

    def score(span: tuple[int, int]) -> tuple[int, float, int]:
        overlap = max(0, min(span[1], previous[1]) - max(span[0], previous[0]) + 1)
        center_delta = abs(((span[0] + span[1]) / 2) - ((previous[0] + previous[1]) / 2))
        side_bias = -span[1] if prefer_right else span[0]
        width_bias = -(span[1] - span[0])
        return (-overlap, center_delta if center_x is not None else float(side_bias), width_bias)

    return min(options, key=score)


def derive_eye_cutout(paths: list[Path]) -> list[list[bool]]:
    raw_mask, white_pixels = derive_variability_mask(paths)
    if not white_pixels:
        raise ValueError('Batman eye cutout derivation requires white eye pixels')

    dilated = dilate_mask(raw_mask, radius_x=1, radius_y=1)
    xs = [x for x, _ in white_pixels]
    ys = [y for _, y in white_pixels]

    left = max(0, min(xs) - 3)
    top = max(0, min(ys) - 4)
    right = min(24, max(xs) + 3)
    bottom = min(24, max(ys) + 2)
    center_x = (min(xs) + max(xs)) / 2

    out = [[False for _ in range(25)] for _ in range(25)]
    previous: tuple[int, int] | None = None

    for y in range(top, bottom + 1):
        options = row_spans([x for x in range(left, right + 1) if dilated[y][x]])
        if not options:
            continue

        start, end = choose_span(options, previous=previous, center_x=center_x, prefer_right=False)
        start = max(left, start - 1)
        end = min(right, end + 1)
        previous = (start, end)

        for x in range(start, end + 1):
            out[y][x] = True

    return out


def derive_mouth_cutout(side: str) -> list[list[bool]]:
    if side not in {'left', 'right'}:
        raise ValueError(f'Unsupported Batman mouth side: {side}')

    paths = [
        MOUTH_DIR / f'mouth-rest-{side}.svg',
        *sorted(MOUTH_EXPRESSIONS_DIR.glob(f'*-{side}.svg')),
    ]
    raw_mask, _ = derive_variability_mask(paths)
    dilated = dilate_mask(raw_mask, radius_x=1, radius_y=1)

    left = 7 if side == 'left' else 0
    right = 24 if side == 'left' else 17
    prefer_right = side == 'left'

    out = [[False for _ in range(25)] for _ in range(25)]
    previous: tuple[int, int] | None = None

    for y in range(3, 25):
        options = row_spans([x for x in range(left, right + 1) if dilated[y][x]])
        if not options:
            continue

        start, end = choose_span(options, previous=previous, center_x=None, prefer_right=prefer_right)
        if side == 'left':
            start = max(left, start - 1)
        else:
            end = min(right, end + 1)
        previous = (start, end)

        for x in range(start, end + 1):
            out[y][x] = True

    return out


def build_cutout_masks() -> dict[int, list[list[bool]]]:
    return {
        14: derive_eye_cutout(sorted(EYES_DIR.glob('left-eye-*.svg'))),
        15: derive_eye_cutout(sorted(EYES_DIR.glob('right-eye-*.svg'))),
        20: derive_mouth_cutout('left'),
        21: derive_mouth_cutout('right'),
    }


def build_head_cowl_reference_tiles() -> dict[int, list[list[str]]]:
    return {
        slot: load_runtime_tile(path)
        for slot, path in HEAD_COWL_REFERENCE_TILE_PATHS.items()
    }


def apply_head_cowl_fill(
    tile: list[list[str]],
    slot: int,
    head_cowl_reference_tiles: dict[int, list[list[str]]],
) -> None:
    rule = HEAD_COWL_FILL_RULES.get(slot)
    reference_tile = head_cowl_reference_tiles.get(slot)
    if rule is None or reference_tile is None:
        return

    x_min, x_max, fill_state = rule
    for y in range(25):
        for x in range(max(0, x_min), min(25, x_max + 1)):
            if tile[y][x] == WHITE and reference_tile[y][x] != TRANSPARENT:
                tile[y][x] = fill_state


def apply_cutouts(tile: list[list[str]], slot: int, cutout_masks: dict[int, list[list[bool]]]) -> None:
    mask = cutout_masks.get(slot)
    if mask is not None:
        for y in range(25):
            for x in range(25):
                if mask[y][x]:
                    tile[y][x] = TRANSPARENT

    if slot in SLOTS_WITH_TRANSPARENT_WHITE:
        for y in range(25):
            for x in range(25):
                if tile[y][x] == WHITE:
                    tile[y][x] = TRANSPARENT


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    art = build_mask_art(SOURCE)
    cutout_masks = build_cutout_masks()
    head_cowl_reference_tiles = build_head_cowl_reference_tiles()

    for slot, (col, row) in SLOT_TO_GRID.items():
        tile = extract_tile(art, col, row, outside_fill=TRANSPARENT)
        apply_head_cowl_fill(tile, slot, head_cowl_reference_tiles)
        apply_cutouts(tile, slot, cutout_masks)

        out = OUTPUT_DIR / f'{NAME}-slot-{slot:02d}.svg'
        out.write_text(tile_to_svg(tile))
        print(out.relative_to(ROOT))


if __name__ == '__main__':
    main()
