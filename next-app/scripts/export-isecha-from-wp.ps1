# ConoHa 上の WordPress から「伊勢茶とは」固定ページの本文を取得し、
# next-app/data/isecha-from-wordpress.html に保存します。
# 実行: cd next-app のあと .\scripts\export-isecha-from-wp.ps1

$ErrorActionPreference = "Stop"
$HostName = "www228.conoha.ne.jp"
$Port = 8022
$User = "c1335736"
$KeyPath = $env:KEY
if (-not $KeyPath) { $KeyPath = "$env:USERPROFILE\.ssh\key-2026-03-01-19-32.pem" }

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$OutputDir = Join-Path $ScriptDir "..\data"
$OutputFile = Join-Path $OutputDir "isecha-from-wordpress.html"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# リモートで WordPress を探し、PHP で該当ページの post_content を出力
$RemoteCmd = @'
WP_ROOTS="/home/c1335736/public_html /home/c1335736/public_html/108teaworks.com"
for ROOT in $WP_ROOTS; do
  if [ -f "$ROOT/wp-load.php" ]; then
    echo "Found WordPress at: $ROOT" >&2
    cd "$ROOT"
    php -r 'define("ABSPATH", "./"); @require "wp-load.php"; if (!function_exists("get_page_by_path")) { echo "NOT_FOUND"; exit(1); } $p = get_page_by_path("isecha") ?: get_page_by_path("ise-cha"); if (!$p) { echo "NOT_FOUND"; exit(1); } echo $p->post_content;' 2>/dev/null && exit 0
  fi
done
echo "NOT_FOUND" >&2
exit 1
'@

Write-Host "ConoHa WordPress から「伊勢茶とは」を取得します: ${User}@${HostName}:${Port}"
Write-Host "出力先: $OutputFile"
Write-Host ""

try {
  $result = & ssh -p $Port -i $KeyPath -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${User}@${HostName}" $RemoteCmd 2>&1
  $result | Set-Content -Path $OutputFile -Encoding UTF8
  $content = Get-Content -Path $OutputFile -Raw
  if ($content -and $content.Length -gt 0 -and $content -notmatch "NOT_FOUND") {
    Write-Host "取得しました: $OutputFile"
    Write-Host "文字数: $($content.Length)"
  } else {
    Write-Host "該当ページが見つかりませんでした。"
    Remove-Item -Path $OutputFile -ErrorAction SilentlyContinue
    exit 1
  }
} catch {
  Write-Host "SSH に失敗しました: $_"
  Write-Host "  KEY を指定: `$env:KEY = 'C:\path\to\key.pem'"
  exit 1
}
