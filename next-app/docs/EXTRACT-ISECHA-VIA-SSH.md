# SSH で「伊勢茶とは」の本文だけ抜き出す（nginx は触らない）

ConoHa の WordPress にブラウザでログインせず、**SSH でサーバーに入って**「伊勢茶とは」固定ページの本文をファイルに取り出します。nginx の設定は一切不要です。

---

## 前提

- ConoHa に SSH でログインできる（鍵・ユーザー名・ポートは既存のまま）
- `wp-config.php` があるディレクトリが分かっている（例: `~/public_html` または `~/public_html/108teaworks.com`）

---

## 方法A: WP-CLI で抜き出す（WP-CLI が入っている場合）

サーバーに WP-CLI が入っていれば、これが一番簡単です（以前のスクリーンショットで `.wp-cli` があったので、入っている可能性が高いです）。

### Step 1: SSH でログイン

```bash
ssh -p 8022 -i 鍵のパス c1335736@www228.conoha.ne.jp
```

### Step 2: WordPress のディレクトリに移動

```bash
# wp-config.php があるディレクトリ（どちらか）
cd ~/public_html
# または
cd ~/public_html/108teaworks.com
```

### Step 3: 「伊勢茶とは」のスラッグを確認（任意）

```bash
wp post list --post_type=page --fields=ID,post_title,post_name --allow-root
```

- 一覧から「伊勢茶とは」に相当する行の **post_name**（スラッグ）を確認。例: `isecha` や `ise-cha`。

### Step 4: 本文だけ取り出して表示

```bash
# スラッグが isecha の場合
wp post get $(wp post list --post_type=page --name=isecha --format=ids --allow-root) --field=post_content --allow-root
```

- スラッグが `ise-cha` の場合は `--name=ise-cha` に変える。
- 表示された HTML をそのままコピーして、ローカルで `next-app/data/isecha-from-wordpress.html` などに保存する。

### Step 5: ファイルに直接書き出す（任意）

サーバー上にファイルとして保存してから、SCP や FTP でダウンロードしてもよいです。

```bash
wp post get $(wp post list --post_type=page --name=isecha --format=ids --allow-root) --field=post_content --allow-root > ~/isecha-page-content.html
```

- その後、手元の PC で SCP 例:
  ```bash
  scp -P 8022 -i 鍵のパス c1335736@www228.conoha.ne.jp:~/isecha-page-content.html ./next-app/data/
  ```

---

## 方法B: MySQL で直接抜き出す（WP-CLI が無い・使えない場合）

`wp-config.php` に書いてある DB 名・ユーザー・パスワード・ホストを使って、MySQL で該当ページの `post_content` だけを取り出します。

### Step 1: SSH でログイン

```bash
ssh -p 8022 -i 鍵のパス c1335736@www228.conoha.ne.jp
```

### Step 2: MySQL に接続

`wp-config.php` の値を使います（次の例は実際の値に置き換えてください）。

```bash
mysql -h mysql68.conoha.ne.jp -u 0slrd_5dnnj3w8 -p 0slrd_4k7jmt3r
```

- プロンプトが出たら、`wp-config.php` の `DB_PASSWORD` の値を入力（入力は表示されません）。
- 接続できたら `mysql>` プロンプトが出ます。

### Step 3: 固定ページ「伊勢茶とは」の ID を確認

```sql
SELECT ID, post_title, post_name
FROM wp_posts
WHERE post_type = 'page'
  AND post_status = 'publish'
  AND ( post_name LIKE '%isecha%' OR post_name LIKE '%ise-cha%' OR post_title LIKE '%伊勢茶%' );
```

- 表示された行の **ID**（数字）をメモする。

### Step 4: 本文だけ取り出す

（次の `123` は Step 3 でメモした ID に置き換える）

```sql
SELECT post_content
FROM wp_posts
WHERE ID = 123;
```

- 表示された `post_content` が「伊勢茶とは」の本文（HTML）です。その部分をコピーして、ローカルで `next-app/data/isecha-from-wordpress.html` などに保存する。

### Step 5: MySQL を終了

```sql
exit
```

---

## 取り出したデータの使い方

- 保存した HTML は、タグを外して段落ごとに分け、`next-app/components/pages/IsechaPage.tsx` の `ISECHA_TEXTS` の該当キー（`sec1P1`、`sec2P1` など）に当てはめて復元します。
- 必要なら `next-app/data/isecha-from-wordpress.html` に置いておき、参照しながら手で編集してください。

---

## まとめ

| 方法 | 条件 | やること |
|------|------|----------|
| **A: WP-CLI** | サーバーに `wp` コマンドがある | SSH → WordPress のディレクトリで `wp post get ... --field=post_content` で本文を表示 or ファイルに保存 |
| **B: MySQL** | DB のホスト・ユーザー・パスワードが分かる | SSH → `mysql` で接続 → `SELECT post_content FROM wp_posts WHERE ...` で本文を表示してコピー |

どちらも **ブラウザで wp-admin にログインする必要はなく、nginx の設定も不要** です。
