(function () {
  const page = document.body.dataset.page;

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
