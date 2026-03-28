#!/usr/bin/env bash
# migrate-orders の --export で作った *.microcms.json を curl で POST する。
# next-app 直下で: ./scripts/post-microcms-orders-curl.sh ./data/orders-microcms-export
# 重複チェックはしない（同じ orderNo の二重登録に注意）。通常は node スクリプト本番実行で十分。
#
# .env.local から MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY を読む（CRLF 除去済み）。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT}"

EXPORT_DIR="${1:?使い方: $0 /path/to/export-dir（*.microcms.json を含む）}"

ENV_FILE="${ROOT}/.env.local"
if [ ! -f "${ENV_FILE}" ]; then
  echo "error: .env.local が見つかりません（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）" >&2
  exit 1
fi
set -a
# shellcheck disable=SC1090
source <(sed 's/\r$//' "${ENV_FILE}")
set +a

DOMAIN="${MICROCMS_SERVICE_DOMAIN:-}"
KEY="${MICROCMS_API_KEY:-}"
if [ -z "${DOMAIN}" ] || [ -z "${KEY}" ]; then
  echo "error: MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を .env.local に設定してください" >&2
  exit 1
fi

URL="https://${DOMAIN}.microcms.io/api/v1/orders"
shopt -s nullglob
files=("${EXPORT_DIR}"/*.microcms.json)
if [ ${#files[@]} -eq 0 ]; then
  echo "error: ${EXPORT_DIR} に *.microcms.json がありません" >&2
  exit 1
fi

ok=0
fail=0
body="$(mktemp)"
trap 'rm -f "${body}"' EXIT
for f in "${files[@]}"; do
  code="$(curl -sS -o "${body}" -w "%{http_code}" -X POST "${URL}" \
    -H "Content-Type: application/json" \
    -H "X-MICROCMS-API-KEY: ${KEY}" \
    -d @"${f}")" || true
  if [ "${code}" = "201" ] || [ "${code}" = "200" ]; then
    echo "[ok]" "${code}" "$(basename "${f}")" >&2
    ok=$((ok + 1))
  else
    echo "[fail]" "${code}" "$(basename "${f}")" "$(head -c 400 "${body}" 2>/dev/null || true)" >&2
    fail=$((fail + 1))
  fi
done
echo "[post-microcms-orders-curl] ok=${ok} fail=${fail}" >&2
[ "${fail}" -eq 0 ]
