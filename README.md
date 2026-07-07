# English Learning Portal

中学校英語の教材アプリへ直接アクセスできるポータルサイトです。

## 公開方法

このサイトは静的HTML/CSS/JavaScriptだけで作られているため、Vercelではビルド設定なしで公開できます。

1. GitHubに空のリポジトリを作成する
2. このフォルダをGitHubへpushする
3. VercelでGitHubリポジトリをImportする
4. Framework Presetは `Other` のまま、Build Commandは空欄、Output Directoryも空欄でDeployする

## ファイル構成

- `index.html`: トップページ
- `assets/categories.js`: トップボタンと教材リンクのデータ
- `assets/app.js`: 画面表示処理
- `assets/styles.css`: デザイン
- `categories/`: カテゴリページ

## 個人情報について

このポータルサイト自体では、氏名・メールアドレスなどの個人情報は収集しません。
外部教材サイトを利用する場合は、各サイトの利用条件をご確認ください。
