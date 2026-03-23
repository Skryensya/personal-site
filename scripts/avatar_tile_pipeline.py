#!/usr/bin/env python3
"""
Shared helpers for the avatar tile extraction pipeline.

Key improvements:
- explicit pixel states: transparent / white / gray / black
- reusable resize + extraction helpers
- SVG output without an implicit full-tile white background
- better support for mixed opaque + transparent overlays
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import numpy as np
from PIL import Image

TRANSPARENT = 'transparent'
WHITE = 'white'
GRAY = 'gray'
BLACK = 'black'

PIXEL_STATE_ORDER = (WHITE, GRAY, BLACK)
PIXEL_TO_FILL = {
    WHITE: '#ffffff',
    GRAY: '#808080',
    BLACK: '#000000',
}

DEFAULT_PALETTE = {
    BLACK: np.array([0, 0, 0], dtype=np.float32),
    GRAY: np.array([128, 128, 128], dtype=np.float32),
    WHITE: np.array([255, 255, 255], dtype=np.float32),
}


@dataclass(frozen=True)
class TileGeometry:
    grid_size: int = 6
    tile_size: int = 25
    art_offset_x: int = 11
    art_offset_y: int = 10
    art_size: int = 128


DEFAULT_GEOMETRY = TileGeometry()


def resize_to_pixel_art(img: Image.Image, art_size: int = DEFAULT_GEOMETRY.art_size) -> np.ndarray:
    return np.array(img.resize((art_size, art_size), Image.Resampling.NEAREST))


def closest_palette_color(rgb: np.ndarray, palette: dict[str, np.ndarray] | None = None) -> str:
    active_palette = palette or DEFAULT_PALETTE
    return min(
        active_palette,
        key=lambda key: float(np.sum((rgb.astype(np.float32) - active_palette[key]) ** 2)),
    )


def build_art(
    img: Image.Image,
    *,
    geometry: TileGeometry = DEFAULT_GEOMETRY,
    pixel_mapper: Callable[[np.ndarray], str],
) -> list[list[str]]:
    arr = resize_to_pixel_art(img, geometry.art_size)
    art: list[list[str]] = []
    for y in range(geometry.art_size):
        row: list[str] = []
        for x in range(geometry.art_size):
            row.append(pixel_mapper(arr[y, x]))
        art.append(row)
    return art


def extract_tile(
    art: list[list[str]],
    col: int,
    row: int,
    *,
    geometry: TileGeometry = DEFAULT_GEOMETRY,
    outside_fill: str = TRANSPARENT,
) -> list[list[str]]:
    tile: list[list[str]] = []
    for ty in range(geometry.tile_size):
        row_data: list[str] = []
        for tx in range(geometry.tile_size):
            ax = col * geometry.tile_size + tx - geometry.art_offset_x
            ay = row * geometry.tile_size + ty - geometry.art_offset_y
            if 0 <= ax < geometry.art_size and 0 <= ay < geometry.art_size:
                row_data.append(art[ay][ax])
            else:
                row_data.append(outside_fill)
        tile.append(row_data)
    return tile


def rect_path(x1: float, y1: float, x2: float, y2: float) -> str:
    return f'M{x1} {y1}h{x2 - x1}v{y2 - y1}H{x1}z'


def tile_to_svg(tile: list[list[str]], *, tile_size: int = DEFAULT_GEOMETRY.tile_size) -> str:
    paths_by_fill: dict[str, list[str]] = {
        WHITE: [],
        GRAY: [],
        BLACK: [],
    }

    for fill_name in PIXEL_STATE_ORDER:
        for y in range(tile_size):
            x = 0
            while x < tile_size:
                if tile[y][x] == fill_name:
                    width = 1
                    while x + width < tile_size and tile[y][x + width] == fill_name:
                        width += 1
                    paths_by_fill[fill_name].append(rect_path(x, y, x + width, y + 1))
                    x += width
                else:
                    x += 1

    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {tile_size} {tile_size}" width="{tile_size}" height="{tile_size}" shape-rendering="crispEdges" aria-hidden="true">',
    ]
    for fill_name in PIXEL_STATE_ORDER:
        rects = paths_by_fill[fill_name]
        if rects:
            lines.append(f'  <path fill="{PIXEL_TO_FILL[fill_name]}" d="{" ".join(rects)}"/>')
    lines += ['</svg>', '']
    return '\n'.join(lines)


def blank_svg(*, tile_size: int = DEFAULT_GEOMETRY.tile_size) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {tile_size} {tile_size}" '
        f'width="{tile_size}" height="{tile_size}" shape-rendering="crispEdges" aria-hidden="true">\n'
        f'</svg>\n'
    )


def slot_to_grid(slots: list[int], *, geometry: TileGeometry = DEFAULT_GEOMETRY) -> dict[int, tuple[int, int]]:
    return {
        slot: ((slot % geometry.grid_size), (slot // geometry.grid_size))
        for slot in slots
    }


def project_root(script_path: str | Path) -> Path:
    return Path(script_path).resolve().parent.parent
