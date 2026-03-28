#!/usr/bin/env bash
# next-app/lib/commonTexts.ts のクーポンバナー文言をすべて空にする。
# CouponBanner は空文字のとき非表示になる。
#
# 要: sed（Linux / macOS / Git Bash / WSL）。PowerShell 単体では動きません。
#
# 使い方（リポジトリルート想定）:
#   bash scripts/clear-coupon-banner.sh
#   chmod +x scripts/clear-coupon-banner.sh && ./scripts/clear-coupon-banner.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="${ROOT}/next-app/lib/commonTexts.ts"

if [[ ! -f "$FILE" ]]; then
  echo "error: 見つかりません: $FILE" >&2
  exit 1
fi

# couponBanner: "…", の行だけ置換（型定義の couponBanner: string; はマッチしない）
replace_lines() {
  sed -E 's/^([[:space:]]*)couponBanner: ".*",$/\1couponBanner: "",/'
}

tmp="$(mktemp)"
replace_lines <"$FILE" >"$tmp"
mv "$tmp" "$FILE"

echo "クーポンバナーを空にしました: $FILE"
