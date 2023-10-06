const webpack = require("webpack");

module.exports = function override (config, env) {
    console.log('Override webpack config');
    let loaders = config.resolve;
    loaders.fallback = {
        "process": false, // require.resolve("process/browser"),
        "fs": false,
        "crypto": false,
        "stream": false,
        "http": false,
        "https": false,
        "zlib": false,
        "url": false,
        buffer: require.resolve("buffer"),
    };
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ];
    
    return config;
}
