const path = require("path")
const fs = require("node:fs")
const { addAsset, publicPath, projectPath, stylesPath } = require("./plugin-util.cjs")
const injectFonts = require("../compile/inject-fonts.cjs")

const MARKER_STYLE_TAG_END = "</head>"

const stylePaths = [
  path.join(stylesPath, "theme.css"),
  path.join(stylesPath, "base.css"),
  path.join(stylesPath, "simple.css"),
]

const getViewPath = (view) => path.join(publicPath, `${view}.html`)
const getStylesheetPath = (view) => path.join(projectPath, `${view}.css`)

const processViews = async (compiler, compilation) => {
  const views = (await fs.promises.readdir(publicPath, { recursive: true }))
    .filter((filename) => filename.endsWith(".html"))
    .map((filename) => filename.substring(0, filename.lastIndexOf(".")) || filename)
  await Promise.all(
    views.map(async (view) => {
      const assetName = `${view}.html`
      const nextSource = (
        await fs.promises.readFile(getViewPath(view)).then((buffer) => {
          const content = buffer.toString()
          const split = content.split(MARKER_STYLE_TAG_END)
          const headOld = split[0]

          const description = "All inclusive web framework with zero configuration, batteries included!"
          const customStylesheetPath = getStylesheetPath(view)
          const styles = (fs.existsSync(customStylesheetPath) ? [...stylePaths, customStylesheetPath] : stylePaths)
            .map((stylePath) => fs.readFileSync(stylePath).toString())
            .join(" ")

          return injectFonts({
            path: "Roboto-Regular.woff2",
            fontFamily: "Roboto",
            fontFamilyFallback: "sans-serif",
            format: "woff2",
            isInline: false,
            fontStyle: "normal",
            fontWeight: 400,
            fontDisplay: "swap",
          }).then((fontFace) => {
            const headNext = `${headOld}<meta name="description" content="${description}"><style>${fontFace} ${styles}</style>`
            return split.map((part, i) => (i === 0 ? headNext : part)).join(MARKER_STYLE_TAG_END)
          })
        })
      ).toString()

      addAsset(compilation, assetName, nextSource, { optimized: false })
    }),
  )
}

module.exports = { processViews }
