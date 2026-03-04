# WordPress から Instagram トークン・User ID を取得する

108teaworks.com（WordPress）で既に Instagram 連携をしている場合、同じトークンと User ID を Next.js の `.env.local` で使えます。

---

## Smash Balloon Instagram Feed の場合

**管理画面からアクセストークンや User ID を表示・コピーすることはできません。**

- **Instagram Feed → 設定 → Manage Sources（ソースの管理）** では、接続済みアカウントの**追加・削除・再接続**だけができ、トークンや User ID の文字列は画面に出ません（セキュリティのため非表示）。
- Meta のポリシー変更により、Smash Balloon の「手動トークン取得ツール」も提供終了しています。

そのため、**データベース（方法1）** または **一時的な PHP（方法2）** で値を取り出す必要があります。Smash Balloon は主に **`sbi_connected_accounts`** や **`sb_instagram_settings`** といったオプション名で DB に保存しています。

---

## 方法1: データベースで検索（推奨）

WordPress のデータベースにアクセスできる場合（phpMyAdmin、SSH + mysql など）。

### トークンが含まれていそうなオプションを一覧

```sql
-- プレフィックスが wp_ でない場合は適宜変更
SELECT option_name, LEFT(option_value, 80) AS value_preview
FROM wp_options
WHERE option_name LIKE '%instagram%'
   OR option_name LIKE '%sbi_%'
   OR option_name LIKE '%sb_instagram%'
   OR option_value LIKE '%access_token%'
   OR option_value LIKE '%instagram%';
```

- `option_value` が長いため `LEFT(..., 80)` で先頭だけ表示しています。
- 該当する `option_name` の **完全な `option_value`** を取得するには、その `option_name` で再度 SELECT してください。

```sql
-- 例: オプション名が判明した場合
SELECT option_name, option_value FROM wp_options WHERE option_name = 'ここにオプション名';
```

- `option_value` が **シリアライズされた PHP 配列**（`a:3:{s:5:"token";s:123:"...` のような形式）のことが多いです。
- その中から `access_token` や `user_id` に相当する文字列を探し、手動でコピーします。

### よくあるオプション名の例（Smash Balloon）

| オプション名 | 内容 |
|--------------|------|
| `sbi_connected_accounts` | 接続済みアカウント一覧（**トークン・User ID が入っていることが多い**） |
| `sb_instagram_settings` | プラグイン全体の設定 |
| `sbi_instagram_settings` | 同上（バージョンにより名前が異なる場合あり） |

まずは `sbi_connected_accounts` の `option_value` を取得してみてください。

---

## 方法2: 一時的な PHP で表示（管理画面に出す）

WordPress の `functions.php` や一時プラグインに以下を追加し、**管理者でログインした状態で** 任意のページを開くと、そのページの先頭に設定値のプレビューが出ます。**取得したら必ず削除してください。**

```php
// ★ 使用後は必ず削除すること
add_action('wp_head', function() {
    if (!current_user_can('manage_options')) return;

    $options = [
        'sb_instagram_settings',
        'sbi_instagram_settings',
        'sbi_connected_accounts',
        'wp_instagram_settings',
    ];
    echo '<!-- INSTAGRAM DEBUG -->';
    foreach ($options as $name) {
        $val = get_option($name);
        if ($val === false) continue;
        if (is_array($val)) {
            echo '<pre style="background:#f5f5f5;padding:10px;margin:10px;">' . esc_html($name) . ":\n" . esc_html(print_r($val, true)) . '</pre>';
        } else {
            $preview = is_string($val) ? substr($val, 0, 200) : $val;
            echo '<pre style="background:#f5f5f5;padding:10px;margin:10px;">' . esc_html($name) . ': ' . esc_html($preview) . '</pre>';
        }
    }
    echo '<!-- /INSTAGRAM DEBUG -->';
}, 1);
```

- 表示された配列の中から `access_token`（または `token`）と、Instagram の **User ID（数値）** を控えます。
- オプション名は利用中のプラグインによって異なるため、方法1の SQL で見つけた名前に合わせて `$options` を変更しても構いません。

---

## 方法3: プラグインの管理画面から確認

- **Smash Balloon Instagram Feed** の場合、管理画面にはトークン・User ID は**表示されません**（上記「Smash Balloon の場合」を参照）。  
- 他のプラグインを使っている場合は、設定画面に「Access Token」「User ID」が出る場合があります。

---

## Next.js での設定

取得した値を Next.js プロジェクトの `.env.local` に設定します。

```env
INSTAGRAM_ACCESS_TOKEN=取得したアクセストークン（長い文字列）
INSTAGRAM_USER_ID=数値のIGユーザーID
```

- **注意**: トークンには有効期限があります。WordPress 側で「再認証」や「再接続」をした場合は、新しいトークンを再度取得し、`.env.local` を更新する必要があります。
- **セキュリティ**: `.env.local` はリポジトリにコミットしないでください（通常は `.gitignore` に含まれています）。
