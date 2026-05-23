const Image = require("@11ty/eleventy-img");
const { rssPlugin } = require("@11ty/eleventy-plugin-rss");
const cheerio = require("cheerio");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addTransform("optimize-images", async function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      const $ = cheerio.load(content);
      const images = $("img");
      let modified = false;

      for (let i = 0; i < images.length; i++) {
        const img = $(images[i]);
        let src = img.attr("src");
        const alt = img.attr("alt") || "";
        const cls = img.attr("class") || "";

        // Only process local images
        if (src && !src.startsWith("http") && !src.startsWith("data:")) {
          let fileSrc = src;
          if (fileSrc.startsWith("/writing-portfolio/")) {
            fileSrc = fileSrc.replace("/writing-portfolio/", "./");
          } else if (fileSrc.startsWith("/")) {
             fileSrc = "." + fileSrc;
          }

          try {
            let metadata = await Image(fileSrc, {
              widths: [400, 800, 1200],
              formats: ["avif", "webp", "jpeg"],
              outputDir: "./_site/img/",
              urlPath: "/writing-portfolio/img/"
            });

            let imageAttributes = {
              alt,
              sizes: "(max-width: 800px) 100vw, 800px",
              loading: "lazy",
              decoding: "async",
            };
            if (cls) {
               imageAttributes.class = cls;
            }

            let html = Image.generateHTML(metadata, imageAttributes);
            img.replaceWith(html);
            modified = true;
          } catch (e) {
            console.error("Error optimizing image", fileSrc, e);
          }
        }
      }

      if (modified) {
        return $.html();
      }
    }
    return content;
  });
  // Passthrough for main assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  // Passthrough for static SEO and UI files
  // Note: Only add these if the files actually exist to avoid empty copies
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xsl");
  eleventyConfig.addPassthroughCopy("admin");

  // Ignore repo/meta files
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("PORTFOLIO_AUDIT.md");
  eleventyConfig.ignores.add("QA_AUDIT_REPORT.md");
  eleventyConfig.ignores.add("issue-verification-report.md");
  eleventyConfig.ignores.add("DEPLOYMENT_LOG.md");
  eleventyConfig.ignores.add("LICENSE");
  eleventyConfig.ignores.add("scripts/**");
  eleventyConfig.ignores.add(".github/**");
  eleventyConfig.ignores.add("posts_trash/**");

  // Custom filter for clean excerpts
  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, 160).replace(/\r?\n|\r/g, " ").trim() + "...";
  });

  // Custom filter for reading time
  eleventyConfig.addFilter("readingTime", (text) => {
    if (!text) return "1 min read";
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 225); // 225 words per minute
    return readingTime + " min read";
  });

  // Create a collection for blog posts (excluding drafts)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").filter(item => !item.data.draft).sort((a, b) => b.date - a.date);
  });

  return {
    pathPrefix: "/writing-portfolio/",
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};