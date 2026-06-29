const AUTH = {
  user: "cactuscorp",
  password: "cactuscorp@&2026"
};

const STORAGE_KEYS = {
  authenticated: "cactus-docs-authenticated",
  theme: "cactus-docs-theme",
  activeApp: "cactus-docs-active-app"
};

const APPS = {
  "queue-hub": {
    title: "Queue Hub",
    searchPlaceholder: "Busque por JQL, filas, logs..."
  },
  "issue-action-hub": {
    title: "Issue Action Hub",
    searchPlaceholder: "Busque por transição, campo, auditoria..."
  }
};

const loginScreen = document.querySelector("#login-screen");
const appScreen = document.querySelector("#app-screen");
const loginForm = document.querySelector("#login-form");
const loginUser = document.querySelector("#login-user");
const loginPassword = document.querySelector("#login-password");
const loginError = document.querySelector("#login-error");
const logoutButton = document.querySelector("#logout-button");
const themeToggle = document.querySelector("#theme-toggle");
const printButton = document.querySelector("#print-button");
const searchInput = document.querySelector("#doc-search");
const searchStatus = document.querySelector("#search-status");
const appTitle = document.querySelector("#app-title");
const appTabs = [...document.querySelectorAll(".app-tab[data-app]")];
const appDocs = [...document.querySelectorAll("[data-docs-app]")];
const appHeroes = [...document.querySelectorAll("[data-app-hero]")];
let activeAppId = localStorage.getItem(STORAGE_KEYS.activeApp);

if (!APPS[activeAppId]) {
  activeAppId = "queue-hub";
}

function normalizeSearchText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function setAuthenticated(authenticated) {
  localStorage.setItem(STORAGE_KEYS.authenticated, authenticated ? "true" : "false");
  loginScreen.hidden = authenticated;
  appScreen.hidden = !authenticated;

  if (authenticated) {
    searchInput?.focus();
  } else {
    loginUser?.focus();
  }
}

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
  localStorage.setItem(STORAGE_KEYS.theme, theme);

  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "Tema dark" : "Tema light";
  }
}

function currentTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) === "light" ? "light" : "dark";
}

function getActiveDocsContainer() {
  return document.querySelector(`[data-docs-app="${activeAppId}"]`);
}

function setActiveApp(appId) {
  if (!APPS[appId]) {
    return;
  }

  activeAppId = appId;
  localStorage.setItem(STORAGE_KEYS.activeApp, appId);

  appTabs.forEach((tab) => {
    const selected = tab.dataset.app === appId;
    tab.classList.toggle("selected", selected);
    tab.setAttribute("aria-selected", String(selected));
  });

  appDocs.forEach((container) => {
    container.hidden = container.dataset.docsApp !== appId;
  });

  appHeroes.forEach((hero) => {
    hero.hidden = hero.dataset.appHero !== appId;
  });

  if (appTitle) {
    appTitle.textContent = APPS[appId].title;
  }

  if (searchInput) {
    searchInput.placeholder = APPS[appId].searchPlaceholder;
  }

  filterDocs(searchInput?.value || "");
}

function filterDocs(query) {
  const tokens = normalizeSearchText(query)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const container = getActiveDocsContainer();
  const cards = [...(container?.querySelectorAll(".searchable") || [])];
  const noResults = container?.querySelector("[data-no-results]");
  let visibleCount = 0;

  cards.forEach((card) => {
    const text = normalizeSearchText(card.textContent ?? "");
    const isVisible = tokens.length === 0 || tokens.every((token) => text.includes(token));

    card.classList.toggle("hidden-by-search", !isVisible);
    visibleCount += isVisible ? 1 : 0;
  });

  if (noResults) {
    noResults.hidden = tokens.length === 0 || visibleCount > 0;
  }

  if (searchStatus) {
    searchStatus.textContent = tokens.length === 0 ? "" : `${visibleCount} resultado${visibleCount === 1 ? "" : "s"}`;
  }
}

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const valid = loginUser.value.trim() === AUTH.user && loginPassword.value === AUTH.password;

  if (!valid) {
    loginError.hidden = false;
    loginPassword.select();
    return;
  }

  loginError.hidden = true;
  loginPassword.value = "";
  setAuthenticated(true);
});

logoutButton?.addEventListener("click", () => {
  if (searchInput) {
    searchInput.value = "";
  }
  filterDocs("");
  setAuthenticated(false);
});

themeToggle?.addEventListener("click", () => {
  applyTheme(currentTheme() === "light" ? "dark" : "light");
});

printButton?.addEventListener("click", () => {
  window.print();
});

searchInput?.addEventListener("input", (event) => {
  filterDocs(event.target.value);
});

appTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveApp(tab.dataset.app);
  });
});

setActiveApp(activeAppId);
applyTheme(currentTheme());
setAuthenticated(localStorage.getItem(STORAGE_KEYS.authenticated) === "true");
