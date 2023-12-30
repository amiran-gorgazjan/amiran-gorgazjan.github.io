const { exec } = require("child_process");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    eleventyConfig.on('eleventy.before', async ({ dir, runMode, outputMode }) => {
        await exec('bun run build-terminal', { stdio: 'inherit' });
    });

    eleventyConfig.addWatchTarget("./src/");
    eleventyConfig.addPassthroughCopy("src/styles");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/tests");
    eleventyConfig.addPassthroughCopy("src/modules/**/*.{wav,mp3,ogg}");
    eleventyConfig.addPassthroughCopy({
        './sideprojects/molecular-dynamics-js/public/': 'sideprojects/molecular-dynamics-js',
    });
    eleventyConfig.addPassthroughCopy({
        './sideprojects/predator-prey': 'sideprojects/predator-prey',
    });
    // eleventyConfig.addPassthroughCopy("build");
    eleventyConfig.addPlugin(syntaxHighlight);

    return {
        markdownTemplateEngine: "njk",
    }
};