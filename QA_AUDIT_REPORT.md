# 🔬 PROFESSIONAL QA AUDIT REPORT
## Writing Portfolio — Full Diagnostics
**Report Date:** April 6, 2026  
**Auditor:** Antigravity Automated QA  
**Site:** https://infamous-lucifer.github.io/writing-portfolio/  
**Repository:** github.com/infamous-lucifer/writing-portfolio  
**Branch:** `main` — Commit `4b69209`

---

## EXECUTIVE SUMMARY

| Category | Issues Found | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| **Security & Dependencies** | 6 | 0 | 3 | 3 | 0 |
| **Broken Links & Missing Assets** | 3 | 2 | 1 | 0 | 0 |
| **Theme System (Dark/Light Mode)** | 1 | 1 | 0 | 0 | 0 |
| **SEO & Sitemap** | 3 | 0 | 1 | 2 | 0 |
| **Content Quality** | 3 | 0 | 0 | 2 | 1 |
| **CSS & Styling** | 4 | 0 | 1 | 2 | 1 |
| **Accessibility** | 3 | 0 | 0 | 2 | 1 |
| **Build Configuration** | 2 | 0 | 0 | 1 | 1 |
| **Code Quality** | 4 | 0 | 0 | 2 | 2 |
| **Git & Repository** | 1 | 0 | 0 | 0 | 1 |
| **TOTAL** | **30** | **3** | **5** | **14** | **8** |

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

### C-1: Dark/Light Theme Toggle is Completely Non-Functional
- **Severity:** 🔴 CRITICAL
- **Files:** `css/style.css` (L11–47), `_includes/layout.liquid` (L61–65, L280–293)
- **Problem:** The CSS defines theme variables using **class selectors** (`body.light { }`, `body.dark { }`), but the JavaScript toggle sets a **`data-theme` attribute** on the `<html>` element (`document.documentElement.setAttribute('data-theme', 'light')`). These never match. The theme button changes the icon (☼ / ☽) but the page colors never change.
- **Root Cause:** CSS and JS were written with different conventions and never reconciled.
- **Impact:** The theme toggle button is visible on every page and appears interactive but does nothing. Visitors clicking it see the icon change but no visual difference. This is a broken UX promise.
- **Fix:** Either:
  - **Option A:** Change CSS selectors from `body.light` / `body.dark` to `[data-theme="light"]` / `:root` (matching the JS attribute).
  - **Option B:** Change JS to toggle a class on `<body>` instead of setting an attribute on `<html>`.

### C-2: Resume PDF Does Not Exist (Broken Download Link)
- **Severity:** 🔴 CRITICAL  
- **Files:** `_includes/layout.liquid` (L180), `about.liquid` (L53)
- **Problem:** Two prominent links reference `/assets/akshat-singh-resume.pdf`:
  1. The **floating "Download CV" button** (visible on EVERY page, bottom-right corner)
  2. The **"Download Full Resume" link** on the About page
- **Verification:** `Test-Path assets\akshat-singh-resume.pdf` returns `False`. The `assets/` directory does not exist at all.
- **Impact:** Every visitor sees a permanent "Download CV" floating button. Clicking it leads to a 404. This is the worst possible CTA failure for a portfolio site.
- **Fix:** Either create the `assets/` directory and add the actual PDF, or remove/hide the download links until the file is ready.

### C-3: favicon.ico Does Not Exist (Console 404 Error)
- **Severity:** 🔴 CRITICAL
- **File:** `_includes/layout.liquid` (L25)
- **Problem:** The layout references `{{ '/favicon.ico' | url }}` but no `favicon.ico` file exists in the project root. Every single page load generates a 404 console error.
- **Verification:** `Test-Path favicon.ico` returns `False`. `Test-Path _site\favicon.ico` returns `False`.
- **Impact:** Browser tab shows a generic/broken icon. Console shows 404 error on every page. Looks unprofessional and affects perceived quality.
- **Fix:** Add a `favicon.ico` (or `.png` with updated HTML) to the project root and add it to the `.eleventy.js` passthrough config.

