/**
 * TMWS Main — Shared components, data loading, page initializers
 */
(function () {
  "use strict";

  const SITE = {
    name: "TMWS",
    fullName: "Tambaram Malayalee Welfare Samajam",
    tagline: "Unity · Culture · Welfare",
    phone: "+91 98765 43210",
    email: "info@tmwsamajam.org",
    whatsapp: "919876543210",
    address: "Tambaram, Chennai, Tamil Nadu, India",
    social: {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      twitter: "https://twitter.com/",
    },
  };

  /* ---------- Helpers ---------- */

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  async function loadJSON(path) {
    try {
      var url = path;
      try {
        url = new URL(path, document.baseURI || window.location.href).href;
      } catch (e) {}
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error("Failed to load " + path + " (" + res.status + ")");
      return await res.json();
    } catch (err) {
      console.warn("[TMWS]", err && err.message ? err.message : err);
      return null;
    }
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function dateParts(iso) {
    const d = new Date(iso);
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      year: d.getFullYear(),
    };
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Icons (inline SVG) ---------- */

  const ICONS = {
    chevron:
      '<svg class="nav__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    sun: '<svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1111.5 3a7 7 0 009.5 11.5z"/></svg>',
    map: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>',
    arrow:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    check:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    facebook:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
    instagram:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    youtube:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>',
    twitter:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.8c-.7.3-1.5.5-2.3.6a4 4 0 001.8-2.2 8 8 0 01-2.6 1 4 4 0 00-6.9 3.7A11.4 11.4 0 013.2 4.7a4 4 0 001.2 5.4 4 4 0 01-1.8-.5v.1a4 4 0 003.2 3.9 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8.1 8.1 0 012 18.4a11.4 11.4 0 006.2 1.8c7.4 0 11.5-6.1 11.5-11.5v-.5A8.2 8.2 0 0022 5.8z"/></svg>',
    whatsapp:
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11 11 0 004.1 17.7L3 21l3.4-1.1A11 11 0 1020.5 3.5zM12 20a9 9 0 01-4.6-1.3l-.3-.2-2.7.9.9-2.6-.2-.3A9 9 0 1112 20zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.3 7.3 0 01-2.1-1.3 8 8 0 01-1.5-1.8c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3A12 12 0 0012.5 17c.7.3 1.3.2 1.8.1s1.4-.6 1.6-1.2.2-1.1.1-1.2-.3-.2-.6-.3z"/></svg>',
    pdf: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M10 13h4M10 17h4M10 9h1"/></svg>',
  };

  /* ---------- Header / Footer injection ---------- */

  function renderHeader(options) {
    const mount = qs("[data-header-mount]");
    if (!mount) return;

    const transparent = options && options.transparent;
    const classes = [
      "site-header",
      transparent ? "site-header--transparent" : "site-header--solid",
    ].join(" ");

    mount.outerHTML =
      '<div class="nav-overlay" data-nav-overlay></div>' +
      '<header class="' +
      classes +
      '" data-site-header' +
      (transparent ? " data-transparent" : "") +
      ' role="banner">' +
      '<div class="container site-header__inner">' +
      '<a href="index.html" class="site-logo" aria-label="' +
      SITE.fullName +
      ' home">' +
      '<img class="site-logo__img" src="assets/images/logo/tmws-logo.svg" width="42" height="42" alt="' +
      SITE.name +
      ' logo" />' +
      '<span class="site-logo__text">' +
      '<span class="site-logo__name">' +
      SITE.name +
      "</span>" +
      '<span class="site-logo__tag">' +
      SITE.tagline +
      "</span></span></a>" +
      '<button type="button" class="nav-toggle" data-nav-toggle aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">' +
      '<span class="nav-toggle__icon" aria-hidden="true"><span></span><span></span><span></span></span></button>' +
      '<nav id="site-nav" class="nav" data-nav aria-label="Primary">' +
      '<ul class="nav__list">' +
      navItem("index.html", "Home") +
      navItem("about.html", "About") +
      navItem("committee.html", "Committee") +
      dropdownItem("Explore", [
        ["activities.html", "Activities"],
        ["events.html", "Events"],
        ["gallery.html", "Gallery"],
        ["news.html", "News"],
      ]) +
      navItem("membership.html", "Membership") +
      navItem("downloads.html", "Downloads") +
      navItem("contact.html", "Contact") +
      "</ul>" +
      '<div class="nav__actions">' +
      '<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="Toggle dark mode">' +
      ICONS.sun +
      ICONS.moon +
      "</button>" +
      '<a href="membership.html" class="btn btn--secondary btn--sm">Join Us</a>' +
      "</div></nav></div></header>";
  }

  function navItem(href, label) {
    return (
      '<li class="nav__item"><a class="nav__link" href="' +
      href +
      '">' +
      label +
      "</a></li>"
    );
  }

  function dropdownItem(label, links) {
    return (
      '<li class="nav__item" data-has-dropdown>' +
      '<a class="nav__link" href="#" aria-haspopup="true">' +
      label +
      " " +
      ICONS.chevron +
      "</a>" +
      '<div class="nav__dropdown" role="menu">' +
      links
        .map(function (l) {
          return '<a href="' + l[0] + '" role="menuitem">' + l[1] + "</a>";
        })
        .join("") +
      "</div></li>"
    );
  }

  function renderFooter() {
    const mount = qs("[data-footer-mount]");
    if (!mount) return;

    mount.outerHTML =
      '<footer class="site-footer" role="contentinfo">' +
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' +
      '<div class="footer-brand__logo">' +
      '<img src="assets/images/logo/tmws-logo.svg" width="44" height="44" alt="" />' +
      '<span class="footer-brand__name">' +
      SITE.name +
      "</span></div>" +
      '<p class="footer-brand__desc">A community organization dedicated to the welfare, culture, and unity of Malayalees in Tambaram and surrounding areas.</p>' +
      '<div class="social-links">' +
      '<a href="' +
      SITE.social.facebook +
      '" aria-label="Facebook" target="_blank" rel="noopener">' +
      ICONS.facebook +
      "</a>" +
      '<a href="' +
      SITE.social.instagram +
      '" aria-label="Instagram" target="_blank" rel="noopener">' +
      ICONS.instagram +
      "</a>" +
      '<a href="' +
      SITE.social.youtube +
      '" aria-label="YouTube" target="_blank" rel="noopener">' +
      ICONS.youtube +
      "</a>" +
      '<a href="' +
      SITE.social.twitter +
      '" aria-label="X / Twitter" target="_blank" rel="noopener">' +
      ICONS.twitter +
      "</a></div></div>" +
      '<div><h3 class="footer-heading">Quick Links</h3><ul class="footer-links">' +
      '<li><a href="about.html">About Us</a></li>' +
      '<li><a href="committee.html">Committee</a></li>' +
      '<li><a href="activities.html">Activities</a></li>' +
      '<li><a href="events.html">Events</a></li>' +
      '<li><a href="membership.html">Membership</a></li></ul></div>' +
      '<div><h3 class="footer-heading">Useful Links</h3><ul class="footer-links">' +
      '<li><a href="gallery.html">Gallery</a></li>' +
      '<li><a href="news.html">News</a></li>' +
      '<li><a href="downloads.html">Downloads</a></li>' +
      '<li><a href="privacy.html">Privacy Policy</a></li>' +
      '<li><a href="terms.html">Terms of Use</a></li></ul></div>' +
      '<div><h3 class="footer-heading">Contact</h3>' +
      '<div class="footer-contact-item">' +
      ICONS.map +
      "<span>" +
      SITE.address +
      "</span></div>" +
      '<div class="footer-contact-item">' +
      ICONS.phone +
      '<a href="tel:' +
      SITE.phone.replace(/\s/g, "") +
      '">' +
      SITE.phone +
      "</a></div>" +
      '<div class="footer-contact-item">' +
      ICONS.mail +
      '<a href="mailto:' +
      SITE.email +
      '">' +
      SITE.email +
      "</a></div></div></div>" +
      '<div class="footer-bottom">' +
      "<p>&copy; <span data-year></span> " +
      SITE.fullName +
      ". All rights reserved.</p>" +
      '<div class="footer-legal">' +
      '<a href="privacy.html">Privacy</a>' +
      '<a href="terms.html">Terms</a>' +
      '<a href="contact.html">Contact</a></div></div></div></footer>' +
      '<button type="button" class="back-to-top" data-back-to-top aria-label="Back to top">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg></button>' +
      '<a class="whatsapp-float" href="https://wa.me/' +
      SITE.whatsapp +
      '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
      ICONS.whatsapp +
      "</a>";

    const yearEl = qs("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Renderers ---------- */

  function renderEventCard(event) {
    const parts = dateParts(event.date);
    return (
      '<article class="card event-card reveal">' +
      '<div class="card__media">' +
      '<div class="event-card__date"><span class="day">' +
      parts.day +
      '</span><span class="month">' +
      parts.month +
      "</span></div>" +
      '<img src="' +
      escapeHtml(event.image) +
      '" alt="' +
      escapeHtml(event.title) +
      '" loading="lazy" width="640" height="400" /></div>' +
      '<div class="card__body">' +
      '<div class="card__meta"><span class="badge">' +
      escapeHtml(event.category || "Event") +
      '</span><span class="event-card__location">' +
      ICONS.map +
      " " +
      escapeHtml(event.location) +
      "</span></div>" +
      '<h3 class="card__title">' +
      escapeHtml(event.title) +
      "</h3>" +
      '<p class="card__text">' +
      escapeHtml(event.summary) +
      "</p>" +
      '<a class="card__link" href="events.html#' +
      escapeHtml(event.id) +
      '">View details ' +
      ICONS.arrow +
      "</a></div></article>"
    );
  }

  function renderNewsCard(item, featured) {
    if (featured) {
      return (
        '<article class="card news-card--featured reveal">' +
        '<div class="card__media"><img src="' +
        escapeHtml(item.image) +
        '" alt="' +
        escapeHtml(item.title) +
        '" loading="lazy" width="800" height="500" /></div>' +
        '<div class="card__body">' +
        '<div class="card__meta"><span class="badge badge--accent">Featured</span><time datetime="' +
        escapeHtml(item.date) +
        '">' +
        formatDate(item.date) +
        "</time></div>" +
        '<h3 class="card__title">' +
        escapeHtml(item.title) +
        "</h3>" +
        '<p class="card__text">' +
        escapeHtml(item.summary) +
        "</p>" +
        '<a class="btn btn--primary btn--sm" href="news.html#' +
        escapeHtml(item.id) +
        '">Read more</a></div></article>'
      );
    }
    return (
      '<article class="card reveal">' +
      '<div class="card__media"><img src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.title) +
      '" loading="lazy" width="640" height="400" /></div>' +
      '<div class="card__body">' +
      '<div class="card__meta"><time datetime="' +
      escapeHtml(item.date) +
      '">' +
      formatDate(item.date) +
      "</time></div>" +
      '<h3 class="card__title">' +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="card__text">' +
      escapeHtml(item.summary) +
      "</p>" +
      '<a class="card__link" href="news.html#' +
      escapeHtml(item.id) +
      '">Read more ' +
      ICONS.arrow +
      "</a></div></article>"
    );
  }

  function committeePhotoPath(photo) {
    var fallback = "assets/images/committee/default.png";
    if (!photo) return fallback;
    if (String(photo).indexOf("/") !== -1) return photo;
    return "assets/images/committee/" + photo;
  }

  function sectionIcon(name) {
    var icons = {
      leadership:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>',
      megaphone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a4 4 0 01-7.6-1.8V13"/></svg>',
      heart:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.8 6.5a5 5 0 00-7.1 0L12 8.2l-1.7-1.7a5 5 0 00-7.1 7.1L12 22.4l8.8-8.8a5 5 0 000-7.1z"/></svg>',
      people:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
      spark:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>',
      compass:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-2 5-5 2 2-5 5-2z"/></svg>',
      tasks:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    };
    return icons[name] || icons.people;
  }

  function renderProfileCard(member, options) {
    options = options || {};
    var photo = committeePhotoPath(member.photo);
    var bio = member.bio ? String(member.bio).trim() : "";
    var role = member.designation ? String(member.designation).trim() : "";
    var showContact = options.showContact === true;
    var delayClass = options.delayClass || "";
    var visibleClass = options.startVisible ? " is-visible" : "";

    return (
      '<article class="profile-card reveal' +
      visibleClass +
      (delayClass ? " " + delayClass : "") +
      '">' +
      '<div class="profile-card__photo-wrap">' +
      '<img class="profile-card__photo" src="' +
      escapeHtml(photo) +
      '" alt="Portrait of ' +
      escapeHtml(member.name) +
      '" width="180" height="180" loading="lazy" data-committee-photo />' +
      "</div>" +
      '<h3 class="profile-card__name">' +
      escapeHtml(member.name) +
      "</h3>" +
      (role
        ? '<p class="profile-card__role">' + escapeHtml(role) + "</p>"
        : '<p class="profile-card__role"></p>') +
      (bio
        ? '<p class="profile-card__bio">' + escapeHtml(bio) + "</p>"
        : '<p class="profile-card__bio"></p>') +
      (showContact
        ? '<div class="profile-card__contact">' +
          (member.email
            ? '<a class="icon-btn" href="mailto:' +
              escapeHtml(member.email) +
              '" aria-label="Email ' +
              escapeHtml(member.name) +
              '">' +
              ICONS.mail +
              "</a>"
            : "") +
          (member.phone
            ? '<a class="icon-btn" href="tel:' +
              escapeHtml(String(member.phone).replace(/\s/g, "")) +
              '" aria-label="Call ' +
              escapeHtml(member.name) +
              '">' +
              ICONS.phone +
              "</a>"
            : "") +
          "</div>"
        : "") +
      "</article>"
    );
  }

  function bindCommitteePhotoFallbacks(root) {
    var fallback = "assets/images/committee/default.png";
    qsa("[data-committee-photo]", root || document).forEach(function (img) {
      function applyFallback() {
        if (img.getAttribute("src") !== fallback) {
          img.src = fallback;
        }
      }
      img.addEventListener("error", applyFallback);
      // Handle cached 404s that fire before the listener is attached
      if (
        img.complete &&
        img.naturalWidth === 0 &&
        img.getAttribute("src") !== fallback
      ) {
        applyFallback();
      }
    });
  }

  function flattenCommitteeMembers(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    var members = [];
    (data.sections || []).forEach(function (section) {
      if (section.members) {
        section.members.forEach(function (m) {
          members.push(m);
        });
      }
      if (section.groups) {
        section.groups.forEach(function (group) {
          (group.members || []).forEach(function (m) {
            members.push(m);
          });
        });
      }
    });
    return members;
  }

  function renderCommitteeSection(section, index) {
    var icon = sectionIcon(section.icon);
    var html =
      '<section class="committee-section" id="' +
      escapeHtml(section.id) +
      '" aria-labelledby="' +
      escapeHtml(section.id) +
      '-title">' +
      '<div class="container">' +
      '<header class="committee-section__header reveal is-visible">' +
      '<div class="committee-section__icon" aria-hidden="true">' +
      icon +
      "</div>" +
      '<h2 class="committee-section__title" id="' +
      escapeHtml(section.id) +
      '-title">' +
      escapeHtml(section.title) +
      "</h2>" +
      '<div class="committee-section__divider" aria-hidden="true"></div>' +
      (section.description
        ? '<p class="committee-section__desc">' +
          escapeHtml(section.description) +
          "</p>"
        : "") +
      "</header>";

    if (section.groups && section.groups.length) {
      section.groups.forEach(function (group) {
        html +=
          '<div class="committee-group">' +
          '<h3 class="committee-group__title reveal is-visible">' +
          escapeHtml(group.title) +
          "</h3>" +
          '<div class="committee-grid">' +
          (group.members || [])
            .map(function (member, i) {
              return renderProfileCard(member, {
                delayClass: "reveal-delay-" + ((i % 5) + 1),
                startVisible: true,
              });
            })
            .join("") +
          "</div></div>";
      });
    } else {
      html +=
        '<div class="committee-grid">' +
        (section.members || [])
          .map(function (member, i) {
            return renderProfileCard(member, {
              delayClass: "reveal-delay-" + ((i % 5) + 1),
              startVisible: true,
            });
          })
          .join("") +
        "</div>";
    }

    html += "</div></section>";
    return html;
  }

  function renderTestimonial(item) {
    return (
      '<div class="testimonial-slide" role="group" aria-label="Testimonial">' +
      '<blockquote class="testimonial-card">' +
      '<p class="testimonial-card__quote">' +
      escapeHtml(item.quote) +
      "</p>" +
      '<footer class="testimonial-card__author">' +
      '<img class="testimonial-card__avatar" src="' +
      escapeHtml(item.avatar) +
      '" alt="" width="56" height="56" loading="lazy" />' +
      "<div><div class=\"testimonial-card__name\">" +
      escapeHtml(item.name) +
      '</div><div class="testimonial-card__role">' +
      escapeHtml(item.role) +
      "</div></div></footer></blockquote></div>"
    );
  }

  /* ---------- Page inits ---------- */

  async function initHome() {
    const [events, news, gallery, committee, testimonials] = await Promise.all([
      loadJSON("data/events.json"),
      loadJSON("data/news.json"),
      loadJSON("data/gallery.json"),
      loadJSON("data/committee.json"),
      loadJSON("data/testimonials.json"),
    ]);

    const eventsMount = qs("[data-home-events]");
    if (eventsMount && events) {
      const upcoming = events
        .filter(function (e) {
          return e.status === "upcoming";
        })
        .slice(0, 3);
      eventsMount.innerHTML = upcoming.map(renderEventCard).join("");
    }

    const newsMount = qs("[data-home-news]");
    if (newsMount && news) {
      newsMount.innerHTML = news
        .slice(0, 3)
        .map(function (n) {
          return renderNewsCard(n, false);
        })
        .join("");
    }

    const galleryMount = qs("[data-home-gallery]");
    if (galleryMount && gallery) {
      galleryMount.innerHTML = gallery
        .slice(0, 6)
        .map(function (item) {
          return (
            '<figure class="gallery-item reveal" data-gallery-item tabindex="0" role="button" data-category="' +
            escapeHtml(item.category) +
            '" data-caption="' +
            escapeHtml(item.title) +
            '" data-full="' +
            escapeHtml(item.image) +
            '">' +
            '<img src="' +
            escapeHtml(item.image) +
            '" alt="' +
            escapeHtml(item.alt || item.title) +
            '" loading="lazy" width="600" height="400" />' +
            '<figcaption class="gallery-item__overlay"><span class="gallery-item__title">' +
            escapeHtml(item.title) +
            "</span></figcaption></figure>"
          );
        })
        .join("");
      if (window.TMWSGallery) {
        const api = window.TMWSGallery.initLightbox();
        window.TMWSGallery.initFilters(api);
      }
    }

    const committeeMount = qs("[data-home-committee]");
    if (committeeMount && committee) {
      const featured = flattenCommitteeMembers(committee)
        .filter(function (m) {
          return m.featured;
        })
        .slice(0, 5);
      committeeMount.innerHTML = featured
        .map(function (m, i) {
          return renderProfileCard(m, {
            delayClass: "reveal-delay-" + ((i % 5) + 1),
          });
        })
        .join("");
      bindCommitteePhotoFallbacks(committeeMount);
    }

    const testiMount = qs("[data-home-testimonials]");
    if (testiMount && testimonials) {
      testiMount.innerHTML = testimonials.map(renderTestimonial).join("");
    }
  }

  async function initCommitteePage() {
    const directory = qs("[data-committee-directory]");
    if (!directory) return false;

    try {
      const data = await loadJSON("data/committee.json");

      if (!data || !Array.isArray(data.sections) || !data.sections.length) {
        directory.innerHTML =
          '<div class="container">' +
          '<div class="committee-error" role="alert">' +
          "<h2>Unable to load the committee directory</h2>" +
          "<p>We could not load committee data right now. Please refresh the page, or try again in a moment.</p>" +
          '<a class="btn btn--primary" href="committee.html">Retry</a>' +
          "</div></div>";
        return false;
      }

      const intro = qs("[data-committee-intro]");
      if (intro && data.pageIntro) {
        intro.textContent = data.pageIntro;
      }

      const jump = qs("[data-committee-jump]");
      if (jump) {
        jump.innerHTML = data.sections
          .map(function (section) {
            return (
              '<a class="committee-jump" href="#' +
              escapeHtml(section.id) +
              '">' +
              escapeHtml(section.title) +
              "</a>"
            );
          })
          .join("");
      }

      directory.innerHTML = data.sections
        .map(function (section, index) {
          return renderCommitteeSection(section, index);
        })
        .join("");

      bindCommitteePhotoFallbacks(directory);
      return true;
    } catch (err) {
      console.warn("[TMWS] Committee render failed:", err);
      directory.innerHTML =
        '<div class="container">' +
        '<div class="committee-error" role="alert">' +
        "<h2>Something went wrong</h2>" +
        "<p>The committee directory could not be displayed. Please refresh the page.</p>" +
        '<a class="btn btn--primary" href="committee.html">Retry</a>' +
        "</div></div>";
      return false;
    }
  }

  async function initEventsPage() {
    const upcomingMount = qs("[data-events-upcoming]");
    const pastMount = qs("[data-events-past]");
    const calendarMount = qs("[data-events-calendar]");
    const searchInput = qs("[data-events-search]");
    const filterBtns = qsa("[data-events-filter]");
    if (!upcomingMount && !pastMount) return;

    const data = await loadJSON("data/events.json");
    if (!data) return;

    let activeFilter = "all";
    let query = "";

    function filtered(status) {
      return data.filter(function (e) {
        const matchStatus = e.status === status;
        const matchFilter =
          activeFilter === "all" || e.category === activeFilter;
        const hay = (e.title + " " + e.location + " " + e.summary).toLowerCase();
        const matchSearch = !query || hay.indexOf(query) !== -1;
        return matchStatus && matchFilter && matchSearch;
      });
    }

    function render() {
      const upcoming = filtered("upcoming");
      const past = filtered("past");
      if (upcomingMount) {
        upcomingMount.innerHTML = upcoming.length
          ? upcoming.map(renderEventCard).join("")
          : '<p class="text-muted text-center">No upcoming events found.</p>';
      }
      if (pastMount) {
        pastMount.innerHTML = past.length
          ? past.map(renderEventCard).join("")
          : '<p class="text-muted text-center">No past events found.</p>';
      }
      if (calendarMount) {
        const all = upcoming.concat(past);
        calendarMount.innerHTML = all
          .map(function (e) {
            const parts = dateParts(e.date);
            return (
              '<div class="calendar-row" id="' +
              escapeHtml(e.id) +
              '">' +
              '<div class="calendar-row__date"><span class="day">' +
              parts.day +
              '</span><span class="month">' +
              parts.month +
              "</span></div>" +
              "<div><h3 class=\"calendar-row__title\">" +
              escapeHtml(e.title) +
              '</h3><p class="calendar-row__meta">' +
              escapeHtml(e.location) +
              " · " +
              escapeHtml(e.category) +
              "</p></div>" +
              '<span class="badge ' +
              (e.status === "upcoming" ? "" : "badge--muted") +
              '">' +
              escapeHtml(e.status) +
              "</span></div>"
            );
          })
          .join("");
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        activeFilter = btn.getAttribute("data-events-filter") || "all";
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        query = searchInput.value.trim().toLowerCase();
        render();
      });
    }

    render();
  }

  async function initGalleryPage() {
    const data = await loadJSON("data/gallery.json");
    if (!data || !window.TMWSGallery) return;
    window.TMWSGallery.renderGalleryFromData(data);
    const api = window.TMWSGallery.initLightbox();
    window.TMWSGallery.initFilters(api);
  }

  async function initNewsPage() {
    const featuredMount = qs("[data-news-featured]");
    const listMount = qs("[data-news-list]");
    if (!featuredMount && !listMount) return;
    const data = await loadJSON("data/news.json");
    if (!data || !data.length) return;

    if (featuredMount) {
      featuredMount.innerHTML = renderNewsCard(data[0], true);
    }
    if (listMount) {
      listMount.innerHTML = data
        .slice(1)
        .map(function (n) {
          return renderNewsCard(n, false);
        })
        .join("");
    }
  }

  function initContactForm() {
    const form = qs("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const status = qs("[data-form-status]", form);
      const data = new FormData(form);
      const name = data.get("name") || "";
      const subject = data.get("subject") || "TMWS Contact";
      const message = data.get("message") || "";
      const email = data.get("email") || "";
      const body =
        "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      window.location.href =
        "mailto:" +
        SITE.email +
        "?subject=" +
        encodeURIComponent(String(subject)) +
        "&body=" +
        encodeURIComponent(body);
      if (status) {
        status.textContent =
          "Opening your email client… If nothing opens, write to " + SITE.email;
      }
      form.reset();
    });
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute("data-page") || "";
    const transparent = page === "home";

    renderHeader({ transparent: transparent });
    renderFooter();

    if (window.TMWSNavigation) {
      window.TMWSNavigation.init();
    }

    // Re-bind theme toggles after header inject
    if (window.TMWSTheme) {
      qsa("[data-theme-toggle]").forEach(function (btn) {
        btn.addEventListener("click", window.TMWSTheme.toggleTheme);
      });
    }

    if (window.TMWSAnimations) {
      window.TMWSAnimations.initBackToTop();
      window.TMWSAnimations.initFaq();
      window.TMWSAnimations.initLazyImages();
    }

    function revealAfterData() {
      if (window.TMWSAnimations) {
        window.TMWSAnimations.initReveal();
      }
    }

    switch (page) {
      case "home":
        // Show static hero reveals immediately; refresh after async data mounts
        revealAfterData();
        initHome()
          .then(function () {
            revealAfterData();
            if (window.TMWSAnimations) {
              window.TMWSAnimations.initTestimonials();
            }
            bindCommitteePhotoFallbacks(document);
          })
          .catch(function (err) {
            console.warn("[TMWS] Home init failed:", err);
            revealAfterData();
          });
        break;
      case "committee":
        revealAfterData();
        initCommitteePage()
          .then(function () {
            revealAfterData();
          })
          .catch(function (err) {
            console.warn("[TMWS] Committee init failed:", err);
            revealAfterData();
          });
        break;
      case "events":
        revealAfterData();
        initEventsPage()
          .then(revealAfterData)
          .catch(function () {
            revealAfterData();
          });
        break;
      case "gallery":
        revealAfterData();
        initGalleryPage()
          .then(revealAfterData)
          .catch(function () {
            revealAfterData();
          });
        break;
      case "news":
        revealAfterData();
        initNewsPage()
          .then(revealAfterData)
          .catch(function () {
            revealAfterData();
          });
        break;
      case "contact":
        initContactForm();
        revealAfterData();
        break;
      default:
        revealAfterData();
        break;
    }
  });

  window.TMWS = {
    SITE: SITE,
    loadJSON: loadJSON,
    ICONS: ICONS,
  };
})();
