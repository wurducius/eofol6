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

export const processViews = async (compiler, compilation) => {
  const sourcePath = path.join(CWD, "public", "index.html")
  const assetName = "index.html"
  const nextSource = (
    await fs.promises.readFile(sourcePath).then((buffer) => {
      const content = buffer.toString()
      const split = content.split(MARKER_STYLE_TAG_END)
      const headOld = split[0]

      const description = "All inclusive web framework with zero configuration, batteries included!"
      const stylesBase = fs.readFileSync(path.join(CWD, "resources", "base.css")).toString()
      const stylesSimple = fs.readFileSync(path.join(CWD, "resources", "simple.css")).toString()
      const stylesView = fs.readFileSync(path.join(CWD, "project", "index.css")).toString()
      const styles = [stylesBase, stylesSimple, stylesView].join(" ")

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

export const optimizeAssets = async (compiler, compilation) => {
  Object.keys(compilation.assets).forEach((assetName) => {
    if (assetName.endsWith(".html")) {
      const content = compilation.assets[assetName].source()
      minifyHtml(content).then((minified) => {
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
}
