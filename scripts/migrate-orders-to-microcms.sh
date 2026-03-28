#!/usr/bin/env bash
# リポジトリルート（108teaworks-vibe/）から実行するラッパー。
#   ./scripts/migrate-orders-to-microcms.sh --dry-run
#   ./scripts/migrate-orders-to-microcms.sh --source /mnt/.../next-app/data/orders
# 実処理は next-app/scripts/ にある。
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "${HERE}/.." && pwd)"
TARGET="${REPO}/next-app/scripts/migrate-orders-to-microcms.sh"
if [ ! -f "${TARGET}" ]; then
  echo "error: ${TARGET} が見つかりません" >&2
  exit 1
fi
exec bash "${TARGET}" "$@"
