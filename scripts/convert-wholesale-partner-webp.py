"""Convert public/images/wholesale/partner.jpg to WebP under 50KB."""
from __future__ import annotations

import os
import sys

from PIL import Image


def convert_under_limit(src: str, dst: str, max_bytes: int = 50 * 1024) -> bool:
    im = Image.open(src)
    if im.mode in ("RGBA", "P"):
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")

    def try_save(img: Image.Image, q: int) -> int:
        img.save(dst, "WEBP", quality=q, method=6)
        return os.path.getsize(dst)

    for q in range(85, 39, -5):
        sz = try_save(im, q)
        if sz <= max_bytes:
            print(f"{os.path.basename(src)} -> {os.path.basename(dst)} q={q} size={sz}")
            return True

    w, h = im.size
    for scale in (0.85, 0.75, 0.65, 0.55, 0.5):
        im2 = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
        for q in range(82, 39, -5):
            sz = try_save(im2, q)
            if sz <= max_bytes:
                print(
                    f"{os.path.basename(src)} -> {os.path.basename(dst)} "
                    f"scale={scale} q={q} size={sz}"
                )
                return True

    print(f"FAILED {src} size={os.path.getsize(dst)}", file=sys.stderr)
    return False


def main() -> None:
    root = os.path.normpath(
        os.path.join(os.path.dirname(__file__), "..", "next-app", "public", "images", "wholesale")
    )
    src = os.path.join(root, "partner.jpg")
    dst = os.path.join(root, "partner.webp")
    if not os.path.isfile(src):
        print(f"missing: {src}", file=sys.stderr)
        sys.exit(1)
    convert_under_limit(src, dst)


if __name__ == "__main__":
    main()
