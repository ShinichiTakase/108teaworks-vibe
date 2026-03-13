#!/bin/bash
# ConoHa 上の WordPress から「伊勢茶とは」固定ページの本文を取得し、
# next-app/data/isecha-from-wordpress.html に保存します。
# 実行: cd next-app && chmod +x scripts/export-isecha-from-wp.sh && KEY=/path/to/key.pem ./scripts/export-isecha-from-wp.sh

set -e
HOST="${CONOHA_HOST:-www228.conoha.ne.jp}"
PORT="${CONOHA_PORT:-8022}"
USER="${CONOHA_USER:-c1335736}"
KEY="${KEY:-$HOME/.ssh/key-2026-03-01-19-32.pem}"
OUTPUT_DIR="${0%/*}/../data"
OUTPUT_FILE="$OUTPUT_DIR/isecha-from-wordpress.html"

# next-app から実行する想定
mkdir -p "$OUTPUT_DIR"

echo "ConoHa WordPress から「伊勢茶とは」を取得します: ${USER}@${HOST}:${PORT}"
echo "出力先: $OUTPUT_FILE"
echo ""

# リモートで WordPress のパスを探し、PHP で該当ページの post_content を出力する
# （複数の候補パスを試す）。PHP 部分は単一引用で囲みリモートで $p が展開されないようにする
REMOTE_SCRIPT='
WP_ROOTS="/home/'"$USER"'/public_html /home/'"$USER"'/public_html/108teaworks.com"
for ROOT in $WP_ROOTS; do
  if [ -f "$ROOT/wp-load.php" ]; then
    echo "Found WordPress at: $ROOT" >&2
    cd "$ROOT"
    php -r '\''
      define("ABSPATH", "./");
      @require "wp-load.php";
      if (!function_exists("get_page_by_path")) { echo "NOT_FOUND"; exit(1); }
      $p = get_page_by_path("isecha") ?: get_page_by_path("ise-cha");
      if (!$p) { echo "NOT_FOUND"; exit(1); }
      echo $p->post_content;
    '\'' 2>/dev/null && exit 0
  fi
done
echo "WordPress or isecha page not found in any candidate path." >&2
exit 1
'

if ssh -p "$PORT" -i "$KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${USER}@${HOST}" "$REMOTE_SCRIPT" > "$OUTPUT_FILE" 2>/dev/null; then
  if [ -s "$OUTPUT_FILE" ] && ! grep -q 'NOT_FOUND' "$OUTPUT_FILE"; then
    echo "取得しました: $OUTPUT_FILE"
    echo "行数: $(wc -l < "$OUTPUT_FILE")"
  else
    echo "該当ページが見つかりませんでした。"
    rm -f "$OUTPUT_FILE"
    exit 1
  fi
else
  echo "SSH または PHP の実行に失敗しました。"
  echo "  - KEY を指定していますか？例: KEY=$HOME/.ssh/your-key.pem $0"
  echo "  - WordPress は public_html または public_html/108teaworks.com にありますか？"
  exit 1
fi
