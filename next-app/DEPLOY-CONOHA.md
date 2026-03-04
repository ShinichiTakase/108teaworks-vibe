# ConoHa で Node.js（Next.js）を動かす手順

## 前提

- ConoHa VPS に Node.js 18 以上が入っていること（または nvm で導入）
- ドメイン `shop.108teaworks.com` の公開先が対象サーバーであること

## 1. 古いコンテンツの削除

Node アプリに切り替える前に、既存の静的サイト（index.htm, css/, images/）を削除します。

### Windows（PowerShell）

```powershell
cd D:\GoogleDrive\108teaworks-vibe\next-app
.\scripts\clean-conoha-old-content.ps1
```

鍵パスやホスト名を変えたい場合は、スクリプト内の `$KeyPath`, `$HostName`, `$User`, `$RemoteDir` を編集してください。

### Linux / macOS（bash）

```bash
cd next-app
chmod +x scripts/clean-conoha-old-content.sh
KEY=/path/to/your/key.pem ./scripts/clean-conoha-old-content.sh
```

## 2. サーバーにアップロードしてビルド・起動

### 方法 A: サーバー上でビルド

1. プロジェクト一式をサーバーにアップロード（SFTP / rsync / git clone など）。
2. サーバーで:

```bash
cd /home/c1335736/public_html/shop.108teaworks.com  # または Node 用に用意したディレクトリ
npm install --production=false
npm run build
PORT=3000 npm run start:prod
```

3. 常時起動する場合は PM2 を推奨:

```bash
npm install -g pm2
PORT=3000 pm2 start node_modules/next/dist/bin/next --name shop -- start
pm2 save && pm2 startup
```

### 方法 B: ローカルでビルドしてからアップロード

1. ローカルで `npm run build` を実行。
2. `.next` と `public`、`package.json`、`node_modules`（本番用）をサーバーにアップロード。
3. サーバーで `npm run start:prod`（または `next start`）を実行。

## 3. ポートとリバースプロキシ

- Next.js はデフォルトで **3000** 番で待ち受けます。環境変数 `PORT` で変更可能です。
- 80/443 で公開する場合は、Apache または Nginx のリバースプロキシで `http://127.0.0.1:3000` にプロキシしてください。

### Apache 例（mod_proxy）

```apache
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

### Nginx 例

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

## 4. package.json のポイント

- **engines**: `"node": ">=18.0.0"` で Node 18 以上を指定。
- **start**: `next start` で本番起動。
- **start:prod**: 本番用の起動スクリプト（同じく `next start`）。必要に応じて `PORT=3000` を指定。

## 5. .nvmrc

サーバーで nvm を使う場合、`nvm use` で Node 20 を選択できます。

```bash
nvm use
```
