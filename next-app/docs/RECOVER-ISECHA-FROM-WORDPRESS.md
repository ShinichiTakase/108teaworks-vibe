# ConoHa WordPress から「伊勢茶とは」ページを復元する

108teaworks.com の旧 WordPress が ConoHa 上に残っている場合の復元方法です。

---

## サブドメインで復旧する（FTP で設定だけ追加する方法・おすすめ）

FTP 接続ができていれば、**DNS の追加**と**DocumentRoot の設定ファイルの追加・編集**だけで、一時的に WordPress をサブドメインで表示できます。管理画面から「伊勢茶とは」の本文をコピーして復元できます。

### 手順 1: DNS にサブドメインを追加

- ConoHa の DNS 管理（または 108teaworks.com の DNS を管理しているところ）で次を追加します。
- **例**: サブドメイン `wp.108teaworks.com` を使う場合

| タイプ | 名前（ホスト） | 値（IP など） | TTL |
|--------|----------------|----------------|-----|
| A      | wp             | （108teaworks.com の A レコードと同じ ConoHa サーバーの IP） | 300 など |

- 名前が `wp` なら `wp.108teaworks.com` になります。`old` にすれば `old.108teaworks.com` です。
- **重要**: 既存の 108teaworks.com の A レコードで向いている IP と同じにしてください。

### 手順 2: DocumentRoot の設定を追加（FTP で編集）

- ConoHa では **Apache** を使っていることが多いです。
- FTP でサーバーに接続し、次のどちらかを編集します（環境によって場所が違います）。

**パターン A: バーチャルホスト用の設定ファイルがある場合**

- 例: `/etc/httpd/conf.d/` や `/home/c1335736/conf/` など、`httpd.conf` や `vhost.conf` のようなファイル。
- 以下のような **新しいバーチャルホスト** を追加します（サブドメイン名とパスは環境に合わせて書き換え）。

```apache
<VirtualHost *:80>
    ServerName wp.108teaworks.com
    DocumentRoot /home/c1335736/public_html
    <Directory /home/c1335736/public_html>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

- **DocumentRoot** は、**WordPress の index.php があるディレクトリ**にします。
  - 例: `/home/c1335736/public_html`（ルートが WordPress の場合）
  - 例: `/home/c1335736/public_html/108teaworks.com`（サブディレクトリに WP がある場合）
- FTP で `public_html` の中を見て、`wp-config.php` や `wp-admin` があるディレクトリを DocumentRoot に指定します。

**パターン B: ユーザーごとの設定や .htaccess しか触れない場合**

- ConoHa の「バーチャルホスト設定」や「ドメイン設定」の画面で、サブドメイン `wp.108teaworks.com` を追加し、DocumentRoot を「WordPress が入っているディレクトリ」に設定する方法がある場合は、そこから設定します。
- マニュアルやサポートに「サブドメインを追加する」と書いてあれば、その手順に従い、DocumentRoot だけ WordPress のディレクトリに合わせます。

### 手順 3: 設定を反映させる

- 設定ファイルを保存したら、Web サーバーの再読み込みが必要なことがあります。
- ConoHa のコントロールパネルに「Apache 再起動」や「設定反映」があれば実行します。
- ない場合は、数分待つか、FTP で保存しただけでも反映される場合があります。

### 手順 4: WordPress の URL をサブドメインに合わせる（任意だが推奨）

- 管理画面のリンクをサブドメインで統一したい場合、FTP で **WordPress の `wp-config.php`** を開き、`<?php` の直後あたりに以下を追加（または一時的に変更）します。

```php
define('WP_HOME',    'https://wp.108teaworks.com');
define('WP_SITEURL', 'https://wp.108teaworks.com');
```

- サブドメインを `old.108teaworks.com` にした場合は、そのドメインに合わせて書き換えます。
- 復元が終わったら、この 2 行を削除するか元の URL に戻します。

### 手順 5: 管理画面で「伊勢茶とは」の本文をコピー

1. ブラウザで `https://wp.108teaworks.com/wp-admin` を開く（HTTP の場合は `http://...`）。
2.  WordPress の管理者でログイン。
3. **固定ページ** → 「伊勢茶とは」（または該当するページ）を開く。
4. 本文をすべて選択してコピーし、ローカルにメモやファイルとして保存。

### 手順 6: 復元が終わったら

