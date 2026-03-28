#!/usr/bin/env bash
# Ubuntu 等で注文 JSON を microCMS orders に移行するラッパー。
#
# 使い方（next-app ディレクトリで）:
#   chmod +x scripts/migrate-orders-to-microcms.sh
#   ./scripts/migrate-orders-to-microcms.sh
#   ./scripts/migrate-orders-to-microcms.sh --dry-run
#   ./scripts/migrate-orders-to-microcms.sh --source /var/app/data/orders
#
# 要: Node.js 18+、.env.local に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY（--dry-run 時はキー不要）
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT}"

if ! command -v node >/dev/null 2>&1; then
  echo "error: node が見つかりません。Node.js 18 以上をインストールしてください。" >&2
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
if [ "${NODE_MAJOR}" -lt 18 ] 2>/dev/null; then
  echo "error: Node.js 18 以上が必要です（現在: $(node -v 2>/dev/null || echo unknown)）" >&2
  exit 1
fi

# .env.local を読み込み（export 用）
ENV_FILE="${ROOT}/.env.local"
if [ -f "${ENV_FILE}" ]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

DRY_RUN=""
SOURCE_DIR=""

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      export MIGRATE_DRY_RUN=1
      shift
      ;;
    --source)
      if [ $# -lt 2 ]; then
        echo "error: --source にはディレクトリパスが必要です" >&2
        exit 1
      fi
      SOURCE_DIR="$2"
      export MIGRATE_ORDERS_DIR="${SOURCE_DIR}"
      shift 2
      ;;
    -h|--help)
      cat <<'USAGE'
注文 JSON を microCMS orders に移行（next-app 直下で実行）

  ./scripts/migrate-orders-to-microcms.sh
  ./scripts/migrate-orders-to-microcms.sh --dry-run
  ./scripts/migrate-orders-to-microcms.sh --source /path/to/orders

環境変数: .env.local に MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY
          （--dry-run 時は API キー不要）

既定の読み込み先: data/orders → .data/order_snapshots（存在する方）
USAGE
      exit 0
      ;;
    *)
      echo "error: 不明な引数: $1（--dry-run / --source DIR / --help）" >&2
      exit 1
      ;;
  esac
done

echo "working directory: ${ROOT}"
exec node "${ROOT}/scripts/migrate-orders-to-microcms.mjs"
