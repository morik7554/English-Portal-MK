const portalMaterials = [
  { id: "words", title: "単語を練習する", name: "English-Words-Master", url: "https://english-words-master.vercel.app/", goals: ["words"], categories: ["vocabulary"], color: "amber", icon: "Aa", description: "学年・Unitをえらんで、単語を練習します。", prerequisite: "中学の学年・Unitから選択。教科書との対応は先生に確認。", level: "中学の単語", experience: ["basic", "challenge"], conditions: "入力あり", checked: "2026-11-17", scope: "開始・学年・Unit選択を確認。全問題と採点は未検証。", first: "学年とUnitをえらびます。少ない単語から練習してみよう。", help: "分からない語を確かめて、少ない数からもう一度。" },
  { id: "grammar", title: "英文のしくみを学ぶ", name: "Grammar Slide", url: "https://grammar-slide.vercel.app/", goals: ["grammar", "sentences"], categories: ["grammar", "prints"], color: "mint", icon: "≡", description: "学年や単元をえらび、スライドで文法を確認します。", prerequisite: "学習したい文法の範囲を、先生と確かめてください。", level: "中学の文法", experience: ["basic", "challenge"], conditions: "スライド・一部動画は準備中", checked: "2026-11-17", scope: "コース・基礎の語順スライドを確認。内容全体は未検証。自動おすすめの対象外。", first: "画面の案内と、自分が学びたい範囲を確認します。", help: "どこから始めるか迷ったら先生に相談しましょう。" },
  { id: "knock", title: "英文を組み立てる", name: "English Knock", url: "https://new-english-100knocks.vercel.app/", goals: ["sentences", "grammar"], categories: ["basic-sentences", "grammar"], color: "blue", icon: "↔", description: "基本文の練習に使う教材です。範囲を先生と確かめて使いましょう。", prerequisite: "ニックネームは本名・学校名などを使わないでください。", level: "学習内容を確認中", experience: ["basic", "challenge"], conditions: "ニックネーム入力あり", checked: "2026-11-17", scope: "開始画面のみ確認。学習内容・採点は未検証。自動おすすめの対象外。", first: "個人を特定できないニックネームで、案内に沿って始めます。", help: "文の形が分からなければ、基本文を先生と確認しましょう。" },
  { id: "reading", title: "根拠を見つけて読む", name: "長文読解 5STEP", url: "https://reading-5step.vercel.app/", goals: ["reading"], categories: ["reading"], color: "violet", icon: "▤", description: "5つの作戦を手がかりに、英文を読み進めます。", prerequisite: "中1〜入試のレベルを選択。基本の単語や文の知識を使います。", level: "中1〜高校入試", experience: ["basic", "challenge"], conditions: "英文を読む", checked: "2026-11-17", scope: "レベル選択と最初の作戦画面を確認。全問題と採点は未検証。", first: "レベルとテーマをえらび、画面の作戦を一つずつ試します。", help: "短い英文に戻ったり、必要な単語を確かめたりしてみましょう。" },
  { id: "listening", title: "英語の音を聞く", name: "Ear Builder English", url: "https://listening-eigo-mimi.vercel.app/", goals: ["listening"], categories: ["listening"], color: "rose", icon: "♪", description: "短い英文から、聞く・確かめる練習へ進みます。", prerequisite: "中学生向け。小学生の利用は、文や語彙が合うか先生と確認。", level: "短い単文〜実戦", experience: ["basic", "challenge"], conditions: "音声あり・音が出せる環境", checked: "2026-11-17", scope: "開始・再開・速度選択画面を確認。音声品質と全採点は未検証。", first: "短いレッスンをえらび、まず文字を見ずに聞きます。", help: "速度をゆっくりにし、文字で確かめてからもう一度聞こう。" },
  { id: "verbs", title: "不規則動詞を確かめる", name: "不規則動詞アプリ", url: "https://new-verb-app.vercel.app/", goals: ["words", "grammar"], categories: ["grammar", "vocabulary"], color: "amber", icon: "Aa", description: "30の不規則動詞を、一覧や単語帳で確かめます。", prerequisite: "対象・操作方法は先生と確認してください。", level: "不規則動詞の復習", experience: ["basic", "challenge"], conditions: "入力を使う練習あり", checked: "2026-11-17", scope: "動詞一覧と練習メニューを確認。全モードの採点は未検証。自動おすすめの対象外。", first: "教材の案内と、学ぶ動詞を確かめます。", help: "少ない数から、ノートを使って練習しても大丈夫。" },
  { id: "prints", title: "プリントで練習する", name: "4スライドプリント", url: "https://english-grammar-4-slides-prints.vercel.app/index.html", goals: ["grammar", "sentences"], categories: ["prints"], color: "mint", icon: "▥", description: "文法のまとめ・問題・解答を、紙やノートで使えます。", prerequisite: "教材の内容と、印刷できる環境を確認してください。", level: "中1〜中3の文法", experience: ["basic", "challenge"], conditions: "印刷する場合はA4横", checked: "2026-11-17", scope: "学年一覧とI amの問題・解答を確認。全問題と印刷動作は未検証。自動おすすめの対象外。", first: "学ぶ範囲と教材の使い方を確認します。", help: "印刷できない場合は先生に相談してください。" },
  { id: "summer", title: "テスト範囲を確かめる", name: "定期テスト英語対策", url: "https://summer-english-quest.vercel.app/", goals: [], categories: ["tests"], color: "amber", icon: "☀", description: "特定のテスト範囲と練習順を確認するページです。", prerequisite: "掲載の範囲は特定の授業向けです。自分のテスト範囲は先生に確認。", level: "指定のテスト範囲向け", experience: ["basic", "challenge"], conditions: "自分の範囲との違いに注意", checked: "2026-11-17", scope: "テスト範囲・文法・練習リンクを確認。全リンクと内容全体は未検証。自動おすすめの対象外。", first: "学校からの案内と、教材の対象を確かめます。", help: "指定がなければ、通常の教材から目的に合うものをえらぼう。" }
];
const portalCategories = [
  { id: "vocabulary", title: "単語を練習する", description: "意味とつづりを確かめる教材。学年より、今の自分に合う範囲をえらぼう。" },
  { id: "grammar", title: "英文のしくみを学ぶ", description: "説明を見る教材と、問題で練習する教材を使い分けよう。" },
  { id: "basic-sentences", title: "文を作る", description: "基本文の形や意味を確かめながら、英文を作る練習へ。" },
  { id: "reading", title: "英文を読む", description: "問いを手がかりにして、答えの根拠を見つけよう。" },
  { id: "listening", title: "英語を聞く", description: "文字を見ずに聞く、文字で確かめる、もう一度聞く。方法を変えてみよう。" },
  { id: "prints", title: "プリントで学ぶ", description: "紙やノートで練習したいときに。内容と利用条件は先生と確認しよう。" },
  { id: "summer", title: "長期休みの教材", description: "長期休み専用の教材は現在掲載していません。通常の教材を、復習する範囲と使い方を先生と決めて使えます。" },
  { id: "tests", title: "テストに向けた復習", description: "掲載教材の範囲は特定の授業向けです。自分のテスト範囲を先生と確かめて使いましょう。" }
];

const portalSections = [
  { id: "vocabulary", title: "単語", description: "意味やつづりを練習する", icon: "Aa", color: "amber" },
  { id: "grammar", title: "文法・基本文", description: "しくみを知る・文を作る", icon: "≡", color: "mint" },
  { id: "reading", title: "読む", description: "英文の読み方を練習する", icon: "▤", color: "violet" },
  { id: "listening", title: "聞く", description: "英語の音を聞いて確かめる", icon: "♪", color: "rose" },
  { id: "prints", title: "プリント", description: "紙やノートで練習する", icon: "▥", color: "blue" },
  { id: "tests", title: "テスト対策", description: "範囲を確かめて復習する", icon: "✓", color: "amber" }
];
