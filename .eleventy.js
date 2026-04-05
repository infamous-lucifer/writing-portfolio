module.exports = function(eleventyConfig) {
  // Passthrough for main assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  
  // Passthrough for static SEO and UI files
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("404.html");

  // Create a collection for Medium posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md");
  });

  return {
    pathPrefix: "/writing-portfolio/",
    dir: {
      input: ".",
      hide: true, // Hide internal folders
      output: "_site"
    }
  };
};