# vibe.108teaworks.com 初回コミット＆プッシュ
# 使い方: PowerShell でこのスクリプトを実行するか、中身を手動で実行してください。

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

# リポジトリが未初期化なら初期化
if (-not (Test-Path ".git")) {
    git init
    Write-Host "git init しました。"
}

# リモートが未設定なら案内
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "リモートが設定されていません。以下で追加してください:"
    Write-Host '  git remote add origin <GitHub/GitLab などのリポジトリURL>'
    Write-Host ""
    Write-Host "リモートを設定したあと、再度このスクリプトを実行するか、以下を手動で実行:"
    Write-Host "  git add ."
    Write-Host '  git commit -m "vibe.108teasworks.com初回コミット"'
    Write-Host "  git push -u origin main"
    exit 1
}

git add .
git status
git commit -m "vibe.108teasworks.com初回コミット"
git branch -M main 2>$null
git push -u origin main

Write-Host "完了しました。"
