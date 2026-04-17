"""Convert logo PNGs to WebP under a byte limit (default 100KB)."""
from __future__ import annotations

import os
import sys

from PIL import Image


def convert_under_limit(src: str, dst: str, max_bytes: int = 100 * 1024) -> bool:
    im = Image.open(src)
    if im.mode not in ("RGBA", "RGB"):
        im = im.convert("RGBA")
    for q in range(92, 49, -4):
        im.save(dst, "WEBP", quality=q, method=6)
        sz = os.path.getsize(dst)
        if sz <= max_bytes:
            print(f"{os.path.basename(src)} -> {os.path.basename(dst)} q={q} size={sz}")
            return True
    w, h = im.size
    for scale in (0.9, 0.85, 0.8, 0.75, 0.7):
        im2 = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        for q in range(88, 49, -4):
            im2.save(dst, "WEBP", quality=q, method=6)
            sz = os.path.getsize(dst)
            if sz <= max_bytes:
                print(
                    f"{os.path.basename(src)} -> {os.path.basename(dst)} "
                    f"scale={scale} q={q} size={sz}"
                )
                return True
    print(f"FAILED {src} size={os.path.getsize(dst)}", file=sys.stderr)
    return False


def main() -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "next-app", "public", "images", "logo")
    root = os.path.normpath(root)
    for name in ("logo-mobile.png", "logo-desktop.png"):
        src = os.path.join(root, name)
        dst = os.path.join(root, name.replace(".png", ".webp"))
        if not os.path.isfile(src):
            print(f"skip missing: {src}", file=sys.stderr)
            continue
        convert_under_limit(src, dst)


if __name__ == "__main__":
    main()
