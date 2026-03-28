#!/usr/bin/env bash
# ① next-app/.env.local → .env.old（既存 .env.old は時刻付きで退避）
# ② next-app/.env.next → .env.local
# ③ next-app/lib/commonTexts.ts のクーポンバナー文言を空にする
# ④ Docker Compose で shop-next をビルドし直して再作成（env と commonTexts の反映）
#
# 要: bash, sed, mktemp, docker compose（Linux / Git Bash / WSL 想定）
#
# 使い方（リポジトリルート = 本スクリプトの親の親）:
#   bash scripts/switch-env-restart-shop.sh
#
# 任意の上書き:
#   COMPOSE_FILE=docker-compose.shop.yml SHOP_SERVICE=shop-next bash scripts/switch-env-restart-shop.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_DIR="${ROOT}/next-app"
COMMON_TEXTS="${ENV_DIR}/lib/commonTexts.ts"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.shop.yml}"
SHOP_SERVICE="${SHOP_SERVICE:-shop-next}"

cd "$ROOT"

if [[ ! -f "${ENV_DIR}/.env.next" ]]; then
  echo "error: 切り替え元がありません: ${ENV_DIR}/.env.next" >&2
  exit 1
fi

if [[ ! -f "$COMMON_TEXTS" ]]; then
  echo "error: 見つかりません: $COMMON_TEXTS" >&2
  exit 1
fi

if [[ ! -f "${ROOT}/${COMPOSE_FILE}" ]]; then
  echo "error: Compose ファイルがありません: ${ROOT}/${COMPOSE_FILE}" >&2
  exit 1
fi

# ① .env.local → .env.old
if [[ -f "${ENV_DIR}/.env.local" ]]; then
  if [[ -f "${ENV_DIR}/.env.old" ]]; then
    backup="${ENV_DIR}/.env.old.$(date +%Y%m%d%H%M%S)"
    echo "既存の .env.old を退避: $backup"
    mv "${ENV_DIR}/.env.old" "$backup"
  fi
  echo "① ${ENV_DIR}/.env.local → ${ENV_DIR}/.env.old"
  mv "${ENV_DIR}/.env.local" "${ENV_DIR}/.env.old"
else
  echo "① .env.local が無いためスキップ（新規 .env.local のみ作成）"
fi

# ② .env.next → .env.local
echo "② ${ENV_DIR}/.env.next → ${ENV_DIR}/.env.local"
mv "${ENV_DIR}/.env.next" "${ENV_DIR}/.env.local"

# ③ バナー文言クリア（couponBanner: "…", の行のみ）
tmp="$(mktemp)"
sed -E 's/^([[:space:]]*)couponBanner: ".*",$/\1couponBanner: "",/' <"$COMMON_TEXTS" >"$tmp"
mv "$tmp" "$COMMON_TEXTS"
echo "③ クーポンバナーを空にしました: $COMMON_TEXTS"

# ④ イメージ再ビルド＋再作成（.env.local と commonTexts.ts はイメージ内のビルド成果物に含まれるため）
echo "④ docker compose -f ${COMPOSE_FILE} up -d --build --force-recreate ${SHOP_SERVICE}"
docker compose -f "${COMPOSE_FILE}" up -d --build --force-recreate "${SHOP_SERVICE}"

echo "完了しました。"
