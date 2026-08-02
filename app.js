const state = {
  eras: [],
  activeId: null,
};

async function loadData() {
  const content = document.getElementById("era-content");
  try {
    const res = await fetch("data/data.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.eras = data.eras || [];
    if (state.eras.length === 0) {
      content.innerHTML = '<p class="error">No eras found in data.json.</p>';
      return;
    }
    state.activeId = state.eras[0].id;
    renderNav();
    renderEra();
  } catch (err) {
    content.innerHTML = `<p class="error">Failed to load data: ${err.message}. If viewing locally, serve via a local web server (e.g. <code>python3 -m http.server</code>).</p>`;
  }
}

function renderNav() {
  const nav = document.getElementById("era-nav");
  nav.innerHTML = "";
  state.eras.forEach((era) => {
    const btn = document.createElement("button");
    btn.textContent = era.name;
    btn.dataset.id = era.id;
    if (era.id === state.activeId) btn.classList.add("active");
    btn.addEventListener("click", () => {
      state.activeId = era.id;
      renderNav();
      renderEra();
    });
    nav.appendChild(btn);
  });
}

function renderEra() {
  const content = document.getElementById("era-content");
  const era = state.eras.find((e) => e.id === state.activeId);
  if (!era) {
    content.innerHTML = '<p class="error">Era not found.</p>';
    return;
  }
  content.innerHTML = `
    <article class="era-card">
      <h2>${escapeHtml(era.name)}</h2>
      <div class="era-years">${escapeHtml(era.years)}</div>
      <p class="era-description">${escapeHtml(era.description)}</p>
      ${listSection("Key Characters", era.keyCharacters)}
      ${listSection("Landmark Issues", era.landmarkIssues)}
      ${listSection("Notable Creators", era.creators)}
    </article>
  `;
}

function listSection(title, items) {
  if (!items || items.length === 0) return "";
  const li = items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  return `
    <div class="era-section">
      <h3>${escapeHtml(title)}</h3>
      <ul>${li}</ul>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", loadData);
