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

const touch = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

const copyPublicDir = (source, target) => {
  fs.promises.readdir(source, { recursive: true }).then((dir) =>
    dir
      .filter((item) => !item.endsWith(".html"))
      .map((file) => {
        const sourcePath = path.join(source, file)
        const targetPath = path.join(target, file)
        /*
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
        */
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

const touchBuildDirs = () => {
  const assetsPath = path.join(distPath, "assets")
  const paths = [
    assetsPath,
    path.join(assetsPath, "js"),
    path.join(assetsPath, "css"),
    path.join(assetsPath, "media"),
    path.join(assetsPath, "media", "fonts"),
    path.join(assetsPath, "media", "images"),
    path.join(assetsPath, "media", "icons"),
  ]
  paths.forEach((path) => {
    touch(path)
  })
}

export const build = () => {
  buildWebpack(() => {
    touchBuildDirs()
    copyPublicDir(publicPath, distPath)
  })
}
