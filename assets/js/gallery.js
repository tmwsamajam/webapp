/**
 * TMWS Gallery — Masonry filters, search, lightbox
 */
(function () {
  "use strict";

  function initLightbox() {
    let lightbox = document.querySelector("[data-lightbox]");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.setAttribute("data-lightbox", "");
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", "Image lightbox");
      lightbox.innerHTML =
        '<button type="button" class="lightbox__close" data-lightbox-close aria-label="Close lightbox">' +
        '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        "</button>" +
        '<button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="Previous image">' +
        '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>' +
        "</button>" +
        '<img class="lightbox__img" alt="" />' +
        '<button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="Next image">' +
        '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>' +
        "</button>" +
        '<p class="lightbox__caption" data-lightbox-caption></p>';
      document.body.appendChild(lightbox);
    }

    const img = lightbox.querySelector(".lightbox__img");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    let items = [];
    let current = 0;

    function open(index) {
      current = index;
      const item = items[current];
      if (!item) return;
      img.src = item.src;
      img.alt = item.alt || "";
      if (caption) caption.textContent = item.caption || item.alt || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    function bindItems() {
      items = Array.from(document.querySelectorAll("[data-gallery-item]")).map(
        function (el) {
          const image = el.querySelector("img");
          return {
            el: el,
            src: el.getAttribute("data-full") || (image && image.src) || "",
            alt: (image && image.alt) || "",
            caption: el.getAttribute("data-caption") || "",
          };
        }
      );

      items.forEach(function (item, index) {
        item.el.addEventListener("click", function () {
          open(index);
        });
        item.el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open(index);
          }
        });
      });
    }

    lightbox
      .querySelector("[data-lightbox-close]")
      .addEventListener("click", close);
    lightbox
      .querySelector("[data-lightbox-prev]")
      .addEventListener("click", function () {
        open((current - 1 + items.length) % items.length);
      });
    lightbox
      .querySelector("[data-lightbox-next]")
      .addEventListener("click", function () {
        open((current + 1) % items.length);
      });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") open((current - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") open((current + 1) % items.length);
    });

    bindItems();
    return { rebind: bindItems };
  }

  function initFilters(lightboxApi) {
    const grid = document.querySelector("[data-gallery-grid]");
    if (!grid) return;

    const filterBtns = document.querySelectorAll("[data-gallery-filter]");
    const searchInput = document.querySelector("[data-gallery-search]");

    function applyFilters() {
      const activeBtn = document.querySelector(
        "[data-gallery-filter].is-active"
      );
      const category = activeBtn
        ? activeBtn.getAttribute("data-gallery-filter")
        : "all";
      const query = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

      grid.querySelectorAll("[data-gallery-item]").forEach(function (item) {
        const cat = item.getAttribute("data-category") || "";
        const caption = (
          item.getAttribute("data-caption") ||
          item.textContent ||
          ""
        ).toLowerCase();
        const matchCat = category === "all" || cat === category;
        const matchSearch = !query || caption.indexOf(query) !== -1;
        item.style.display = matchCat && matchSearch ? "" : "none";
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    if (lightboxApi) lightboxApi.rebind();
  }

  function renderGalleryFromData(data) {
    const grid = document.querySelector("[data-gallery-grid]");
    if (!grid || !data || !data.length) return;

    grid.innerHTML = data
      .map(function (item) {
        return (
          '<figure class="gallery-item reveal" data-gallery-item tabindex="0" role="button" ' +
          'data-category="' +
          (item.category || "") +
          '" data-caption="' +
          (item.title || "") +
          '" data-full="' +
          item.image +
          '">' +
          '<img src="' +
          item.image +
          '" alt="' +
          (item.alt || item.title || "Gallery image") +
          '" loading="lazy" width="600" height="400" />' +
          '<figcaption class="gallery-item__overlay"><span class="gallery-item__title">' +
          (item.title || "") +
          "</span></figcaption></figure>"
        );
      })
      .join("");
  }

  window.TMWSGallery = {
    initLightbox: initLightbox,
    initFilters: initFilters,
    renderGalleryFromData: renderGalleryFromData,
  };

  document.addEventListener("DOMContentLoaded", function () {
    const api = initLightbox();
    initFilters(api);
  });
})();
