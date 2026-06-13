(function() {
  const CONSENT_KEY = "cookiesAccepted";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return false;
    }
    return true;
  }

  function initCounters() {
    const counters = document.querySelectorAll(".hnum");
    const statsSection = document.getElementById("stats-section");
    if (!counters.length || !statsSection) return;

    const startCounter = (counter) => {
      const target = Number(counter.getAttribute("data-count")) || 0;
      let current = 0;
      const inc = target / 200;

      const updateCount = () => {
        current += inc;
        if (current < target) {
          counter.innerText = counter.hasAttribute("data-dec") ? current.toFixed(1) : Math.ceil(current);
          setTimeout(updateCount, 10);
          return;
        }

        if (counter.dataset.sfx) {
          counter.innerText = target + counter.dataset.sfx;
        } else if (counter.hasAttribute("data-dec")) {
          counter.innerText = target.toFixed(1);
        } else {
          counter.innerText = target;
        }
      };

      if (counter.getAttribute("data-count") || counter.hasAttribute("data-dec") || counter.dataset.sfx) {
        updateCount();
      }
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".hnum").forEach(startCounter);
        statsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  function initSearch() {
    if (document.getElementById("search") && typeof PagefindUI !== "undefined") {
      new PagefindUI({
        element: "#search",
        showSubResults: true,
        resetStyles: false,
        baseUrl: "/writing-portfolio/"
      });
    }
  }

  function initFilters() {
    const tabs = document.querySelectorAll(".ftab");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        const filter = String(tab.dataset.f || "all").toLowerCase();
        document.querySelectorAll("[data-category]").forEach((item) => {
          const categories = String(item.dataset.category || "").toLowerCase().split(/\s+/);
          item.style.display = filter === "all" || categories.includes(filter) ? "" : "none";
        });
        document.querySelectorAll("[data-s]").forEach((section) => {
          const categories = String(section.dataset.s || "").toLowerCase().split(/\s+/);
          section.style.display = filter === "all" || categories.includes(filter) ? "" : "none";
        });
      });
    });
  }

  function initCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    if (!banner || !acceptBtn) return;

    if (storageGet(CONSENT_KEY) === "true") {
      banner.style.display = "none";
    } else {
      banner.style.display = "block";
    }

    acceptBtn.addEventListener("click", () => {
      storageSet(CONSENT_KEY, "true");
      banner.style.display = "none";
      window.dispatchEvent(new CustomEvent("portfolio:cookiesAccepted"));
      if (window.PortfolioAnalytics) window.PortfolioAnalytics.load();
    });
  }

  function initMobileMenu() {
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    if (!mobileBtn || !navLinks) return;

    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    const applyTheme = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      storageSet("theme", theme);
      const icon = themeToggle.querySelector(".t-icon");
      if (icon) icon.textContent = theme === "light" ? "☽" : "☼";
    };

    applyTheme(storageGet("theme") || "dark");
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
  }

  function initReadingProgress() {
    const article = document.querySelector(".post-content");
    const bar = document.querySelector(".progress-bar");
    if (!article || !bar) return;

    const update = () => {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight || 1;
      const scrolled = -rect.top + window.innerHeight / 2;
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width = `${pct}%`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  ready(() => {
    initCounters();
    initSearch();
    initFilters();
    initCookieBanner();
    initMobileMenu();
    initThemeToggle();
    initReadingProgress();
  });
})();
