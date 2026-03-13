# 茶々丸チャット用スクリプト

このフォルダに **chachamaru.js** を配置してください。

- 読み込みパス: `/js/chachamaru.js`
- 「茶々丸と話す」バーをクリックすると、スクリプトで定義した `window.openChachamaru` が呼ばれます。
- チャットパネルを開く処理を、スクリプト内で次のように実装してください。

```js
window.openChachamaru = function() {
  // ここでチャットパネルを表示する処理
};
```

別のファイル名を使う場合は `app/layout.tsx` の `<Script src="/js/chachamaru.js" />` を変更してください。
