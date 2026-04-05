# Akshat Singh — Writing Portfolio: Complete Project Audit & Master Plan

**Live URL**: https://infamous-lucifer.github.io/writing-portfolio/  
**Repository**: https://github.com/infamous-lucifer/writing-portfolio  
**Build System**: Eleventy (11ty) v3.1.2  
**Deployment**: GitHub Actions → GitHub Pages  
**Document Date**: April 2026  

---

## Part 1: What Has Been Built (Full Inventory)

### 1.1 Site Architecture

```
writing-portfolio/
├── .eleventy.js            # Build config: path prefix, collections, passthroughs
├── package.json            # Node dependencies (Eleventy, Cheerio, Slugify)
├── robots.txt              # SEO crawler instructions (Sitemap URL included)
├── sitemap.xml             # Static sitemap (auto-updated by sitemap.yml workflow)
├── 404.html                # Custom not-found page
├── index.html              # Home page (Landing + filter bar + 3 featured articles)
├── case-studies.html       # Portfolio page (6 client sections + 62 post loop)
├── writing.html            # Writing Hub (Blogs/Poems/Prose from Medium)
├── about.html              # Personal bio, links, certifications
├── privacy.html            # Privacy Policy page
├── terms.html              # Terms of Service page
├── PORTFOLIO_AUDIT.md      # This document
├── css/
│   └── style.css           # All styling (14 KB, single stylesheet)
├── _includes/
│   ├── layout.liquid       # Global page wrapper (head, header, nav, footer, scripts)
│   └── post.liquid         # Individual post template
├── posts/                  # 62 imported Medium posts (Markdown)
├── scripts/
│   ├── import-medium.js    # One-time Medium HTML → Markdown migration script
│   └── finalize-categories.js  # Auto-categorize posts (Blogs/Poems/Prose)
├── _site/                  # BUILD OUTPUT (auto-generated, not committed)
├── images/                 # Static image assets (passed through to _site)
└── .github/
    └── workflows/
        ├── deploy.yml      # Eleventy build + GitHub Pages deployment (Node 24)
        └── sitemap.yml     # Sitemap auto-generation (fixed Apr 5, 2026)
```

---

### 1.2 Pages (6 total)

| Page | Route | Purpose | Status |
|------|-------|---------|--------|
| **Home** | `/` | Landing page, stats, 3 featured articles, professional filter bar | ✅ Live |
| **Case Studies** | `/case-studies/` | Full professional portfolio with 6 filtered sections | ✅ Live |
| **Writing Hub** | `/writing/` | Personal writing archive (62 Medium pieces, filterable) | ✅ Live |
| **About** | `/about/` | Bio, LinkedIn, Medium, Google certifications, contact | ✅ Live |
| **Privacy** | `/privacy/` | GDPR-compliant privacy policy | ✅ Live |
| **Terms** | `/terms/` | Terms of service | ✅ Live |

---

### 1.3 Home Page (`index.html`)

**Features:**
- Filter bar with 6 tabs: **All Work (100+) · Ranked + Live (12) · Live, No Data (4) · In Production (24) · Other Clients (12) · Personal Writing (dynamic)**
- Client metadata row: `CCI Training · AFI International · Brownstone Law · Adorb · LB Diving`
- 3 manually curated featured articles:
  1. *The Psychology of Content Strategy* — Personal Blog → links to `/posts/the-psychology-of-content-strategy/`
  2. *Verses in the Machine* — Creative Writing → links to `/posts/verses-in-the-machine/`
  3. *Why User Intent is the Only Metric That Matters* — Ranked Industry Insight
- Filter logic: `data-category` attribute on each `<article>` card matched against `data-f` on filter buttons

> **Note**: The home page shows only 3 static cards. It is a curated showcase. The full portfolio is on `/case-studies/`.

---

### 1.4 Case Studies Page (`case-studies.html`)

**6 Sections:**

