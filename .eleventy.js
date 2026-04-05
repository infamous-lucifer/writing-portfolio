module.exports = function(eleventyConfig) {
  // Passthrough for main assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  
  // Passthrough for static SEO and UI files
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("404.html");

  return {
    pathPrefix: "/writing-portfolio/",
    dir: {
      input: ".",
      output: "_site"
    }
  };
};