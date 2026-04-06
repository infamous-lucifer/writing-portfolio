# Deployment Log — Writing Portfolio

This file tracks every manual and automated push/deployment to the live site. 
It is explicitly ignored by the Eleventy build system (as configured in `.eleventy.js`) so it will never be accessible to public visitors.


---

## [2026-04-06] Final Content Restoration & Port Audit
- **Trigger:** Manual push by Antigravity (Assistant)
- **Status:** ✅ ACTIVE (Run #26)
- **Changes Highlights:**
  - **Restored Missing Post**: Recovered `happiness-balancing-the-me-and-the-we.md` (Total count: 37)
  - **Fixed Build Errors**: Resolved YAML parsing failures (unquoted colons) across 5+ posts
  - **Finalized Structure**: 
    - Removed "Download CV" button and Homepage filters per User Request
    - Isolated Personal Writing (Writing Hub) from Professional Case Studies
    - Implemented IntersectionObserver for high-performance counter animations
    - Enhanced Search Logic for global resiliency across all page types
  - **Verification**: Local build (Node 22) and GitHub Actions (Node 24) successful

---

## [2026-04-06] Foundation & UI Remediation
- **Status:** ✅ PREVIOUS SUCCESS (Run #21)
- **Changes Highlights:**
  - Implemented Theme Toggle (Dark/Light mode persistence)
  - Fixed typography rendering and FOUC prevention
  - Cleaned up Medium import artifacts and consolidated filter plumbing