- **DNS**: サブドメイン用に追加した A レコードを削除するか、本番運用に不要ならそのままにしても構いません。
- **DocumentRoot**: 追加したバーチャルホストの設定を削除またはコメントアウト。
- **wp-config.php**: 追加した `WP_HOME` / `WP_SITEURL` を削除し、元の 108teaworks.com の URL に戻す（または削除して DB の `siteurl` / `home` に任せる）。

---

## 方法2: ターミナル（SSH）で直接抜き出す

### 前提

- ConoHa の SSH 接続情報（`DEPLOY-CONOHA.md` や `scripts/clean-conoha-old-content.sh` と同じ）
  - ホスト: `www228.conoha.ne.jp`
  - ポート: `8022`
  - ユーザー: `c1335736`
  - 秘密鍵: お使いの `.pem` ファイル

### 手順 A: 用意したスクリプトで取得

```bash
cd next-app
chmod +x scripts/export-isecha-from-wp.sh
KEY=/path/to/your/key.pem ./scripts/export-isecha-from-wp.sh
```

- 出力ファイル: `next-app/data/isecha-from-wordpress.html`
- WordPress の設置場所はスクリプト内で次のパスを順に探します:
  - `/home/c1335736/public_html`
  - `/home/c1335736/public_html/108teaworks.com`
- 別の場所に WordPress がある場合は、`scripts/export-isecha-from-wp.sh` の `WP_ROOTS=` の行を編集してください。

**Windows（PowerShell）で同じ取得を実行する例:**

```powershell
cd D:\GoogleDrive\108teaworks-vibe\next-app
$env:KEY = "C:\Users\shint\.ssh\key-2026-03-01-19-32.pem"   # 鍵のパス
.\scripts\export-isecha-from-wp.ps1
```

- 鍵のパスは `$env:KEY` で指定するか、スクリプト内の `$KeyPath` を編集してください。
- まず SSH でサーバーに手動で入る場合は: `ssh -p 8022 -i 鍵のパス c1335736@www228.conoha.ne.jp` でログインし、以下「手順 B」または「手順 C」をサーバー上で実行します。

### 手順 B: 手動で SSH し、MySQL で取得

1. SSH でサーバーに入る:

```bash
ssh -p 8022 -i /path/to/key.pem c1335736@www228.conoha.ne.jp
```

2. WordPress の設置ディレクトリを確認（例）:

```bash
ls -la ~/public_html/
# または
ls -la ~/public_html/108teaworks.com/
```

3. `wp-config.php` から DB 名・ユーザー・パスワードを確認:

```bash
grep -E "DB_NAME|DB_USER|DB_PASSWORD" ~/public_html/wp-config.php
# パスが違う場合は上で確認したディレクトリに合わせる
```

4. MySQL で「伊勢茶とは」ページの本文を取得:

```bash
mysql -u 上で確認したDB_USER -p 上で確認したDB_NAME -e "
SELECT post_title, post_name, post_content
FROM wp_posts
WHERE post_type = 'page'
  AND post_status = 'publish'
  AND (post_name LIKE '%isecha%' OR post_name LIKE '%ise-cha%' OR post_title LIKE '%伊勢茶%');
"
```

- 結果の `post_content` をコピーし、ローカルで `next-app/data/isecha-from-wordpress.html` などに保存してください。

### 手順 C: PHP で取得（WP が動く環境なら）

サーバーで PHP が使える場合、WordPress を読み込んで該当ページだけ出力できます:

```bash
cd ~/public_html   # または WordPress が入っているディレクトリ
php -r "
define('ABSPATH', __DIR__ . '/');
require ABSPATH . 'wp-load.php';
\$p = get_page_by_path('isecha') ?: get_page_by_path('ise-cha');
if (\$p) { echo \$p->post_content; } else { echo 'Page not found'; }
"
```

- 表示された HTML をそのまま保存し、ローカルで Next 用テキストに整形します。

---

## 取得した本文を Next の「伊勢茶とは」に反映する

- 取得したのは **HTML** のことが多いです。`IsechaPage.tsx` の `ISECHA_TEXTS` は **プレーンテキスト** の段落ごとなので:
  1. HTML タグを外す
  2. 見出し・段落・箇条書きを、既存の `sec1Title` / `sec1P1` などのキーに割り当てて対応させる

- 必要なら、取得した HTML を `next-app/data/isecha-from-wordpress.html` に保存し、そのファイルを参照して手動で `ISECHA_TEXTS` を更新してください。
