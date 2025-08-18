const path = require("path")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const EofolPlugin = require("./eofol-webpack-plugin.cjs").default
const EofolWebpackPlugin = require("eofol-webpack-plugin").default
const Dotenv = require("dotenv-webpack")
const eofolWebpackPluginOptions = require("./eofol-webpack-plugin-options.cjs")

const CWD = process.cwd()

const buildOptionsDefault = {
  mode: "development",
  analyze: false,
  sourceMap: true,
  projectPath: "./project",
  entryFilename: "index.tsx",
  outputBundleFilename: "main.js",
  distDirname: "dist",
}

module.exports.default = (args) => {
  const buildOptions = { ...buildOptionsDefault, ...(args ?? {}) }

  return {
    mode: buildOptions.mode,
    entry: `${buildOptions.projectPath}/${buildOptions.entryFilename}`,
    output: {
      filename: "assets/js/[name].js",
      path: path.join(CWD, buildOptions.distDirname),
      publicPath: "/",
    },
    plugins: [
      new EofolPlugin(),
      buildOptions.analyze && new BundleAnalyzerPlugin(),
      new Dotenv(),
      new EofolWebpackPlugin(eofolWebpackPluginOptions),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.([cm]?ts|tsx)$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    devtool: buildOptions.sourceMap ? "source-map" : false,
    infrastructureLogging: {
      appendOnly: true,
      level: "error",
    },
    stats: "none",
    devServer: {
      host: "0.0.0.0",
    },
  }
}
