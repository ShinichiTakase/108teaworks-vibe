#!/usr/bin/env python3
"""
ロゴ画像の白（およびほぼ白）を透過にします。
JPG の場合は PNG として保存します。
使い方:
  python scripts/make-logo-white-transparent.py
  python scripts/make-logo-white-transparent.py images/logo/logo-header.jpg
事前に: pip install Pillow
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow がありません。実行: pip install Pillow")
    raise SystemExit(1)

ROOT = Path(__file__).resolve().parent.parent
# 白とみなすしきい値（0-255）。240＝薄い白・オフホワイトも透過
WHITE_THRESHOLD = 240


def make_white_transparent(im):
    """画像の白〜ほぼ白を透過にする。im は RGBA に変換済みを想定。"""
    data = im.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    im.putdata(new_data)
    return im


def main():
    if len(sys.argv) >= 2:
        src = ROOT / sys.argv[1].replace("/", "\\").lstrip("\\")
        out = src.with_suffix(".png") if src.suffix.lower() in (".jpg", ".jpeg") else src
    else:
        src = ROOT / "images" / "logo" / "logo-mobile.png"
        out = src
        if not src.exists():
            fallback = ROOT / "images" / "logo" / "logo-header.jpg"
            if fallback.exists():
                src = fallback
                out = ROOT / "images" / "logo" / "logo-mobile.png"
                print(f"logo-mobile.png が無いため {src.name} を元に logo-mobile.png を生成します。")

    if not src.exists():
        print(f"画像が見つかりません: {src}")
        raise SystemExit(1)

    im = Image.open(src)
    if im.mode != "RGBA":
        im = im.convert("RGBA")

    make_white_transparent(im)

    if out != src and src.suffix.lower() in (".jpg", ".jpeg"):
        pass  # out はすでに .png
    elif src.suffix.lower() in (".jpg", ".jpeg"):
        out = src.with_suffix(".png")
    else:
        out = src

    im.save(out, "PNG")
    print(f"完了: {out} の白を透過にしました。")


if __name__ == "__main__":
    main()
