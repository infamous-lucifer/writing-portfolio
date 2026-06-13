(function() {
  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbw1J7-yT2pIRKBXYNqNbKOGe8ZNFqvGTZJXd-yQ1pFmG7Ffg4xsUdcMa4ujax4WF1081g/exec";
  let allPortfolioData = [];

  const groups = [
    { id: "health", title: "Healthcare & Medical", keywords: ["health", "medical", "clinic", "pharma", "diagnostics", "radiology", "endocrinology", "blood"], items: [] },
    { id: "cyber", title: "Cybersecurity & IT", keywords: ["cyber", " it", "cloud", "security", "saas", "tech", "software", "ai", "network", "ccna"], items: [] },
    { id: "legal", title: "Legal & Appellate", keywords: ["legal", "law", "court", "appellate", "ssdi", "attorney", "conviction", "ssi"], items: [] },
    { id: "esl", title: "ESL & Immigration", keywords: ["esl", "immigration", "visa", "student", "education", "english", "sevis", "f-1", "opt"], items: [] },
    { id: "ecom", title: "eCommerce & Lifestyle", keywords: ["ecom", "apparel", "home", "remodel", "wedding", "lifestyle", "shirt", "skincare", "gift", "siding", "cabinet"], items: [] },
    { id: "dive", title: "Dive & Travel", keywords: ["dive", "travel", "scuba", "tourism", "tao", "sail rock"], items: [] },
    { id: "other", title: "Specialized Strategy", keywords: [], items: [] }
  ];

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isSafeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (error) {
      return false;
    }
  }

  function renderMatrix() {
    const industrySelect = document.getElementById("industry-select");
    const typeSelect = document.getElementById("type-select");
    const container = document.getElementById("portfolio-matrix");
    const totalCount = document.getElementById("total-count");
    if (!industrySelect || !typeSelect || !container || !totalCount) return;

    const indFilter = industrySelect.value;
    const typeFilter = typeSelect.value;
    const lanes = groups.map((group) => ({ ...group, items: [] }));
    container.innerHTML = "";

    allPortfolioData.forEach((item) => {
      const indText = String(item.gemini_industry || "").toLowerCase();
      const typeText = String(item.gemini_content_type || "").toLowerCase();
      const titleText = String(item.display_title || "").toLowerCase();
      const excerptText = String(item.excerpt || "").toLowerCase();
      const searchBlob = `${titleText} ${indText} ${typeText} ${excerptText}`;
      const assignedLane = lanes.find((group) => group.keywords.some((keyword) => searchBlob.includes(keyword))) || lanes[lanes.length - 1];

      let itemType = "other";
      if (searchBlob.match(/blog|article|post/)) itemType = "blog";
      else if (searchBlob.match(/service|landing|overview|profile/)) itemType = "service";
      else if (searchBlob.match(/technical|clinical|analysis|diagnostics/)) itemType = "technical";
      else if (searchBlob.match(/guide|how-to|step|checklist|requirement/)) itemType = "guide";

      if ((indFilter === "all" || indFilter === assignedLane.id) && (typeFilter === "all" || typeFilter === itemType)) {
        assignedLane.items.push(item);
      }
    });

    let total = 0;
    lanes.filter((group) => indFilter === "all" || indFilter === group.id).forEach((group) => {
      total += group.items.length;
      const cards = group.items.length > 0
        ? group.items.map((item, index) => {
          const docLink = isSafeUrl(item.link_url)
            ? `<a href="${escapeHtml(item.link_url)}" target="_blank" rel="noopener noreferrer" class="doc-link" aria-label="View Google Doc"></a>`
            : "";

          return `
            <div class="card ${(index % 4 === 0) && group.items.length > 2 ? "bento-feat" : ""}" data-category="${group.id}">
              <div class="c-client">${escapeHtml(item.category)}</div>
              <span class="c-title">${escapeHtml(item.display_title)}</span>
              <p class="c-desc">${escapeHtml(item.excerpt)}</p>
              ${docLink}
            </div>
          `;
        }).join("")
        : `<div class="ghost-swimlane">No pieces currently listed under this criteria.</div>`;

      if (group.items.length > 0 || indFilter === group.id) {
        container.innerHTML += `
          <div class="matrix-section">
            <div class="sh"><span class="sh-lbl">${group.title} (${group.items.length})</span><div class="sh-line"></div></div>
            <div class="g3 rev">${cards}</div>
          </div>
        `;
      }
    });

    totalCount.innerText = `(${total} pieces)`;
  }

  async function fetchPortfolio() {
    const loadingText = document.getElementById("loading-text");
    try {
      const response = await fetch(SHEET_API_URL);
      allPortfolioData = await response.json();
      if (loadingText) loadingText.style.display = "none";
      renderMatrix();
    } catch (error) {
      if (loadingText) loadingText.innerText = "Sync Error. Please check connection.";
      console.error("Error fetching data:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".inline-select").forEach((select) => select.addEventListener("change", renderMatrix));
    if (document.getElementById("portfolio-matrix")) fetchPortfolio();
  });
})();
