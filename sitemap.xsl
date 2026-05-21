<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap | Akshat Singh</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          :root {
            --bg: #090a0f;
            --card-bg: #12151e;
            --border: #1e2230;
            --txt: #f3f4f6;
            --txt-mute: #8591a5;
            --acc: #1dfc9f;
            --acc-dim: rgba(29, 252, 159, 0.12);
            --family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          
          body {
            background-color: var(--bg);
            color: var(--txt);
            font-family: var(--family);
            margin: 0;
            padding: 60px 20px;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            margin-bottom: 40px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
          }
          
          h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .subtitle {
            color: var(--txt-mute);
            margin: 0;
            font-size: 14px;
            font-family: monospace;
          }
          
          .tree-container {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
          }
          
          .node {
            display: flex;
            align-items: center;
            padding: 8px 0;
            position: relative;
          }
          
          .icon {
            margin-right: 10px;
            font-size: 16px;
            user-select: none;
          }
          
          .node-title {
            font-size: 15px;
          }
          
          .root-node {
            font-weight: 600;
            font-size: 17px;
            padding-bottom: 12px;
          }
          
          .root-node a {
            color: #ffffff;
          }
          
          .root-node a:hover {
            color: var(--acc);
            text-decoration: underline;
          }
          
          .branches {
            margin-left: 10px;
            padding-left: 20px;
            border-left: 1px dashed var(--border);
            position: relative;
          }
          
          .branch-group {
            margin-top: 16px;
            position: relative;
          }
          
          .branch-node {
            font-weight: 600;
            color: #e2e8f0;
            margin-bottom: 8px;
          }
          
          .branch-node.clickable {
            cursor: pointer;
            user-select: none;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
            border: 1px solid var(--border);
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            width: fit-content;
          }
          
          .branch-node.clickable:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: var(--acc);
          }
          
          .arrow {
            font-size: 10px;
            margin-right: 8px;
            color: var(--txt-mute);
            transition: transform 0.2s ease;
            display: inline-block;
          }
          
          .badge {
            background: var(--acc-dim);
            color: var(--acc);
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 12px;
            margin-left: 10px;
            font-weight: 500;
          }
          
          .leaves {
            margin-left: 14px;
            padding-left: 18px;
            border-left: 1px dashed var(--border);
          }
          
          .leaf-node {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 0;
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .leaf-node a {
            color: var(--txt);
            transition: color 0.15s ease;
          }
          
          .leaf-node a:hover {
            color: var(--acc);
            text-decoration: underline;
          }
          
          .meta-info {
            font-family: monospace;
            font-size: 11px;
            color: var(--txt-mute);
          }
          
          /* Collapsible Transition */
          .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .collapsible.collapsed .collapsible-content {
            max-height: 0;
          }
          
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: var(--txt-mute);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Site Architecture Map</h1>
            <p class="subtitle">infamous-lucifer.github.io/writing-portfolio/</p>
          </div>

          <div class="tree-container">
            <div class="tree-root">
              <!-- Root (Homepage) -->
              <div class="node root-node">
                <span class="icon">🌲</span>
                <span class="node-title">
                  <a href="https://infamous-lucifer.github.io/writing-portfolio/">
                    Akshat Singh Portfolio (Root)
                  </a>
                </span>
              </div>

              <div class="branches">
                
                <!-- Branch 1: Core Pages -->
                <div class="branch-group">
                  <div class="node branch-node">
                    <span class="icon">🌿</span>
                    <span class="node-title">Core Pages</span>
                  </div>
                  
                  <div class="leaves">
                    <xsl:for-each select="sitemap:urlset/sitemap:url[not(contains(sitemap:loc, '/posts/')) and sitemap:loc != 'https://infamous-lucifer.github.io/writing-portfolio/']">
                      <div class="node leaf-node">
                        <span class="icon">📄</span>
                        <span class="node-title">
                          <a href="{sitemap:loc}">
                            <span class="core-title" data-url="{sitemap:loc}">
                              <xsl:value-of select="sitemap:loc"/>
                            </span>
                          </a>
                        </span>
                        <span class="meta-info">Updated: <xsl:value-of select="sitemap:lastmod"/></span>
                      </div>
                    </xsl:for-each>
                  </div>
                </div>

                <!-- Branch 2: Collapsible Posts -->
                <div class="branch-group collapsible collapsed" id="posts-branch">
                  <div class="node branch-node clickable">
                    <span class="arrow">▶</span>
                    <span class="icon">📁</span>
                    <span class="node-title">
                      Personal Essays &amp; Prose
                      <span class="badge">
                        <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc, '/posts/')])"/> articles
                      </span>
                    </span>
                  </div>
                  
                  <div class="leaves collapsible-content">
                    <xsl:for-each select="sitemap:urlset/sitemap:url[contains(sitemap:loc, '/posts/')]">
                      <xsl:sort select="sitemap:lastmod" order="descending"/>
                      <div class="node leaf-node">
                        <span class="icon">✍️</span>
                        <span class="node-title">
                          <a href="{sitemap:loc}">
                            <span class="post-title-formatter" data-url="{sitemap:loc}">
                              <xsl:value-of select="sitemap:loc"/>
                            </span>
                          </a>
                        </span>
                        <span class="meta-info">Updated: <xsl:value-of select="sitemap:lastmod"/></span>
                      </div>
                    </xsl:for-each>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="footer">
            Generated via Eleventy. Designed for search engines and humans. Akshat Singh © 2026.
          </div>
        </div>

        <script type="text/javascript">
          //<![CDATA[
          document.addEventListener('DOMContentLoaded', () => {
            // Bind click event programmatically
            const branch = document.getElementById('posts-branch');
            const clickable = branch ? branch.querySelector('.clickable') : null;
            
            if (clickable) {
              clickable.addEventListener('click', () => {
                const arrow = branch.querySelector('.arrow');
                const content = branch.querySelector('.collapsible-content');
                
                if (branch.classList.contains('collapsed')) {
                  branch.classList.remove('collapsed');
                  arrow.textContent = '▼';
                  content.style.maxHeight = '2000px';
                } else {
                  branch.classList.add('collapsed');
                  arrow.textContent = '▶';
                  content.style.maxHeight = '0';
                }
              });
            }

            // Format core page titles
            document.querySelectorAll('.core-title').forEach(el => {
              const url = el.getAttribute('data-url');
              let clean = url.replace('https://infamous-lucifer.github.io/writing-portfolio/', '');
              if (clean.endsWith('/')) clean = clean.slice(0, -1);
              
              if (clean === 'about') el.textContent = 'About';
              else if (clean === 'work') el.textContent = 'Work \u0026 Case Studies';
              else if (clean === 'writing') el.textContent = 'Writing Hub';
              else if (clean === 'privacy') el.textContent = 'Privacy Policy';
              else if (clean === 'terms') el.textContent = 'Terms of Service';
              else el.textContent = clean || 'Home';
            });

            // Format post slug names to clean readable title cases
            document.querySelectorAll('.post-title-formatter').forEach(el => {
              const url = el.getAttribute('data-url');
              let parts = url.split('/posts/');
              if (parts.length > 1) {
                let slug = parts[1];
                if (slug.endsWith('/')) slug = slug.slice(0, -1);
                
                let title = slug.split('-')
                  .map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  })
                  .join(' ');
                el.textContent = title;
              }
            });
          });
          //]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
