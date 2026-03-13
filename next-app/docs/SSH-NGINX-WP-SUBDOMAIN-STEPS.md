# SSH で wp.108teaworks.com を nginx に追加する手順（ステップ・バイ・ステップ）

課金を避けるため、ConoHa のドメイン追加は使わず、SSH で nginx の設定だけ追加します。

**前提**
- DNS の A レコードで `wp.108teaworks.com` → ConoHa サーバー IP は済んでいる
- `wp-config.php` に `WP_HOME` / `WP_SITEURL` の 2 行を追加済み
- 手元の秘密鍵: 例 `C:\Users\shint\.ssh\key-2026-03-01-19-32.pem`（Windows）または `~/.ssh/key-2026-03-01-19-32.pem`（Mac/Linux）

---

## Step 1: ConoHa に SSH でログインする

**Windows（PowerShell）**
```powershell
ssh -p 8022 -i C:\Users\shint\.ssh\key-2026-03-01-19-32.pem c1335736@www228.conoha.ne.jp
```

**Mac / Linux**
```bash
ssh -p 8022 -i ~/.ssh/key-2026-03-01-19-32.pem c1335736@www228.conoha.ne.jp
```

- 鍵のパスは各自の環境に合わせて変更してください。
- ログインできたら次のステップへ。

---

## Step 2: WordPress の root パスを確認する

`wp-config.php` があるディレクトリが、nginx の `root` に指定するパスです。

```bash
# ホーム直下の public_html に WordPress があるか
ls ~/public_html/wp-config.php 2>/dev/null && echo "ROOT=~/public_html"

# サブディレクトリにあるか
ls ~/public_html/108teaworks.com/wp-config.php 2>/dev/null && echo "ROOT=~/public_html/108teaworks.com"
```

- どちらかで `ROOT=...` が表示された方のパスをメモする。
- フルパスは次の通り（ユーザー名は c1335736 の想定）:
  - `~/public_html` → `/home/c1335736/public_html`
  - `~/public_html/108teaworks.com` → `/home/c1335736/public_html/108teaworks.com`

---

## Step 3: nginx の設定の場所と PHP の設定を確認する

```bash
# nginx の設定ディレクトリがあるか
ls /etc/nginx/conf.d/ 2>/dev/null || ls /etc/nginx/sites-enabled/ 2>/dev/null || ls /etc/nginx/

# 既存の設定で 108teaworks や php を探す
sudo grep -r "108teaworks\|php\|fastcgi_pass" /etc/nginx/ 2>/dev/null | head -30
```

- **やること**
  - 設定が入っているディレクトリ（例: `/etc/nginx/conf.d/`）を確認する。
  - 既存のどこかで `fastcgi_pass` が使われている行を 1 つメモする（例: `unix:/run/php-fpm/www.sock` や `127.0.0.1:9000`）。
- `sudo` が通らない場合は、ConoHa の VPS では root ログインや別の管理者アカウントが必要な場合があります。そのときはサポートに「nginx の設定を 1 ファイル追加したい」と相談してください。

---

## Step 4: サブドメイン用の設定ファイルを 1 つ作る

Step 3 で確認した「設定が入っているディレクトリ」に、新規ファイルを 1 つ追加します。  
例: `/etc/nginx/conf.d/wp-108teaworks.conf`

```bash
# 編集するファイル（conf.d がある場合の例）
sudo nano /etc/nginx/conf.d/wp-108teaworks.conf
```

**nano で次の内容をそのまま貼り付ける（2 箇所だけ書き換える）**

1. **root** … Step 2 で決めた WordPress のフルパスにする。  
   - 例: `public_html` 直下なら `/home/c1335736/public_html`  
   - 例: `public_html/108teaworks.com` なら `/home/c1335736/public_html/108teaworks.com`
2. **fastcgi_pass** … Step 3 でメモした既存の値に合わせる。  
   - 例: `unix:/run/php-fpm/www.sock` や `127.0.0.1:9000` など。

```nginx
server {
    listen 80;
    server_name wp.108teaworks.com;

    root /home/c1335736/public_html;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm/www.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

- `root` と `fastcgi_pass` だけ、自分の環境用に書き換える。
- 保存: `Ctrl+O` → Enter。終了: `Ctrl+X`。

**別エディタを使う場合（vi）**
```bash
sudo vi /etc/nginx/conf.d/wp-108teaworks.conf
```
- `i` で挿入モード → 上記を貼り付け → `Esc` → `:wq` で保存終了。

---

## Step 5: nginx の設定テストと反映

```bash
# 設定ミスがないかチェック
sudo nginx -t
```

- `syntax is ok` と `test is successful` が出れば OK。

```bash
# nginx をリロード（設定だけ再読込、ダウンタイムほぼなし）
sudo systemctl reload nginx
```

- エラーが出なければ完了。

---

## Step 6: ブラウザで確認する

1. ブラウザで `http://wp.108teaworks.com` を開く。
2. WordPress のトップが表示されれば成功。
3. `http://wp.108teaworks.com/wp-admin` で管理画面にログインし、「固定ページ」→「伊勢茶とは」の本文をコピーして復元に使う。

---

## うまくいかないとき

| 現象 | 確認すること |
|------|-----------------------------|
| `sudo` が使えない | 一般ユーザーだけの場合は、ConoHa の VPS 管理者権限や root ログインが必要。サポートに「nginx 設定を 1 ファイル追加したい」と相談。 |
| `nginx -t` でエラー | メッセージのファイル名と行番号を確認。`root` のパスや `fastcgi_pass` の書き間違い、セミコロン忘れを確認。 |
| 502 Bad Gateway | PHP-FPM が動いていないか、`fastcgi_pass` のソケット/ポートが既存設定と違う。Step 3 の既存の `fastcgi_pass` をそのまま使う。 |
| 404 のまま | `server_name wp.108teaworks.com;` のスペル、`root` が本当に `wp-config.php` があるディレクトリか再確認。 |

---

## 復元が終わったあと（任意）

- `wp.108teaworks.com` を今後使わない場合は、追加した設定ファイルを削除して nginx を再リロードするとよいです。
  ```bash
  sudo rm /etc/nginx/conf.d/wp-108teaworks.conf
  sudo nginx -t
  sudo systemctl reload nginx
  ```
- `wp-config.php` に追加した `WP_HOME` / `WP_SITEURL` の 2 行は削除するか元に戻してください。
