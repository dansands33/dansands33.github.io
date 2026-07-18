#!/usr/bin/env python3
"""
ascii_crest.py — Convert an image into an ASCII-art hero "crest" for the Dan Sands site.

The output is written as plain text (one row per line) and dropped into
css/themes/<name>.txt, which js/content.js fetches and renders inside the
hero <pre class="ascii-crest"> element. The crest is rendered monochrome (a
theme gradient), so only luminance/contrast of the source matters.

Usage
-----
    # write css/themes/aurelius.txt from a source image
    python3 scripts/ascii_crest.py assets/crest-src/aurelius.png --name aurelius

    # explicit output path, custom width + charset
    python3 scripts/ascii_crest.py photo.jpg --out css/themes/dawn.txt --width 90 --charset detailed

Charset cheat-sheet
-------------------
    standard  " .:-=+*#%@"              (10 levels) classic, clean
    detailed  Paul-Bourke 70-char ramp  (photo-like, most detail)
    blocks    " ░▒▓█"                    (5 levels) smooth shading, great for crests
    brackets  " .,:;oxX%#@"              (10 levels) compact, punchy

Monospace glyphs are ~2x taller than wide, so the resized height is halved
(the 0.5 aspect correction) to keep the subject from stretching.
"""
from __future__ import annotations

import argparse
import os
import sys

from PIL import Image

try:
    from PIL import Image as _Img
    _RESAMPLE = _Img.Resampling.LANCZOS
except Exception:  # very old Pillow
    _RESAMPLE = Image.LANCZOS  # type: ignore[attr-defined]

# ---- character ramps --------------------------------------------------------
CHARSETS = {
    "standard": " .:-=+*#%@",
    "brackets": " .,:;oxX%#@",
    "blocks":   " ░▒▓█",
    "detailed": " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
}


def open_rgba(path: str) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    # composite onto opaque black so transparent areas become "empty" (space)
    bg = Image.new("RGBA", img.size, (0, 0, 0, 255))
    return Image.alpha_composite(bg, img).convert("RGB")


def center_crop_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    return img.crop((left, top, left + s, top + s))


def to_gray_array(img: Image.Image) -> list[list[float]]:
    """Return a 2D list of luminance values in 0..255."""
    g = img.convert("L")
    w, h = g.size
    px = g.load()
    return [[float(px[x, y]) for x in range(w)] for y in range(h)]  # type: ignore[index]


def adjust(rows: list[list[float]], contrast: float, brightness: float,
           invert: bool) -> list[list[float]]:
    out = []
    for row in rows:
        new = []
        for v in row:
            v = (v - 128) * contrast + 128 + brightness * 255
            v = max(0.0, min(255.0, v))
            if invert:
                v = 255 - v
            new.append(v)
        out.append(new)
    return out


def floyd_steinberg(rows: list[list[float]], levels: int) -> list[list[int]]:
    """Dither to `levels` quantized steps for crisper edges."""
    h = len(rows)
    w = len(rows[0]) if h else 0
    # work on a mutable copy
    buf = [row[:] for row in rows]
    out = [[0] * w for _ in range(h)]
    step = 255.0 / (levels - 1) if levels > 1 else 255.0
    for y in range(h):
        for x in range(w):
            old = buf[y][x]
            new = round(old / step) * step
            new = max(0.0, min(255.0, new))
            err = old - new
            out[y][x] = int(round(new / step))
            if x + 1 < w:
                buf[y][x + 1] += err * 7 / 16
            if y + 1 < h:
                if x > 0:
                    buf[y + 1][x - 1] += err * 3 / 16
                buf[y + 1][x] += err * 5 / 16
                if x + 1 < w:
                    buf[y + 1][x + 1] += err * 1 / 16
    return out


def quantize_simple(rows: list[list[float]], levels: int) -> list[list[int]]:
    step = 255.0 / (levels - 1) if levels > 1 else 255.0
    return [[min(levels - 1, int(round(v / step))) for v in row] for row in rows]


def build_ascii(img: Image.Image, *, width: int, charset: str, invert: bool,
                contrast: float, brightness: float, crop: bool, dither: bool) -> str:
    if crop:
        img = center_crop_square(img)
    w, h = img.size
    new_h = max(1, int(width * (h / w) * 0.5))
    img = img.resize((width, new_h), _RESAMPLE)

    ramp = CHARSETS[charset]
    levels = len(ramp)
    gray = to_gray_array(img)
    gray = adjust(gray, contrast, brightness, invert)

    if dither:
        idx = floyd_steinberg(gray, levels)
    else:
        idx = quantize_simple(gray, levels)

    lines = ["".join(ramp[i] for i in row) for row in idx]
    return "\n".join(lines)


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Image -> ASCII hero crest for dan-sands-site")
    p.add_argument("image", help="source image path")
    p.add_argument("--name", help="theme name; writes css/themes/NAME.txt "
                                    "(default: derive from image filename stem)")
    p.add_argument("--out", help="explicit output .txt path (overrides --name)")
    p.add_argument("--width", type=int, default=80, help="output width in chars (default 80)")
    p.add_argument("--charset", choices=sorted(CHARSETS), default="standard")
    p.add_argument("--invert", action="store_true", help="invert brightness")
    p.add_argument("--contrast", type=float, default=1.0, help="contrast multiplier")
    p.add_argument("--brightness", type=float, default=0.0, help="brightness offset (-1..1)")
    p.add_argument("--crop", action="store_true", help="center-crop to square before resize")
    p.add_argument("--dither", action="store_true", help="Floyd–Steinberg dithering")
    p.add_argument("--print", action="store_true", help="also print the result to stdout")
    args = p.parse_args(argv)

    if not os.path.exists(args.image):
        print(f"error: image not found: {args.image}", file=sys.stderr)
        return 1

    img = open_rgba(args.image)
    art = build_ascii(
        img, width=args.width, charset=args.charset, invert=args.invert,
        contrast=args.contrast, brightness=args.brightness,
        crop=args.crop, dither=args.dither,
    )

    if args.out:
        out_path = args.out
    else:
        name = args.name or os.path.splitext(os.path.basename(args.image))[0]
        out_path = os.path.join("css", "themes", f"{name}.txt")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(art + "\n")
    print(f"wrote {out_path}  ({args.width} cols x {art.count(chr(10))+1} rows)")

    if args.print:
        print(art)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
