const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const config = getDefaultConfig(projectRoot);

module.exports = withUniwindConfig(config, {
    cssEntryFile: './global.css',
    polyfills: { rem: 16 }
});
