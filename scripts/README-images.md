# 108teaworks.com の画像をローカルDL → リモート（shop）へコピー

## 方法1: スクリプトで一括実行（推奨）

PowerShell でプロジェクトルートに移動してから実行：

```powershell
cd "d:\GoogleDrive\108teaworks-vibe"
.\scripts\sync-images-from-108teaworks.ps1
```

**やっていること**

1. **サーバー → ローカル**  
   108teaworks.com の `wp-content/uploads/2024` と商品プレースホルダー（.webp）を  
   `images-108teaworks-src/` にダウンロード
2. **整理**  
   上記を `images/logo`・`images/hero`・`images/*.webp` にコピー（ロゴは英名ファイルも作成）
3. **ローカル → リモート**  
   `images/` フォルダごと `shop.108teaworks.com` のルートへアップロード  
   → リモートに `images/logo/`, `images/hero/`, `images/*.webp` ができる

---

## 方法2: 手動でコマンドだけ使う

### Step 1: 108teaworks.com の画像をサーバーからローカルへ DL

（サーバー上の 108teaworks.com のパスから、SCP で取得）

```powershell
cd "d:\GoogleDrive\108teaworks-vibe"
$key = "C:\Users\shint\.ssh\key-2026-03-01-19-32.pem"
$r = "c1335736@www228.conoha.ne.jp"

# 2024 フォルダ（ロゴ・ヒーローなど）
scp -P 8022 -i $key -o StrictHostKeyChecking=no -r "${r}:/home/c1335736/public_html/108teaworks.com/wp-content/uploads/2024" ./images-108teaworks-src/

# 商品プレースホルダー
scp -P 8022 -i $key -o StrictHostKeyChecking=no "${r}:/home/c1335736/public_html/108teaworks.com/wp-content/uploads/woocommerce-placeholder-300x300.webp" ./images-108teaworks-src/
scp -P 8022 -i $key -o StrictHostKeyChecking=no "${r}:/home/c1335736/public_html/108teaworks.com/wp-content/uploads/woocommerce-placeholder-768x768.webp" ./images-108teaworks-src/
```

### Step 2: ローカルで shop 用に整理

- `images-108teaworks-src/2024/08/` の中身 → `images/logo/`
- `images-108teaworks-src/2024/02/` の茶畑・藤八茶業画像 → `images/hero/`（必要なら `tea-field.jpg`, `about.png` などにリネーム）
- プレースホルダー → `images/placeholder-product.webp`, `images/placeholder-product-lg.webp`

### Step 3: ローカル images をリモート shop へアップロード

```powershell
scp -P 8022 -i $key -o StrictHostKeyChecking=no -r ./images "c1335736@www228.conoha.ne.jp:/home/c1335736/public_html/shop.108teaworks.com/"
```

これで `shop.108teaworks.com/images/` に中身が入ります。

---

## フォルダ構成（目安）

```
108teaworks-vibe/
├── images/                    ← ショップ用（ここをリモートへ送る）
│   ├── logo/
│   │   ├── logo-header.jpg
│   │   ├── logo-header-wide.jpg
│   │   └── （日本語ファイル名の元画像）
│   ├── hero/
│   │   ├── tea-field.jpg
│   │   └── about.png
│   ├── placeholder-product.webp
│   └── placeholder-product-lg.webp
└── images-108teaworks-src/    ← 108teaworks.com から取った生データ（スクリプトで自動作成）
    ├── 2024/
    └── woocommerce-placeholder-*.webp
```
