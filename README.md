# Writing Portfolio — Akshat Singh

A curated personal portfolio showcasing professional SEO content work and personal writing. Built as a static site with [Eleventy (11ty)](https://www.11ty.dev/) and deployed on [GitHub Pages](https://pages.github.com/).

**Live:** [infamous-lucifer.github.io/writing-portfolio](https://infamous-lucifer.github.io/writing-portfolio/)

---

## Overview

This site serves as a dual-purpose portfolio:

- **Work** — Professional SEO content pieces spanning Cybersecurity, Healthcare, Legal, ESL/Immigration, eCommerce, and Dive Tourism sectors. Data is fetched dynamically from a Google Sheets API and rendered as filterable swim-lanes.
- **Writing** — 37 personal pieces (blogs, poems, essays, and prose) originally published on [Medium](https://medium.com/@bikshat062), now self-hosted with full creative control.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Static Site Generator | [Eleventy 3.x](https://www.11ty.dev/) |
| Templating | [Liquid](https://liquidjs.com/) |
| Styling | Vanilla CSS with CSS custom properties (dark/light theme) |
| Typography | Cormorant Garamond · Plus Jakarta Sans · IBM Plex Mono (Google Fonts) |
| Work Data | Google Apps Script API → client-side fetch |
| Analytics | Google Analytics 4 · Microsoft Clarity |
| Deployment | GitHub Pages (via `gh-pages` branch or Actions) |
| Package Manager | npm |

## Features

- **Dark / Light theme** with instant toggle and `localStorage` persistence
- **Responsive bento-grid layout** with featured card spanning and reveal-on-scroll animations
- **Dynamic homepage integration** — automatically syncs the latest writing via Eleventy collections and the latest SEO work via Google Sheets API fetch
- **Filter system** — filter work by industry and content type; filter writing by category (Blogs, Poems, Prose)
- **SEO-first** — structured data (JSON-LD), Open Graph tags, canonical URLs, and semantic HTML throughout
- **Cookie consent** — GDPR-style floating toast banner
- **Reading experience** — elegant drop-cap typography, responsive reader layout, category tagging, and **Prism.js** syntax highlighting for technical blogs (like the breakdown of [The Lens](https://github.com/infamous-lucifer/the-lens))

## Project Structure

```
writing-portfolio/
├── _includes/
│   ├── layout.liquid        # Base HTML layout (nav, footer, cookie banner, scripts)
│   └── post.liquid          # Blog post reader template
├── css/
│   └── style.css            # Complete design system (tokens, components, responsive)
├── posts/                   # Markdown/HTML blog posts with YAML frontmatter
│   ├── keep-walking.md
│   ├── through-the-glass-alone.md
│   └── ...                  # 37 posts total
├── index.liquid             # Homepage with featured cards
├── writing.liquid           # Writing hub with category filter tabs
├── work.liquid              # Professional work portfolio (API-driven)
├── about.liquid             # About page
├── privacy.liquid           # Privacy policy
├── terms.liquid             # Terms of service
├── 404.liquid               # Custom 404 page
├── .eleventy.js             # Eleventy configuration
├── package.json             # Dependencies and scripts
└── README.md
```

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/infamous-lucifer/writing-portfolio.git
cd writing-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:8080/writing-portfolio/`.

### Build for Production

```bash
npm run build
```

Output is generated in the `_site/` directory.

## Deployment

The site is configured to deploy to GitHub Pages under the `/writing-portfolio/` path prefix. Push to the `main` branch and configure GitHub Pages to serve from the root or use a GitHub Actions workflow.

## Design System

The CSS uses a token-based design system with CSS custom properties:

- **Colors** — Semantic tokens (`--bg`, `--txt`, `--acc`, `--grn`, `--blu`, `--red`) with surface and transparency variants
- **Typography** — Three-font stack: serif headings (Cormorant Garamond), sans-serif body (Plus Jakarta Sans), monospace labels (IBM Plex Mono)
- **Spacing** — Consistent padding and margin using component-level conventions
- **Components** — Cards, badges, buttons, stat counters, inline select dropdowns, and animated reveals

## Author

**Akshat Singh**  
SEO Content Strategist  

- [LinkedIn](https://www.linkedin.com/in/akshat-singh-60695b313/)
- [Medium](https://medium.com/@bikshat062)
- [GitHub](https://github.com/infamous-lucifer)
- Email: akshatsingh666@gmail.com

## License

This project is licensed under the [MIT License](LICENSE).