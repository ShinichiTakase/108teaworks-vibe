# vibe.108teaworks.com に Basic 認証を設定する

edgeai01 の **main-nginx-proxy** で、vibe.108teaworks.com だけに Basic 認証をかけます。

## 前提

- main-nginx-proxy の docker-compose があるディレクトリ（例: `/path/to/main-proxy`）で作業する
- すでに `vhost.d` をマウントしていること

---

## 1. htpasswd ファイルを作成

サーバー（edgeai01）で実行します。

```bash
# main-proxy のディレクトリに移動（実際のパスに読み替え）
cd /path/to/main-proxy

# htpasswd 用ディレクトリを作成
mkdir -p htpasswd

# Basic 認証用のパスワードファイルを生成（ユーザー名: 108teaworks）
docker run --rm httpd:alpine htpasswd -nb 108teaworks 'ht!07190505' > htpasswd/vibe.108teaworks.com

# 中身を確認（1行で 108teaworks:xxx の形式になっていればOK）
cat htpasswd/vibe.108teaworks.com
```

※ パスワードに `!` が含まれるため、シングルクォートで囲んでいます。

---

## 2. vhost.d に Basic 認証用の設定を追加

同じ main-proxy ディレクトリ内の `vhost.d` に、**ファイル名がドメインと一致する**ファイルを作成します。

```bash
# ファイル名は必ず vibe.108teaworks.com（拡張子なし）
cat > vhost.d/vibe.108teaworks.com << 'EOF'
auth_basic "Restricted";
auth_basic_user_file /etc/nginx/htpasswd/vibe.108teaworks.com;
EOF
```

---

## 3. docker-compose に htpasswd のマウントを追加

main-nginx-proxy の `docker-compose.yml` の `volumes:` に、次の 1 行を追加します。

```yaml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    # ... 既存の設定 ...
    volumes:
      - certs:/etc/nginx/certs:rw
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./vhost.d:/etc/nginx/vhost.d:ro
      - ./conf.d:/etc/nginx/conf.d
      # 以下を追加（Basic 認証用）
      - ./htpasswd/vibe.108teaworks.com:/etc/nginx/htpasswd/vibe.108teaworks.com:ro
      # ... 既存の Let's Encrypt などのマウント ...
```

---

## 4. nginx-proxy を再起動

```bash
cd /path/to/main-proxy
docker compose up -d

# またはコンテナ名で
docker restart main-nginx-proxy
```

---

## 5. 動作確認

ブラウザで `https://vibe.108teaworks.com` を開き、認証ダイアログが出ることを確認します。

- **ユーザーID:** 108teaworks  
- **パスワード:** ht!07190505  

---

## 認証を外したいとき

1. `vhost.d/vibe.108teaworks.com` を削除する  
2. `docker restart main-nginx-proxy` で再起動する  

これで Basic 認証だけ無効になります（htpasswd ファイルは残しておいても問題ありません）。
