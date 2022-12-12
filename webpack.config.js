const path = require("path");

module.exports = {
    output: {
        filename: "indoorgraphs.js",
        path: path.resolve(__dirname, "dist"),
        library: 'IndoorGraphs',
        libraryTarget: "commonjs-module"
    }
}