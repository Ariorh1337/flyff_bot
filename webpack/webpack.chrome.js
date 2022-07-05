const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CopyPlugin = require('copy-webpack-plugin');

const chrome = {
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: "chrome.json",
                to: "manifest.json",
                context: "manifest"
            }]
        }),
    ]
};

module.exports = merge(common, chrome);
