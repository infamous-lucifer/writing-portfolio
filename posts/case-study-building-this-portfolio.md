---
layout: post
title: "Building a Fast, Privacy-First Portfolio: A Technical & Design Case Study"
summary: "A comprehensive deep dive into the architecture, design system, and technical challenges of building this portfolio. From diagnosing Google Search Console indexing failures to resolving DOM repaint bottlenecks."
date: 2026-06-13
tags: ["tech", "development", "design", "case study", "seo"]
category: blogs
---

A portfolio should be more than just a gallery of past work—it should act as a living demonstration of how you think, design, and code. 

When I set out to build this site, I looked at the current landscape of developer and writer portfolios. The industry standard has drifted toward heavy, JavaScript-laden frameworks (like React, Next.js, or Three.js) even for simple static content. The result is often bloated page weights, slow time-to-interactive, and terrible out-of-the-box SEO.

### The Goals
I established a strict set of constraints for this project:
1. **Zero Bloat:** It needed to load instantly, without a heavy JavaScript bundle.
2. **Privacy First:** Analytics tracking should be explicit and consent-based, not passively loaded to steal user data.
3. **Flawless Technical SEO:** Search engines must be able to crawl, index, and understand the site hierarchy effortlessly.
4. **Visually Striking:** The design needed to feel premium and layered, achieving depth without relying on massive image assets.

Here is a full documentation of the site, the problems encountered during development, the technical decisions made, and the final results.

---

## 🎨 The Design System & Philosophy

A personal site doesn't need a massive JavaScript payload to look good. The design system here is built entirely on native CSS custom properties and modern layout techniques.

![Homepage showing Topographic Texture and Glassmorphism](./assets/images/case-study/homepage-screenshot.png)

### Topographic Texture & Glassmorphism
The site avoids flat, sterile backgrounds by using a subtle, procedural **topographic SVG background**. This gives the page depth, texture, and a sense of movement, without the performance cost of loading a high-resolution raster image. 

Layered over this is a **glassmorphism** effect (`backdrop-filter: blur(10px)`). This is heavily utilized in the navigation bar and floating cards. It allows the topographic lines to bleed through the interface elements naturally, maintaining text readability while creating a premium, modern aesthetic.

### The Typography Stack
The typographic hierarchy is intentionally complex, relying on a curated 3-font stack to create tension and rhythm:
- **Headings:** *Cormorant Garamond*. A serif font that adds a sophisticated, editorial, almost literary feel.
- **Body Text:** *Plus Jakarta Sans*. Highly legible, geometric, and modern to ensure long-form reading is comfortable.
- **Accents/Meta:** *IBM Plex Mono*. Used for dates, badges, and read times to provide a stark, technical contrast to the literary serif.

![Writing Page showing the Asymmetric Bento Grid](./assets/images/case-study/writing-page-screenshot.png)

### The Asymmetric Bento Grid
Instead of a rigid, boring grid for the writing posts, the CSS uses dynamic `nth-child(6n + 1)` staggering. This creates a "bento box" style layout where certain cards naturally span two columns. It creates visual rhythm and hierarchy entirely through CSS, without requiring any complex JavaScript masonry libraries.

---

## ⚙️ Architectural Decisions

At its core, this site is a statically generated asset, but it behaves dynamically where it counts.

### Eleventy (11ty) as the Engine
The site is built on **Eleventy (11ty)**, a incredibly fast, lightweight Static Site Generator (SSG). 
**Why Eleventy?** Unlike Next.js or React, Eleventy ships **zero client-side JavaScript by default**. Every post you read (including this one) is simply a Markdown file in the repository. Eleventy processes these files through Liquid templates and spits out pure, minified HTML. There is no database layer to query on page load, meaning Time To First Byte (TTFB) is virtually instantaneous.

### Google Sheets as a Headless CMS
While the writing section is driven by static Markdown files, the **Work & Strategy Matrix** requires complex filtering by industry and content type. 
Instead of hardcoding this data or spinning up a heavy CMS like Strapi or Sanity, the page makes an asynchronous fetch to a Google Apps Script API endpoint, which reads directly from a **Google Sheet**. This allows me to update my portfolio from my phone using a spreadsheet application, and the site updates instantly.

---

