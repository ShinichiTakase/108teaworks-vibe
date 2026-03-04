# ローカルとサーバー（edgeai01）の同期方法

ローカル（Windows）の `next-app` と、サーバー上の `/mnt/nvme01/project/108teaworks-vibe` を同期する代表的な方法です。

---

## 方法1: Git で同期（推奨）

コードの履歴を残しつつ、サーバーと揃えたいときに使います。

### ローカル側

```powershell
cd D:\GoogleDrive\108teaworks-vibe

# まだならリポジトリ初期化
git init
git add .
git commit -m "sync"

# GitHub / GitLab / 自前サーバーなどに push
git remote add origin <リポジトリURL>
git push -u origin main
```

### サーバー側（初回）

```bash
cd /mnt/nvme01/project
# 既存の 108teaworks-vibe を別名退避してから
git clone <リポジトリURL> 108teaworks-vibe
cd 108teaworks-vibe
# .env や環境変数は別途用意
```

### サーバー側（2回目以降＝更新時）

```bash
cd /mnt/nvme01/project/108teaworks-vibe
git pull
docker compose -f docker-compose.shop.yml up -d --build
```

- **メリット:** 履歴が残る・差分だけ送れる・定番の運用
- **注意:** `.env.local` は .gitignore に入っているので、サーバー用の環境変数はサーバーで別途用意する（docker-compose の `environment:` や `.env` など）

---

## 方法2: rsync で同期（WSL または Git Bash）

WSL や Git for Windows に `rsync` がある場合、ローカル → サーバーへ一括コピーできます。

### 除外したいもの

- `node_modules`
- `.next`
- `.env.local`（サーバーでは別設定のため）

### コマンド例（WSL の Bash）

```bash
cd /mnt/d/GoogleDrive/108teaworks-vibe/next-app

rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env.local' \
  --exclude '.git' \
  . \
  edgeai@edgeai01:/mnt/nvme01/project/108teaworks-vibe/
```

- `edgeai01` は SSH のホスト名（`~/.ssh/config` で設定している前提）
- ホスト名が使えない場合は `edgeai@<サーバーIP>` に置き換え

### 同期後にサーバーでやること

```bash
ssh edgeai@edgeai01
cd /mnt/nvme01/project/108teaworks-vibe
docker compose -f docker-compose.shop.yml up -d --build
```

---

## 方法3: 手動でフォルダをコピー（PowerShell + scp）

Git も rsync も使わない場合は、必要なフォルダだけ scp で送ります。

```powershell
cd D:\GoogleDrive\108teaworks-vibe\next-app

# 主要なソースだけ送る例（node_modules / .next は送らない）
scp -r app components lib public scripts docs *.json *.mjs *.ts edgeai@edgeai01:/mnt/nvme01/project/108teaworks-vibe/
```

- `edgeai01` は実際のホスト名または IP に読み替え
- 送ったあとサーバーで `npm install` と `docker compose build` が必要です。

---

## 共通の注意

1. **環境変数**  
   Instagram や Basic 認証など、サーバー専用の設定は `.env.local` に含めず、サーバー側の `docker-compose.shop.yml` の `environment:` や別の `.env` で管理してください。

2. **Docker の再ビルド**  
   ソースを更新したら、サーバーで次のいずれかを実行します。  
   `docker compose -f docker-compose.shop.yml up -d --build`

3. **パスの読み替え**  
   サーバー上の実際のパスが `/mnt/nvme01/project/108teaworks-vibe` でない場合は、上記のパスを環境に合わせて変更してください。
