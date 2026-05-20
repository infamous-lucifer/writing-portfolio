# Editorial Writing Portfolio

A premium, bespoke digital publication and portfolio built with **Eleventy (11ty)**, featuring a modern **Editorial Horizon** design language. This site showcases a professional writing matrix (expert blogs, technical copy, and service pages) synced dynamically with a Google Sheets database, alongside a collection of personal essays, blogs, and poetry.

🌐 **Live Demo**: [infamous-lucifer.github.io/writing-portfolio](https://infamous-lucifer.github.io/writing-portfolio/)

---

## 🎨 Design Philosophy: *Editorial Horizon*

The site moves away from generic, boxy SaaS layouts to embrace a high-end literary aesthetic:
* **Typography**: Paired serif headings/body copy (**Cormorant Garamond**) with clean, contemporary sans-serif details (**Plus Jakarta Sans**), and strict numbers/metrics (**IBM Plex Mono**).
* **Bento Grid Layout**: Organically structured homepage and list grids that use CSS Grid with `grid-auto-flow: dense` to automatically pack card shapes with no gaps, ensuring a balanced grid rhythm.
* **Color System**: Dark-first palettes featuring midnight obsidian (`#080a09`) card containers, gold/champagne (`#dfba73`) highlight accents, and translucent backdrop blurs for a high-contrast, premium paper-like depth.
* **Reader Mode**: Distraction-free, centered column widths (760px), optimal line heights (`1.85`), and a classic magazine-style drop-cap styling for the first letter of each post.

---

## 🚀 Key Features

* **Dynamic Work Matrix**: Fetches and filters 116+ professional content assets across multiple sectors (Healthcare, Cybersecurity, Legal, ESL, eCommerce) dynamically from a secure Google Apps Script Sheets API.
* **Writing Hub**: Includes a responsive search engine and dynamic tab filtration (All, Blogs, Poems, Prose) sorting through 34 personal pieces instantly.
* **Performant SSG**: Compiled with Eleventy for near-zero runtime overhead, high Core Web Vitals, and lightning-fast loading speeds.
* **Fully Semantic & SEO Optimized**: Includes JSON-LD schema markup, OpenGraph tags, unique element identifiers, and auto-generated XML sitemaps.
* **Seamless Consent Flow**: Features a modern, non-intrusive floating cookie consent toast with translucent glass styling and smooth keyframe animation.

---

## 🛠️ Technology Stack

* **SSG**: Eleventy (11ty) v3
* **Templating**: Liquid
* **Styles**: Vanilla CSS (Custom Variables, Flexbox, Grid)
* **Hosting**: GitHub Pages
* **Deployment**: GitHub Actions (CI/CD)
* **Integration**: Custom Apps Script REST API for Google Sheets content ingestion

---

## 📁 Directory Structure

```text
├── .eleventy.js         # Eleventy SSG configuration
├── package.json         # Scripts and package dependencies
├── sitemap.xml.liquid   # Dynamic sitemap template
├── _includes/           # Reusable layout templates
│   ├── layout.liquid    # Global document wrapper & navigation
│   └── post.liquid      # Distraction-free editorial reader layout
├── css/
│   └── style.css        # Typography, grid variables & styling system
├── posts/               # Personal blogs and writing source files (.md)
├── about.liquid         # About page
├── work.liquid          # Work filter matrix script and layout
├── writing.liquid       # Writing hub listing page
└── _site/               # Auto-compiled static assets output (generated)
```

---

## 💻 Local Development Setup

### Prerequisites

Ensure you have **Node.js** (v18+) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/infamous-lucifer/writing-portfolio.git
   cd writing-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To compile the site and spin up a hot-reloading development server:
```bash
npm run dev
```
The site will be available at `http://localhost:8080/writing-portfolio/`.

### Production Build

To clean previous builds and compile static assets to the `./_site` folder:
```bash
npm run build
```

---

## 📦 Deployment

This project uses **GitHub Actions** for CI/CD. When you push changes to the `main` branch, the workflow:
1. Installs dependencies.
2. Compiles static files via Eleventy.
3. Automatically deploys the build folder (`_site`) to the `gh-pages` branch for hosting.

See the configuration file in `.github/workflows/` for execution details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.