## 🛠️ Problems Encountered & Technical Solutions

Building this site was not without friction. Here are the three most significant technical hurdles encountered, and exactly how they were solved.

### Problem 1: Google Search Console Indexing Failures
**The Issue:** After launching the site and submitting the `sitemap.xml` to Google Search Console (GSC), a major issue was discovered: **Only the homepage was being indexed.** Every other page reported a "Sitemap could not be read" or 404 error. The site was ranking for absolutely nothing.

**The Diagnosis:** The portfolio is hosted on GitHub Pages in a subpath (`/writing-portfolio/`). However, the dynamically generated `sitemap.xml` was outputting root-relative URLs (e.g., `https://infamous-lucifer.github.io/posts/the-mirror-room/`). Google's bots were following these links to the root domain, hitting 404s, and abandoning the crawl. 
Furthermore, Eleventy 3's `HtmlBasePlugin` was conflicting with manual `| url` filters in the Liquid templates, causing a double-prefixing bug (`/writing-portfolio/writing-portfolio/...`) in the HTML `href` tags.

**The Technical Solution:**
1. **Removed Redundant Filters:** I stripped out the manual `| url` Liquid filters across all templates, allowing Eleventy 3's native `HtmlBasePlugin` to handle relative pathing flawlessly.
2. **Rewrote the Sitemap Generator:** I updated the `sitemap.xml.liquid` template to explicitly inject the correct base path.
3. **Crawl Budget Optimization:** I added intelligent `<priority>` and `<changefreq>` XML tags. Blog posts are marked as `never` changing (priority `0.7`), while the homepage is `weekly` (priority `1.0`). This explicitly tells Googlebot how to efficiently allocate its crawl budget across the site.

### Problem 2: DOM Repaint Loops in JavaScript
**The Issue:** In the initial build, the script that rendered the "Work Matrix" iterated over the JSON data and used `container.innerHTML += ...` to append cards to the screen one by one.

**The Diagnosis:** This is a classic JavaScript performance anti-pattern. Every time `innerHTML` is appended to, the browser must completely destroy and re-parse the entire DOM subtree. For a portfolio with dozens of pieces, this triggered cascading repaint and reflow cycles, causing lag on lower-end mobile devices.

**The Technical Solution:** I refactored the logic to collect all generated HTML strings into an array, and perform a **single, batched DOM write**.
```javascript
// Bad: Triggers N DOM repaints
items.forEach(item => { container.innerHTML += render(item); });

// Good: Single batched write
const htmlParts = items.map(item => render(item));
container.innerHTML = htmlParts.join("");
```

### Problem 3: Passive Analytics and Privacy Violations
**The Issue:** Initially, third-party tracking scripts (like Google Analytics and HubSpot) were loaded unconditionally in the `<head>` of the document.

**The Diagnosis:** This violated the core "Privacy First" goal. It bloated the initial page load for users who might just bounce, and executed tracking code without explicit user consent.

**The Technical Solution:** I ripped out all inline analytics and built a custom `analytics.js` controller. 
Scripts are now **blocked by default**. When a user visits the site, a subtle cookie toast appears. If they click "Accept", the controller saves a boolean in `localStorage` and dynamically injects the script tags into the DOM. If they ignore it or decline, zero tracking code is executed.

---

## 📈 The Results & Proof of Concept

By adhering to these strict architectural constraints, the final product is a site that delivers on all its initial goals.

![Lighthouse Audit showing 100s in SEO and Best Practices](./assets/images/case-study/lighthouse-screenshot.png)

- **Performance & SEO:** The site scores a perfect **100/100 in SEO** and **100/100 in Best Practices** in Google Lighthouse, with Accessibility sitting at an exceptional 96.
- **Speed:** Time To Interactive (TTI) is virtually instantaneous because the critical rendering path is entirely free of render-blocking JavaScript.
- **Cost:** Because the architecture relies on Static Site Generation, GitHub Pages, and Google Sheets, the entire stack costs exactly **$0/month to host and maintain**.

This portfolio serves as proof that you do not need a heavy, complex React framework to build a modern, interactive, and beautiful web experience. Sometimes, Vanilla JavaScript, robust CSS architecture, and a solid Static Site Generator are all you need to build something world-class.
