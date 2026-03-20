#!/usr/bin/env python3
"""
Extract the Batman mask hat tiles from batman.png.
Keeps the mask opaque over hair/skin while carving transparent eye sockets
from the original art and preserving mouth/jaw cutouts for animation.
"""
from collections import deque
from pathlib import Path

from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / 'src/assets/avatar/tiles/hats'
SOURCE = ROOT / 'src/assets/avatar/outfits/batman.png'
NAME = 'batman-mask'

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

MOUTH_CUTOUT_RECTS = {
    20: [(7, 9, 25, 25)],
    21: [(0, 9, 18, 25)],
}

EYE_SOCKET_FLOODS = {
    14: {'seed': (44, 52), 'bbox': (35, 43, 64, 62)},
    15: {'seed': (78, 52), 'bbox': (64, 43, 93, 62)},
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


def build_art(arr):
    art = []
    for ay in range(ART_SIZE):
        row = []
        for ax in range(ART_SIZE):
            row.append(quantize(get_art_pixel_rgb(arr, ax, ay)))
        art.append(row)
    return art


def extract_tile(art, col, row):
    tile = []
    for ty in range(TILE_SIZE):
        row_data = []
        for tx in range(TILE_SIZE):
            ax = col * TILE_SIZE + tx - ART_OFFSET_X
            ay = row * TILE_SIZE + ty - ART_OFFSET_Y
            if 0 <= ax < ART_SIZE and 0 <= ay < ART_SIZE:
                row_data.append(art[ay][ax])
            else:
                row_data.append('white')
        tile.append(row_data)
    return tile


def rect_path(x1, y1, x2, y2):
    return f'M{x1} {y1}h{x2 - x1}v{y2 - y1}H{x1}z'


def apply_rect_cutouts(tile, rects):
    for x1, y1, x2, y2 in rects:
        for y in range(max(0, y1), min(TILE_SIZE, y2)):
            for x in range(max(0, x1), min(TILE_SIZE, x2)):
                tile[y][x] = 'white'


def apply_pixel_cutouts(tile, pixels):
    for x, y in pixels:
        if 0 <= x < TILE_SIZE and 0 <= y < TILE_SIZE:
            tile[y][x] = 'white'


def compress_pixels_to_paths(pixels):
    if not pixels:
        return []

    by_row = {}
    for x, y in pixels:
        by_row.setdefault(y, []).append(x)

    paths = []
    for y, xs in by_row.items():
        xs = sorted(xs)
        start = xs[0]
        prev = xs[0]
        for x in xs[1:]:
            if x == prev + 1:
                prev = x
                continue
            paths.append(rect_path(start, y, prev + 1, y + 1))
            start = prev = x
        paths.append(rect_path(start, y, prev + 1, y + 1))
    return paths


def art_to_slot_pixel(ax, ay, slot):
    col, row = SLOT_TO_GRID[slot]
    tx = ax - (col * TILE_SIZE - ART_OFFSET_X)
    ty = ay - (row * TILE_SIZE - ART_OFFSET_Y)
    if 0 <= tx < TILE_SIZE and 0 <= ty < TILE_SIZE:
        return tx, ty
    return None


def flood_cutout_pixels(art, seed, bbox):
    x1, y1, x2, y2 = bbox
    q = deque([seed])
    seen = {seed}
    pixels = set()

    while q:
        x, y = q.popleft()
        if not (x1 <= x < x2 and y1 <= y < y2):
            continue
        if art[y][x] == 'black':
            continue

        pixels.add((x, y))
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if (nx, ny) not in seen:
                seen.add((nx, ny))
                q.append((nx, ny))

    return pixels


def build_eye_socket_cutouts(art):
    slot_pixels = {}
    for slot, config in EYE_SOCKET_FLOODS.items():
        art_pixels = flood_cutout_pixels(art, config['seed'], config['bbox'])
        slot_pixels[slot] = {
            slot_pixel
            for ax, ay in art_pixels
            if (slot_pixel := art_to_slot_pixel(ax, ay, slot)) is not None
        }
    return slot_pixels


def tile_to_svg(tile, cutout_rects=None, cutout_pixels=None):
    gray_rects = []
    black_rects = []

    for y in range(TILE_SIZE):
        x = 0
        while x < TILE_SIZE:
            if tile[y][x] == 'gray':
                w = 1
                while x + w < TILE_SIZE and tile[y][x + w] == 'gray':
                    w += 1
                gray_rects.append(rect_path(x, y, x + w, y + 1))
                x += w
            else:
                x += 1

        x = 0
        while x < TILE_SIZE:
            if tile[y][x] == 'black':
                w = 1
                while x + w < TILE_SIZE and tile[y][x + w] == 'black':
                    w += 1
                black_rects.append(rect_path(x, y, x + w, y + 1))
                x += w
            else:
                x += 1

    hole_paths = []
    for rect in cutout_rects or []:
        hole_paths.append(rect_path(*rect))
    hole_paths.extend(compress_pixels_to_paths(cutout_pixels or set()))

    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25" height="25" shape-rendering="crispEdges" aria-hidden="true">',
    ]
    if hole_paths:
        background = ' '.join([rect_path(0, 0, TILE_SIZE, TILE_SIZE), *hole_paths])
        lines.append(f'  <path fill="#ffffff" fill-rule="evenodd" d="{background}"/>')
    else:
        lines.append('  <rect width="25" height="25" fill="#ffffff"/>')
    if gray_rects:
        lines.append(f'  <path fill="#808080" d="{" ".join(gray_rects)}"/>')
    if black_rects:
        lines.append(f'  <path fill="#000000" d="{" ".join(black_rects)}"/>')
    lines += ['</svg>', '']
    return '\n'.join(lines)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    arr = np.array(Image.open(SOURCE).convert('RGBA'))
    art = build_art(arr)
    eye_cutout_pixels = build_eye_socket_cutouts(art)

    for slot, (col, row) in SLOT_TO_GRID.items():
        tile = extract_tile(art, col, row)
        cutout_rects = MOUTH_CUTOUT_RECTS.get(slot, [])
        cutout_pixels = eye_cutout_pixels.get(slot, set())

        apply_rect_cutouts(tile, cutout_rects)
        apply_pixel_cutouts(tile, cutout_pixels)

        out = OUTPUT_DIR / f'{NAME}-slot-{slot:02d}.svg'
        out.write_text(tile_to_svg(tile, cutout_rects=cutout_rects, cutout_pixels=cutout_pixels))
        print(out.relative_to(ROOT))


if __name__ == '__main__':
    main()
