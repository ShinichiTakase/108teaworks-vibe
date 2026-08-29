#!/usr/bin/env bash
# ① next-app/.env.local → .env.old（既存 .env.old は時刻付きで退避）
# ② next-app/.env.next → .env.local
# ③ next-app/lib/commonTexts.ts のクーポンバナー文言を空にする
# ④ Docker Compose で shop-next をビルドし直して再作成（env と commonTexts の反映）
#
# 要: bash, sed, mktemp, docker compose（Linux / Git Bash / WSL 想定）
#
# 使い方（リポジトリルート = 本スクリプトの親の親。本番サーバーでは /opt/project/108teaworks を想定）:
#   bash scripts/switch-env-restart-shop.sh
#
# 任意の上書き:
#   COMPOSE_FILE=/path/to/docker-compose.yml SHOP_SERVICE=shop-next bash scripts/switch-env-restart-shop.sh
#
# 注意: 本番の実体は本リポジトリの docker-compose.shop.yml ではなく、
# サーバー上の別ディレクトリ /opt/project/deploy/xserver-vps/docker-compose.yml
# （コンテナ名 xsvps-shop-next、ビルドコンテキストは ../../108teaworks/next-app）。
# COMPOSE_FILE のデフォルトはこの本番構成に合わせている。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_DIR="${ROOT}/next-app"
COMMON_TEXTS="${ENV_DIR}/lib/commonTexts.ts"
COMPOSE_FILE="${COMPOSE_FILE:-/opt/project/deploy/xserver-vps/docker-compose.yml}"
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

# COMPOSE_FILE は絶対パス（本番デフォルト）・相対パスのどちらでも指定可能
if [[ "$COMPOSE_FILE" = /* ]]; then
  COMPOSE_FILE_PATH="$COMPOSE_FILE"
else
  COMPOSE_FILE_PATH="${ROOT}/${COMPOSE_FILE}"
fi

if [[ ! -f "$COMPOSE_FILE_PATH" ]]; then
  echo "error: Compose ファイルがありません: ${COMPOSE_FILE_PATH}" >&2
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
echo "④ docker compose -f ${COMPOSE_FILE_PATH} up -d --build --force-recreate ${SHOP_SERVICE}"
docker compose -f "${COMPOSE_FILE_PATH}" up -d --build --force-recreate "${SHOP_SERVICE}"

echo "完了しました。"
