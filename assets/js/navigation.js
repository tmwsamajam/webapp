/**
 * TMWS Navigation — Sticky header, mobile menu, dropdowns
 */
(function () {
  "use strict";

  function initNavigation() {
    const header = document.querySelector("[data-site-header]");
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    const overlay = document.querySelector("[data-nav-overlay]");
    const dropdownItems = document.querySelectorAll("[data-has-dropdown]");

    if (!header) return;
    if (header.dataset.navReady === "true") return;
    header.dataset.navReady = "true";

    const isHome = header.hasAttribute("data-transparent");

    function updateHeader() {
      const scrolled = window.scrollY > 40;
      header.classList.toggle("site-header--scrolled", scrolled);
      if (isHome) {
        header.classList.toggle("site-header--transparent", !scrolled);
        header.classList.toggle("site-header--solid", scrolled);
      } else {
        header.classList.add("site-header--solid");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    function closeNav() {
      if (!nav || !toggle) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (overlay) overlay.classList.remove("is-visible");
      document.body.style.overflow = "";
      dropdownItems.forEach(function (item) {
        item.classList.remove("is-open");
      });
    }

    function openNav() {
      if (!nav || !toggle) return;
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (overlay) overlay.classList.add("is-visible");
      document.body.style.overflow = "hidden";
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", closeNav);
    }

    // Mobile dropdown toggles
    dropdownItems.forEach(function (item) {
      const link = item.querySelector(":scope > .nav__link");
      if (!link) return;
      link.addEventListener("click", function (e) {
        if (window.innerWidth > 900) return;
        e.preventDefault();
        item.classList.toggle("is-open");
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    // Close on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });

    // Mark current page
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__link[href], .nav__dropdown a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;
      const file = href.split("/").pop().split("#")[0];
      if (file === path || (path === "" && file === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  window.TMWSNavigation = { init: initNavigation };
})();
