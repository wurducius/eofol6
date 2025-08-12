const path = require("path")
const fs = require("node:fs")
const BundleAnalyzerPluginImport = require("webpack-bundle-analyzer")
const EofolPluginImport = require("./eofol-webpack-plugin.cjs")
const EofolWebpackPlugin = require("eofol-webpack-plugin").default
const Dotenv = require("dotenv-webpack")
const { stylesPath } = require("./plugin-util.cjs")
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

const getViewStyles = (view) => {
  const customStylePath = path.join(CWD, "project", `${view}.css`)
  return fs.existsSync(customStylePath) ? customStylePath : undefined
}

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
      new EofolWebpackPlugin({
        html: {
          template: ["index.html", "nested1/index.html"],
          header: {
            title: "Eofol6",
            description: "All inclusive web framework with zero configuration, batteries included!",
            keywords: "Web framework",
            imageSrc: "./assets/media/images/logo.png",
            imageType: "image/png",
            imageAlt: "Eofol6 logo",
            url: "https://eofol.com/eofol6/",
            theme: "#000000",
          },
        },
        css: {
          shared: baseStylePaths,
          views: {
            index: getViewStyles("index"),
            "nested1/index": getViewStyles("nested1/index"),
          },
        },
        font: {
          path: "resources/Roboto-Regular.woff2",
          fontFamily: "Roboto",
          fontFamilyFallback: "sans-serif",
          format: "woff2",
          inline: false,
          fontStyle: "normal",
          fontWeight: 400,
          fontDisplay: "swap",
        },
        js: {
          views: { index: "assets/js/main.js", "nested1/index": "assets/js/main.js" },
          inline: true,
          babelify: true,
        },
        inject: {
          add: {
            "assets/media/images/logo.png": "public/assets/media/images/logo.png",
            "assets/media/images/logo-lg.png": "public/assets/media/images/logo-lg.png",
            "assets/media/images/logo-md.png": "public/assets/media/images/logo-md.png",
            "assets/media/images/logo-sm.png": "public/assets/media/images/logo-sm.png",
            "assets/media/icons/phi.svg": "public/assets/media/icons/phi.svg",
          },
        },
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
