const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'public/js/src/index.js'),
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: "bundle.js"
    },
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            "fs": false,
            "net": false,
            "async_hooks": false
        }
    }
}