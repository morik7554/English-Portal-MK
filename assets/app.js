(function () {
  const page = document.body.dataset.page;
  const encouragementMessages = [
    "努力はすぐに結果にならなくても、必ず自分の中に残る。",
    "今日の10分が、未来の自分を助けてくれる。",
    "できない問題は、伸びしろが見つかったということ。",
    "間違えた数だけ、正解に近づいている。",
    "勉強は、自分の可能性を広げるための道具。",
    "小さな積み重ねが、大きな自信になる。",
    "今の頑張りは、未来の自分へのプレゼント。",
    "点数より大切なのは、昨日の自分より前に進むこと。",
    "「わからない」は、成長のスタート地点。",
    "努力できる人は、それだけで強い。",
    "すぐにできなくてもいい。続けることに意味がある。",
    "今日覚えた一つが、明日の自信になる。",
    "勉強は、才能よりも習慣で差がつく。",
    "できるまでやる人が、最後に伸びる。",
    "失敗は、次に何をすればいいかを教えてくれる。",
    "頑張った時間は、誰にも奪われない。",
    "結果が出ない日も、力はちゃんとたまっている。",
    "一歩ずつ進めば、遠くまで行ける。",
    "あきらめない人は、必ず変わっていく。",
    "苦手は、向き合った瞬間から変わり始める。",
    "勉強は、自分を裏切らない努力の一つ。",
    "できなかった問題ができるようになる瞬間は、最高の成長。",
    "努力は目に見えにくい。でも、確実に自分を変えている。",
    "比べる相手は、友達ではなく昨日の自分。",
    "「少しだけやる」も、立派な前進。",
    "やる気が出るまで待つより、まず一問解いてみよう。",
    "続けた人だけが、自分の変化に気づける。",
    "勉強に近道はない。でも、進んだ分だけ力になる。",
    "今日の努力は、未来の選択肢を増やしてくれる。",
    "苦しい時こそ、力が伸びている時。",
    "できる人は、最初からできた人ではなく、続けた人。",
    "迷ったら、まず机に向かう。それだけで一歩前進。",
    "自分を信じる材料は、自分の努力で作れる。",
    "何度間違えても、最後にできればそれでいい。",
    "勉強は、自分の世界を広げる冒険。",
    "今日は完璧じゃなくていい。前に進めばいい。",
    "小さな努力を笑わない人が、大きく伸びる。",
    "「無理かも」と思った先に、本当の成長がある。",
    "努力は、未来の自分を守る力になる。",
    "できない自分を責めるより、できる方法を探そう。",
    "1問解けたら、昨日より強くなっている。",
    "成績は、今の自分を決めるものではなく、これからを変える材料。",
    "頑張る姿は、必ず誰かが見ている。",
    "地道に続ける人は、最後に大きな力を手に入れる。",
    "今日の集中が、明日の余裕をつくる。",
    "勉強は、自分の未来に投資する時間。",
    "できるようになるまでの時間も、大切な成長の一部。",
    "努力した経験は、勉強以外でも自分を支えてくれる。",
    "あきらめなかった自分を、いつか必ず誇れる日が来る。",
    "君の頑張りは、ちゃんと未来につながっている。"
  ];

  function categoryCard(category) {
    const article = document.createElement("article");
    article.className = `category-card accent-${category.accent}`;
    const isReady = category.status === "open" && category.url;
    const href = isReady ? category.url : "#";
    const target = isReady ? ' target="_blank" rel="noopener noreferrer"' : "";
    const actionText = isReady ? "→" : category.status;

    article.innerHTML = `
      <a href="${href}"${target} aria-label="${category.title}を開く" class="${isReady ? "" : "is-disabled"}">
        <span class="card-icon">${category.icon}</span>
        <span class="card-body">
          <strong>${category.title}</strong>
        </span>
        <span class="card-arrow" aria-hidden="true">${actionText}</span>
      </a>
    `;
    return article;
  }

  function renderHome() {
    const grid = document.getElementById("categoryGrid");
    if (!grid) return;
    homeButtons.forEach((category) => grid.appendChild(categoryCard(category)));
    const widget = document.querySelector(".encourage-widget");
    if (widget) grid.appendChild(widget);
    renderEncouragement();
  }

  function renderEncouragement() {
    const message = document.getElementById("encourageMessage");
    if (!message) return;
    const index = Math.floor(Math.random() * encouragementMessages.length);
    message.textContent = encouragementMessages[index];
  }

  function renderCategory() {
    const category = portalCategories.find((item) => item.id === page);
    if (!category) return;

    document.title = `${category.title} | English Learning Portal`;
    document.getElementById("categoryTitle").textContent = category.title;
    document.getElementById("categoryDescription").textContent = category.description;
    document.getElementById("categoryIcon").textContent = category.icon;
    document.querySelector(".category-hero").classList.add(`accent-${category.accent}`);

    const gradeGrid = document.getElementById("gradeGrid");
    gradeLinks.forEach((grade) => {
      const materials = category.materials?.[grade.id] || [];
      const materialList = materials.length
        ? `<div class="material-list">
            ${materials
              .map(
                (material) => `
                  <a class="material-link" href="${material.url}" target="_blank" rel="noopener noreferrer">
                    <span>${material.name}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                `
              )
              .join("")}
          </div>`
        : `<span class="status-badge">${grade.status}</span>`;

      const card = document.createElement("article");
      card.className = "grade-card";
      card.innerHTML = `
        <h2>${grade.label}</h2>
        <p>${grade.description}</p>
        ${materialList}
      `;
      gradeGrid.appendChild(card);
    });
  }

  if (page === "home") {
    renderHome();
  } else {
    renderCategory();
  }
})();
