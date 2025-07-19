import { addAsset } from "./plugin-util.cjs"
import minifyHtml from "../compile/minify-html.js"
import minifyJs from "../compile/minify-js.js"
import { injectSw } from "../compile/inject-sw.js"

const processAsset = (compilation) => async (assetName, transform) => {
  const content = compilation.assets[assetName].source()
  const processed = transform !== undefined ? await transform(content) : content
  addAsset(compilation, assetName, processed, {}, true)
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

export const optimizeAssets = async (compiler, compilation) => {
  await injectSw(compilation)
  minifyAssets(compilation)
}
