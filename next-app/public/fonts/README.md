# 領収書PDF用フォント（必須）

領収書の日本語が文字化けする場合は、このフォルダに **Noto Serif JP** のフォントファイルを置いてください。

## 手順

1. **[Noto Serif JP - Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+JP)** を開く  
2. **「Download family」** をクリックして ZIP をダウンロード  
3. ZIP を解凍する  
4. 解凍した中から **`NotoSerifJP-Regular.otf`** または **`NotoSerifJP-Regular.ttf`**（変数フォントの `NotoSerifJP[wght].ttf` でも可）を、このフォルダ（`next-app/public/fonts/`）にコピーする  

**このフォルダに置いた .ttf / .otf のうちどれか1つ**が自動で使われます。ファイル名はそのままで構いません。  
1つ置けば領収書PDFの日本語が正しく表示されます。  
開発サーバーを再起動してから `/api/receipt/preview` で確認してください。
