import fs from "node:fs"
import path from "path"
import { addAsset, CWD } from "./plugin-util.cjs"
import minifyHtml from "../compile/minify-html.js"
import minifyJs from "../compile/minify-js.js"

const resourcesPath = path.join(CWD, "resources")
const publicPath = path.join(CWD, "public")

const swFilename = "service-worker.js"
const swPath = path.join(resourcesPath, swFilename)

const SW_FILES_MARKER = '"@@SW_FILES_MARKER@@"'

const injectSw = (compilation) =>
  fs.promises.readFile(swPath).then(async (swContent) => {
    const swAssets = Object.keys(compilation.assets)
    await fs.promises.readdir(publicPath, { recursive: true }).then((dir) => {
      const swFiles = [...swAssets, ...dir.map((item) => item.replaceAll(path.sep, "/"))]
      const swInject = `"${swFiles.join('", "')}"`
      const content = swContent.toString().replaceAll(SW_FILES_MARKER, swInject)
      addAsset(compilation, swFilename, content)
    })
  })

const minifyAssets = (compilation) =>
  Object.keys(compilation.assets).forEach(async (assetName) => {
    if (assetName.endsWith(".html")) {
      const content = compilation.assets[assetName].source()
      await minifyHtml(content).then((minified) => {
        addAsset(compilation, assetName, minified, {}, true)
      })
    } else if (assetName.endsWith(".js")) {
      const content = compilation.assets[assetName].source()
      const minified = minifyJs(content)
      addAsset(compilation, assetName, minified, {}, true)
    }
  })

export const optimizeAssets = async (compiler, compilation) => {
  await injectSw(compilation)
  minifyAssets(compilation)
}
