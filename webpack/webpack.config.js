const path = require("path")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const EofolPlugin = require("./eofol-webpack-plugin")

const CWD = process.cwd()

const buildOptionsDefault = {
  mode: "development",
  analyze: false,
  projectPath: "./project",
  entryFilename: "index.js",
  outputBundleFilename: "main.js",
  distDirname: "dist",
}

module.exports = (args) => {
  const buildOptions = { ...buildOptionsDefault, ...(args ?? {}) }
  return {
    mode: buildOptions.mode,
    entry: `${buildOptions.projectPath}/${buildOptions.entryFilename}`,
    output: {
      filename: buildOptions.outputBundleFilename,
      path: path.join(CWD, buildOptions.distDirname),
    },
    plugins: [new EofolPlugin(), buildOptions.analyze && new BundleAnalyzerPlugin()].filter(Boolean),
  }
}
