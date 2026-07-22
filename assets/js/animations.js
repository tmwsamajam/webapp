/**
 * TMWS Animations — Scroll reveal, parallax, page loader, progress
 */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initLoader() {
    const loader = document.querySelector("[data-page-loader]");
    if (!loader) return;
    window.addEventListener("load", function () {
      setTimeout(function () {
        loader.classList.add("is-hidden");
      }, reducedMotion ? 0 : 200);
    });
    // Fallback
    setTimeout(function () {
      loader.classList.add("is-hidden");
    }, 2500);
  }

  function initScrollProgress() {
    const bar = document.querySelector("[data-scroll-progress]");
    if (!bar) return;
    function update() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = progress + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initBackToTop() {
    const btn = document.querySelector("[data-back-to-top]");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 500);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initParallax() {
    if (reducedMotion) return;
    const layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;

    function update() {
      const scrollY = window.scrollY;
      layers.forEach(function (el) {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        el.style.transform = "translate3d(0, " + scrollY * speed + "px, 0)";
      });
    }

    window.addEventListener("scroll", update, { passive: true });
  }

  function initFaq() {
    document.querySelectorAll("[data-faq-item]").forEach(function (item) {
      const btn = item.querySelector(".faq-item__question");
      const answer = item.querySelector(".faq-item__answer");
      if (!btn || !answer) return;

      btn.addEventListener("click", function () {
        const isOpen = item.classList.contains("is-open");
        document.querySelectorAll("[data-faq-item].is-open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            const a = openItem.querySelector(".faq-item__answer");
            if (a) a.style.maxHeight = null;
            openItem
              .querySelector(".faq-item__question")
              .setAttribute("aria-expanded", "false");
          }
        });

        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
        answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
      });
    });
  }

  function initTestimonials() {
    const slider = document.querySelector("[data-testimonial-slider]");
    if (!slider) return;

    const track = slider.querySelector(".testimonial-track");
    const slides = slider.querySelectorAll(".testimonial-slide");
    const dotsWrap = slider.querySelector(".testimonial-dots");
    if (!track || !slides.length) return;

    let index = 0;
    let timer;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (dot, di) {
          dot.classList.toggle("is-active", di === index);
          dot.setAttribute("aria-selected", di === index ? "true" : "false");
        });
      }
    }

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", function () {
          goTo(i);
          resetTimer();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function resetTimer() {
      clearInterval(timer);
      if (reducedMotion || slides.length < 2) return;
      timer = setInterval(function () {
        goTo(index + 1);
      }, 6000);
    }

    resetTimer();
    slider.addEventListener("mouseenter", function () {
      clearInterval(timer);
    });
    slider.addEventListener("mouseleave", resetTimer);
  }

  function initLazyImages() {
    document.querySelectorAll("img[data-src]").forEach(function (img) {
      const load = function () {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        img.classList.add("img-reveal");
        img.addEventListener(
          "load",
          function () {
            img.classList.add("is-loaded");
          },
          { once: true }
        );
      };

      if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              load();
              obs.unobserve(img);
            }
          });
        });
        obs.observe(img);
      } else {
        load();
      }
    });
  }

  window.TMWSAnimations = {
    initReveal: initReveal,
    initBackToTop: initBackToTop,
    initScrollProgress: initScrollProgress,
    initFaq: initFaq,
    initTestimonials: initTestimonials,
    initLazyImages: initLazyImages,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initScrollProgress();
    initParallax();
    document.body.classList.add("page-enter");
  });
})();
