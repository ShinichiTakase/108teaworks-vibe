# Node.js のインストール（Windows）

`npm` が認識されない場合は、Node.js がインストールされていないか、PATH に含まれていません。

## 1. インストール

1. **https://nodejs.org/ja** を開く
2. **LTS（推奨版）** の「ダウンロード」をクリック
3. ダウンロードした `.msi` を実行
4. インストールウィザードで **「Add to PATH」** にチェックが入っていることを確認して次へ
5. そのまま「次へ」で完了

## 2. ターミナルを開き直す

- インストール後は **PowerShell や CMD を一度閉じて、新しく開き直す**
- Cursor を使っている場合は **Cursor を再起動** すると確実です

## 3. 確認

新しいターミナルで実行：

```powershell
node -v
npm -v
```

バージョンが表示されれば OK です。

## 4. Next.js プロジェクトの起動

```powershell
cd D:\GoogleDrive\108teaworks-vibe\next-app
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。
