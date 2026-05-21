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
            max-width: 900px;
            margin: 0 auto;
          }
          
          .header {
            margin-bottom: 40px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
          }
          
          h1 {
            font-size: 36px;
            font-weight: 700;
            margin: 0 0 12px 0;
            letter-spacing: -0.03em;
            background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          
          a {
            color: var(--acc);
            text-decoration: none;
            transition: color 0.15s ease, opacity 0.15s ease;
          }
          
          a:hover {
            opacity: 0.85;
            text-decoration: underline;
          }
          
          .table-container {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          
          th {
            background-color: rgba(255, 255, 255, 0.015);
            border-bottom: 1px solid var(--border);
            padding: 18px 24px;
            font-weight: 600;
            color: var(--txt);
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.12em;
          }
          
          td {
            padding: 16px 24px;
            border-bottom: 1px solid var(--border);
            word-break: break-all;
          }
          
          tr:last-child td {
            border-bottom: none;
          }
          
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.01);
          }
          
          .lbl-tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: var(--acc-dim);
            color: var(--acc);
          }
          
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: var(--txt-mute);
            letter-spacing: 0.02em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>XML Sitemap</h1>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th width="65%">URL Location</th>
                  <th width="15%">Frequency</th>
                  <th width="20%">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:sort select="sitemap:lastmod" order="descending"/>
                  <tr>
                    <td>
                      <a href="{sitemap:loc}" target="_blank">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="lbl-tag">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <div class="footer">
            Generated automatically via Eleventy engine. Akshat Singh Portfolio © 2026.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
