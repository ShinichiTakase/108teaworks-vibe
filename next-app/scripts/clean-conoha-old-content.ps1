# ConoHa 上の shop.108teaworks.com にある古い静的コンテンツを削除します。
# 実行前に .vscode/sftp.json または以下の変数を確認してください。
# 実行: PowerShell で cd next-app のあと .\scripts\clean-conoha-old-content.ps1

$ErrorActionPreference = "Stop"
$HostName = "www228.conoha.ne.jp"
$Port = 8022
$User = "c1335736"
$KeyPath = "C:\Users\shint\.ssh\key-2026-03-01-19-32.pem"
$RemoteDir = "/home/c1335736/public_html/shop.108teaworks.com"

# 削除するパス（Node.js アプリに移行するため古い HTML/CSS 等を削除）
$ToRemove = @(
    "index.htm",
    "css",
    "images"
)

$List = ($ToRemove | ForEach-Object { "$RemoteDir/$_" }) -join " "
$Cmd = "cd $RemoteDir && for f in $($ToRemove -join ' '); do [ -e `"`$f`" ] && rm -rf `"`$f`" && echo Removed `$f; done"

Write-Host "ConoHa 上の古いコンテンツを削除します: $HostName$RemoteDir"
Write-Host "削除対象: $($ToRemove -join ', ')"
$Confirm = Read-Host "続行しますか? (y/N)"
if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "中止しました."
    exit 0
}

# SSH で削除実行（Windows の ssh コマンドを使用）
$RemoteCmd = "cd $RemoteDir && rm -rf index.htm css images && echo Done"
& ssh -p $Port -i $KeyPath -o StrictHostKeyChecking=no "${User}@${HostName}" "$RemoteCmd"
Write-Host "完了."