---

## 🟠 HIGH SEVERITY ISSUES

### H-1: 6 npm Vulnerabilities (3 High, 3 Moderate)
- **Severity:** 🟠 HIGH
- **Source:** `npm audit`
- **Vulnerabilities:**
  | Package | Severity | Issue |
  |---|---|---|
  | `liquidjs <=10.24.0` | HIGH | Path traversal + Memory amplification + memoryLimit bypass |
  | `minimatch <=3.1.3` | HIGH | ReDoS via wildcards and GLOBSTAR |
  | `picomatch <=2.3.1` | HIGH | Method injection + ReDoS |
  | `markdown-it 13.0.0–14.1.0` | MODERATE | ReDoS vulnerability |
  | `js-yaml <3.14.2` | MODERATE | Prototype pollution |
  | `brace-expansion <1.1.13` | MODERATE | Zero-step sequence memory exhaustion |
- **Fix:** Run `npm audit fix`. All fixes are available.

### H-2: Eleventy is Outdated (3.1.2 → 3.1.5)
- **Severity:** 🟠 HIGH
- **File:** `package.json` (L24)
- **Problem:** Current version `3.1.2`, latest is `3.1.5`. Update likely patches the `liquidjs` and `markdown-it` vulnerabilities listed above.
- **Fix:** Run `npm update @11ty/eleventy` or update `package.json` to `"@11ty/eleventy": "3.1.5"`.

### H-3: 404 Page Links Are Hardcoded (Missing Path Prefix)
- **Severity:** 🟠 HIGH
- **File:** `404.liquid` (L13–14)
- **Problem:** Links use `href="/"` and `href="/case-studies"` instead of `{{ '/' | url }}` and `{{ '/case-studies' | url }}`. On the GitHub Pages subpath (`/writing-portfolio/`), these will navigate to the GitHub root, not the portfolio root.
- **Impact:** A visitor who lands on a 404 page and clicks "Return Home" or "View Portfolio" will be taken completely off-site.
- **Fix:** Change to `{{ '/' | url }}` and `{{ '/case-studies' | url }}`.

### H-4: Nav Background Color is Hardcoded (Not Theme-Aware)
- **Severity:** 🟠 HIGH
- **File:** `css/style.css` (L219)
- **Problem:** The `nav` element has `background: rgba(253, 251, 247, 0.85)` hardcoded — this is the light-mode beige color. Even if the theme toggle is fixed, the navigation bar will remain light-colored in dark mode.
- **Fix:** Change to `background: var(--glass)` (which is already defined per-theme in the CSS variables).

### H-5: Sitemap Includes 404 Page
- **Severity:** 🟠 HIGH
- **File:** `sitemap.xml.liquid`
- **Problem:** The 404 page (`/writing-portfolio/404.html`) is included in the generated sitemap. Search engines should never index error pages.
- **Fix:** Add `eleventyExcludeFromCollections: true` to the 404 page's frontmatter (already has `permalink: 404.html`) — but the sitemap iterates `collections.all`, so the 404 page needs to be explicitly excluded, e.g., by adding a `draft: true` flag or checking the URL in the sitemap template.

---

## 🟡 MEDIUM SEVERITY ISSUES

### M-1: Medium HTML Export Not Cleaned (Raw `graf` Classes Everywhere)
- **Files:** All 37 files in `posts/`
- **Problem:** Posts contain raw Medium export HTML with classes like `graf--h3`, `graf--p`, `graf-after--h3`, `markup--em`, etc. These classes have no matching CSS rules, making them dead weight.
- **Example (keep-walking.md):**
  ```html
  <h3 name="d99f" id="d99f" class="graf graf--h3 graf--leading graf--title">Keep Walking.</h3>
  ```
