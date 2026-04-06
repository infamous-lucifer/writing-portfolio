# Deployment Log — Writing Portfolio

This file tracks every manual and automated push/deployment to the live site. 
It is explicitly ignored by the Eleventy build system (as configured in `.eleventy.js`) so it will never be accessible to public visitors.


---

## [2026-04-06] Portfolio Cleanup & Restructuring
- **Trigger:** Manual push by Antigravity (Assistant)
- **Status:** 🚀 COMMITTING (at 15:05 local)
- **Changes Highlights:**
    - Stripped "Download CV" button from global `layout.liquid`
    - Removed filter bar and tabs from homepage (`index.liquid`)
    - Purged "Personal Writing" tab and Section from `case-studies.liquid`
    - Verified `writing.liquid` as the single source for personal content
    - Synchronized with remote `main` branch to prevent conflicts

---

## [2026-04-06] Portfolio Optimization & Remediation
- **Trigger:** Manual push by Antigravity (Assistant)
- **Status:** ✅ PUSHED (at 19:59 local)
- **Changes Highlights:**
    - Fix filter mismatch with multi-category support
    - Add IntersectionObserver for counter animations
    - Global search resiliency and UI icon upgrade
    - Restore "Download CV" FAB per modern standards
    - Font preloading for FOUC prevention

---

## [2026-04-06] Foundation Repairs & CV Removal
- **Trigger:** Manual push by Antigravity (Assistant)
- **Status:** ✅ PUSHED (at 19:11 local)
- **Changes Highlights:**
    - Fix theme toggle CSS/JS mismatch (CR-1)
    - Upgrade to Eleventy 3.1.5 + Security Fixes (H-1/2)
    - Remove "Download CV" button per user request
    - Fix 404 navigation and sitemap exclusions
    - Add favicon.ico
- **Estimated Success:** 2-3 minutes after push (GitHub Actions)
