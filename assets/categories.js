const portalCategories = [
  {
    id: "vocabulary",
    title: "単語トレーニング",
    shortTitle: "単語",
    icon: "A",
    accent: "yellow",
    href: "categories/vocabulary.html",
    description: "覚えておきたい単語を、学年や目的に合わせて練習します。",
    materials: {
      all: [
        {
          name: "English-Words-Master",
          url: "https://english-words-master.vercel.app/"
        }
      ]
    }
  },
  {
    id: "grammar",
    title: "文法トレーニング",
    shortTitle: "文法",
    icon: "文",
    accent: "green",
    href: "categories/grammar.html",
    description: "中学校英語の文法を、基礎から確認できる教材です。",
    materials: {
      all: [
        {
          name: "不規則動詞アプリを開く",
          url: "https://new-verb-app.vercel.app"
        },
        {
          name: "Grammar Slide",
          url: "https://grammar-slide.vercel.app/"
        }
      ]
    }
  },
  {
    id: "basic-sentences",
    title: "基本文トレーニング",
    shortTitle: "基本文",
    icon: "I am",
    accent: "blue",
    href: "categories/basic-sentences.html",
    description: "基本文を使って、英語の形と意味を身につけます。",
    materials: {
      all: [
        {
          name: "基本文並び替えアプリを開く",
          url: "https://new-english-100knocks.vercel.app/"
        }
      ]
    }
  },
  {
    id: "reading",
    title: "長文読解",
    shortTitle: "長文",
    icon: "📖",
    accent: "purple",
    href: "categories/reading.html",
    description: "いろいろなテーマの英文で、読む力を伸ばします。",
    materials: {
      all: [
        {
          name: "長文読解",
          url: "https://reading-5step.vercel.app"
        }
      ]
    }
  },
  {
    id: "listening",
    title: "リスニング",
    shortTitle: "リスニング",
    icon: "🎧",
    accent: "pink",
    href: "categories/listening.html",
    description: "音声を聞き取る練習に使える教材をまとめます。",
    materials: {
      all: [
        {
          name: "リスニング",
          url: "https://listening-eigo-mimi.vercel.app"
        }
      ]
    }
  },
  {
    id: "tests",
    title: "定期テスト対策",
    shortTitle: "テスト対策",
    icon: "✓",
    accent: "orange",
    href: "categories/tests.html",
    description: "出題傾向をつかみ、高得点を目指すための教材です。"
  },
  {
    id: "prints",
    title: "プリント教材",
    shortTitle: "プリント",
    icon: "□",
    accent: "teal",
    href: "categories/prints.html",
    description: "授業や家庭学習ですぐに使えるプリントを整理します。",
    materials: {
      all: [
        {
          name: "スライド式英文法プリント",
          url: "https://english-grammar-4-slides-prints.vercel.app/index.html"
        }
      ]
    }
  },
  {
    id: "summer",
    title: "夏休み・長期休み教材",
    shortTitle: "長期休み教材",
    icon: "☀️",
    accent: "sky",
    href: "categories/summer.html",
    description: "長期休みを活用して、復習や発展学習に取り組みます。"
  }
];

const homeButtons = [
  {
    title: "単語トレーニング",
    icon: "A",
    accent: "yellow",
    url: "https://english-words-master.vercel.app/",
    status: "open"
  },
  {
    title: "文法トレーニング",
    icon: "文",
    accent: "green",
    url: "https://grammar-slide.vercel.app/",
    status: "open"
  },
  {
    title: "長文読解",
    icon: "📖",
    accent: "purple",
    url: "https://reading-5step.vercel.app",
    status: "open"
  },
  {
    title: "リスニング",
    icon: "🎧",
    accent: "pink",
    url: "https://listening-eigo-mimi.vercel.app",
    status: "open"
  },
  {
    title: "デジタルプリント",
    icon: "□",
    accent: "teal",
    url: "https://grammar-slide.vercel.app/",
    status: "open"
  },
  {
    title: "4スライドプリント",
    icon: "4",
    accent: "blue",
    url: "https://english-grammar-4-slides-prints.vercel.app/index.html",
    status: "open"
  },
  {
    title: "期間限定（夏休みの宿題）",
    icon: "☀️",
    accent: "sky",
    url: "https://summer-english-quest.vercel.app/",
    status: "open"
  }
];

const gradeLinks = [
  { id: "grade1", label: "1年", description: "中学1年生向けの教材", status: "準備中" },
  { id: "grade2", label: "2年", description: "中学2年生向けの教材", status: "準備中" },
  { id: "grade3", label: "3年", description: "中学3年生向けの教材", status: "準備中" },
  { id: "all", label: "全学年", description: "学年をまたいで使える教材", status: "準備中" }
];