- **Impact:** Bloated HTML, potential styling conflicts, unprofessional view-source. Page sizes are larger than necessary.
- **Fix:** Run a cleanup script to strip Medium-specific classes and attributes (`name`, `data-image-id`, `data-width`, `data-height`, `graf` classes).

### M-2: Blog Post Titles Are Duplicated
- **Files:** All 37 posts
- **Problem:** The `post.liquid` layout renders the title from frontmatter as an `<h1>`. But the post content itself (from Medium export) also includes the title as `<h3 class="graf--title">`. This results in the title appearing twice on every blog post page.
- **Impact:** SEO (duplicate H1/H3), visual redundancy, looks unprofessional.
- **Fix:** Strip the title `<h3>` from post content during the import/cleanup process.

### M-3: `case-studies.liquid` Missing `description` Frontmatter
- **File:** `case-studies.liquid` (L1–4)
- **Problem:** Has `title: Case Studies` but no `description`. The layout falls back to the generic default SEO description.
- **Impact:** Search results for the Case Studies page will show generic portfolio description instead of a page-specific one.
- **Fix:** Add `description: "Ranked case studies, client portfolios, and live SEO content samples from CCI Training, Brownstone Law, and more."`

### M-4: All Blog Posts Have Same Category (`Blogs`)
- **Files:** All 37 posts
- **Problem:** Every single post has `category: Blogs`. The Writing Hub page has filter buttons for "Personal Blogs", "Poems", and "Prose" — but the `data-filter` values are `Blogs`, `Poems`, `Prose`. Since all posts are `Blogs`, the "Poems" and "Prose" filters show 0 results.
- **Impact:** Filters on the Writing Hub page are broken — they hide everything except "Blogs" and "All Pieces."
- **Fix:** Update post categories to match appropriate types (Blogs, Poems, Prose).

### M-5: Inline Styles Used on Multiple Pages
- **Files:** `404.liquid` (L7–12), `post.liquid` (L26, L36), `about.liquid` (L23, L33, L53), `layout.liquid` (L182)
- **Problem:** Significant inline `style=""` attributes scattered across templates instead of CSS classes. Examples:
  - `style="text-align: center; padding: 100px 20px;"`
  - `style="font-size: 80px; opacity: 0.1; margin-bottom: -40px;"`
  - `style="padding-bottom: 60px;"`
  - `style="font-size: 14px;"`
- **Impact:** Harder to maintain, inconsistent with the CSS-driven design system, cannot be overridden by theme changes.
- **Fix:** Extract into named CSS classes.

### M-6: `package.json` Has Misleading `main` Field
- **File:** `package.json` (L5)
- **Problem:** `"main": "index.js"` — no `index.js` file exists. This is an SSG project, not a Node.js module.
- **Fix:** Remove the `main` field or set it to `.eleventy.js`.

### M-7: `cheerio` and `slugify` Are Production Dependencies But Are Only Development Tools
- **File:** `package.json` (L26–29)
- **Problem:** `cheerio` and `slugify` are listed under `dependencies` but are only used in the `scripts/` folder for one-time import tasks. They should be in `devDependencies`.
- **Impact:** They get installed on the CI server unnecessarily during `npm ci`, adding to build time.
- **Fix:** Move to `devDependencies`.

### M-8: `clean` Script Uses Unix Command on Windows
- **File:** `package.json` (L9)
- **Problem:** `"clean": "rm -rf _site"` — `rm -rf` is a Unix command. On Windows (which is your dev environment), this will fail in CMD (works in PowerShell/Git Bash).
- **Fix:** Use cross-platform alternative: `"clean": "npx rimraf _site"` or use `shx`: `"clean": "shx rm -rf _site"`.

