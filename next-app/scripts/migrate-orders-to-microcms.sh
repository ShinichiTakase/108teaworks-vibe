#!/usr/bin/env bash
# Ubuntu 等で注文 JSON を microCMS orders に移行するラッパー。
#
# 使い方（next-app ディレクトリで）:
#   chmod +x scripts/migrate-orders-to-microcms.sh
#   ./scripts/migrate-orders-to-microcms.sh
#   ./scripts/migrate-orders-to-microcms.sh --dry-run
#   ./scripts/migrate-orders-to-microcms.sh --dry-run --export ./data/orders-microcms-export
#   ./scripts/migrate-orders-to-microcms.sh --source /var/app/data/orders
#
# Node が見つからない場合:
#   - nvm: ログインシェルでは使えるがスクリプトでは PATH に乗らない → 下で ~/.nvm/nvm.sh を読み込む
#   - バイナリを直接指定: export MIGRATE_NODE=/path/to/node
#
# 要: Node.js 18+、.env.local に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY（--dry-run 時はキー不要）
# .env.local は CRLF でも可（読み込み時に CR を除去）
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT}"

# .env.local を先に読む（PATH や MIGRATE_NODE を書けるようにする）
# Windows 由来の CRLF だと source で $'\r': command not found になるため CR を除去する
ENV_FILE="${ROOT}/.env.local"
if [ -f "${ENV_FILE}" ]; then
  set -a
  # shellcheck disable=SC1090
  source <(sed 's/\r$//' "${ENV_FILE}")
  set +a
fi

# nvm（非対話実行でも node を PATH に載せる）
export NVM_DIR="${NVM_DIR:-${HOME}/.nvm}"
if [ -s "${NVM_DIR}/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "${NVM_DIR}/nvm.sh"
fi

# fnm
if command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env 2>/dev/null)" || true
fi

# asdf
if [ -f "${HOME}/.asdf/asdf.sh" ]; then
  # shellcheck disable=SC1090
  . "${HOME}/.asdf/asdf.sh"
fi

resolve_node() {
  if [ -n "${MIGRATE_NODE:-}" ] && [ -x "${MIGRATE_NODE}" ]; then
    echo "${MIGRATE_NODE}"
    return 0
  fi
  if command -v node >/dev/null 2>&1; then
    command -v node
    return 0
  fi
  if command -v nodejs >/dev/null 2>&1; then
    command -v nodejs
    return 0
  fi
  for candidate in /usr/local/bin/node /usr/bin/node; do
    if [ -x "${candidate}" ]; then
      echo "${candidate}"
      return 0
    fi
  done
  return 1
}

NODE_CMD=""
if ! NODE_CMD="$(resolve_node)"; then
  echo "error: node が見つかりません。次のいずれかを試してください。" >&2
  echo "  - Node.js 18+ をインストールする（apt / 公式バイナリ / nvm など）" >&2
  echo "  - nvm 利用時: bash -lc './scripts/migrate-orders-to-microcms.sh ...' でログインシェル経由で実行" >&2
  echo "  - バイナリを明示: export MIGRATE_NODE=/path/to/node" >&2
  exit 1
fi

NODE_MAJOR="$("${NODE_CMD}" -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
if [ "${NODE_MAJOR}" -lt 18 ] 2>/dev/null; then
  echo "error: Node.js 18 以上が必要です（現在: $("${NODE_CMD}" -v 2>/dev/null || echo unknown)、実行: ${NODE_CMD}）" >&2
  exit 1
fi

# Node にそのまま渡す（.env.local マージで MIGRATE_* が消えるのを防ぐ）
NODE_SCRIPT_ARGS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)
      export MIGRATE_DRY_RUN=1
      NODE_SCRIPT_ARGS+=(--dry-run)
      shift
      ;;
    --source)
      if [ $# -lt 2 ]; then
        echo "error: --source にはディレクトリパスが必要です" >&2
        exit 1
      fi
      export MIGRATE_ORDERS_DIR="$2"
      NODE_SCRIPT_ARGS+=(--source "$2")
      shift 2
      ;;
    --export)
      if [ $# -lt 2 ]; then
        echo "error: --export には出力ディレクトリが必要です" >&2
        exit 1
      fi
      export MIGRATE_EXPORT_DIR="$2"
      NODE_SCRIPT_ARGS+=(--export "$2")
      shift 2
      ;;
    -h|--help)
      cat <<'USAGE'
注文 JSON を microCMS orders に移行（next-app 直下で実行）

  1) 確認のみ: ./scripts/migrate-orders-to-microcms.sh --dry-run
     curl 用 JSON 出力: --export ./data/orders-microcms-export を追加
  2) 本番 POST: ./scripts/migrate-orders-to-microcms.sh
     手動 POST: ./scripts/post-microcms-orders-curl.sh ./data/orders-microcms-export

  ./scripts/migrate-orders-to-microcms.sh --source /path/to/orders

環境変数: .env.local に MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY
          （--dry-run 時は API キー不要）
          MIGRATE_NODE=/path/to/node … node バイナリの明示指定

既定の読み込み先: data/orders → .data/order_snapshots（存在する方）
USAGE
      exit 0
      ;;
    *)
      echo "error: 不明な引数: $1（--dry-run / --source DIR / --export DIR / --help）" >&2
      exit 1
      ;;
  esac
done

echo "working directory: ${ROOT}" >&2
echo "using node: ${NODE_CMD} ($("${NODE_CMD}" -v))" >&2
echo "（--dry-run 時は microCMS へは書き込みません）" >&2
# Node の stderr を stdout に合流（SSH 等で片方だけ見えない環境向け）
"${NODE_CMD}" "${ROOT}/scripts/migrate-orders-to-microcms.mjs" "${NODE_SCRIPT_ARGS[@]}" 2>&1
exit $?
