"""Convert images/books/Organization.png to transparent WebP ~10KB (banner-sized)."""
from __future__ import annotations

import os
import sys

from PIL import Image


def main() -> None:
    root = os.path.normpath(
        os.path.join(os.path.dirname(__file__), "..", "next-app", "public", "images", "books")
    )
    src = os.path.join(root, "Organization.png")
    dst = os.path.join(root, "Organization.webp")
    target_max = 10 * 1024

    if not os.path.isfile(src):
        print(f"missing: {src}", file=sys.stderr)
        sys.exit(1)

    im = Image.open(src).convert("RGBA")
    w0, h0 = im.size

    for max_side in (200, 176, 160, 144, 128, 112, 96):
        scale = min(max_side / w0, max_side / h0)
        im2 = im.resize((max(1, int(w0 * scale)), max(1, int(h0 * scale))), Image.Resampling.LANCZOS)
        for q in range(78, 34, -4):
            im2.save(dst, "WEBP", quality=q, method=6, lossless=False)
            sz = os.path.getsize(dst)
            if sz <= target_max:
                print(f"Organization.webp max_side={max_side} q={q} size={sz} ({im2.size})")
                return

    print(f"FAILED under {target_max} bytes, last size={os.path.getsize(dst)}", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