| Section | Filter Key (`data-f`) | Section Key (`data-s`) | Clients |
|---------|----------------------|----------------------|---------|
| Published & Ranked (GSC Data) | `ranked` | `ranked` | CCI Training |
| Live, No Analytics | `live` | `live` | CCI Training |
| CCI Drafts / Google Docs | `prod` | `prod` | CCI Training |
| AFI International Docs | `prod` | `prod` | AFI International |
| Other Client Portfolios | `other` | `other` | Adorb, Brownstone Law, LB Diving |
| Personal Writing (Medium Export) | `writing` | `writing` | Self (62 posts, dynamic loop) |

**Key live pieces:**
- [Cybersecurity Salary Guide](https://ccitraining.edu/blog/highest-paying-cybersecurity-jobs-with-state-and-city-wise-salary/) — 216K impressions
- [Will AI Replace Pharmacy Technicians?](https://ccitraining.edu/blog/will-ai-replace-pharmacy-technicians/) — 27K impressions, Avg Position 4.2
- [Brute Force Attacks: Prevention & Defense](https://ccitraining.edu/blog/guide-to-prevent-brute-force-attacks/) — Live
- [How to Press Charges: Legal Guide](https://www.brownstonelaw.com/blog/the-complete-criteria-of-pressing-charges-against-someone/) — Brownstone Law
- [Illinois Post-Conviction Service Page](https://www.brownstonelaw.com/post-conviction-lawyers/illinois/) — Brownstone Law
- [Wedding Anniversary Gift Guide](https://adorbcustomtees.com) — Adorb Custom Tees

---

### 1.5 Writing Hub (`writing.html`)

**Features:**
- Dynamic Eleventy loop renders all 62 Medium posts from `collections.posts`
- 4 filter buttons: **All Pieces · Personal Blogs · Poems · Prose**
- Each post card shows: Category, date, title, 150-char excerpt, "Read Full Piece" link
- Category driven by `category:` field in each post's YAML frontmatter
- Inline `<script>` handles filtering by matching `data-category` on cards

---

### 1.6 The 62 Medium Posts (`posts/` directory)

**Origin**: Exported from Medium account `@bikshat062` → converted from HTML to Markdown via `scripts/import-medium.js` (uses Cheerio + Slugify).

**YAML Frontmatter (each post):**
```yaml
---
layout: post.liquid
title: "Post Title Here"
date: 2024-06-15
category: Blogs   # or: Poems, Prose
tags: ["posts"]
---
```

**⚠️ Cleanup Needed**: ~10 posts are Medium comment replies, not real articles:
- `beautiful.md`, `hi.md`, `fascinating.md`, `lovely.md`, `just-did-that.md`
- `normie.md`, `im-a-happy-human.md`, `much-needed-reminder-thank-you.md`
- These should be deleted from `posts/` to clean up the Writing Hub

---

### 1.7 Global Layout (`_includes/layout.liquid`)

Every page includes:

| Feature | Details |
|---------|---------|
| Fonts | Google Fonts: Outfit (800/600/400), Inter (600/400/300), IBM Plex Mono |
| Stylesheet | `/css/style.css` — single 14KB file |
| GA4 | Measurement ID: `G-XQPTTN037H` |
| Microsoft Clarity | Project ID: `w6un2vtbtp` |
| JSON-LD Schema | `ProfilePage` type with Person author |
| Animated Counters | 114 Pieces, 216K Impressions, 4.2 Avg Rank |
| Search | Global text search filters `.card` elements in real-time |
| Theme Toggle | Dark/light mode (resets on page load — not persisted) |
| Cookie Banner | Shows once, accepted state stored in `localStorage` |
| Footer | CTA: "Work With Me" (mailto), Social: LinkedIn/Medium/GitHub |
| FAB Button | "Download CV" → `/assets/akshat-singh-resume.pdf` (**FILE MISSING**) |
| Nav | Home / Case Studies / Writing / About |

---

### 1.8 Analytics & Tracking

| Tool | Status | ID/Code | Notes |
|------|--------|---------|-------|
| **Google Analytics 4** | ✅ Tag installed | `G-XQPTTN037H` | Shows "Data collection not active" — needs GSC verification |
| **Microsoft Clarity** | ✅ Tag installed | `w6un2vtbtp` | Heatmaps + session recordings |
| **Google Search Console** | ❌ Not set up | — | Property not added, sitemap not submitted |
| **Sitemap Workflow** | ✅ Fixed Apr 5, 2026 | — | Added `contents: write` permission + correct base URL |

---

### 1.9 SEO Infrastructure

| Item | Status | Notes |
|------|--------|-------|
| Title tags | ✅ Global | Format: `[Page Title] \| Akshat Singh \| Content Portfolio` |
| Meta description | ⚠️ One for all pages | Needs page-specific descriptions |
| OG tags | ⚠️ Partial | Title + description set; no `og:image` |
| JSON-LD Schema | ✅ `ProfilePage` | Post pages need `Article` schema |
| `robots.txt` | ✅ Correct | Points to sitemap |
| `sitemap.xml` | ✅ Auto-generated | Workflow now fixed and uses correct base URL |
| Favicon | ✅ Exists | `favicon.ico` |
| `404.html` | ✅ Exists | Custom error page |

---

### 1.10 Deployment Pipeline (Fixed)

```
You push to main →
  GitHub Actions runs deploy.yml →
    npm ci (install deps) →
    npm run build (Eleventy builds _site/) →
    Upload _site/ as Pages artifact →
    Deploy to GitHub Pages →
  ~3–10 min later: live at infamous-lucifer.github.io/writing-portfolio/
```

**Also runs on push**: `sitemap.yml` regenerates `sitemap.xml` and auto-commits it.

**Node version**: Upgraded to Node 24 (was 20, deprecated June 2026).

> **If you don't see changes**: Open in Incognito / press `Ctrl + Shift + R` for hard refresh.

---

## Part 2: Known Bugs & Issues (Tracker)

| # | Bug | Impact | Status |
|---|-----|--------|--------|
| 1 | `sitemap.yml` had wrong base URL + missing write permission | Sitemap never updated | ✅ Fixed Apr 5, 2026 |
| 2 | `data-f="medium"` vs `data-s="writing"` mismatch | "Personal Writing" filter showed nothing | ✅ Fixed Apr 5, 2026 |
| 3 | `akshat-singh-resume.pdf` file missing from repo | "Download CV" button 404s on every page | ❌ Open |
| 4 | All pages share the same meta description | Lower CTR, SEO penalty risk | ❌ Open |
| 5 | No `Article` JSON-LD schema on post pages | Missing rich result eligibility | ❌ Open |
| 6 | GA4 "Data collection not active" | Analytics may not be recording | ❌ Needs GSC setup |
| 7 | No `og:image` meta tag | Social shares show no preview image | ❌ Open |
| 8 | ~10 junk posts (Medium replies) in writing hub | Pollutes archive, bad UX | ❌ Needs manual cleanup |
| 9 | Inline styles in `about.html`, `privacy.html`, `terms.html` | CSS lint violations | ❌ Open |
| 10 | Dark mode preference resets on page navigation | Minor UX annoyance | ❌ Open |
| 11 | GitHub Actions Node 20 deprecation warnings | Will break June 2026 | ✅ Fixed Apr 5, 2026 |

---

## Part 3: Comprehensive Implementation Plan

### Phase 1: Critical Infrastructure (Priority: HIGH)

#### 1A. ✅ Sitemap Workflow — DONE
- Added `permissions: contents: write`
- Set correct base URL: `https://infamous-lucifer.github.io/writing-portfolio/`
- Upgraded to Node 24

#### 1B. Upload Resume PDF
- [ ] Export your resume as a PDF
- [ ] Save it as `assets/akshat-singh-resume.pdf` in the project root
- [ ] Add `eleventyConfig.addPassthroughCopy("assets")` to `.eleventy.js`
- [ ] Commit and push

#### 1C. Set Up Google Search Console
- [ ] Go to https://search.google.com/search-console
- [ ] Click "Add property" → URL prefix: `https://infamous-lucifer.github.io/writing-portfolio/`
- [ ] Verify via HTML file method (download file, commit to project root, push)
- [ ] After verified → Sitemaps → Add: `https://infamous-lucifer.github.io/writing-portfolio/sitemap.xml`

#### 1D. Verify GA4
- [ ] Open GA4 dashboard
- [ ] Admin → Data Streams → check stream URL matches the live URL exactly
- [ ] Visit the live site → GA4 → Realtime — does your visit show up?
- [ ] If not: check no ad-blocker is active, and that the Measurement ID matches

---

### Phase 2: SEO Fixes (Priority: HIGH)

#### 2A. Page-Specific Meta Descriptions
In each page's frontmatter, add a `description:` field, then update `layout.liquid` to use it:

```liquid
<meta name="description" content="{% if description %}{{ description }}{% else %}Akshat Singh...{% endif %}">
```

Suggested descriptions:
- **Home**: "SEO Content Strategist Akshat Singh. 114+ pieces delivering 216K impressions. Cybersecurity, Law, Tech."
- **Case Studies**: "Full portfolio of ranked SEO content from CCI Training, Brownstone Law, AFI International, and more."
- **Writing**: "Personal essays, poetry, and prose by Akshat Singh. 60+ pieces on identity, growth, and creativity."
- **About**: "About Akshat Singh — SEO Strategist specializing in Cybersecurity and Appellate Law content."

#### 2B. Add Article Schema to Post Pages
In `_includes/post.liquid`, add inside `<head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ title }}",
  "author": { "@type": "Person", "name": "Akshat Singh" },
  "datePublished": "{{ date }}"
}
```

#### 2C. Add OG Image
- [ ] Create a 1200×630px branded image (your name + tagline on dark background)
- [ ] Save to `images/og-image.jpg`
- [ ] Add to `layout.liquid`: `<meta property="og:image" content="{{ '/images/og-image.jpg' | url }}">`

#### 2D. Clean Up Junk Posts
Delete these from `posts/` (all are Medium comment replies):
```
beautiful.md, hi.md, fascinating.md, lovely.md, just-did-that.md
normie.md, im-a-happy-human.md, much-needed-reminder-thank-you.md
this-is-a-reminder-indeed.md, live-your-life-for-yourself-as-yourself.md
```

---

### Phase 3: Design & UX Polish (Priority: MEDIUM)

#### 3A. Refactor Inline Styles
Move `style="..."` attributes from `about.html`, `privacy.html`, `terms.html` to `css/style.css`.

#### 3B. Persist Dark Mode
In `layout.liquid` script section, save to localStorage:
```javascript
const saved = localStorage.getItem('theme');
if (saved) document.body.classList.add(saved);
// On toggle: localStorage.setItem('theme', newTheme)
```

#### 3C. Pagination for Writing Hub
Currently all 62 posts load at once. Add a "Load More" button or Eleventy pagination (`pagination:` in frontmatter) to show 12 at a time.

#### 3D. Mobile Filter Bar
On small screens, the 6-tab filter bar may overflow. Add horizontal scroll with `overflow-x: auto` and `-webkit-overflow-scrolling: touch`.

---

### Phase 4: Analytics & Measurement (Priority: MEDIUM)

#### 4A. GA4 Custom Events
Add these to `layout.liquid` script:
```javascript
// Track filter clicks
document.querySelectorAll('.ftab').forEach(tab => {
  tab.addEventListener('click', () => {
    gtag('event', 'filter_used', { filter_name: tab.dataset.f });
  });
});

// Track case study clicks
document.querySelectorAll('.c-title[href]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'case_study_click', { article_title: link.innerText });
  });
});
```

#### 4B. Clarity Heatmap Review
- Log in to https://clarity.microsoft.com
- Filter by "Case Studies" page
- Check which client sections get the most attention
- Use data to decide which sections to expand

---

### Phase 5: Content Expansion (Priority: LOW — Ongoing)

#### Pages to Create

| Page | Route | Purpose |
|------|-------|---------|
| Services | `/services/` | Your SEO packages and pricing |
| Contact | `/contact/` | Form + links (lead generation) |
| Results | `/results/` | GSC screenshots, testimonials |
| Certifications | `/certifications/` | Google Skillshop wallet embed |
| New Blog | `/blog/` | Original SEO articles (not Medium imports) |

#### Blog Post Ideas
- "How I Got a CCI Training Article to 216K Impressions — Full Case Study"
- "Writing Cybersecurity Content: A Non-Technical Writer's Complete Guide"
- "Why AI-Generated Content Fails at Authority (And What to Do Instead)"
- "From Keyword Research to Published Article: My Exact Workflow in 2026"

---

## Part 4: Maintenance Rhythm

### Daily (5 min)
- [ ] GA4 Realtime: anyone on the site right now?
- [ ] Clarity: any new recordings worth watching?

### Weekly (20 min)
- [ ] GA4 → Traffic acquisition: which sources sent visitors?
- [ ] Google Search Console → Performance: any new queries? any rank drops?
- [ ] GitHub Actions → did both workflows (deploy + sitemap) pass?
- [ ] Write or refine one post / case study entry

### Monthly (1 hour)
- [ ] Full GSC audit: impressions, clicks, avg position trends
- [ ] Update `data-count="114"` in `layout.liquid` if you've delivered more pieces
- [ ] Clarity heatmap review: what sections are being ignored?
- [ ] Add a new case study card for any recent client work
- [ ] Check all external links are still working (CCI, Brownstone, etc.)

### Quarterly (2 hours)
- [ ] Run Screaming Frog (free tier) or Ahrefs Site Audit on the site
- [ ] Review and refresh meta descriptions for each page
- [ ] Update About page certifications if new certs acquired
- [ ] Add new GSC screenshots or testimonials to results page

---

## Part 5: External Integrations

| Service | Status | URL/ID |
|---------|--------|--------|
| LinkedIn | ✅ Linked | https://www.linkedin.com/in/akshat-singh-60695b313/ |
| Medium | ✅ Linked + Imported | https://medium.com/@bikshat062 |
| Google Skillshop | ✅ Linked | https://skillshop.credential.net/profile/akshatsingh666/wallet |
| Email | ✅ CTA active | akshatsingh666@gmail.com |
| GitHub | ✅ Active | https://github.com/infamous-lucifer |
| GA4 | ✅ Tag installed | G-XQPTTN037H |
| Microsoft Clarity | ✅ Tag installed | w6un2vtbtp |
| Google Search Console | ❌ Not configured | — |

---

## Part 6: For Third-Party Reviewers

**Technology**: Eleventy (11ty) v3.1.2 static site generator. No backend, no database. Pure HTML/CSS/JS deployed via GitHub Actions to GitHub Pages.

**Tracking**: GA4 (`G-XQPTTN037H`) + Microsoft Clarity (`w6un2vtbtp`). Both tags fire on every page via the global `layout.liquid` template.

**Content Scale**: 6 HTML pages + 62 post pages auto-generated from Markdown = ~70 live URLs.

**Critical Issues (Open)**:
1. GA4 "Data collection not active" — tag is in code but GSC property not verified; may be cause
2. Resume PDF missing — "Download CV" button returns 404 on every page
3. No page-specific meta descriptions — all pages share the same generic one
4. No OG image — social media shares will show no preview thumbnail

**What Is Working Well**:
- Automated deployment pipeline (push to main → live in ~5 min)
- Filter/tab system works across Home and Case Studies pages
- 62 personal posts fully imported and filterable on Writing Hub
- Cookie consent, dark mode toggle, animated counters all functional
- `robots.txt` correctly configured and pointing to sitemap
- Sitemap workflow now repaired and pointing to correct URL

---

*Document generated: April 5, 2026 · Site: infamous-lucifer.github.io/writing-portfolio*
