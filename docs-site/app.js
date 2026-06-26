const AUTH = {
  user: "cactuscorp",
  password: "cactuscorp@&2026"
};

const STORAGE_KEYS = {
  authenticated: "cactus-docs-authenticated",
  theme: "cactus-docs-theme"
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
const noResults = document.querySelector("#no-results");

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

function filterDocs(query) {
  const tokens = normalizeSearchText(query)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const cards = [...document.querySelectorAll(".searchable")];
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

applyTheme(currentTheme());
setAuthenticated(localStorage.getItem(STORAGE_KEYS.authenticated) === "true");
