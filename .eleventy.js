module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/styles");
    eleventyConfig.addPassthroughCopy("src/test.css");
};