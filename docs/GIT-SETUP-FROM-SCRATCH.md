# Git を最初から使う手順（108teaworks-vibe）

Git をまだ入れていない・使ったことがない方向けに、**インストール → 設定 → 初回コミット → プッシュ**までを順に説明します。

---

## 1. Git をインストールする（Windows）

1. **ダウンロード**  
   https://git-scm.com/download/win から「Click here to download」でインストーラーを取得します。

2. **インストール**  
   起動したら基本的に「Next」で進めて問題ありません。  
   次の画面では **「Git from the command line and also from 3rd-party software」** を選ぶと、どのターミナルからも `git` コマンドが使えます。

3. **反映**  
   インストール後、**Cursor や PowerShell を一度閉じて開き直す**と、`git` が使えるようになります。

4. **確認**  
   新しい PowerShell または「Git Bash」で次を実行します。
   ```powershell
   git --version
   ```
   `git version 2.x.x` のように出ればOKです。

---

## 2. Git の初期設定（初回だけ）

誰がコミットしたか分かるように、名前とメールを登録します。

```powershell
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"
```

- `user.name` … コミットに記録される名前（ニックネームや本名でOK）
- `user.email` … GitHub などに登録しているメールアドレスを入れると分かりやすいです

---

## 3. リモート用のリポジトリを用意する（GitHub の場合）

コードを「プッシュ」する先のリポジトリが必要です。

1. **GitHub にログイン**  
   https://github.com にアクセスしてログイン（アカウントがなければ作成）。

2. **新規リポジトリ作成**  
   - 右上の「+」→「New repository」
   - **Repository name:** 例）`108teaworks-vibe`
   - **Public** のまま（Private でも可）
   - **「Add a README file」などはチェックしない**（ローカルから push するため）
   - 「Create repository」をクリック

3. **URL をコピー**  
   作成後の画面に  
   `https://github.com/あなたのユーザー名/108teaworks-vibe.git`  
   のような URL が出るので、控えておきます。

---

## 4. ローカルでリポジトリを初期化して初回コミット

プロジェクトのフォルダで、次を**順番に**実行します。

### 4-1. プロジェクトのフォルダに移動

```powershell
cd D:\GoogleDrive\108teaworks-vibe
```

### 4-2. Git リポジトリとして初期化

```powershell
git init
```

`Initialized empty Git repository in D:/GoogleDrive/108teaworks-vibe/.git/` と出ればOKです。

### 4-3. 無視するファイルを設定（ルートに .gitignore）

`next-app` の中にはすでに `.gitignore` がありますが、**プロジェクトのルート**にもあると安心です。次の内容で `D:\GoogleDrive\108teaworks-vibe\.gitignore` を作成します。

```gitignore
# 依存関係・ビルド成果物
next-app/node_modules/
next-app/.next/
next-app/out/

# 環境変数（秘密情報を含む）
next-app/.env
next-app/.env.local
next-app/.env*.local

# OS・エディタ
.DS_Store
Thumbs.db
*.log
```

（メモ帳や Cursor で保存するとき、ファイル名を **`.gitignore`** にし、保存場所を `D:\GoogleDrive\108teaworks-vibe` にしてください。）

### 4-4. すべてのファイルをステージング

```powershell
git add .
```

### 4-5. 状態確認（任意）

```powershell
git status
```

緑色でファイル一覧が出ていれば、コミット対象になっています。

### 4-6. 初回コミット

```powershell
git commit -m "vibe.108teaworks.com初回コミット"
```

`1 file changed` や `XX files changed` と出れば成功です。

### 4-7. ブランチ名を main にする（推奨）

```powershell
git branch -M main
```

---

## 5. リモートに接続してプッシュ

### 5-1. リモートを登録

`<リポジトリURL>` を、手順3でコピーした GitHub の URL に置き換えて実行します。

```powershell
git remote add origin https://github.com/あなたのユーザー名/108teaworks-vibe.git
```

### 5-2. プッシュ

```powershell
git push -u origin main
```

- 初回は **GitHub のログイン**を求められることがあります（ブラウザが開くか、ユーザー名・パスワード／トークン入力）。
- 「Everything up-to-date」や「branch 'main' set up to track」などと出れば成功です。

---

## 6. 2回目以降の流れ（変更を反映するとき）

コードを直したあと、リモートに反映する手順は次のとおりです。

```powershell
cd D:\GoogleDrive\108teaworks-vibe
git add .
git status
git commit -m "変更内容を短く説明"
git push
```

`git push` だけでも、すでに `origin main` と紐づいていればプッシュできます。

---

## トラブルシューティング

### 「git が認識されない」

- Git をインストールしたあと、**Cursor や PowerShell を一度閉じて開き直す**。
- それでもダメな場合は、PC を再起動してから再度 `git --version` を試す。

### 「Permission denied」「Authentication failed」と出る

- GitHub ではパスワードの代わりに **Personal Access Token** を使う必要があります。
- GitHub → Settings → Developer settings → Personal access tokens でトークンを作成し、パスワードを聞かれたらそのトークンを入力します。

### 「.gitignore を作ったのに node_modules がコミットされる」

- すでに `git add .` で追加済みの場合は、次で削除してから再度コミットします。
  ```powershell
  git rm -r --cached next-app/node_modules
  git commit -m "node_modules を .gitignore に含める"
  ```

---

## まとめチェックリスト

- [ ] Git をインストールした
- [ ] `git config --global user.name` と `user.email` を設定した
- [ ] GitHub で新しいリポジトリを作成した
- [ ] `cd D:\GoogleDrive\108teaworks-vibe` で `git init` した
- [ ] ルートに `.gitignore` を置いた
- [ ] `git add .` → `git commit -m "vibe.108teaworks.com初回コミット"` した
- [ ] `git remote add origin <URL>` でリモートを追加した
- [ ] `git push -u origin main` でプッシュした

ここまでできれば、ローカルと GitHub の同期の準備は完了です。
