# Brevo（旧 Sendinblue）メール送信の設定手順

EC サイトのトランザクションメール（注文確認・お問い合わせ・卸問い合わせ・レビュー依頼）を Brevo 経由で送るための手順です。  
**受信（IMAP/POP3）の設定は変更しません。** 変更するのは送信経路（SMTP）のみです。

- **送信元ドメイン**: `108teaworks.com`
- **ローカル（Win11）**: `D:\GoogleDrive\108teaworks-vibe\next-app\.env.local`
- **本番（Ubuntu）**: `/mnt/nvme01/project/108teaworks-vibe/next-app/.env.local`

---

## 1. Brevo アカウント作成

1. https://www.brevo.com/ にアクセス
2. 「無料で始める」から **個人** でアカウント登録（メール・パスワード）
3. 無料プラン: **1日 300 通** まで送信可能

---

## 2. 送信元（Sender）の追加

Brevo では「誰から送るか」を送信元として登録します。

1. ログイン後、左メニュー **「設定」** → **「送信元」**（Senders）
2. **「送信元を追加」**
3. 以下を設定:
   - **メール**: `info@108teaworks.com`（または `noreply@108teaworks.com` など、実際に使うアドレス）
   - **送信者名**: 例 `藤八茶寮` または `108teaworks`
   - **返信先**: お客様からの返信を受け取るアドレス（例: `info@108teaworks.com`）
4. 保存後、そのアドレスに届く **確認メールのリンクをクリック** して送信元を有効化

※ 注文確認・お問い合わせなどで使う From は、ここで登録したアドレス（または同じドメインのアドレス）にします。

---

## 3. ドメイン認証（SPF / DKIM）

`108teaworks.com` から送ることを Brevo と受信側（iCloud 等）に証明するため、DNS にレコードを追加します。

1. Brevo 左メニュー **「設定」** → **「送信ドメイン」**（Sending domains）または **「送信元」** からドメイン設定へ
2. ドメイン **`108teaworks.com`** を追加
3. Brevo が表示する **SPF 用 TXT** と **DKIM 用 CNAME** をコピー
4. お使いの **DNS 管理**（ConoHa / お名前.com / Cloudflare 等）で、以下を追加:

   | タイプ | ホスト/名前 | 値（Brevo が表示したものをそのまま） |
   |--------|-------------|--------------------------------------|
   | TXT    | @ または 108teaworks.com | SPF 用（例: `v=spf1 include:spf.brevo.com ~all` など） |
   | CNAME  | Brevo が指定する名前（例: `mail._domainkey`） | Brevo が指定する値 |

5. **DMARC**（任意だが推奨）: 同じ DNS に TXT を追加  
   - 名前: `_dmarc`  
   - 値: `v=DMARC1; p=none; rua=mailto:info@108teaworks.com`  
   - しばらく様子を見てから `p=quarantine` や `p=reject` に変更可能

6. DNS 反映後、Brevo 画面で **「検証」** を実行。ステータスが「認証済み」になるまで待つ（数分〜最大 48 時間）

---

## 4. SMTP 認証情報の取得

1. Brevo 左メニュー **「設定」** → **「SMTP と API」**（SMTP & API）  
   - 直リンク: https://app.brevo.com/settings/keys/smtp
2. **「SMTP」** タブを開く
3. 表示されている **SMTP ログイン（メールアドレス）** と **SMTP キー（パスワード）** をコピー  
   - ない場合は **「SMTP キーを生成」** で新規作成し、**このタイミングで必ずパスワードを保存**（再表示不可）

**接続情報（nodemailer 用）:**

| 項目 | 値 |
|------|-----|
| SMTP サーバー | `smtp-relay.brevo.com` |
| ポート | `587`（TLS） |
| ユーザー | Brevo に表示されている SMTP ログイン（メールアドレス） |
| パスワード | Brevo の SMTP キー（API キーではない） |

---

## 5. .env.local の設定

**Win11 ローカル**  
`D:\GoogleDrive\108teaworks-vibe\next-app\.env.local`

**Ubuntu 本番**  
`/mnt/nvme01/project/108teaworks-vibe/next-app/.env.local`

どちらも同じキーを使います。値は環境ごとに SMTP キーを同じでも別でも構いません（本番用に別キーを発行しても可）。

```env
# ========== Brevo SMTP（送信専用・受信 IMAP/POP3 は変更しない） ==========
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=あなたのBrevo_SMTPログイン（メールアドレス）
SMTP_PASS=BrevoのSMTPキー（パスワード）

# 送信元アドレス（Brevo で認証した 108teaworks.com のアドレス）
ORDER_FROM=info@108teaworks.com
INQUERY_FROM=info@108teaworks.com
CLIENT_MAIL_FROM=info@108teaworks.com

# 管理者あて（注文通知・お問い合わせ通知が届く先）
ORDER_ADMIN_TO=info@108teaworks.com
INQUERY_TO=info@108teaworks.com

# レビュー依頼メールの送信元（省略時は ORDER_FROM / INQUERY_FROM を使用）
# REVIEW_FROM=info@108teaworks.com

# 送信元の表示名（省略時は「藤八茶寮」。メールで「藤八茶寮 <info@...>」と表示される）
# MAIL_FROM_NAME=藤八茶寮
```

- `SMTP_USER` / `SMTP_PASS`: 上記「4. SMTP 認証情報」で取得した値
- `ORDER_FROM` / `INQUERY_FROM` / `CLIENT_MAIL_FROM`: Brevo の「送信元」で確認済みの `@108teaworks.com` のアドレスにすること

---

## 6. 動作確認

1. `.env.local` を保存し、Next.js を再起動
2. **お問い合わせフォーム** から 1 通送信
3. 届いたメールの「送信元」が `info@108teaworks.com` になっているか確認
4. **iCloud（@icloud.com / @me.com / @mac.com）** 宛にテスト送信し、受信・迷惑メールフォルダを確認

問題なければ、注文完了フローや卸問い合わせでも同じ設定で送信されます。

---

## 参考リンク

- [Brevo ヘルプ: SMTP でトランザクションメールを送る](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP)
- [Brevo 開発者向け: SMTP 連携](https://developers.brevo.com/docs/smtp-integration)
- [SMTP キーの取得](https://app.brevo.com/settings/keys/smtp)
