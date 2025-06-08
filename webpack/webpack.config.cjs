const path = require("path")
const BundleAnalyzerPluginImport = require("webpack-bundle-analyzer")
const EofolPluginImport = require("./eofol-webpack-plugin.cjs")

const EofolPlugin = EofolPluginImport.default
const BundleAnalyzerPlugin = BundleAnalyzerPluginImport.BundleAnalyzerPlugin

const CWD = process.cwd()

const buildOptionsDefault = {
  mode: "development",
  analyze: false,
  sourceMap: true,
  projectPath: "./project",
  entryFilename: "index.ts",
  outputBundleFilename: "main.js",
  distDirname: "dist",
}

module.exports.default = (args) => {
  const buildOptions = { ...buildOptionsDefault, ...(args ?? {}) }

  return {
    mode: buildOptions.mode,
    entry: `${buildOptions.projectPath}/${buildOptions.entryFilename}`,
    output: {
      filename: "[name].js",
      path: path.join(CWD, buildOptions.distDirname),
    },
    plugins: [new EofolPlugin(), buildOptions.analyze && new BundleAnalyzerPlugin()].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    devtool: buildOptions.sourceMap ? "source-map" : false,
  }
}
