# wp.108teaworks.com を nginx で表示する設定

DNS で `wp.108teaworks.com` が ConoHa サーバーの IP に向いていて、アクセスすると nginx の 404 になる場合、**nginx に「このホスト名のときはこのフォルダを表示する」**設定が足りていません。

---

## 方法1: ConoHa のコントロールパネルでサブドメインを追加する（優先）

ConoHa の管理画面に **「ドメイン」「サブドメイン」「Web 設定」** のようなメニューがある場合:

1. サブドメイン `wp.108teaworks.com` を追加する。
2. **ドキュメントルート（公開フォルダ）** を、WordPress の `wp-config.php` があるディレクトリに設定する。  
   - 例: `public_html` または `public_html/108teaworks.com`
3. 保存して反映されれば、`https://wp.108teaworks.com/wp-admin` でアクセスできるようになる。

マニュアル: [ConoHa サブドメイン設定](https://www.conoha.jp/) や「サブドメイン 追加」で検索。

---

## 方法2: nginx の設定ファイルを直接編集する（SSH でサーバーに触れる場合）

サーバーに SSH でログインでき、**nginx の設定を編集できる権限**がある場合に使います。

### 1. 設定ファイルの場所を確認

```bash
# 設定の置き場所の例
ls /etc/nginx/conf.d/
# または
ls /etc/nginx/sites-available/
```

### 2. サブドメイン用の設定ファイルを追加

例: `/etc/nginx/conf.d/wp-108teaworks.conf` を新規作成（ファイル名は任意）。

```nginx
server {
    listen 80;
    server_name wp.108teaworks.com;

    # WordPress の index.php があるディレクトリ（FTP で wp-config.php があった場所）
    root /home/c1335736/public_html;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_pass    unix:/run/php-fpm/www.sock;   # または 127.0.0.1:9000 など環境に合わせる
        fastcgi_index   index.php;
        fastcgi_param   SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include         fastcgi_params;
    }
}
```

- **root** を、実際に `wp-config.php` があるパスに合わせる。  
  - `public_html` 直下に WordPress がある場合: `/home/c1335736/public_html`  
  - `public_html/108teaworks.com` の下にある場合: `/home/c1335736/public_html/108teaworks.com`
- **fastcgi_pass** は、既存の PHP 用設定をまねる。  
  同じサーバーで動いている 108teaworks.com 用の設定があれば、その `fastcgi_pass` をそのまま使う。

### 3. 設定をテストして nginx をリロード

```bash
sudo nginx -t
sudo systemctl reload nginx
```

エラーが出たら、`nginx -t` のメッセージに従って修正する。

---

## 方法3: 既存の 108teaworks.com 用設定を探して「server_name に追加」だけする

すでに同じサーバーで 108teaworks.com 用の nginx 設定がある場合、その `server` ブロックに `wp.108teaworks.com` を追加するだけでも動くことがあります。

1. 設定ファイルを開く:
   ```bash
   grep -r "108teaworks" /etc/nginx/
   ```
2. 該当する `server { ... }` の `server_name` を次のようにする:
   ```nginx
   server_name 108teaworks.com www.108teaworks.com wp.108teaworks.com;
   ```
3. `root` がすでに WordPress のディレクトリを指していれば、そのまま:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 確認

- ブラウザで `https://wp.108teaworks.com` または `http://wp.108teaworks.com` を開く。
- トップや `https://wp.108teaworks.com/wp-admin` が表示されれば成功です。
