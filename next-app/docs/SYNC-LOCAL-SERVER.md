# ローカルとサーバー（XServerEdgeAI-Lab）の同期方法

ローカル（Windows）の `next-app` と、サーバー上の `/opt/project/108teaworks` を同期する代表的な方法です。

本番の実体（コンテナ `xsvps-shop-next`）は、このリポジトリの `docker-compose.shop.yml` ではなく、
サーバー上の別ディレクトリ `/opt/project/deploy/xserver-vps/docker-compose.yml` にある `shop-next`
サービスです（ビルドコンテキストは `../../108teaworks/next-app` = このリポジトリの `next-app`）。
そのため本リポジトリは必ず `/opt/project/108teaworks` にクローンし、デプロイ時は
`/opt/project/deploy/xserver-vps/docker-compose.yml` 側で `up -d --build` してください。

---

## 方法1: Git で同期（推奨）

コードの履歴を残しつつ、サーバーと揃えたいときに使います。

### ローカル側

```powershell
cd D:\repository\108teaworks.com

git add .
git commit -m "sync"
git push origin main
```

### サーバー側（初回）

```bash
cd /opt/project
git clone <リポジトリURL> 108teaworks
cd 108teaworks
# .env や環境変数は next-app/.env.local に別途用意（.gitignore対象）
```

### サーバー側（2回目以降＝更新時）

```bash
cd /opt/project/108teaworks
git pull
cd /opt/project/deploy/xserver-vps
docker compose build shop-next
docker compose up -d --no-deps --force-recreate shop-next
```

- **メリット:** 履歴が残る・差分だけ送れる・定番の運用
- **注意:** `.env.local` は .gitignore に入っているので、サーバー用の環境変数はサーバーで別途用意する
- **重要:** `docker compose build` だけでは稼働中のコンテナは切り替わらない。必ず `up -d` (`--force-recreate` 推奨) まで実行すること（過去に build のみで反映されず本番が古いままになった事例あり）

---

## 方法2: rsync で同期（WSL または Git Bash）

WSL や Git for Windows に `rsync` がある場合、ローカル → サーバーへ一括コピーできます。

### 除外したいもの

- `node_modules`
- `.next`
- `.env.local`（サーバーでは別設定のため）

### コマンド例（WSL の Bash）

```bash
cd /mnt/d/repository/108teaworks.com/next-app

rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env.local' \
  --exclude '.git' \
  . \
  root@XServerEdgeAI-Lab:/opt/project/108teaworks/next-app/
```

- `XServerEdgeAI-Lab` は SSH のホスト名（`~/.ssh/config` で設定している前提）
- ホスト名が使えない場合は `root@<サーバーIP>` に置き換え

### 同期後にサーバーでやること

```bash
ssh root@XServerEdgeAI-Lab
cd /opt/project/deploy/xserver-vps
docker compose build shop-next
docker compose up -d --no-deps --force-recreate shop-next
```

---

## 方法3: 手動でフォルダをコピー（PowerShell + scp）

Git も rsync も使わない場合は、必要なフォルダだけ scp で送ります。

```powershell
cd D:\repository\108teaworks.com\next-app

# 主要なソースだけ送る例（node_modules / .next は送らない）
scp -r app components lib public scripts docs *.json *.mjs *.ts root@XServerEdgeAI-Lab:/opt/project/108teaworks/next-app/
```

- `XServerEdgeAI-Lab` は実際のホスト名または IP に読み替え
- 送ったあとサーバーで `npm install` と、上記「同期後にサーバーでやること」の build/up が必要です。

---

## 共通の注意

1. **環境変数**  
   Instagram や Basic 認証など、サーバー専用の設定は `.env.local` に含めず、`next-app/.env.local`（サーバー側で個別作成）や `/opt/project/deploy/xserver-vps/docker-compose.yml` の `environment:` で管理してください。

2. **Docker の再ビルド＋再作成**  
   ソースを更新したら、サーバーで `/opt/project/deploy/xserver-vps` に移動し、次を実行します。  
   `docker compose build shop-next && docker compose up -d --no-deps --force-recreate shop-next`  
   `build` だけでは稼働中コンテナのイメージは切り替わらないため、必ず `up -d` まで行うこと。

3. **パスの読み替え**  
   サーバー上の実際のパスが `/opt/project/108teaworks` でない場合は、上記のパスを環境に合わせて変更してください。
