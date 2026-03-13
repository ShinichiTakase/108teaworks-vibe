# Amazon SES 申し込み・設定手順

個人事業主でも利用可能。既存の nodemailer + SMTP 構成を活かして送信先を SES に切り替えられます。

---

## 1. AWS アカウントの作成（未所持の場合）

1. https://aws.amazon.com/jp/ にアクセス
2. 「アカウント作成」→ メールアドレス・パスワード・クレジットカード情報などを入力
3. 本人確認（電話番号）を完了

※SES は従量課金で、月あたりの送信量が少なければ数ドル程度です。

---

## 2. Amazon SES を有効化するリージョンを選ぶ

- **東京リージョン（ap-northeast-1）では SES は利用できません。**
- 利用可能な例: **米国東部（バージニア北部）us-east-1**、**米国西部（オレゴン）us-west-2**

手順:

1. AWS マネジメントコンソール右上でリージョンを **「オレゴン」** または **「バージニア北部」** に変更
2. 検索で「SES」または「Simple Email Service」を開く
3. 「Amazon SES の使用を開始」をクリック

---

## 3. 送信元の認証（メールアドレス or ドメイン）

### 方法A: メールアドレスで試す（すぐテストしたい場合）

1. SES コンソール左メニュー「**ID**」→「**Verify a new email address**」
2. 送信元に使うメールアドレス（例: `info@108teaworks.com` や Gmail 等）を入力
3. そのアドレスに届く確認メールのリンクをクリックして「検証済み」にする

### 方法B: ドメインで本番運用（推奨）

1. SES コンソール「**ID**」→「**Verify a new domain**」
2. ドメイン名を入力（例: `108teaworks.com`）
3. SES が表示する **TXT / CNAME（DKIM）** レコードを、お使いの DNS（ConoHa や Route 53 など）に追加
4. 数分〜最大 72 時間でステータスが「検証済み」になる

※送信元アドレスは「そのドメインのアドレス」（例: `info@108teaworks.com`）にすると届きやすくなります。

---

## 4. サンドボックス制限について

初期状態は **サンドボックス** です。

| 制限内容 |
|----------|
| 送信先は「検証済みのメールアドレス」のみ |
| 24 時間あたり約 200 通まで |
| 1 秒あたり 1 通まで |

**本番（注文確認メール等）で使うには「サンドボックス解除」の申請が必要です。**

### サンドボックス解除の申請手順

1. コンソールで「**Service Quotas**」を開く（検索で「Service Quotas」）
2. 「**Amazon Simple Email Service (SES)**」を選択
3. 「**リクエストの作成**」または「**Request quota increase**」から送信枠の引き上げを申請
4. 申請フォームで次のように記入するのが目安です:
   - **メールタイプ**: トランザクション（注文確認・お問い合わせ返信など）
   - **ウェブサイトのURL**: 例 `https://vibe.108teaworks.com` または `https://shop.108teaworks.com`
   - **ユースケースの説明**（日本語で可）:
     - オンラインショップの注文確認メール・お問い合わせ自動返信を送る
     - 送信量は 1 日あたりおおむね 〇〇通程度
     - バウンス・苦情にはメール設定で対応する
     - など、**目的・量・運用方針**を具体的に書く

承認は数時間〜翌日程度のことが多いです。承認後は「検証していないアドレス」にも送信でき、1 日の送信数も増えます。

---

## 5. SMTP 認証情報の取得（nodemailer 用）

現在のアプリは **SMTP** で送っているため、SES の **SMTP 認証情報** を使います。

1. **SES コンソール**（上で選んだリージョンのまま）を開く
2. 左メニュー「**SMTP 設定**」をクリック
3. 「**SMTP 認証情報の作成**」をクリック
4. IAM ユーザー名を入力（例: `ses-smtp-108teaworks`）→ 作成
5. 表示される **SMTP ユーザー名** と **SMTP パスワード** を必ずコピーして保存  
   ※パスワードは再表示できないため、このタイミングで控えておく必要があります。

### リージョン別 SMTP エンドポイント（例）

| リージョン     | SMTP エンドポイント                          |
|----------------|----------------------------------------------|
| バージニア北部 | `email-smtp.us-east-1.amazonaws.com`         |
| オレゴン       | `email-smtp.us-west-2.amazonaws.com`         |

ポートは **587**（STARTTLS）を使用します。

---

## 6. .env.local の設定例

SES 用に次のように設定します（既存の SMTP_HOST 等を置き換え）。

```env
# Amazon SES（例: オレゴンリージョン）
SMTP_HOST=email-smtp.us-west-2.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIA...（SES の SMTP ユーザー名）
SMTP_PASS=...（SES の SMTP パスワード）

# 送信元（SES で検証済みのドメインのアドレスにすること）
ORDER_FROM=info@108teaworks.com
INQUERY_FROM=info@108teaworks.com
CLIENT_MAIL_FROM=info@108teaworks.com
```

- `SMTP_USER` / `SMTP_PASS`: 上記「SMTP 認証情報の作成」で取得した値
- `ORDER_FROM` など: SES で検証済みのメールアドレス（または検証済みドメインのアドレス）

---

## 7. 動作確認の流れ

1. 上記のとおり `.env.local` を設定してサーバーを再起動
2. 注文確認メールやお問い合わせ送信を 1 通だけ送ってみる
3. 届いたメールの「送信元」や迷惑メールフォルダを確認

サンドボックスのままの場合は、**送信先**も SES コンソールの「ID」から「メールアドレスを検証」しておく必要があります。解除後は任意のアドレスに送れます。

---

## 参考リンク

- [Amazon SES ドキュメント（日本語）](https://docs.aws.amazon.com/ja_jp/ses/)
- [SES の送信元・送信先の検証](https://docs.aws.amazon.com/ja_jp/ses/latest/dg/sending-authorization-identity-owner-tasks-verification.html)
- [SES の SMTP 認証情報の取得](https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html)
