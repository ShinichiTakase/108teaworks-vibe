# 108teaworks ショップ（Next.js + Tailwind CSS）

既存の HTML/CSS を Next.js App Router + Tailwind CSS で書き直したプロジェクトです。

## セットアップ

```bash
cd next-app
npm install
```

## 画像について

`public/images/` に以下を配置してください（親ディレクトリからコピー可）:

- `public/images/logo/logo-mobile.png`
- `public/images/logo/logo-desktop.png`
- `public/images/products/product-01.webp` ～ `product-12.png`

例（PowerShell）:

```powershell
Copy-Item -Recurse ..\images .\public\
```

## 開発

```bash
npm run dev
```

http://localhost:3000 で表示されます。ポート 3030 で起動する場合:

```bash
npm run dev:3030
```

### CSS が効かないとき

1. **キャッシュを削除して再起動**
   ```bash
   cd next-app
   rm -rf .next
   npm run dev
   ```
   （Windows の場合は `.next` フォルダを手動削除してから `npm run dev`）

2. ブラウザで **スーパーリロード**（Ctrl+Shift+R）またはシークレットウィンドウで開く

3. `npm install` が完了しているか確認（`node_modules` に `tailwindcss`, `postcss`, `autoprefixer` があること）

## ビルド

```bash
npm run build
npm start
```

静的エクスポート（HTML として出力）する場合は `next.config.mjs` で以下を有効にしてください。

- `output: 'export'`
- `trailingSlash: true`

## Instagram 最新投稿（API 連携）

Instagram セクションで **常に最新10件** を表示するには、Instagram Graph API のトークンと IG User ID を設定します。

1. `.env.example` をコピーして `.env.local` を作成
2. [Meta for Developers](https://developers.facebook.com/) でアプリを作成し、Instagram Graph API を追加
3. Instagram **ビジネス** または **クリエイター** アカウントを Facebook ページに接続
4. 長期アクセストークンと **IG User ID**（Instagram ビジネスアカウントの数値ID）を取得
5. `.env.local` に `INSTAGRAM_ACCESS_TOKEN` と `INSTAGRAM_USER_ID` を記入

未設定の場合は、従来どおり固定の10件リンク（画像は `public/images/instagram/` のプレースホルダー）が表示されます。詳細は [Instagram Graph API ドキュメント](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media) を参照してください。

## 構成

- `app/layout.tsx` … ルートレイアウト（メタデータ・フォント・Header/Footer）
- `app/page.tsx` … トップページ
- `components/` … Header, Footer, Hero, ProductList, InstagramSection など
- `lib/instagram.ts` … Instagram Graph API で最新メディア取得
- `tailwind.config.ts` … カスタム色（tea, washi, cream, footer など）・フォント
