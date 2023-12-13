module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/_styles");
    eleventyConfig.addPassthroughCopy("src/test.css");
};