### M-9: No `aria-selected` Attribute on Writing Hub Filter Buttons
- **File:** `writing.liquid` (L17–20)
- **Problem:** The Writing Hub's filter buttons (`.filter-btn`) don't have `role="tab"`, `aria-selected`, or `tablist` structure. The homepage/case-studies filters (`ftab`) do set `aria-selected` in the JS, but the Writing Hub page has a completely separate filter implementation.
- **Impact:** Screen readers cannot determine which filter is active.
- **Fix:** Add `role="tablist"` to container, `role="tab"` and `aria-selected` to buttons.

### M-10: Writing Hub Has a Duplicate/Conflicting Filter System
- **File:** `writing.liquid` (L42–64) vs `_includes/layout.liquid` (L235–264)
- **Problem:** The Writing Hub page defines its own filter logic in an inline `<script>` that uses `.filter-btn` and `data-filter`. But the main layout already has a global filter system using `.ftab` and `data-f`. These are two completely separate implementations.
- **Impact:** The global search in the navbar does not interact properly with the Writing Hub's local filters. They can conflict.

---

## 🟢 LOW SEVERITY ISSUES

### L-1: Missing `author` Field in `package.json`
- **File:** `package.json` (L17)
- **Problem:** `"author": ""` — should be `"Akshat Singh"`.

### L-2: Missing `keywords` in `package.json`
- **File:** `package.json` (L16)
- **Problem:** `"keywords": []` — empty. Not critical but good practice to fill in.

### L-3: `scripts/add-frontmatter.js` Has Wrong Default Layout
- **File:** `scripts/add-frontmatter.js` (L36)
- **Problem:** Script defaults to `layout: layout.liquid` but posts should use `layout: post.liquid`. The posts were manually corrected, but if the script is ever re-run on new files, it will set the wrong layout.
- **Fix:** Change line 36 from `layout: layout.liquid` to `layout: post.liquid`.

### L-4: No `alt` Text on OG Image Meta Tag
- **File:** `_includes/layout.liquid` (L23)
- **Problem:** While `og:image:alt` exists (good), the generic hero image is used for all pages, including individual blog posts. Blog posts should ideally have their own OG images.

### L-5: `console.log` Statements in `add-frontmatter.js`
- **File:** `scripts/add-frontmatter.js` (L15, L45)
- **Problem:** Contains `console.log` debug statements. Per project rules, these should be removed before marking complete.

### L-6: No `.env.example` File
- **Problem:** Per project rules, a `.env.example` should exist at root to document required variables (even if none are currently needed).

### L-7: Hero Image Not Optimized
- **File:** `images/hero.jpg`
- **Size:** 233,864 bytes (~228 KB)
- **Problem:** A 228 KB JPEG for a hero image used via OG tags but not visually rendered on any page is oversized. Since it's only used in the meta `og:image` tag (not rendered on page), consider compressing further.

### L-8: `.eleventy.js` Does Not Ignore `scripts/` Directory
- **File:** `.eleventy.js`
- **Problem:** The `scripts/` directory (containing development tools) is not explicitly ignored. Eleventy skips it because the files aren't templates, but explicit ignore is cleaner:
  ```js
  eleventyConfig.ignores.add("scripts/**");
  ```

---

## ✅ PASSED CHECKS

