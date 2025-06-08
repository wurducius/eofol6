import path from "path"
import fs from "node:fs"

export const eofolCompile = async (compiler, compilation) => {}

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

const CWD = process.cwd()

// eslint-disable-next-line no-unused-vars
export const processViews = async (compiler, compilation) => {
  const sourcePath = path.join(CWD, "public", "index.html")
  const MARKER_STYLE_TAG_END = "</head>"

  fs.promises.readFile(sourcePath).then((buffer) => {
    const content = buffer.toString()
    const split = content.split(MARKER_STYLE_TAG_END)
    const headOld = split[0]

    const description = "All inclusive web framework with zero configuration, batteries included!"
    const stylesBase = fs.readFileSync(path.join(CWD, "resources", "base.css")).toString()
    const stylesView = fs.readFileSync(path.join(CWD, "project", "index.css")).toString()
    const styles = stylesBase + " " + stylesView

    const headNext = headOld + `<description>${description}</description><style>${styles}</style>`
    return split.map((part, i) => (i === 0 ? headNext : part)).join(MARKER_STYLE_TAG_END)
  })

  const assetName = "index.html"
  const nextSource = (
    await fs.promises.readFile(sourcePath).then((buffer) => {
      const content = buffer.toString()
      const split = content.split(MARKER_STYLE_TAG_END)
      const headOld = split[0]

      const description = "All inclusive web framework with zero configuration, batteries included!"
      const stylesBase = fs.readFileSync(path.join(CWD, "resources", "base.css")).toString()
      const stylesView = fs.readFileSync(path.join(CWD, "project", "index.css")).toString()
      const styles = stylesBase + " " + stylesView

      const headNext = headOld + `<meta name="description" content="${description}"><style>${styles}</style>`
      return split.map((part, i) => (i === 0 ? headNext : part)).join(MARKER_STYLE_TAG_END)
    })
  ).toString()

  compilation.assets[assetName] = getAsset({
    nextSource,
    nextInfo: { optimized: false },
    nextSize: nextSource.length,
  })
}
