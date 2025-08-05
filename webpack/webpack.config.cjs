const path = require("path")
const fs = require("fs")
const BundleAnalyzerPluginImport = require("webpack-bundle-analyzer")
const EofolPluginImport = require("./eofol-webpack-plugin.cjs")
const Dotenv = require("dotenv-webpack")
const WebpackCssInlinePlugin = require("webpack-css-inline").default
const { stylesPath } = require("./plugin/plugin-util.cjs")
const { ERROR_OVERLAY_ENABLED } = require("../constants.js")

const EofolPlugin = EofolPluginImport.default
const BundleAnalyzerPlugin = BundleAnalyzerPluginImport.BundleAnalyzerPlugin

const baseStylePaths = [
  path.join(stylesPath, "theme.css"),
  path.join(stylesPath, "base.css"),
  path.join(stylesPath, "simple.css"),
  ERROR_OVERLAY_ENABLED && path.join(stylesPath, "error-overlay.css"),
].filter(Boolean)

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

const views = ["index"]
const viewStyles = [
  ...baseStylePaths,
  ...views.map((view) => {
    const customStylePath = path.join(CWD, "project", `${view}.css`)
    return fs.existsSync(customStylePath) ? customStylePath : undefined
  }),
].filter(Boolean)

module.exports.default = (args) => {
  const buildOptions = { ...buildOptionsDefault, ...(args ?? {}) }

  return {
    mode: buildOptions.mode,
    entry: `${buildOptions.projectPath}/${buildOptions.entryFilename}`,
    output: {
      filename: "assets/js/[name].js",
      path: path.join(CWD, buildOptions.distDirname),
      publicPath: undefined,
    },
    plugins: [
      new EofolPlugin(),
      buildOptions.analyze && new BundleAnalyzerPlugin(),
      new Dotenv(),
      new WebpackCssInlinePlugin({
        index: viewStyles,
      }),
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
