# Google Search Console・GA4 の移植手順

WordPress の 108teaworks.com で使っていた GSC・GA4 を、Next.js 版の同じドメインに引き継ぐ手順です。

## 1. 実装済みの内容

- **GA4**: ルートレイアウトで `GoogleAnalytics` コンポーネントが読み込まれており、`NEXT_PUBLIC_GA_MEASUREMENT_ID` が設定されているときだけ gtag.js が動作します。
- **GSC**: `NEXT_PUBLIC_GSC_VERIFICATION` が設定されているとき、`metadata.verification.google` により `<meta name="google-site-verification" content="...">` が出力されます。

## 2. 環境変数の設定

`.env.local` に以下を追加します。

### GA4（測定 ID）

1. [Google アナリティクス](https://analytics.google.com/) → 該当プロパティ → **管理** → **データストリーム** で、Web のストリームの **測定 ID**（`G-XXXXXXXXXX`）をコピーする。
2. `.env.local` に追加：
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### GSC（所有権の確認）

1. [Google 検索コンソール](https://search.google.com/search-console) で、プロパティ `https://108teaworks.com` を開く（既に WordPress で追加済みならそのまま利用可能）。
2. もし「新しいプロパティを追加」する場合は、URL プレフィックスで `https://108teaworks.com` を追加。
3. **所有権の確認** で「HTML タグ」を選ぶと、次のようなタグが表示される：
   ```html
   <meta name="google-site-verification" content="abcdef123456..." />
   ```
4. `content="` と `"` の間の文字列（`abcdef123456...` の部分）だけをコピーし、`.env.local` に追加：
   ```env
   NEXT_PUBLIC_GSC_VERIFICATION=abcdef123456...
   ```

## 3. 本番反映

- 上記を設定したうえで **ビルドし直して** デプロイする（`NEXT_PUBLIC_*` はビルド時に埋め込まれるため）。
- デプロイ後、GSC の「確認」ボタンを押して検証する。既に同じドメインで検証済みの場合は、多くの場合そのまま利用できます。

## 4. GSC で「すでに検証済み」の場合

- ドメインが同じ **108teaworks.com** のままなら、多くの場合は **再検証は不要** です。
- 検索コンソールのプロパティは「URL プレフィックス」で `https://108teaworks.com` を指定していれば、WordPress から Next.js に切り替えてもそのプロパティを継続して使えます。
- サイトマップの URL が変わっている場合は、GSC の「サイトマップ」から新しい URL（例: `https://108teaworks.com/sitemap.xml`）を再送信するとよいです。

## 5. GA4 のデータの引き継ぎ

- **同じ GA4 プロパティ・同じ測定 ID** をそのまま使えば、データは引き継がれます。
- 新しいストリームを作らず、既存の「Web ストリーム」の測定 ID を `NEXT_PUBLIC_GA_MEASUREMENT_ID` に設定すれば、Next.js サイトのトラフィックがこれまでと同じプロパティに記録されます。
