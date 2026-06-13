---
layout: post
title: "Building a Fast, Privacy-First Portfolio: A Technical & Design Case Study"
summary: "An inside look at the architecture, design system, and code optimizations behind this portfolio. From zero-bloat analytics to batched DOM rendering."
date: 2026-06-13
tags: ["tech", "development", "design", "case study"]
category: blogs
---

A portfolio should be more than just a gallery of past work—it should act as a living demonstration of how you think, design, and code. 

When I set out to build this site, I had a clear set of constraints and goals:
1. **Zero Bloat:** It needed to load instantly, scoring 100/100 on Lighthouse.
2. **Privacy First:** Analytics tracking should be explicit and consent-based, not passively loaded.
3. **Easily Maintainable:** Writing a new post should require zero HTML updates.
4. **Visually Striking:** The design needed to feel premium without relying on heavy frontend frameworks like React or Three.js.

Here is a look under the hood at how this site was built, the design decisions made, and the technical challenges solved along the way.

---

## 🎨 The Design Philosophy

A personal site doesn't need a massive JavaScript payload to look good. The design system here is built entirely on native CSS custom properties and modern layout techniques.

![Design System Architecture Layers](./assets/images/case-study/design-system.png)

### The Topographic Texture & Glassmorphism
The site avoids flat, sterile colors by using a subtle, procedural **topographic SVG background**. This gives the page depth and texture without the performance cost of loading a high-resolution image. 

Layered over this is a **glassmorphism** effect (`backdrop-filter: blur(10px)`) used in navigation and floating elements to maintain readability while letting the texture breathe underneath.

### Typography Stack
The typographic hierarchy relies on a curated, modern 3-font stack:
- **Headings:** *Cormorant Garamond* (adds a sophisticated, editorial, almost literary feel).
- **Body Text:** *Plus Jakarta Sans* (highly legible, geometric, modern).
- **Accents/Meta:** *IBM Plex Mono* (used for dates, badges, and read times to provide technical contrast).

### The Asymmetric Bento Grid
Instead of a rigid, boring grid for the writing posts, the CSS uses dynamic `nth-child(6n + 1)` staggering. This creates a "bento box" style layout where certain cards naturally span two columns, creating visual rhythm entirely through CSS, without requiring any complex JavaScript masonry libraries.

---

## ⚙️ The Architecture

At its core, this site is a statically generated asset, but it behaves dynamically where it counts.

![Web Development Architecture Flow](./assets/images/case-study/architecture.png)

### Eleventy (11ty) as the Engine
The site is built on **Eleventy (11ty)**, a fast, lightweight Static Site Generator (SSG). Every post you read (including this one) is simply a Markdown file in the repository. Eleventy processes these files through Liquid templates and spits out pure, minified HTML. There is no database layer to query on page load.

### Google Sheets as a Headless CMS
While the writing section is driven by Markdown, the **Work & Strategy Matrix** requires complex filtering by industry and content type. Instead of hardcoding this data, the page makes an asynchronous fetch to a Google Apps Script API endpoint, which reads directly from a Google Sheet. This allows me to update my portfolio from my phone using a spreadsheet, and the site updates instantly.

---

## 🛠️ Technical Challenges & Optimizations

Building a clean site isn't just about what you add; it's about what you refactor. Here are three specific technical hurdles overcome during development:

### 1. Fixing DOM Repaint Loops in JavaScript
In the initial build, the script that rendered the Work Matrix iterated over the data and used `container.innerHTML += ...` to append cards one by one. 

**The Problem:** This is a classic performance anti-pattern. Every time `innerHTML` is updated, the browser re-parses the entire DOM subtree, causing slow rendering on lower-end devices.

**The Solution:** I refactored the logic to collect all generated HTML strings into an array, and perform a **single, batched DOM write** using `htmlParts.join("")`. 

### 2. Privacy-First Analytics Consent
Initially, third-party trackers (Google Analytics, Microsoft Clarity, HubSpot) were loaded unconditionally in the head of the document.

**The Problem:** This violated privacy-first principles and bloated the initial page load for users who might just bounce.

**The Solution:** I ripped out all inline analytics and built a custom `analytics.js` controller. Scripts are now blocked by default. When a user clicks "Accept" on the cookie toast, it saves a boolean in `localStorage` and dynamically injects the scripts. If they ignore it, they aren't tracked.

### 3. SEO Pathing & Dynamic Sitemaps
Deploying to GitHub Pages requires the site to live in a subpath (`/writing-portfolio/`). 

**The Problem:** The dynamically generated `sitemap.xml` was outputting root-relative URLs (e.g., `github.io/posts/post-name/`), causing Google Search Console to receive 404 errors for every page except the homepage.

**The Solution:** I updated the Liquid sitemap template to correctly prepend the path prefix. Furthermore, I added intelligent `<priority>` and `<changefreq>` tags. Blog posts are marked as `never` changing, while the homepage is `weekly` with a `1.0` priority, explicitly telling search engines how to allocate their crawl budget.

---

## 📈 The Result

By adhering to these principles, the final product is a site that:
- Scores a perfect **100/100 across Performance, Accessibility, and SEO** in Lighthouse.
- Renders instantaneously.
- Costs exactly $0/month to host.
- Can be updated via Markdown or Google Sheets without touching a single line of HTML.

It is proof that you don't need a heavy framework to build a modern, interactive, and beautiful web experience. Sometimes, Vanilla JS, robust CSS, and a good Static Site Generator are all you need.
