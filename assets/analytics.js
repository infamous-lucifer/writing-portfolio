(function() {
  const CONSENT_KEY = "cookiesAccepted";
  const GA_ID = "G-XQPTTN037H";
  const CLARITY_ID = "w6un2vtbtp";
  const HUBSPOT_SRC = "https://js-na2.hs-scripts.com/246488618.js";
  let loaded = false;

  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function loadScript(src, attrs) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === true) {
        script.setAttribute(key, "");
      } else {
        script.setAttribute(key, value);
      }
    });
    document.head.appendChild(script);
  }

  function loadAnalytics() {
    if (loaded || !hasConsent()) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments);
    };
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, { async: true });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    window.clarity = window.clarity || function() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    loadScript(`https://www.clarity.ms/tag/${CLARITY_ID}`, { async: true });

    loadScript(HUBSPOT_SRC, {
      id: "hs-script-loader",
      type: "text/javascript",
      async: true,
      defer: true
    });
  }

  window.PortfolioAnalytics = { load: loadAnalytics };
  window.addEventListener("portfolio:cookiesAccepted", loadAnalytics);
  loadAnalytics();
})();
