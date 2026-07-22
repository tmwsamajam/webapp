# Tambaram Malayalee Welfare Samajam (TMWS)

Premium static website for **Tambaram Malayalee Welfare Samajam** — built with HTML5, CSS3, and vanilla JavaScript for GitHub Pages.

## Live site

After enabling GitHub Pages on the `main` branch (root), the site will be available at:

`https://tmwsamajam.github.io/webapp/`

## Stack

- HTML5 semantic pages
- Modular CSS design system (`assets/css/`)
- Vanilla JS modules (`assets/js/`)
- JSON-driven content (`data/`)
- No frameworks, no build tools, no backend

## Structure

```
├── *.html                 # Site pages
├── assets/css/            # Design system
├── assets/js/             # Interaction modules
├── assets/images/         # Logo, heroes, placeholders
├── assets/documents/      # Downloadable files
├── data/                  # committee, events, gallery, news, testimonials
├── robots.txt
├── sitemap.xml
└── favicon.ico
```

## Updating content

Edit JSON files in `data/` to update committee profiles, events, gallery images, news, and testimonials without changing page layouts.

Replace SVG placeholders in `assets/images/` with photography when available. Replace text stubs in `assets/documents/` with official PDFs.

## Local preview

Because pages fetch JSON via `fetch()`, serve the folder over HTTP:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then open `http://localhost:8080`.

## Features

- Sticky glass navigation with mobile menu
- Dark mode (persisted)
- Scroll animations, counters, lightbox gallery
- Event search & filters
- Contact form (mailto)
- Floating WhatsApp & back-to-top
- SEO meta tags, Open Graph, JSON-LD, sitemap

## License

Content © Tambaram Malayalee Welfare Samajam. All rights reserved.
