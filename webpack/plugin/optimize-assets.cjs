const { addAsset } = require("./plugin-util.cjs")
const minifyHtml = require("../compile/minify-html.cjs")
const minifyJs = require("../compile/minify-js.cjs")
const injectSw = require("../compile/inject-sw.cjs")

const processAsset = (compilation) => async (assetName, transform) => {
  if (!compilation.assets[assetName]?.info?.optimized) {
    const content = compilation.assets[assetName].source()
    const processed = transform !== undefined ? await transform(content) : content
    addAsset(compilation, assetName, processed, { ...compilation.assets[assetName].info, optimized: true }, true)
  }
}

const minifyAssets = (compilation) => {
  const processAssetImpl = processAsset(compilation)
  return Promise.all(
    Object.keys(compilation.assets).map((assetName) => {
      if (assetName.endsWith(".html")) {
        return processAssetImpl(assetName, minifyHtml)
      } else if (assetName.endsWith(".js")) {
        return processAssetImpl(assetName, minifyJs)
      }
    }),
  )
}

const optimizeAssets = async (compiler, compilation) => {
  await injectSw(compilation)
  minifyAssets(compilation)
}

module.exports = { optimizeAssets }
