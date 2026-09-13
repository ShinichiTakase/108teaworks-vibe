# GA4 Data API のセットアップ手順

`scripts/ga4-daily-pv.mjs` などから GA4 の生データ（日毎のPVなど）を直接取得するための設定です。

## 1. Google Cloud でプロジェクト作成・API有効化

1. https://console.cloud.google.com/ を開く（GA4と同じGoogleアカウントでよい）
2. 新しいプロジェクトを作成（例: `108teaworks-ga4`）
3. 「APIとサービス」→「ライブラリ」→ **Google Analytics Data API** を検索して有効化

## 2. サービスアカウントを作成

1. 「APIとサービス」→「認証情報」→「認証情報を作成」→「サービスアカウント」
2. 名前は任意（例: `ga4-reporting`）。GCPプロジェクト側のロール付与は不要（スキップでよい）
3. 作成したサービスアカウントを開く →「キー」タブ →「鍵を追加」→「新しい鍵を作成」→ **JSON** でダウンロード
4. サービスアカウントのメールアドレス（`xxxxx@プロジェクトID.iam.gserviceaccount.com`）を控える

## 3. GA4側でサービスアカウントに閲覧権限を付与

1. https://analytics.google.com/ → 左下「管理」
2. 「プロパティ」列 →「プロパティのアクセス管理」→ 右上「+」→「ユーザーを追加」
3. 手順2のサービスアカウントのメールアドレスを入力し、ロール **「閲覧者」** で追加

## 4. GA4プロパティIDを確認

- 「管理」→「プロパティ」列 →「プロパティの詳細」に表示される数字のみの **プロパティ ID**（例: `123456789`）
- 測定ID（`NEXT_PUBLIC_GA_MEASUREMENT_ID` の `G-XXXXXXXXXX`）とは別物なので注意

## 5. 認証情報を配置

ダウンロードしたJSONキーはコミットしないよう `next-app/.secrets/` 配下に置く（`.gitignore` 済み）。

```
next-app/.secrets/ga4-service-account.json
```

`.env.local` に追加:

```env
GA4_PROPERTY_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=.secrets/ga4-service-account.json
```

## 6. ライブラリのインストールと実行

```bash
npm install @google-analytics/data
node scripts/ga4-daily-pv.mjs --start 2026-09-01 --end today
```

`date\tpageviews` の形式で日毎のページビューが出力されます。
