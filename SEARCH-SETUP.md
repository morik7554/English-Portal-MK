# Google検索への掲載準備

設定した公開URL：[英語の学習ひろば](https://english-portal-mk.vercel.app/)

## いま完了していること

手元の修正版に、ページ固有のタイトル・説明、正規URL（canonical）、OGP、WebSite・パンくずの構造化データ、robots.txt、sitemap.xml、分野別ページへの内部リンクを追加しました。カテゴリの説明と教材リンクはJavaScriptを使わなくてもHTMLから読み取れます。

ホームの検索用タイトルは「英語の学習ひろば｜小学生・中学生の英語学習ポータル」です。単語・文法・基本文・長文読解・リスニング・プリント・テスト対策のページにも、それぞれの内容に合うタイトルと説明を設定しています。

教材が未掲載の長期休みページは `noindex,follow` とし、サイトマップから外しています。教材データに該当する教材を追加して生成し直すと、検索対象へ戻ります。

**公開サイトへの反映とGoogle Search Consoleの操作は未実施です。現時点で検索掲載済みという意味ではありません。** 公開URLをブラウザーで確認した時点では、旧デザインが表示されていました。

## 公開後に行うこと

1. 修正版のHTML・assets・guide.htmlに加え、ルートのrobots.txtとsitemap.xmlを、既存サイトに反映します。ログインなしで表示でき、配信側の `X-Robots-Tag: noindex` などが付いていないか確認します。
2. [Google Search Console](https://search.google.com/search-console/)で「URLプレフィックス」を選び、`https://english-portal-mk.vercel.app/` を追加します。vercel.app全体のDNSを管理する必要のあるドメインプロパティではなく、このサイトのURLを対象にします。[Google：プロパティの追加](https://support.google.com/webmasters/answer/34592?hl=ja)
3. 所有権確認に「HTMLタグ」を選んだ場合、表示されたタグの `content` の値を、seo.config.jsonの `googleSiteVerification` に入力します。タグ全体ではなく値だけです。`node scripts/update-seo.cjs` を実行し、ホームを再公開してからSearch Consoleの確認を実行します。トークンはアカウント側で発行されるため、現在は空欄です。
4. 「サイトマップ」で `sitemap.xml` を送信します。公開時のURLは [サイトマップ](https://english-portal-mk.vercel.app/sitemap.xml) です。Googleはサイトマップの送信方法としてSearch Consoleとrobots.txtでの案内をサポートしています。[Google：サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
5. 「URL検査」でホームを検査し、公開URLのテスト後に「インデックス登録をリクエスト」を行います。必要に応じて主要カテゴリも確認します。[Google：URL検査ツール](https://support.google.com/webmasters/answer/9012289?hl=ja)
6. 後日、Search Consoleで登録状況・検出された問題・検索語句を確認します。学校の公開ページや教材紹介記事など、読者に役立つ場所からこのサイトへ通常のリンクを付けることも検討します。

検索への掲載・順位・反映日は保証できません。サイトマップや構造化データを追加することと、Googleに登録されることは別です。登録や改善には時間がかかる場合があります。[Google：SEOスターターガイド](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## 更新コマンド

```sh
node scripts/sync-static-links.cjs
node scripts/update-seo.cjs
python3 scripts/check-seo.py
python3 scripts/check-static-pages.py
node scripts/check-learning-state.cjs
```

- 教材情報はassets/categories.js、公開URL・サイト名・所有権確認の値はseo.config.jsonで管理します。
- 独自ドメインへ移す場合は、seo.config.jsonのoriginを新しいHTTPSの公開元へ変更して再生成します。canonical・サイトマップ・OGPのURLが一緒に更新されます。サイト移転の転送やSearch Consoleの変更は別途必要です。
- sitemap.xmlは内容のある14ページを掲載し、ホームの `/index.html` は重複掲載せず `/` を正規URLとしています。更新日を推測してlastmodを付けていません。
- ホームのWebSite構造化データはサイト名を伝えるためのものです。検索結果の表示を保証するものではありません。[Google：サイト名](https://developers.google.com/search/docs/appearance/site-names)
- メタキーワードの羅列、架空の評価点、存在しないレビューや学校名は追加していません。

## 今回の検証

19ページの固有タイトル・説明・canonical・OGP・JSON-LDを確認しました。検索対象14ページとサイトマップのURLが一致し、各カテゴリへトップから内部リンクがあることをチェックしました。ローカルリンク検証と既存の学習記録に関する9件のチェックも成功しています。

Googlebotからの公開アクセス、公開配信のHTTPヘッダー、Search Consoleでの所有権確認・サイトマップ受理・インデックス登録は、公開反映後に確認してください。Googleアカウントや所有権確認の値を推測して登録する操作はしていません。

シンプル版では、記録・振り返りログ・カレンダー・設定ページはnoindexとし、サイトマップに掲載しません。ページ構成の更新は `node scripts/build-pages.cjs`、検索設定の更新は `node scripts/update-seo.cjs` を実行します。
