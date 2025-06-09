import path from "path"
import fs from "node:fs"
import minifyHtml from "./compile/minify-html.js"
import minifyJs from "./compile/minify-js.js"

const CWD = process.cwd()

const MARKER_STYLE_TAG_END = "</head>"

const getAsset = ({ asset, nextSource, nextSize, nextInfo }) => {
  const map = asset ? asset.map() : null
  return {
    source: () => nextSource,
    map: () => map,
    sourceAndMap: () => ({
      source: nextSource,
      map,
    }),
    size: () => nextSize,
    info: nextInfo,
  }
}

const stylePaths = [
  path.join(CWD, "resources", "theme.css"),
  path.join(CWD, "resources", "base.css"),
  path.join(CWD, "resources", "simple.css"),
  path.join(CWD, "project", "index.css"),
]

export const processViews = async (compiler, compilation) => {
  const sourcePath = path.join(CWD, "public", "index.html")
  const assetName = "index.html"
  const nextSource = (
    await fs.promises.readFile(sourcePath).then((buffer) => {
      const content = buffer.toString()
      const split = content.split(MARKER_STYLE_TAG_END)
      const headOld = split[0]

      const description = "All inclusive web framework with zero configuration, batteries included!"
      const styles = stylePaths.map((stylePath) => fs.readFileSync(stylePath).toString()).join(" ")

      const headNext = `${headOld}<meta name="description" content="${description}"><style>${styles}</style>`
      return split.map((part, i) => (i === 0 ? headNext : part)).join(MARKER_STYLE_TAG_END)
    })
  ).toString()

  compilation.assets[assetName] = getAsset({
    nextSource,
    nextInfo: { optimized: false },
    nextSize: nextSource.length,
  })
}

const injectSw = (compilation) =>
  fs.promises.readFile(path.join(CWD, "resources", "service-worker.js")).then(async (swContent) => {
    const swAssets = Object.keys(compilation.assets)
    await fs.promises.readdir(path.join(CWD, "public"), { recursive: true }).then((dir) => {
      const swFiles = [...swAssets, ...dir.map((item) => item.replaceAll(path.sep, "/"))]
      const swInject = `"${swFiles.join('", "')}"`
      const content = swContent.toString().replaceAll('"@@SW_FILES_MARKER@@"', swInject)
      compilation.assets["service-worker.js"] = getAsset({
        nextSource: content,
        nextSize: content.length,
        nextInfo: {},
      })
    })
  })

const minifyAssets = (compilation) =>
  Object.keys(compilation.assets).forEach(async (assetName) => {
    if (assetName.endsWith(".html")) {
      const content = compilation.assets[assetName].source()
      await minifyHtml(content).then((minified) => {
        compilation.assets[assetName] = getAsset({
          ...compilation.assets[assetName],
          nextSource: minified,
          nextSize: minified.length,
        })
      })
    } else if (assetName.endsWith(".js")) {
      const content = compilation.assets[assetName].source()
      const minified = minifyJs(content)
      compilation.assets[assetName] = getAsset({
        ...compilation.assets[assetName],
        nextSource: minified,
        nextSize: minified.length,
      })
    }
  })

export const optimizeAssets = async (compiler, compilation) => {
  await injectSw(compilation)
  minifyAssets(compilation)
}
