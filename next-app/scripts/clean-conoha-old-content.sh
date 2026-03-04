#!/bin/bash
# ConoHa 上の shop.108teaworks.com にある古い静的コンテンツを削除します。
# 実行: chmod +x scripts/clean-conoha-old-content.sh && ./scripts/clean-conoha-old-content.sh

set -e
HOST="www228.conoha.ne.jp"
PORT="8022"
USER="c1335736"
KEY="${KEY:-$HOME/.ssh/key-2026-03-01-19-32.pem}"
REMOTE_DIR="/home/c1335736/public_html/shop.108teaworks.com"

echo "ConoHa 上の古いコンテンツを削除します: $HOST$REMOTE_DIR"
echo "削除対象: index.htm, css/, images/"
read -p "続行しますか? (y/N) " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "中止しました."
  exit 0
fi

ssh -p "$PORT" -i "$KEY" -o StrictHostKeyChecking=no "${USER}@${HOST}" \
  "cd $REMOTE_DIR && rm -rf index.htm css images && echo Done"

echo "完了."
