module.exports = function(eleventyConfig) {
  // Passthrough for main assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  // Passthrough for static SEO and UI files
  // Note: Only add these if the files actually exist to avoid empty copies
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Ignore repo/meta files
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("PORTFOLIO_AUDIT.md");
  eleventyConfig.ignores.add("QA_AUDIT_REPORT.md");
  eleventyConfig.ignores.add("issue-verification-report.md");
  eleventyConfig.ignores.add("DEPLOYMENT_LOG.md");
  eleventyConfig.ignores.add("LICENSE");
  eleventyConfig.ignores.add("scripts/**");
  eleventyConfig.ignores.add(".github/**");

  // Custom filter for clean excerpts
  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, 160).replace(/\r?\n|\r/g, " ").trim() + "...";
  });

  // Create a collection for blog posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").sort((a, b) => b.date - a.date);
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