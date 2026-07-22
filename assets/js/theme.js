/**
 * TMWS Theme — Dark / Light mode persistence
 */
(function () {
  "use strict";

  const STORAGE_KEY = "tmws-theme";
  const root = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach(function (btn) {
        btn.setAttribute(
          "aria-label",
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
        btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      });
  }

  function toggleTheme() {
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  // Apply early to avoid flash (also mirrored in inline head script)
  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach(function (btn) {
        btn.addEventListener("click", toggleTheme);
      });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  });

  window.TMWSTheme = { applyTheme: applyTheme, toggleTheme: toggleTheme };
})();
