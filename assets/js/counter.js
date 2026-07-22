/**
 * TMWS Counter — Animated statistics
 */
(function () {
  "use strict";

  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (end - start) * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = prefix + end.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function run(el) {
      if (el.dataset.counted === "true") return;
      el.dataset.counted = "true";
      const end = parseInt(el.getAttribute("data-counter"), 10) || 0;
      if (reducedMotion) {
        const suffix = el.getAttribute("data-suffix") || "";
        const prefix = el.getAttribute("data-prefix") || "";
        el.textContent = prefix + end.toLocaleString() + suffix;
        return;
      }
      animateValue(el, end, 1800);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCounters);
  } else {
    initCounters();
  }
})();
