import fs from "node:fs"
import path from "path"
import webpack from "webpack"
import getWebpackConfigImport from "../../webpack/webpack.config.cjs"

const getWebpackConfig = getWebpackConfigImport.default

const productionOptions = { mode: "production", sourceMap: false }

const webpackConfig = getWebpackConfig(productionOptions)

const CWD = process.cwd()

const publicPath = path.join(CWD, "public")
const distPath = path.join(CWD, "dist")

const MARKER_STYLE_TAG_END = "</head>"

const copyPublicDir = (source, target) => {
  fs.promises.readdir(source, { recursive: true }).then((dir) =>
    dir.map((file) => {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)

      if (file === "index.html") {
        return fs.promises.readFile(sourcePath).then((buffer) => {
          const content = buffer.toString()
          const split = content.split(MARKER_STYLE_TAG_END)
          const headOld = split[0]

          const description = "All inclusive web framework with zero configuration, batteries included!"
          const stylesBase = fs.readFileSync(path.join(CWD, "resources", "base.css")).toString()
          const stylesView = fs.readFileSync(path.join(CWD, "project", "index.css")).toString()
          const styles = stylesBase + " " + stylesView

          const headNext = headOld + `<meta name="description" content="${description}"><style>${styles}</style>`
          const injected = split.map((part, i) => (i === 0 ? headNext : part)).join(MARKER_STYLE_TAG_END)
          return fs.promises.writeFile(targetPath, injected)
        })
      } else {
        return fs.promises.cp(sourcePath, targetPath)
      }

      return fs.promises.cp(sourcePath, targetPath)
    }),
  )
}

const buildWebpack = (callback) => {
  return webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(`Webpack error: ${err}`)
    } else {
      console.log(`Project built at ${distPath}`)
    }
    if (callback) {
      callback()
    }
  })
}

export const build = () => {
  buildWebpack(() => {
    copyPublicDir(publicPath, distPath)
  })
}
