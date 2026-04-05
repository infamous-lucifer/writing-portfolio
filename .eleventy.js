module.exports = function(eleventyConfig) {
  // Passthrough for main assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  
  // Passthrough for 3D Immersive Landing Page components
  eleventyConfig.addPassthroughCopy("active-theory-vibe/src");
  eleventyConfig.addPassthroughCopy("active-theory-vibe/public");
  
  // Passthrough for static SEO and UI files
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("404.html");

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};