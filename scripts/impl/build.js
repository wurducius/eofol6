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

const touch = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

const copyPublicDir = (source, target) => {
  fs.promises.readdir(source, { recursive: true }).then((dir) =>
    dir.map((file) => {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)
      if (file.endsWith("html") || fs.lstatSync(path.join(source, file)).isDirectory()) {
        return
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

const touchBuildDirs = () => {
  const assetsPath = path.join(distPath, "assets")
  const mediaPath = path.join(assetsPath, "media")
  const paths = [
    assetsPath,
    path.join(assetsPath, "js"),
    path.join(assetsPath, "css"),
    path.join(mediaPath),
    path.join(mediaPath, "fonts"),
    path.join(mediaPath, "images"),
    path.join(mediaPath, "icons"),
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