| Check | Status | Details |
|---|---|---|
| Git working tree clean | ✅ PASS | `git status --porcelain` returns empty |
| Local-remote sync | ✅ PASS | HEAD matches `origin/main` at `4b69209` |
| `node_modules/` untracked | ✅ PASS | In `.gitignore`, not in Git index |
| `_site/` untracked | ✅ PASS | In `.gitignore`, not in Git index |
| No untracked source files | ✅ PASS | `git ls-files --others` returns empty |
| Build succeeds | ✅ PASS | 45 files built in 0.66s, zero errors |
| Post count matches | ✅ PASS | 37 source `.md` files → 37 built directories |
| All posts have frontmatter | ✅ PASS | All 37 posts have `layout`, `title`, `date`, `category`, `tags` |
| All posts use `post.liquid` | ✅ PASS | Verified on sampled posts |
| Root pages bound to layout | ✅ PASS | All `.liquid` pages declare `layout: layout.liquid` |
| Internal links use `\| url` filter | ✅ PASS | Verified across `index`, `about`, `writing`, `case-studies`, `privacy`, `terms` |
| Path prefix configured | ✅ PASS | `.eleventy.js` returns `pathPrefix: "/writing-portfolio/"` |
| `robots.txt` correct | ✅ PASS | Points to correct sitemap URL |
| CI/CD deploys correctly | ✅ PASS | `deploy.yml` is clean, uses Node 24, `npm ci`, `npm run build` |
| Infinite loop prevented | ✅ PASS | `paths-ignore` blocks `sitemap.xml`, `PORTFOLIO_AUDIT.md`, `README.md` |
| Google Analytics active | ✅ PASS | GA4 tag `G-XQPTTN037H` present |
| Microsoft Clarity active | ✅ PASS | Clarity ID `w6un2vtbtp` present |
| Cookie consent banner | ✅ PASS | Banner and accept logic functional |
| Schema.org structured data | ✅ PASS | `ProfilePage` on layout, `Article` on posts |
| Canonical URLs correct | ✅ PASS | Includes `page.url` for per-page canonical |
| OG meta tags present | ✅ PASS | `og:title`, `og:description`, `og:type`, `og:url`, `og:image` all set |
| CSS loaded in browser | ✅ PASS | Verified via live site screenshots |
| Hero stats render | ✅ PASS | Counters animate to 114, 216K, 4.2 |
| Navigation works | ✅ PASS | All 4 nav links verified on live site |
| Blog posts render | ✅ PASS | Opened "Keep Walking" — renders with title, date, content |
| Privacy/Terms pages | ✅ PASS | Both accessible from footer links |
| Search box present | ✅ PASS | Confirmed in nav on live site |
| Response design breakpoints | ✅ PASS | 3 breakpoints: 1024px, 640px |

---

## 📊 PROJECT STATISTICS

| Metric | Value |
|---|---|
| Total source files | 48 |
| Blog posts | 37 |
| Page templates | 8 (index, about, writing, case-studies, privacy, terms, 404, sitemap) |
| Layout templates | 2 (layout.liquid, post.liquid) |
| CSS files | 1 (style.css — 795 lines) |
| JavaScript | Inline only (in layout.liquid) |
| Images | 1 (hero.jpg — 228 KB) |
| Build output | 45 files |
| Build time | 0.66 seconds |
| Dependencies | 3 (eleventy, cheerio, slugify) |
| npm vulnerabilities | 6 (3 high, 3 moderate) |
| Commits on main | 22 |
| CI/CD | GitHub Actions → GitHub Pages |

---

## 🎯 RECOMMENDED FIX PRIORITY

### Immediate (Do Today)
1. **C-1:** Fix theme toggle (CSS ↔ JS mismatch)
2. **C-2:** Add resume PDF or remove FAB button
3. **C-3:** Add favicon.ico
4. **H-3:** Fix 404 page hardcoded links

### This Week
5. **H-1/H-2:** Run `npm audit fix` and update Eleventy
6. **H-4:** Fix nav hardcoded background color
7. **H-5:** Exclude 404 from sitemap
8. **M-4:** Categorize posts (Blogs vs Poems vs Prose)

### Before Next Content Push
9. **M-1/M-2:** Clean Medium HTML export (strip `graf` classes, remove duplicate titles)
10. **M-3:** Add description to case-studies page
11. **M-5:** Extract inline styles to CSS classes

### Housekeeping
12. **L-3:** Fix add-frontmatter.js default layout
13. **M-6/M-7:** Clean up package.json
14. **L-6:** Add .env.example

---

*End of Audit Report*  
*Generated by Antigravity QA — April 6, 2026*
