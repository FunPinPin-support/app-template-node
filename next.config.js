const { parsed: localEnv } = require("dotenv").config();
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

module.exports = {
  webpack: (config, { dev, isServer }) => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    // Add ESM support for .mjs files in webpack 4
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    if (!dev) {
      config.optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              ecma: 6,
              warnings: false,
              output: {
                comments: false,
              },
              compress: {
                drop_console: true, // remove console
              },
              ie8: false,
            },
          }),
          new CssMinimizerPlugin({
            parallel: true,
          }),
        ],
      };
      config.module.rules.push({
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"),
        options: {
          workerParallelJobs: 50,
          // additional node.js arguments
          workerNodeArgs: ["--max-old-space-size=1024"],
        },
        loader: "thread-loader",
      });
      config.devtool = isServer ? false : "source-map";
    }
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
