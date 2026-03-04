# 108teaworks.com の画像をローカルにDLし、shop.108teaworks.com にアップロードする
# 実行: PowerShell で cd プロジェクトルート のあと .\scripts\sync-images-from-108teaworks.ps1

$ErrorActionPreference = "Stop"
$key = "C:\Users\shint\.ssh\key-2026-03-01-19-32.pem"
$hostAddr = "www228.conoha.ne.jp"
$user = "c1335736"
$port = 8022

# プロジェクトルート（スクリプトがある scripts の親）
$root = (Get-Item $PSScriptRoot).Parent.FullName
if (-not $root -or -not (Test-Path (Join-Path $root "index.htm"))) {
    $root = Resolve-Path (Join-Path (Get-Location) "..")
}
$localSrc = Join-Path $root "images-108teaworks-src"
$localImages = Join-Path $root "images"
$remote108 = "${user}@${hostAddr}:/home/c1335736/public_html/108teaworks.com/wp-content/uploads"
$remoteShop = "${user}@${hostAddr}:/home/c1335736/public_html/shop.108teaworks.com"

Write-Host "=== 1) 108teaworks.com の画像をサーバーからローカルへ DL ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $localSrc | Out-Null
# 2024 フォルダ（ロゴ・ヒーロー）を取得
& scp -P $port -i $key -o StrictHostKeyChecking=no -r "${remote108}/2024" $localSrc
# プレースホルダー
& scp -P $port -i $key -o StrictHostKeyChecking=no "${remote108}/woocommerce-placeholder-300x300.webp" $localSrc
& scp -P $port -i $key -o StrictHostKeyChecking=no "${remote108}/woocommerce-placeholder-768x768.webp" $localSrc

Write-Host "=== 2) shop 用 images に整理 ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path (Join-Path $localImages "logo") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $localImages "hero") | Out-Null

$logoDir = Join-Path $localSrc "2024\08"
if (Test-Path $logoDir) {
    Copy-Item -Path (Join-Path $logoDir "*") -Destination (Join-Path $localImages "logo") -Force
    $f = Get-ChildItem (Join-Path $localImages "logo") -Filter "*300*95*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($f) { Copy-Item $f.FullName (Join-Path $localImages "logo\logo-header.jpg") -Force }
    $f = Get-ChildItem (Join-Path $localImages "logo") -Filter "*1024*325*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($f) { Copy-Item $f.FullName (Join-Path $localImages "logo\logo-header-wide.jpg") -Force }
}

$heroDir = Join-Path $localSrc "2024\02"
if (Test-Path $heroDir) {
    $f = Get-ChildItem $heroDir -Filter "DSCF0715*1024*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($f) { Copy-Item $f.FullName (Join-Path $localImages "hero\tea-field.jpg") -Force }
    $f = Get-ChildItem $heroDir -Filter "*藤八茶業*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($f) { Copy-Item $f.FullName (Join-Path $localImages "hero\about.png") -Force }
}

if (Test-Path (Join-Path $localSrc "woocommerce-placeholder-300x300.webp")) {
    Copy-Item (Join-Path $localSrc "woocommerce-placeholder-300x300.webp") (Join-Path $localImages "placeholder-product.webp") -Force
}
if (Test-Path (Join-Path $localSrc "woocommerce-placeholder-768x768.webp")) {
    Copy-Item (Join-Path $localSrc "woocommerce-placeholder-768x768.webp") (Join-Path $localImages "placeholder-product-lg.webp") -Force
}

Write-Host "=== 3) ローカル images を shop.108teaworks.com へアップロード ===" -ForegroundColor Cyan
# images フォルダごと送る → リモートに shop.108teaworks.com/images/ ができる
& scp -P $port -i $key -o StrictHostKeyChecking=no -r $localImages "${remoteShop}/"

Write-Host "完了. ローカル: $localImages  /  取得元バックアップ: $localSrc" -ForegroundColor Green
